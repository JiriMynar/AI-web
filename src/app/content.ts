/**
 * Obsah preneseny z puvodniho modulu vedeni, rozdeleny do sekci nove aplikace.
 * Jen data — sekce z nej vykresluji. Zadna logika.
 */

export type Opt = { v: string; t: string };

// --- Charakteristika podniku: profilove otazky (single-select) ---
export type Field = { key: string; label: string; hint: string; options: Opt[] };

export const PROFILE_FIELDS: Field[] = [
  {
    key: "size",
    label: "Kolik máte zaměstnanců?",
    hint: "Velikost nemění, co je třeba udělat, ale kolik koordinace to stojí. Střední firma dostane AI do provozu za ~90 dní, korporace za ~9 měsíců.",
    options: [
      { v: "s", t: "Do 50" },
      { v: "m", t: "50–250" },
      { v: "l", t: "Nad 250" },
    ],
  },
  {
    key: "focus",
    label: "Jaké je zaměření firmy?",
    hint: "Kancelář a výroba jsou dva odlišné AI světy — v administrativě je nasazení rychlejší a levnější, ve výrobě delší a dražší.",
    options: [
      { v: "vyroba", t: "Výrobní" },
      { v: "admin", t: "Administrativa / služby" },
      { v: "obchod", t: "Obchod / e-commerce" },
      { v: "kombinace", t: "Kombinace" },
    ],
  },
  {
    key: "it",
    label: "Máte vlastní IT oddělení?",
    hint: "AI nástroje skoro vždy potřebují napojení na to, co už máte. Bez vlastního IT to jde přes partnera — počítejte s ním v rozpočtu.",
    options: [
      { v: "ano", t: "Ano" },
      { v: "ne", t: "Ne / jen externí správa" },
    ],
  },
  {
    key: "kdeData",
    label: "Kde máte e-maily a dokumenty?",
    hint: "Rozhoduje, jestli data smí ven a jaké nástroje vůbec přicházejí v úvahu. Nejde o značku, ale o to, kde data fyzicky leží.",
    options: [
      { v: "m365", t: "Microsoft 365 / Outlook" },
      { v: "google", t: "Google Workspace" },
      { v: "vlastni", t: "Vlastní server" },
      { v: "nevim", t: "Nevím" },
    ],
  },
  {
    key: "systemy",
    label: "V čem máte hlavní data a agendu?",
    hint: "Říká zároveň, jak digitální vaše data jsou — a na co se dá nový nástroj napojit.",
    options: [
      { v: "papir", t: "Hlavně papír a hlavy lidí" },
      { v: "excel", t: "Excel, e-maily, sdílené disky" },
      { v: "system", t: "Ucelený systém / ERP" },
      { v: "nevim", t: "Spravuje externí firma" },
    ],
  },
  {
    key: "procesy",
    label: "Máte zmapované procesy?",
    hint: "Zmapovaný proces = popsané kroky, jmenovaný vlastník a známé výjimky.",
    options: [
      { v: "ano", t: "Ano" },
      { v: "castecne", t: "Částečně" },
      { v: "ne", t: "Ne" },
    ],
  },
  {
    key: "objem",
    label: "Kolik hlavní agendy zvládnete za měsíc?",
    hint: "Objem rozhoduje o návratnosti — nákladnější automatizace se vyplatí až od určitého množství. Stačí řádový odhad.",
    options: [
      { v: "maly", t: "Desítky" },
      { v: "stredni", t: "Stovky" },
      { v: "velky", t: "Tisíce a víc" },
      { v: "nevim", t: "Nevím" },
    ],
  },
  {
    key: "mereni",
    label: "Víte, kolik vás ta činnost dnes stojí?",
    hint: "Čas nebo peníze — jediný způsob, jak po nasazení doložit, že se něco zlepšilo. Bez něj nejde přínos obhájit před vedením.",
    options: [
      { v: "ano", t: "Máme změřené" },
      { v: "odhad", t: "Jen odhadem" },
      { v: "ne", t: "Nevíme" },
    ],
  },
];

export const REGS: Opt[] = [
  { v: "gdpr", t: "Osobní údaje zákazníků" },
  { v: "knowhow", t: "Citlivé know-how a výrobní data" },
  { v: "automotive", t: "Automotive / zákaznické audity" },
  { v: "zdravotnictvi", t: "Zdravotnictví" },
  { v: "finance", t: "Finance a pojišťovnictví" },
  { v: "verejny", t: "Veřejný sektor / NIS2" },
  { v: "aiakt", t: "AI by rozhodovala o lidech" },
  { v: "koncern", t: "Pravidla mateřské společnosti" },
];

