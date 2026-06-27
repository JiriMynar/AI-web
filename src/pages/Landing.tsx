import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Eyebrow } from "../design/primitives";
import ParticleField, { ParticleFieldHandle } from "../design/ParticleField";
import { useSeo } from "../lib/seo";

/**
 * Vstupní obrazovka — tečky se hemží pozadím a magneticky táhnou k myši.
 * Kliknutí na CTA je rozmetá explozí, obsah se rozplyne a po ~1,2 s
 * se vynoří stránka výběru perspektivy.
 *
 * Pod heroem je stručná část pro toho, kdo váhá: co z toho bude mít,
 * jak to funguje a proč tomu věřit — ať skeptik neodejde rovnou.
 */

const VALUE: { dot: string; label: string; text: string; soon?: boolean }[] = [
  {
    dot: "bg-vedeni",
    label: "VEDENÍ / MAJITEL",
    text: "Rozhodovací podklad: jak náročná je implementace zrovna u vás, co je reálné hned a co až po přípravě, jaký tým budete potřebovat a jaká rizika hlídat.",
  },
  {
    dot: "bg-hr",
    label: "HR / NÁBOR",
    text: "Koho přesně hledat, co napsat a co nepsat do inzerátu, otázky na pohovor — a hotový popis pozice ke stažení nebo rovnou ke zveřejnění.",
  },
  {
    dot: "bg-spec",
    label: "AI SPECIALISTA",
    soon: true,
    text: "Postup implementace krok za krokem, verdikty proveditelnosti jednotlivých záměrů a legislativa s termíny.",
  },
];

const STEPS3: { n: string; t: string; d: string }[] = [
  { n: "01", t: "Vyberte perspektivu", d: "Vedení, HR, nebo specialista — každý dostane přesně svou část, nic navíc." },
  { n: "02", t: "Odpovězte na pár otázek", d: "O firmě, datech, procesech a lidech. Zabere to kolem pěti minut." },
  { n: "03", t: "Dostanete konkrétní výstup", d: "Sdílitelný odkazem. Žádná registrace, nic se neukládá ani neodesílá." },
];

