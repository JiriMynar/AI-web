import { ReactNode } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { Eyebrow, Lamp, Panel, Reveal } from "../../design/primitives";
import { useSeo } from "../../lib/seo";

/** Modul HR — náborový playbook pro AI specialistu/integrátora. Bez vazeb na ostatní role. */

function Section({ kicker, title, intro, children }: {
  kicker: string; title: string; intro?: string; children: ReactNode;
}) {
  return (
    <section className="mt-16 border-t border-line pt-10">
      <Eyebrow tone="text-hr">{kicker}</Eyebrow>
      <h2 className="mt-2.5 text-2xl font-semibold tracking-tight sm:text-[28px]">{title}</h2>
      {intro && <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-dim">{intro}</p>}
      <div className="mt-8">{children}</div>
    </section>
  );
}

function SubHead({ children, tone = "text-faint" }: { children: ReactNode; tone?: string }) {
  return <h3 className={`mt-12 font-mono text-[11px] font-semibold tracking-label ${tone}`}>{children}</h3>;
}

function CheckList({ items, marker, tone }: { items: string[]; marker: string; tone: string }) {
  return (
    <ul className="mt-5 space-y-3">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-ink">
          <span className={`mt-px font-mono text-sm font-semibold ${tone}`} aria-hidden>{marker}</span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

const ARCHETYPES: { name: string; tag: string; fit: string; risk: string }[] = [
  {
    name: "Interní průvodce / koordinátor",
    tag: "Generalista, který táhne adopci a koordinuje — ne hluboký ML inženýr.",
    fit: "Sedí firmám, které hlavně potřebují rozhýbat lidi, vybrat hotové nástroje a uřídit piloty. Pro většinu menších firem je tohle ten správný první člověk.",
    risk: "Sám nepostaví složitější integraci nebo vlastní model — na to si přibere externího partnera. To je v pořádku, hlavně s tím počítejte.",
  },
  {
    name: "Implementační specialista (hands-on)",
    tag: "Umí zmapovat proces, napojit nástroje, postavit automatizaci či vyhledávání nad firemními dokumenty a ohlídat data.",
    fit: "Sedí firmám s vlastními daty a procesy, které chtějí řešení stavět, ne jen nakupovat — typicky výroba nebo silná administrativa.",
    risk: "Vzácnější a dražší. Bez opory sponzora a vyhrazeného času vlastníků procesů i ten nejlepší vyhoří nebo odejde.",
  },
  {
    name: "Externí partner místo úvazku",
    tag: "Koupená kapacita na konkrétní záměr — konzultant nebo dodavatel, ne zaměstnanec.",
    fit: "Sedí firmám, které zatím nemají dost práce na plný úvazek nebo potřebují rychlý a ověřený start bez náborového rizika.",
    risk: "Hlídejte předání know-how a závislost — vyžadujte dokumentaci, export dat a možnost kdykoliv odejít. Jinak vám partner postupně začne diktovat cenu.",
  },
];

const MUST: string[] = [
  "Procesní myšlení — umí vzít jednu činnost, popsat ji a najít číslo, které se má zlepšit.",
  "Práce s daty — pozná, jestli jsou data použitelná, a ví, co s nimi udělat, než přijde na řadu AI.",
  "Řeč s netechniky — vysvětlí věc majiteli i člověku z provozu bez žargonu.",
  "Pragmatický výběr nástrojů — sáhne po hotovém řešení, když stačí, a nestaví vše od nuly.",
  "Zná limity a rizika — halucinace, citlivá data, základy GDPR a AI Actu.",
];

const BONUS: string[] = [
  "Konkrétní technický stack (Python, vyhledávání nad dokumenty, automatizace, datové nástroje) — podle toho, co chcete stavět.",
  "Zkušenost z výroby / OT, pokud míříte na AI ve výrobě (stroje, senzory, bezpečnost provozu).",
  "Jazyky podle vašich trhů — kvalita AI se liší jazyk od jazyka.",
  "Zkušenost s regulovaným prostředím (finance, zdravotnictví, veřejný sektor), pokud se vás týká.",
];

const AD_DO: string[] = [
  "Napište konkrétní cíl — jaké číslo chcete pohnout (např. zkrátit zpracování faktury z 8 na 3 minuty).",
  "Popište výchozí stav — jaké systémy a data máte, jestli máte vlastní IT.",
  "Uveďte první úkol — pilot na jednom procesu s měřitelným kritériem, ne „digitální transformace firmy“.",
  "Řekněte, jaké zázemí dáte — sponzor z vedení, vyhrazený čas lidí z provozu.",
];

const AD_DONT: string[] = [
  "„5+ let zkušeností s GenAI“ — obor je v hlavním proudu pár let, nikdo poctivý to nesplní. Odradíte realisty a přitáhnete blufaře.",
  "Seznam dvaceti buzzwordů a frameworků „nice to have“ — působí to, že sami nevíte, co chcete.",
  "Jednorožec: senior ML výzkumník + full-stack + DevOps + obchodník, a levně. Takový člověk neexistuje, nebo si vás nevybere.",
  "Požadavek na titul nebo akademickou ML práci, když chcete nasazovat hotové nástroje — to dvě různé profese.",
];

const INTERVIEW: { q: string; good: string; flag: string }[] = [
  { q: "Kdybyste u nás začínal, jaký by byl váš první krok?", good: "Ptá se na cíl a metriku, chce zmapovat jeden proces a navrhuje malý pilot.", flag: "Hned mluví o konkrétním nástroji nebo modelu, aniž zná váš problém." },
  { q: "Popište projekt, který nedopadl podle plánu.", good: "Konkrétní příběh, přizná vlastní podíl na chybě, má jasné poučení.", flag: "„Všechno se vždycky povedlo“, nebo vina leží vždy na někom jiném." },
  { q: "Kolik práce na takovém projektu je na datech a procesech a kolik na samotné AI?", good: "Většina (60–80 %) padne na data a procesy; AI je menšina.", flag: "Tvrdí, že hlavní práce je model nebo výběr nástroje." },
  { q: "Jak poznáme, že nasazení funguje?", good: "Měřitelné kritérium dohodnuté předem a porovnání s výchozím stavem.", flag: "Mluví o dojmech a „spokojenosti uživatelů“ bez jediného čísla." },
  { q: "Co byste s AI naopak nedělal?", good: "Zná limity — halucinace, citlivá data, GDPR a AI Act, rozhodování o lidech.", flag: "„AI zvládne skoro všechno“ — bez jediné výhrady." },
];

const CANDIDATE_FLAGS: string[] = [
  "Buzzword bingo bez jediného konkrétního příkladu, co reálně dodal.",
  "Neumí věc vysvětlit jednoduše — schovává se za žargon.",
  "Práci na datech a procesech mává rukou jako nudnou.",
  "Slibuje zázraky a rychlé úspory, aniž viděl vaše data.",
  "Žádné portfolio, žádná reference, jen teorie a kurzy.",
  "O regulaci a rizicích (GDPR, AI Act, citlivá data) neřekne nic.",
];

const SALARY: { role: string; range: string; note: string }[] = [
  { role: "Interní koordinátor / průvodce", range: "45–75 tis. Kč", note: "Generalista, juniornější — adopce a koordinace." },
  { role: "Implementační specialista", range: "75–120 tis. Kč", note: "Zkušený, hands-on — staví a integruje." },
  { role: "Senior / AI architekt", range: "110–180+ tis. Kč", note: "Seniorní role, Praha nebo nadnárodní prostředí." },
  { role: "Externí konzultant / dodavatel", range: "1 200–2 800 Kč/h", note: "Koupená kapacita místo úvazku." },
];

const ONBOARDING: { title: string; body: string }[] = [
  { title: "Týden 1–2: poznat realitu, ne spustit nástroj", body: "Nový člověk nemá v prvním týdnu nasadit AI. Má projít provoz, mluvit s lidmi a vybrat s vámi jeden proces, na kterém se začne. Kdo hned tlačí nástroj, přeskakuje to nejdůležitější." },
  { title: "Týden 3–6: zmapovat a změřit jeden proces", body: "Popsat kroky, najít vlastníka, změřit výchozí stav (kolik to dnes stojí). Tady vzniká číslo, kterým se za pár měsíců doloží přínos." },
  { title: "Týden 6–12: malý pilot s jedním kritériem", body: "Ohraničený pilot, který má za úkol prokázat přínos na jednom procesu. Rychlý viditelný výsledek získá důvěru lidí i vedení — a otevře dveře k dalším krokům." },
];

function Guide() {
  useSeo(
    "HR / nábor — koho hledat na AI a jak ho poznat | Velín",
    "Náborový playbook: koho vlastně hledat na AI, co musí umět, co psát a nepsat do inzerátu, jak vést pohovor, orientační mzdy v ČR a prvních 90 dní."
  );
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
      <header>
        <div className="mb-12">
          <Eyebrow tone="text-hr">MODUL 02 · HR / NÁBOR</Eyebrow>
        </div>
        <Reveal>
          <h1 className="max-w-3xl text-[34px] font-semibold leading-tight tracking-tight sm:text-5xl">
            Hledáte člověka na AI?{" "}
            <span className="text-dim">Nejdřív zjistěte, koho vlastně hledat.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-dim">
            Tahle příručka řeší <span className="text-ink">koho</span> najmout a jak ho poznat — koho vlastně
            hledat, co musí umět a co je jen bonus, co do inzerátu napsat a co naopak ne, na čem ho na pohovoru
            prokouknete, kolik to zhruba stojí a co má zvládnout v prvních třech měsících.
          </p>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink">
            Jedno pravidlo platí nade vším: <strong>dobrý člověk na AI nezačíná nástrojem, ale otázkou, jaké
            číslo chcete pohnout.</strong> Pokud ho ještě nemáte, vraťte se o krok zpět a ujasněte si cíl —
            jinak nepoznáte, koho vlastně potřebujete.
          </p>
        </Reveal>
      </header>

      <Section
        kicker="KOHO HLEDÁTE"
        title="Tři archetypy — vyberte podle sebe, ne podle katalogu"
        intro="„Člověk na AI“ není jedna profese. Pro menší a střední firmu dávají smysl tři různé typy — a volba mezi nimi je tím nejdůležitějším náborovým rozhodnutím."
      >
        <div className="space-y-7">
          {ARCHETYPES.map((ar, i) => (
            <Reveal key={ar.name} delay={i * 0.03}>
              <div className="border-l-2 border-hr pl-4">
                <h4 className="text-[15px] font-semibold text-ink">{ar.name}</h4>
                <p className="mt-1 text-[14px] leading-relaxed text-dim">{ar.tag}</p>
                <p className="mt-2 text-[14px] leading-relaxed text-ink"><span className="font-semibold text-ok">Kdy sedí — </span>{ar.fit}</p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-faint">{ar.risk}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        kicker="CO MUSÍ UMĚT"
        title="Schopnosti, ne tituly"
        intro="Na nasazení hotových AI nástrojů nepotřebujete ML výzkumníka s doktorátem. Potřebujete někoho, kdo myslí v procesech a datech a umí mluvit s lidmi. Specifický stack je až bonus."
      >
        <SubHead tone="text-hr">MUSÍ MÍT</SubHead>
        <CheckList items={MUST} marker="✓" tone="text-hr" />
        <SubHead>BONUS PODLE VAŠICH ZÁMĚRŮ</SubHead>
        <CheckList items={BONUS} marker="+" tone="text-faint" />
      </Section>

      <Section
        kicker="INZERÁT"
        title="Co do inzerátu napsat — a co ne"
        intro="Dobrý inzerát přitáhne realisty s praxí a odradí blufaře. Špatný dělá pravý opak. Rozdíl není v délce, ale v konkrétnosti."
      >
        <SubHead tone="text-ok">NAPIŠTE KONKRÉTNĚ</SubHead>
        <CheckList items={AD_DO} marker="✓" tone="text-ok" />
        <SubHead tone="text-stop">NEPOŽADUJTE</SubHead>
        <CheckList items={AD_DONT} marker="✕" tone="text-stop" />

        <Panel className="mt-10 px-5 py-4">
          <div className="font-mono text-[11px] tracking-label text-faint">KOSTRA INZERÁTU</div>
          <div className="mt-3 space-y-2.5 text-[14px] leading-relaxed text-dim">
            <p><span className="font-semibold text-ink">Co řešíme:</span> [váš cíl jednou větou — např. zkrátit zpracování faktur z 8 na 3 minuty].</p>
            <p><span className="font-semibold text-ink">Kde jsme teď:</span> [stav dat a systémů — např. Pohoda a hodně Excelu, bez vlastního IT].</p>
            <p><span className="font-semibold text-ink">První úkol:</span> [pilot na jednom procesu s měřitelným kritériem].</p>
            <p><span className="font-semibold text-ink">Zázemí:</span> [sponzor z vedení, vyhrazený čas vlastníků procesů].</p>
            <p><span className="font-semibold text-ink">Koho hledáme:</span> [generalistu / specialistu — viz archetypy], ne seznam buzzwordů.</p>
          </div>
        </Panel>
      </Section>

      <Section
        kicker="POHOVOR"
        title="Otázky, na kterých poznáte praxi od prezentace"
        intro="U každé otázky je odpověď, kterou chcete slyšet, a varovný signál. Nejde o znalostní kvíz — jde o způsob myšlení."
      >
        <div className="space-y-6">
          {INTERVIEW.map((item, i) => (
            <Reveal key={i} delay={i * 0.02}>
              <div className="border-l-2 border-hr pl-4">
                <p className="text-[15px] font-semibold leading-snug text-ink">„{item.q}“</p>
                <p className="mt-2 text-[14px] leading-relaxed text-ink"><span className="font-semibold text-ok">Chcete slyšet — </span>{item.good}</p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-dim"><span className="font-semibold text-stop">Varovný signál — </span>{item.flag}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <SubHead tone="text-stop">ČERVENÉ VLAJKY U KANDIDÁTA</SubHead>
        <CheckList items={CANDIDATE_FLAGS} marker="✕" tone="text-stop" />
      </Section>

      <Section
        kicker="KOLIK TO STOJÍ"
        title="Orientační mzdová rozpětí (ČR)"
        intro="Hrubá měsíční mzda podle typu role. Čísla berte jako vodítko, ne jako tabulku — názvy pozic se liší firma od firmy a rozhoduje seniorita, region i obor."
      >
        <div className="divide-y divide-line border-y border-line">
          {SALARY.map((s) => (
            <div key={s.role} className="grid grid-cols-1 gap-x-6 gap-y-1 py-4 sm:grid-cols-[1fr_auto]">
              <div>
                <div className="text-[14px] font-semibold text-ink">{s.role}</div>
                <div className="mt-1 text-[13px] leading-relaxed text-dim">{s.note}</div>
              </div>
              <div className="font-mono text-[15px] font-semibold text-hr sm:text-right">{s.range}</div>
            </div>
          ))}
        </div>
        <p className="mt-5 max-w-2xl text-[13px] leading-relaxed text-faint">
          Mimo Prahu (Morava, menší města) počítejte typicky o 15–25 % níž. Rozpětí ověřte proti aktuálním
          datům — ISPV a CZ-ISCO nebo platové průzkumy. Nejdražší chyba je zaplatit výzkumníka, když potřebujete
          integrátora; druhá nejdražší je vzít nejlevnějšího a platit to časem na předělávkách.
        </p>
      </Section>

      <Section
        kicker="PRVNÍCH 90 DNÍ"
        title="Co má nový člověk zvládnout — a co po něm nečekat"
        intro="Nejčastější chyba po nástupu je čekat nasazený nástroj do měsíce. Dobrý začátek vypadá jinak: nejdřív pochopit, pak měřit, pak teprve stavět."
      >
        <div className="space-y-7">
          {ONBOARDING.map((o, i) => (
            <Reveal key={o.title} delay={i * 0.03}>
              <div className="border-l-2 border-hr pl-4">
                <h4 className="text-[15px] font-semibold text-ink">{o.title}</h4>
                <p className="mt-1.5 text-[14px] leading-relaxed text-dim">{o.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Reveal className="mt-16">
        <Panel className="flex flex-col gap-3 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-semibold">Ještě nevíte, co a jestli vůbec nasadit?</div>
            <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-dim">
              Tahle příručka řeší, <span className="text-ink">koho</span> najmout. Jestli teprve zjišťujete,
              které záměry jsou reálné a jak velký projekt vás čeká, začněte modulem pro vedení.
            </p>
          </div>
          <Link
            to="/vedeni/pruvodce"
            className="flex-shrink-0 rounded-md border border-hr/50 px-4 py-2.5 font-mono text-xs font-semibold tracking-wide2 text-hr transition-colors hover:bg-hr/10"
          >
            MODUL PRO VEDENÍ →
          </Link>
        </Panel>
      </Reveal>

      <p className="mt-6 font-mono text-[10px] tracking-label text-faint">
        ORIENTAČNÍ VÝSTUP · NENAHRAZUJE ODBORNÉ POSOUZENÍ · SESTAVIL{" "}
        <a href="https://www.linkedin.com/in/jirimynar/" target="_blank" rel="noopener noreferrer" className="underline decoration-line underline-offset-4 hover:text-ink">
          JIŘÍ MYNÁŘ — LINKEDIN
        </a>
      </p>
    </div>
  );
}

export default function HrModule() {
  return (
    <Routes>
      <Route index element={<Guide />} />
      <Route path="*" element={<Guide />} />
    </Routes>
  );
}
