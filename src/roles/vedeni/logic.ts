/**
 * Vyhodnocovací logika pro VEDENÍ — převzata věcně z prototypu (inspirace.txt),
 * přepsaná do TypeScriptu. Tento modul nesmí importovat nic z jiných rolí.
 */
import { LEVELS, SUBQ, Sub } from "./data";

/** Kolik upřesněných záměrů (subs) je pro jednoho člověka ještě sériově únosné.
 *  Nad tuto hranici jde o frontu na roky, ne plán na rok. Sdíleno skóre, povinnostmi i scénáři. */
const SOLO_OVERLOAD = 2;

/** Záměry, jejichž návratnost závisí na objemu (nákladnější automatizace s přínosem na kus).
 *  Sdíleno scénářem „NÁSTROJ BEZ OBJEMU" a podmíněným zobrazením otázky „objem" v průvodci —
 *  jeden zdroj pravdy, ať se seznam nerozejde. */
export const VOLUME_SENSITIVE = ["faktury", "reporty", "smlouvy", "emaily", "kvalita", "udrzba", "planovani", "chatbot", "trideni", "crmZapisy", "nabidky"];

export type Answers = {
  size?: string;
  focus?: string;
  it?: string;
  systemy?: string;
  kdeData?: string;
  jazyky?: string[];
  regs?: string[];
  vize?: string[];
  goals?: string[];
  subs?: Record<string, string[]>;
  ambition?: string;
  horizont?: string;
  data?: string;
  erpUsage?: string;
  strojeData?: string;
  procesy?: string;
  objem?: string;
  mereni?: string;
  zkusenost?: string;
  lide?: string;
  kapacita?: string;
  sponzor?: string;
  rozpocet?: string;
  uzivatele?: string;
  dotace?: string;
  odbory?: string;
};

export type Ctx = {
  dataQ: number;
  erpFormal: boolean;
  procQ: number;
  hasIT: boolean;
  regs: Set<string>;
  systemy?: string;
  kdeData?: string;
  strojeData?: string;
};

export function buildCtx(a: Answers): Ctx {
  const regs = new Set(a.regs || []);
  let dataQ = ({ papir: 0, excel: 1, erp: 2 } as Record<string, number>)[a.data ?? ""] ?? 0;
  const erpFormal = a.data === "erp" && a.erpUsage === "formalne";
  if (erpFormal) dataQ = 1;
  return {
    dataQ,
    erpFormal,
    procQ: ({ ne: 0, castecne: 1, ano: 2 } as Record<string, number>)[a.procesy ?? ""] ?? 0,
    hasIT: a.it === "ano",
    regs,
    systemy: a.systemy,
    kdeData: a.kdeData,
    strojeData: a.strojeData,
  };
}

export type SelectedSub = { goal: string; sub: string; def: Sub };

export function allSelectedSubs(a: Answers): SelectedSub[] {
  const out: SelectedSub[] = [];
  (a.goals || []).forEach((g) => {
    const sel = (a.subs && a.subs[g]) || [];
    sel.forEach((s) => {
      const def = SUBQ[g]?.subs.find((x) => x.v === s);
      if (def) out.push({ goal: g, sub: s, def });
    });
  });
  return out;
}

export type Verdict = "hned" | "priprava" | "ne";
export type SubEval = { verdict: Verdict; gaps: string[]; note: string | null };

