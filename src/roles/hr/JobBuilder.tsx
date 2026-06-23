import { ReactNode, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Eyebrow, Panel, Reveal } from "../../design/primitives";
import { useSeo } from "../../lib/seo";

/** HR — interaktivní stavěč popisu pozice. Z reálné práce, ne z buzzwordů. Bez vazeb na jiné role. */

type Opt = { v: string; t: string };

type State = {
  archetype: string;
  level: string;
  forma: string;
  focus: string;
  data: string;
  it: string;
  tasks: string[];
  regs: string[];
  jazyky: string[];
  cil: string;
};

type SingleKey = "archetype" | "level" | "forma" | "focus" | "data" | "it" | "cil";

const ARCHETYPY: Opt[] = [
  { v: "koordinator", t: "Interní koordinátor" },
  { v: "specialista", t: "Implementační specialista" },
  { v: "partner", t: "Externí partner" },
];
const LEVELY: Opt[] = [
  { v: "junior", t: "Junior" },
  { v: "medior", t: "Medior" },
  { v: "senior", t: "Senior" },
];
const FORMY: Opt[] = [
  { v: "full", t: "Plný úvazek" },
  { v: "part", t: "Částečný úvazek" },
  { v: "ext", t: "Externí spolupráce" },
];
const FOCUS: Opt[] = [
  { v: "admin", t: "Administrativa / služby" },
  { v: "vyroba", t: "Výroba" },
  { v: "obchod", t: "Obchod / e-shop" },
  { v: "kombinace", t: "Kombinace" },
];
const DATA: Opt[] = [
  { v: "papir", t: "Papír a hlavy lidí" },
  { v: "excel", t: "Excel a sdílené disky" },
  { v: "system", t: "Ucelený systém / ERP" },
];
const ITO: Opt[] = [
  { v: "ano", t: "Máme vlastní IT" },
  { v: "ne", t: "Nemáme vlastní IT" },
];
const REGS: Opt[] = [
  { v: "gdpr", t: "Osobní údaje (GDPR)" },
  { v: "aiakt", t: "AI rozhoduje o lidech (AI Act)" },
  { v: "knowhow", t: "Citlivé know-how" },
  { v: "koncern", t: "Schvaluje matka / koncern" },
];
const JAZYKY: Opt[] = [
  { v: "cestina", t: "Čeština" },
  { v: "nemcina", t: "Němčina" },
  { v: "anglictina", t: "Angličtina" },
  { v: "jine", t: "Jiné" },
];

const TASK_GROUPS: { label: string; items: Opt[] }[] = [
  {
    label: "Jádro role — zavádění",
    items: [
      { v: "proces", t: "Mapování procesů" },
      { v: "data", t: "Příprava a čištění dat" },
      { v: "nastroje", t: "Výběr a zavedení nástrojů" },
      { v: "integrace", t: "Napojení na systémy" },
      { v: "pilot", t: "Vedení pilotu a měření" },
      { v: "skoleni", t: "Školení a adopce" },
      { v: "regulace", t: "Hlídání regulací" },
    ],
  },
  {
    label: "Administrativa",
    items: [
      { v: "faktury", t: "Vytěžování dokladů" },
      { v: "emaily", t: "Třídění e-mailů" },
      { v: "reporty", t: "Automatické reporty" },
      { v: "smlouvy", t: "Analýza smluv" },
    ],
  },
  {
    label: "Výroba",
    items: [
      { v: "vyrReporting", t: "Výrobní reporting" },
      { v: "kvalita", t: "Vizuální kontrola kvality" },
      { v: "udrzba", t: "Prediktivní údržba" },
      { v: "planovani", t: "Plánování výroby" },
    ],
  },
  {
    label: "Servis a obchod",
    items: [
      { v: "chatbot", t: "Zákaznický chatbot" },
      { v: "trideni", t: "Třídění požadavků" },
      { v: "nabidky", t: "Tvorba nabídek" },
      { v: "crm", t: "Zápisy do CRM" },
    ],
  },
];

