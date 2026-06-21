/**
 * Obsah průvodce pro VEDENÍ — otázky a záměry.
 * Věcný obsah vychází z prototypu (inspirace.txt), texty filtrované perspektivou vedení.
 * Tento modul nesmí importovat nic z jiných rolí.
 */

export type Option = { v: string; t: string; d: string; exclusive?: boolean };
export type Question = {
  key: string;
  title: string;
  subtitle: string;
  multi?: boolean;
  options: Option[];
};
export type Step = { id: string; label: string; full: string; desc: string; questions: string[] };

export const STEPS: Step[] = [
  { id: "profil", label: "Profil", full: "Profil firmy", desc: "V jakém prostředí se bude implementovat. Velikost, zaměření, IT zázemí a systémy určují náročnost koordinace a integrace.", questions: ["size", "focus", "it", "systemy", "kdeData"] },
  { id: "regulace", label: "Regulace", full: "Regulace a citlivá data", desc: "Co vás omezuje a chrání. Verdikty záměrů s regulacemi počítají — drahé je zjistit omezení až po nákupu.", questions: ["regs"] },
  { id: "vize", label: "Vize", full: "Vize a záměry", desc: "Jaké číslo se má pohnout a co konkrétně od AI čekáte. Každý zvolený záměr dostane vlastní verdikt proveditelnosti.", questions: ["vize", "goals", "ambition"] },
  { id: "dataProc", label: "Data a procesy", full: "Data a procesy", desc: "Na čem se dá stavět. Stav dat a zmapování procesů jsou nejsilnější faktory toho, co je proveditelné hned.", questions: ["data", "erpUsage", "strojeData", "procesy"] },
  { id: "lide", label: "Lidé", full: "Lidé, kapacita a podpora", desc: "Kdo implementaci ponese a s jakou oporou. Kapacita a sponzor rozhodují o tempu i realističnosti ambice.", questions: ["zkusenost", "lide", "kapacita", "sponzor", "rozpocet"] },
];