export function evalSub(sub: string, ctx: Ctx): SubEval {
  const gaps: string[] = [];
  let hard = false;
  let note: string | null = null;
  const { dataQ, erpFormal, procQ, hasIT, regs, systemy, kdeData, strojeData } = ctx;

  switch (sub) {
    case "znalostni":
      if (dataQ === 0) gaps.push("Klíčové dokumenty existují jen na papíře — nejdřív digitalizovat to, v čem se má hledat (sken + struktura).");
      if (regs.has("knowhow")) gaps.push("Citlivé know-how: nutné privátní nasazení nebo EU hosting, ne veřejný nástroj.");
      if (gaps.length === 0) note = "Jeden z nejvděčnějších prvních kroků — rychlý viditelný přínos pro všechny.";
      break;
    case "texty":
      if (regs.has("knowhow") || regs.has("gdpr")) note = "Před nasazením vydejte směrnici, co se do nástroje smí vkládat — jinak lidé pošlou ven i to, co nemají.";
      else note = "Nejrychlejší možný start — přínos do měsíce, minimální nároky na data.";
      break;
    case "porady":
      if (regs.has("gdpr") || regs.has("zdravotnictvi")) gaps.push("Nahrávky porad obsahují osobní údaje — vyřešit informování účastníků, uložení a mazání záznamů.");
      break;
    case "faktury":
      if (dataQ === 0 && procQ === 0) { hard = true; gaps.push("Doklady i schvalování běží na papíře a proces není popsaný — vytěžování nemá na co navázat."); }
      else if (dataQ === 0) gaps.push("Papírový oběh dokladů — prvním krokem je digitální příjem (sken, datová schránka, e-mail).");
      if (erpFormal) gaps.push("ERP se reálně nepoužívá — vytěžená data by neměla kam téct. Nejdřív vrátit systém do hry na tomto procesu.");
      if (procQ === 0 && !hard) gaps.push("Nezmapovaný schvalovací proces — popsat, kdo co schvaluje a jaké jsou výjimky.");
      if (!hasIT) note = "Integraci na účetní systém u vás pokryje externí partner — počítejte s tím v rozpočtu.";
      break;
    case "emaily":
      if (procQ === 0) gaps.push("Pravidla třídění a odpovědí nejsou popsaná — AI se nemá podle čeho řídit. Začněte popisem kategorií a typových odpovědí.");
      if (regs.has("gdpr")) gaps.push("E-maily obsahují osobní údaje — smluvně ošetřit zpracování u poskytovatele nástroje.");
      break;
    case "reporty":
      if (dataQ === 0) { hard = true; gaps.push("Reporty není z čeho stavět — podkladová data nejsou v digitální podobě."); }
      else if (dataQ === 1 && !erpFormal) gaps.push("Data jsou roztroušená v excelech — nejdřív sjednotit zdroje, jinak report jen zrychlí výrobu nespolehlivých čísel.");
      if (erpFormal) gaps.push("Data v systému neodpovídají realitě — report nad nimi bude přesně počítat z nepřesných vstupů.");
      break;
    case "smlouvy":
      if (dataQ === 0) gaps.push("Smlouvy nejsou digitalizované — první krok je sken s OCR a jednotné úložiště.");
      if (regs.has("gdpr") || regs.has("knowhow")) gaps.push("Citlivý obsah smluv — volit privátní nasazení a smluvně ošetřit zpracování dat.");
      break;
    case "vyrReporting":
      if (dataQ === 0) gaps.push("Výrobní záznamy na papíře — začněte digitálním sběrem na jednom pracovišti (terminál, tablet), pak teprve AI.");
      if (erpFormal) gaps.push("Výrobní data v systému nejsou aktuální — reporting nad nimi nebude odpovídat hale.");
      if (gaps.length === 0) note = "Nejlepší vstupní brána k AI ve výrobě — vytvoří datový základ pro kvalitu, údržbu i plánování.";
      break;
    case "kvalita":
      gaps.push("Kamerová data dnes nejspíš nevznikají — nutné vybudovat sběr snímků, osvětlení a anotaci vad. To je většina projektu.");
      if (!hasIT && dataQ === 0) { hard = true; gaps.push("Bez IT zázemí a digitálních základů je projekt tohoto typu předčasný — nejdřív výrobní reporting a partner se zkušeností z výroby."); }
      else if (!hasIT) gaps.push("Bez vlastního IT nutný externí partner — vybírejte podle referencí z výroby, ne podle prezentace.");
      if (procQ === 0) gaps.push("Nezmapovaný proces kontroly — popsat, co je vada, kdo rozhoduje o sporných kusech a co se s nimi děje.");
      if (regs.has("automotive")) gaps.push("Automotive: nasazení AI do kontroly kvality mění kontrolní proces — IATF a požadavky OEM mohou vyžadovat souhlas zákazníka. Ověřit u zákazníka před nasazením, ne po něm.");
      break;
    case "udrzba":
      if (dataQ === 0) { hard = true; gaps.push("Prediktivní údržba potřebuje historii strojních dat (senzory, MES, záznamy poruch). Bez ní nelze začít — predikce nemá z čeho vznikat."); }
      else if (dataQ === 1) gaps.push("Strojní data se musí začít systematicky sbírat a párovat se záznamy poruch — počítejte s 6–12 měsíci sběru, než má smysl modelovat.");
      if (erpFormal) gaps.push("Záznamy o údržbě se nevedou v systému — historie poruch je nutný základ.");
      break;
    case "planovani":
      if (procQ === 0) { hard = true; gaps.push("Optimalizovat nezmapované plánování nejde — nejdřív popsat, jak se dnes plánuje, kdo rozhoduje a podle čeho."); }
      if (dataQ < 2) gaps.push("Plánování potřebuje spolehlivá data o zakázkách, kapacitách a materiálu v systému — excely nestačí.");
      break;
    case "chatbot":
      if (dataQ === 0) gaps.push("Chatbot potřebuje znalostní bázi — produktové informace a podmínky v digitální, udržované podobě.");
      if (regs.has("gdpr")) gaps.push("Komunikace se zákazníky = osobní údaje. Smluvní ošetření s poskytovatelem a informování zákazníků.");
      if (procQ === 0) gaps.push("Popsat, co smí chatbot vyřídit sám a kdy předává člověku — bez toho hrozí poškození vztahů se zákazníky.");
      break;
    case "trideni":
      if (procQ === 0) gaps.push("Kategorie požadavků a pravidla směrování nejsou definované — nejdřív popsat, co kam patří a kdo to řeší.");
      break;
    case "nabidky":
      if (dataQ === 0) gaps.push("Podklady, ceníky a historie nabídek nejsou v digitální podobě — není z čeho generovat.");
      if (procQ === 0) gaps.push("Nepopsaný proces tvorby nabídek a schvalování cen — popsat, kdo kalkuluje, kdo schvaluje a podle čeho.");
      if (regs.has("knowhow")) gaps.push("Cenotvorba a kalkulace jsou citlivé know-how — volit privátní nasazení, ne veřejný nástroj.");
      break;
    case "marketingObsah":
      note = "Nejrychlejší start v obchodní oblasti. Pozor na fakta a jednotný hlas značky — nastavte schválení člověkem před publikací.";
      break;
    case "crmZapisy":
      if (dataQ < 2) gaps.push("CRM chybí nebo se reálně nepoužívá — zápisy nemají kam téct. Nejdřív zavést či oživit CRM na obchodním týmu.");
      if (erpFormal) gaps.push("Systémy se vedou formálně — automatické zápisy do mrtvého CRM nic nevyřeší.");
      if (regs.has("gdpr")) gaps.push("Kontakty a komunikace se zákazníky jsou osobní údaje — smluvně ošetřit zpracování u poskytovatele.");
      break;
    default:
      gaps.push("Tento záměr zatím nemá detailní pravidla pro vyhodnocení — ověřte proveditelnost individuálně, neberte „proveditelné hned“ jako potvrzené.");
      break;
  }

  // Průřezové poznámky napříč záměry — drží konzistentní pokrytí regulací, IT zázemí,
  // cílového systému a datového/strojního prostředí (Fáze 1).
  const needsIntegration = new Set(["faktury", "reporty", "planovani", "chatbot", "crmZapisy", "trideni"]);
  const dataLeavesToProvider = new Set(["faktury", "smlouvy", "emaily", "chatbot", "crmZapisy"]);
  const machineSubs = new Set(["vyrReporting", "udrzba"]);

  if (regs.has("finance") && dataLeavesToProvider.has(sub))
    gaps.push("Finance / pojišťovnictví: zpracování u externího poskytovatele AI spadá pod pravidla outsourcingu ČNB — ošetřit smluvně a posoudit, zda nejde o významný outsourcing.");
  if (regs.has("verejny") && needsIntegration.has(sub))
    gaps.push("Veřejný sektor / NIS2: výběr dodavatele a integrace podléhají přísnějšímu schvalování — počítejte s delším výběrem a požadavky na kyberbezpečnost.");

  // Cílový systém — jak snadno se nový nástroj napojí.
  // Pozn.: gap „nemáte ucelený systém" se nevydává, když data=erp (dataQ===2) — to by si
  // odporovalo s odpovědí, že hlavní agenda běží v reálně používaném ERP.
  if (needsIntegration.has(sub)) {
    if (systemy === "nevim") gaps.push("Nevíte, v jakém systému tahle agenda běží — to je první věc ke zjištění (často u externího správce IT). Bez toho nejde odhadnout napojení ani jeho cenu.");
    else if (systemy === "excelnic" && dataQ < 2) gaps.push("Bez uceleného systému (jen Excel a e-maily) se nový nástroj nemá na co napojit — napojení tu znamená nejdřív zavést evidenci, ne jen propojit dva systémy.");
  }

  // Kde leží data — smí vůbec ven?
  if (dataLeavesToProvider.has(sub)) {
    if (kdeData === "nevim") gaps.push("Nevíte, kde firemní data leží — než je pošlete do AI nástroje, je potřeba to zjistit kvůli souhlasu i bezpečnosti.");
    else if (kdeData === "vlastni" && !note) note = "Data držíte na vlastním serveru — to chrání soukromí, ale pro AI v cloudu bude potřeba buď privátní nasazení, nebo vědomé rozhodnutí pustit konkrétní data ven.";
  }

  // Strojní data — telemetrie z výroby (jen relevantní výrobní záměry)
  if (machineSubs.has(sub)) {
    if (strojeData === "ne") gaps.push("Data ze strojů se dnes nesbírají automaticky — pro tenhle záměr je jejich sběr (terminály, čidla, napojení řídicích systémů) nutný první krok a obvykle většina projektu.");
    else if (strojeData === "castecne") gaps.push("Strojní data se sbírají jen částečně — dotčené stroje bude potřeba doplnit do automatického sběru.");
    else if (strojeData === "nevim") gaps.push("Nevíte, jestli stroje poskytují data — ověřte s údržbou nebo dodavatelem strojů; bez toho záměr nelze naplánovat.");
  }

  if (!hasIT && needsIntegration.has(sub) && !note)
    note = "Bez vlastního IT integraci pokryje externí partner — počítejte s ním v rozpočtu i harmonogramu.";

  const verdict: Verdict = hard ? "ne" : gaps.length > 0 ? "priprava" : "hned";
  return { verdict, gaps, note };
}

