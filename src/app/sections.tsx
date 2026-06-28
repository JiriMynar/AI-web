import { useProfile, Profile } from "./store";
import { Card, ChoiceField, SectionHeader } from "./ui";

export function CharakteristikaPodniku() {
  const [p, setP] = useProfile();
  const set = (k: keyof Profile) => (v: string) => setP((prev) => ({ ...prev, [k]: v }));
  return (
    <div>
      <SectionHeader
        eyebrow="CHARAKTERISTIKA PODNIKU"
        title="Jaká je vaše firma?"
        intro="Pár základních údajů o firmě. Z nich vychází doporučení v dalších sekcích. Ukládá se to rovnou do tohoto prohlížeče — po obnovení stránky tu všechno zůstane."
      />
      <Card className="space-y-7">
        <ChoiceField
          label="Zaměření firmy"
          options={[
            { v: "admin", t: "Administrativa / služby" },
            { v: "vyroba", t: "Výroba" },
            { v: "obchod", t: "Obchod / e-shop" },
            { v: "kombinace", t: "Kombinace" },
          ]}
          value={p.zamereni}
          onChange={set("zamereni")}
        />
        <ChoiceField
          label="Stav dat"
          hint="V jakém stavu jsou dnes firemní data — od papíru po ucelený systém."
          options={[
            { v: "papir", t: "Papír a hlavy lidí" },
            { v: "excel", t: "Excel a sdílené disky" },
            { v: "system", t: "Ucelený systém / ERP" },
          ]}
          value={p.data}
          onChange={set("data")}
        />
        <ChoiceField
          label="Vlastní IT"
          options={[
            { v: "ano", t: "Máme vlastní IT" },
            { v: "ne", t: "Nemáme vlastní IT" },
          ]}
          value={p.it}
          onChange={set("it")}
        />
        <ChoiceField
          label="Kapacita na AI"
          hint="Kolik lidí se tomu může reálně věnovat."
          options={[
            { v: "nikdo", t: "Zatím nikdo" },
            { v: "jeden", t: "Jeden člověk" },
            { v: "tym", t: "Malý tým" },
          ]}
          value={p.kapacita}
          onChange={set("kapacita")}
        />
      </Card>
      <p className="mt-4 font-mono text-[11px] tracking-label text-[#9AA7B4]">ZMĚNY SE UKLÁDAJÍ AUTOMATICKY DO TOHOTO PROHLÍŽEČE</p>
    </div>
  );
}

export function FiremniCile() {
  const [p, setP] = useProfile();
  return (
    <div>
      <SectionHeader
        eyebrow="STANOVENÍ FIREMNÍCH CÍLŮ"
        title="Ujasněte si, kam se chcete dostat"
        intro="Nejdražší chyba není špatný nástroj — je to neujasněný cíl. Co se nedá změřit, to vedení po půl roce zruší."
      />
      <Card>
        <div className="font-mono text-[11px] tracking-label text-[#9AA7B4]">DOBRÝ CÍL =</div>
        <p className="mt-2 text-[18px] font-semibold leading-snug text-[#0E1726]">
          co měříte <span className="text-[#9AA7B4]">+</span> z čeho kam <span className="text-[#9AA7B4]">+</span> do kdy
        </p>
        <div className="mt-6 space-y-2">
          <div className="flex gap-2.5">
            <span className="mt-px font-semibold text-[#D1495B]">✕</span>
            <p className="text-[14px] leading-relaxed text-[#52606D]">„Snížit náklady na administrativu.“</p>
          </div>
          <div className="flex gap-2.5">
            <span className="mt-px font-semibold text-[#12A065]">✓</span>
            <p className="text-[14px] leading-relaxed text-[#0E1726]">„Zkrátit zpracování faktur z 8 na 3 minuty — ušetřit ~120 hodin měsíčně — do konce Q3.“</p>
          </div>
        </div>
      </Card>
      <Card className="mt-5">
        <div className="text-[13px] font-semibold text-[#0E1726]">Váš hlavní cíl</div>
        <textarea
          value={p.cil}
          onChange={(e) => setP((prev) => ({ ...prev, cil: e.target.value }))}
          rows={2}
          placeholder="např. zkrátit zpracování faktur z 8 na 3 minuty do Q3"
          className="mt-3 w-full rounded-lg border border-[#D8E1EB] bg-white px-3.5 py-2.5 text-[14px] text-[#0E1726] placeholder:text-[#9AA7B4] focus:border-[#1F7AD4] focus:outline-none"
        />
        <p className="mt-2 text-[12px] leading-relaxed text-[#9AA7B4]">Sdílí se s „Charakteristikou podniku“ a ukládá se do tohoto prohlížeče.</p>
      </Card>
    </div>
  );
}

