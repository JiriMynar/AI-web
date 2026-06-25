import { ReactNode, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Eyebrow, Panel, Reveal } from "../../design/primitives";
import { useSeo } from "../../lib/seo";

/** HR — interaktivní stavěč popisu pozice. Z reálné práce, ne z buzzwordů. Bez vazeb na jiné role. */

type Opt = { v: string; t: string; h?: string };

type State = {
  archetype: string;
  level: string;
  forma: string;
  focus: string;
  data: string;
  it: string;
  tasks: string[];
  skills: string[];
  regs: string[];
  jazyky: string[];
  cil: string;
};

type SingleKey = "archetype" | "level" | "forma" | "focus" | "data" | "it" | "cil";

const ARCHETYPY: Opt[] = [
  { v: "koordinator", t: "Interní koordinátor", h: "Generalista, který táhne adopci a koordinuje. Vybírá hotové nástroje, vede piloty; hloubkový vývoj si přizve zvenčí." },
  { v: "specialista", t: "Implementační specialista", h: "Hands-on člověk, který řešení reálně staví — mapuje, připraví data, postaví automatizaci či vyhledávání a napojí systémy." },
  { v: "partner", t: "Externí partner", h: "Koupená kapacita na kontrakt — konzultant nebo dodavatel, ne zaměstnanec. Ohraničená spolupráce s předáním know-how." },
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
  { v: "system", t: "Ucelený systém / ERP", h: "Jeden velký program, ve kterém běží hlavní firemní agenda. ERP = systém pro řízení podniku (např. SAP, Helios, Money, Pohoda)." },
];
const ITO: Opt[] = [
  { v: "ano", t: "Máme vlastní IT" },
  { v: "ne", t: "Nemáme vlastní IT" },
];
const REGS: Opt[] = [
  { v: "gdpr", t: "Osobní údaje (GDPR)", h: "Evropská pravidla ochrany osobních údajů — jména, kontakty, údaje o zákaznících a zaměstnancích." },
  { v: "aiakt", t: "AI rozhoduje o lidech (AI Act)", h: "Evropský zákon o AI. Když AI rozhoduje o lidech (nábor, hodnocení, úvěry), platí přísnější povinnosti." },
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
      { v: "proces", t: "Mapování procesů", h: "Rozkreslit, jak práce dnes reálně probíhá krok za krokem — a najít, kde se zdržuje a kde by AI pomohla." },
      { v: "data", t: "Příprava a čištění dat", h: "Dát firemní data do pořádku (sjednotit, opravit, doplnit), aby s nimi AI vůbec mohla pracovat." },
      { v: "nastroje", t: "Výběr a zavedení nástrojů", h: "Vybrat vhodný hotový AI nástroj, vyzkoušet ho na reálných datech a zavést do provozu." },
      { v: "integrace", t: "Napojení na systémy", h: "Propojit AI nástroj s programy, které firma už používá (účetnictví, CRM…), aby si předávaly data." },
      { v: "agenti", t: "Tvorba promptů a agentů", h: "Napsat AI přesné instrukce (prompty) a sestavit „agenty“ — pomocníky, kteří samostatně udělají zadaný úkol." },
      { v: "evaluace", t: "Vyhodnocování kvality výstupů", h: "Průběžně kontrolovat, jestli AI odpovídá správně a spolehlivě, a hlídat chyby." },
      { v: "pilot", t: "Vedení pilotu a měření", h: "Vyzkoušet AI nejdřív v malém, změřit přínos a teprve pak nasadit naplno." },
      { v: "skoleni", t: "Školení a adopce", h: "Naučit zaměstnance nástroj používat a postarat se, aby ho opravdu používali." },
      { v: "regulace", t: "Hlídání regulací", h: "Hlídat, že použití AI je v souladu se zákony (GDPR, AI Act) a interními pravidly." },
    ],
  },
  {
    label: "Administrativa",
    items: [
      { v: "faktury", t: "Vytěžování dokladů", h: "Automatické přečtení údajů z faktur a dokladů (částka, dodavatel, položky) a přenos do systému — místo ručního přepisování." },
      { v: "emaily", t: "Třídění e-mailů", h: "Automatické roztřídění příchozích e-mailů do kategorií a návrhy odpovědí." },
      { v: "texty", t: "Generování textů a překlady", h: "AI napíše nebo přeloží texty — e-maily, popisy, dokumenty — podle zadání." },
      { v: "znalosti", t: "Znalostní vyhledávání (RAG)", h: "AI odpovídá na otázky z vašich vlastních dokumentů — místo hledání ve složkách se zeptáte a dostanete odpověď i se zdrojem. (RAG.)" },
      { v: "reporty", t: "Automatické reporty", h: "Pravidelné přehledy a reporty se sestaví samy z firemních dat, bez ručního skládání v Excelu." },
      { v: "smlouvy", t: "Analýza smluv", h: "AI pročte smlouvy a dokumenty, vytáhne klíčové údaje, porovná je a upozorní na rizika." },
    ],
  },
  {
    label: "Výroba",
    items: [
      { v: "vyrReporting", t: "Výrobní reporting", h: "Přehledy o výrobě (kolik se vyrobilo, prostoje, efektivita) automaticky z dat, ne ručním přepisováním." },
      { v: "iot", t: "Sběr dat ze strojů (IoT/MES)", h: "Sbírání dat přímo z výrobních strojů a čidel. IoT = připojené stroje a senzory, MES = systém řízení výroby." },
      { v: "kvalita", t: "Vizuální kontrola kvality", h: "Kamera s AI kontroluje kvalitu výrobků a hlídá vady — rychleji a spolehlivěji než okem." },
      { v: "udrzba", t: "Prediktivní údržba", h: "AI ze strojních dat předpoví, kdy se stroj blíží poruše, aby se opravil dřív, než se rozbije." },
      { v: "planovani", t: "Plánování výroby", h: "AI pomáhá rozvrhnout zakázky, kapacity strojů a materiál efektivněji." },
    ],
  },
  {
    label: "Servis a obchod",
    items: [
      { v: "chatbot", t: "Zákaznický chatbot", h: "Automatický asistent, který odpovídá zákazníkům na časté dotazy nad vašimi produkty a podmínkami." },
      { v: "voice", t: "Hlasový asistent / přepis hovorů", h: "AI přepíše telefonní hovory do textu a vyhodnotí je, nebo zákazníkům odpovídá hlasem." },
      { v: "trideni", t: "Třídění požadavků", h: "Příchozí zákaznické požadavky se automaticky roztřídí a nasměrují na správného člověka." },
      { v: "nabidky", t: "Tvorba nabídek", h: "AI připraví cenové nabídky a kalkulace z podkladů, historie a ceníků." },
      { v: "marketing", t: "Marketingový obsah", h: "AI tvoří texty na web, sociální sítě a kampaně — s kontrolou kvality a faktů." },
      { v: "crm", t: "Zápisy do CRM", h: "Po schůzkách a hovorech se zápisy a úkoly samy doplní do systému pro řízení obchodu (CRM)." },
    ],
  },
];

