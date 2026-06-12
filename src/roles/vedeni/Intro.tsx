import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Eyebrow, Reveal } from "../../design/primitives";
import RobotGuide from "../../design/RobotGuide";
import { useSeo } from "../../lib/seo";
import { STEPS } from "./data";

const GUIDE_MESSAGES = [
  "Vítejte v modulu pro vedení. Výsledkem analýzy bude rozhodovací podklad: celková náročnost implementace u vás ve firmě, verdikt realističnosti každého záměru, tým, který budete potřebovat — a rizikové scénáře s cestami ven.",
  "Pomůže vám vyvarovat se chyb, které dělají i zkušení manažeři, když AI zavádějí poprvé: nákup nástroje před zmapováním procesu, projekt bez vlastníka a měřitelného cíle, nebo ambice, na kterou nestačí kapacita lidí.",
  "Nástrahy se přitom liší podle profilu a stavu vaší firmy — jinde číhají u výrobce s papírovou evidencí, jinde u kanceláře plné excelů. Proto se vás zeptám na pár věcí o firmě, datech, procesech a lidech, a vše vyhodnotím přesně pro vaši situaci.",
];

/** Úvod modulu Vedení: průvodce vysvětlí výstup a nástrahy, pak odkryje kroky analýzy. */
export default function Intro() {
  useSeo(
    "Vedení / majitel — analýza implementace AI | Velín",
    "Rozhodujete o zavedení AI? Analýza vám dá rozhodovací podklad: náročnost, realističnost záměrů, potřebný tým a rizika — přesně pro stav vaší firmy."
  );
  const [showSteps, setShowSteps] = useState(false);
  const stepsRef = useRef<HTMLDivElement>(null);

  const revealSteps = () => {
    setShowSteps(true);
    // dopřát Revealu jeden frame a pak dovést pozornost ke krokům
    window.setTimeout(() => {
      stepsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 250);
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
            finalHint={showSteps ? "↓ kroky analýzy níže" : ""}
            onDone={revealSteps}
          />
        </Reveal>
      </div>

      {showSteps && (
        <div ref={stepsRef} className="scroll-mt-24 pt-14">
          <Reveal>
            <div className="mb-5 flex items-center gap-3">
              <Eyebrow>CO VÁS ČEKÁ — 5 KROKŮ ANALÝZY</Eyebrow>
              <div className="telemetry-sep flex-1" aria-hidden />
            </div>
          </Reveal>

          <div className="grid gap-3 md:grid-cols-2">
            {STEPS.map((s, i) => (
              <Reveal key={s.id} delay={i * 0.07}>
                <div className="flex h-full gap-4 rounded-lg border border-line bg-panel px-5 py-4 shadow-panel">
                  <span className="font-mono text-lg font-semibold text-vedeni">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <div className="font-semibold">{s.full}</div>
                    <p className="mt-1 text-[13px] leading-relaxed text-dim">{s.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
            <Reveal delay={STEPS.length * 0.07}>
              <div className="flex h-full flex-col justify-center rounded-lg border border-dashed border-vedeni/40 bg-vedeni/5 px-5 py-4">
                <div className="font-semibold text-vedeni">Výstup: report pro vedení</div>
                <p className="mt-1 text-[13px] leading-relaxed text-dim">
                  Náročnost, verdikty záměrů, tým, povinnosti, rizikové scénáře a pravidla z praxe.
                  Sdílitelný odkazem — nic se nikam neodesílá.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.35}>
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <Link
                to="/vedeni/pruvodce"
                className="group inline-flex items-center gap-3 rounded-full bg-vedeni px-9 py-4 text-lg font-semibold text-bg shadow-[0_0_36px_rgba(79,195,247,0.35)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_0_56px_rgba(79,195,247,0.5)]"
              >
                Spustit analýzu
                <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </Link>
              <span className="font-mono text-xs tracking-wide2 text-faint">
                5 kroků · cca 5 minut · odpovědi zůstávají jen ve vašem prohlížeči
              </span>
            </div>
          </Reveal>
        </div>
      )}
    </div>
  );
}
