# Plán rozšíření formuláře (modul *vedení*) — chybějící oborové otázky

Tento dokument je plán postupné integrace otázek, které jsou v cílových oborech
(výroba, administrativa/služby, obchod/e-commerce/logistika) standard, ale formulář
modulu *vedení* se na ně dnes neptá vůbec. Integrujeme po fázích; každá fáze je
samostatně nasaditelná a **každá otázka musí být zapojená do vyhodnocení** (žádný
dead input — viz dřívější náprava `vize`, která se sbírala a nikam netekla).

Rozsah: vše zůstává uvnitř `src/roles/vedeni/` (modul neimportuje nic z jiných rolí).
Otázky mohou později inspirovat moduly HR a specialista, ale každá role si drží vlastní kopii.

---

## 0. Hlavní zásada — formulář vyplní netechnický člověk

Cílový uživatel je majitel nebo vedoucí firmy, ne IT specialista. Z toho plyne sedm
pravidel, která **platí pro každou novou otázku**:

1. **Ptáme se na pozorovatelnou realitu, ne na odborné pojmy.** „Kde máte firemní
   e-maily?" místo „jste on-premise?". „Posílají stroje data samy?" místo „máte historian/MES?".
2. **Každá otázka má únikovou volbu „Nevím".** Realizuje se přes `exclusive: true`
   (jako dnešní „Nic z toho" / „Zatím nevíme přesně") u vícevýběru; u jednovýběru stačí
   běžná volba „Nevím" (výběrem se sama nahradí). Netechnik nesmí uváznout.
3. **Konkrétní příklady v popisu volby (`d`).** Značky a situace, které uživatel pozná
   (Pohoda, SAP, Outlook, Gmail) — ne abstraktní kategorie.
4. **Max 4 volby, krátký název (`t`), vysvětlení patří do `d`.** Konzistentní se stávajícími otázkami.
5. **Žádné volné psaní.** UI je výběr karet (`OptionCard`) — vše musí jít vyjádřit volbami.
6. **Otázky relevantní jen pro část firem zobrazujeme podmíněně.** Např. otázka na data
   ze strojů se ukáže jen u zvolených výrobních záměrů (mechanika `visible` v `Pruvodce.tsx`,
   stejně jako dnes `erpUsage` jen při `data === "erp"`).
7. **„Nevím" nikdy není slepá ulička v logice.** Vede k doporučení „tohle si nejdřív
   zjistěte / ověřte s dodavatelem", ne k chybě ani k falešně optimistickému verdiktu.

---

## 1. Jak se přidává jedna otázka (technický postup)

Každá nová otázka se dotkne těchto míst:

1. **`data.ts`** — přidat `Q.<key>` (`Question`) a zařadit `<key>` do `questions` příslušného
   `STEPS`. U vícevýběru nastavit `multi: true`; u úniku `exclusive: true`.
2. **`logic.ts`** — přidat pole do typu `Answers`; zapojit do vyhodnocení podle účelu:
   `buildCtx` (odvozený příznak), `score` (náročnost), `evalSub` (gap/note u záměru),
   `buildTeam` / `buildDuties` (role), `buildScenarios` (rizikový scénář). **Nesmí zůstat nezapojené.**
3. **`Pruvodce.tsx`** — u podmíněné otázky rozšířit filtr `visible`. Validaci `stepDone`
   není nutné měnit (single = neprázdný string, multi = `length > 0`); `toggleMulti` zvládá `exclusive` sám.
4. **`Report.tsx`** — pokud se má odpověď nebo odvozená poznámka zobrazit v reportu, doplnit.
5. **Ověřit** `tsc` / `npm run build` a že staré sdílené odkazy nepadají (nová pole jsou nepovinná).

### Definition of Done (šablona pro každou otázku)

- [ ] Otázka v `data.ts` s netechnickým zněním a volbou „Nevím"
- [ ] Pole v `Answers` (`logic.ts`)
- [ ] Zapojeno do vyhodnocení — konkrétně uvedeno kam (žádný dead input)
- [ ] Validace / podmíněné zobrazení v `Pruvodce.tsx`
- [ ] Případně zobrazení v `Report.tsx`
- [ ] `tsc` zelený; sdílené odkazy fungují

---

## 2. Fáze integrace

Pořadí je voleno podle dopadu na proveditelnost: nejdřív to, co nejvíc mění verdikty.

### Fáze 1 — Proveditelnostní jádro (gating)

Tři otázky, které nejvíc určují, co je technicky a finančně průchodné.

**1.1 Hlavní firemní systém** · krok **Profil** · `Answers.systemy`
> *Znění:* „V čem vedete hlavní firemní agendu (objednávky, sklad, fakturace, zakázky)?"
> *Proč:* určuje, jak snadno a draho se nový nástroj napojí — je to první otázka integrátora.

