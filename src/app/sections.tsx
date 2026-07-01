import { Link } from "react-router-dom";
import { useProfile, Profile, DEFAULT_PROFILE } from "./store";
import { Card, ChoiceField, GRAD, MultiField, SectionHeader, chipBase, chipOff, chipOn } from "./ui";
import { AMBITION, CHARAKTERISTIKA_GROUPS, HORIZONT, Opt, RULES, WORK_AREAS } from "./content";

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

  const resetAll = () => {
    if (window.confirm("Opravdu vymazat všechny odpovědi? Vynuluje se uložení profilu v tomto prohlížeči a nedá se to vrátit.")) setP(DEFAULT_PROFILE);
  };

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
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-[2px]" style={{ background: GRAD }} />
              <span className="font-mono text-[11px] font-semibold tracking-label text-[#7A8794]">{g.heading.toUpperCase()}</span>
            </div>
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
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#E4EAF2] pt-5">
        <p className="font-mono text-[10.5px] tracking-label text-[#9AA7B4]">ZMĚNY SE UKLÁDAJÍ AUTOMATICKY DO TOHOTO PROHLÍŽEČE</p>
        <button
          type="button"
          onClick={resetAll}
          className="flex-shrink-0 rounded-lg border border-[#F1C7CE] bg-white px-4 py-2 text-[13px] font-semibold text-[#D1495B] transition-all hover:bg-[#FCEBEE] hover:shadow-sm active:scale-[0.98]"
        >
          Vymazat všechny odpovědi
        </button>
      </div>
    </div>
  );
}

