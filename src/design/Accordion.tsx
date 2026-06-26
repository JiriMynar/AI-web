import { ReactNode, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Skládací sekce (accordion) — uživatel si vybere sekci a tu si rozbalí, místo
 * jednoho dlouhého textu. Výchozí režim „jen jedna otevřená", takže se stránka
 * nikdy nestane zase jednou dlouhou zdí. Sbalené řádky ukazují kicker, titulek
 * a krátký teaser — fungují jako přehledné menu obsahu.
 *
 * Znovupoužitelné napříč moduly: barvu akcentu předáš přes accentClass
 * (text-hr/bg-hr pro HR, vedeni, spec…).
 */

export type AccordionItemData = {
  id: string;
  kicker?: string;
  title: string;
  teaser?: ReactNode;
  content: ReactNode;
};

export function Accordion({
  items,
  accentClass = "bg-hr",
  title,
  allowMultiple = false,
  defaultOpenId,
}: {
  items: AccordionItemData[];
  accentClass?: string;
  title?: string;
  allowMultiple?: boolean;
  defaultOpenId?: string;
}) {
  const [open, setOpen] = useState<string[]>(defaultOpenId ? [defaultOpenId] : []);
  const toggle = (id: string) =>
    setOpen((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : allowMultiple ? [...prev, id] : [id]));

  return (
    <div>
      {(title || items.length > 1) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title ? (
            <span className="font-mono text-[11px] font-semibold tracking-label text-faint">
              {title} · {items.length}
            </span>
          ) : (
            <span />
          )}
          <div className="flex gap-4">
            {allowMultiple && open.length < items.length && (
              <button
                type="button"
                onClick={() => setOpen(items.map((i) => i.id))}
                className="font-mono text-[10px] font-semibold tracking-wide2 text-dim underline decoration-line underline-offset-4 transition-colors hover:text-ink"
              >
                ROZBALIT VŠE
              </button>
            )}
            {open.length > 0 && (
              <button
                type="button"
                onClick={() => setOpen([])}
                className="font-mono text-[10px] font-semibold tracking-wide2 text-dim underline decoration-line underline-offset-4 transition-colors hover:text-ink"
              >
                SBALIT VŠE
              </button>
            )}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.map((item) => {
          const isOpen = open.includes(item.id);
          return (
            <div
              key={item.id}
              className={`overflow-hidden rounded-lg border bg-panel transition-colors ${isOpen ? "border-line" : "border-line/70"}`}
            >
              <button
                type="button"
                onClick={() => toggle(item.id)}
                aria-expanded={isOpen}
                className="flex w-full items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-raised/40"
              >
                <span className={`mt-1 h-5 w-1 flex-shrink-0 rounded-full ${accentClass}`} aria-hidden />
                <span className="min-w-0 flex-1">
                  {item.kicker && (
                    <span className="font-mono text-[10px] font-semibold tracking-label text-faint">{item.kicker}</span>
                  )}
                  <span className="mt-1 block text-[17px] font-semibold leading-snug text-ink">{item.title}</span>
                  {item.teaser && <span className="mt-1.5 block text-[13px] leading-relaxed text-dim">{item.teaser}</span>}
                </span>
                <svg
                  className={`mt-1.5 h-4 w-4 flex-shrink-0 text-faint transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden
                >
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut", opacity: { duration: 0.2 } }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-line px-5 py-5 sm:px-6 [&>*:first-child]:mt-0">{item.content}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