// ---------- Skóre a celková náročnost ----------

export function score(a: Answers, ctx: Ctx): number {
  let p = 0;
  p += ({ s: 0, m: 1, l: 2 } as Record<string, number>)[a.size ?? ""] ?? 0;
  if (a.focus === "vyroba" || a.focus === "kombinace") p += 1;
  if (a.it === "ne") p += 2;
  let regP = 0;
  (a.regs || []).forEach((r) => { if (r !== "zadne") regP += r === "aiakt" ? 2 : 1; });
  p += Math.min(regP, 4);
  const subs = allSelectedSubs(a);
  const heavy = subs.filter((s) => ["kvalita", "udrzba", "planovani"].includes(s.sub)).length;
  p += Math.min(heavy, 2);
  if (subs.length > 5) p += 1;
  // Výrobní záměr je náročný nezávisle na deklarovaném zaměření — pokud firma volí výrobní
  // záměry, ale focus není výroba/kombinace, přičti bod, který by jinak dalo zaměření.
  if (!(a.focus === "vyroba" || a.focus === "kombinace") && subs.some((s) => ["vyrReporting", "kvalita", "udrzba", "planovani"].includes(s.sub))) p += 1;
  if (a.ambition === "plosne") p += 2;
  p += ({ papir: 3, excel: 1, erp: 0 } as Record<string, number>)[a.data ?? ""] ?? 0;
  if (ctx.erpFormal) p += 1;
  p += ({ ne: 2, castecne: 1, ano: 0 } as Record<string, number>)[a.procesy ?? ""] ?? 0;
  if (a.sponzor === "ne") p += 2;
  if (a.rozpocet === "zadna") p += a.ambition === "plosne" ? 2 : 1;
  if (a.zkusenost === "neuspech") p += 1;
  if (a.lide === "odpor") p += 1;
  if (!(a.vize || []).filter((v) => v !== "nevime").length) p += 1;
  if (a.kapacita === "nikdo") p += 2;
  else if (a.kapacita === "jeden" && (subs.length > SOLO_OVERLOAD || a.ambition === "plosne")) p += 1;
  return p;
}

export function levelIndex(p: number): number {
  if (p <= 6) return 0;
  if (p <= 12) return 1;
  if (p <= 18) return 2;
  return 3;
}

export function levelOf(a: Answers, ctx: Ctx) {
  return LEVELS[levelIndex(score(a, ctx))];
}

