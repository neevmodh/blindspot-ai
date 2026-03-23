"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MESSAGES = [
  "Reading rubric...",
  "Parsing requirements...",
  "Analyzing your document...",
  "Cross-referencing formatting...",
  "Checking citations...",
  "Hunting blindspots...",
  "Compiling hit-list...",
];

export default function ProcessingScreen() {
  const [msgIndex, setMsgIndex] = useState(0);
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    // Cycle messages every 1.4s
    const msgTimer = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length);
    }, 1400);

    // Animate progress bar — fake progress that stalls near end
    let width = 0;
    const barTimer = setInterval(() => {
      setBarWidth((w) => {
        if (w >= 92) return w; // stall — waiting on AI
        return Math.min(92, w + Math.random() * 8);
      });
    }, 300);

    return () => {
      clearInterval(msgTimer);
      clearInterval(barTimer);
    };
  }, []);

  return (
    <motion.div
      key="processing"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center gap-12 py-20"
    >
      <div aria-live="polite" className="sr-only">
        {MESSAGES[msgIndex]}
      </div>

      {/* Central animation */}
      <div className="relative flex items-center justify-center">
        {/* Outer pulse rings */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute border border-[var(--color-primary)]/30"
            style={{ width: 80 + i * 44, height: 80 + i * 44 }}
            animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.1, 0.4] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.35,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Core orb */}
        <motion.div
          className="relative w-20 h-20 flex items-center justify-center glow-shadow"
          style={{
            background:
              "radial-gradient(circle at 40% 35%, var(--color-primary), var(--color-surface-high) 70%)",
          }}
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Scan line */}
          <motion.div
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-300/80 to-transparent"
            animate={{ top: ["20%", "80%", "20%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <svg
            className="w-8 h-8 text-white/80 relative z-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </motion.div>
      </div>

      {/* Cycling message */}
      <div className="flex flex-col items-center gap-6 w-full max-w-sm">
        <div className="h-6 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={msgIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="text-sm font-medium text-white/60 tracking-wide"
            >
              {MESSAGES[msgIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className="w-full h-0.5 bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            className="h-full"
            style={{
              background: "linear-gradient(90deg, var(--color-primary), var(--color-secondary), var(--color-tertiary))",
              width: `${barWidth}%`,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>

        <p className="text-xs text-white/20">
          Usually takes 5–15 seconds. Gemini is reading your PDFs.
        </p>
      </div>
    </motion.div>
  );
}