Volby (jeden výběr):
- `velkysystem` — „Velký podnikový systém" — *Např. SAP, Microsoft Dynamics, Helios, K2 — ucelený systém pro celou firmu*
- `ucetni` — „Účetní nebo skladový program" — *Např. Pohoda, Money, Abra, Vario — hlavně účetnictví a sklad*
- `excelnic` — „Hlavně Excel, e-maily a papír" — *Žádný ucelený systém, agenda žije v tabulkách a hlavách lidí*
- `nevim` — „Nevím / spravuje to externí firma" — *Systémy řeší externí dodavatel, sami do toho nevidíme*

*Napojení:* `evalSub` — průřezová poznámka o náročnosti napojení u integračních záměrů
(`excelnic` → napojení = zavést evidenci; `nevim` → nejdřív zjistit systém). `buildTeam` — role IT/partnera.
*Pozn.:* doplňuje stávající `data` (stav dat), neduplikuje ho — firma může mít Pohodu a přitom hodně v Excelu.

**1.2 Kde jsou e-maily a dokumenty** · krok **Profil** · `Answers.kdeData`
> *Znění:* „Kde máte firemní e-maily a dokumenty?"
> *Proč:* gating otázka — rozhoduje, jestli smí data ven a jaké nástroje vůbec přicházejí v úvahu.

Volby (jeden výběr):
- `m365` — „Microsoft 365 / Outlook" — *E-maily a dokumenty v Microsoftu (Teams, OneDrive, SharePoint)*
- `google` — „Google Workspace / Gmail" — *Firemní Gmail a Disk Google*
- `vlastni` — „Na vlastním serveru ve firmě" — *Data zůstávají u vás, ne v cloudu*
- `nevim` — „Nevím"

*Napojení:* `evalSub` — `vlastni` → poznámka o privátním nasazení vs. vědomém puštění dat ven;
`nevim` → gap „nejdřív zjistit, kde data leží". Interaguje s `regs` (`knowhow` + cloud → vyšší opatrnost).

**1.3 Data ze strojů** · krok **Data a procesy** · `Answers.strojeData` · **jen když je zvolen výrobní záměr (`goals` obsahuje `vyrobaAI`)**
> *Znění:* „Sbíráte data ze strojů automaticky?"
> *Proč:* výrobní AI (kvalita, údržba, plánování, reporting) stojí a padá na dostupnosti dat ze strojů.

Volby (jeden výběr):
- `ano` — „Ano, stroje posílají data do systému" — *Hodnoty z výroby se ukládají automaticky (řídicí systém, MES)*
- `castecne` — „Částečně / jen některé stroje" — *Něco automaticky, něco se opisuje ručně*
- `ne` — „Ne, zapisuje se ručně nebo vůbec" — *Data z výroby vznikají na papíře, v hlavách lidí nebo nikde*
- `nevim` — „Nevím"

*Napojení:* dává `evalSub` skutečný OT signál pro `vyrReporting`/`udrzba` místo odvozování
z obecného `data`; `ne`/`castecne`/`nevim` přidá strojní gap. (`kvalita` zůstává u svého kamerového gapu.)

### Fáze 2 — Návratnost a měřitelnost

Doplní vstupy, které report dnes vyžaduje (ROI, metrika), ale nesbírá.

**2.1 Objem agendy** · krok **Data a procesy** · `Answers.objem`
> *Znění:* „Kolik té hlavní agendy přibližně zvládnete za měsíc?"
> *Proč:* objem je faktor č. 1 návratnosti — vytěžování 150 vs. 15 000 dokladů jsou dva různé projekty.

Volby (jeden výběr):
- `maly` — „Spíš málo (desítky měsíčně)" — *Do ~100 dokladů, požadavků nebo nabídek za měsíc*
- `stredni` — „Středně (stovky měsíčně)" — *Pravidelná, ale ne extrémní zátěž*
- `velky` — „Hodně (tisíce a více měsíčně)" — *Velký opakovaný objem — automatizace se vyplatí nejrychleji*
- `nevim` — „Nevím / těžko odhadnout"

*Napojení:* `buildScenarios` — scénář „NÁSTROJ BEZ OBJEMU" při `maly`/`nevim` v kombinaci
s nákladnou automatizací. Vědomě nezasahuje do skóre (objem je business-case, ne feasibility).

**2.2 Měříte to dnes** · krok **Data a procesy** · `Answers.mereni`
> *Znění:* „Víte, kolik vás ta činnost dnes stojí (čas nebo peníze)?"
> *Proč:* logika káže „100 % pilotů potřebuje metriku předem" — ale nikdy se neptá, jestli ji firma má.

Volby (jeden výběr):
- `ano` — „Ano, máme to změřené" — *Známe čísla — kolik hodin nebo korun to dnes spotřebuje*
- `odhad` — „Jen odhadem" — *Přesně neměříme, ale umíme kvalifikovaně odhadnout*
- `ne` — „Nevíme" — *Dnes nesledujeme — nemáme s čím porovnat výsledek*