const TASK_LINE: Record<string, string> = {
  proces: "Zmapovat vybrané procesy — popsat kroky, najít vlastníky a výjimky a určit, kde má AI smysl.",
  data: "Připravit a vyčistit data pro konkrétní použití — audit, sjednocení zdrojů, doplnění chybějícího.",
  nastroje: "Vybrat vhodné nástroje, otestovat je na reálných datech a zavést — bez zbytečného vendor lock-inu.",
  integrace: "Napojit nástroje na stávající systémy a ohlídat přístupy a bezpečnost.",
  agenti: "Stavět a udržovat AI prompty a asistenty (agenty) pro konkrétní úlohy.",
  evaluace: "Vyhodnocovat kvalitu a spolehlivost výstupů AI a držet je v mezích.",
  pilot: "Vést pilot na jednom procesu — dohodnout měřitelné kritérium a změřit přínos před nasazením i po něm.",
  skoleni: "Naučit lidi nástroje používat a sledovat skutečnou adopci, ne jen formální nasazení.",
  regulace: "Ohlídat GDPR, AI Act a interní pravidla — co se smí, kam smí data a kdo za to odpovídá.",
  faktury: "Zavést vytěžování dokladů (faktury, objednávky, dodací listy) rovnou do systému.",
  emaily: "Nastavit třídění a návrhy odpovědí na příchozí e-maily — kategorizace a směrování.",
  texty: "Zavést generování textů, e-mailů a překladů s kontrolou před odesláním.",
  znalosti: "Postavit znalostní vyhledávání nad firemními dokumenty (RAG) — odpovědi místo hledání.",
  reporty: "Postavit automatické reporty z firemních dat.",
  smlouvy: "Zavést analýzu smluv a dokumentů — kontrola, porovnání, vytažení klíčových údajů.",
  vyrReporting: "Postavit výrobní reporting a přehledy (výroba, prostoje, OEE) bez ručního přepisování.",
  iot: "Zajistit sběr dat ze strojů (IoT, MES, čidla) jako základ pro výrobní AI.",
  kvalita: "Připravit vizuální kontrolu kvality — sběr snímků, anotace vad, kamerová kontrola.",
  udrzba: "Rozjet prediktivní údržbu ze strojních dat — sběr, párování poruch, predikce.",
  planovani: "Zlepšit plánování výroby — zakázky, kapacity, materiál.",
  chatbot: "Postavit zákaznického asistenta nad vašimi produkty a podmínkami.",
  voice: "Nasadit hlasového asistenta nebo přepis a analýzu hovorů.",
  trideni: "Zavést automatické třídění a směrování zákaznických požadavků.",
  nabidky: "Zautomatizovat tvorbu nabídek a kalkulací z podkladů, historie a ceníků.",
  marketing: "Zavést tvorbu marketingového obsahu a kampaní s kontrolou kvality a faktů.",
  crm: "Zavést automatické zápisy a follow-upy do CRM ze schůzek, hovorů a e-mailů.",
};