// ---------- Pravidla z praxe ----------

export type Rule = { big: string; label: string; d: string };

export function buildRules(a: Answers): Rule[] {
  const maxPilots = ({ s: 1, m: 2, l: 3 } as Record<string, number>)[a.size ?? ""] || 1;
  return [
    { big: "95 %", label: "pilotů GenAI nepřinese měřitelný finanční dopad (MIT, 2025)", d: "Příčinou není technologie, ale chybějící napojení na pracovní postupy a data. Přesně to řeší fáze mapování a přípravy — proto nejdou přeskočit." },
    { big: "30–50 %", label: "projektů firmy opustí po pilotu (Gartner)", d: "Hlavní důvody: špatná kvalita dat, rostoucí náklady a nejasná byznysová hodnota. Všechny tři jdou ošetřit předem — baseline, metrika, příprava dat." },
    { big: "MIN 20 %", label: "úvazku vlastníka procesu po dobu pilotu", d: "Bez vyhrazeného času lidí z procesu se pilot zastaví. „Po večerech k běžné práci“ nefunguje." },
    { big: "60–80 %", label: "času projektu padne na procesy a data", d: "Samotná AI je menšina práce. Kdo plánuje jen nasazení nástroje, plánuje pětinu projektu." },
    { big: "6–12 TÝDNŮ", label: "typická délka pilotu včetně vyhodnocení", d: "Kratší pilot nic neprokáže, delší bez výsledků ztrácí podporu." },
    { big: `MAX ${maxPilots}`, label: maxPilots === 1 ? "souběžný pilot při vaší velikosti" : "souběžné piloty při vaší velikosti", d: "Více pilotů najednou znamená, že žádný nemá dost lidí a žádný se nedotáhne." },
    { big: "1 → 2", label: "nejdřív proces, pak nástroj — nikdy obráceně", d: "Výběr nástroje před zmapováním procesu je nejčastější příčina nepoužívaných licencí." },
    { big: "100 %", label: "pilotů potřebuje měřitelné kritérium úspěchu předem", d: "Metrika odvozená z vize, změřená před startem i po konci. Co nejde změřit, nejde obhájit před vedením." },
  ];
}

// ---------- Povinnosti a tým ----------

export type Duty = { k: string; t: string; d: string; risk: string; owner: { who: string; danger?: boolean } };

const DUTY_AREAS = [
  { k: "proces", t: "Mapování procesů", d: "Popsat dotčené procesy, najít vlastníky, určit, kde AI dává smysl.", risk: "Bez vlastníka: automatizuje se chaos — jen rychleji. Výjimky se vynoří až v pilotu jako „AI nefunguje“." },
  { k: "data", t: "Práce s daty", d: "Audit, čištění, digitalizace a příprava dat pro konkrétní záměr.", risk: "Bez vlastníka: výstupům nelze věřit a ruční ověřování spolkne celou slibovanou úsporu." },
  { k: "compliance", t: "Regulace a směrnice", d: "AI Act, GDPR, interní pravidla — co se smí, kam smí data, kdo odpovídá.", risk: "Bez vlastníka: pokuty (AI Act až 35 mil. EUR, GDPR až 20 mil. EUR) a projekt zastavený právníkem v polovině." },
  { k: "nastroje", t: "Výběr a nasazení nástrojů", d: "Průzkum trhu, testování, integrace na stávající systémy, bezpečnost.", risk: "Bez vlastníka: výběr fakticky dělá dodavatel podle svého katalogu — vendor lock-in a ladem ležící licence." },
  { k: "mereni", t: "Pilot a měření přínosů", d: "Návrh pilotu, kritéria úspěchu, sběr čísel před a po, kalkulace.", risk: "Bez vlastníka: projekt nemá čísla, kterými by se obhájil — skončí při prvním šetření rozpočtu." },
  { k: "skoleni", t: "Školení a adopce", d: "Naučit lidi nástroj používat, upravit pracovní postupy, sbírat zpětnou vazbu.", risk: "Bez vlastníka: lidé se do měsíce vrátí ke starým postupům a nástroj osiří — licence běží dál." },
  { k: "vedeni", t: "Komunikace s vedením", d: "Reporting postupu, obhajoba priorit a rozpočtu, řízení očekávání.", risk: "Bez vlastníka: vedení ztratí přehled, projekt prioritu — a pak rozpočet." },
  { k: "provoz", t: "Provoz a správa", d: "Údržba nasazených řešení, vztah s dodavateli, průběžné vyhodnocování.", risk: "Bez vlastníka: řešení tiše degradují a vzniká neudržovaný dluh s compliance rizikem." },
];

export type DutiesResult = { duties: Duty[]; verdict: { tone: "ok" | "warn" | "stop"; text: string } };

