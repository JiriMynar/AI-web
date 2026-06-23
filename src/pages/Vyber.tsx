import { useState } from "react";
import { Link } from "react-router-dom";
import { Eyebrow, Lamp, Reveal } from "../design/primitives";
import RobotGuide from "../design/RobotGuide";
import { useSeo } from "../lib/seo";

/** Původní ilustrované postavičky rolí v designu velínu. */
function RoleArt({ kind }: { kind: "vedeni" | "hr" | "spec" }) {
  if (kind === "vedeni") {
    return (
      <svg viewBox="0 0 120 84" className="h-20 w-full" aria-hidden>
        {/* cílová vize za postavou */}
        <circle cx="92" cy="26" r="16" fill="none" stroke="#4FC3F7" strokeWidth="2" opacity="0.35" />
        <circle cx="92" cy="26" r="9" fill="none" stroke="#4FC3F7" strokeWidth="2" opacity="0.6" />
        <circle cx="92" cy="26" r="3" fill="#4FC3F7" />
        <path d="M68 50 L86 32" stroke="#4FC3F7" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M86 32 l-7 1 m7 -1 l-1 7" stroke="#4FC3F7" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* postava s kravatou */}
        <circle cx="44" cy="30" r="13" fill="#15202E" stroke="#22303F" strokeWidth="2" />
        <path d="M37 27 q3 -3 6 0 M48 27 q3 -3 6 0" stroke="#4FC3F7" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M22 78 q2 -26 22 -26 q20 0 22 26 Z" fill="#15202E" stroke="#22303F" strokeWidth="2" />
        <path d="M44 54 l-4 7 4 14 4 -14 Z" fill="#4FC3F7" opacity="0.9" />
      </svg>
    );
  }
  if (kind === "hr") {
    return (
      <svg viewBox="0 0 120 84" className="h-20 w-full" aria-hidden>
        {/* karta kandidáta pod lupou */}
        <rect x="64" y="16" width="40" height="28" rx="5" fill="#15202E" stroke="#22303F" strokeWidth="2" />
        <circle cx="75" cy="27" r="5" fill="#FF8896" opacity="0.85" />
        <rect x="84" y="23" width="15" height="3" rx="1.5" fill="#5C7185" />
        <rect x="84" y="30" width="11" height="3" rx="1.5" fill="#5C7185" />
        <circle cx="96" cy="44" r="11" fill="none" stroke="#FF8896" strokeWidth="2.5" />
        <line x1="104" y1="52" x2="112" y2="60" stroke="#FF8896" strokeWidth="3.5" strokeLinecap="round" />
        {/* postava náboráře */}
        <circle cx="38" cy="30" r="13" fill="#15202E" stroke="#22303F" strokeWidth="2" />
        <path d="M31 27 q3 -3 6 0 M42 27 q3 -3 6 0" stroke="#FF8896" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M16 78 q2 -26 22 -26 q20 0 22 26 Z" fill="#15202E" stroke="#22303F" strokeWidth="2" />
        <path d="M30 60 q8 6 16 0" stroke="#FF8896" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.9" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 84" className="h-20 w-full" aria-hidden>
      {/* ozubené kolo s jiskrou */}
      <g opacity="0.9">
        <circle cx="92" cy="30" r="11" fill="none" stroke="#43DD9A" strokeWidth="2.5" />
        <circle cx="92" cy="30" r="4" fill="#43DD9A" />
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <line
            key={a}
            x1={92 + 11 * Math.cos((a * Math.PI) / 180)} y1={30 + 11 * Math.sin((a * Math.PI) / 180)}
            x2={92 + 16 * Math.cos((a * Math.PI) / 180)} y2={30 + 16 * Math.sin((a * Math.PI) / 180)}
            stroke="#43DD9A" strokeWidth="3" strokeLinecap="round"
          />
        ))}
      </g>
      <path d="M70 52 l4 -4 m2 10 l5 -2" stroke="#43DD9A" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      {/* postava se sluchátky */}
      <circle cx="40" cy="30" r="13" fill="#15202E" stroke="#22303F" strokeWidth="2" />
      <path d="M27 30 a13 13 0 0 1 26 0" fill="none" stroke="#43DD9A" strokeWidth="2.5" />
      <rect x="24" y="28" width="5" height="9" rx="2.5" fill="#43DD9A" />
      <rect x="51" y="28" width="5" height="9" rx="2.5" fill="#43DD9A" />
      <path d="M33 27 q3 -3 6 0 M44 27 q3 -3 6 0" stroke="#43DD9A" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M18 78 q2 -26 22 -26 q20 0 22 26 Z" fill="#15202E" stroke="#22303F" strokeWidth="2" />
    </svg>
  );
}

