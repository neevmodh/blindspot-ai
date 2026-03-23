"use client";

import { motion } from "framer-motion";
import { BlindspotError } from "@/lib/types";

const TYPE_CONFIG: Record<
  string,
  { icon: React.ReactNode; color: string; bg: string; label: string }
> = {
  missing_requirement: {
    label: "Missing Requirement",
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  },
  formatting_error: {
    label: "Formatting Error",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h10" />
      </svg>
    ),
  },
  citation_error: {
    label: "Citation Error",
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/20",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  length_error: {
    label: "Length Requirement",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
      </svg>
    ),
  },
  structure_error: {
    label: "Structure Issue",
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  api_error: {
    label: "System Error",
    color: "text-slate-400",
    bg: "bg-slate-500/10 border-slate-500/20",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  other: {
    label: "Other Issue",
    color: "text-white/50",
    bg: "bg-white/5 border-white/10",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
};

interface Props {
  error: BlindspotError;
  index: number;
}

export default function ErrorCard({ error, index }: Props) {
  const config = TYPE_CONFIG[error.type] ?? TYPE_CONFIG["other"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.07,
        type: "spring",
        stiffness: 350,
        damping: 28,
      }}
      className={`flex items-start gap-3 rounded-xl border p-4 ${config.bg}`}
    >
      {/* Icon */}
      <div
        className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${config.color} bg-current/10`}
        style={{ background: "rgba(255,255,255,0.04)" }}
      >
        <span className={config.color}>{config.icon}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-[11px] font-bold uppercase tracking-wider ${config.color} mb-1`}>
          {config.label}
        </p>
        <p className="text-sm text-white/75 leading-relaxed">{error.description}</p>
      </div>
    </motion.div>
  );
}