// --- Stanoveni cilu ---
export const VIZE: Opt[] = [
  { v: "naklady", t: "Snížit náklady" },
  { v: "kapacita", t: "Zvládnout růst bez náboru" },
  { v: "kvalita", t: "Zvýšit kvalitu, snížit chybovost" },
  { v: "rychlost", t: "Zrychlit reakce a dodání" },
  { v: "lide", t: "Ulevit lidem od rutiny" },
];

export const AMBITION: Opt[] = [
  { v: "pilot", t: "Pilot na jednom procesu" },
  { v: "plosne", t: "Plošné nasazení" },
];

export const HORIZONT: Opt[] = [
  { v: "hned", t: "Co nejdřív (do 3 měsíců)" },
  { v: "letos", t: "Během letoška" },
  { v: "neni", t: "Není to tlačené" },
  { v: "termin", t: "Váže to na konkrétní termín" },
];

// Konkretni AI zamery (oblasti) s odhadem delky pilotu
export type Area = { label: string; items: { t: string; d: string; weeks: string }[] };

export const AREAS: Area[] = [
  {
    label: "Asistence zaměstnancům",
    items: [
      { t: "Vyhledávání ve firemních dokumentech", d: "Směrnice, návody, smlouvy — odpovědi místo hledání", weeks: "4–8 týdnů" },
      { t: "Generování textů a překlady", d: "E-maily, nabídky, dokumentace, jazykové verze", weeks: "2–4 týdny" },
      { t: "Zápisy a souhrny z porad", d: "Automatické zápisy, úkoly, shrnutí", weeks: "2–4 týdny" },
    ],
  },
  {
    label: "Automatizace administrativy",
    items: [
      { t: "Vytěžování dokladů", d: "Faktury, objednávky, dodací listy → do systému", weeks: "6–10 týdnů" },
      { t: "Třídění a odpovídání na e-maily", d: "Kategorizace, návrhy odpovědí, směrování", weeks: "6–10 týdnů" },
      { t: "Automatické reporty", d: "Pravidelné přehledy z firemních dat", weeks: "8–12 týdnů" },
      { t: "Analýza smluv a dokumentů", d: "Kontrola, porovnání, klíčové údaje", weeks: "6–10 týdnů" },
    ],
  },
  {
    label: "AI ve výrobě",
    items: [
      { t: "Výrobní reporting a přehledy", d: "Co se vyrobilo, prostoje, OEE — bez přepisování", weeks: "6–10 týdnů" },
      { t: "Vizuální kontrola kvality", d: "Kamerová kontrola dílů a povrchů", weeks: "12–24 týdnů" },
      { t: "Prediktivní údržba", d: "Predikce poruch ze strojních dat", weeks: "16–24+ týdnů" },
      { t: "Optimalizace plánování výroby", d: "Plánování zakázek, kapacit a materiálu", weeks: "16–24 týdnů" },
    ],
  },
  {
    label: "Zákaznický servis",
    items: [
      { t: "Odpovídání zákazníkům", d: "Asistent nad vašimi produkty a podmínkami", weeks: "8–12 týdnů" },
      { t: "Třídění a směrování požadavků", d: "Automatická kategorizace a přiřazení", weeks: "6–10 týdnů" },
    ],
  },
  {
    label: "Obchod a marketing",
    items: [
      { t: "Tvorba nabídek a kalkulací", d: "Návrhy z podkladů, historie a ceníků", weeks: "4–8 týdnů" },
      { t: "Marketingový obsah", d: "Texty, vizuály, kampaně, sociální sítě", weeks: "2–4 týdny" },
      { t: "Zápisy a follow-upy do CRM", d: "Záznamy ze schůzek, hovorů a e-mailů", weeks: "4–8 týdnů" },
    ],
  },
];

// --- Sestaveni AI tymu ---
export type Role = { role: string; why: string; risk: string };