const SKILLS: Opt[] = [
  { v: "promptai", t: "Prompt engineering / LLM", h: "Umí psát AI přesné instrukce (prompty), aby dávala užitečné výsledky. LLM = velký jazykový model, jádro nástrojů jako ChatGPT nebo Claude." },
  { v: "rag", t: "RAG a vektorové DB", h: "Postaví vyhledávání odpovědí nad firemními dokumenty. Vektorová databáze = úložiště, které hledá podle významu, ne jen podle slov." },
  { v: "automation", t: "Automatizační platformy", h: "Nástroje, které propojí aplikace a rozběhnou úkoly bez programování (Make, n8n, Power Automate, Zapier)." },
  { v: "python", t: "Python / skriptování", h: "Programovací jazyk nejčastější v AI — pro úpravy dat a vlastní řešení tam, kde hotový nástroj nestačí." },
  { v: "api", t: "API a integrace", h: "Umí propojit různé systémy, aby si automaticky předávaly data. API = rozhraní, přes které spolu programy „mluví“." },
  { v: "sql", t: "Data a SQL", h: "Práce s daty v databázích — jejich příprava a dotazování. SQL = jazyk pro práci s databázemi." },
  { v: "bi", t: "Reporting / BI", h: "Tvorba přehledů a dashboardů z dat (např. Power BI). BI = převod dat do srozumitelných přehledů." },
  { v: "vision", t: "Počítačové vidění", h: "AI, která „vidí“ — rozpozná obsah na fotkách a videu (kontrola kvality, čtení textu z obrázků / OCR)." },
  { v: "ml", t: "Strojové učení / data science", h: "Stavba modelů, které se učí z dat a predikují (poptávku, poruchy…). Náročnější a dražší disciplína." },
  { v: "mlops", t: "MLOps a provoz modelů", h: "Nasazení AI modelů do provozu a jejich průběžné hlídání, aby fungovaly spolehlivě i po spuštění." },
  { v: "cloud", t: "Cloud (Azure/AWS/GCP)", h: "Provoz řešení na pronajatých serverech velkých poskytovatelů (Microsoft Azure, Amazon AWS, Google Cloud)." },
  { v: "compliance", t: "GDPR a AI Act", h: "Orientace v pravidlech pro osobní data (GDPR) a v evropském zákoně o AI (AI Act) — co se smí a co je povinné." },
  { v: "procesy", t: "Procesní analýza", h: "Umí rozebrat, jak práce ve firmě probíhá, a najít, kde má AI smysl." },
  { v: "zmena", t: "Řízení změny a školení", h: "Umí zavést novinku mezi lidi — vysvětlit, vyškolit a postarat se, aby ji opravdu používali." },
];
const SKILL_LINE: Record<string, string> = {
  promptai: "Prompt engineering a práce s LLM (OpenAI, Claude apod.).",
  rag: "Vyhledávání nad dokumenty — RAG, vektorové databáze.",
  automation: "Automatizační platformy (Make, n8n, Power Automate, Zapier).",
  python: "Python / skriptování.",
  api: "Práce s API a integrace systémů.",
  sql: "Datová příprava a SQL.",
  bi: "Reporting a BI (Power BI, dashboardy).",
  vision: "Počítačové vidění — kontrola kvality, OCR.",
  ml: "Strojové učení / datová věda.",
  mlops: "MLOps — nasazení a provoz modelů.",
  cloud: "Cloud (Azure, AWS nebo GCP).",
  compliance: "GDPR a AI Act v praxi.",
  procesy: "Procesní analýza a mapování.",
  zmena: "Řízení změny a školení lidí.",
};

/** Mapování úkolů na zaměření (specializaci) — z něj se odvodí název pozice. */
const SPEC_OF: Record<string, string> = {
  faktury: "automatizace", emaily: "automatizace", texty: "automatizace", smlouvy: "automatizace",
  reporty: "data", data: "data", znalosti: "data",
  integrace: "integrace", nastroje: "integrace",
  vyrReporting: "vyroba", iot: "vyroba", kvalita: "vyroba", udrzba: "vyroba", planovani: "vyroba",
  chatbot: "konverzace", voice: "konverzace", trideni: "konverzace",
  nabidky: "obchod", marketing: "obchod", crm: "obchod",
};
const SPEC_TITLE: Record<string, string> = {
  automatizace: "automatizaci procesů",
  data: "data a reporting",
  integrace: "integrace a napojení systémů",
  vyroba: "AI ve výrobě",
  konverzace: "konverzační AI a chatboty",
  obchod: "AI v obchodu",
};
const SPEC_ALIASES: Record<string, string> = {
  automatizace: "AI automatizér, automation engineer, AI konzultant",
  data: "datový/AI specialista, data engineer, BI specialista",
  integrace: "integrační specialista, AI engineer, solutions engineer",
  vyroba: "specialista na výrobní AI, ML/vision engineer",
  konverzace: "chatbot specialista, conversational AI engineer",
  obchod: "AI specialista pro obchod, RevOps/CRM specialista",
};
const LEVEL_PREFIX: Record<string, string> = { junior: "junior ", medior: "", senior: "senior " };

/** Archetyp mění víc než název — kontext, alternativní názvy, pásmo mzdy. */
const ARCH_ALIASES: Record<string, string> = {
  koordinator: "AI koordinátor, AI champion, interní AI lead",
  partner: "AI konzultant, externí AI dodavatel, AI integrátor na kontrakt",
};
const ARCH_LEAD: Record<string, string> = {
  koordinator: "Hledáme člověka, který zavádění AI povede a zkoordinuje — rozhýbe lidi, vybere hotové nástroje a dotáhne piloty; hloubkový vývoj si v případě potřeby přizve zvenčí.",
  specialista: "Hledáme člověka, který řešení reálně postaví — od mapování přes data a nástroje až k tomu, aby výsledek lidé používali.",
  partner: "Hledáme externího partnera na konkrétní záměr — rychlý a ověřený start bez náborového rizika a s povinným předáním know-how.",
};

