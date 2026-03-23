"""
Blindspot — FastAPI Backend
POST /api/check-blindspot
"""

import json
import os
import re
import fitz # PyMuPDF
from typing import Literal

import google.generativeai as genai
from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from prompt import build_prompt

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
if not GEMINI_API_KEY:
    print("⚠️  WARNING: GEMINI_API_KEY not set. Set it in .env before use.")

genai.configure(api_key=GEMINI_API_KEY)

app = FastAPI(title="Blindspot API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB


class BlindspotError(BaseModel):
    type: str
    description: str


class BlindspotResponse(BaseModel):
    errors: list[BlindspotError]


def extract_json(raw: str) -> dict:
    """Strip markdown fences if the model wrapped JSON in them."""
    raw = raw.strip()
    # Remove ```json ... ``` or ``` ... ```
    raw = re.sub(r"^```(?:json)?\s*", "", raw, flags=re.IGNORECASE)
    raw = re.sub(r"\s*```$", "", raw)
    return json.loads(raw)


@app.get("/health")
async def health():
    return {"status": "ok", "model": "gemini-2.5-flash"}


@app.post("/api/check-blindspot", response_model=BlindspotResponse)
async def check_blindspot(
    rubric: UploadFile = File(..., description="Rubric or assignment prompt PDF"),
    student_work: UploadFile = File(..., description="Student's assignment PDF"),
    strictness: Literal["chill", "standard", "strict"] = Form("standard"),
):
    # ── Validate content types ─────────────────────────────────────────────
    for f in [rubric, student_work]:
        if f.content_type not in ("application/pdf", "application/octet-stream"):
            raise HTTPException(
                status_code=400,
                detail=f"File '{f.filename}' must be a PDF (got {f.content_type}).",
            )

    # ── Read file bytes ────────────────────────────────────────────────────
    rubric_bytes = await rubric.read()
    work_bytes = await student_work.read()

    if len(rubric_bytes) > MAX_FILE_SIZE or len(work_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File exceeds 50 MB limit.")

    if len(rubric_bytes) == 0 or len(work_bytes) == 0:
        raise HTTPException(status_code=400, detail="One or both files are empty.")

    # ── Build prompt ───────────────────────────────────────────────────────
    system_prompt = build_prompt(strictness)

    # ── Call Gemini 2.5 Flash ──────────────────────────────────────────────
    try:
        # Extract Text locally (Optimized with early-exit truncation)
        doc_rubric = fitz.open(stream=rubric_bytes, filetype="pdf")
        if doc_rubric.is_encrypted:
            raise Exception("encrypted PDF")
        rubric_text = ""
        for page in doc_rubric:
            rubric_text += page.get_text() + "\n"
            if len(rubric_text) > 30000:
                rubric_text = rubric_text[:30000] + "\n...[TRUNCATED]"
                break
        doc_rubric.close()

        doc_work = fitz.open(stream=work_bytes, filetype="pdf")
        if doc_work.is_encrypted:
            raise Exception("encrypted PDF")
        work_text = ""
        for page in doc_work:
            work_text += page.get_text() + "\n"
            if len(work_text) > 150000:
                work_text = work_text[:150000] + "\n...[TRUNCATED]"
                break
        doc_work.close()

        model = genai.GenerativeModel(
            model_name="gemini-2.5-flash",
            system_instruction=system_prompt,
        )

        user_message = (
            "DOCUMENT 1 — RUBRIC/PROMPT:\n"
            f"{rubric_text}\n\n"
            "DOCUMENT 2 — STUDENT WORK:\n"
            f"{work_text}\n\n"
            "Analyze the student work against the rubric. Return ONLY the JSON object as instructed."
        )

        response = model.generate_content(
            user_message,
            generation_config=genai.GenerationConfig(
                temperature=0.1,
                response_mime_type="application/json",
            ),
            request_options={"timeout": 45.0} # Guaranteed sub-60s fallback
        )

        raw_text = response.text
        parsed = extract_json(raw_text)

        errors = parsed.get("errors", [])
        # Validate and normalise each error entry
        normalised = []
        for item in errors:
            normalised.append(
                BlindspotError(
                    type=str(item.get("type", "other")),
                    description=str(item.get("description", "Unknown issue.")),
                )
            )

        return BlindspotResponse(errors=normalised)

    except json.JSONDecodeError as exc:
        # Model returned non-JSON — surface as a graceful error card
        return BlindspotResponse(
            errors=[
                BlindspotError(
                    type="api_error",
                    description=(
                        "The AI returned an unexpected response format. "
                        "Please try again — this is usually transient."
                    ),
                )
            ]
        )
    except Exception as exc:
        error_msg = str(exc)
        # Surface key error classes helpfully
        if "API_KEY" in error_msg or "authentication" in error_msg.lower():
            friendly = "Invalid or missing Gemini API key. Check your .env file."
        elif "quota" in error_msg.lower() or "429" in error_msg:
            friendly = "Gemini API rate limit hit. Wait a moment and try again."
        elif "size" in error_msg.lower() or "large" in error_msg.lower():
            friendly = "One of the PDFs is too large for the AI to process. Try a smaller file."
        elif "password" in error_msg.lower() or "encrypt" in error_msg.lower():
            friendly = "This PDF is locked. Print to a standard PDF and drop it back in."
        else:
            friendly = f"AI processing failed: {error_msg[:200]}"

        return BlindspotResponse(
            errors=[BlindspotError(type="api_error", description=friendly)]
        )
