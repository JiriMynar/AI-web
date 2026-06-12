import { Link } from "react-router-dom";
import { Eyebrow, Lamp, Reveal } from "../design/primitives";
import { useSeo } from "../lib/seo";

const ROLES = [
  {
    to: "/vedeni",
    code: "MODUL 01",
    lamp: "bg-vedeni",
    border: "hover:border-vedeni/60",
    text: "text-vedeni",
    title: "Vedení / majitel",
    desc: "Rozhodujete o zavedení AI. Uvidíte náročnost implementace, realističnost záměrů, potřebný tým a rizika, na kterých projekty umírají.",
    state: "PŘIPRAVEN",
  },
  {
    to: "/hr",
    code: "MODUL 02",
    lamp: "bg-hr",
    border: "hover:border-hr/60",
    text: "text-hr",
    title: "HR / nábor",
    desc: "Hledáte člověka na AI. Uvidíte, koho vlastně hledat, co napsat do inzerátu, co nepožadovat — a na co se ptát na pohovoru.",
    state: "VE VÝSTAVBĚ",
  },
  {
    to: "/specialista",
    code: "MODUL 03",
    lamp: "bg-spec",
    border: "hover:border-spec/60",
    text: "text-spec",
    title: "AI specialista",
    desc: "Implementaci provádíte. Uvidíte verdikty proveditelnosti, postup krok za krokem, rizika a legislativu s termíny.",
    state: "VE VÝSTAVBĚ",
  },
];

/** Výběr perspektivy — analýza se liší podle role, kterou ve firmě máte. */
export default function Vyber() {
  useSeo(
    "Vyberte svou roli — Velín",
    "Implementace AI jsou tři různé práce: vedení rozhoduje, HR hledá člověka, specialista ji provádí. Vyberte svou perspektivu."
  );

  return (
    <div className="mx-auto max-w-shell px-5">
      <section className="pb-10 pt-14 sm:pt-20">
        <Eyebrow tone="text-dim">/// KROK 1 · VOLBA PERSPEKTIVY</Eyebrow>
        <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Odkud se na AI díváte?
        </h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-dim">
          Implementace AI nejsou jedna práce, ale tři různé: vedení rozhoduje a odstraňuje
          překážky, HR hledá správného člověka, specialista ji provádí. Vyberte svou roli —
          analýza vám ukáže přesně vaši část práce.
        </p>
      </section>

      <section className="pb-16">
        <div className="grid gap-4 md:grid-cols-3">
          {ROLES.map((r, i) => (
            <Reveal key={r.to} delay={i * 0.06}>
              <Link
                to={r.to}
                className={`group flex h-full flex-col rounded-lg border border-line bg-panel p-6 shadow-panel transition-[border-color,transform] duration-200 hover:-translate-y-1 ${r.border}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-semibold tracking-label text-faint">{r.code}</span>
                  <span className="flex items-center gap-2 font-mono text-[10px] tracking-label text-faint">
                    <Lamp tone={r.lamp} pulse={r.state === "PŘIPRAVEN"} />
                    {r.state}
                  </span>
                </div>
                <h2 className={`mt-5 text-2xl font-semibold ${r.text}`}>{r.title}</h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-dim">{r.desc}</p>
                <span className="mt-6 font-mono text-xs font-semibold tracking-wide2 text-ink">
                  VSTOUPIT <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-linesoft pb-20 pt-12">
        <div className="grid gap-10 md:grid-cols-3">
          {[
            { big: "95 %", t: "pilotů GenAI nepřinese měřitelný dopad", d: "Podle MIT (2025). Příčinou není technologie, ale chybějící napojení na procesy a data — přesně to analýza hlídá." },
            { big: "60–80 %", t: "času projektu padne na data a procesy", d: "Samotná AI je menšina práce. Analýza vám řekne, kolik té neviditelné většiny vás čeká." },
            { big: "3 role", t: "tři různé práce, tři různé výstupy", d: "Vedení dostane rozhodovací podklad, HR podklad pro nábor, specialista postup. Každý jen to svoje." },
          ].map((b, i) => (
            <Reveal key={b.big} delay={i * 0.05}>
              <div>
                <div className="font-mono text-3xl font-semibold tracking-tight text-ink">{b.big}</div>
                <div className="mt-2 text-sm font-semibold text-ink">{b.t}</div>
                <p className="mt-1.5 text-sm leading-relaxed text-dim">{b.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