/** Orientační mzda podle profilu (Morava). Měsíčně v tis. Kč; pro externí/partnera hodinově v Kč. */
const ARCH_SALARY: Record<string, Record<string, [number, number]>> = {
  koordinator: { junior: [38, 58], medior: [55, 82], senior: [78, 115] },
  specialista: { junior: [45, 70], medior: [68, 105], senior: [98, 160] },
};
const ARCH_HOURLY: Record<string, Record<string, [number, number]>> = {
  koordinator: { junior: [650, 1000], medior: [950, 1450], senior: [1350, 2000] },
  specialista: { junior: [850, 1250], medior: [1250, 1850], senior: [1750, 2700] },
  partner: { junior: [1000, 1500], medior: [1500, 2200], senior: [2000, 3200] },
};
const SPEC_BONUS: Record<string, number> = {
  automatizace: 0, konverzace: 0, obchod: 0,
  data: 10, integrace: 10, vyroba: 15,
};

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

function buildTitle(s: State, spec: string | null): string {
  let base: string;
  if (s.archetype === "partner") base = "externí konzultant pro zavádění AI" + (FOCUS_SUFFIX[s.focus] || "");
  else if (s.archetype === "specialista") base = spec ? `specialista na ${SPEC_TITLE[spec]}` : "specialista na zavádění AI";
  else base = "koordinátor zavádění AI" + (FOCUS_SUFFIX[s.focus] || "");
  const prefix = s.archetype === "partner" ? "" : LEVEL_PREFIX[s.level];
  const full = prefix + base;
  return full.charAt(0).toUpperCase() + full.slice(1);
}

const LEVEL_LABEL: Record<string, string> = { junior: "junior", medior: "medior", senior: "senior" };
const ARCH_LABEL: Record<string, string> = { koordinator: "koordinátor", specialista: "specialista", partner: "externí partner" };

type SalaryStep = { label: string; value: string; why: string };
type Salary = {
  steps: SalaryStep[];
  resultLabel: string;
  resultValue: string;
  resultWhy: string;
  region: string;
  formaNote: string;
  method: string;
  caveat: string;
};

function buildSalary(s: State, spec: string | null): Salary {
  const caveat =
    "Seniorita se v mladém oboru počítá podle dotažených projektů (typicky 3–5 let), ne podle 10 let praxe. Čísla jsou orientační, ověřte proti ISPV/CZ-ISCO.";
  const hourly = s.archetype === "partner" || s.forma === "ext";

  if (hourly) {
    const h = ARCH_HOURLY[s.archetype][s.level];
    const method =
      "Postup: hodinová sazba podle role a seniority (kalibrace ISPV/CZ-ISCO a trh), upravená podle regionu. Externí kapacita se nepřepočítává na úvazek 1:1.";
    const formaNote =
      s.archetype === "partner"
        ? "Externí partner na kontrakt → fakturace za hodinu, ne mzda."
        : "Externí spolupráce → fakturace za hodinu (Kč/h), ne měsíční mzda.";
    return {
      steps: [],
      resultLabel: `Hodinová sazba — ${LEVEL_LABEL[s.level]} ${ARCH_LABEL[s.archetype]}`,
      resultValue: `${h[0]}–${h[1]} Kč/h`,
      resultWhy:
        "Externí kapacita — sazba kryje i režii, daně a nárazovost, proto je výš než přepočet hrubé mzdy na hodinu.",
      region: "Praha a nadnárodní firmy výš; Morava spíš spodní hranice.",
      formaNote,
      method,
      caveat,
    };
  }

  const base = ARCH_SALARY[s.archetype][s.level];
  const bonus = s.archetype === "specialista" && spec ? (SPEC_BONUS[spec] ?? 0) : 0;
  const lo = base[0] + bonus;
  const hi = base[1] + bonus;

  const steps: SalaryStep[] = [];
  steps.push({
    label: `Základní pásmo — ${LEVEL_LABEL[s.level]} ${ARCH_LABEL[s.archetype]}`,
    value: `${base[0]}–${base[1]} tis.`,
    why: "Tržní pásmo pro tuhle roli a senioritu na Moravě (kalibrace ISPV/CZ-ISCO). Senior je výš než junior, protože odřídí víc sám.",
  });
  if (s.archetype === "koordinator") {
    steps.push({ label: "Příplatek za zaměření", value: "+0", why: "Koordinátor je generalista — konkrétní zaměření mzdu nemění." });
  } else if (bonus > 0 && spec) {
    steps.push({
      label: `Příplatek za zaměření — ${SPEC_TITLE[spec]}`,
      value: `+${bonus} tis.`,
      why:
        bonus >= 15
          ? "Výrobní AI a počítačové vidění patří k nejvzácnějším a nejdráž placeným zaměřením — málo lidí to umí."
          : "Data a integrace jsou hůř k sehnání než běžná administrativa, proto příplatek.",
    });
  } else if (spec) {
    steps.push({
      label: `Zaměření — ${SPEC_TITLE[spec]}`,
      value: "+0",
      why: "Automatizace, konverzace a obchod jsou na základní úrovni — bez příplatku.",
    });
  }

  const method =
    "Postup: (1) základní pásmo podle role a seniority, (2) příplatek za vzácnější zaměření, (3) úprava podle regionu a formy. Pásma jsou kalibrovaná na ISPV/CZ-ISCO a trh.";
  const formaNote =
    s.forma === "part" ? "Částečný úvazek → poměrná část měsíční mzdy." : "Plný úvazek → měsíční hrubá mzda.";

  return {
    steps,
    resultLabel: "Výsledek (Morava)",
    resultValue: `${lo}–${hi} tis. Kč / měs.`,
    resultWhy: "",
    region: "Praha a nadnárodní firmy +15–25 %; menší města a Morava spíš spodní hranice.",
    formaNote,
    method,
    caveat,
  };
}

