import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Eyebrow } from "../design/primitives";
import ParticleField, { ParticleFieldHandle } from "../design/ParticleField";
import { useSeo } from "../lib/seo";

/**
 * Vstupní obrazovka — jen hero: tmavé pozadí s gradientem, mřížkou a tečkami,
 * velký nadpis s barevně zvýrazněnými klíčovými slovy, krátký popis k čemu
 * Velín je a jedno tlačítko na vstup. Vpravo vlastní SVG ilustrace robota.
 */
export default function Landing() {
  useSeo(
    "Velín — nastartujte AI a automatizaci ve firmě",
    "Bezplatný interaktivní průvodce zaváděním AI a automatizace pro české firmy. Zjistěte, co je u vás proveditelné, koho najmout a jak se vyhnout draze pořízeným nástrojům."
  );
  const reduce = useReducedMotion();
  const navigate = useNavigate();
  const field = useRef<ParticleFieldHandle>(null);
  const [leaving, setLeaving] = useState(false);

  const enter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (leaving) return;
    if (reduce) {
      navigate("/vyber");
      return;
    }
    field.current?.explode(e.clientX, e.clientY);
    setLeaving(true);
    window.setTimeout(() => navigate("/vyber"), 1100);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Vrstvy pozadí: gradient → mřížka → tečky */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 62% 12%, rgba(79,195,247,0.12), transparent 58%), radial-gradient(ellipse 65% 55% at 15% 85%, rgba(67,221,154,0.07), transparent 55%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(34,48,63,0.45) 1px, transparent 1px), linear-gradient(to bottom, rgba(34,48,63,0.45) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 75% 60% at 50% 35%, #000 25%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(ellipse 75% 60% at 50% 35%, #000 25%, transparent 78%)",
        }}
      />
      <ParticleField ref={field} />

      <motion.div
        animate={leaving ? { opacity: 0, scale: 0.95, filter: "blur(6px)" } : { opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.65, ease: "easeIn" }}
        className="relative z-10"
      >
        <section className="relative mx-auto max-w-shell px-5">
          <div className="grid min-h-[86vh] items-center gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
            {/* Text */}
            <div className="text-center lg:text-left">
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Eyebrow tone="text-dim">/// PRŮVODCE ZAVÁDĚNÍM AI · CZ</Eyebrow>
              </motion.div>

              <motion.h1
                initial={reduce ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.06 }}
                className="mt-6 text-4xl font-semibold leading-[1.06] tracking-tight sm:text-6xl"
              >
                Nastartujte <span className="text-spec">AI</span> a{" "}
                <span className="text-warn">automatizaci</span> ve vaší firmě
              </motion.h1>

              <motion.p
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.16 }}
                className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-dim lg:mx-0"
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
                  className="group inline-flex items-center gap-3 rounded-full bg-vedeni px-9 py-4 text-base font-semibold text-bg shadow-[0_0_45px_rgba(79,195,247,0.4)] transition-[transform,box-shadow] duration-200 enabled:hover:-translate-y-1 enabled:hover:shadow-[0_0_70px_rgba(79,195,247,0.55)] disabled:cursor-default"
                >
                  {leaving ? "Spouštím…" : "Vstoupit do aplikace"}
                  <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </button>
              </motion.div>

              <motion.p
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.42 }}
                className="mt-7 font-mono text-xs tracking-wide2 text-faint"
              >
                bezplatné · bez registrace · nic se nikam neodesílá
              </motion.p>
            </div>

            {/* Ilustrace */}
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative mx-auto w-full max-w-[460px]"
            >
              <motion.div
                animate={reduce ? undefined : { y: [0, -14, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg viewBox="0 0 420 420" className="h-auto w-full" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ilustrace robota a automatizace">
                  <defs>
                    <radialGradient id="vlnGlow" cx="50%" cy="46%" r="55%">
                      <stop offset="0%" stopColor="#4FC3F7" stopOpacity="0.22" />
                      <stop offset="55%" stopColor="#43DD9A" stopOpacity="0.06" />
                      <stop offset="100%" stopColor="#0A1017" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="vlnBody" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1A2532" />
                      <stop offset="100%" stopColor="#111A26" />
                    </linearGradient>
                    <filter id="vlnSoft" x="-60%" y="-60%" width="220%" height="220%">
                      <feGaussianBlur stdDeviation="4" result="b" />
                      <feMerge>
                        <feMergeNode in="b" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  <circle cx="210" cy="205" r="205" fill="url(#vlnGlow)" />

                  {/* orbity */}
                  <g stroke="#22303F" strokeWidth="1" opacity="0.7">
                    <ellipse cx="210" cy="212" rx="182" ry="150" />
                    <ellipse cx="210" cy="212" rx="128" ry="184" transform="rotate(20 210 212)" />
                  </g>

                  {/* spojnice automatizace */}
                  <g stroke="#22303F" strokeWidth="1.5">
                    <line x1="112" y1="96" x2="138" y2="156" strokeDasharray="3 5" />
                    <line x1="388" y1="252" x2="296" y2="240" strokeDasharray="3 5" />
                  </g>

                  {/* orbitální tečky */}
                  <circle cx="40" cy="158" r="5" fill="#43DD9A" filter="url(#vlnSoft)" />
                  <circle cx="388" cy="252" r="4.5" fill="#FFB547" filter="url(#vlnSoft)" />
                  <circle cx="306" cy="70" r="3.5" fill="#4FC3F7" filter="url(#vlnSoft)" />

                  {/* čip AI */}
                  <g>
                    <rect x="66" y="72" width="46" height="46" rx="10" fill="#111A26" stroke="#FFB547" strokeOpacity="0.55" />
                    <text x="89" y="101" textAnchor="middle" fontFamily="monospace" fontSize="16" fontWeight="700" fill="#FFB547">AI</text>
                    <g stroke="#FFB547" strokeOpacity="0.55" strokeWidth="2">
                      <line x1="76" y1="72" x2="76" y2="64" />
                      <line x1="102" y1="72" x2="102" y2="64" />
                      <line x1="76" y1="118" x2="76" y2="126" />
                      <line x1="102" y1="118" x2="102" y2="126" />
                    </g>
                  </g>

                  {/* anténa */}
                  <line x1="210" y1="156" x2="210" y2="122" stroke="#3A4A5C" strokeWidth="3" />
                  <circle cx="210" cy="118" r="7" fill="#4FC3F7" filter="url(#vlnSoft)" />

                  {/* sluchátka */}
                  <rect x="120" y="190" width="20" height="54" rx="9" fill="#15202E" stroke="#2A3848" />
                  <rect x="280" y="190" width="20" height="54" rx="9" fill="#15202E" stroke="#2A3848" />

                  {/* hlava */}
                  <rect x="136" y="152" width="148" height="128" rx="30" fill="url(#vlnBody)" stroke="#2A3848" strokeWidth="1.5" />

                  {/* obličejová obrazovka */}
                  <rect x="153" y="172" width="114" height="80" rx="18" fill="#0A1017" stroke="#22303F" />
                  <circle cx="191" cy="208" r="11" fill="#4FC3F7" filter="url(#vlnSoft)" />
                  <circle cx="229" cy="208" r="11" fill="#4FC3F7" filter="url(#vlnSoft)" />
                  <path d="M189 230 q21 16 42 0" stroke="#43DD9A" strokeWidth="3" strokeLinecap="round" fill="none" />

                  {/* krk + trup + kontrolka */}
                  <rect x="196" y="280" width="28" height="16" fill="#15202E" />
                  <path d="M150 362 q60 -46 120 0" fill="#111A26" stroke="#2A3848" strokeWidth="1.5" />
                  <circle cx="210" cy="340" r="6" fill="#43DD9A" filter="url(#vlnSoft)" />
                </svg>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
