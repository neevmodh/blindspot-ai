"use client";

import { useState, useCallback } from "react";
import { AppState, BlindspotError, BlindspotResponse, Strictness } from "@/lib/types";
import { submitBlindspot } from "@/lib/api";

interface BlindspotState {
  rubricFile: File | null;
  workFile: File | null;
  strictness: Strictness;
  appState: AppState;
  errors: BlindspotError[];
  networkError: string | null;
}

const initialState: BlindspotState = {
  rubricFile: null,
  workFile: null,
  strictness: "standard",
  appState: "idle",
  errors: [],
  networkError: null,
};

export function useBlindspot() {
  const [state, setState] = useState<BlindspotState>(initialState);

  const setRubricFile = useCallback((file: File | null) => {
    setState((s) => ({ ...s, rubricFile: file }));
  }, []);

  const setWorkFile = useCallback((file: File | null) => {
    setState((s) => ({ ...s, workFile: file }));
  }, []);

  const setStrictness = useCallback((level: Strictness) => {
    setState((s) => ({ ...s, strictness: level }));
  }, []);

  const canSubmit = state.rubricFile !== null && state.workFile !== null;

  const submit = useCallback(async () => {
    if (!state.rubricFile || !state.workFile) return;

    setState((s) => ({ ...s, appState: "processing", networkError: null }));

    try {
      const result: BlindspotResponse = await submitBlindspot(
        state.rubricFile,
        state.workFile,
        state.strictness
      );
      setState((s) => ({
        ...s,
        appState: "results",
        errors: result.errors,
      }));
    } catch (err) {
      // True network failure (backend completely down)
      setState((s) => ({
        ...s,
        appState: "results",
        errors: [
          {
            type: "api_error",
            description:
              "Could not reach the Blindspot API server. Please ensure the backend URL is correctly configured.",
          },
        ],
      }));
    }
  }, [state.rubricFile, state.workFile, state.strictness]);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
    canSubmit,
    setRubricFile,
    setWorkFile,
    setStrictness,
    submit,
    reset,
  };
}