type Line = { key: string; text: string };

type JD = {
  title: string;
  aliases: string;
  context: string;
  napln: Line[];
  neni: string[];
  must: string[];
  skills: Line[];
  skillsNote: string;
  salary: Salary;
  bonus: string[];
  prvni: string;
  forma: string;
};

function buildJD(s: State): JD {
  const spec = dominantSpec(s.tasks);
  const title = buildTitle(s, spec);
  let aliases = "";
  if (s.archetype === "specialista") aliases = spec ? SPEC_ALIASES[spec] : "";
  else aliases = ARCH_ALIASES[s.archetype];

  const cil = s.cil.trim();
  const cilText = cil
    ? `chceme ${cil}`
    : "chceme [doplňte konkrétní měřitelný cíl — např. zkrátit zpracování faktur z 8 na 3 minuty]";
  const itClause = s.it === "ne" ? " a nemáme vlastní IT oddělení" : "";
  const context = `Jsme ${FOCUS_NOUN[s.focus]} a ${cilText}. Dnes ${DATA_PHRASE[s.data]}${itClause}. ${ARCH_LEAD[s.archetype]}`;

  const order: string[] = [];
  TASK_GROUPS.forEach((g) => g.items.forEach((it) => { if (s.tasks.includes(it.v)) order.push(it.v); }));
  const napln: Line[] = order.map((v) => ({ key: v, text: TASK_LINE[v] }));

  const heavyVyroba = s.tasks.some((t) => ["kvalita", "udrzba", "vyrReporting", "planovani", "iot"].includes(t));

  // Co do role nepatří — podle archetypu
  const neni: string[] = [];
  if (s.archetype === "koordinator")
    neni.push("Nestaví sám složité integrace ani vlastní modely — na hloubkový vývoj si přizve specialistu nebo externího partnera.");
  else if (s.archetype === "partner")
    neni.push("Není to dlouhodobý úvazek — jde o ohraničenou spolupráci s povinným předáním know-how, dat a přístupů.");
  else
    neni.push("Výzkum a trénink vlastních AI modelů od nuly — pracujete s hotovými nástroji a jejich napojením.");
  if (!s.tasks.includes("integrace") && s.it === "ano")
    neni.push("Správa serverů a síťové infrastruktury — to zůstává na IT oddělení.");
  if (!heavyVyroba)
    neni.push("Vývoj pokročilé výrobní AI (strojové vidění, prediktivní údržba) — samostatný, výrazně dražší typ projektu mimo tuhle roli.");
  neni.push("Není to „samostatný projekt stranou“ — role stojí a padá se zapojením vlastníků procesů a vedení.");

  // Co musí umět — základ podle archetypu + podmíněné
  const must: string[] = [];
  if (s.archetype === "koordinator") {
    must.push("Procesní myšlení — umí vzít činnost, popsat ji a najít číslo, které se má zlepšit.");
    must.push("Vedení změny a adopce — rozhýbe lidi a dotáhne, aby nástroj opravdu používali.");
    must.push("Pragmatický výběr hotových nástrojů — koupí, když to stačí, nestaví vše od nuly.");
    must.push("Srozumitelná komunikace — vysvětlí věc majiteli i člověku z provozu bez žargonu.");
  } else if (s.archetype === "partner") {
    must.push("Doložitelné dodávky podobných projektů — reference a konkrétní výsledky, ne jen sliby.");
    must.push("Práce s daty a hotovými nástroji rychle a bez zbytečného vendor lock-inu.");
    must.push("Disciplína předání — dokumentace, export dat a přístupů, zaškolení interního týmu.");
    must.push("Srozumitelná komunikace s majitelem i provozem.");
  } else {
    must.push("Procesní myšlení — umí vzít činnost, popsat ji a najít číslo, které se má zlepšit.");
    must.push("Práce s daty — pozná, jestli jsou data použitelná, a ví, co s nimi udělat.");
    must.push("Stavba řešení z hotových nástrojů — automatizace, vyhledávání nad dokumenty, napojení.");
    must.push("Srozumitelná komunikace — vysvětlí věc majiteli i člověku z provozu bez žargonu.");
  }
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
  if (s.archetype === "specialista") {
    if (s.level === "junior") must.push("Stačí základní praxe v jedné z oblastí výše — zbytek se doučí pod vedením zkušenějšího kolegy.");
    else if (s.level === "senior") must.push("Samostatně navrhne řešení od architektury po nasazení a vede či mentoruje ostatní.");
    else must.push("Praktická zkušenost se stavbou AI/automatizačních řešení — automatizace, vyhledávání nad dokumenty, integrace.");
  } else if (s.archetype === "koordinator") {
    if (s.level === "junior") must.push("Stačí základní praxe a chuť učit se — vede menší piloty pod dohledem.");
    else if (s.level === "senior") must.push("Samostatně vede více iniciativ najednou a koordinuje i externí dodavatele.");
  } else {
    if (s.level === "senior") must.push("Samostatně odřídí celý záměr od návrhu po předání internímu týmu.");
  }

  const skills: Line[] = SKILLS.filter((k) => s.skills.includes(k.v)).map((k) => ({ key: k.v, text: SKILL_LINE[k.v] }));
  const skillsNote = s.level === "junior" ? "U juniora berte technické dovednosti spíš jako výhodu než tvrdou podmínku." : "";

  // Výhodou — podle archetypu
  const bonus: string[] = [];
  if (s.archetype === "koordinator") {
    bonus.push("Zkušenost s vedením změny a školením lidí.");
    bonus.push("Přehled v hotových AI nástrojích na trhu a jejich limitech.");
  } else if (s.archetype === "partner") {
    bonus.push("Zkušenost s nasazením u firem podobné velikosti.");
    bonus.push("Schopnost zaškolit interní tým na převzetí provozu.");
  } else {
    bonus.push("Konkrétní stack podle toho, co budete stavět (Python, automatizační platformy, datové nástroje) — výhoda, ne podmínka.");
    bonus.push("Zkušenost z vašeho oboru nebo s podobně velkou firmou.");
  }
  if (!s.regs.includes("aiakt") && !s.regs.includes("gdpr")) bonus.push("Přehled v GDPR a AI Actu.");

  const salary = buildSalary(s, spec);

  let prvni: string;
  if (s.archetype === "partner") {
    prvni = cil
      ? `Ohraničený pilot s cílem „${cil}“ a měřitelným kritériem — a předání dokumentace, dat a přístupů internímu týmu.`
      : "Ohraničený pilot na jednom procesu s měřitelným kritériem — a předání dokumentace, dat a přístupů internímu týmu. [Doplňte konkrétní cíl v poli vlevo.]";
  } else {
    prvni = cil
      ? `Do 3 měsíců: ${cil}. Konkrétně dotáhnout jeden pilot na jednom procesu s předem dohodnutým měřitelným kritériem a změřeným výchozím stavem.`
      : "Do 3 měsíců dotáhnout jeden pilot na jednom procesu — s předem dohodnutým měřitelným kritériem a změřeným výchozím stavem. [Doplňte konkrétní cíl v poli vlevo.]";
  }

  const forma =
    `Forma: ${FORMA_LABEL[s.forma]}. Zázemí: sponzor z vedení, vyhrazený čas vlastníků procesů` +
    (s.it === "ano" ? ", spolupráce s interním IT" : ", externí IT partner na integrace") +
    ".";

  return { title, aliases, context, napln, neni, must, skills, skillsNote, salary, bonus, prvni, forma };
}