export function buildDuties(a: Answers, ctx: Ctx): DutiesResult {
  const regulated = ["gdpr", "zdravotnictvi", "finance", "verejny", "aiakt"].some((r) => ctx.regs.has(r));
  const ext: string[] = [];
  if (regulated) ext.push("právní posouzení");
  if (!ctx.hasIT) ext.push("integrace a IT");
  const kap = a.kapacita;

  const owner = (k: string): { who: string; danger?: boolean } => {
    if (kap === "nikdo") return { who: "bez vlastníka", danger: true };
    if (kap === "jeden") {
      if (k === "compliance" && regulated) return { who: "specialista + ext. právník" };
      if (k === "nastroje" && !ctx.hasIT) return { who: "specialista + ext. IT" };
      if (k === "skoleni") return { who: "specialista + ambasadoři" };
      return { who: "specialista" };
    }
    if (kap === "maly") {
      const map: Record<string, string> = { proces: "koordinátor", mereni: "koordinátor", vedeni: "koordinátor", data: "garant dat", nastroje: ctx.hasIT ? "garant dat + IT" : "garant dat + ext. IT", provoz: "garant dat", compliance: regulated ? "koordinátor + ext. právník" : "koordinátor", skoleni: "celý tým + ambasadoři" };
      return { who: map[k] };
    }
    const map: Record<string, string> = { proces: "procesní analytik", data: "datový specialista", compliance: regulated ? "interní role + právní podpora" : "koordinátor", nastroje: "IT / integrační role", mereni: "koordinátor", skoleni: "školitel + ambasadoři", vedeni: "vedoucí týmu", provoz: "provozní role" };
    return { who: map[k] };
  };

  const duties: Duty[] = DUTY_AREAS.map((dy) => ({ ...dy, owner: owner(dy.k) }));

  const nSubs = allSelectedSubs(a).length;
  let verdict: DutiesResult["verdict"];
  if (kap === "nikdo")
    verdict = { tone: "stop", text: "Všech 8 oblastí níže zůstává bez vlastníka. „Lidé to zvládnou k běžné práci“ je nejspolehlivější způsob, jak implementaci pohřbít — v každém sporu o čas prohraje. Minimální start: jeden člověk s reálně vyhrazeným úvazkem (klidně částečným) a zúžení na jediný záměr." };
  else if (kap === "jeden")
    verdict = { tone: "warn", text: "Jeden člověk všech 8 oblastí pokryje — ale jen sériově, na jednom záměru najednou" + (nSubs > SOLO_OVERLOAD ? ` (vybrali jste ${nSubs} záměrů — pro jednoho člověka je to fronta na roky, ne plán na rok)` : "") + ". V praxi to znamená: MAX 1 běžící pilot bez ohledu na velikost firmy, " + (ext.length ? "nakoupená externí podpora na " + ext.join(" a ") + ", " : "") + "a delší termíny, než slibují dodavatelé. Sólo specialista bez opory vyhoří nebo odejde — sponzor a vlastníci procesů ho musí reálně podržet." };
  else if (kap === "maly")
    verdict = { tone: "ok", text: "2–3 lidé umožňují rozdělit role: koordinátor (procesy, pilot, komunikace s vedením) a garant dat (data, nástroje, provoz)" + (ext.length ? ", s externí podporou na " + ext.join(" a ") : "") + ". Souběžně utáhnete 1–2 piloty. Pozor, aby role byly skutečně rozdělené — dva lidé, kteří oba dělají všechno, jsou jen dražší verze jednoho." };
  else
    verdict = { tone: "ok", text: "Vyhrazený tým zvládne souběžné piloty i specializaci rolí. Riziko se přesouvá jinam: tým nesmí pracovat odtrženě od provozu. Každý záměr musí mít vlastníka přímo v dotčeném oddělení — jinak tým vyrábí řešení, která si provoz nepřevezme." };

  return { duties, verdict };
}

// ---------- Tým ----------

export type TeamRole = { role: string; why: string; risk: string; missing?: boolean };