export function FiremniCile() {
  const [p, setP] = useProfile();
  const setStr = (k: keyof Profile) => (v: string) => setP((prev) => ({ ...prev, [k]: v } as Profile));
  const toggleArr = (key: keyof Profile) => (v: string) =>
    setP((prev) => {
      const cur = (prev[key] as string[]) || [];
      return { ...prev, [key]: cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v] } as Profile;
    });
  const clearKeys = (key: keyof Profile, vals: string[]) =>
    setP((prev) => ({ ...prev, [key]: ((prev[key] as string[]) || []).filter((x) => !vals.includes(x)) } as Profile));
  const clearAll = (key: keyof Profile) => setP((prev) => ({ ...prev, [key]: [] } as Profile));

  const noClue = p.cileZna === "ne";
  const showGoals = p.cileZna !== "ne";
  const showConsultant = p.cileZna === "ne" || p.cileZna === "castecne";
  const wantsLLM = p.zpusob === "llm" || p.zpusob === "oboji";

  const UROVNE = [
    { v: "u1", t: "Základní povědomí", d: "Ví, co LLM umí a kde má limity, zná rizika a co do něj nepatří." },
    { v: "u2", t: "Bezpečné používání", d: "Umí zadat prompt, ověřit výstup a dodržet pravidla o firemních datech." },
    { v: "u3", t: "Efektivní práce", d: "Staví si vlastní postupy a šablony, kombinuje AI s daty a nástroji firmy." },
    { v: "u4", t: "Multiplikátor", d: "Učí ostatní, navrhuje nové use-case a hlídá kvalitu i soulad s pravidly." },
  ];

  const COMPETENCY_GROUPS: { heading: string; items: Opt[] }[] = [
    {
      heading: "Porozumění LLM",
      items: [
        { v: "por_funguje", t: "Jak LLM funguje (hádá slova, není databáze faktů)" },
        { v: "por_halucinace", t: "Proč vznikají halucinace" },
        { v: "por_limity", t: "Limity: zastaralá data, nespolehlivé počítání" },
        { v: "por_kontext", t: "Kontextové okno a proč model „zapomíná“" },
        { v: "por_modely", t: "Rozdíly mezi modely a kdy který použít" },
      ],
    },
    {
      heading: "Psaní promptů",
      items: [
        { v: "pro_jasne", t: "Jasné zadání: role, cíl, formát výstupu" },
        { v: "pro_kontext", t: "Dodat kontext a podklady" },
        { v: "pro_priklad", t: "Ukázat příklad (vzor výstupu)" },
        { v: "pro_iterace", t: "Iterovat a doptávat se místo jednoho dotazu" },
        { v: "pro_kroky", t: "Rozdělit složitý úkol na kroky" },
        { v: "pro_sablony", t: "Stavět šablony pro opakované úlohy" },
      ],
    },
    {
      heading: "Ověřování výstupů",
      items: [
        { v: "ov_fakta", t: "Ověřit fakta, čísla a citace" },
        { v: "ov_nesmysl", t: "Poznat sebejistě podaný nesmysl" },
        { v: "ov_kontrola", t: "Nepřebírat výstup bez kontroly" },
        { v: "ov_zdroje", t: "Vyžádat a prověřit zdroje" },
        { v: "ov_bias", t: "Rozpoznat zaujatost výstupu" },
      ],
    },
    {
      heading: "Data a bezpečnost",
      items: [
        { v: "bz_citlive", t: "Co nesmí do veřejných nástrojů" },
        { v: "bz_verze", t: "Rozdíl veřejné vs. firemní verze" },
        { v: "bz_anon", t: "Anonymizovat citlivé údaje před vložením" },
        { v: "bz_trenink", t: "Vstupy můžou sloužit k tréninku modelu" },
        { v: "bz_injection", t: "Prompt injection a podezřelé odkazy" },
        { v: "bz_pravidla", t: "Firemní pravidla a kam se obrátit" },
      ],
    },
    {
      heading: "Úsudek a vhodné použití",
      items: [
        { v: "us_vhodne", t: "Na co se AI hodí a na co ne" },
        { v: "us_clovek", t: "Kdy musí finálně rozhodnout člověk" },
        { v: "us_riziko", t: "Odhad rizika podle dopadu úlohy" },
        { v: "us_nezavislost", t: "Udržet si vlastní úsudek, neslepě spoléhat" },
      ],
    },
    {
      heading: "Etika a právo",
      items: [
        { v: "et_transp", t: "Transparentnost vůči zákazníkům a kolegům" },
        { v: "et_odpovednost", t: "Odpovědnost za výstup nese vždy člověk" },
        { v: "et_autorstvi", t: "Autorská práva a původ obsahu" },
        { v: "et_pravo", t: "GDPR a AI Act v běžné práci" },
        { v: "et_ferovost", t: "Férovost a předsudky (bias)" },
      ],
    },
    {
      heading: "Nasazení v práci",
      items: [
        { v: "np_usecase", t: "Konkrétní use-case pro vlastní roli" },
        { v: "np_nastroje", t: "Práce s firemními AI nástroji a asistenty" },
        { v: "np_data", t: "Kombinace AI s firemními daty a dokumenty" },
        { v: "np_sdileni", t: "Sdílet dobré prompty a postupy v týmu" },
        { v: "np_mereni", t: "Ověřit, že to reálně šetří čas" },
      ],
    },
  ];

  return (
    <div>
      <SectionHeader
        eyebrow="STANOVENÍ FIREMNÍCH CÍLŮ"
        title="Ujasněte si, kam se chcete dostat"
        intro="Ujasněný cíl je základ celé implementace — bez něj se nedá vybrat, kde začít. Pokud jasno nemáte, nevadí, počítá se s tím."
      />

      <Card>
        <ChoiceField
          label="Máte jasno v tom, čeho chcete s AI dosáhnout?"
          hint="Buďte upřímní — od téhle odpovědi se odvíjí i doporučený tým."
          options={[
            { v: "ano", t: "Ano, mám jasno" },
            { v: "castecne", t: "Mám rámcovou představu" },
            { v: "ne", t: "Zatím vůbec ne" },
          ]}
          value={p.cileZna || ""}
          onChange={setStr("cileZna")}
        />
      </Card>

      {showConsultant && (
        <div
          className="mt-5 overflow-hidden rounded-2xl border border-[#CBE0F7] p-6"
          style={{ background: "linear-gradient(135deg, #F4FAFF 0%, #EAF3FD 100%)" }}
        >
          <div className="flex items-start gap-4">
            <span
              className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl text-white shadow-[0_8px_18px_-8px_rgba(31,122,212,0.7)]"
              style={{ background: GRAD }}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="8.5" />
                <circle cx="12" cy="12" r="4" />
              </svg>
            </span>
            <div className="min-w-0">
              <div className="font-mono text-[10.5px] font-semibold tracking-label text-[#1668B8]">PODLE VAŠEHO PROFILU</div>
              <h3 className="mt-1.5 text-[16px] font-semibold text-[#0E1726]">
                {noClue ? "Do týmu doporučujeme AI konzultanta" : "Zvažte AI konzultanta na ujasnění cílů"}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[#46586D]">
                {noClue
                  ? "To je úplně běžné — většina firem neumí cíle pojmenovat měřitelně. Ujasnění cílů je první práce konzultanta: projde s vámi procesy, najde, kde má AI nejlepší návratnost, a převede to na konkrétní zadání. Přidali jsme ho do doporučeného týmu."
                  : "Rámcovou představu máte. Konzultant pomůže převést ji na měřitelné cíle a seřadit je podle návratnosti. Přidali jsme ho do doporučeného týmu."}
              </p>
              <Link
                to="/app/ai-tym"
                className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#1F7AD4] transition-colors hover:text-[#1A6BBC]"
              >
                Zobrazit doporučený tým →
              </Link>
            </div>
          </div>
        </div>
      )}

      {showGoals && (
        <Card className="mt-5 space-y-7">
          <MultiField
            label="Jaké cíle má AI naplnit?"
            hint="Vyberte vše, co se vás týká. Pomůže to ujasnit, kde má AI u vás největší smysl."
            options={[
              { v: "naklady", t: "Snížit náklady" },
              { v: "kapacita", t: "Zvládnout víc práce bez náboru" },
              { v: "cas", t: "Ušetřit čas na rutině a administrativě" },
              { v: "kvalita", t: "Snížit chybovost a zmetky" },
              { v: "rychlost", t: "Zrychlit reakce a dodání" },
              { v: "servis", t: "Zlepšit zákaznický servis" },
              { v: "data", t: "Líp využít data, co máme" },
              { v: "rozhodovani", t: "Lepší podklady pro rozhodování" },
              { v: "obchod", t: "Posílit obchod a marketing" },
              { v: "lide", t: "Ulevit lidem od nudné práce" },
              { v: "konkurence", t: "Nezůstat pozadu za konkurencí" },
            ]}
            values={p.vize || []}
            onToggle={toggleArr("vize")}
          />
          <ChoiceField
            label="Jak velkou ambici máte?"
            hint="Pilot je test, který za pár týdnů prokáže přínos na jednom procesu. Plošné nasazení bez ověřeného pilotu je nejdražší způsob, jak zjistit, že to nefunguje."
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
      )}

      {showGoals && wantsLLM && (
        <Card className="mt-5 space-y-7">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-[2px]" style={{ background: GRAD }} />
              <span className="font-mono text-[11px] font-semibold tracking-label text-[#1668B8]">AI GRAMOTNOST TÝMU</span>
            </div>
            <h3 className="mt-2 text-[16px] font-semibold text-[#0E1726]">Co chcete lidi naučit</h3>
            <p className="mt-1.5 text-[14px] leading-relaxed text-[#52606D]">
              V profilu jste zvolili, že lidé budou pracovat s LLM (ChatGPT, Claude). Tím vzniká samostatný cíl — dostat je na potřebnou úroveň. Není to jen dobrá praxe: AI Act (článek 4, platný od února 2025) přímo ukládá zajistit u lidí pracujících s AI dostatečnou úroveň AI gramotnosti.
            </p>
          </div>

          <MultiField
            label="Koho chcete vyškolit?"
            hint="Různé skupiny potřebují různou úroveň — vedení jiný rozsah než provoz."
            options={[
              { v: "vedeni", t: "Vedení a manažeři" },
              { v: "kancelar", t: "Kancelář a administrativa" },
              { v: "obchod", t: "Obchod a marketing" },
              { v: "podpora", t: "Zákaznická podpora" },
              { v: "provoz", t: "Výroba a provoz" },
              { v: "it", t: "IT a správci" },
            ]}
            values={p.ucitKoho || []}
            onToggle={toggleArr("ucitKoho")}
          />

          <div>
            <div className="text-[13.5px] font-semibold text-[#0E1726]">Na jakou úroveň je chcete dostat?</div>
            <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-[#7A8794]">Vyberte cílovou úroveň. Stavte ji odspodu — skok na multiplikátora bez základů nedrží.</p>
            <div className="mt-3 space-y-2">
              {UROVNE.map((u, i) => {
                const active = p.ucitUroven === u.v;
                return (
                  <button
                    key={u.v}
                    type="button"
                    onClick={() => setStr("ucitUroven")(active ? "" : u.v)}
                    className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-150 active:scale-[0.99] ${
                      active
                        ? "border-[#1F7AD4] bg-[#EFF6FD] shadow-[0_10px_24px_-14px_rgba(31,122,212,0.45)]"
                        : "border-[#E6ECF3] bg-white hover:border-[#C7D8EA] hover:shadow-[0_4px_14px_-8px_rgba(15,23,42,0.18)]"
                    }`}
                  >
                    <span
                      className={`mt-0.5 grid h-6 w-6 flex-shrink-0 place-items-center rounded-full font-mono text-[12px] font-semibold ${
                        active ? "text-white" : "bg-[#F1F5F9] text-[#7A8794]"
                      }`}
                      style={active ? { background: GRAD } : undefined}
                    >
                      {i + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[14px] font-semibold text-[#0E1726]">{u.t}</span>
                      <span className="mt-0.5 block text-[13px] leading-relaxed text-[#52606D]">{u.d}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-3">
              <div className="text-[13.5px] font-semibold text-[#0E1726]">Co se mají naučit?</div>
              <button
                type="button"
                onClick={() => clearAll("ucitCo")}
                className="flex-shrink-0 text-[12px] font-medium text-[#96A3B3] transition-colors hover:text-[#D1495B]"
              >
                Vymazat vše
              </button>
            </div>
            <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-[#7A8794]">Osnova AI gramotnosti rozdělená do okruhů. Zaškrtněte dovednosti, které vaši lidé potřebují — rozsah roste se zvolenou úrovní. Není nutné všechno.</p>
            <div className="mt-4 space-y-6">
              {COMPETENCY_GROUPS.map((g) => (
                <div key={g.heading}>
                  <div className="font-mono text-[11px] font-semibold tracking-label text-[#7A8794]">{g.heading.toUpperCase()}</div>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {g.items.map((o) => {
                      const active = (p.ucitCo || []).includes(o.v);
                      return (
                        <button
                          key={o.v}
                          type="button"
                          aria-pressed={active}
                          onClick={() => toggleArr("ucitCo")(o.v)}
                          className={`${chipBase} ${active ? chipOn : chipOff}`}
                        >
                          {active ? "\u2713 " : ""}
                          {o.t}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={() => clearKeys("ucitCo", g.items.map((it) => it.v))}
                    className="mt-3 text-[12px] font-medium text-[#96A3B3] transition-colors hover:text-[#D1495B]"
                  >
                    Vymazat kategorii
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

type TeamNode = { name: string; sub: string; tier: string; temp?: boolean };

export function AITym() {
  const [p] = useProfile();

  const charComplete = Boolean(p.size && p.focus && p.it && p.systemy);
  const cileComplete = Boolean(p.cileZna);
  const ready = charComplete && cileComplete;

  const prereqs = [
    { to: "/app/charakteristika-podniku", label: "Charakteristika podniku", done: charComplete, hint: "Velikost, zaměření, vlastní IT, systémy a data." },
    { to: "/app/firemni-cile", label: "Stanovení firemních cílů", done: cileComplete, hint: "Aspoň jestli máte jasno v cílech." },
  ];

  if (!ready) {
    return (
      <div>
        <SectionHeader
          eyebrow="SESTAVENÍ AI TÝMU"
          title="Jak má vypadat váš tým"
          intro="Tým se skládá na míru podle toho, co vyplníte o firmě a cílech. Model se objeví, jakmile budou podklady hotové."
        />
        <Card>
          <div className="font-mono text-[10.5px] font-semibold tracking-label text-[#B7791F]">NEJDŘÍV VYPLŇTE PODKLADY</div>
          <h3 className="mt-1.5 text-[16px] font-semibold text-[#0E1726]">Tým poskládáme podle vaší firmy</h3>
          <p className="mt-2 text-[14px] leading-relaxed text-[#52606D]">
            Hierarchie týmu vzniká z toho, co vyplníte v Charakteristice podniku a ve Stanovení cílů — kdo má být v týmu a jestli je potřeba konzultant, IT partner nebo pověřenec, se odvíjí právě od těchto odpovědí. Než jsou hotové, nemáme z čeho tým sestavit, takže se model zatím nezobrazuje.
          </p>
          <div className="mt-5 space-y-2.5">
            {prereqs.map((pq) => (
              <Link
                key={pq.to}
                to={pq.to}
                className={`group flex items-center justify-between gap-3 rounded-xl border px-4 py-3.5 transition-all ${
                  pq.done
                    ? "border-[#CBE9DA] bg-[#F1FBF6]"
                    : "border-[#E6ECF3] bg-white hover:border-[#C7D8EA] hover:shadow-[0_4px_14px_-8px_rgba(15,23,42,0.15)]"
                }`}
              >
                <div className="flex items-center gap-3">
                  {pq.done ? (
                    <span className="grid h-6 w-6 flex-shrink-0 place-items-center rounded-full bg-[#12A065] text-white">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  ) : (
                    <span className="h-6 w-6 flex-shrink-0 rounded-full border-2 border-[#CFE0F0]" />
                  )}
                  <div>
                    <div className="text-[14px] font-semibold text-[#0E1726]">{pq.label}</div>
                    <div className="text-[13px] leading-relaxed text-[#7A8794]">{pq.done ? "Vyplněno" : pq.hint}</div>
                  </div>
                </div>
                <span
                  className={`flex-shrink-0 text-[13px] font-semibold transition-transform group-hover:translate-x-0.5 ${
                    pq.done ? "text-[#12A065]" : "text-[#1F7AD4]"
                  }`}
                >
                  {pq.done ? "Upravit" : "Vyplnit →"}
                </span>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  const wantsLLM = p.zpusob === "llm" || p.zpusob === "oboji";
  const regs = p.regs || [];
  const dataMessy =
    p.systemy === "excel" || p.systemy === "papir" || p.systemy === "nevim" ||
    p.strojeData === "ne" || p.strojeData === "castecne" || p.erpUsage === "formalne" || p.kdeData === "nevim";
  const sensitive = ["aiakt", "finance", "zdravotnictvi", "verejny", "knowhow", "koncern", "automotive"].some((r) => regs.includes(r));

  const roles: TeamNode[] = [];
  roles.push({ name: "Sponzor z vedení", sub: "Drží prioritu, rozpočet a odblokovává překážky mezi odděleními.", tier: "zadani" });
  if (p.cileZna === "ne" || p.cileZna === "castecne")
    roles.push({ name: "AI konzultant", sub: "Pomůže ujasnit cíle a směr. Časově ohraničená spolupráce, ne stálé místo.", tier: "zadani", temp: true });
  roles.push({ name: "Koordinátor implementace", sub: "Vede mapování, výběr nástrojů, regulace a měření. U menší firmy klidně částečný úvazek.", tier: "rizeni" });
  if (p.it === "ne" && (p.vyvoj === "dodavatel" || p.vyvoj === "kombinace"))
    roles.push({ name: "Partner na řízení dodavatele", sub: "Hlídá dodavatele technicky za vás — zadání, kvalitu i ceny.", tier: "rizeni" });
  roles.push({ name: "Vlastníci procesů", sub: "Lidé, kteří dotčené procesy denně dělají. Bez nich proces nezměníte.", tier: "realizace" });
  if (dataMessy)
    roles.push({ name: "Garant dat", sub: "Dá data do použitelné podoby a hlídá jejich kvalitu.", tier: "realizace" });
  roles.push(
    p.it === "ano"
      ? { name: "IT podpora", sub: "Přístupy, integrace na stávající systémy, bezpečnost.", tier: "realizace" }
      : { name: "Externí IT partner", sub: "Zajistí přístupy, integrace a bezpečnost zvenku.", tier: "realizace" }
  );
  if (sensitive)
    roles.push({ name: "Pověřenec / právní podpora", sub: "Osobní údaje, smlouvy s dodavateli AI, dopady AI Actu.", tier: "realizace" });
  if (p.focus === "vyroba" || p.focus === "kombinace")
    roles.push({ name: "Garant výroby", sub: "Propojí AI s výrobou a daty ze strojů.", tier: "realizace" });
  if (wantsLLM || p.dovednosti === "nizka" || (p.ucitUroven && p.ucitUroven !== ""))
    roles.push({ name: "Garant AI gramotnosti", sub: "Vyškolí lidi a drží zvolenou cílovou úroveň.", tier: "adopce" });
  roles.push({ name: "Ambasadoři z provozu", sub: "Vyzkouší nástroj první a získají kolegy. Adopce se šíří od kolegů, ne shora.", tier: "adopce" });

  const TIERS: { id: string; label: string; color: string; soft: string }[] = [
    { id: "zadani", label: "Zadání a podpora", color: "#C2410C", soft: "#FBEDE4" },
    { id: "rizeni", label: "Řízení", color: "#1F7AD4", soft: "#EAF2FB" },
    { id: "realizace", label: "Realizace", color: "#12A065", soft: "#E9F8F1" },
    { id: "adopce", label: "Adopce", color: "#5B4FC7", soft: "#EEEBFB" },
  ];

  return (
    <div>
      <SectionHeader
        eyebrow="SESTAVENÍ AI TÝMU"
        title="Jak má vypadat váš tým"
        intro="Tým namodelovaný podle vašeho profilu — kdo zadává, kdo řídí, kdo realizuje a kdo se stará o adopci. U menší firmy klidně nosí jeden člověk víc rolí; jde o to, aby každou roli někdo držel."
      />

      <div className="relative overflow-hidden rounded-2xl border border-[#E0E9F3] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_28px_-18px_rgba(15,23,42,0.12)] sm:p-8">
        <div className="vln-grid-bg pointer-events-none absolute inset-0 opacity-50" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28" style={{ background: "linear-gradient(180deg, rgba(31,122,212,0.06), transparent)" }} />
        <div className="relative">
          {TIERS.map((tier, ti) => {
            const group = roles.filter((r) => r.tier === tier.id);
            if (group.length === 0) return null;
            return (
              <div key={tier.id}>
                {ti > 0 && <div className="mx-auto h-7 w-px bg-gradient-to-b from-[#CFE0F0] to-[#AFC8E2]" />}
                <div className="mb-3.5 flex justify-center">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[10.5px] font-semibold tracking-label"
                    style={{ color: tier.color, backgroundColor: tier.soft }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: tier.color }} />
                    {tier.label.toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-wrap justify-center gap-3 pb-1">
                  {group.map((r) => (
                    <div
                      key={r.name}
                      className="flex w-full items-start gap-3 rounded-xl border border-[#E3EAF3] border-l-2 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-16px_rgba(15,23,42,0.28)] sm:w-72"
                      style={{ borderLeftColor: tier.color }}
                    >
                      <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full" style={{ backgroundColor: tier.soft, color: tier.color }}>
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="8" r="3.2" />
                          <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
                        </svg>
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[14px] font-semibold text-[#0E1726]">{r.name}</span>
                          {r.temp && (
                            <span className="rounded-full border border-dashed border-[#B9C9D9] bg-white px-2 py-0.5 text-[10px] font-medium text-[#7A8794]">
                              dočasně
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-[13px] leading-relaxed text-[#52606D]">{r.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="mt-4 text-[13px] leading-relaxed text-[#7A8794]">
        Není to organigram na nábor osmi lidí. U menší firmy běžně drží víc rolí jeden člověk a část (IT, pověřenec, konzultant) bývá externí. Důležité je, aby na každou roli byl někdo konkrétní — ne aby „to nějak dělali všichni“.
      </p>

      <h2 className="mb-1 mt-10 text-xl font-semibold tracking-tight text-[#0E1726]">Osm oblastí práce</h2>
      <p className="mb-5 text-[14px] leading-relaxed text-[#52606D]">
        Ať tým tvoří jeden člověk nebo skupina, těchto osm oblastí musí mít někoho, kdo je drží. U každé je vidět, co se stane, když vlastníka nemá.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {WORK_AREAS.map((w) => (
          <Card key={w.t} className="transition-colors hover:border-[#CBD9E8]">
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
        <span className="mb-3 inline-flex rounded-md border border-[#F2E2C4] bg-[#FFF6E3] px-2 py-1 font-mono text-[10px] font-semibold tracking-label text-[#B7791F]">
          PŘIPRAVUJE SE
        </span>
        <p className="text-[14px] leading-relaxed text-[#52606D]">
          Interaktivní stavěč popisu se sem přesouvá do nového vzhledu. Než to dokončím, najdete ho v původní podobě tady:
        </p>
        <a
          href="/hr"
          className="mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-semibold text-white shadow-[0_10px_22px_-10px_rgba(31,122,212,0.65)] transition-all hover:brightness-110 active:scale-[0.98]"
          style={{ background: GRAD }}
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
        <span className="mb-3 inline-flex rounded-md border border-[#F2E2C4] bg-[#FFF6E3] px-2 py-1 font-mono text-[10px] font-semibold tracking-label text-[#B7791F]">
          PŘIPRAVUJE SE
        </span>
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
          <Card key={t} className="flex gap-4 transition-colors hover:border-[#CBD9E8]">
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

      <h2 className="mb-4 mt-10 text-xl font-semibold tracking-tight text-[#0E1726]">Pár čísel z praxe</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {RULES.map((r) => (
          <Card key={r.label} className="transition-colors hover:border-[#CBD9E8]">
            <div className="bg-clip-text font-mono text-[20px] font-bold text-transparent" style={{ backgroundImage: GRAD }}>
              {r.big}
            </div>
            <div className="mt-1 text-[13px] font-semibold text-[#0E1726]">{r.label}</div>
            <p className="mt-1.5 text-[13px] leading-relaxed text-[#52606D]">{r.d}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