const TASK_LINE: Record<string, string> = {
  proces: "Zmapovat vybrané procesy — popsat kroky, najít vlastníky a výjimky a určit, kde má AI smysl.",
  data: "Připravit a vyčistit data pro konkrétní použití — audit, sjednocení zdrojů, doplnění chybějícího.",
  nastroje: "Vybrat vhodné nástroje, otestovat je na reálných datech a zavést — bez zbytečného vendor lock-inu.",
  integrace: "Napojit nástroje na stávající systémy a ohlídat přístupy a bezpečnost.",
  pilot: "Vést pilot na jednom procesu — dohodnout měřitelné kritérium a změřit přínos před nasazením i po něm.",
  skoleni: "Naučit lidi nástroje používat a sledovat skutečnou adopci, ne jen formální nasazení.",
  regulace: "Ohlídat GDPR, AI Act a interní pravidla — co se smí, kam smí data a kdo za to odpovídá.",
  faktury: "Zavést vytěžování dokladů (faktury, objednávky, dodací listy) rovnou do systému.",
  emaily: "Nastavit třídění a návrhy odpovědí na příchozí e-maily — kategorizace a směrování.",
  reporty: "Postavit automatické reporty z firemních dat.",
  smlouvy: "Zavést analýzu smluv a dokumentů — kontrola, porovnání, vytažení klíčových údajů.",
  vyrReporting: "Postavit výrobní reporting a přehledy (výroba, prostoje, OEE) bez ručního přepisování.",
  kvalita: "Připravit vizuální kontrolu kvality — sběr snímků, anotace vad, kamerová kontrola.",
  udrzba: "Rozjet prediktivní údržbu ze strojních dat — sběr, párování poruch, predikce.",
  planovani: "Zlepšit plánování výroby — zakázky, kapacity, materiál.",
  chatbot: "Postavit zákaznického asistenta nad vašimi produkty a podmínkami.",
  trideni: "Zavést automatické třídění a směrování zákaznických požadavků.",
  nabidky: "Zautomatizovat tvorbu nabídek a kalkulací z podkladů, historie a ceníků.",
  crm: "Zavést automatické zápisy a follow-upy do CRM ze schůzek, hovorů a e-mailů.",
};

/** Mapování úkolů na zaměření (specializaci) — z něj se odvodí název pozice. */
const SPEC_OF: Record<string, string> = {
  faktury: "automatizace", emaily: "automatizace", smlouvy: "automatizace",
  reporty: "data", data: "data",
  integrace: "integrace", nastroje: "integrace",
  vyrReporting: "vyroba", kvalita: "vyroba", udrzba: "vyroba", planovani: "vyroba",
  chatbot: "konverzace", trideni: "konverzace",
  nabidky: "obchod", crm: "obchod",
};
const SPEC_TITLE: Record<string, string> = {
  automatizace: "automatizaci procesů",
  data: "data a reporting",
  integrace: "integrace a nástroje",
  vyroba: "výrobní AI",
  konverzace: "konverzační AI",
  obchod: "obchod a CRM",
};
const LEVEL_PREFIX: Record<string, string> = { junior: "junior ", medior: "", senior: "senior " };

const FORMA_LABEL: Record<string, string> = {
  full: "plný úvazek",
  part: "částečný úvazek",
  ext: "externí spolupráce / kontrakt",
};
const FOCUS_SUFFIX: Record<string, string> = {
  vyroba: " ve výrobě",
  obchod: " v obchodu",
  admin: "",
  kombinace: "",
};
const DATA_PHRASE: Record<string, string> = {
  papir: "většina agendy běží na papíře a v hlavách lidí",
  excel: "data jsou zatím rozházená v Excelu a na sdílených discích",
  system: "hlavní agendu vedeme v uceleném systému",
};
const FOCUS_NOUN: Record<string, string> = {
  vyroba: "výrobní firma",
  obchod: "obchodní firma",
  kombinace: "firma s výrobou i administrativou",
  admin: "firma",
};

function dominantSpec(tasks: string[]): string | null {
  const counts: Record<string, number> = {};
  tasks.forEach((t) => {
    const sp = SPEC_OF[t];
    if (sp) counts[sp] = (counts[sp] || 0) + 1;
  });
  let best: string | null = null;
  let n = 0;
  Object.keys(counts).forEach((k) => {
    if (counts[k] > n) {
      n = counts[k];
      best = k;
    }
  });
  return best;
}