export default function Landing() {
  useSeo(
    "Velín — průvodce implementací AI ve firmě",
    "Bezplatný interaktivní průvodce implementací AI pro české firmy. Zahajte analýzu a získejte konkrétní postup, verdikty proveditelnosti a rizika."
  );
  const reduce = useReducedMotion();
  const navigate = useNavigate();
  const field = useRef<ParticleFieldHandle>(null);
  const [leaving, setLeaving] = useState(false);

  const launch = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (leaving) return;
    if (reduce) {
      navigate("/vyber");
      return;
    }
    field.current?.explode(e.clientX, e.clientY);
    setLeaving(true);
    window.setTimeout(() => navigate("/vyber"), 1200);
  };

  return (
    <div className="relative">
      <ParticleField ref={field} />

      <motion.div
        animate={leaving ? { opacity: 0, scale: 0.94, filter: "blur(6px)" } : { opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.7, ease: "easeIn" }}
        className="relative z-10"
      >
        {/* HERO */}
        <section className="mx-auto flex min-h-[72vh] max-w-shell flex-col items-center justify-center px-5 py-16 text-center">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Eyebrow tone="text-dim">/// PRŮVODCE IMPLEMENTACÍ AI · CZ</Eyebrow>
          </motion.div>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.08, ease: "easeOut" }}
            className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-7xl"
          >
            Chcete nastartovat AI ve firmě?
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.18, ease: "easeOut" }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-dim"
          >
            Bezplatná analýza vám ukáže, co je u vás proveditelné hned, co po
            přípravě — a na čem by projekt umřel.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3, ease: "easeOut" }}
            className="mt-12"
          >
            <button
              type="button"
              onClick={launch}
              disabled={leaving}
              className="group inline-flex items-center gap-3 rounded-full bg-vedeni px-10 py-5 text-lg font-semibold text-bg shadow-[0_0_40px_rgba(79,195,247,0.35)] transition-[transform,box-shadow] duration-200 enabled:hover:-translate-y-1 enabled:hover:shadow-[0_0_60px_rgba(79,195,247,0.5)] disabled:cursor-default"
            >
              {leaving ? "Spouštím…" : "Zahájit analýzu"}
              <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </button>
          </motion.div>

          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.45 }}
            className="mt-8 font-mono text-xs tracking-wide2 text-faint"
          >
            5 minut · žádná registrace · nic se nikam neodesílá
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.62 }}
            className="mt-14 flex flex-col items-center gap-1.5 text-faint"
          >
            <span className="font-mono text-[10px] tracking-label">CO TO JE A JAK TO FUNGUJE</span>
            <span aria-hidden className="animate-bounce text-sm">↓</span>
          </motion.div>
        </section>

        {/* POD HEROEM — pro toho, kdo váhá */}
        <div className="mx-auto max-w-shell px-5 pb-24">
          {/* Co z toho budete mít */}
          <section className="border-t border-line pt-14">
            <Eyebrow tone="text-dim">CO Z TOHO BUDETE MÍT</Eyebrow>
            <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
              Konkrétní výstup pro vaši roli — ne obecné řeči o AI.
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-dim">
              Implementace AI vypadá jinak pro vedení, pro náboráře a pro člověka, který ji provádí. Velín
              dá každému přesně jeho díl — postavený na vaší situaci, ne na obecných radách z internetu.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {VALUE.map((v) => (
                <div key={v.label} className="flex flex-col rounded-lg border border-line bg-panel p-5">
                  <div className="flex items-center gap-2.5">
                    <span className={`h-2 w-2 flex-shrink-0 rounded-full ${v.dot}`} aria-hidden />
                    <span className="font-mono text-[11px] font-semibold tracking-label text-dim">{v.label}</span>
                    {v.soon && (
                      <span className="ml-auto rounded border border-line px-1.5 py-0.5 font-mono text-[9px] tracking-label text-faint">
                        PŘIPRAVUJEME
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-[14px] leading-relaxed text-dim">{v.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Jak to funguje */}
          <section className="mt-16 border-t border-line pt-14">
            <Eyebrow tone="text-dim">JAK TO FUNGUJE</Eyebrow>
            <div className="mt-8 grid gap-8 sm:grid-cols-3">
              {STEPS3.map((s) => (
                <div key={s.n}>
                  <div className="font-mono text-2xl font-semibold leading-none tracking-tight text-vedeni">{s.n}</div>
                  <h3 className="mt-3 text-[15px] font-semibold text-ink">{s.t}</h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-dim">{s.d}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Důvěra + druhé CTA */}
          <section className="mt-16 border-t border-line pt-14">
            <div className="flex flex-col gap-6 rounded-lg border border-line bg-panel px-6 py-7 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-xl">
                <h2 className="text-xl font-semibold tracking-tight">Vyzkoušejte to — nic neriskujete.</h2>
                <p className="mt-2 text-[14px] leading-relaxed text-dim">
                  Bezplatné, bez registrace, odpovědi zůstávají jen ve vašem prohlížeči. Sestavil{" "}
                  <a
                    href="https://www.linkedin.com/in/jirimynar/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-dim underline decoration-line underline-offset-4 transition-colors hover:text-ink"
                  >
                    Jiří Mynář
                  </a>{" "}
                  — specialista na zavádění AI ve firmách.
                </p>
              </div>
              <button
                type="button"
                onClick={launch}
                disabled={leaving}
                className="group inline-flex flex-shrink-0 items-center gap-2.5 rounded-full bg-vedeni px-7 py-3.5 font-semibold text-bg transition-[transform,box-shadow] duration-200 enabled:hover:-translate-y-0.5 enabled:hover:shadow-[0_0_40px_rgba(79,195,247,0.45)] disabled:cursor-default"
              >
                {leaving ? "Spouštím…" : "Zahájit analýzu"}
                <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </button>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