export const TEAM: Role[] = [
  {
    role: "Sponzor z vedení",
    why: "Drží prioritu projektu, rozhoduje o rozpočtu a odblokovává překážky mezi odděleními.",
    risk: "Bez něj projekt prohraje každý spor o čas a peníze. Nejčastější jediná příčina, proč implementace tiše zemře.",
  },
  {
    role: "Koordinátor implementace (AI specialista)",
    why: "Vede mapování procesů, výběr nástrojů, hlídá regulace a měří přínosy. U menších firem klidně částečný úvazek nebo externí spolupráce.",
    risk: "Bez něj implementaci fakticky řídí dodavatel — podle svých priorit a svého ceníku.",
  },
  {
    role: "Vlastníci procesů",
    why: "Lidé, kteří dotčené procesy denně dělají. Bez nich nejde proces zmapovat ani změnit — a potřebují vyhrazený čas, ne práci navíc po večerech.",
    risk: "Bez nich vznikne řešení od stolu, které provoz odmítne používat — a bude mít pravdu.",
  },
  {
    role: "IT podpora nebo externí partner",
    why: "Přístupy, integrace na stávající systémy, bezpečnost. Zapojte je od začátku, ne až při nasazení.",
    risk: "Bez nich se přístupy a integrace řeší obezličkami — bezpečnostní díry a řešení, které se rozpadne při první aktualizaci.",
  },
  {
    role: "Pověřenec / právní podpora",
    why: "Když pracujete s regulovanými daty — posoudí zpracování osobních údajů, smlouvy s poskytovateli AI a dopady AI Actu. Před výběrem nástroje, ne po něm.",
    risk: "Bez nich se smlouvy řeší zpětně — v lepším případě zdržení, v horším pokuta a zákaz zpracování.",
  },
  {
    role: "Garant dat",
    why: "Dá data do použitelné podoby a drží jejich kvalitu. Roztríštěné excely jsou nejčastější důvod, proč pilot nedopadne.",
    risk: "Bez něj pilot poběží na datech, kterým nikdo nevěří — a stejně dopadnou jeho výsledky.",
  },
  {
    role: "Ambasadoři z řad zaměstnanců",
    why: "Pár lidí z provozu, kteří nástroj vyzkouší první a řeknou kolegům pravdu. Adopce se šíří od kolegů, ne shora.",
    risk: "Bez nich adopce stojí jen na příkazech shora — a ty dlouhodobě nefungují.",
  },
];

export type Area8 = { t: string; d: string; risk: string };

export const WORK_AREAS: Area8[] = [
  { t: "Mapování procesů", d: "Popsat dotčené procesy, najít vlastníky, určit, kde AI dává smysl.", risk: "Bez vlastníka se automatizuje chaos — jen rychleji." },
  { t: "Práce s daty", d: "Audit, čištění, digitalizace a příprava dat pro konkrétní záměr.", risk: "Bez vlastníka výstupům nelze věřit a ruční ověřování spolkne celou úsporu." },
  { t: "Regulace a směrnice", d: "AI Act, GDPR, interní pravidla — co se smí, kam smí data, kdo odpovídá.", risk: "Bez vlastníka pokuty a projekt zastavený právníkem v polovině." },
  { t: "Výběr a nasazení nástrojů", d: "Průzkum trhu, testování, integrace na systémy, bezpečnost.", risk: "Bez vlastníka vybírá fakticky dodavatel podle svého katalogu — vendor lock-in." },
  { t: "Pilot a měření přínosů", d: "Návrh pilotu, kritéria úspěchu, sběr čísel před a po, kalkulace.", risk: "Bez vlastníka nemá projekt čísla, kterými by se obhájil." },
  { t: "Školení a adopce", d: "Naučit lidi nástroj používat, upravit postupy, sbírat zpětnou vazbu.", risk: "Bez vlastníka se lidé do měsíce vrátí ke starým postupům a nástroj osiří." },
  { t: "Komunikace s vedením", d: "Reporting postupu, obhajoba priorit a rozpočtu, řízení očekávání.", risk: "Bez vlastníka ztratí vedení přehled, projekt prioritu — a pak rozpočet." },
  { t: "Provoz a správa", d: "Údržba nasazených řešení, vztah s dodavateli, průběžné vyhodnocování.", risk: "Bez vlastníka řešení tiše degradují a vzniká neudržovaný dluh." },
];

// --- Pravidla z praxe (vybrana) ---
export type Rule = { big: string; label: string; d: string };

export const RULES: Rule[] = [
  { big: "60–80 %", label: "času projektu padne na procesy a data", d: "Samotná AI je menšina práce. Kdo plánuje jen nasazení nástroje, plánuje pětinu projektu." },
  { big: "1 → 2", label: "nejdřív proces, pak nástroj — nikdy obráceně", d: "Výběr nástroje před zmapováním procesu je nejčastější příčina nepoužívaných licencí." },
  { big: "MIN 20 %", label: "úvazku vlastníka procesu po dobu pilotu", d: "Bez vyhrazeného času lidí z procesu se pilot zastaví. „Po večerech k běžné práci“ nefunguje." },
  { big: "6–12 týdnů", label: "typická délka pilotu včetně vyhodnocení", d: "Kratší pilot nic neprokáže, delší bez výsledků ztrácí podporu." },
  { big: "100 %", label: "pilotů potřebuje měřitelné kritérium předem", d: "Metrika odvozená z cíle, změřená před startem i po konci. Co nejde změřit, nejde obhájit." },
];
