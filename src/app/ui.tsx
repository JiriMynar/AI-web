import { ReactNode } from "react";

/** Podpisový gradient aplikace — používat střídmě (logo, aktivní prvky, progres). */
export const GRAD = "linear-gradient(120deg, #1F7AD4 0%, #15AECB 100%)";

/** Sdílené třídy pro klikací chipy — jednotný vzhled napříč aplikací. */
export const chipBase =
  "select-none rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-all duration-150 active:scale-[0.97]";
export const chipOff =
  "border-[#D6DFEA] bg-white text-[#45566B] hover:border-[#9FB6CE] hover:shadow-[0_2px_10px_-4px_rgba(15,23,42,0.18)]";
export const chipOn =
  "border-[#1F7AD4] bg-[#EAF3FD] text-[#155FA8] shadow-[inset_0_0_0_1px_rgba(31,122,212,0.28)]";

type Opt = { v: string; t: string };

export function SectionHeader({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  return (
    <header className="mb-8">
      <div className="inline-flex items-center gap-2 rounded-md border border-[#D9E7F6] bg-[#EFF6FD] px-2.5 py-[5px]">
        <span className="h-1.5 w-1.5 rounded-[2px]" style={{ background: GRAD }} />
        <span className="font-mono text-[10.5px] font-semibold tracking-label text-[#1668B8]">{eyebrow}</span>
      </div>
      <h1 className="mt-4 text-[26px] font-bold leading-[1.15] tracking-tight text-[#0E1726] sm:text-[30px]">{title}</h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#52606D]">{intro}</p>
    </header>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={`rounded-2xl border border-[#E3EAF3] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_28px_-18px_rgba(15,23,42,0.12)] ${className}`}
    >
      {children}
    </section>
  );
}

function FieldHead({ label, hint }: { label: string; hint?: string }) {
  return (
    <div>
      <div className="text-[13.5px] font-semibold text-[#0E1726]">{label}</div>
      {hint && <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-[#7A8794]">{hint}</p>}
    </div>
  );
}

export function ChoiceField({
  label,
  hint,
  options,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  options: Opt[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <FieldHead label={label} hint={hint} />
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => {
          const active = value === o.v;
          return (
            <button
              key={o.v}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(o.v)}
              className={`${chipBase} ${active ? chipOn : chipOff}`}
            >
              {active ? "\u2713 " : ""}
              {o.t}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function MultiField({
  label,
  hint,
  options,
  values,
  onToggle,
  locked,
}: {
  label: string;
  hint?: string;
  options: Opt[];
  values: string[];
  onToggle: (v: string) => void;
  locked?: Opt[];
}) {
  return (
    <div>
      <FieldHead label={label} hint={hint} />
      <div className="mt-3 flex flex-wrap gap-2">
        {locked?.map((o) => (
          <span
            key={o.v}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#BFDCF6] bg-[#EAF3FD] px-3.5 py-1.5 text-[13px] font-medium text-[#155FA8]"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="5" y="11" width="14" height="9" rx="2" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
            {o.t}
          </span>
        ))}
        {options.map((o) => {
          const active = values.includes(o.v);
          return (
            <button
              key={o.v}
              type="button"
              aria-pressed={active}
              onClick={() => onToggle(o.v)}
              className={`${chipBase} ${active ? chipOn : chipOff}`}
            >
              {active ? "\u2713 " : ""}
              {o.t}
            </button>
          );
        })}
      </div>
    </div>
  );
}