function buildTitle(s: State): string {
  const spec = dominantSpec(s.tasks);
  let base: string;
  if (s.archetype === "partner") base = "externí konzultant pro zavádění AI" + (FOCUS_SUFFIX[s.focus] || "");
  else if (s.archetype === "specialista") base = spec ? `specialista na ${SPEC_TITLE[spec]}` : "specialista na zavádění AI";
  else base = "koordinátor zavádění AI" + (FOCUS_SUFFIX[s.focus] || "");
  const prefix = s.archetype === "partner" ? "" : LEVEL_PREFIX[s.level];
  const full = prefix + base;
  return full.charAt(0).toUpperCase() + full.slice(1);
}

type JD = {
  title: string;
  context: string;
  napln: string[];
  neni: string[];
  must: string[];
  bonus: string[];
  prvni: string;
  forma: string;
};

function buildJD(s: State): JD {
  const title = buildTitle(s);
  const cil = s.cil.trim();

  const cilText = cil
    ? `chceme ${cil}`
    : "chceme [doplňte konkrétní měřitelný cíl — např. zkrátit zpracování faktur z 8 na 3 minuty]";
  const context =
    `Jsme ${FOCUS_NOUN[s.focus]} a ${cilText}. Dnes ${DATA_PHRASE[s.data]}` +
    (s.it === "ne" ? " a nemáme vlastní IT oddělení" : "") +
    ". Hledáme člověka, který tenhle posun dotáhne od mapování přes data a nástroje až k tomu, aby výsledek lidé reálně používali.";

  const order: string[] = [];
  TASK_GROUPS.forEach((g) => g.items.forEach((it) => { if (s.tasks.includes(it.v)) order.push(it.v); }));
  const napln = order.map((v) => TASK_LINE[v]);

  const heavyVyroba = s.tasks.some((t) => ["kvalita", "udrzba", "vyrReporting", "planovani"].includes(t));

  const neni: string[] = [];
  if (s.archetype !== "partner")
    neni.push("Výzkum a trénink vlastních AI modelů od nuly — pracujete s hotovými nástroji a jejich napojením.");
  else
    neni.push("Není to dlouhodobý úvazek — jde o ohraničenou spolupráci s povinným předáním know-how.");
  if (!s.tasks.includes("integrace") && s.it === "ano")
    neni.push("Správa serverů a síťové infrastruktury — to zůstává na IT oddělení.");
  if (!heavyVyroba)
    neni.push("Vývoj pokročilé výrobní AI (strojové vidění, prediktivní údržba) — to je samostatný, výrazně dražší typ projektu mimo tuhle roli.");
  neni.push("Není to „samostatný projekt stranou“ — role stojí a padá se zapojením vlastníků procesů a vedení.");

  const must: string[] = [
    "Procesní myšlení — umí vzít činnost, popsat ji a najít číslo, které se má zlepšit.",
    "Práce s daty — pozná, jestli jsou data použitelná, a ví, co s nimi udělat.",
    "Srozumitelná komunikace — vysvětlí věc majiteli i člověku z provozu bez žargonu.",
  ];
  if (s.tasks.includes("integrace") || s.it === "ne")
    must.push("Orientace v napojování nástrojů na systémy (API, import a export dat).");
  if (s.data === "papir" || s.data === "excel")
    must.push("Zkušenost s uvedením rozházených dat do použitelné podoby.");
  if (s.regs.includes("aiakt"))
    must.push("Znalost povinností u vysoce rizikového AI dle AI Actu — lidský dohled, dokumentace, transparentnost.");
  else if (s.regs.includes("gdpr") || s.regs.includes("knowhow"))
    must.push("Základní orientace v GDPR a ochraně citlivých dat.");
  if (s.focus === "vyroba" || s.focus === "kombinace" || heavyVyroba)
    must.push("Zkušenost z výrobního / provozního (OT) prostředí.");
  const langs = s.jazyky.filter((j) => j !== "cestina");
  if (langs.length) {
    const names = langs.map((j) => JAZYKY.find((x) => x.v === j)?.t ?? "").filter((n) => n).join(", ");
    must.push(`Práce s texty v dalších jazycích: ${names}.`);
  }
  if (s.archetype === "specialista" && s.level !== "junior")
    must.push("Praktická zkušenost se stavbou AI/automatizačních řešení — vyhledávání nad dokumenty, automatizace, integrace.");
  if (s.level === "junior")
    must.push("Stačí základní praxe v jedné z oblastí výše — zbytek se doučí pod vedením zkušenějšího kolegy.");
  else if (s.level === "senior")
    must.push("Samostatně navrhne řešení od architektury po nasazení a vede či mentoruje ostatní.");

  const bonus: string[] = [
    "Konkrétní stack podle toho, co budete stavět (Python, automatizační platformy, datové nástroje) — výhoda, ne podmínka.",
    "Zkušenost z vašeho oboru nebo s podobně velkou firmou.",
  ];
  if (!s.regs.includes("aiakt") && !s.regs.includes("gdpr")) bonus.push("Přehled v GDPR a AI Actu.");
  if (s.archetype === "koordinator") bonus.push("Zkušenost s vedením změny a školením lidí.");

  const prvni = cil
    ? `Do 3 měsíců: ${cil}. Konkrétně dotáhnout jeden pilot na jednom procesu s předem dohodnutým měřitelným kritériem a změřeným výchozím stavem.`
    : "Do 3 měsíců dotáhnout jeden pilot na jednom procesu — s předem dohodnutým měřitelným kritériem a změřeným výchozím stavem. [Doplňte konkrétní cíl v poli vlevo.]";

  const forma =
    `Forma: ${FORMA_LABEL[s.forma]}. Zázemí: sponzor z vedení, vyhrazený čas vlastníků procesů` +
    (s.it === "ano" ? ", spolupráce s interním IT" : ", externí IT partner na integrace") +
    ".";

  return { title, context, napln, neni, must, bonus, prvni, forma };
}

