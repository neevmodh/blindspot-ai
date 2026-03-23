"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useBlindspot } from "@/hooks/useBlindspot";
import DropZone from "@/components/DropZone";
import StrictnessSelector from "@/components/StrictnessSelector";
import ProcessingScreen from "@/components/ProcessingScreen";
import ResultsScreen from "@/components/ResultsScreen";

// ── Icons ──────────────────────────────────────────────────────────────────

function RubricIcon() {
  return (
    <svg className="w-7 h-7 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function WorkIcon() {
  return (
    <svg className="w-7 h-7 text-fuchsia-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function Home() {
  const {
    rubricFile,
    workFile,
    strictness,
    appState,
    errors,
    canSubmit,
    setRubricFile,
    setWorkFile,
    setStrictness,
    submit,
    reset,
  } = useBlindspot();

  return (
    <main className="relative min-h-screen flex flex-col items-center overflow-x-hidden">
      {/* ── Ambient background glow ──────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(109,40,217,0.22) 0%, transparent 65%)",
        }}
      />

      {/* ── Header ──────────────────────────────────── */}
      <header className="relative z-10 w-full max-w-2xl px-6 pt-10 pb-2 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2.5 mb-4"
        >
          {/* Logo mark */}
          <div
            className="w-10 h-10 flex items-center justify-center glow-shadow"
            style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))" }}
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <span className="text-3xl font-bold tracking-tight text-white font-display uppercase">
            Blind<span className="text-gradient-logo">spot</span>
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="text-sm text-white/35 max-w-xs"
        >
          Drop your rubric and your work. Get a brutal hit-list of everything
          missing before you submit.
        </motion.p>
      </header>

      {/* ── Main card ───────────────────────────────── */}
      <section className="relative z-10 w-full max-w-2xl px-4 pb-16 pt-8">
        <motion.div
          layout
          className="frosted-obsidian p-8 glow-shadow ghost-border"
          transition={{ layout: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } }}
        >
          <AnimatePresence mode="wait">
            {/* ════ STATE 1: DROP ZONE ════ */}
            {appState === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col gap-5"
              >
                {/* Drop zones */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DropZone
                    label="Rubric / Prompt"
                    sublabel="PDF only · 50 MB max"
                    icon={<RubricIcon />}
                    file={rubricFile}
                    onFile={setRubricFile}
                    accent="from-violet-600/20"
                  />
                  <DropZone
                    label="Your Work"
                    sublabel="PDF only · 50 MB max"
                    icon={<WorkIcon />}
                    file={workFile}
                    onFile={setWorkFile}
                    accent="from-fuchsia-600/20"
                  />
                </div>

                {/* Strictness */}
                <StrictnessSelector value={strictness} onChange={setStrictness} />

                {/* Divider */}
                <div className="h-px bg-white/[0.06]" />

                {/* CTA */}
                <motion.button
                  type="button"
                  disabled={!canSubmit}
                  onClick={submit}
                  whileHover={canSubmit ? { scale: 1.015 } : {}}
                  whileTap={canSubmit ? { scale: 0.985 } : {}}
                  className={`
                    relative w-full py-4 font-bold text-sm uppercase tracking-widest font-display transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0e0e13] rounded-sm
                    ${
                      canSubmit
                        ? "text-[var(--color-base)] cursor-pointer"
                        : "text-white/25 cursor-not-allowed ghost-border"
                    }
                  `}
                  style={
                    canSubmit
                      ? {
                          background: "var(--color-primary)",
                          boxShadow: "0 0 30px rgba(211, 148, 255, 0.45)",
                        }
                      : {
                          background: "transparent",
                        }
                  }
                >
                  {canSubmit && (
                    <span
                      aria-hidden
                      className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background:
                          "linear-gradient(90deg, var(--color-primary), var(--color-secondary))",
                      }}
                    />
                  )}
                  <span className="relative flex items-center justify-center gap-2">
                    {!canSubmit && (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    )}
                    {canSubmit ? "Check Blindspots →" : "Drop both PDFs to begin"}
                  </span>
                </motion.button>

                {!canSubmit && (
                  <p className="text-center text-xs text-white/20 -mt-2">
                    {!rubricFile && !workFile
                      ? "Awaiting both files"
                      : !rubricFile
                      ? "Still need the rubric"
                      : "Still need your work"}
                  </p>
                )}
              </motion.div>
            )}

            {/* ════ STATE 2: PROCESSING ════ */}
            {appState === "processing" && <ProcessingScreen key="processing" />}

            {/* ════ STATE 3: RESULTS ════ */}
            {appState === "results" && (
              <ResultsScreen key="results" errors={errors} onReset={reset} />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-[11px] text-white/15 mt-5"
        >
          Your files are processed in memory and immediately discarded. Nothing is stored.
        </motion.p>
      </section>
    </main>
  );
}
