import { ReactNode } from "react";

export function SectionHeader({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <header className="mb-8">
      <div className="font-mono text-[11px] font-semibold tracking-label text-[#1F7AD4]">{eyebrow}</div>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#0E1726]">{title}</h1>
      {intro && <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#52606D]">{intro}</p>}
    </header>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-[#E6ECF3] bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)] ${className}`}>
      {children}
    </div>
  );
}

export function ChoiceField({ label, hint, options, value, onChange }: {
  label: string;
  hint?: string;
  options: { v: string; t: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="text-[13px] font-semibold text-[#0E1726]">{label}</div>
      {hint && <div className="mt-1 text-[13px] leading-relaxed text-[#7A8794]">{hint}</div>}
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => {
          const active = value === o.v;
          return (
            <button
              key={o.v}
              type="button"
              onClick={() => onChange(o.v)}
              className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                active
                  ? "border-[#1F7AD4] bg-[#EAF2FB] text-[#1F7AD4]"
                  : "border-[#D8E1EB] bg-white text-[#52606D] hover:border-[#9AA7B4]"
              }`}
            >
              {o.t}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function MultiField({ label, hint, options, values, onToggle }: {
  label: string;
  hint?: string;
  options: { v: string; t: string }[];
  values: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div>
      <div className="text-[13px] font-semibold text-[#0E1726]">{label}</div>
      {hint && <div className="mt-1 text-[13px] leading-relaxed text-[#7A8794]">{hint}</div>}
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => {
          const active = values.includes(o.v);
          return (
            <button
              key={o.v}
              type="button"
              onClick={() => onToggle(o.v)}
              className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                active
                  ? "border-[#1F7AD4] bg-[#EAF2FB] text-[#1F7AD4]"
                  : "border-[#D8E1EB] bg-white text-[#52606D] hover:border-[#9AA7B4]"
              }`}
            >
              {active ? "✓ " : ""}{o.t}
            </button>
          );
        })}
      </div>
    </div>
  );
}
