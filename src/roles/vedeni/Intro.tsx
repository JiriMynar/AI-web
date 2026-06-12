import { Link } from "react-router-dom";
import { Eyebrow, Lamp, Panel, Reveal } from "../../design/primitives";
import { useSeo } from "../../lib/seo";
import { STEPS } from "./data";

export default function Intro() {
  useSeo(
    "Vedení / majitel — průvodce implementací AI | Velín",
    "Rozhodujete o zavedení AI? Za 5 minut zjistíte náročnost implementace, realističnost záměrů, potřebný tým a rizika."
  );
  return (
    <div className="mx-auto max-w-shell px-5 py-12 sm:py-16">
      <Eyebrow tone="text-vedeni">MODUL 01 · VEDENÍ / MAJITEL</Eyebrow>
      <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
        Rozhodujete o AI?{" "}
        <span className="text-dim">Tady zjistíte, do čeho jdete — dřív, než podepíšete.</span>
      </h1>
      <p className="mt-5 max-w-2xl leading-relaxed text-dim">
        Tenhle modul je psaný z perspektivy vedení: nezajímá vás, jak se konfiguruje nástroj, ale
        jestli je záměr realistický, kolik lidí a času spolkne a kde projekt může umřít.
        Odpovíte na otázky o firmě — a dostanete rozhodovací podklad.
      </p>

      <div className="mt-10 grid gap-3 md:grid-cols-2">
        {[
          { t: "Celková náročnost", d: "Startovní, standardní, náročná, nebo komplexní — podle kombinace vašich odpovědí, ne podle slibů dodavatele." },
          { t: "Verdikt každého záměru", d: "Proveditelné hned, po přípravě, nebo zatím ne — s konkrétními důvody, co chybí." },
          { t: "Tým a 8 oblastí povinností", d: "Kdo implementaci reálně ponese, co se stane bez vlastníka — a jestli na to vaše kapacita stačí." },
          { t: "Rizikové scénáře", d: "Pojmenované kombinace, na kterých implementace umírají — a cesty ven z každé." },
        ].map((b, i) => (
          <Reveal key={b.t} delay={i * 0.05}>
            <Panel className="h-full px-5 py-4">
              <div className="flex items-center gap-2.5">
                <Lamp tone="bg-vedeni" />
                <span className="font-semibold">{b.t}</span>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-dim">{b.d}</p>
            </Panel>
          </Reveal>
        ))}
      </div>

      <div className="mt-12">
        <Eyebrow>PROJDETE 5 KROKŮ</Eyebrow>
        <div className="mt-3 flex flex-col gap-2.5">
          {STEPS.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.04}>
              <div className="flex items-start gap-3">
                <span className="font-mono text-xs font-semibold text-vedeni">{String(i + 1).padStart(2, "0")}</span>
                <p className="text-sm leading-relaxed">
                  <span className="font-semibold">{s.full}</span>
                  <span className="text-dim"> — {s.desc.split(".")[0].toLowerCase()}.</span>
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mt-12 flex flex-wrap items-center gap-5">
        <Link
          to="/vedeni/pruvodce"
          className="rounded-md bg-vedeni px-7 py-3.5 text-[15px] font-semibold text-bg transition-transform duration-150 hover:-translate-y-0.5"
        >
          Spustit průvodce
        </Link>
        <span className="font-mono text-xs tracking-wide2 text-faint">5 kroků · cca 5 minut · žádná registrace, nic se nikam neodesílá</span>
      </div>
    </div>
  );
}
