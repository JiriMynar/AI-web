import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Eyebrow } from "../design/primitives";
import { useSeo } from "../lib/seo";

/**
 * Vstupní obrazovka — světlý mód, bez částic. Vlevo nadpis s barevně
 * zvýrazněnými klíčovými slovy, krátký popis a tlačítko na vstup. Vpravo
 * animovaná SVG ilustrace: firemní podklady (dokument, e-mail, tabulka)
 * tečou do AI jádra, to je zpracuje (pulzuje, vedle se točí ozubené kolo)
 * a ven vytékají hotové výstupy (schváleno, report, odesláno).
 */

const FLOW: { x1: number; y1: number; x2: number; y2: number; c: string; d: number }[] = [
  { x1: 70, y1: 70, x2: 176, y2: 158, c: "#1F7AD4", d: 0 },
  { x1: 70, y1: 160, x2: 174, y2: 180, c: "#1F7AD4", d: 0.45 },
  { x1: 70, y1: 250, x2: 176, y2: 202, c: "#1F7AD4", d: 0.9 },
  { x1: 264, y1: 158, x2: 370, y2: 70, c: "#12A065", d: 0.6 },
  { x1: 266, y1: 180, x2: 370, y2: 160, c: "#12A065", d: 1.05 },
  { x1: 264, y1: 202, x2: 370, y2: 250, c: "#12A065", d: 1.5 },
];

const GEAR_TEETH: { x1: number; y1: number; x2: number; y2: number }[] = [
  { x1: 9, y1: 0, x2: 13, y2: 0 },
  { x1: 6.4, y1: 6.4, x2: 9.2, y2: 9.2 },
  { x1: 0, y1: 9, x2: 0, y2: 13 },
  { x1: -6.4, y1: 6.4, x2: -9.2, y2: 9.2 },
  { x1: -9, y1: 0, x2: -13, y2: 0 },
  { x1: -6.4, y1: -6.4, x2: -9.2, y2: -9.2 },
  { x1: 0, y1: -9, x2: 0, y2: -13 },
  { x1: 6.4, y1: -6.4, x2: 9.2, y2: -9.2 },
];