const ROLES: {
  to: string; code: string; kind: "vedeni" | "hr" | "spec"; lamp: string; border: string; text: string;
  title: string; desc: string; state: string;
}[] = [
  {
    to: "/vedeni",
    code: "MODUL 01",
    kind: "vedeni",
    lamp: "bg-vedeni",
    border: "hover:border-vedeni/60 focus-visible:border-vedeni/60",
    text: "text-vedeni",
    title: "Vedení / majitel",
    desc: "Určujete vizi a cíl celé implementace. Na základě vize schvalujete rozpočet i velikost AI týmu — a nastavujete interní fungování firmy tak, aby integrace probíhala bez tření. Analýza vám dá rozhodovací podklad: náročnost, realističnost záměrů, tým a rizika.",
    state: "PŘIPRAVEN",
  },
  {
    to: "/hr",
    code: "MODUL 02",
    kind: "hr",
    lamp: "bg-hr",
    border: "hover:border-hr/60 focus-visible:border-hr/60",
    text: "text-hr",
    title: "HR / nábor",
    desc: "Nesete odpovědnost za inzerci a výběr kandidátů v souladu s vizí společnosti. Tech stack AI specialistů se přitom liší pozici od pozice a přímo ovlivňuje finanční ohodnocení. Analýza vám řekne, koho přesně hledat, co napsat do inzerátu a na co se ptat.",
    state: "PŘIPRAVEN",
  },
  {
    to: "/specialista",
    code: "MODUL 03",
    kind: "spec",
    lamp: "bg-spec",
    border: "hover:border-spec/60 focus-visible:border-spec/60",
    text: "text-spec",
    title: "AI specialista",
    desc: "Odpovídáte za úspěšnou implementaci a adopci — od zmapování procesů přes data a nástroje až po to, aby řešení lidé skutečně používali. Analýza vám připraví verdikty proveditelnosti, postup krok za krokem a legislativu s termíny.",
    state: "VE VÝSTAVBĚ",
  },
];

const GUIDE_MESSAGES = [
  "Vítejte ve velínu! Jsem váš průvodce implementací AI — provedu vás analýzou a na konci dostanete konkrétní výstup pro svou práci.",
  "Důležitá věc na úvod: implementace AI se dá pozorovat z mnoha pohledů. Vedení rozhoduje a odstraňuje překážky, HR hledá správného člověka a specialista implementaci provádí — každý z nich potřebuje vědět něco jiného.",
  "Vyberte si proto pohled, který je váš. Připravím vám přesně vaši část práce — nic víc, nic míň.",
];

/** Volba perspektivy — provází jí virtuální průvodce. */
export default function Vyber() {
  useSeo(
    "Volba perspektivy — Velín",
    "Implementace AI jsou tři různé práce: vedení rozhoduje, HR hledá člověka, specialista ji provádí. Vyberte svou perspektivu."
  );
  const [lookAt, setLookAt] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-shell px-5">
      <section className="pb-8 pt-12 sm:pt-16">
        <Eyebrow tone="text-dim">/// KROK 1 · ZAČÁTEK ANALÝZY</Eyebrow>
        <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Volba perspektivy
        </h1>
      </section>

      <section className="pb-10">
        <Reveal>
          <RobotGuide messages={GUIDE_MESSAGES} lookAt={lookAt} finalHint="↓ vyberte roli níže" />
        </Reveal>
      </section>

      <section className="pb-20" onMouseLeave={() => setLookAt(null)}>
        <div className="grid gap-4 md:grid-cols-3">
          {ROLES.map((r, i) => (
            <Reveal key={r.to} delay={i * 0.06}>
              <Link
                to={r.to}
                onMouseEnter={() => setLookAt(i - 1)}
                onFocus={() => setLookAt(i - 1)}
                onBlur={() => setLookAt(null)}
                className={`group flex h-full flex-col rounded-lg border border-line bg-panel p-6 shadow-panel transition-[border-color,transform] duration-200 hover:-translate-y-1 ${r.border}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-semibold tracking-label text-faint">{r.code}</span>
                  <span className="flex items-center gap-2 font-mono text-[10px] tracking-label text-faint">
                    <Lamp tone={r.lamp} pulse={r.state === "PŘIPRAVEN"} />
                    {r.state}
                  </span>
                </div>
                <div className="mt-5 transition-transform duration-200 group-hover:scale-105">
                  <RoleArt kind={r.kind} />
                </div>
                <h2 className={`mt-4 text-2xl font-semibold ${r.text}`}>{r.title}</h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-dim">{r.desc}</p>
                <span className="mt-6 font-mono text-xs font-semibold tracking-wide2 text-ink">
                  VSTOUPIT <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
