import { useProfile, Profile } from "./store";
import { Card, ChoiceField, MultiField, SectionHeader } from "./ui";
import { AMBITION, AREAS, CHARAKTERISTIKA_GROUPS, HORIZONT, MERENI, OBJEM, Opt, RULES, TEAM, VIZE, WORK_AREAS } from "./content";

export function CharakteristikaPodniku() {
  const [p, setP] = useProfile();
  const pr = p as Record<string, unknown>;

  const setStr = (k: keyof Profile) => (v: string) => setP((prev) => ({ ...prev, [k]: v } as Profile));

  const toggleMulti = (key: keyof Profile, opts: Opt[]) => (v: string) =>
    setP((prev) => {
      const cur = ((prev[key] as string[]) || []);
      const opt = opts.find((o) => o.v === v);
      let next: string[];
      if (opt?.exclusive) {
        next = cur.includes(v) ? [] : [v];
      } else {
        const base = cur.filter((x) => !opts.find((o) => o.v === x)?.exclusive);
        next = base.includes(v) ? base.filter((x) => x !== v) : [...base, v];
      }
      return { ...prev, [key]: next } as Profile;
    });

  return (
    <div>
      <SectionHeader
        eyebrow="CHARAKTERISTIKA PODNIKU"
        title="Jaká je vaše firma?"
        intro="Pár údajů o prostředí, ve kterém se bude AI zavádět. Z nich vychází, co je reálné a kde začít. Všechno se ukládá do tohoto prohlížeče."
      />
      <div className="space-y-6">
        {CHARAKTERISTIKA_GROUPS.map((g) => (
          <Card key={g.heading} className="space-y-7">
            <div className="font-mono text-[11px] font-semibold tracking-label text-[#7A8794]">{g.heading.toUpperCase()}</div>
            {g.fields
              .filter((f) => !f.showIf || f.showIf(pr))
              .map((f) =>
                f.multi ? (
                  <MultiField
                    key={f.key}
                    label={f.label}
                    hint={f.hint}
                    options={f.options}
                    locked={f.locked}
                    values={(pr[f.key] as string[]) || []}
                    onToggle={toggleMulti(f.key as keyof Profile, f.options)}
                  />
                ) : (
                  <ChoiceField
                    key={f.key}
                    label={f.label}
                    hint={f.hint}
                    options={f.options}
                    value={(pr[f.key] as string) || ""}
                    onChange={setStr(f.key as keyof Profile)}
                  />
                )
              )}
          </Card>
        ))}
      </div>
      <p className="mt-4 font-mono text-[11px] tracking-label text-[#9AA7B4]">ZMĚNY SE UKLÁDAJÍ AUTOMATICKY DO TOHOTO PROHLÍŽEČE</p>
    </div>
  );
}