function jdToText(jd: JD): string {
  const L: string[] = [];
  L.push(jd.title.toUpperCase());
  L.push("");
  L.push("PROČ POZICI OTEVÍRÁME");
  L.push(jd.context);
  L.push("");
  L.push("CO BUDETE DĚLAT");
  (jd.napln.length ? jd.napln : ["[Vyberte úkoly v nástroji.]"]).forEach((l) => L.push("• " + l));
  L.push("");
  L.push("CO NENÍ NÁPLNÍ");
  jd.neni.forEach((l) => L.push("• " + l));
  L.push("");
  L.push("CO MUSÍTE UMĚT");
  jd.must.forEach((l) => L.push("• " + l));
  L.push("");
  L.push("VÝHODOU");
  jd.bonus.forEach((l) => L.push("• " + l));
  L.push("");
  L.push("PRVNÍ ÚKOL / JAK POZNÁME ÚSPĚCH");
  L.push(jd.prvni);
  L.push("");
  L.push(jd.forma);
  return L.join("\n");
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
        active ? "border-hr bg-hr/15 text-ink" : "border-line bg-panel text-dim hover:border-faint"
      }`}
    >
      {children}
    </button>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="font-mono text-[11px] font-semibold tracking-label text-faint">{label}</div>
      <div className="mt-2.5 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((l, i) => (
        <li key={i} className="flex gap-2.5 text-[14px] leading-relaxed text-ink">
          <span className="mt-px text-hr" aria-hidden>•</span>
          <span>{l}</span>
        </li>
      ))}
    </ul>
  );
}

function PreviewBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mt-6">
      <div className="font-mono text-[10px] font-semibold tracking-label text-faint">{label}</div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export default function JobBuilder() {
  useSeo(
    "Stavěč popisu pozice — HR | Velín",
    "Sestavte popis pracovní pozice (job description) pro AI z reálné náplně práce — ne z buzzwordů. Z popisu je pak konečně poznat obsah práce."
  );
  const [s, setS] = useState<State>({
    archetype: "specialista",
    level: "medior",
    forma: "full",
    focus: "admin",
    data: "excel",
    it: "ano",
    tasks: [],
    regs: [],
    jazyky: ["cestina"],
    cil: "",
  });
  const [copied, setCopied] = useState(false);

  const set = (k: SingleKey, v: string) => setS((p) => ({ ...p, [k]: v }));
  const toggle = (k: "tasks" | "regs" | "jazyky", v: string) =>
    setS((p) => ({ ...p, [k]: p[k].includes(v) ? p[k].filter((x) => x !== v) : [...p[k], v] }));

  const jd = useMemo(() => buildJD(s), [s]);
  const text = useMemo(() => jdToText(jd), [jd]);
  const spec = dominantSpec(s.tasks);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt("Zkopírujte popis ručně:", text);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:py-16">
      <header>
        <div className="mb-8 flex items-center justify-between gap-3">
          <Eyebrow tone="text-hr">MODUL 02 · HR · POPIS POZICE</Eyebrow>
          <Link to="/hr" className="font-mono text-xs tracking-wide2 text-dim underline decoration-line underline-offset-4 hover:text-ink">
            ← ZPĚT NA PŘÍRUČKU
          </Link>
        </div>
        <Reveal>
          <h1 className="max-w-3xl text-[30px] font-semibold leading-tight tracking-tight sm:text-[40px]">
            Sestavte popis pozice <span className="text-dim">z reálné práce, ne z buzzwordů.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-dim">
            Z běžného inzerátu nejde poznat, co je vlastně náplň práce. Tady to jde obráceně: nakliknete, co
            ten člověk bude doopravdy dělat a v jakém prostředí, a vznikne popis, kde každý řádek odpovídá
            konkrétní činnosti — včetně toho, co náplní <span className="text-ink">není</span>, a měřitelného
            prvního úkolu.
          </p>
          <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-dim">
            „Specialista“ navíc není jedna pozice — záleží na <span className="text-ink">zaměření</span> (co
            staví) a <span className="text-ink">úrovni</span> (jak hluboko). Obojí se promítne do názvu i požadavků.
          </p>
        </Reveal>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        {/* Levý sloupec — požadavky */}
        <div className="space-y-7">
          <Field label="KOHO HLEDÁTE">
            {ARCHETYPY.map((o) => (
              <Chip key={o.v} active={s.archetype === o.v} onClick={() => set("archetype", o.v)}>{o.t}</Chip>
            ))}
          </Field>
          <Field label="ÚROVEŇ (SENIORITA)">
            {LEVELY.map((o) => (
              <Chip key={o.v} active={s.level === o.v} onClick={() => set("level", o.v)}>{o.t}</Chip>
            ))}
          </Field>
          <Field label="FORMA">
            {FORMY.map((o) => (
              <Chip key={o.v} active={s.forma === o.v} onClick={() => set("forma", o.v)}>{o.t}</Chip>
            ))}
          </Field>
          <Field label="ZAMĚŘENÍ FIRMY">
            {FOCUS.map((o) => (
              <Chip key={o.v} active={s.focus === o.v} onClick={() => set("focus", o.v)}>{o.t}</Chip>
            ))}
          </Field>
          <Field label="STAV DAT">
            {DATA.map((o) => (
              <Chip key={o.v} active={s.data === o.v} onClick={() => set("data", o.v)}>{o.t}</Chip>
            ))}
          </Field>
          <Field label="VLASTNÍ IT">
            {ITO.map((o) => (
              <Chip key={o.v} active={s.it === o.v} onClick={() => set("it", o.v)}>{o.t}</Chip>
            ))}
          </Field>

          <div>
            <div className="font-mono text-[11px] font-semibold tracking-label text-faint">
              CO BUDE DĚLAT <span className="text-hr">· vyberte konkrétní práci</span>
            </div>
            <div className="mt-3 space-y-4">
              {TASK_GROUPS.map((g) => (
                <div key={g.label}>
                  <div className="text-[12px] font-semibold text-dim">{g.label}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {g.items.map((it) => (
                      <Chip key={it.v} active={s.tasks.includes(it.v)} onClick={() => toggle("tasks", it.v)}>{it.t}</Chip>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {spec && (
              <p className="mt-3 text-[12px] leading-relaxed text-faint">
                Z vybraných úkolů vychází zaměření: <span className="text-hr">{SPEC_TITLE[spec]}</span> — promítne se do názvu pozice.
              </p>
            )}
          </div>

          <Field label="REGULACE — CO PLATÍ">
            {REGS.map((o) => (
              <Chip key={o.v} active={s.regs.includes(o.v)} onClick={() => toggle("regs", o.v)}>{o.t}</Chip>
            ))}
          </Field>
          <Field label="JAZYKY">
            {JAZYKY.map((o) => (
              <Chip key={o.v} active={s.jazyky.includes(o.v)} onClick={() => toggle("jazyky", o.v)}>{o.t}</Chip>
            ))}
          </Field>

          <div>
            <div className="font-mono text-[11px] font-semibold tracking-label text-faint">MĚŘITELNÝ CÍL (PRVNÍ ÚKOL)</div>
            <input
              value={s.cil}
              onChange={(e) => set("cil", e.target.value)}
              placeholder="např. zkrátit zpracování faktur z 8 na 3 minuty do Q3"
              className="mt-2.5 w-full rounded-md border border-line bg-panel px-3.5 py-2.5 text-[14px] text-ink placeholder:text-faint focus:border-hr focus:outline-none"
            />
            <p className="mt-2 text-[12px] leading-relaxed text-faint">
              Tohle z popisů obvykle chybí — a přitom dělá obsah práce čitelným. Bez něj zůstane v náhledu závorka k doplnění.
            </p>
          </div>
        </div>

        {/* Pravý sloupec — živý náhled */}
        <Panel className="self-start px-6 py-6 lg:sticky lg:top-6">
          <div className="flex items-center justify-between gap-3">
            <div className="font-mono text-[11px] tracking-label text-faint">NÁHLED POPISU POZICE</div>
            <button
              type="button"
              onClick={copy}
              className="flex-shrink-0 rounded-md border border-hr/50 px-3 py-1.5 font-mono text-[11px] font-semibold tracking-wide2 text-hr transition-colors hover:bg-hr/10"
            >
              {copied ? "✓ ZKOPÍROVÁNO" : "ZKOPÍROVAT"}
            </button>
          </div>

          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-ink">{jd.title}</h2>

          <PreviewBlock label="PROČ POZICI OTEVÍRÁME">
            <p className="text-[14px] leading-relaxed text-dim">{jd.context}</p>
          </PreviewBlock>

          <PreviewBlock label="CO BUDETE DĚLAT">
            {jd.napln.length ? (
              <Bullets items={jd.napln} />
            ) : (
              <p className="text-[14px] italic leading-relaxed text-faint">Vyberte vlevo aspoň jeden úkol — náplň se sem propíše.</p>
            )}
          </PreviewBlock>

          <PreviewBlock label="CO NENÍ NÁPLNÍ">
            <Bullets items={jd.neni} />
          </PreviewBlock>

          <PreviewBlock label="CO MUSÍTE UMĚT">
            <Bullets items={jd.must} />
          </PreviewBlock>

          <PreviewBlock label="VÝHODOU">
            <Bullets items={jd.bonus} />
          </PreviewBlock>

          <PreviewBlock label="PRVNÍ ÚKOL / JAK POZNÁME ÚSPĚCH">
            <p className="text-[14px] leading-relaxed text-ink">{jd.prvni}</p>
          </PreviewBlock>

          <p className="mt-6 border-t border-line pt-4 text-[13px] leading-relaxed text-faint">{jd.forma}</p>
        </Panel>
      </div>

      <Reveal className="mt-12">
        <Panel className="px-6 py-5">
          <div className="font-mono text-[11px] tracking-label text-faint">NEŽ TO ZVEŘEJNÍTE — ČEMU SE VYHNOUT</div>
          <ul className="mt-3 space-y-2.5 text-[14px] leading-relaxed text-dim">
            <li className="flex gap-2.5"><span className="text-stop" aria-hidden>✕</span><span>„5+ let zkušeností s GenAI“ — obor je v hlavním proudu pár let; odradíte realisty a přitáhnete blufaře.</span></li>
            <li className="flex gap-2.5"><span className="text-stop" aria-hidden>✕</span><span>Seznam dvaceti buzzwordů „nice to have“ — působí to, že sami nevíte, co chcete.</span></li>
            <li className="flex gap-2.5"><span className="text-stop" aria-hidden>✕</span><span>Jednorožec (senior ML + full-stack + DevOps + obchodník, a levně) — takový člověk neexistuje.</span></li>
          </ul>
          <p className="mt-3 text-[13px] leading-relaxed text-faint">
            Tenhle nástroj to do popisu schválně nedává — staví na konkrétní práci a hotových nástrojích, ne na honbě za jednorožcem.
          </p>
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
