"use client";

import { useCallback, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";

interface DropZoneProps {
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  file: File | null;
  onFile: (file: File | null) => void;
  accent: string; // Tailwind class like "from-violet-500"
}

export default function DropZone({
  label,
  sublabel,
  icon,
  file,
  onFile,
  accent,
}: DropZoneProps) {
  const [rejection, setRejection] = useState<string | null>(null);

  const onDrop = useCallback(
    (accepted: File[], rejected: FileRejection[]) => {
      setRejection(null);
      if (accepted.length > 0) {
        onFile(accepted[0]);
      }
      if (rejected.length > 0) {
        const err = rejected[0].errors[0];
        if (err.code === "file-too-large") {
          setRejection("File too large. Compress under 50MB to keep things lightning fast.");
        } else if (err.code === "file-invalid-type") {
          setRejection("Only PDF files are accepted.");
        } else {
          setRejection(err.message);
        }
      }
    },
    [onFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxSize: 50 * 1024 * 1024,
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        relative flex flex-col items-center justify-center ghost-border
        cursor-pointer transition-all duration-300 min-h-[220px] p-6 group select-none
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e0e13]
        ${
          file
            ? "border-[var(--color-tertiary)] bg-[var(--color-tertiary)]/5"
            : isDragActive
            ? "vibrant-edge-top bg-[var(--color-surface-high)] scale-[1.02]"
            : "frosted-obsidian hover:border-white/25 hover:bg-white/[0.05]"
        }
      `}
    >
      <input {...getInputProps()} />

      {/* Gradient glow on hover */}
      <div
        className={`
          absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500
          ${isDragActive ? "opacity-100" : "group-hover:opacity-40"}
          bg-gradient-to-br ${accent} to-transparent
        `}
      />

      <AnimatePresence mode="wait">
        {file ? (
          // Loaded state
          <motion.div
            key="loaded"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="relative flex flex-col items-center gap-3 text-center z-10"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-white/90">{file.name}</p>
              <p className="text-xs text-white/40 mt-0.5">
                {(file.size / 1024).toFixed(0)} KB
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFile(null);
                setRejection(null);
              }}
              className="text-xs font-bold text-white/30 hover:text-[var(--color-tertiary)] transition-colors mt-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded px-1"
            >
              Remove
            </button>
          </motion.div>
        ) : (
          // Empty state
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative flex flex-col items-center gap-3 text-center z-10"
          >
            <div
              className={`w-14 h-14 flex items-center justify-center transition-all duration-300
              ${isDragActive ? "bg-[var(--color-primary)]/20 scale-110" : "bg-white/5 group-hover:bg-white/10"}`}
            >
              {icon}
            </div>
            <div>
              <p className="text-sm font-semibold text-white/80">{label}</p>
              <p className="text-xs text-white/35 mt-1">{sublabel}</p>
            </div>
            <p className="text-[11px] text-white/20 mt-1">
              {isDragActive ? "Release to load" : "Drag & drop or click to browse"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error message */}
      {rejection && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-3 text-xs text-red-400 z-10"
        >
          {rejection}
        </motion.p>
      )}
    </div>
  );
}