export function buildTeam(a: Answers, ctx: Ctx): TeamRole[] {
  const regulated = ["gdpr", "zdravotnictvi", "finance", "verejny", "aiakt"].some((r) => ctx.regs.has(r));
  const vyroba = a.focus === "vyroba" || a.focus === "kombinace";
  const subs = allSelectedSubs(a).map((s) => s.sub);
  const team: TeamRole[] = [];

  team.push({
    role: "Sponzor z vedení",
    why: a.sponzor === "ne"
      ? "Zatím chybí — a je to první věc k vyřešení. Bez člověka z vedení, který projektu dá prioritu, čas lidí a rozpočet, skončí implementace jako koníček jednotlivce."
      : "Drží prioritu projektu, rozhoduje o rozpočtu a odblokovává překážky mezi odděleními.",
    risk: "Bez něj: projekt prohraje každý spor o čas a peníze. Chybějící sponzor je nejčastější jediná příčina, proč implementace tiše zemře.",
    missing: a.sponzor === "ne",
  });
  team.push({
    role: "Koordinátor implementace (AI specialista)",
    why: a.kapacita === "nikdo"
      ? "Zatím nemá kapacitu — viz rozdělení povinností. Bez vyhrazeného člověka zůstává všech 8 oblastí bez vlastníka."
      : a.kapacita === "jeden"
      ? "U vás ponese většinu oblastí sám — o to důležitější je chráněný úvazek, opora sponzora a externí podpora na právo a IT."
      : a.size === "l" || a.ambition === "plosne"
      ? "Při vaší velikosti či ambici počítejte s rolí na plný úvazek. Vede mapování, vybírá nástroje, hlídá regulace a měří přínosy."
      : "Může jít i o částečný úvazek nebo externí spolupráci. Vede mapování procesů, výběr nástrojů a vyhodnocení pilotu.",
    risk: "Bez něj: implementaci fakticky řídí dodavatel — podle svých priorit a svého ceníku.",
    missing: a.kapacita === "nikdo",
  });
  team.push({
    role: "Vlastníci procesů",
    why: "Lidé, kteří dotčené procesy denně dělají. Bez nich nejde proces zmapovat ani změnit — a potřebují vyhrazený čas (viz pravidlo MIN 20 %), ne práci navíc po večerech.",
    risk: "Bez nich: vznikne řešení od stolu, které provoz odmítne používat — a bude mít pravdu.",
  });
  team.push({
    role: ctx.hasIT ? "Interní IT podpora" : "Externí IT partner",
    why: ctx.hasIT
      ? "Přístupy, integrace na stávající systémy, bezpečnost. Zapojte IT od začátku, ne až při nasazení."
      : "Vlastní IT nemáte, takže integrace, přístupy a bezpečnost musí pokrýt prověřený externí partner. Počítejte s ním v rozpočtu i harmonogramu.",
    risk: "Bez něj: přístupy a integrace se řeší obezličkami — bezpečnostní díry a řešení, které se rozpadne při první aktualizaci systému.",
  });
  if (regulated)
    team.push({ role: "Pověřenec / právní podpora", why: "Vaše odpovědi ukazují na regulovaná data. Někdo musí posoudit zpracování osobních údajů, smlouvy s poskytovateli AI a dopady AI Actu — před výběrem nástroje, ne po něm.", risk: "Bez něj: smlouvy a zpracování dat se řeší zpětně — v lepším případě zdržení, v horším pokuta a zákaz zpracování." });
  if (ctx.regs.has("koncern"))
    team.push({ role: "Kontakt na schvalování v koncernu", why: "Nástroje schvaluje mateřská společnost. Tato smyčka bývá nejdelší položkou harmonogramu — musí se rozběhnout dřív než výběr nástroje, ne až po něm.", risk: "Bez něj: vybraný nástroj uvízne měsíce ve schvalování centrály a pilot stojí — termíny postavené na vlastním rozhodování neplatí." });
  if (vyroba && subs.some((s) => ["kvalita", "udrzba", "planovani", "vyrReporting"].includes(s)))
    team.push({ role: "Garant výroby (technolog / OT)", why: "AI ve výrobě se potkává se stroji, technologiemi a bezpečností provozu. Potřebujete člověka, který zná výrobní realitu a řekne, co je technicky a bezpečnostně průchodné.", risk: "Bez něj: hrozí řešení, které nezná takt linky ani bezpečnostní pravidla — a údržba ho po prvním incidentu vypne." });
  if (ctx.dataQ < 2 || a.ambition === "plosne")
    team.push({
      role: "Garant dat",
      why: a.data === "papir"
        ? "Data zatím nejsou digitální — někdo musí vést digitalizaci a určit, co se vůbec vyplatí digitalizovat."
        : ctx.erpFormal
        ? "Někdo musí vrátit systémy do hry a držet, aby data odpovídala realitě — jinak každá AI nad nimi počítá z fikce."
        : "Někdo musí dát data do použitelné podoby a držet jejich kvalitu — roztříštěné excely jsou nejčastější důvod, proč pilot nedopadne.",
      risk: "Bez něj: pilot poběží na datech, kterým nikdo nevěří — a stejně dopadnou i jeho výsledky.",
    });
  const manyUsers = a.uzivatele === "firma" || a.uzivatele === "oddeleni";
  if (a.lide === "odpor" || a.zkusenost === "stin" || (manyUsers && a.lide !== "tesi"))
    team.push({
      role: "Ambasadoři z řad zaměstnanců",
      why: a.zkusenost === "stin"
        ? "Lidé, kteří si už dnes pomáhají AI sami, jsou vaše největší výhoda — zapojte je oficiálně. Kolegové uvěří jim, ne prezentaci."
        : a.lide === "odpor"
        ? "Při nedůvěře v týmu potřebujete pár lidí z provozu, kteří nástroj vyzkouší první a řeknou kolegům pravdu. Adopce se šíří od kolegů, ne shora."
        : "Nástroj má používat hodně lidí — adopci v takovém počtu neutáhne školení shora. Vyberte pár lidí z provozu, kteří ho vyzkouší první a pomůžou ostatním. Adopce se šíří od kolegů.",
      risk: "Bez nich: adopce stojí jen na příkazech shora — a ty dlouhodobě nefungují.",
    });
  if (a.odbory === "ano" && (subs.some((s) => ["faktury", "emaily", "reporty", "smlouvy", "trideni", "chatbot", "crmZapisy", "kvalita", "udrzba", "planovani", "vyrReporting", "nabidky"].includes(s)) || a.lide === "odpor"))
    team.push({ role: "Zástupci zaměstnanců (odbory / rada)", why: "Máte odbory nebo radu zaměstnanců a nasazení se dotkne pracovních postupů. Projednání se zástupci je u takových změn obvykle povinné — a hlavně se vyplatí udělat ho včas, ne až jako formalitu na konci.", risk: "Bez něj: projednání se objeví na poslední chvíli jako překážka, nebo se vynechá úplně — což může nasazení zablokovat a podkopat důvěru lidí." });
  return team;
}

// ---------- Rizikové scénáře ----------

export type Scenario = { t: string; d: string; out: string };