function jdToText(jd: JD): string {
  const L: string[] = [];
  L.push(jd.title.toUpperCase());
  if (jd.aliases) L.push("(jiné běžné názvy: " + jd.aliases + ")");
  L.push("");
  L.push("PROČ POZICI OTEVÍRÁME");
  L.push(jd.context);
  L.push("");
  L.push("CO BUDETE DĚLAT");
  (jd.napln.length ? jd.napln.map((x) => x.text) : ["[Vyberte úkoly v nástroji.]"]).forEach((l) => L.push("• " + l));
  L.push("");
  L.push("CO MUSÍTE UMĚT");
  jd.must.forEach((l) => L.push("• " + l));
  if (jd.skills.length) {
    L.push("");
    L.push("TECHNICKÉ DOVEDNOSTI" + (jd.skillsNote ? " — " + jd.skillsNote : ""));
    jd.skills.forEach((l) => L.push("• " + l.text));
  }
  L.push("");
  L.push("VÝHODOU");
  jd.bonus.forEach((l) => L.push("• " + l));
  L.push("");
  L.push("ORIENTAČNÍ MZDA (DLE PROFILU)");
  jd.salary.steps.forEach((st) => L.push(`- ${st.label}: ${st.value}` + (st.why ? " — " + st.why : "")));
  L.push(`= ${jd.salary.resultLabel}: ${jd.salary.resultValue}` + (jd.salary.resultWhy ? " — " + jd.salary.resultWhy : ""));
  L.push("Jak se počítá: " + jd.salary.method);
  L.push("Region: " + jd.salary.region);
  L.push("Forma: " + jd.salary.formaNote);
  L.push(jd.salary.caveat);
  L.push("");
  L.push("PRVNÍ ÚKOL / JAK POZNÁME ÚSPĚCH");
  L.push(jd.prvni);
  L.push("");
  L.push(jd.forma);
  L.push("");
  L.push("MIMO ROZSAH — CO DO ROLE NEPATŘÍ");
  jd.neni.forEach((l) => L.push("✕ " + l));
  return L.join("\n");
}