export default function Landing() {
  useSeo(
    "Velín — nastartujte AI a automatizaci ve firmě",
    "Bezplatný interaktivní průvodce zaváděním AI a automatizace pro české firmy. Zjistěte, co je u vás proveditelné, koho najmout a jak se vyhnout draze pořízeným nástrojům."
  );
  const reduce = useReducedMotion();
  const navigate = useNavigate();
  const [leaving, setLeaving] = useState(false);

  const enter = () => {
    if (leaving) return;
    if (reduce) {
      navigate("/vyber");
      return;
    }
    setLeaving(true);
    window.setTimeout(() => navigate("/vyber"), 600);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F6F9FC]">
      {/* Světlé pozadí: jemný gradient + mřížka */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 70% 8%, rgba(31,122,212,0.10), transparent 55%), radial-gradient(ellipse 60% 55% at 10% 92%, rgba(18,160,101,0.08), transparent 55%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(15,23,42,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.05) 1px, transparent 1px)",
          backgroundSize: "46px 46px",
          maskImage: "radial-gradient(ellipse 78% 62% at 50% 35%, #000 22%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 78% 62% at 50% 35%, #000 22%, transparent 80%)",
        }}
      />

      <motion.div
        animate={leaving ? { opacity: 0, scale: 0.97 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeIn" }}
        className="relative z-10"
      >
        <section className="mx-auto max-w-shell px-5">
          <div className="grid min-h-[88vh] items-center gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
            {/* Text */}
            <div className="text-center lg:text-left">
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Eyebrow tone="text-[#1F7AD4]">/// PRŮVODCE ZAVÁDĚNÍM AI · CZ</Eyebrow>
              </motion.div>

              <motion.h1
                initial={reduce ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.06 }}
                className="mt-6 text-4xl font-semibold leading-[1.06] tracking-tight text-[#0E1726] sm:text-6xl"
              >
                Nastartujte <span className="text-[#12A065]">AI</span> a{" "}
                <span className="text-[#1F7AD4]">automatizaci</span> ve vaší firmě
              </motion.h1>

              <motion.p
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.16 }}
                className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#52606D] lg:mx-0"
              >
                Velín je bezplatný průvodce, který vám ukáže, co je u vás proveditelné hned, koho na to najmout
                a jak se vyhnout draze pořízeným nástrojům, které pak nikdo nepoužívá.
              </motion.p>

              <motion.div
                initial={reduce ? false : { opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, delay: 0.28 }}
                className="mt-10 flex justify-center lg:justify-start"
              >
                <button
                  type="button"
                  onClick={enter}
                  disabled={leaving}
                  className="group inline-flex items-center gap-3 rounded-full bg-[#1F7AD4] px-9 py-4 text-base font-semibold text-white shadow-[0_12px_34px_rgba(31,122,212,0.32)] transition-[transform,box-shadow] duration-200 enabled:hover:-translate-y-1 enabled:hover:shadow-[0_18px_46px_rgba(31,122,212,0.42)] disabled:cursor-default"
                >
                  {leaving ? "Spouštím…" : "Vstoupit do aplikace"}
                  <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </button>
              </motion.div>

              <motion.p
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.42 }}
                className="mt-7 font-mono text-xs tracking-wide2 text-[#9AA7B4]"
              >
                bezplatné · bez registrace · nic se nikam neodesílá
              </motion.p>
            </div>

            {/* Ilustrace: AI do firemních procesů + automatizace */}
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative mx-auto w-full max-w-[480px]"
            >
              <svg viewBox="0 0 440 360" className="h-auto w-full" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Firemní podklady proudí do AI jádra a ven vytékají automatizované výstupy">
                <defs>
                  <radialGradient id="vlnHalo" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#1F7AD4" stopOpacity="0.12" />
                    <stop offset="60%" stopColor="#1F7AD4" stopOpacity="0.04" />
                    <stop offset="100%" stopColor="#1F7AD4" stopOpacity="0" />
                  </radialGradient>
                  <filter id="vlnCard" x="-25%" y="-25%" width="150%" height="160%">
                    <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#1F3A56" floodOpacity="0.12" />
                  </filter>
                </defs>

                <ellipse cx="220" cy="180" rx="210" ry="170" fill="url(#vlnHalo)" />

                {/* spojnice */}
                {FLOW.map((f, i) => (
                  <line key={`l${i}`} x1={f.x1} y1={f.y1} x2={f.x2} y2={f.y2} stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="2 6" strokeLinecap="round" />
                ))}

                {/* tekoucí datačky */}
                {!reduce &&
                  FLOW.map((f, i) => (
                    <motion.circle
                      key={`d${i}`}
                      r="4"
                      fill={f.c}
                      initial={{ cx: f.x1, cy: f.y1 }}
                      animate={{ cx: [f.x1, f.x2], cy: [f.y1, f.y2] }}
                      transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut", delay: f.d }}
                    />
                  ))}

                {/* --- vstupní karty (vlevo) --- */}
                {/* dokument */}
                <g filter="url(#vlnCard)">
                  <rect x="16" y="49" width="54" height="42" rx="10" fill="#FFFFFF" stroke="#E3EAF2" />
                </g>
                <rect x="33" y="59" width="20" height="22" rx="2.5" fill="none" stroke="#64748B" strokeWidth="1.5" />
                <g stroke="#9AA8B6" strokeWidth="1.5" strokeLinecap="round">
                  <line x1="37" y1="65" x2="49" y2="65" />
                  <line x1="37" y1="70" x2="49" y2="70" />
                  <line x1="37" y1="75" x2="45" y2="75" />
                </g>

                {/* e-mail */}
                <g filter="url(#vlnCard)">
                  <rect x="16" y="139" width="54" height="42" rx="10" fill="#FFFFFF" stroke="#E3EAF2" />
                </g>
                <rect x="31" y="151" width="24" height="18" rx="2.5" fill="none" stroke="#64748B" strokeWidth="1.5" />
                <path d="M32 153 L43 161 L54 153" fill="none" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

                {/* tabulka */}
                <g filter="url(#vlnCard)">
                  <rect x="16" y="229" width="54" height="42" rx="10" fill="#FFFFFF" stroke="#E3EAF2" />
                </g>
                <rect x="32" y="241" width="22" height="18" rx="2.5" fill="none" stroke="#64748B" strokeWidth="1.5" />
                <line x1="43" y1="241" x2="43" y2="259" stroke="#9AA8B6" strokeWidth="1.5" />
                <line x1="32" y1="250" x2="54" y2="250" stroke="#9AA8B6" strokeWidth="1.5" />

                {/* --- výstupní karty (vpravo) --- */}
                {/* schváleno */}
                <g filter="url(#vlnCard)">
                  <rect x="370" y="49" width="54" height="42" rx="10" fill="#FFFFFF" stroke="#E3EAF2" />
                </g>
                <circle cx="397" cy="70" r="12" fill="#12A065" />
                <path d="M391 70.5 l4 4 l8 -8.5" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                {/* report */}
                <g filter="url(#vlnCard)">
                  <rect x="370" y="139" width="54" height="42" rx="10" fill="#FFFFFF" stroke="#E3EAF2" />
                </g>
                <rect x="388" y="162" width="5" height="9" rx="1" fill="#1F7AD4" />
                <rect x="395" y="156" width="5" height="15" rx="1" fill="#12A065" />
                <rect x="402" y="159" width="5" height="12" rx="1" fill="#1F7AD4" />

                {/* odesláno */}
                <g filter="url(#vlnCard)">
                  <rect x="370" y="229" width="54" height="42" rx="10" fill="#FFFFFF" stroke="#E3EAF2" />
                </g>
                <path d="M386 250 L410 241 L402 259 L398 252 Z" fill="#1F7AD4" />
                <path d="M398 252 L410 241" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />

                {/* --- AI jádro --- */}
                {!reduce && (
                  <motion.circle
                    cx="220"
                    cy="180"
                    r="58"
                    fill="none"
                    stroke="#1F7AD4"
                    strokeWidth="1.5"
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: [1, 1.14, 1], opacity: [0.45, 0, 0.45] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  />
                )}
                <g filter="url(#vlnCard)">
                  <rect x="174" y="134" width="92" height="92" rx="22" fill="#FFFFFF" stroke="#BFD8EF" strokeWidth="1.5" />
                </g>
                {/* nervový glyf */}
                <g stroke="#1F7AD4" strokeWidth="2">
                  <line x1="220" y1="180" x2="200" y2="162" />
                  <line x1="220" y1="180" x2="240" y2="162" />
                  <line x1="220" y1="180" x2="220" y2="202" />
                </g>
                <circle cx="200" cy="162" r="5" fill="#1F7AD4" />
                <circle cx="240" cy="162" r="5" fill="#1F7AD4" />
                <circle cx="220" cy="202" r="5" fill="#12A065" />
                <circle cx="220" cy="180" r="6.5" fill="#0E1726" />
                <text x="220" y="224" textAnchor="middle" fontFamily="monospace" fontSize="10" fontWeight="700" fill="#1F7AD4" letterSpacing="1">AI</text>

                {/* ozubené kolo = automatizace */}
                <g transform="translate(260 142)">
                  <motion.g
                    animate={reduce ? undefined : { rotate: 360 }}
                    transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    {GEAR_TEETH.map((t, i) => (
                      <line key={`g${i}`} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="#E0933A" strokeWidth="3" strokeLinecap="round" />
                    ))}
                    <circle cx="0" cy="0" r="8.5" fill="#E0933A" />
                    <circle cx="0" cy="0" r="3.5" fill="#FFFFFF" />
                  </motion.g>
                </g>
              </svg>
            </motion.div>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
