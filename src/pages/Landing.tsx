import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Eyebrow } from "../design/primitives";
import { useSeo } from "../lib/seo";

/** Vstupní obrazovka — jediný cíl: dovést návštěvníka k zahájení analýzy. */
export default function Landing() {
  useSeo(
    "Velín — průvodce implementací AI ve firmě",
    "Bezplatný interaktivní průvodce implementací AI pro české firmy. Zahajte analýzu a získejte konkrétní postup, verdikty proveditelnosti a rizika."
  );
  const reduce = useReducedMotion();

  return (
    <div className="mx-auto flex max-w-shell flex-col items-center px-5 text-center">
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
          <Link
            to="/vyber"
            className="group inline-flex items-center gap-3 rounded-full bg-vedeni px-10 py-5 text-lg font-semibold text-bg shadow-[0_0_40px_rgba(79,195,247,0.35)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_0_60px_rgba(79,195,247,0.5)]"
          >
            Zahájit analýzu
            <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
        </motion.div>

        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.45 }}
          className="mt-8 font-mono text-xs tracking-wide2 text-faint"
        >
          5 minut · žádná registrace · nic se nikam neodesílá
        </motion.p>
      </section>
    </div>
  );
}
