import { Route, Routes } from "react-router-dom";
import { Eyebrow, Lamp, Panel, Reveal } from "../../design/primitives";
import { useSeo } from "../../lib/seo";

/** Modul HR — úvodní stránka + skeleton průvodce (fáze 1). Bez vazeb na ostatní role. */

function Index() {
  useSeo(
    "HR / nábor — průvodce implementací AI | Velín",
    "Hledáte člověka na AI? Tento modul vám řekne, koho vlastně hledat, co psát do inzerátu, co nepožadovat a na co se ptát na pohovoru."
  );
  return (
    <div className="mx-auto max-w-shell px-5 py-12 sm:py-16">
      <Eyebrow tone="text-hr">MODUL 02 · HR / NÁBOR</Eyebrow>
      <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
        Hledáte člověka na AI?{" "}
        <span className="text-dim">Nejdřív zjistěte, koho vlastně hledat.</span>
      </h1>
      <p className="mt-5 max-w-2xl leading-relaxed text-dim">
        Tenhle modul je psaný z perspektivy náboru: z odpovědí o vaší firmě sestaví profil
        hledaného člověka — co musí umět, co je bonus, a hlavně co do inzerátu nepsat,
        protože to odradí realisty a přitáhne fantasty.
      </p>

      <div className="mt-10 grid gap-3 md:grid-cols-2">
        {[
          { t: "Profil hledané role", d: "Generalista, nebo koordinátor týmu? Podle vaší kapacity, dat a záměrů — ne podle katalogu pozic." },
          { t: "Podklad pro inzerát", d: "Co do popisu práce napsat konkrétně za vaši firmu — záměry, výchozí stav, sponzor, měřítko úspěchu." },
          { t: "Co nepožadovat", d: "Požadavky, které kandidáty s praxí spolehlivě odradí — a proč „5 let zkušeností s GenAI“ nikdo poctivý nesplní." },
          { t: "Otázky na pohovor", d: "Otázky, na kterých poznáte praxi od prezentace — včetně správných odpovědí, které máte slyšet." },
        ].map((b, i) => (
          <Reveal key={b.t} delay={i * 0.05}>
            <Panel className="h-full px-5 py-4">
              <div className="flex items-center gap-2.5">
                <Lamp tone="bg-hr" />
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
              Interaktivní průvodce pro HR se připravuje. Struktura otázek a výstupů je hotová —
              spouštíme postupně po modulech, aby každý byl pořádně odladěný.
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

export default function HrModule() {
  return (
    <Routes>
      <Route index element={<Index />} />
      <Route path="*" element={<Index />} />
    </Routes>
  );
}
