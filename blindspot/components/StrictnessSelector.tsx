"use client";

import { motion } from "framer-motion";
import { Strictness } from "@/lib/types";

const levels: { value: Strictness; label: string; sublabel: string }[] = [
  { value: "chill", label: "Chill T.A.", sublabel: "Major omissions only" },
  { value: "standard", label: "Standard", sublabel: "All requirements" },
  { value: "strict", label: "Tenured Prof.", sublabel: "Pedantic mode" },
];

interface Props {
  value: Strictness;
  onChange: (v: Strictness) => void;
}

export default function StrictnessSelector({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold uppercase tracking-widest text-[#acaab1] font-display">
        AI Strictness Level
      </label>
      <div className="relative flex frosted-obsidian ghost-border p-1 gap-1">
        {levels.map((level) => {
          const isActive = value === level.value;
          return (
            <button
              key={level.value}
              type="button"
              onClick={() => onChange(level.value)}
              className="relative flex-1 px-3 py-2.5 text-center transition-colors duration-200 z-10 focus:outline-none focus-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e0e13] rounded-sm"
            >
              {isActive && (
                <motion.div
                  layoutId="strictness-pill"
                  className="absolute inset-0 bg-[var(--color-surface-high)] vibrant-edge-top"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <span
                className={`relative block text-xs font-semibold transition-colors duration-200 ${
                  isActive ? "text-white" : "text-white/40 hover:text-white/60"
                }`}
              >
                {level.label}
              </span>
              <span
                className={`relative block text-[10px] mt-0.5 transition-colors duration-200 ${
                  isActive ? "text-white/60" : "text-white/20"
                }`}
              >
                {level.sublabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