export function FiremniCile() {
  const [p, setP] = useProfile();
  const setStr = (k: keyof Profile) => (v: string) => setP((prev) => ({ ...prev, [k]: v } as Profile));
  const toggleVize = (v: string) =>
    setP((prev) => ({
      ...prev,
      vize: (prev.vize || []).includes(v) ? (prev.vize || []).filter((x) => x !== v) : [...(prev.vize || []), v],
    }));
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
      <Card className="mt-5 space-y-7">
        <MultiField
          label="Jaké cíle má AI naplnit?"
          hint="Vyberte vše. „Chceme AI“ se nedá změřit — vyberte číslo, které vás bolí."
          options={VIZE}
          values={p.vize || []}
          onToggle={toggleVize}
        />
        <ChoiceField
          label="Jak velkou ambici máte?"
          hint="Pilot je test, který za pár týdnů prokáže přínos na jednom procesu. Rollout bez ověřeného pilotu je nejdražší způsob, jak zjistit, že to nefunguje."
          options={AMBITION}
          value={p.ambition}
          onChange={setStr("ambition")}
        />
        <ChoiceField
          label="Do kdy chcete první výsledek?"
          hint="Termín mění pořadí kroků i to, jak velká ambice je reálná."
          options={HORIZONT}
          value={p.horizont}
          onChange={setStr("horizont")}
        />
      </Card>
      <Card className="mt-5 space-y-7">
        <div>
          <div className="text-[13px] font-semibold text-[#0E1726]">Váš hlavní cíl</div>
          <textarea
            value={p.cil}
            onChange={(e) => setP((prev) => ({ ...prev, cil: e.target.value }))}
            rows={2}
            placeholder="např. zkrátit zpracování faktur z 8 na 3 minuty do Q3"
            className="mt-3 w-full rounded-lg border border-[#D8E1EB] bg-white px-3.5 py-2.5 text-[14px] text-[#0E1726] placeholder:text-[#9AA7B4] focus:border-[#1F7AD4] focus:outline-none"
          />
        </div>
        <ChoiceField
          label="Jaký objem má ta agenda?"
          hint="U činnosti, kterou chcete zlepšit — kolik dokladů, požadavků nebo kusů měsíčně. Objem rozhoduje o návratnosti: nákladnější automatizace se vyplatí až od určitého množství."
          options={OBJEM}
          value={p.objem}
          onChange={setStr("objem")}
        />
        <ChoiceField
          label="Víte, kolik vás ta činnost dnes stojí?"
          hint="Kolik hodin nebo korun dnes spotřebuje. Jediné číslo, se kterým po nasazení porovnáte výsledek a obhájíte přínos před vedením."
          options={MERENI}
          value={p.mereni}
          onChange={setStr("mereni")}
        />
        <p className="text-[12px] leading-relaxed text-[#9AA7B4]">Ukládá se do tohoto prohlížeče spolu se zbytkem profilu.</p>
      </Card>

      <h2 className="mb-1 mt-10 text-xl font-semibold text-[#0E1726]">Co konkrétně AI umí</h2>
      <p className="mb-2 text-[14px] leading-relaxed text-[#52606D]">
        Obecné „AI ve výrobě“ neexistuje — vizuální kontrola kvality a výrobní reporting jsou dva úplně jiné projekty. Přehled konkrétních záměrů s orientačním časem na pilot:
      </p>
      {AREAS.map((a) => (
        <div key={a.label}>
          <div className="mb-2 mt-5 font-mono text-[11px] font-semibold tracking-label text-[#7A8794]">{a.label.toUpperCase()}</div>
          <div className="space-y-2">
            {a.items.map((it) => (
              <div key={it.t} className="flex items-start justify-between gap-3 rounded-lg border border-[#E6ECF3] bg-white px-4 py-3">
                <div>
                  <div className="text-[14px] font-medium text-[#0E1726]">{it.t}</div>
                  <div className="mt-0.5 text-[13px] leading-relaxed text-[#7A8794]">{it.d}</div>
                </div>
                <span className="mt-0.5 flex-shrink-0 rounded-full bg-[#EAF2FB] px-2.5 py-1 font-mono text-[11px] font-medium text-[#1F7AD4]">{it.weeks}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function AITym() {
  return (
    <div>
      <SectionHeader
        eyebrow="SESTAVENÍ AI TÝMU"
        title="Kdo to ponese"
        intro="Implementace se neutáhne sama. Tohle jsou role, které u zavádění AI obvykle potřebujete — a co se stane, když chybí."
      />
      <div className="space-y-4">
        {TEAM.map((r) => (
          <Card key={r.role} className="border-l-2 border-l-[#1F7AD4]">
            <div className="text-[15px] font-semibold text-[#0E1726]">{r.role}</div>
            <p className="mt-1.5 text-[14px] leading-relaxed text-[#52606D]">{r.why}</p>
            <p className="mt-2 text-[13px] leading-relaxed text-[#D1495B]">{r.risk}</p>
          </Card>
        ))}
      </div>

      <h2 className="mb-1 mt-10 text-xl font-semibold text-[#0E1726]">Osm oblastí práce</h2>
      <p className="mb-5 text-[14px] leading-relaxed text-[#52606D]">
        Ať tým tvoří jeden člověk nebo skupina, těchto osm oblastí musí mít někoho, kdo je drží. U každé je vidět, co se stane, když vlastníka nemá.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {WORK_AREAS.map((w) => (
          <Card key={w.t}>
            <div className="text-[14px] font-semibold text-[#0E1726]">{w.t}</div>
            <p className="mt-1 text-[13px] leading-relaxed text-[#52606D]">{w.d}</p>
            <p className="mt-2 text-[12px] leading-relaxed text-[#9AA7B4]">{w.risk}</p>
          </Card>
        ))}
      </div>
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
        intro="Zmapovaný proces = popsané kroky, jmenovaný vlastník a známé výjimky. Bez toho nelze říct, co přesně má AI dělat — automatizací chaosu vznikne jen rychlejší chaos."
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

      <h2 className="mb-4 mt-10 text-xl font-semibold text-[#0E1726]">Pár čísel z praxe</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {RULES.map((r) => (
          <Card key={r.label}>
            <div className="font-mono text-[18px] font-bold text-[#1F7AD4]">{r.big}</div>
            <div className="mt-1 text-[13px] font-semibold text-[#0E1726]">{r.label}</div>
            <p className="mt-1.5 text-[13px] leading-relaxed text-[#52606D]">{r.d}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
