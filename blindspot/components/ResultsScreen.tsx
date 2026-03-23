"use client";

import { motion } from "framer-motion";
import { BlindspotError } from "@/lib/types";
import ErrorCard from "./ErrorCard";

interface Props {
  errors: BlindspotError[];
  onReset: () => void;
}

export default function ResultsScreen({ errors, onReset }: Props) {
  const isClean = errors.length === 0;

  return (
    <motion.div
      key="results"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6"
    >
      {isClean ? (
        // ── SUCCESS ───────────────────────────────────────────────────────
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="flex flex-col items-center justify-center gap-5 py-16 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{
              background: "radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)",
              boxShadow: "0 0 60px rgba(16, 185, 129, 0.3)",
            }}
          >
            <svg
              className="w-12 h-12 text-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              />
            </svg>
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-white">Clear to submit.</h2>
            <p className="text-white/40 mt-2 text-sm">
              No issues found. Your work satisfies all rubric requirements.
            </p>
          </div>
        </motion.div>
      ) : (
        // ── HIT-LIST ──────────────────────────────────────────────────────
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">
                {errors.length} blindspot{errors.length !== 1 ? "s" : ""} found
              </h2>
              <p className="text-xs text-white/35 mt-0.5">
                Fix these before you submit.
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/20">
              <div className="w-1.5 h-1.5 bg-red-400 animate-pulse" />
              <span className="text-xs font-semibold text-red-400">Action required</span>
            </div>
          </div>

          {/* Error cards */}
          <div className="flex flex-col gap-2.5">
            {errors.map((err, i) => (
              <ErrorCard key={i} error={err} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        type="button"
        onClick={onReset}
        className="w-full mt-2 py-3.5 font-bold uppercase tracking-widest text-sm text-[var(--color-tertiary)] frosted-obsidian ghost-border
          hover:bg-[var(--color-surface-high)] hover:text-white transition-all duration-200 active:scale-[0.99]"
      >
        Clear & Start Over
      </motion.button>
    </motion.div>
  );
}
