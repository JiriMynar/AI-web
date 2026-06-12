import { Route, Routes } from "react-router-dom";
import { Eyebrow, Lamp, Panel, Reveal } from "../../design/primitives";
import { useSeo } from "../../lib/seo";

/** Modul SPECIALISTA — úvodní stránka + skeleton průvodce (fáze 1). Bez vazeb na ostatní role. */

function Index() {
  useSeo(
    "AI specialista — průvodce implementací AI | Velín",
    "Implementaci AI provádíte? Tento modul vám dá verdikty proveditelnosti, postup krok za krokem, rizika a legislativu s termíny."
  );
  return (
    <div className="mx-auto max-w-shell px-5 py-12 sm:py-16">
      <Eyebrow tone="text-spec">MODUL 03 · AI SPECIALISTA</Eyebrow>
      <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
        Implementaci provádíte?{" "}
        <span className="text-dim">Tady dostanete postup, ne prezentaci.</span>
      </h1>
      <p className="mt-5 max-w-2xl leading-relaxed text-dim">
        Tenhle modul je psaný z perspektivy člověka, který implementaci reálně nese: verdikty
        proveditelnosti pro každý záměr, seřazený postup krok za krokem s riziky „když to
        neuděláte“, a legislativní checklist s termíny a sankcemi.
      </p>

      <div className="mt-10 grid gap-3 md:grid-cols-2">
        {[
          { t: "Verdikty per záměr", d: "Proveditelné hned, po přípravě, nebo zatím ne — s konkrétními mezerami, které musíte zavřít první." },
          { t: "Postup krok za krokem", d: "Seřazený podle situace firmy: od vize a sponzora přes mapování a data po pilot s kritériem úspěchu." },
          { t: "Legislativa s termíny", d: "AI Act a GDPR prakticky: co platí už dnes, co od kdy, jaké sankce hrozí — a co s tím konkrétně udělat." },
          { t: "Fáze a podíly času", d: "Šest fází implementace s podílem času a rizikem přeskočení — ať víte, kde je neviditelná většina práce." },
        ].map((b, i) => (
          <Reveal key={b.t} delay={i * 0.05}>
            <Panel className="h-full px-5 py-4">
              <div className="flex items-center gap-2.5">
                <Lamp tone="bg-spec" />
                <span className="font-semibold">{b.t}</span>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-dim">{b.d}</p>
            </Panel>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-12">
        <Panel className="flex flex-col gap-3 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <Lamp tone="bg-warn" pulse />
              <span className="font-mono text-xs font-semibold tracking-label text-warn">MODUL VE VÝSTAVBĚ</span>
            </div>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-dim">
              Interaktivní průvodce pro specialisty se připravuje. Struktura otázek a výstupů je
              hotová — spouštíme postupně po modulech, aby každý byl pořádně odladěný.
            </p>
          </div>
          <span className="flex-shrink-0 rounded border border-line px-3 py-1.5 font-mono text-[10px] tracking-label text-faint">
            BRZY
          </span>
        </Panel>
      </Reveal>
    </div>
  );
}

export default function SpecialistaModule() {
  return (
    <Routes>
      <Route index element={<Index />} />
      <Route path="*" element={<Index />} />
    </Routes>
  );
}
