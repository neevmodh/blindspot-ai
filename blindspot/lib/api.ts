import { BlindspotResponse, Strictness } from "./types";

export async function submitBlindspot(
  rubric: File,
  studentWork: File,
  strictness: Strictness
): Promise<BlindspotResponse> {
  const formData = new FormData();
  formData.append("rubric", rubric);
  formData.append("student_work", studentWork);
  formData.append("strictness", strictness);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 120000); // Widen to 2 minutes

  let response;
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    response = await fetch(`${API_URL}/api/check-blindspot`, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });
  } catch (error: any) {
    if (error.name === "AbortError") {
      return {
        errors: [{ type: "api_error", description: "Server is taking a breather. Try dropping the files one more time." }]
      };
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  if (response.status === 413) {
    return {
      errors: [
        {
          type: "api_error",
          description:
            "One of your files is too large (50 MB limit). Try compressing the PDF and re-uploading.",
        },
      ],
    };
  }

  if (response.status === 400) {
    const body = await response.json().catch(() => ({}));
    return {
      errors: [
        {
          type: "api_error",
          description:
            body.detail || "Invalid file. Please ensure both uploads are valid PDFs.",
        },
      ],
    };
  }

  if (!response.ok) {
    return {
      errors: [
        {
          type: "api_error",
          description: `Server error (${response.status}). Please check the backend is running and try again.`,
        },
      ],
    };
  }

  return response.json() as Promise<BlindspotResponse>;
}