export function buildScenarios(a: Answers, ctx: Ctx): Scenario[] {
  const subs = allSelectedSubs(a).map((s) => s.sub);
  const hasGoal = (a.vize || []).filter((v) => v !== "nevime").length > 0;
  const sc: Scenario[] = [];

  if (a.kapacita === "nikdo")
    sc.push({ t: "IMPLEMENTACE BEZ RUKOU", d: "Záměry jsou vybrané, ale nikdo na ně nemá vyhrazený čas. Implementace „k běžné práci“ prohraje každý spor o priority — mapování se odsouvá, pilot se vleče a po půl roce se projekt tiše rozpustí.", out: "Cesta ven: jeden člověk s chráněným úvazkem (stačí částečný) a zúžení na jediný záměr z verdiktů. Dokud tohle nemáte, nekupujte žádný nástroj." });
  else if (a.kapacita === "jeden" && (subs.length > SOLO_OVERLOAD || a.ambition === "plosne"))
    sc.push({ t: "JEDEN ČLOVĚK NA VŠECHNO", d: `Jeden specialista má pokrýt mapování, data, regulace, nástroje, pilot, školení i komunikaci s vedením — napříč ${subs.length} záměry${a.ambition === "plosne" ? " s plošnou ambicí" : ""}. To není pracovní pozice, to je seznam práce pro celé oddělení.`, out: "Cesta ven: zúžit na jeden záměr a postupovat sériově, nakoupit externí podporu na právo a IT, a od sponzora získat veřejné krytí priorit. Jinak specialista vyhoří nebo odejde." });

  if (!hasGoal)
    sc.push({ t: "AI BEZ CÍLE", d: "Chcete AI, ale zatím nevíte k čemu — technologie si hledá problém. Takhle vznikají nákupy licencí „ať něco máme“, které MIT řadí mezi 95 % pilotů bez měřitelného dopadu.", out: "Cesta ven: krátký workshop vedení nad otázkou „jaké číslo nás bolí“ — náklady, kapacita, chybovost, nebo rychlost. Teprve z odpovědi vyberte záměr." });
  if (ctx.erpFormal)
    sc.push({ t: "PAPÍROVÉ ERP", d: "Systém existuje, ale realita firmy běží mimo něj — v excelech, e-mailech a po telefonu. Každá AI postavená nad daty ze systému bude pracovat s fikcí.", out: "Cesta ven: na dotčeném procesu nejdřív vrátit systém do hry — zjednodušit zápis, vyžadovat ho a po 4–6 týdnech zkontrolovat, že data odpovídají realitě." });
  if (ctx.dataQ <= 1 && subs.some((s) => ["kvalita", "udrzba", "planovani"].includes(s)))
    sc.push({ t: "SKOK PŘES PROPAST", d: "Míříte na pokročilou výrobní AI, ale chybí datové základy. Tyto projekty stojí na historii kvalitních dat — bez ní dodavatel nejdřív rok buduje sběr a rozpočet se mezitím rozpustí.", out: "Cesta ven: mezikrok. Výrobní reporting a digitální sběr dat je řádově levnější, přinese užitek do 3 měsíců a vytvoří základ pro pokročilé projekty." });
  if (a.zkusenost === "neuspech")
    sc.push({ t: "SPÁLENÝ POKUS", d: "Druhý pokus má těžší pozici než první — lidé i vedení si pamatují, že „AI jsme zkoušeli a nefungovalo to“. Každé zaváhání teď bude číst jako potvrzení.", out: "Cesta ven: pojmenujte nahlas, proč minulý pokus padl (téměř vždy: chyběl vlastník, měření nebo data). Nový pilot dělejte na jiném procesu, menší, s kritériem dohodnutým předem." });
  if (a.sponzor === "ne")
    sc.push({ t: "PROJEKT JEDNOHO NADŠENCE", d: "Téma táhne jednotlivec bez opory ve vedení. Implementace ale bere lidem čas a mění zaběhnuté postupy — a projekt bez sponzora prohraje každý spor o priority.", out: "Cesta ven: než cokoliv kupovat, získat sponzora. Nejlepší argument je malá ukázka na reálném firemním problému + čísla: kolik hodin měsíčně proces stojí dnes." });
  if (a.ambition === "plosne" && a.rozpocet === "zadna")
    sc.push({ t: "NEUZRÁLÉ ROZHODNUTÍ", d: "Plošná ambice bez jakékoli představy o investici je signál, že padlo „chceme AI“, ne „chceme vyřešit tohle za tolik“. Rozpočet se nedá ukotvit, dokud není co měřit — a plošné nasazení bez rozpočtu se nejčastěji zastaví po prvním vyúčtování.", out: "Cesta ven: pilot na jednom procesu dodá první čísla — kolik hodin proces stojí dnes a kolik po nasazení. Z nich teprve vznikne obhajitelný rozpočet pro širší nasazení." });
  if (a.mereni === "ne" && hasGoal)
    sc.push({ t: "BEZ VÝCHOZÍHO ČÍSLA", d: "Máte cíl, ale dnes neměříte, kolik vás dotčená činnost stojí — po nasazení tedy nebude s čím porovnat výsledek. Přesně na tom padá většina pilotů: nejde obhájit přínos, který nikdo nezměřil (pravidlo „100 % pilotů potřebuje metriku předem“).", out: "Cesta ven: než cokoliv spustíte, změřte výchozí stav — kolik hodin nebo korun proces dnes spotřebuje. Stačí pár týdnů sledování a jedno číslo, se kterým se po pilotu porovná." });
  if ((a.objem === "maly" || a.objem === "nevim") && subs.some((s) => VOLUME_SENSITIVE.includes(s)))
    sc.push({ t: "NÁSTROJ BEZ OBJEMU", d: a.objem === "maly"
      ? "Vybrali jste automatizaci, která něco stojí postavit — ale objem agendy je malý. Návratnost se počítá z toho, kolik práce nástroj ušetří; při desítkách kusů měsíčně se nákladnější řešení nemusí vyplatit."
      : "Vybrali jste automatizaci, která něco stojí postavit, ale objem agendy zatím neznáte. Bez něj nejde spočítat návratnost — a to je první otázka, kterou položí každý, kdo schvaluje rozpočet.", out: "Cesta ven: spočítejte, kolik kusů měsíčně proces obnáší a kolik času každý zabere. Při malém objemu začněte levnějším nástrojem (hotová služba místo vlastního vývoje) nebo záměrem s vyšším objemem." });
  if (a.regs?.includes("aiakt"))
    sc.push({ t: "VYSOKÉ RIZIKO DLE AI ACTU", d: "AI rozhodující o lidech (nábor, hodnocení, posuzování klientů) spadá do vysoce rizikové kategorie — povinný lidský dohled, dokumentace, transparentnost. Zjistit to až po nákupu nástroje je drahé.", out: "Cesta ven: právní posouzení před výběrem nástroje. Zvažte režim „AI připravuje podklady, člověk rozhoduje“ — riziková kategorie se tím zásadně mění." });
  if (ctx.regs.has("koncern"))
    sc.push({ t: "SCHVALOVACÍ SMYČKA MATKY", d: "Výběr nástroje musí projít centrálou. Týmy to typicky podcení a naplánují termíny, jako by rozhodovaly samy — a pak čekají měsíce na souhlas, který nemají jak urychlit.", out: "Cesta ven: zjistit schvalovací proces matky hned na začátku a zařadit ho jako první úkol harmonogramu, paralelně s mapováním. Nejdražší je narazit na něj až u hotového výběru." });
  if (a.zkusenost === "stin")
    sc.push({ t: "STÍNOVÉ AI", d: "Vaši lidé už AI používají — bez pravidel, na soukromých účtech. Firemní data a know-how už možná odcházejí do veřejných nástrojů. Zákaz to nevyřeší, jen zatlačí hlouběji do stínu.", out: "Cesta ven: rychle vydat směrnici (co se smí a nesmí vkládat), dát lidem legální firemní nástroj — a nadšence zapojit jako ambasadory adopce." });
  if (a.lide === "odpor")
    sc.push({ t: "TICHÝ ODPOR", d: "Nejčastější konec implementace nevypadá jako vzpoura — nástroj funguje a nikdo ho nepoužívá. Lidé se bojí o práci nebo to berou jako kontrolu shora, a tak nástroj prostě tiše obejdou.", out: "Cesta ven: zapojit lidi z procesu už do mapování, ne až do školení. První nasazení vybrat tak, aby lidem ulevilo od otravné práce — a říct narovinu, co AI znamená pro jejich místa." });
  if (a.horizont === "hned" && a.ambition === "plosne")
    sc.push({ t: "RYCHLE A PLOŠNĚ NARAZ", d: "Chcete první výsledek do tří měsíců a zároveň plošné nasazení — to jsou dva protichůdné cíle. Plošné nasazení se vždy fázuje přes ověřený pilot; tlak na rychlost i šíři zároveň skončí buď nedodělaným rolloutem, nebo nedůvěryhodným pilotem.", out: "Cesta ven: za tři měsíce je reálný jeden dotažený pilot s měřitelným výsledkem. Plošné nasazení postavte až na něm — rychlost získáte tím, že se neplýtvá na širokém záběru bez ověření." });
  if (a.horizont === "termin")
    sc.push({ t: "PEVNÝ TERMÍN", d: "Termín je daný zvenčí (zakázka, audit, dotace). Riziko je, že se naplánuje podle přání, ne podle toho, co termín reálně umožní — a u dotace navíc platí vlastní pravidla výběru dodavatele i vyúčtování.", out: "Cesta ven: plánujte od termínu zpět — co přesně musí být k datu hotové, kolik na to reálně zbývá času a co se do něj vejde. Co se nevejde, zařaďte za termín, ne před něj." });
  if (a.dotace === "ano" || a.dotace === "zvazujeme")
    sc.push({ t: "DOTACE MĚNÍ PRAVIDLA", d: a.dotace === "ano"
      ? "Počítáte s dotací (např. OP TAK, Digitální podnik) — ta má vlastní pravidla, která mění celý postup: způsobilé výdaje, povinné výběrové řízení na dodavatele, termíny navázané na výzvu a dokumentaci k vyúčtování. Nedá se prostě vybrat nástroj a koupit ho."
      : "Zvažujete dotaci (např. OP TAK, Digitální podnik). Pokud do ní půjdete, změní celý postup — způsobilé výdaje, výběrové řízení na dodavatele i termíny navázané na výzvu. Rozhodněte se dřív, než začnete vybírat nástroj.", out: "Cesta ven: zjistěte si podmínky konkrétní výzvy (způsobilé výdaje, spoluúčast, harmonogram) ještě před výběrem nástroje a počítejte s vlastním spolufinancováním — dotace nikdy nepokryje vše. U výběru dodavatele dodržte pravidla výzvy, jinak hrozí vrácení dotace." });
  if (((a.jazyky?.length ?? 0) > 1 || (a.jazyky ?? []).includes("jine")) && subs.some((s) => ["chatbot", "texty", "smlouvy", "znalostni", "porady", "trideni", "nabidky", "emaily"].includes(s)))
    sc.push({ t: "JAZYKOVÁ PAST", d: "Komunikujete ve více jazycích a vybrané záměry pracují s textem nebo řečí. Nástroje, které v anglické ukázce září, mohou na češtině, němčině nebo méně častém jazyce výrazně ztrácet — a kvalita se liší dodavatel od dodavatele.", out: "Cesta ven: do výběru zařaďte test na vašich reálných datech ve všech jazycích, které potřebujete. Nerozhodujte podle dema v angličtině." });
  if (a.ambition === "plosne" && allSelectedSubs(a).length >= 4)
    sc.push({ t: "VŠE NAJEDNOU", d: "Plošná ambice napříč mnoha záměry znamená, že se kapacita lidí, rozpočet i pozornost vedení rozdrobí — a za rok nebude hotové nic, jen rozpracované všechno.", out: "Cesta ven: seřadit záměry podle verdiktů. Začít jedním „proveditelné hned“, dotáhnout do měřitelného výsledku, a teprve s ověřeným postupem přidávat další." });

  if (sc.length === 0)
    sc.push({ t: "„KOUPÍME NÁSTROJ A MÁME AI“", d: "Vaše odpovědi nevykazují žádnou kritickou kombinaci — o to víc hrozí podcenění. Nástroj je zhruba pětina práce; zbytek je mapování, data, změna postupů a školení.", out: "Cesta ven: držet se pravidla „nejdřív proces, pak nástroj“. Dobrá výchozí pozice se nejsnáz promrhá rychlým nákupem." });

  return sc.slice(0, 6);
}
