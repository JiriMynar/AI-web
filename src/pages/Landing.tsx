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
 */
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
        className="relative z-10 mx-auto flex max-w-shell flex-col items-center px-5 text-center"
      >
        <section className="flex min-h-[72vh] flex-col items-center justify-center py-16">
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

          <motion.a
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            href="https://www.linkedin.com/in/jirimynar/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 font-mono text-[11px] tracking-label text-dim underline decoration-line underline-offset-4 transition-colors hover:text-ink"
          >
            VYTVOŘIL JIŘÍ MYNÁŘ · LINKEDIN ↗
          </motion.a>
        </section>
      </motion.div>
    </div>
  );
}
