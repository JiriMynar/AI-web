import { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

/** Mono popisek sekce — jazyk přístrojové desky. */
export function Eyebrow({ children, tone = "text-faint" }: { children: ReactNode; tone?: string }) {
  return (
    <div className={`font-mono text-[11px] font-semibold uppercase tracking-label ${tone}`}>
      {children}
    </div>
  );
}

/** Panel přístroje. */
export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-line bg-panel shadow-panel ${className}`}>
      {children}
    </div>
  );
}

/** Kontrolka stavu — nese význam (ok / warn / stop / akcent role). */
export function Lamp({ tone, pulse = false }: { tone: string; pulse?: boolean }) {
  return (
    <span
      aria-hidden
      className={`inline-block h-2 w-2 flex-shrink-0 rounded-full ${tone} ${pulse ? "animate-pulse" : ""}`}
      style={{ boxShadow: "0 0 10px currentColor" }}
    />
  );
}

/** Jemný vstup bloku do viewportu. */
export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.28, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="rounded-md bg-ink px-6 py-3 text-[15px] font-semibold text-bg transition-[transform,opacity] duration-150 enabled:hover:-translate-y-0.5 enabled:active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

export function GhostButton({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md border border-line px-4 py-2.5 text-sm font-semibold text-dim transition-colors hover:border-faint hover:text-ink"
    >
      {children}
    </button>
  );
}