export function AITym() {
  const roles: [string, string][] = [
    ["Sponzor z vedení", "Drží prioritu, uvolňuje čas a peníze. Bez něj projekt usne."],
    ["Vlastník procesu", "Zná, jak práce reálně běží, a má čas se zapojit."],
    ["Implementátor / integrátor", "Postaví řešení z hotových nástrojů a napojí ho na systémy."],
    ["Někdo na data", "Dá data do stavu, ze kterého může AI těžit."],
  ];
  return (
    <div>
      <SectionHeader
        eyebrow="SESTAVENÍ AI TÝMU"
        title="Kdo to ponese"
        intro="Implementace se neutáhne sama. Tady budou role, které vychází z vaší charakteristiky podniku — u každé i to, co se stane, když chybí."
      />
      <Card className="space-y-5">
        <p className="text-[14px] leading-relaxed text-[#52606D]">
          Detailní doporučení týmu podle vašeho profilu sem teprve stěhuji z původní verze. Zatím obecně — u zavádění AI obvykle potřebujete:
        </p>
        <ul className="space-y-3">
          {roles.map(([r, d]) => (
            <li key={r} className="border-l-2 border-[#1F7AD4] pl-4">
              <div className="text-[14px] font-semibold text-[#0E1726]">{r}</div>
              <p className="mt-1 text-[14px] leading-relaxed text-[#52606D]">{d}</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

export function PopisPrace() {
  return (
    <div>
      <SectionHeader
        eyebrow="SESTAVIT POPIS PRÁCE"
        title="Popis pozice pro AI z reálné práce"
        intro="Sestavte popis pracovní pozice z konkrétní náplně, ne z buzzwordů — a vygenerujte z něj hotový inzerát."
      />
      <Card>
        <p className="text-[14px] leading-relaxed text-[#52606D]">
          Interaktivní stavěč popisu se sem přesouvá do nového vzhledu. Než to dokončím, najdete ho v původní podobě tady:
        </p>
        <a
          href="/hr"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#1F7AD4] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#1A6BBC]"
        >
          Otevřít stavěč popisu →
        </a>
      </Card>
    </div>
  );
}

export function PrehledyMezd() {
  return (
    <div>
      <SectionHeader
        eyebrow="PŘEHLEDY MEZD V OBORU AI"
        title="Kolik stojí lidé na AI"
        intro="Orientační mzdová pásma pro role kolem zavádění AI — podle seniority, zaměření a regionu."
      />
      <Card>
        <p className="text-[14px] leading-relaxed text-[#52606D]">
          Přehledy mezd sem teprve stěhuji. Budou stavět na veřejných platových přehledech a inzerci — ne na oficiální statistice, protože AI implementační role zatím nemají vlastní kód v CZ-ISCO. Čísla proto budou vždy orientační, jako vodítko k jednání.
        </p>
      </Card>
    </div>
  );
}

export function MapovaniProcesu() {
  const steps: [string, string][] = [
    ["Vyberte jeden proces", "Jednu konkrétní činnost, která lidi nejvíc zdržuje. Ne deset najednou — jeden."],
    ["Popište kroky tak, jak opravdu běží", "Krok za krokem realitu, ne ideál z manuálu. Kde to dnes vázne, se ukáže samo."],
    ["Označte vlastníka a výjimky", "Kdo za krok odpovídá a kdy se postupuje jinak. Výjimky bývají to nejdražší."],
    ["Najděte, kde má AI smysl", "Místa s rutinou, opakováním a velkým objemem. Tam hledejte, ne všude."],
    ["Změřte výchozí číslo", "Kolik hodin nebo korun proces dnes stojí. Bez něj později neobhájíte, že se něco zlepšilo."],
  ];
  return (
    <div>
      <SectionHeader
        eyebrow="PRVNÍ KROKY TÝMU · MAPOVÁNÍ PROCESŮ"
        title="Zmapujte proces dřív, než sáhnete po nástroji"
        intro="AI postavená nad nezmapovaným procesem jen zrychlí chaos. Z praxe padne 60–80 % práce na úspěšném projektu na procesy a data — samotná AI je menšina."
      />
      <div className="space-y-4">
        {steps.map(([t, d], i) => (
          <Card key={t} className="flex gap-4">
            <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full border border-[#CFE0F0] bg-[#EAF2FB] font-mono text-[15px] font-semibold text-[#1F7AD4]">
              {i + 1}
            </span>
            <div>
              <div className="text-[15px] font-semibold text-[#0E1726]">{t}</div>
              <p className="mt-1 text-[14px] leading-relaxed text-[#52606D]">{d}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