export const Q: Record<string, Question> = {
  size: {
    key: "size",
    title: "Kolik máte zaměstnanců?",
    subtitle: "Velikost nemění, CO je třeba udělat, ale KOLIK koordinace to stojí. Z výzkumu MIT: střední firmy dostanou AI do provozu za ~90 dní, korporace za ~9 měsíců — byrokracie bývá dražší než technologie.",
    options: [
      { v: "s", t: "Do 50", d: "Rozhodnete rychle, ale každá hodina lidí je vzácná — jeden dobře vybraný pilot je strop" },
      { v: "m", t: "50–250", d: "Více procesů i oddělení — bez koordinátora se snaha rozpadne na izolované pokusy jednotlivců" },
      { v: "l", t: "Nad 250", d: "Zdroje jsou, ale změna se dotkne mnoha týmů a systémů — o úspěchu rozhodne řízení, ne technologie" },
    ],
  },
  focus: {
    key: "focus",
    title: "Jaké je zaměření firmy?",
    subtitle: "Kancelář a výroba jsou dva odlišné AI světy. V administrativě jde hlavně o dokumenty a text — nasazení je rychlejší a levnější. Ve výrobě se AI potkává se stroji a bezpečností provozu — projekty jsou delší a dražší.",
    options: [
      { v: "vyroba", t: "Výrobní", d: "AI se potkává se stroji, senzory a bezpečností provozu — delší projekty, větší přínosy" },
      { v: "admin", t: "Administrativní / služby", d: "Dokumenty, komunikace, klientská agenda — nejrychlejší a nejlevnější nasazení AI" },
      { v: "obchod", t: "Obchod / e-commerce / logistika", d: "Prodej, sklad, doprava — těžiště v nabídkách, CRM a zákaznickém servisu" },
      { v: "kombinace", t: "Kombinace více oblastí", d: "Výroba i silná administrativní část — začíná se tam, kde jsou data zralejší" },
    ],
  },
  it: {
    key: "it",
    title: "Máte vlastní IT oddělení?",
    subtitle: "AI nástroje téměř vždy potřebují napojení na to, co už máte — účetnictví, ERP, e-mail. Firmy bez vlastního IT to zvládají také, ale přes externího partnera — počítejte s ním v rozpočtu od prvního dne.",
    options: [
      { v: "ano", t: "Ano", d: "Interní IT zvládne přístupy, integrace a bezpečnost — zapojte ho od prvního dne" },
      { v: "ne", t: "Ne / jen externí správa", d: "Integrace pokryje externí partner — vybírejte podle referencí, ne podle ceny" },
    ],
  },
  systemy: {
    key: "systemy",
    title: "V čem vedete hlavní firemní agendu?",
    subtitle: "Objednávky, sklad, fakturace, zakázky. Ptáme se proto, že napojení nového nástroje je u každého systému jinak snadné a drahé — je to první věc, kterou potřebuje vědět každý, kdo bude integraci dělat. Nemusíte znát detaily.",
    options: [
      { v: "velkysystem", t: "Velký podnikový systém", d: "Např. SAP, Microsoft Dynamics, Helios, K2 — ucelený systém pro celou firmu" },
      { v: "ucetni", t: "Účetní nebo skladový program", d: "Např. Pohoda, Money, Abra, Vario — hlavně účetnictví a sklad" },
      { v: "excelnic", t: "Hlavně Excel, e-maily a papír", d: "Žádný ucelený systém — agenda žije v tabulkách a hlavách lidí" },
      { v: "nevim", t: "Nevím / spravuje to externí firma", d: "Systémy řeší externí dodavatel, sami do nich nevidíme" },
    ],
  },
  kdeData: {
    key: "kdeData",
    title: "Kde máte firemní e-maily a dokumenty?",
    subtitle: "Tahle odpověď rozhoduje, jestli data smí ven a jaké nástroje vůbec přicházejí v úvahu. Nejde o značku, ale o to, kde vaše data fyzicky leží.",
    options: [
      { v: "m365", t: "Microsoft 365 / Outlook", d: "E-maily a dokumenty v Microsoftu — Teams, OneDrive, SharePoint" },
      { v: "google", t: "Google Workspace / Gmail", d: "Firemní Gmail a Disk Google" },
      { v: "vlastni", t: "Na vlastním serveru ve firmě", d: "Data zůstávají u vás, ne v cloudu" },
      { v: "nevim", t: "Nevím", d: "Nevíme přesně, kde data leží — spravuje to někdo jiný" },
    ],
  },
  regs: {
    key: "regs",
    title: "Co se týká vašich dat a regulací?",
    subtitle: "Regulace nejsou důvod AI nezavádět — jsou důvod zvolit správný způsob nasazení. Vyberte vše, co platí. Pokud nic, zvolte poslední možnost.",
    multi: true,
    options: [
      { v: "gdpr", t: "Osobní údaje zákazníků či klientů", d: "Nad rámec běžné personalistiky — do hry vstupuje DPIA a místo zpracování dat" },
      { v: "knowhow", t: "Citlivé know-how a výrobní data", d: "Receptury, výkresy, technologie — rozhodne o volbě privátního nasazení" },
      { v: "automotive", t: "Automotive / zákaznické audity", d: "IATF a požadavky OEM — změna kontrolního procesu může vyžadovat souhlas zákazníka" },
      { v: "zdravotnictvi", t: "Zdravotnictví", d: "Zvláštní kategorie osobních údajů — nejpřísnější režim GDPR" },
      { v: "finance", t: "Finance a pojišťovnictví", d: "Dohled ČNB a pravidla outsourcingu — scoring spadá do vysokého rizika AI Actu" },
      { v: "verejny", t: "Veřejný sektor / kritická infrastruktura", d: "Kyberbezpečnost a NIS2 — přísnější schvalování dodavatelů" },
      { v: "aiakt", t: "AI by rozhodovala o lidech", d: "Nábor, hodnocení, posuzování klientů — vysoké riziko dle AI Actu s povinným dohledem" },
      { v: "koncern", t: "Pravidla mateřské společnosti", d: "Nástroje schvaluje matka — bývá to nejdelší položka harmonogramu" },
      { v: "zadne", t: "Nic z toho", d: "Žádná zvláštní regulace nad rámec běžného GDPR u zaměstnanců", exclusive: true },
    ],
  },
  vize: {
    key: "vize",
    title: "Jaké hlavní cíle má AI naplnit?",
    subtitle: "Nejčastější chyba není špatný nástroj, ale chybějící cíl: „chceme AI“ se nedá změřit — a co se nedá změřit, to vedení po půl roce zruší. Dobrá vize říká, jaké číslo se má pohnout.",
    multi: true,
    options: [
      { v: "naklady", t: "Snížit náklady", d: "Méně ruční práce a externích služeb na stejný objem" },
      { v: "kapacita", t: "Zvládnout růst bez náboru", d: "Stejní lidé zvládnou větší objem zakázek či agendy" },
      { v: "kvalita", t: "Zvýšit kvalitu a snížit chybovost", d: "Méně chyb, reklamací, zmetků a oprav" },
      { v: "rychlost", t: "Zrychlit reakce a dodání", d: "Kratší doba vyřízení, rychlejší odpovědi zákazníkům" },
      { v: "lide", t: "Ulevit lidem od rutiny", d: "Udržet lidi, uvolnit ruce na odbornou práci" },
      { v: "nevime", t: "Zatím nevíme přesně", d: "Cítíme, že AI je téma, ale konkrétní cíl hledáme", exclusive: true },
    ],
  },
  goals: {
    key: "goals",
    title: "Co od AI očekáváte?",
    subtitle: "Obecné „AI ve výrobě“ neexistuje — vizuální kontrola kvality a výrobní reporting jsou dva úplně jiné projekty. U každé oblasti upřesníte konkrétní záměry a každý dostane vlastní verdikt.",
    multi: true,
    options: [
      { v: "asistence", t: "Asistence zaměstnancům", d: "Nástroje, které lidem pomáhají s každodenní prací" },
      { v: "adminAuto", t: "Automatizace administrativy", d: "Doklady, e-maily, reporty, smlouvy" },
      { v: "vyrobaAI", t: "AI ve výrobě", d: "Kvalita, údržba, plánování, výrobní data" },
      { v: "servis", t: "Zákaznický servis", d: "Komunikace se zákazníky a požadavky" },
      { v: "obchodMarketing", t: "Obchod a marketing", d: "Nabídky, kalkulace, obsah, CRM" },
    ],
  },
  ambition: {
    key: "ambition",
    title: "Jak velkou ambici máte?",
    subtitle: "Pilot není zmenšenina plošného nasazení — je to test, který má za pár týdnů prokázat přínos na jednom procesu. Rollout bez ověřeného pilotu je nejdražší způsob, jak zjistit, že to nefunguje.",
    options: [
      { v: "pilot", t: "Pilot na jednom procesu", d: "6–12 týdnů, jeden proces, měřitelné kritérium — nejlevnější cesta k jistotě" },
      { v: "plosne", t: "Plošné nasazení", d: "Legitimní cíl, ale výsledek ho rozfázuje: vždy se začíná ověřeným pilotem" },
    ],
  },
  data: {
    key: "data",
    title: "V jakém stavu jsou vaše data?",
    subtitle: "AI je přesně tak dobrá jako data, která dostane — tady se rozhoduje většina verdiktů. Pravidlo z praxe: 60–80 % času projektu padne na data a procesy, ne na AI samotnou.",
    options: [
      { v: "papir", t: "Hlavně papír a hlavy lidí", d: "Před AI přijde digitalizace — není to diskvalifikace, jen delší první krok" },
      { v: "excel", t: "Excely a sdílené disky", d: "Digitální, ale roztříštěné — počítejte se sjednocováním a čištěním" },
      { v: "erp", t: "ERP / informační systémy", d: "Nejlepší výchozí pozice, pokud se systémy skutečně používají" },
    ],
  },
  erpUsage: {
    key: "erpUsage",
    title: "Jak se vaše systémy reálně používají?",
    subtitle: "Častý a zrádný stav: systém je koupený, ale realita firmy běží v excelech a po telefonu. AI nad takovými daty počítá přesně, ale z fikce. Upřímná odpověď tady ušetří měsíce.",
    options: [
      { v: "zije", t: "Systém žije", d: "Lidé zapisují průběžně a data odpovídají realitě — na tom se dá stavět" },
      { v: "formalne", t: "Spíš formálně", d: "Zapisuje se zpětně a neúplně — pro AI zásadní rozdíl" },
    ],
  },
  strojeData: {
    key: "strojeData",
    title: "Sbíráte data ze strojů automaticky?",
    subtitle: "Pokročilejší AI ve výrobě (kontrola kvality, prediktivní údržba, plánování) potřebuje data přímo ze strojů. Jestli vznikají automaticky, nebo se opisují ručně, je tady zásadní rozdíl.",
    options: [
      { v: "ano", t: "Ano, stroje posílají data do systému", d: "Hodnoty z výroby se ukládají automaticky — přes řídicí systém nebo MES" },
      { v: "castecne", t: "Částečně / jen některé stroje", d: "Něco se sbírá automaticky, něco se opisuje ručně" },
      { v: "ne", t: "Ne, zapisuje se ručně nebo vůbec", d: "Data z výroby vznikají na papíře, v hlavách lidí nebo nikde" },
      { v: "nevim", t: "Nevím", d: "Nevíme, jestli a jak se strojní data sbírají" },
    ],
  },
  procesy: {
    key: "procesy",
    title: "Máte zmapované firemní procesy?",
    subtitle: "Zmapovaný proces znamená: popsané kroky, jmenovaný vlastník a známé výjimky. Bez toho nelze říct, co přesně má AI dělat — automatizací chaosu vznikne jen rychlejší chaos.",
    options: [
      { v: "ano", t: "Ano", d: "Popsané kroky, vlastníci, výjimky — můžete jít rovnou k výběru pilotu" },
      { v: "castecne", t: "Částečně", d: "Něco popsané je, hodně žije jen v praxi — dotáhnete mapování u dotčených procesů" },
      { v: "ne", t: "Ne", d: "Procesy fungují, ale popsané nejsou — mapování bude první fáze" },
    ],
  },
  zkusenost: {
    key: "zkusenost",
    title: "Jaká je vaše dosavadní zkušenost s AI?",
    subtitle: "Historie určuje startovní pozici. Neúspěšný pokus znamená skepsi, kterou musí druhý pokus nejdřív rozpustit; téměř vždy přitom selhal vlastník, měření nebo data — ne technologie.",
    options: [
      { v: "nic", t: "Zatím žádná", d: "Čistý start — žádná zátěž z minula, o to víc rozhodne první pilot" },
      { v: "stin", t: "Lidé si pomáhají sami", d: "Veřejné nástroje bez pravidel — máte nadšence i riziko úniku dat zároveň" },
      { v: "neuspech", t: "Pokus, který nedopadl", d: "Druhý pokus musí nejdřív nahlas pojmenovat, proč padl ten první" },
      { v: "bezi", t: "Něco už běží", d: "Máte na čem stavět, koho se ptát a co měřit" },
    ],
  },
  lide: {
    key: "lide",
    title: "Jak se na AI dívají vaši lidé?",
    subtitle: "AI projekty zřídka selžou technicky — selžou na tom, že je lidé nepoužívají. Nástroj, který lidé tiše obejdou, vypadá v reportech nasazený — a v praxi je mrtvý.",
    options: [
      { v: "tesi", t: "Spíš se těší", d: "Berou AI jako pomoc — hlídejte hlavně realistická očekávání" },
      { v: "neutral", t: "Vyčkávají", d: "Rozhodne první zkušenost — vyberte pilot, který lidem viditelně uleví" },
      { v: "odpor", t: "Spíš nedůvěra", d: "Zapojte lidi už do mapování a mluvte narovinu, jinak nástroj tiše obejdou" },
    ],
  },
  kapacita: {
    key: "kapacita",
    title: "Kolik lidí na AI vyčleníte?",
    subtitle: "Implementace obnáší osm oblastí práce — od mapování přes data po školení. Otázka zní: na kolik hlav se rozloží? Počítají se i částečné úvazky — ale jen chráněné, ne „až bude čas“.",
    options: [
      { v: "nikdo", t: "Zatím nikdo konkrétní", d: "„Zvládne se to k běžné práci“ — upřímně: nezvládne. Uvidíte, co vše by zůstalo bez vlastníka" },
      { v: "jeden", t: "1 člověk", d: "Reálná cesta menších firem — ale jen sériově, s chráněným úvazkem a externí podporou" },
      { v: "maly", t: "2–3 lidé", d: "Role se dají rozdělit — utáhnete 1–2 piloty souběžně" },
      { v: "tym", t: "4 a více", d: "Souběžné piloty i specializace — hlídejte, ať tým nepracuje odtrženě od provozu" },
    ],
  },
  sponzor: {
    key: "sponzor",
    title: "Má téma AI podporu ve vedení?",
    subtitle: "Sponzor je konkrétní člověk z vedení, který v okamžiku sporu o priority řekne „tohle má přednost“ a kryje to rozpočtem. Chybějící sponzor je nejčastější jediná příčina, proč jinak dobrý projekt tiše umře.",
    options: [
      { v: "ano", t: "Ano, konkrétní člověk z vedení", d: "Největší jednotlivá výhoda, kterou implementace může mít" },
      { v: "ne", t: "Zatím ne", d: "Téma táhnou jednotlivci — postup začne tím, jak sponzora získat" },
    ],
  },
  rozpocet: {
    key: "rozpocet",
    title: "Jakou máte představu o rozpočtu?",
    subtitle: "Neptáme se na částku — ptáme se, jak zralé je rozhodnutí. Pozor jen na kombinaci velké ambice a nulové představy o investici — ta signalizuje, že rozhodnutí ještě neuzrálo.",
    options: [
      { v: "jasna", t: "Jasnou", d: "Víte, kolik investovat — zbývá to ukotvit do měřitelného kritéria úspěchu" },
      { v: "ramcova", t: "Rámcovou", d: "Řádová představa, upřesní se podle pilotu — pro start úplně stačí" },
      { v: "zadna", t: "Žádnou", d: "Legitimní postoj; pilot dodá čísla pro rozhodnutí" },
    ],
  },
};