function Chip({ active, onClick, hint, children }: { active: boolean; onClick: () => void; hint?: string; children: ReactNode }) {
  const button = (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      title={hint}
      className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
        active ? "border-hr bg-hr/15 text-ink" : "border-line bg-panel text-dim hover:border-faint"
      }`}
    >
      {children}
    </button>
  );
  if (!hint) return button;
  return (
    <span className="group relative inline-flex">
      {button}
      <span
        role="tooltip"
        className="pointer-events-none absolute left-1/2 top-full z-30 mt-2 w-64 -translate-x-1/2 rounded-md border border-line bg-raised px-3 py-2 text-[12px] leading-relaxed text-dim opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100">
        {hint}
      </span>
    </span>
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

/** Animovaný seznam — položka vjede (fade + sjetí + krátké zvýraznění) a při odebrání vyjede. */
function MotionBullets({
  items,
  marker = "•",
  tone = "text-hr",
  dim = false,
  flash = "rgba(255,136,150,0.14)",
}: {
  items: Line[];
  marker?: string;
  tone?: string;
  dim?: boolean;
  flash?: string;
}) {
  return (
    <ul>
      <AnimatePresence initial={false}>
        {items.map((it) => (
          <motion.li
            key={it.key}
            initial={{ opacity: 0, height: 0, x: -8, backgroundColor: flash }}
            animate={{ opacity: 1, height: "auto", x: 0, backgroundColor: "rgba(0,0,0,0)" }}
            exit={{ opacity: 0, height: 0, x: -8 }}
            transition={{ duration: 0.22, ease: "easeOut", backgroundColor: { duration: 0.7, ease: "easeOut" } }}
            className={`flex gap-2.5 overflow-hidden rounded px-1 pb-2 text-[14px] leading-relaxed ${dim ? "text-dim" : "text-ink"}`}
          >
            <span className={`mt-px ${tone}`} aria-hidden>{marker}</span>
            <span>{it.text}</span>
          </motion.li>
        ))}
      </AnimatePresence>
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
    skills: [],
    regs: [],
    jazyky: ["cestina"],
    cil: "",
  });
  const [copied, setCopied] = useState(false);

  const set = (k: SingleKey, v: string) => setS((p) => ({ ...p, [k]: v }));
  const toggle = (k: "tasks" | "skills" | "regs" | "jazyky", v: string) =>
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
            ten člověk bude doopravdy dělat a v jakém prostředí, a vpravo se skládá popis — každý zatržený řádek
            do něj vjede, takže rovnou vidíte, co která volba přidá.
          </p>
          <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-dim">
            „Specialista“ navíc není jedna pozice — záleží na <span className="text-ink">zaměření</span> (co
            staví) a <span className="text-ink">úrovni</span> (jak hluboko). A na tom, koho hledáte: koordinátor,
            specialista a externí partner mají jiné požadavky, jinou náplň i jinou mzdu.
          </p>
          <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-faint">
            Nevíte, co některé technické pojmy znamenají? Najeďte myší na tlačítko a vyskočí vysvětlení.
          </p>
        </Reveal>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        {/* Levý sloupec — požadavky */}
        <div className="space-y-7">
          <Field label="KOHO HLEDÁTE">
            {ARCHETYPY.map((o) => (
              <Chip key={o.v} active={s.archetype === o.v} onClick={() => set("archetype", o.v)} hint={o.h}>{o.t}</Chip>
            ))}
          </Field>

          <div>
            <div className="font-mono text-[11px] font-semibold tracking-label text-faint">ÚROVEŇ (SENIORITA)</div>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {LEVELY.map((o) => (
                <Chip key={o.v} active={s.level === o.v} onClick={() => set("level", o.v)} hint={o.h}>{o.t}</Chip>
              ))}
            </div>
            <p className="mt-2 text-[12px] leading-relaxed text-faint">
              V mladém oboru „senior“ ≠ 10 let praxe — rozhoduje hloubka a dotažené projekty, ne roky.
            </p>
          </div>

          <Field label="FORMA">
            {FORMY.map((o) => (
              <Chip key={o.v} active={s.forma === o.v} onClick={() => set("forma", o.v)} hint={o.h}>{o.t}</Chip>
            ))}
          </Field>
          <Field label="ZAMĚŘENÍ FIRMY">
            {FOCUS.map((o) => (
              <Chip key={o.v} active={s.focus === o.v} onClick={() => set("focus", o.v)} hint={o.h}>{o.t}</Chip>
            ))}
          </Field>
          <Field label="STAV DAT">
            {DATA.map((o) => (
              <Chip key={o.v} active={s.data === o.v} onClick={() => set("data", o.v)} hint={o.h}>{o.t}</Chip>
            ))}
          </Field>
          <Field label="VLASTNÍ IT">
            {ITO.map((o) => (
              <Chip key={o.v} active={s.it === o.v} onClick={() => set("it", o.v)} hint={o.h}>{o.t}</Chip>
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
                      <Chip key={it.v} active={s.tasks.includes(it.v)} onClick={() => toggle("tasks", it.v)} hint={it.h}>{it.t}</Chip>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {s.archetype === "specialista" && spec && (
              <p className="mt-3 text-[12px] leading-relaxed text-faint">
                Z vybraných úkolů vychází zaměření: <span className="text-hr">{SPEC_TITLE[spec]}</span> — promítne se do názvu pozice i mzdy.
              </p>
            )}
          </div>

          <Field label="CO MÁ UMĚT — DOVEDNOSTI A NÁSTROJE">
            {SKILLS.map((o) => (
              <Chip key={o.v} active={s.skills.includes(o.v)} onClick={() => toggle("skills", o.v)} hint={o.h}>{o.t}</Chip>
            ))}
          </Field>

          <Field label="REGULACE — CO PLATÍ">
            {REGS.map((o) => (
              <Chip key={o.v} active={s.regs.includes(o.v)} onClick={() => toggle("regs", o.v)} hint={o.h}>{o.t}</Chip>
            ))}
          </Field>
          <Field label="JAZYKY">
            {JAZYKY.map((o) => (
              <Chip key={o.v} active={s.jazyky.includes(o.v)} onClick={() => toggle("jazyky", o.v)} hint={o.h}>{o.t}</Chip>
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
          {jd.aliases && (
            <p className="mt-1.5 text-[12px] leading-relaxed text-faint">Jiné běžné názvy téže role: {jd.aliases}.</p>
          )}

          <PreviewBlock label="PROČ POZICI OTEVÍRÁME">
            <p className="text-[14px] leading-relaxed text-dim">{jd.context}</p>
          </PreviewBlock>

          <PreviewBlock label="CO BUDETE DĚLAT">
            {jd.napln.length ? (
              <MotionBullets items={jd.napln} />
            ) : (
              <p className="text-[14px] italic leading-relaxed text-faint">Vyberte vlevo aspoň jeden úkol — náplň sem vjede.</p>
            )}
          </PreviewBlock>

          <PreviewBlock label="CO MUSÍTE UMĚT">
            <MotionBullets items={jd.must.map((l) => ({ key: l, text: l }))} />
          </PreviewBlock>

          {jd.skills.length > 0 && (
            <PreviewBlock label="TECHNICKÉ DOVEDNOSTI">
              {jd.skillsNote && <p className="mb-2 text-[12px] italic leading-relaxed text-faint">{jd.skillsNote}</p>}
              <MotionBullets items={jd.skills} />
            </PreviewBlock>
          )}

          <PreviewBlock label="VÝHODOU">
            <MotionBullets items={jd.bonus.map((l) => ({ key: l, text: l }))} />
          </PreviewBlock>

          <PreviewBlock label="ORIENTAČNÍ MZDA (DLE PROFILU)">
            <div className="overflow-hidden rounded-md border border-line">
              {jd.salary.steps.map((st, i) => (
                <div key={i} className="border-b border-line px-3 py-2">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[13px] text-ink">{st.label}</span>
                    <span className="flex-shrink-0 font-mono text-[13px] text-dim">{st.value}</span>
                  </div>
                  {st.why && <p className="mt-0.5 text-[11px] leading-relaxed text-faint">{st.why}</p>}
                </div>
              ))}
              <div className="bg-raised px-3 py-2.5">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-mono text-[11px] tracking-label text-faint">{jd.salary.resultLabel.toUpperCase()}</span>
                  <span className="flex-shrink-0 font-mono text-[15px] font-semibold text-hr">{jd.salary.resultValue}</span>
                </div>
                {jd.salary.resultWhy && <p className="mt-1 text-[11px] leading-relaxed text-faint">{jd.salary.resultWhy}</p>}
              </div>
            </div>
            <div className="mt-3 space-y-1.5 text-[11px] leading-relaxed text-faint">
              <p><span className="text-dim">Jak se počítá: </span>{jd.salary.method}</p>
              <p><span className="text-dim">Region: </span>{jd.salary.region}</p>
              <p><span className="text-dim">Forma: </span>{jd.salary.formaNote}</p>
              <p>{jd.salary.caveat}</p>
            </div>
          </PreviewBlock>

          <PreviewBlock label="PRVNÍ ÚKOL / JAK POZNÁME ÚSPĚCH">
            <p className="text-[14px] leading-relaxed text-ink">{jd.prvni}</p>
          </PreviewBlock>

          <p className="mt-6 border-t border-line pt-4 text-[13px] leading-relaxed text-faint">{jd.forma}</p>

          {/* Mimo rozsah — odlišený blok dole, ať je jasné, že tohle do role nepatří */}
          <div className="mt-6 rounded-md border border-dashed border-line bg-bg/40 px-4 py-3">
            <div className="font-mono text-[10px] font-semibold tracking-label text-faint">MIMO ROZSAH · CO DO ROLE NEPATŘÍ</div>
            <div className="mt-2">
              <MotionBullets
                items={jd.neni.map((l) => ({ key: l, text: l }))}
                marker="✕"
                tone="text-stop"
                dim
                flash="rgba(146,166,187,0.12)"
              />
            </div>
            <p className="mt-1 text-[11px] italic leading-relaxed text-faint">
              Tyhle body píšeme do popisu schválně — aby bylo jasné, co po člověku nečekat.
            </p>
          </div>
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
