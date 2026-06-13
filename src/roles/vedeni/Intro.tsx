import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Eyebrow, Reveal } from "../../design/primitives";
import RobotGuide from "../../design/RobotGuide";
import { useSeo } from "../../lib/seo";
import { STEPS } from "./data";

const GUIDE_MESSAGES = [
  "Vítejte v modulu pro vedení. Výsledkem analýzy bude rozhodovací podklad: celková náročnost implementace u vás ve firmě, verdikt realističnosti každého záměru, tým, který budete potřebovat — a rizikové scénáře s cestami ven.",
  "Pomůže vám vyvarovat se chyb, které dělají i zkušení manažeři, když AI zavádějí poprvé: nákup nástroje před zmapováním procesu, projekt bez vlastníka a měřitelného cíle, nebo ambice, na kterou nestačí kapacita lidí.",
  "Nástrahy se přitom liší podle profilu a stavu vaší firmy — jinde číhají u výrobce s papírovou evidencí, jinde u kanceláře plné excelů. Proto se vás zeptám na pár věcí o firmě, datech, procesech a lidech, a vše vyhodnotím přesně pro vaši situaci.",
];

/**
 * Interaktivní svislá osa kroků analýzy:
 * - gradientní linka s putující jiskrou (data tečou velínem),
 * - uzly s čísly se na hover rozsvítí a zvětší, popis zjasní,
 * - zakončená uzlem výstupu a tlačítkem Spustit analýzu.
 */
function StepTimeline({ active }: { active: boolean }) {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="relative ml-1 sm:ml-3">
      {/* svislá linka */}
      <div
        aria-hidden
        className="absolute bottom-3 left-[15px] top-1 w-[2px] rounded bg-gradient-to-b from-vedeni/80 via-line to-vedeni/50"
      />
      {/* putující jiskra po lince */}
      {active && !reduce && (
        <motion.div
          aria-hidden
          className="absolute left-[11px] h-2.5 w-2.5 rounded-full bg-vedeni"
          style={{ boxShadow: "0 0 12px #4FC3F7" }}
          animate={{ top: ["0%", "97%"], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", times: [0, 0.08, 0.92, 1] }}
        />
      )}

      {STEPS.map((s, i) => {
        const lit = hovered === i;
        return (
          <div
            key={s.id}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className="group relative pb-9 pl-12"
          >
            {/* uzel */}
            <span
              aria-hidden
              className={`absolute left-0 top-0 grid h-8 w-8 place-items-center rounded-full border-2 font-mono text-[11px] font-semibold transition-all duration-200 ${
                lit ? "scale-110 border-vedeni bg-vedeni text-bg" : "border-line bg-panel text-vedeni"
              }`}
              style={lit ? { boxShadow: "0 0 18px rgba(79, 195, 247, 0.55)" } : undefined}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            {/* obsah kroku */}
            <div className={`-mt-1 transition-transform duration-200 ${lit ? "translate-x-1" : ""}`}>
              <div className={`font-semibold transition-colors duration-200 ${lit ? "text-vedeni" : "text-ink"}`}>
                {s.full}
              </div>
              <p className={`mt-1 max-w-2xl text-[13px] leading-relaxed transition-colors duration-200 ${lit ? "text-ink" : "text-dim"}`}>
                {s.desc}
              </p>
            </div>
          </div>
        );
      })}

      {/* koncový uzel — výstup */}
      <div className="relative pl-12">
        <span
          aria-hidden
          className="absolute left-[5px] top-1 h-[22px] w-[22px] rotate-45 rounded-[5px] border-2 border-vedeni bg-vedeni/15"
          style={{ boxShadow: "0 0 16px rgba(79, 195, 247, 0.4)" }}
        />
        <div className="rounded-lg border border-dashed border-vedeni/40 bg-vedeni/5 px-5 py-4">
          <div className="font-semibold text-vedeni">Výstup: report pro vedení</div>
          <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-dim">
            Náročnost, verdikty záměrů, tým, povinnosti, rizikové scénáře a pravidla z praxe.
            Sdílitelný odkazem — nic se nikam neodesílá.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-5">
          <Link
            to="/vedeni/pruvodce"
            tabIndex={active ? 0 : -1}
            className="group inline-flex items-center gap-3 rounded-full bg-vedeni px-9 py-4 text-lg font-semibold text-bg shadow-[0_0_36px_rgba(79,195,247,0.35)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_0_56px_rgba(79,195,247,0.5)]"
          >
            Spustit analýzu
            <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
          <span className="font-mono text-xs tracking-wide2 text-faint">
            5 kroků · cca 5 minut · odpovědi zůstávají jen ve vašem prohlížeči
          </span>
        </div>
      </div>
    </div>
  );
}

/** Úvod modulu Vedení: průvodce → osa kroků se vynoří z mlhy → spuštění analýzy. */
export default function Intro() {
  useSeo(
    "Vedení / majitel — analýza implementace AI | Velín",
    "Rozhodujete o zavedení AI? Analýza vám dá rozhodovací podklad: náročnost, realističnost záměrů, potřebný tým a rizika — přesně pro stav vaší firmy."
  );
  const [showSteps, setShowSteps] = useState(false);
  const stepsRef = useRef<HTMLDivElement>(null);

  const revealSteps = () => {
    setShowSteps(true);
    window.setTimeout(() => {
      stepsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  };

  return (
    <div className="mx-auto max-w-shell px-5 py-12 sm:py-16">
      <Eyebrow tone="text-vedeni">MODUL 01 · VEDENÍ / MAJITEL</Eyebrow>
      <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
        Analýza pro vedení
      </h1>

      <div className="mt-8">
        <Reveal>
          <RobotGuide
            messages={GUIDE_MESSAGES}
            finalHint="↓ kroky analýzy níže"
            onDone={revealSteps}
            backTo="/vyber"
            backLabel="Zpět na volbu perspektivy"
          />
        </Reveal>
      </div>

      {/* Osa kroků: před briefingem v mlze, pak se vyjasní */}
      <div ref={stepsRef} className="relative scroll-mt-24 pt-14">
        <motion.div
          aria-hidden={!showSteps}
          initial={false}
          animate={{
            filter: showSteps ? "blur(0px)" : "blur(7px)",
            opacity: showSteps ? 1 : 0.35,
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={showSteps ? "" : "pointer-events-none select-none"}
        >
          <div className="mb-7 flex items-center gap-3">
            <Eyebrow>CO VÁS ČEKÁ — 5 KROKŮ ANALÝZY</Eyebrow>
            <div className="telemetry-sep flex-1" aria-hidden />
          </div>
          <StepTimeline active={showSteps} />
        </motion.div>

        {/* popisek nad mlhou */}
        <AnimatePresence>
          {!showSteps && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 z-10 flex items-center justify-center"
            >
              <span className="rounded-full border border-line bg-bg/70 px-5 py-2 font-mono text-[11px] font-semibold tracking-label text-dim backdrop-blur-sm">
                DOKONČETE BRIEFING S PRŮVODCEM — KROKY SE VYJASNÍ
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
