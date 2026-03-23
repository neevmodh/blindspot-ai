<div align="center">
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/React-Dark.svg" width="60" alt="Logo" />
  <h1>Blindspot 👁️</h1>
  <p><strong>A 10-second academic requirement checker built for the Clarity Track Hackathon.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat-square&logo=fastapi" alt="FastAPI" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/AI-Gemini_2.5_Flash-FF6F00?style=flat-square&logo=google" alt="Gemini 2.5 Flash" />
  </p>
</div>

---

## 🎯 The Problem & The Solution

**The Problem:** Students frequently lose minor points on assignments due to overlooked rubric requirements (formatting, missing sections, pedantic citations). Checking a 40-page assignment against a dense academic rubric manually is error-prone.

**The Solution:** **Blindspot** is a high-speed, 3-state web application. Students drop their professor's rubric (PDF) and their assignment (PDF) into the app. Using **Gemini 2.5 Flash Multimodal** AI, the app cross-references both documents in under 10 seconds and outputs a brutal, plain-text "hit-list" of missing requirements. 

It accomplishes this with **Zero-Friction:** No logins, no database saving files, and no complex dashboards. Just drag, drop, and review.

---

## ✂️ The Cut List
To maintain blistering speed and absolute clarity, we actively rejected standard SaaS bloat. Here are 5 things we intentionally removed:
1. **User Authentication**: Removed to guarantee a sub-10-second time-to-value for first-time users. Start checking immediately.
2. **Database Storage**: Removed entirely. Files are processed in volatile memory to ensure absolute student privacy and zero-trust data handling.
3. **Subjective Professor Ratings**: Cut to prevent the tool from becoming a subjective gossip board, maintaining a purely objective, logic-based utility.
4. **Rich-Text Editing**: We do not allow users to fix the essay inside the app. This prevents academic dishonesty and keeps the cognitive load strictly on identification, not resolution.
5. **Extraneous API Routing**: Bypassed standard OCR text extraction (e.g., PyMuPDF) and routed raw PDFs directly to Gemini 2.5 Flash Multimodal to shave 4+ seconds off server latency.

## ⏱️ Timing Notes
*Stopwatch tested: First success achieved from file drop to final hit-list render in exactly **8.4 seconds**.*

## 📝 Microcopy: Before & After
We spent significant time rewriting technical jargon into calm, human-readable states.

| State | Standard App Copy | Blindspot Copy |
|-------|------------------|----------------|
| **API Timeout** | `Error 500: Server Timeout` | `Server is taking a breather. Try dropping the files one more time.` |
| **Encrypted Document** | `Failed to parse document. Error 400.` | `This PDF is locked. Print to a standard PDF and drop it back in.` |
| **Large File Upload** | `Payload Too Large (413)` | `File too large. Compress under 10MB to keep things lightning fast.` |
| **Loading State** | `Loading...` | `Reading rubric...` → `Analyzing formatting...` → `Hunting blindspots...` |

---

## ✨ Features

- **Blazing Fast Multimodal Analysis**: Processes native PDFs directly in memory without slow OCR extraction layers.
- **Strictness Personas**: Select between *Chill T.A.* (major omissions only), *Standard*, or *Tenured Professor* (pedantic requirement extraction).
- **Zero-State Architecture**: A beautifully transitioned 3-state flow (`Idle → Processing → Results`).
- **Privacy-First**: Files are uploaded directly to volatile memory, piped to the LLM, and destroyed immediately. No database is used.
- **"Obsidian Scholar" Design**: A custom Brutalist-Glassmorphic design system utilizing `0px` radii, `backdrop-blur`, deep `#0e0e13` voids, and 3% film grain texturing natively implemented in Tailwind CSS v4.

## 🛡️ Unhappy Paths (Error Recovery)
Designed to fail gracefully and communicate clearly.
- **The Massive File Trap**: Next.js limits files to 10MB client-side. Prevents choking the backend and yields a friendly compression request.
- **The Encrypted PDF Trap**: If a password-protected PDF hits Gemini, FastAPI catches the internal API rejection and instructs the user to print-to-PDF to unlock it.
- **The API Timeout Trap**: If the AI hangs, the React UI uses an `AbortController` bound to a 60-second limit to politely tell the user the server is taking a breather.

## ♿ Accessibility First
Every design decision maximizes utility for all students.
- **Full Keyboard Navigation**: Users can natively `Tab` through both drop zones, cycle strictness layers with arrow keys, and hit `Enter` on the submit CTA without touching a mouse.
- **Global Focus Rings**: High-visibility `focus-visible:ring-2` fuchsia styles applied to all interactive targets.
- **ARIA Live Regions**: Screen readers automatically announce the cycling sub-process states (e.g., "Reading Rubric...", "Analyzing Formatting...") using `aria-live="polite"` visually hidden text.
- **High Contrast**: The `Obsidian Scholar` system utilizes ultra-high contrast text: `#ffffff` strings on `#0e0e13` void easily passes the **WCAG AAA** standard ratio.
- **Massive Target Sizes**: Drop zones (`h-64`) and check buttons (`py-4`) far exceed the WCAG 44x44 pixel target minimums.

---

## 🏗️ System Architecture

Blindspot is decoupled into two lightweight services to separate the heavy UI threading from the Python AI integration.

### Frontend (`/blindspot`)
- **Framework**: Next.js 15 (App Router)
- **State Management**: Custom React Hooks built on a strict state-machine pattern.
- **Styling**: Tailwind CSS v4 + Framer Motion. 
- **Components**: Complex segmented controls, dual-drop zones via `react-dropzone`, and highly polished orbital scan animations.

### Backend (`/blindspot-api`)
- **Framework**: FastAPI (Python)
- **Role**: Sits as a stateless proxy between the frontend and Google API.
- **Engine**: Accepts `multipart/form-data`, constructs raw bytes for the `gemini-2.5-flash` model, seamlessly injects system prompts based on strictness, and coerces the AI to output a strictly validated JSON structure containing the hit-list errors.

---

## 🚀 Getting Started

To run Blindspot locally, you must run both the backend API and the frontend client.

### Prerequisites
- Node.js 18+
- Python 3.9+
- A Google Gemini API Key

### 1. Start the Backend API

1. Navigate to the API directory:
   ```bash
   cd blindspot-api
   ```
2. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure your Environment Variables:
   Create a `.env` file in the API directory and add:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
5. Run the FastAPI development server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   *(The backend runs on `http://127.0.0.1:8000`)*

### 2. Start the Frontend

1. Open a new terminal tab and navigate to the frontend directory:
   ```bash
   # from the root folder
   cd blindspot
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Connect the frontend to the backend:
   Create a `.env` file in the Next.js directory and add:
   ```env
   NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
   ```
4. Start the Next.js development server:
   ```bash
   npm run dev
   ```
5. **Open** [http://localhost:3000](http://localhost:3000) **in your browser!**

---

## 📚 API Specs

The single endpoint orchestrating the magic: `POST /api/check-blindspot`

**Request Payload (`multipart/form-data`):**
- `rubric` (File/PDF): The source of truth.
- `student_work` (File/PDF): The material to evaluate.
- `strictness` (String): `"chill" | "standard" | "strict"`

**Response Schema (`application/json`):**
```json
{
  "errors": [
    {
      "type": "missing_section | formatting_error | citation_error | other",
      "description": "Plain text description of the error found."
    }
  ]
}
```

---

*Built with precision for the Clarity Track Hackathon.*
