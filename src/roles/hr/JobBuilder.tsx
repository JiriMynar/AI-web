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

type SingleKey = "archetype" | "level" | "forma" | "focus" | "it" | "cil" | "data";

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

/**
 * Metadata dovedností — kterým zaměřením je dovednost vlastní (specs) a jak je
 * na trhu drahá/náročná (adv = příplatek v tis. Kč; 0 = běžná). Slouží k validaci
 * profilu a k výpočtu mzdy. Univerzální dovednosti (procesy, řízení změny, GDPR,
 * prompt engineering) mají všechna zaměření — nehlásí se jako mimo profil.
 */
const ALL_SPECS = ["automatizace", "data", "integrace", "vyroba", "konverzace", "obchod"];
const SKILL_META: Record<string, { specs: string[]; adv: number }> = {
  promptai: { specs: ALL_SPECS, adv: 0 },
  rag: { specs: ["data", "konverzace", "automatizace"], adv: 3 },
  automation: { specs: ["automatizace", "obchod", "konverzace"], adv: 0 },
  python: { specs: ["data", "integrace", "vyroba"], adv: 4 },
  api: { specs: ["integrace", "automatizace", "obchod"], adv: 3 },
  sql: { specs: ["data", "obchod"], adv: 0 },
  bi: { specs: ["data", "obchod"], adv: 0 },
  vision: { specs: ["vyroba"], adv: 8 },
  ml: { specs: ["vyroba", "data"], adv: 8 },
  mlops: { specs: ["vyroba", "data"], adv: 6 },
  cloud: { specs: ["integrace", "vyroba", "data"], adv: 4 },
  compliance: { specs: ALL_SPECS, adv: 0 },
  procesy: { specs: ALL_SPECS, adv: 0 },
  zmena: { specs: ALL_SPECS, adv: 0 },
};
/** Co se k danému zaměření obvykle hodí — pro doporučení (ne tvrdé omezení). */
const SPEC_CORE_SKILLS: Record<string, string[]> = {
  automatizace: ["automation", "promptai", "api"],
  data: ["sql", "bi", "rag", "python"],
  integrace: ["api", "python", "cloud"],
  vyroba: ["vision", "ml", "mlops", "python"],
  konverzace: ["promptai", "rag"],
  obchod: ["automation", "bi", "api"],
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

/**
 * Orientační mzda podle profilu (Morava). Měsíčně v tis. Kč; pro externí/partnera
 * hodinově v Kč. POZOR: tahle čísla jsou prozatímní odhad z veřejných platových
 * přehledů a inzerce — NE oficiální statistika (AI implementační role zatím nemají
 * vlastní kód v CZ-ISCO). Budou nahrazena hodnotami z reálného mzdového průvodce.
 */
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

function skillLabels(values: string[]): string {
  return values.map((v) => SKILLS.find((k) => k.v === v)?.t ?? v).join(", ");
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

/** Příplatek za náročné/drahé dovednosti (tis. Kč), zastropovaný. */
function advPremium(skills: string[]): number {
  const sum = skills.reduce((acc, v) => acc + (SKILL_META[v] ? SKILL_META[v].adv : 0), 0);
  return Math.min(sum, 25);
}
/** Rozpis příplatku po jednotlivých dovednostech (pro detailní kalkulaci). */
function advItemsNote(skills: string[]): string {
  const items = skills
    .filter((v) => SKILL_META[v] && SKILL_META[v].adv > 0)
    .map((v) => `${SKILLS.find((k) => k.v === v)?.t ?? v} +${SKILL_META[v].adv}`);
  if (!items.length) return "";
  const sum = skills.reduce((a, v) => a + (SKILL_META[v] ? SKILL_META[v].adv : 0), 0);
  return items.join(", ") + (sum > 25 ? " (sečteno, strop +25)" : "");
}

function rng(lo: number, hi: number, unit: string): string {
  return `${lo}–${hi} ${unit}`;
}

type SalaryRow = { label: string; value: string; note?: string; strong?: boolean };
type Salary = {
  headlineLabel: string;
  headlineValue: string;
  rows: SalaryRow[];
  method: string;
  formaNote: string;
  caveat: string;
};

function buildSalary(s: State, spec: string | null): Salary {
  const caveat =
    "Všechna čísla jsou orientační odhad z veřejných platových přehledů a inzerce, ne oficiální statistika — AI implementační role zatím nemají vlastní kód v CZ-ISCO. Seniorita se v mladém oboru počítá podle dotažených projektů (typicky 3–5 let), ne podle 10 let. Ber to jako vodítko k jednání, ne jako tabulkovou mzdu.";
  const premium = advPremium(s.skills);
  const premNote = advItemsNote(s.skills);
  const hourly = s.archetype === "partner" || s.forma === "ext";
  const rows: SalaryRow[] = [];

  if (hourly) {
    const h = ARCH_HOURLY[s.archetype][s.level];
    rows.push({
      label: `Základní sazba — ${LEVEL_LABEL[s.level]} ${ARCH_LABEL[s.archetype]}`,
      value: rng(h[0], h[1], "Kč/h"),
      note: "Externí kapacita kryje i režii, daně a nárazovost — proto není 1:1 přepočet mzdy.",
    });
    const premH = premium * 12;
    if (premH > 0) rows.push({ label: "Příplatek za náročné dovednosti", value: `+${premH} Kč/h`, note: premNote });
    const lo = h[0] + premH;
    const hi = h[1] + premH;
    rows.push({ label: "Sazba — Morava", value: rng(lo, hi, "Kč/h"), strong: true });
    const pLo = Math.round((lo * 1.1) / 50) * 50;
    const pHi = Math.round((hi * 1.2) / 50) * 50;
    rows.push({ label: "Praha a nadnárodní firmy (+10–20 %)", value: rng(pLo, pHi, "Kč/h"), note: "Vyšší konkurence o lidi i náklady." });
    const formaNote =
      s.archetype === "partner"
        ? "Externí partner na kontrakt → fakturace za hodinu, ne mzda."
        : "Externí spolupráce → fakturace za hodinu (Kč/h), ne měsíční mzda.";
    const method =
      "Postup: základní hodinová sazba podle role a seniority → příplatek za náročnější dovednosti → úprava podle regionu.";
    return { headlineLabel: "Externí sazba, Morava / hodinově", headlineValue: rng(lo, hi, "Kč/h"), rows, method, formaNote, caveat };
  }

  const base = ARCH_SALARY[s.archetype][s.level];
  const specBonus = s.archetype === "specialista" && spec ? (SPEC_BONUS[spec] ?? 0) : 0;
  rows.push({
    label: `Základní pásmo — ${LEVEL_LABEL[s.level]} ${ARCH_LABEL[s.archetype]}`,
    value: rng(base[0], base[1], "tis."),
    note: "Tržní pásmo pro tuhle roli a senioritu (Morava). Senior je výš, protože víc odřídí sám.",
  });
  if (s.archetype === "koordinator") {
    rows.push({ label: "Příplatek za zaměření", value: "+0 tis.", note: "Koordinátor je generalista — konkrétní zaměření mzdu nemění." });
  } else if (specBonus > 0 && spec) {
    rows.push({
      label: `Příplatek za zaměření — ${SPEC_TITLE[spec]}`,
      value: `+${specBonus} tis.`,
      note: specBonus >= 15 ? "Výrobní AI a vidění patří k nejvzácnějším a nejdráž placeným." : "Data a integrace jsou hůř k sehnání než běžná administrativa.",
    });
  } else if (spec) {
    rows.push({ label: `Zaměření — ${SPEC_TITLE[spec]}`, value: "+0 tis.", note: "Automatizace, konverzace a obchod jsou na základní úrovni." });
  }
  if (premium > 0) rows.push({ label: "Příplatek za náročné dovednosti", value: `+${premium} tis.`, note: premNote });
  const lo = base[0] + specBonus + premium;
  const hi = base[1] + specBonus + premium;
  rows.push({ label: "Mezisoučet — Morava", value: rng(lo, hi, "tis. Kč / měs."), strong: true });
  const pLo = Math.round(lo * 1.15);
  const pHi = Math.round(hi * 1.25);
  rows.push({ label: "Praha a nadnárodní firmy (+15–25 %)", value: rng(pLo, pHi, "tis."), note: "Vyšší náklady i konkurence o lidi." });

  const formaNote = s.forma === "part" ? "Částečný úvazek → poměrná část měsíční mzdy." : "Plný úvazek → měsíční hrubá mzda.";
  const method =
    "Postup: základní pásmo podle role a seniority → příplatek za vzácnější zaměření → příplatek za náročné dovednosti → úprava podle regionu a formy.";
  return { headlineLabel: "Orientačně, Morava / měsíčně", headlineValue: rng(lo, hi, "tis. Kč / měs."), rows, method, formaNote, caveat };
}

/** Kontrola profilu — hlásí nesedící kombinace, ale neblokuje (hybridní pozice jsou OK). */
function buildWarnings(s: State, spec: string | null): string[] {
  const w: string[] = [];
  const sel = s.skills;

  if (!spec && sel.length > 0)
    w.push("Vybral jsi dovednosti, ale žádné úkoly v „Co bude dělat“. Doplň úkoly, ať je jasné, na co ty dovednosti jsou — jinak název ani mzda nesedí na obsah.");

  if (spec) {
    const off = sel.filter((v) => SKILL_META[v] && SKILL_META[v].adv > 0 && !SKILL_META[v].specs.includes(spec));
    if (off.length)
      w.push(`Dovednosti „${skillLabels(off)}“ obvykle nepatří k zaměření „${SPEC_TITLE[spec]}“. Buď je to záměrně křížená (hybridní) pozice — pak v pořádku — nebo je zvaž odebrat.`);
  }

  if (s.level === "junior") {
    const heavy = sel.filter((v) => SKILL_META[v] && SKILL_META[v].adv >= 6);
    if (heavy.length)
      w.push(`U juniora požaduješ náročné dovednosti („${skillLabels(heavy)}“). To je spíš medior/senior — zvaž vyšší úroveň. Mzda už příplatek za tyhle dovednosti počítá.`);
  }

  if (s.archetype === "koordinator") {
    const build = sel.filter((v) => SKILL_META[v] && SKILL_META[v].adv >= 4);
    if (build.length)
      w.push(`Koordinátor je generalista, ale požaduješ hloubkové dovednosti („${skillLabels(build)}“). To je spíš implementační specialista — zvaž změnu v „Koho hledáte“.`);
  }

  if (s.archetype === "specialista" && sel.length === 0 && s.tasks.length > 0)
    w.push("Nevybral jsi žádné technické dovednosti — u implementačního specialisty obvykle nějaké technické jádro být má (aspoň prompt engineering nebo automatizační platformy).");

  if (spec === "vyroba" && s.focus === "obchod")
    w.push("Úkoly vychází na výrobní AI, ale firmu jsi označil jako obchodní. Zkontroluj úkoly nebo zaměření firmy, ať si neodporují.");

  return w;
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
  warnings: string[];
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
  const warnings = buildWarnings(s, spec);

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

  return { title, aliases, context, napln, neni, must, skills, skillsNote, salary, bonus, prvni, forma, warnings };
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
  jd.salary.rows.forEach((r) => L.push(`- ${r.label}: ${r.value}` + (r.note ? " — " + r.note : "")));
  L.push("Jak se počítá: " + jd.salary.method);
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

/* ---- Výstupy: celkový náhled (HTML „papír“), Word a předání AI asistentovi ---- */

function esc(t: string): string {
  return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function htmlList(items: string[], mark: string, markColor: string, textColor: string): string {
  return (
    `<ul style="margin:6px 0 0;padding:0;list-style:none">` +
    items
      .map(
        (x) =>
          `<li style="margin:5px 0;padding-left:16px;position:relative;color:${textColor};font-size:14px;line-height:1.55"><span style="position:absolute;left:0;color:${markColor}">${mark}</span>${esc(x)}</li>`
      )
      .join("") +
    `</ul>`
  );
}

function jdToHtml(jd: JD): string {
  const H2 = (t: string) =>
    `<div style="font:700 12px/1.2 Arial,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#c0405a;margin:22px 0 0;padding-bottom:5px;border-bottom:2px solid #f0d7dc">${esc(t)}</div>`;
  const P = (t: string, color: string) => `<p style="margin:7px 0 0;font-size:14px;line-height:1.55;color:${color}">${esc(t)}</p>`;

  let html = "";
  html += `<h1 style="margin:0;font:700 23px/1.25 Arial,sans-serif;color:#111">${esc(jd.title)}</h1>`;
  if (jd.aliases) html += `<p style="margin:5px 0 0;font-size:12px;color:#888">Jiné běžné názvy téže role: ${esc(jd.aliases)}.</p>`;

  html += H2("Proč pozici otevíráme") + P(jd.context, "#333");

  html += H2("Co budete dělat");
  html += jd.napln.length ? htmlList(jd.napln.map((x) => x.text), "•", "#c0405a", "#222") : P("[Vyberte úkoly v nástroji.]", "#999");

  html += H2("Co musíte umět") + htmlList(jd.must, "•", "#c0405a", "#222");

  if (jd.skills.length) {
    html += H2("Technické dovednosti");
    if (jd.skillsNote) html += P(jd.skillsNote, "#888");
    html += htmlList(jd.skills.map((x) => x.text), "•", "#c0405a", "#222");
  }

  html += H2("Výhodou") + htmlList(jd.bonus, "•", "#c0405a", "#222");

  html += H2("Orientační mzda (dle profilu)");
  html += `<table style="border-collapse:collapse;width:100%;margin-top:6px;font-size:13px">`;
  jd.salary.rows.forEach((r) => {
    const strong = r.strong ? "font-weight:bold;background:#f6f6f6;" : "";
    html +=
      `<tr><td style="border:1px solid #e2e2e2;padding:6px 9px;vertical-align:top;color:#111;${strong}">${esc(r.label)}` +
      (r.note ? `<div style="color:#888;font-size:11px;margin-top:2px;line-height:1.4;font-weight:normal">${esc(r.note)}</div>` : "") +
      `</td><td style="border:1px solid #e2e2e2;padding:6px 9px;text-align:right;white-space:nowrap;color:#111;font-family:Consolas,monospace;${strong}">${esc(r.value)}</td></tr>`;
  });
  html += `</table>`;
  html += `<p style="margin:7px 0 0;font-size:11px;line-height:1.5;color:#888"><strong>Jak se počítá:</strong> ${esc(jd.salary.method)}<br><strong>Forma:</strong> ${esc(jd.salary.formaNote)}<br>${esc(jd.salary.caveat)}</p>`;

  html += H2("První úkol / jak poznáme úspěch") + P(jd.prvni, "#222");
  html += P(jd.forma, "#555");

  html += `<div style="font:700 12px/1.2 Arial,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#aaa;margin:22px 0 0;padding-bottom:5px;border-bottom:1px dashed #e2e2e2">Mimo rozsah — co do role nepatří</div>`;
  html += htmlList(jd.neni, "✕", "#caa", "#888");

  html += `<hr style="border:none;border-top:1px solid #e6e6e6;margin:22px 0 0">`;
  html += `<p style="margin:8px 0 0;font-size:11px;line-height:1.5;color:#999">Orientační výstup nástroje Velín — slouží jako podklad, nenahrazuje oficiální mzdovou statistiku ani právní či personální posouzení. Mzdová čísla jsou odhad z veřejných platových přehledů a inzerce; AI implementační role zatím nemají vlastní kód v CZ-ISCO.</p>`;

  return html;
}

function aiHandoffText(jd: JD): string {
  return [
    "Tohle je návrh popisu pracovní pozice pro zavádění AI v naší firmě (sestaveno nástrojem, čísla jsou orientační).",
    "Pomoz mi ho posoudit a vylepšit: na co si dát pozor, co chybí nebo přebývá, jestli požadavky sedí k senioritě a mzdě, a jestli text nepůsobí jako hon na jednorožce. Drž se reálné náplně práce, ne buzzwordů.",
    "",
    "---",
    "",
    jdToText(jd),
  ].join("\n");
}

function downloadWord(jd: JD) {
  const doc =
    `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${esc(jd.title)}</title></head>` +
    `<body style="font-family:Calibri,Arial,sans-serif;color:#222;max-width:720px;margin:0 auto">${jdToHtml(jd)}</body></html>`;
  const blob = new Blob(["\ufeff", doc], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "popis-pozice.doc";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ---- Hotový inzerát k zveřejnění — pro uchazeče, bez interních poznámek ---- */

type Posting = {
  title: string;
  subtitle: string;
  intro: string;
  doing: string[];
  want: string[];
  wantTech: string[];
  wantNote: string;
  bonus: string[];
  offer: string[];
  firstGoal: string;
  apply: string;
};

function buildPosting(jd: JD, s: State): Posting {
  const doing = jd.napln.length
    ? jd.napln.map((x) => x.text)
    : ["[Doplňte konkrétní úkoly — zatrhněte vlevo práci, kterou bude člověk dělat.]"];

  const offer: string[] = [];
  offer.push(`Mzdové rozpětí ${jd.salary.headlineValue} podle zkušeností a seniority.`);
  offer.push(`Forma spolupráce: ${FORMA_LABEL[s.forma]}.`);
  offer.push("Přímou podporu vedení a vyhrazený čas lidí z provozu — žádný „projekt do šuplíku“.");
  offer.push("Reálný dopad a prostor učit se: zavádíte AI tam, kde má měřitelný smysl.");
  offer.push("[Doplňte konkrétní benefity — např. home office, vzdělávací rozpočet, flexibilní dobu, firemní akce.]");

  const apply =
    "Zaujala vás pozice? Pošlete nám pár vět o tom, co jste reálně postavili nebo zlepšili — klidně i odkaz na ukázku nebo portfolio. Konkrétní praxe a způsob přemýšlení nás zajímají víc než tituly. [Doplňte kontakt nebo odkaz pro odpověď.]";

  return {
    title: jd.title,
    subtitle: "[Doplňte název firmy a lokalitu]",
    intro: jd.context,
    doing,
    want: jd.must,
    wantTech: jd.skills.map((x) => x.text),
    wantNote: jd.skillsNote,
    bonus: jd.bonus,
    offer,
    firstGoal: jd.prvni,
    apply,
  };
}

function postingToText(p: Posting): string {
  const L: string[] = [];
  L.push(p.title.toUpperCase());
  L.push(p.subtitle);
  L.push("");
  L.push(p.intro);
  L.push("");
  L.push("CO U NÁS BUDETE DĚLAT");
  p.doing.forEach((x) => L.push("• " + x));
  L.push("");
  L.push("KOHO HLEDÁME");
  p.want.forEach((x) => L.push("• " + x));
  if (p.wantTech.length) {
    L.push("");
    L.push("Technicky se bude hodit" + (p.wantNote ? " (" + p.wantNote + ")" : "") + ":");
    p.wantTech.forEach((x) => L.push("• " + x));
  }
  if (p.bonus.length) {
    L.push("");
    L.push("VÝHODOU");
    p.bonus.forEach((x) => L.push("• " + x));
  }
  L.push("");
  L.push("CO NABÍZÍME");
  p.offer.forEach((x) => L.push("• " + x));
  L.push("");
  L.push("VÁŠ PRVNÍ CÍL");
  L.push(p.firstGoal);
  L.push("");
  L.push("JAK SE PŘIHLÁSIT");
  L.push(p.apply);
  return L.join("\n");
}

function postingToHtml(p: Posting): string {
  const H2 = (t: string) =>
    `<div style="font:700 12px/1.2 Arial,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#c0405a;margin:22px 0 0;padding-bottom:5px;border-bottom:2px solid #f0d7dc">${esc(t)}</div>`;
  const P = (t: string, color: string) => `<p style="margin:8px 0 0;font-size:14px;line-height:1.6;color:${color}">${esc(t)}</p>`;

  let html = "";
  html += `<h1 style="margin:0;font:700 24px/1.25 Arial,sans-serif;color:#111">${esc(p.title)}</h1>`;
  html += `<p style="margin:5px 0 0;font-size:13px;color:#888">${esc(p.subtitle)}</p>`;
  html += P(p.intro, "#333");
  html += H2("Co u nás budete dělat") + htmlList(p.doing, "•", "#c0405a", "#222");
  html += H2("Koho hledáme") + htmlList(p.want, "•", "#c0405a", "#222");
  if (p.wantTech.length) {
    html += `<p style="margin:14px 0 0;font-size:13px;font-weight:bold;color:#444">Technicky se bude hodit${p.wantNote ? ` <span style="font-weight:normal;color:#888">(${esc(p.wantNote)})</span>` : ""}:</p>`;
    html += htmlList(p.wantTech, "•", "#c0405a", "#222");
  }
  if (p.bonus.length) html += H2("Výhodou") + htmlList(p.bonus, "•", "#c0405a", "#222");
  html += H2("Co nabízíme") + htmlList(p.offer, "•", "#c0405a", "#222");
  html += H2("Váš první cíl") + P(p.firstGoal, "#222");
  html += H2("Jak se přihlásit") + P(p.apply, "#333");
  html += `<hr style="border:none;border-top:1px solid #e6e6e6;margin:22px 0 0">`;
  html += `<p style="margin:8px 0 0;font-size:11px;line-height:1.5;color:#aaa">Doplňte texty v hranatých závorkách a inzerát je připravený ke zveřejnění.</p>`;
  return html;
}

function downloadPostingWord(p: Posting) {
  const doc =
    `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${esc(p.title)}</title></head>` +
    `<body style="font-family:Calibri,Arial,sans-serif;color:#222;max-width:720px;margin:0 auto">${postingToHtml(p)}</body></html>`;
  const blob = new Blob(["\ufeff", doc], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "inzerat-pozice.doc";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
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

/** Skupina polí ve formuláři — jasný nadpis s korálovým proužkem, ať se sloupec nečte jako zeď. */
function FieldGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <div className="mb-5 flex items-center gap-2.5 border-b border-line pb-2.5">
        <span className="h-4 w-1 rounded-full bg-hr" aria-hidden />
        <h3 className="text-[13px] font-semibold uppercase tracking-wide2 text-ink">{title}</h3>
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="font-mono text-[11px] font-semibold tracking-label text-dim">{label}</div>
      <div className="mt-2.5 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

/** Nadpis sekce v náhledu — korálová značka + světlý popisek, aby se odlišil od textu. */
function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-3 w-[3px] rounded-full bg-hr" aria-hidden />
      <span className="font-mono text-[11px] font-semibold uppercase tracking-label text-dim">{children}</span>
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
    <div className="mt-7 border-t border-line/60 pt-5">
      <SectionLabel>{label}</SectionLabel>
      <div className="mt-2.5">{children}</div>
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
  const [copiedAi, setCopiedAi] = useState(false);
  const [copiedPosting, setCopiedPosting] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [showSalary, setShowSalary] = useState(false);
  const [showPosting, setShowPosting] = useState(false);

  const set = (k: SingleKey, v: string) => setS((p) => ({ ...p, [k]: v }));
  const toggle = (k: "tasks" | "skills" | "regs" | "jazyky", v: string) =>
    setS((p) => ({ ...p, [k]: p[k].includes(v) ? p[k].filter((x) => x !== v) : [...p[k], v] }));

  const jd = useMemo(() => buildJD(s), [s]);
  const text = useMemo(() => jdToText(jd), [jd]);
  const posting = useMemo(() => buildPosting(jd, s), [jd, s]);
  const spec = dominantSpec(s.tasks);
  const recommended = spec ? (SPEC_CORE_SKILLS[spec] ?? []).map((v) => SKILLS.find((k) => k.v === v)?.t).filter(Boolean).join(", ") : "";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt("Zkopírujte popis ručně:", text);
    }
  };
  const copyAi = async () => {
    try {
      await navigator.clipboard.writeText(aiHandoffText(jd));
      setCopiedAi(true);
      setTimeout(() => setCopiedAi(false), 2200);
    } catch {
      window.prompt("Zkopírujte pro AI asistenta ručně:", aiHandoffText(jd));
    }
  };
  const copyPosting = async () => {
    try {
      await navigator.clipboard.writeText(postingToText(posting));
      setCopiedPosting(true);
      setTimeout(() => setCopiedPosting(false), 2200);
    } catch {
      window.prompt("Zkopírujte inzerát ručně:", postingToText(posting));
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
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
            Nevíte, co některé technické pojmy znamenají? Najeďte myší na tlačítko a vyskočí vysvětlení. Až bude
            popis hotový, tlačítkem „Vygenerovat inzerát“ z něj dostanete čistý inzerát k zveřejnění (Word i kopie).
          </p>
        </Reveal>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Levý sloupec — požadavky, rozdělené do skupin */}
        <div className="space-y-12">
          <FieldGroup title="Role a forma">
            <Field label="KOHO HLEDÁTE">
              {ARCHETYPY.map((o) => (
                <Chip key={o.v} active={s.archetype === o.v} onClick={() => set("archetype", o.v)} hint={o.h}>{o.t}</Chip>
              ))}
            </Field>
            <div>
              <div className="font-mono text-[11px] font-semibold tracking-label text-dim">ÚROVEŇ (SENIORITA)</div>
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
          </FieldGroup>

          <FieldGroup title="Firma a prostředí">
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
          </FieldGroup>

          <FieldGroup title="Náplň a dovednosti">
            <div>
              <div className="font-mono text-[11px] font-semibold tracking-label text-dim">
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
            <div>
              <div className="font-mono text-[11px] font-semibold tracking-label text-dim">CO MÁ UMĚT — DOVEDNOSTI A NÁSTROJE</div>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {SKILLS.map((o) => (
                  <Chip key={o.v} active={s.skills.includes(o.v)} onClick={() => toggle("skills", o.v)} hint={o.h}>{o.t}</Chip>
                ))}
              </div>
              {recommended ? (
                <p className="mt-2 text-[12px] leading-relaxed text-faint">
                  Pro zaměření <span className="text-hr">{SPEC_TITLE[spec as string]}</span> se obvykle hodí: {recommended}. Jiné dovednosti klidně přidej — z pozice se pak stane křížená (a mzda i kontrola profilu to zohlední).
                </p>
              ) : (
                <p className="mt-2 text-[12px] leading-relaxed text-faint">
                  Doporučené dovednosti se ukážou, jakmile vyberete aspoň jeden úkol v „Co bude dělat“.
                </p>
              )}
            </div>
          </FieldGroup>

          <FieldGroup title="Detaily a cíl">
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
              <div className="font-mono text-[11px] font-semibold tracking-label text-dim">MĚŘITELNÝ CÍL (PRVNÍ ÚKOL)</div>
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
          </FieldGroup>
        </div>

        {/* Pravý sloupec — živý náhled */}
        <Panel className="self-start px-6 py-6 lg:sticky lg:top-6">
          <div>
            <div className="font-mono text-[11px] tracking-label text-faint">NÁHLED POPISU POZICE</div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setShowPosting(true)}
                className="rounded-md border border-hr/50 bg-hr/10 px-3 py-1.5 font-mono text-[11px] font-semibold tracking-wide2 text-hr transition-colors hover:bg-hr/20"
              >
                VYGENEROVAT INZERÁT →
              </button>
              <button
                type="button"
                onClick={() => setShowFull(true)}
                className="rounded-md border border-line px-3 py-1.5 font-mono text-[11px] font-semibold tracking-wide2 text-dim transition-colors hover:border-faint hover:text-ink"
              >
                CELÝ POPIS ↗
              </button>
              <button
                type="button"
                onClick={copy}
                className="rounded-md border border-line px-3 py-1.5 font-mono text-[11px] font-semibold tracking-wide2 text-dim transition-colors hover:border-faint hover:text-ink"
              >
                {copied ? "✓ ZKOPÍROVÁNO" : "ZKOPÍROVAT TEXT"}
              </button>
            </div>
          </div>

          {/* Kontrola profilu — validační banner */}
          {jd.warnings.length > 0 ? (
            <div className="mt-4 rounded-md border border-warn/40 bg-warn/5 px-3.5 py-3">
              <div className="flex items-center gap-2">
                <span className="text-warn" aria-hidden>▲</span>
                <span className="font-mono text-[11px] font-semibold tracking-label text-warn">KONTROLA PROFILU · {jd.warnings.length}</span>
              </div>
              <ul className="mt-2 space-y-1.5">
                {jd.warnings.map((wn, i) => (
                  <li key={i} className="flex gap-2 text-[12px] leading-relaxed text-dim">
                    <span className="mt-px text-warn" aria-hidden>•</span>
                    <span>{wn}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="mt-4 flex items-center gap-2 rounded-md border border-ok/30 bg-ok/5 px-3.5 py-2">
              <span className="text-ok" aria-hidden>✓</span>
              <span className="text-[12px] text-dim">Profil je konzistentní — dovednosti i mzda sedí k roli.</span>
            </div>
          )}

          <h2 className="mt-5 text-2xl font-semibold leading-snug tracking-tight text-ink">{jd.title}</h2>
          {jd.aliases && (
            <p className="mt-1.5 text-[12px] leading-relaxed text-faint">Jiné běžné názvy téže role: {jd.aliases}.</p>
          )}

          <PreviewBlock label="PROČ POZICI OTEVÍRÁME">
            <p className="text-[14px] leading-relaxed text-ink">{jd.context}</p>
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

          <PreviewBlock label="ORIENTAČNÍ MZDA">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="font-mono text-[26px] font-semibold leading-none text-hr">{jd.salary.headlineValue}</div>
                <div className="mt-1.5 text-[11px] text-faint">{jd.salary.headlineLabel}</div>
              </div>
              <button
                type="button"
                onClick={() => setShowSalary(true)}
                className="rounded-md border border-hr/50 px-3 py-2 font-mono text-[11px] font-semibold tracking-wide2 text-hr transition-colors hover:bg-hr/10"
              >
                DETAILNÍ KALKULACE →
              </button>
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
              Tyhle body píšeme do popisu schválně — aby bylo jasné, co po člověku nečekat. (Do zveřejněného inzerátu se nedávají.)
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

      {/* Hotový inzerát k zveřejnění */}
      {showPosting && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/75 px-4 py-6 sm:px-8"
          onClick={() => setShowPosting(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="mx-auto w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-[11px] tracking-label text-ink">HOTOVÝ INZERÁT · K ZVEŘEJNĚNÍ</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={copyPosting}
                  className="rounded-md border border-hr/50 bg-hr/10 px-3 py-1.5 font-mono text-[11px] font-semibold tracking-wide2 text-hr transition-colors hover:bg-hr/20"
                >
                  {copiedPosting ? "✓ ZKOPÍROVÁNO" : "KOPÍROVAT INZERÁT"}
                </button>
                <button
                  type="button"
                  onClick={() => downloadPostingWord(posting)}
                  className="rounded-md border border-line bg-panel px-3 py-1.5 font-mono text-[11px] font-semibold tracking-wide2 text-dim transition-colors hover:border-faint hover:text-ink"
                >
                  STÁHNOUT WORD
                </button>
                <button
                  type="button"
                  onClick={() => setShowPosting(false)}
                  className="rounded-md border border-line bg-panel px-3 py-1.5 font-mono text-[11px] font-semibold tracking-wide2 text-dim transition-colors hover:border-faint hover:text-ink"
                >
                  ZAVŘÍT ✕
                </button>
              </div>
            </div>
            <div className="rounded-md bg-white p-7 shadow-2xl sm:p-9" dangerouslySetInnerHTML={{ __html: postingToHtml(posting) }} />
            <p className="mt-3 text-center font-mono text-[10px] leading-relaxed tracking-label text-faint">
              HOTOVÝ INZERÁT BEZ INTERNÍCH POZNÁMEK — STAČÍ DOPLNIT [ZÁVORKY] A ZVEŘEJNIT · CO VIDÍTE = CO SE STÁHNE
            </p>
          </div>
        </div>
      )}

      {/* Detailní kalkulace mzdy */}
      {showSalary && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/75 px-4 py-6 sm:px-8"
          onClick={() => setShowSalary(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="mx-auto w-full max-w-xl" onClick={(e) => e.stopPropagation()}>
            <Panel className="px-6 py-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <SectionLabel>Kalkulace mzdy</SectionLabel>
                  <h3 className="mt-2 text-lg font-semibold leading-snug text-ink">{jd.title}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSalary(false)}
                  className="flex-shrink-0 rounded-md border border-line px-3 py-1.5 font-mono text-[11px] font-semibold tracking-wide2 text-dim transition-colors hover:border-faint hover:text-ink"
                >
                  ZAVŘÍT ✕
                </button>
              </div>

              <div className="mt-5 overflow-hidden rounded-md border border-line">
                <table className="w-full text-[13px]">
                  <tbody>
                    {jd.salary.rows.map((r, i) => (
                      <tr key={i} className={r.strong ? "bg-raised" : ""}>
                        <td className="border-b border-line px-3.5 py-2.5 align-top">
                          <div className={`text-[13px] ${r.strong ? "font-semibold text-ink" : "text-ink"}`}>{r.label}</div>
                          {r.note && <div className="mt-1 text-[11px] leading-relaxed text-faint">{r.note}</div>}
                        </td>
                        <td className={`whitespace-nowrap border-b border-line px-3.5 py-2.5 text-right align-top font-mono ${r.strong ? "text-[14px] font-semibold text-hr" : "text-[13px] text-dim"}`}>
                          {r.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 space-y-2 text-[12px] leading-relaxed text-faint">
                <p><span className="font-semibold text-dim">Jak se počítá: </span>{jd.salary.method}</p>
                <p><span className="font-semibold text-dim">Forma: </span>{jd.salary.formaNote}</p>
                <p>{jd.salary.caveat}</p>
              </div>
            </Panel>
          </div>
        </div>
      )}

      {/* Celkový náhled CV + export */}
      {showFull && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/75 px-4 py-6 sm:px-8"
          onClick={() => setShowFull(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="mx-auto w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-[11px] tracking-label text-ink">CELÝ POPIS POZICE · PRACOVNÍ DOKUMENT</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={copy}
                  className="rounded-md border border-line bg-panel px-3 py-1.5 font-mono text-[11px] font-semibold tracking-wide2 text-dim transition-colors hover:border-faint hover:text-ink"
                >
                  {copied ? "✓ TEXT" : "KOPÍROVAT TEXT"}
                </button>
                <button
                  type="button"
                  onClick={() => downloadWord(jd)}
                  className="rounded-md border border-line bg-panel px-3 py-1.5 font-mono text-[11px] font-semibold tracking-wide2 text-dim transition-colors hover:border-faint hover:text-ink"
                >
                  STÁHNOUT WORD
                </button>
                <button
                  type="button"
                  onClick={copyAi}
                  className="rounded-md border border-hr/50 bg-panel px-3 py-1.5 font-mono text-[11px] font-semibold tracking-wide2 text-hr transition-colors hover:bg-hr/10"
                >
                  {copiedAi ? "✓ PRO AI" : "PRO AI ASISTENTA"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowFull(false)}
                  className="rounded-md border border-line bg-panel px-3 py-1.5 font-mono text-[11px] font-semibold tracking-wide2 text-dim transition-colors hover:border-faint hover:text-ink"
                >
                  ZAVŘÍT ✕
                </button>
              </div>
            </div>
            <div className="rounded-md bg-white p-7 shadow-2xl sm:p-9" dangerouslySetInnerHTML={{ __html: jdToHtml(jd) }} />
            <p className="mt-3 text-center font-mono text-[10px] leading-relaxed tracking-label text-faint">
              PRACOVNÍ DOKUMENT SE VŠ́M (I ROZPAD MZDY A POZNÁMKY) · PRO ČISTÝ INZERÁT POUŽIJTE „VYGENEROVAT INZERÁT“
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
