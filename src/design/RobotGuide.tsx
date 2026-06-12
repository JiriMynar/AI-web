import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Lamp } from "./primitives";

/**
 * Virtuální průvodce velínu — původní robot v designu řídicího panelu.
 * - jemně se vznáší, mrká, anténka pulzuje,
 * - očima sleduje prvek, na který uživatel míří (prop lookAt),
 * - mluví bublinou s psacím efektem; zprávy se proklikávají,
 * - klik na bublinu dopíše text okamžitě (skip), poslední zpráva zůstává,
 * - přístupnost: aria-live, plný respekt k prefers-reduced-motion.
 */
export default function RobotGuide({
  messages,
  lookAt = null,
}: {
  messages: string[];
  lookAt?: number | null; // -1 vlevo · 0 střed · 1 vpravo · null = před sebe
}) {
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const [chars, setChars] = useState(0);
  const timer = useRef<number | null>(null);

  const text = messages[idx] ?? "";
  const typing = chars < text.length;
  const last = idx === messages.length - 1;

  // psací efekt (při reduced-motion se text ukáže celý hned)
  useEffect(() => {
    if (reduce) {
      setChars(text.length);
      return;
    }
    setChars(0);
    timer.current = window.setInterval(() => {
      setChars((c) => {
        if (c >= text.length) {
          if (timer.current) window.clearInterval(timer.current);
          return c;
        }
        return c + 1;
      });
    }, 17);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [text, reduce]);

  const skipOrNext = () => {
    if (typing) {
      if (timer.current) window.clearInterval(timer.current);
      setChars(text.length);
    } else if (!last) {
      setIdx((i) => i + 1);
    }
  };

  // kam se dívají zorničky
  const px = lookAt === null ? 0 : lookAt * 3.2;
  const py = lookAt === null ? 0 : 2.4;

  return (
    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
      {/* Robot */}
      <motion.div
        aria-hidden
        animate={reduce ? undefined : { y: [0, -7, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
        className="flex-shrink-0"
      >
        <svg width="112" height="128" viewBox="0 0 112 128" role="img" aria-label="">
          {/* anténka s kontrolkou */}
          <line x1="56" y1="18" x2="56" y2="6" stroke="#22303F" strokeWidth="3" />
          <motion.circle
            cx="56" cy="6" r="4" fill="#43DD9A"
            animate={reduce ? undefined : { opacity: [1, 0.35, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            style={{ filter: "drop-shadow(0 0 6px #43DD9A)" }}
          />
          {/* hlava */}
          <rect x="16" y="18" width="80" height="58" rx="14" fill="#0F1722" stroke="#22303F" strokeWidth="2" />
          {/* oči — bělma */}
          <ellipse cx="40" cy="44" rx="9" ry="9" fill="#15202E" stroke="#22303F" strokeWidth="1.5" />
          <ellipse cx="72" cy="44" rx="9" ry="9" fill="#15202E" stroke="#22303F" strokeWidth="1.5" />
          {/* zorničky — sledují cíl */}
          <motion.circle
            cx="40" cy="44" r="4" fill="#4FC3F7"
            animate={{ x: px, y: py }}
            transition={{ type: "spring", stiffness: 240, damping: 20 }}
            style={{ filter: "drop-shadow(0 0 5px #4FC3F7)" }}
          />
          <motion.circle
            cx="72" cy="44" r="4" fill="#4FC3F7"
            animate={{ x: px, y: py }}
            transition={{ type: "spring", stiffness: 240, damping: 20 }}
            style={{ filter: "drop-shadow(0 0 5px #4FC3F7)" }}
          />
          {/* víčka — mrkání */}
          {!reduce && (
            <motion.g
              animate={{ scaleY: [0, 0, 1, 0] }}
              transition={{ duration: 4.4, repeat: Infinity, times: [0, 0.93, 0.965, 1] }}
              style={{ transformOrigin: "56px 44px" }}
            >
              <rect x="29" y="35" width="22" height="18" rx="9" fill="#0F1722" />
              <rect x="61" y="35" width="22" height="18" rx="9" fill="#0F1722" />
            </motion.g>
          )}
          {/* pusa */}
          <motion.rect
            x="48" y="60" width="16" height="3" rx="1.5" fill="#5C7185"
            animate={reduce || !typing ? { height: 3, y: 60 } : { height: [3, 6, 3, 5, 3], y: [60, 58.5, 60, 59, 60] }}
            transition={{ duration: 0.5, repeat: typing ? Infinity : 0 }}
          />
          {/* krk + tělo s proužky rolí */}
          <rect x="48" y="76" width="16" height="6" fill="#15202E" />
          <rect x="28" y="82" width="56" height="38" rx="10" fill="#0F1722" stroke="#22303F" strokeWidth="2" />
          <rect x="38" y="92" width="36" height="4" rx="2" fill="#4FC3F7" opacity="0.9" />
          <rect x="38" y="100" width="24" height="4" rx="2" fill="#FF8896" opacity="0.9" />
          <rect x="38" y="108" width="30" height="4" rx="2" fill="#43DD9A" opacity="0.9" />
        </svg>
      </motion.div>

      {/* Bublina */}
      <div className="relative w-full max-w-xl">
        {/* ocásek bubliny — na mobilu nahoru k robotovi, na desktopu doleva */}
        <div aria-hidden className="absolute -top-2 left-10 h-4 w-4 rotate-45 border-l border-t border-line bg-panel sm:-left-2 sm:top-1/2 sm:-mt-2 sm:border-b sm:border-t-0" />
        <button
          type="button"
          onClick={skipOrNext}
          disabled={!typing && last}
          aria-label={typing ? "Dopsat zprávu" : last ? undefined : "Další zpráva"}
          className="w-full rounded-lg border border-line bg-panel px-5 py-4 text-left shadow-panel transition-colors enabled:hover:border-faint disabled:cursor-default"
        >
          <div className="flex items-center gap-2 font-mono text-[10px] font-semibold tracking-label text-faint">
            <Lamp tone="bg-ok" pulse={!reduce} />
            PRŮVODCE · ONLINE
          </div>
          <p aria-live="polite" className="mt-2 min-h-[3.2em] text-[15px] leading-relaxed text-ink">
            {text.slice(0, chars)}
            {typing && <span aria-hidden className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-0.5 animate-pulse bg-vedeni" />}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex gap-1.5" aria-hidden>
              {messages.map((_, i) => (
                <span key={i} className={`h-1.5 w-1.5 rounded-full ${i === idx ? "bg-vedeni" : "bg-line"}`} />
              ))}
            </div>
            <span className="font-mono text-xs font-semibold tracking-wide2 text-dim">
              {typing ? "klikněte pro dopsání" : last ? "↓ vyberte roli níže" : "pokračovat →"}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
