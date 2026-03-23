export type Strictness = "chill" | "standard" | "strict";
export type AppState = "idle" | "processing" | "results";

export interface BlindspotError {
  type:
    | "missing_requirement"
    | "formatting_error"
    | "citation_error"
    | "length_error"
    | "structure_error"
    | "api_error"
    | "other";
  description: string;
}

export interface BlindspotResponse {
  errors: BlindspotError[];
}