export type Sub = { v: string; t: string; d: string; weeks: string };

export const SUBQ: Record<string, { label: string; subs: Sub[] }> = {
  asistence: {
    label: "Asistence zaměstnancům",
    subs: [
      { v: "znalostni", t: "Vyhledávání ve firemních dokumentech", d: "Směrnice, návody, smlouvy — odpovědi místo hledání", weeks: "4–8 týdnů" },
      { v: "texty", t: "Generování textů a překlady", d: "E-maily, nabídky, dokumentace, jazykové verze", weeks: "2–4 týdny" },
      { v: "porady", t: "Zápisy a souhrny z porad", d: "Automatické zápisy, úkoly, shrnutí", weeks: "2–4 týdny" },
    ],
  },
  adminAuto: {
    label: "Automatizace administrativy",
    subs: [
      { v: "faktury", t: "Vytěžování dokladů", d: "Faktury, objednávky, dodací listy → rovnou do systému", weeks: "6–10 týdnů" },
      { v: "emaily", t: "Třídění a odpovídání na e-maily", d: "Kategorizace, návrhy odpovědí, směrování", weeks: "6–10 týdnů" },
      { v: "reporty", t: "Automatické reporty", d: "Pravidelné přehledy z firemních dat", weeks: "8–12 týdnů" },
      { v: "smlouvy", t: "Analýza smluv a dokumentů", d: "Kontrola, porovnání, klíčové údaje", weeks: "6–10 týdnů" },
    ],
  },
  vyrobaAI: {
    label: "AI ve výrobě",
    subs: [
      { v: "vyrReporting", t: "Výrobní reporting a přehledy", d: "Co se vyrobilo, prostoje, OEE — bez přepisování", weeks: "6–10 týdnů" },
      { v: "kvalita", t: "Vizuální kontrola kvality", d: "Kamerová kontrola dílů a povrchů", weeks: "12–24 týdnů" },
      { v: "udrzba", t: "Prediktivní údržba", d: "Predikce poruch ze strojních dat", weeks: "16–24+ týdnů" },
      { v: "planovani", t: "Optimalizace plánování výroby", d: "Plánování zakázek, kapacit a materiálu", weeks: "16–24 týdnů" },
    ],
  },
  servis: {
    label: "Zákaznický servis",
    subs: [
      { v: "chatbot", t: "Odpovídání zákazníkům", d: "Asistent nad vašimi produkty a podmínkami", weeks: "8–12 týdnů" },
      { v: "trideni", t: "Třídění a směrování požadavků", d: "Automatická kategorizace a přiřazení", weeks: "6–10 týdnů" },
    ],
  },
  obchodMarketing: {
    label: "Obchod a marketing",
    subs: [
      { v: "nabidky", t: "Tvorba nabídek a kalkulací", d: "Návrhy nabídek z podkladů, historie a ceníků", weeks: "4–8 týdnů" },
      { v: "marketingObsah", t: "Marketingový obsah", d: "Texty, vizuály, kampaně, sociální sítě", weeks: "2–4 týdny" },
      { v: "crmZapisy", t: "Zápisy a follow-upy do CRM", d: "Záznamy ze schůzek, hovorů a e-mailů", weeks: "4–8 týdnů" },
    ],
  },
};

export const LEVELS = [
  { name: "Startovní", tone: "ok" as const, desc: "Máte dobré výchozí podmínky. Implementace je zvládnutelná s malým týmem a ohraničeným pilotem. Hlavní riziko: podcenit, že i jednoduchý projekt potřebuje zmapovaný proces a vlastníka." },
  { name: "Standardní", tone: "warn" as const, desc: "Běžná situace většiny firem. Proveditelné, ale vyžaduje přípravu: dotáhnout data, zmapovat procesy a vyhradit lidem čas. Příprava zabere víc času než samotné nasazení nástroje." },
  { name: "Náročná", tone: "warn" as const, desc: "Kombinace vašich odpovědí znamená systematickou přípravu a více rolí v týmu. Bez vyřešení slabých míst projekt pravděpodobně uvízne na pilotu." },
  { name: "Komplexní", tone: "stop" as const, desc: "V této podobě jde o velký projekt změny, ne nákup softwaru. Doporučení: výrazně zúžit ambici na jeden dobře vybraný proces a nejdřív vyřešit základy. Plošné nasazení odložte." },
];