*Napojení:* `buildScenarios` — scénář „BEZ VÝCHOZÍHO ČÍSLA" při `ne`. Uzavírá smyčku,
kde nástroj metriku vyžaduje („100 % pilotů potřebuje metriku předem"), ale dosud nekontroloval.

### Fáze 3 — Realita nasazení

**3.1 Počet koncových uživatelů** · krok **Lidé** · `Answers.uzivatele`
> *Znění:* „Kolik lidí bude nástroj nakonec používat?"
> *Proč:* licence i náročnost adopce škálují s počtem uživatelů — ne s velikostí implementačního týmu (`kapacita`).

Volby: `par` „Pár lidí (do 10)" · `oddeleni` „Celé oddělení (desítky)" · `firma` „Velká část firmy (stovky)" · `nevim` „Zatím nevíme"
*Napojení:* `buildTeam` (ambasadoři při mnoha uživatelích + nedůvěře); `buildDuties` (rozsah školení).

**3.2 Jazyky firmy** · krok **Profil** · `Answers.jazyky` · **multi**
> *Znění:* „V jakých jazycích firma běžně komunikuje?"
> *Proč:* ovlivňuje kvalitu LLM a OCR (čeština/němčina) i volbu nástroje; dnes je jazyk jen use-case v SUBQ, ne omezení.

Volby (více výběrů): `cestina` · `slovenstina` · `nemcina` · `anglictina` · `jine`
*Napojení:* `evalSub` — poznámka u `servis`/`texty`/`smlouvy`/`chatbot`; soulad s `automotive`/`koncern` (často DE/EN).

**3.3 Časový horizont** · krok **Vize** · `Answers.horizont`
> *Znění:* „Do kdy byste chtěli první výsledek?"
> *Proč:* termín a jeho hnací síla mění sekvenci kroků i realističnost ambice.

Volby: `hned` „Co nejdřív (do 3 měsíců)" · `letos` „Během letošního roku" · `neni` „Není to časově tlačené" · `termin` „Váže to na konkrétní termín (zakázka, audit, dotace)"
*Napojení:* `hned` + plošná ambice → scénář konfliktu; `termin` → poznámka zmapovat termín jako první.

### Fáze 4 — České a organizační specifikum

**4.1 Dotace** · krok **Lidé** · `Answers.dotace`
> *Znění:* „Plánujete na to využít dotaci?"
> *Proč:* velmi česká realita — dotace (OP TAK / Digitální podnik a podobné) mění harmonogram,
> pravidla výběru dodavatele i dokumentační zátěž. `rozpocet` to dnes nezachytí.

Volby: `ano` „Ano, počítáme s dotací" · `zvazujeme` „Zvažujeme to" · `ne` „Ne, z vlastního" · `nevim` „Nevím"
*Napojení:* `buildScenarios` — vázanost výběru a termínů na výzvu; interakce s `rozpocet`.

**4.2 Odbory / rada zaměstnanců** · krok **Lidé** · `Answers.odbory`
> *Znění:* „Máte ve firmě odbory nebo radu zaměstnanců?"
> *Proč:* u větších a koncernových firem může nasazení AI dotýkající se míst vyžadovat projednání —
> povinný krok harmonogramu. `lide` řeší postoj, ne formální reprezentaci.

Volby: `ano` „Ano" · `ne` „Ne" · `nevim` „Nevím"
*Napojení:* `ano` + záměry dotýkající se míst (nebo `lide = odpor`) → poznámka v týmu/povinnostech o projednání.

---

## 3. Dopad na sdílené reporty (verzování)

Sdílené reporty nesou odpovědi zakódované v URL hashi, payload má `v: 1`. Nová pole v `Answers`
jsou **nepovinná**, takže:

- Nové reporty je ponesou; staré odkazy je prostě nemají a logika je čte přes `?` (undefined) — nepadá to.
- Bump verze **není** nutný pro čistě aditivní otázky. Zvážit ho u Fáze 2+, pokud bychom měnili
  *význam* stávajících polí nebo chtěli starým odkazům zobrazit hlášku „report z dřívější verze".

---

## 4. Postup integrace (tracking)

- [x] **Fáze 1** — `systemy`, `kdeData`, `strojeData` (proveditelnostní jádro) — *hotovo, commit Fáze 1*
- [x] **Fáze 2** — `objem`, `mereni` (návratnost a měřitelnost) — *hotovo, scénáře NÁSTROJ BEZ OBJEMU + BEZ VÝCHOZÍHO ČÍSLA*
- [ ] **Fáze 3** — `uzivatele`, `jazyky`, `horizont` (realita nasazení)
- [ ] **Fáze 4** — `dotace`, `odbory` (české a organizační specifikum)

Doporučený start: **Fáze 1** jako jeden uzavřený celek (otázky + napojení do logiky + validace),
ať je hned vidět dopad na verdikty proveditelnosti.
