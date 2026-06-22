import { ReactNode, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eyebrow, GhostButton, Lamp, Panel, Reveal } from "../../design/primitives";
import { useSeo } from "../../lib/seo";
import { decodeAnswers, encodeAnswers } from "../../lib/share";
import { LEVELS } from "./data";
import {
  Answers, Ctx, buildCtx, buildDuties, buildRules, buildScenarios, buildTeam,
  allSelectedSubs, evalSub, levelIndex, score,
} from "./logic";

const TONE = {
  ok: { lamp: "bg-ok", text: "text-ok", border: "border-ok", label: "PROVEDITELNÉ HNED" },
  warn: { lamp: "bg-warn", text: "text-warn", border: "border-warn", label: "PO PŘÍPRAVĚ" },
  stop: { lamp: "bg-stop", text: "text-stop", border: "border-stop", label: "ZATÍM NE" },
} as const;

const VERDICT_TONE = { hned: "ok", priprava: "warn", ne: "stop" } as const;
const VERDICT_ORDER = { hned: 0, priprava: 1, ne: 2 } as const;

/** Doporučený postup — edukativní jádro reportu (jak na to a proč). */
const HOW: { title: string; body: string }[] = [
  {
    title: "Vyberte jeden proces — a změřte, co vás dnes stojí",
    body: "Nezačínejte nástrojem, začněte číslem. Vyberte jednu konkrétní činnost, která lidi nejvíc zdržuje, a změřte, kolik hodin nebo korun spolkne za měsíc. Bez tohoto výchozího čísla po nasazení nikdy neobhájíte, že se něco zlepšilo — a přesně na tom padá většina pilotů.",
  },
  {
    title: "Zmapujte ten proces dřív, než sáhnete po nástroji",
    body: "Popište kroky, určete vlastníka a sepište výjimky. AI postavená nad nezmapovaným procesem jen zrychlí chaos. Výběr nástroje před zmapováním procesu je nejčastější příčina draze pořízených licencí, které nikdo nepoužívá.",
  },
  {
    title: "Postavte malý pilot — 6 až 12 týdnů, jedno kritérium úspěchu",
    body: "Pilot není zmenšené plošné nasazení, je to test. Dohodněte předem jediné měřitelné kritérium (třeba „o 30 % kratší doba vyřízení“), vyhraďte vlastníkovi procesu aspoň pětinu úvazku a držte rozsah malý. Souběžně neveďte víc pilotů, než reálně unesete.",
  },
  {
    title: "Vyhodnoťte čísly, ne dojmem",
    body: "Po pilotu porovnejte výchozí číslo s novým. Když se kritérium splnilo, máte obhajobu pro vedení i podklad pro rozpočet na rozšíření. Když ne, víte to levně a včas — a hlavně víte proč, takže další pokus bude lepší.",
  },
  {
    title: "Teprve s ověřeným postupem rozšiřujte",
    body: "Plošné nasazení stavte až na pilotu, který prokázal přínos. Další procesy přidávejte po jednom, stejnou metodou. Tak se z jednoho úspěchu stane opakovatelný postup, ne náhoda — a tempo si určujete vy, ne dodavatel.",
  },
];

/** Tři otázky na první schůzku — manažerská prověrka, ne náborový proces. */
const VENDOR_QUESTIONS: { q: string; why: string }[] = [
  { q: "Jak změříte přínos a co se stane, když se cíl nesplní?", why: "Dobrý odborník přijde s výchozím číslem a metrikou sám. Mlžení tady znamená, že přínos nakonec nikdo neobhájí." },
  { q: "Co budete potřebovat od nás?", why: "Správná odpověď: přístup k datům, čas vlastníků procesů, zapojení lidí. Kdo řekne „skoro nic“, podceňuje 80 % práce." },
  { q: "Jak se vyhneme závislosti jen na vás?", why: "Ptejte se na dokumentaci, export dat a možnost řešení převzít. Kdo vás zamkne k sobě, bude pak diktovat cenu." },
];

/** Varovné signály při výběru. */
const RED_FLAGS: string[] = [
  "Nabízí konkrétní nástroj dřív, než pochopil váš proces a co chcete měřit.",
  "Slibuje pevné procento úspory, aniž viděl vaše data.",
  "V nabídce není žádný výchozí stav ani kritérium úspěchu.",
  "„AI vyřeší všechno“ — bez zmínky o práci na datech, procesech a školení lidí.",
  "Odmítá ukázat reference nebo vás nepustí k dřívějším klientům.",
  "Řešení je uzavřené: bez exportu dat, bez dokumentace, bez možnosti odejít.",
];

/** Převod zvolené vize na příklad „mlha → měřitelné číslo“. */
function goalGuidance(a: Answers, procLabel: string | null): { unclear: boolean; pairs: { metric: string; bad: string; good: string }[] } {
  const p = procLabel ? `u „${procLabel}“` : "u vybraného procesu";
  const MAP: Record<string, { metric: string; bad: string; good: string }> = {
    naklady: { metric: "Čas nebo náklady na agendu", bad: "„Snížit náklady na administrativu.“", good: `„Zkrátit čas na zpracování ${p} o 40 % — tj. ušetřit ~120 hodin měsíčně — do konce Q3.“` },
    kapacita: { metric: "Objem zvládnutý stejným týmem", bad: "„Zvládnout víc práce.“", good: `„Zpracovat o 30 % vyšší objem ${p} beze změny počtu lidí, do konce roku.“` },
    kvalita: { metric: "Chybovost, reklamace, zmetky", bad: "„Zlepšit kvalitu.“", good: `„Snížit podíl chyb ${p} z 5 % na 2 % do konce Q3.“` },
    rychlost: { metric: "Doba vyřízení", bad: "„Být rychlejší.“", good: `„Zkrátit dobu vyřízení ${p} z 2 dnů na 4 hodiny do konce Q2.“` },
    lide: { metric: "Hodiny rutiny ubrané lidem", bad: "„Ulevit lidem od rutiny.“", good: `„Ubrat týmu 6 hodin rutinní práce týdně ${p}, měřeno do tří měsíců.“` },
  };
  const sel = (a.vize || []).filter((v) => v !== "nevime");
  const pairs = sel.map((v) => MAP[v]).filter(Boolean).slice(0, 2);
  return { unclear: pairs.length === 0, pairs };
}

function plural(n: number, one: string, few: string, many: string) {
  if (n === 1) return one;
  if (n >= 2 && n <= 4) return few;
  return many;
}

/** Ukazatel náročnosti na škále čtyř úrovní. */
function Gauge({ idx }: { idx: number }) {
  return (
    <div className="flex gap-2">
      {LEVELS.map((l, i) => {
        const active = i === idx;
        const t = TONE[l.tone];
        return (
          <div key={l.name} className="flex-1">
            <div
              className={`h-1.5 rounded-full transition-colors ${active ? `${t.lamp} ${t.text}` : "bg-line"}`}
              style={active ? { boxShadow: "0 0 12px currentColor" } : undefined}
            />
            <div className={`mt-2 font-mono text-[10px] tracking-label ${active ? t.text : "text-faint"}`}>
              {l.name.toUpperCase()}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function HowStep({ n, title, body, last }: { n: number; title: string; body: string; last?: boolean }) {
  return (
    <div className="relative pl-14">
      {!last && <span aria-hidden className="absolute left-[19px] top-10 -bottom-8 w-px bg-line" />}
      <span className="absolute left-0 top-0 grid h-10 w-10 place-items-center rounded-full border border-vedeni/40 bg-raised font-mono text-base font-semibold text-vedeni">
        {n}
      </span>
      <h3 className="text-lg font-semibold leading-snug text-ink">{title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-dim">{body}</p>
    </div>
  );
}

function VerdictItem({ title, weeks, tone, gaps, note }: {
  title: string; weeks: string; tone: "ok" | "warn" | "stop"; gaps: string[]; note: string | null;
}) {
  const t = TONE[tone];
  return (
    <div className={`border-l-2 ${t.border} pl-4`}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
        <span className={`flex items-center gap-1.5 font-mono text-[10px] font-semibold tracking-label ${t.text}`}>
          <Lamp tone={t.lamp} /> {t.label}
        </span>
      </div>
      <div className="mt-1 font-mono text-[11px] text-faint">orientační pilot: {weeks}</div>
      {gaps.length > 0 && (
        <div className="mt-3">
          <div className="font-mono text-[10px] tracking-label text-faint">
            {tone === "stop" ? "CO CHYBÍ K ZÁKLADU" : "CO DOTÁHNOUT PŘED STARTEM"}
          </div>
          <ul className="mt-1.5 space-y-1.5">
            {gaps.map((g, j) => (
              <li key={j} className="flex gap-2.5 text-[14px] leading-relaxed text-dim">
                <span className={`mt-[7px] h-1 w-1 flex-shrink-0 rounded-full ${t.lamp}`} aria-hidden />
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {note && <p className="mt-2.5 text-[14px] italic leading-relaxed text-dim">{note}</p>}
    </div>
  );
}

function ScenarioBlock({ name, problem, out }: { name: string; problem: string; out: string }) {
  const sol = out.replace(/^Cesta ven:\s*/, "");
  return (
    <div className="border-l-2 border-warn/60 pl-5">
      <div className="font-mono text-xs font-semibold tracking-label text-warn">{name}</div>
      <p className="mt-2.5 text-[15px] leading-relaxed text-dim">{problem}</p>
      <p className="mt-3 text-[15px] leading-relaxed text-ink">
        <span className="font-semibold text-ok">Cesta ven — </span>{sol}
      </p>
    </div>
  );
}

function DutyRow({ title, what, risk, owner, danger }: {
  title: string; what: string; risk: string; owner: string; danger?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-2 py-5 sm:grid-cols-[11rem_1fr]">
      <div>
        <div className="text-[14px] font-semibold text-ink">{title}</div>
        <div className={`mt-1.5 inline-block rounded border px-2 py-0.5 font-mono text-[10px] tracking-wide2 ${danger ? "border-stop/50 text-stop" : "border-line text-faint"}`}>
          {owner.toUpperCase()}
        </div>
      </div>
      <div>
        <p className="text-[14px] leading-relaxed text-dim">{what}</p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-faint">{risk}</p>
      </div>
    </div>
  );
}

function RuleRow({ big, label, body }: { big: string; label: string; body: string }) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-1 py-5 sm:grid-cols-[8.5rem_1fr]">
      <div className="font-mono text-2xl font-semibold leading-none tracking-tight text-vedeni">{big}</div>
      <div>
        <div className="text-[14px] font-semibold leading-snug text-ink">{label}</div>
        <p className="mt-1.5 text-[13px] leading-relaxed text-dim">{body}</p>
      </div>
    </div>
  );
}

function Section({ kicker, title, intro, children }: {
  kicker: string; title: string; intro?: string; children: ReactNode;
}) {
  return (
    <section className="mt-16 border-t border-line pt-10">
      <Eyebrow tone="text-vedeni">{kicker}</Eyebrow>
      <h2 className="mt-2.5 text-2xl font-semibold tracking-tight sm:text-[28px]">{title}</h2>
      {intro && <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-dim">{intro}</p>}
      <div className="mt-8">{children}</div>
    </section>
  );
}

/** Mono podnadpis uvnitř sekce. */
function SubHead({ children, tone = "text-faint" }: { children: ReactNode; tone?: string }) {
  return <h3 className={`mt-12 font-mono text-[11px] font-semibold tracking-label ${tone}`}>{children}</h3>;
}

function ShareBar({ answers }: { answers: Answers }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    const url = `${window.location.origin}/vedeni/report#r=${encodeAnswers(answers)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt("Zkopírujte odkaz ručně:", url);
    }
  };
  return (
    <Panel className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="text-sm font-semibold">Sdílejte report s kolegy z vedení</div>
        <p className="mt-0.5 text-xs leading-relaxed text-dim">
          Odkaz nese jen vaše odpovědi zakódované v adrese — žádná data neopouštějí prohlížeč a nikam se neukládají.
        </p>
      </div>
      <button
        type="button"
        onClick={copy}
        className="flex-shrink-0 rounded-md border border-vedeni/50 px-4 py-2.5 font-mono text-xs font-semibold tracking-wide2 text-vedeni transition-colors hover:bg-vedeni/10"
      >
        {copied ? "✓ ZKOPÍROVÁNO" : "ZKOPÍROVAT ODKAZ NA REPORT"}
      </button>
    </Panel>
  );
}

export default function Report() {
  useSeo("Report pro vedení — Velín", "Vyhodnocení implementace AI z pohledu vedení: ujasnění cíle, postup, realističnost záměrů, jak vybrat odborníka, rizika, tým a pravidla z praxe.");
  const { hash } = useLocation();
  const navigate = useNavigate();
  const decoded = useMemo(() => decodeAnswers<Answers>(hash), [hash]);

  if (!decoded.ok) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20">
        <Eyebrow tone="text-warn">REPORT NENÍ K DISPOZICI</Eyebrow>
        <h1 className="mt-3 text-3xl font-semibold">
          {decoded.reason === "version"
            ? "Odkaz pochází ze starší verze průvodce."
            : "Odkaz je neúplný nebo poškozený."}
        </h1>
        <p className="mt-3 max-w-xl leading-relaxed text-dim">
          {decoded.reason === "version"
            ? "Otázky se mezitím změnily, takže starý report nejde spolehlivě sestavit. Projděte průvodce znovu — zabere to asi 5 minut."
            : "Report se sestavuje z odpovědí zakódovaných přímo v odkazu. Projděte průvodce a vygenerujte si nový."}
        </p>
        <div className="mt-8">
          <GhostButton onClick={() => navigate("/vedeni/pruvodce")}>Spustit průvodce →</GhostButton>
        </div>
      </div>
    );
  }

  const a = decoded.answers;
  const ctx = buildCtx(a);
  const idx = levelIndex(score(a, ctx));
  const lvl = LEVELS[idx];
  const lvlTone = TONE[lvl.tone];
  const subs = allSelectedSubs(a).map((s) => ({ ...s, ev: evalSub(s.sub, ctx) }));
  const subKeys = subs.map((s) => s.sub);
  const sortedSubs = [...subs].sort((x, y) => VERDICT_ORDER[x.ev.verdict] - VERDICT_ORDER[y.ev.verdict]);
  const hned = subs.filter((s) => s.ev.verdict === "hned").length;
  const prip = subs.filter((s) => s.ev.verdict === "priprava").length;
  const neC = subs.filter((s) => s.ev.verdict === "ne").length;
  const { duties, verdict: dutyVerdict } = buildDuties(a, ctx);
  const team = buildTeam(a, ctx);
  const scenarios = buildScenarios(a, ctx);
  const rules = buildRules(a);
  const profile = vendorProfile(a, ctx, subKeys);
  const goal = goalGuidance(a, subs[0]?.def.t ?? null);

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
      {/* Hlavička — kde stojíte */}
      <header>
        <div className="mb-12 flex flex-wrap items-center justify-between gap-3">
          <Eyebrow tone="text-vedeni">/// REPORT PRO VEDENÍ</Eyebrow>
          <Link to="/vedeni/pruvodce" className="font-mono text-xs tracking-wide2 text-dim underline decoration-line underline-offset-4 hover:text-ink">
            UPRAVIT ODPOVĚDI
          </Link>
        </div>

        <Reveal>
          <div className="flex items-center gap-2.5">
            <Lamp tone={lvlTone.lamp} pulse />
            <span className={`font-mono text-xs font-semibold tracking-label ${lvlTone.text}`}>CELKOVÁ NÁROČNOST IMPLEMENTACE</span>
          </div>
          <h1 className="mt-3 text-[40px] font-semibold leading-none tracking-tight sm:text-6xl">{lvl.name}</h1>
          <div className="mt-7 max-w-xl">
            <Gauge idx={idx} />
          </div>
          <p className="mt-7 max-w-2xl text-[16px] leading-relaxed text-dim">{lvl.desc}</p>
          {subs.length > 0 && (
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink">
              Upřesnili jste {subs.length} {plural(subs.length, "záměr", "záměry", "záměrů")} —{" "}
              <span className="font-semibold text-ok">{hned} {plural(hned, "proveditelný", "proveditelné", "proveditelných")} hned</span>,{" "}
              <span className="font-semibold text-warn">{prip} po přípravě</span>
              {neC > 0 && <> a <span className="font-semibold text-stop">{neC} zatím ne</span></>}.
              Níže najdete, jak si ujasnit cíl, doporučený postup, vyhodnocení každého záměru, jak vybrat správnou pomoc, na co si dát pozor a kdo to musí ponést.
            </p>
          )}
        </Reveal>
      </header>

      {/* Ujasněte si cíl — kořen rozhodnutí */}
      <Section
        kicker="ZAČNĚTE TÍM NEJTĚŽŠÍM"
        title="Ujasněte si, kam se chcete dostat"
        intro="Nejdražší chyba není špatný nástroj — je to neujasněný cíl. „Chceme AI“ ani „chceme šetřit“ se nedá změřit, a co se nedá změřit, to vedení po půl roce zruší. Dobrý cíl pojmenuje číslo, směr a termín."
      >
        <div className="border-l-2 border-vedeni pl-4">
          <div className="font-mono text-[11px] tracking-label text-faint">DOBRÝ CÍL =</div>
          <p className="mt-1.5 text-[17px] font-semibold leading-snug text-ink">
            co měříte <span className="text-faint">+</span> z čeho kam <span className="text-faint">+</span> do kdy
          </p>
        </div>

        {goal.unclear ? (
          <Reveal>
            <Panel className="mt-8 border-l-4 border-warn px-5 py-4">
              <p className="text-[15px] leading-relaxed text-ink">
                Zatím jste neuvedli, jaké číslo chcete pohnout — a to je úkol číslo jedna. Než cokoliv dalšího,
                svolejte vedení nad jedinou otázkou: <strong>co nás nejvíc bolí?</strong> Náklady, kapacita,
                chybovost, nebo rychlost. Teprve z odpovědi vznikne cíl, podle kterého poznáte úspěch — i správného odborníka.
              </p>
            </Panel>
          </Reveal>
        ) : (
          <div className="mt-9 space-y-8">
            {goal.pairs.map((pair, i) => (
              <Reveal key={i} delay={i * 0.03}>
                <div>
                  <div className="font-mono text-[10px] tracking-label text-faint">{pair.metric.toUpperCase()}</div>
                  <div className="mt-2.5 flex gap-3">
                    <span className="mt-px font-mono text-sm font-semibold text-stop" aria-hidden>✕</span>
                    <p className="text-[15px] leading-relaxed text-dim">{pair.bad}</p>
                  </div>
                  <div className="mt-2 flex gap-3">
                    <span className="mt-px font-mono text-sm font-semibold text-ok" aria-hidden>✓</span>
                    <p className="text-[15px] leading-relaxed text-ink">{pair.good}</p>
                  </div>
                </div>
              </Reveal>
            ))}
            <p className="text-[13px] italic text-faint">Čísla jsou ilustrativní — doplňte svoje skutečná.</p>
          </div>
        )}

        <p className="mt-9 max-w-2xl text-[15px] leading-relaxed text-ink">
          Tohle číslo je zároveň vaše pojistka při výběru odborníka — s ním poznáte, kdo vás k cíli dovede a kdo
          jen prodává nástroj. <strong>Dokud cíl neumíte říct jednou větou, nekupujte nástroj ani nenajímejte.</strong>{" "}
          Je to rozhodnutí vedení; nikdo ho za vás neudělá.
        </p>
      </Section>

      {/* Jak na to — postup */}
      <Section
        kicker="JAK NA TO"
        title="Postup, který funguje"
        intro="Pořadí kroků rozhoduje víc než výběr nástroje. Z praxe padne 60–80 % práce na úspěšném projektu na procesy a data — samotná AI je menšina. Tahle posloupnost je nejlevnější cesta od cíle k výsledku, který obhájíte čísly."
      >
        <div className="space-y-8">
          {HOW.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.03}>
              <HowStep n={i + 1} title={s.title} body={s.body} last={i === HOW.length - 1} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Vaše záměry — verdikty */}
      <Section
        kicker="VAŠE ZÁMĚRY"
        title="Co je reálné a co potřebuje přípravu"
        intro="Začněte tím, co je proveditelné hned — rychlý viditelný výsledek získá důvěru lidí i vedení. Záměry „po přípravě“ nejsou zamítnuté; mají jen domácí úkol, který musí předcházet startu. „Zatím ne“ znamená, že chybí základ, bez kterého by projekt skončil zklamáním."
      >
        <div className="mb-7 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] tracking-label">
          <span className="flex items-center gap-1.5 text-ok"><Lamp tone="bg-ok" /> {hned} HNED</span>
          <span className="flex items-center gap-1.5 text-warn"><Lamp tone="bg-warn" /> {prip} PO PŘÍPRAVĚ</span>
          <span className="flex items-center gap-1.5 text-stop"><Lamp tone="bg-stop" /> {neC} ZATÍM NE</span>
        </div>
        <div className="space-y-6">
          {sortedSubs.map(({ def, ev }, i) => (
            <Reveal key={def.v} delay={i * 0.02}>
              <VerdictItem title={def.t} weeks={def.weeks} tone={VERDICT_TONE[ev.verdict]} gaps={ev.gaps} note={ev.note} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Jak vybrat pomoc — odborník / dodavatel */}
      <Section
        kicker="JAK VYBRAT POMOC"
        title="Jak poznat dobrého odborníka nebo dodavatele"
        intro="Tady firmy nejčastěji chybují: bez ujasněného cíle najmou špatně. Dobrý odborník nezačne nástrojem — začne otázkou, jaké číslo chcete pohnout. Kdo nabízí řešení dřív, než pochopil váš proces a jak změříte přínos, je první varovný signál."
      >
        <SubHead>JAKÁ POMOC SE K VÁM HODÍ</SubHead>
        <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-dim">
          Odvozeno z vašich odpovědí — tyhle schopnosti u odborníka nebo dodavatele vyžadujte.
        </p>
        <div className="mt-5 space-y-6">
          {profile.map((p, i) => (
            <Reveal key={i} delay={i * 0.02}>
              <div className="border-l-2 border-vedeni pl-4">
                <h4 className="text-[15px] font-semibold text-ink">{p.need}</h4>
                <p className="mt-1.5 text-[14px] leading-relaxed text-dim">{p.why}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <SubHead>TŘI OTÁZKY NA PRVNÍ SCHŮZKU</SubHead>
        <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-dim">
          Rychlá prověrka pro vedení, ne náborový proces — ten je samostatná disciplína. Tyhle tři odpovědi prozradí na první schůzce víc než celé portfolio.
        </p>
        <div className="mt-5 space-y-5">
          {VENDOR_QUESTIONS.map((item, i) => (
            <div key={i} className="flex gap-3 border-l-2 border-line pl-4">
              <span className="font-mono text-sm font-semibold text-vedeni">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="text-[15px] font-semibold leading-snug text-ink">„{item.q}“</p>
                <p className="mt-1 text-[14px] leading-relaxed text-dim">{item.why}</p>
              </div>
            </div>
          ))}
        </div>

        <SubHead tone="text-stop">ČERVENÉ VLAJKY</SubHead>
        <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-dim">
          Když uvidíte tohle, zpozorněte — ať jde o externího dodavatele, nebo o interního kandidáta.
        </p>
        <ul className="mt-5 space-y-3">
          {RED_FLAGS.map((f, i) => (
            <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-ink">
              <span className="mt-0.5 font-mono font-semibold text-stop" aria-hidden>✕</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Na co si dát pozor — scénáře */}
      <Section
        kicker="NA CO SI DÁT POZOR"
        title="Rizikové scénáře — a cesty ven"
        intro="Tohle nejsou teoretická rizika. Jsou to nejčastější způsoby, jak nasazení AI v praxi umírá — pojmenované tak, abyste je poznali u sebe včas. U každého je i konkrétní cesta ven."
      >
        <div className="space-y-9">
          {scenarios.map((s, i) => (
            <Reveal key={s.t} delay={i * 0.03}>
              <ScenarioBlock name={s.t} problem={s.d} out={s.out} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Kdo to ponese — tým a oblasti */}
      <Section
        kicker="KDO TO PONESE"
        title="Tým a osm oblastí práce"
        intro="Implementace se neutáhne sama. Tyto role vyplývají z vašich odpovědí — u každé je i to, co se stane, když chybí."
      >
        <Reveal>
          <Panel className={`border-l-4 ${TONE[dutyVerdict.tone].border} px-5 py-4`}>
            <div className="flex items-start gap-3">
              <span className="mt-1.5"><Lamp tone={TONE[dutyVerdict.tone].lamp} pulse /></span>
              <p className="text-[15px] leading-relaxed text-ink">{dutyVerdict.text}</p>
            </div>
          </Panel>
        </Reveal>

        <div className="mt-9 space-y-7">
          {team.map((r, i) => (
            <Reveal key={r.role} delay={i * 0.02}>
              <div className={`border-l-2 ${r.missing ? "border-stop" : "border-vedeni"} pl-4`}>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="text-[15px] font-semibold text-ink">{r.role}</h3>
                  {r.missing && <span className="rounded border border-stop/50 px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-label text-stop">CHYBÍ</span>}
                </div>
                <p className="mt-1.5 text-[14px] leading-relaxed text-dim">{r.why}</p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-faint">{r.risk}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <SubHead>OSM OBLASTÍ A JEJICH VLASTNÍCI</SubHead>
        <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-dim">
          Práce se dělí do osmi oblastí podle kapacity, kterou jste uvedli. Žádná z nich nesmí zůstat bez vlastníka — sloupec vpravo říká, co se stane, když zůstane.
        </p>
        <div className="mt-4 divide-y divide-line border-y border-line">
          {duties.map((d) => (
            <DutyRow key={d.k} title={d.t} what={d.d} risk={d.risk} owner={d.owner.who} danger={d.owner.danger} />
          ))}
        </div>
      </Section>

      {/* Pravidla z praxe */}
      <Section
        kicker="PROČ PRÁVĚ TAKHLE"
        title="Pravidla z praxe"
        intro="Čísla a limity z výzkumu i praxe, které platí bez ohledu na dodavatele — a vysvětlují, proč doporučený postup vypadá tak, jak vypadá."
      >
        <div className="divide-y divide-line border-y border-line">
          {rules.map((r) => (
            <RuleRow key={r.label} big={r.big} label={r.label} body={r.d} />
          ))}
        </div>
      </Section>

      <div className="mt-16">
        <ShareBar answers={a} />
      </div>
      <p className="mt-6 font-mono text-[10px] tracking-label text-faint">
        ORIENTAČNÍ VÝSTUP · NENAHRAZUJE ODBORNÉ POSOUZENÍ · SESTAVIL{" "}
        <a href="https://www.linkedin.com/in/jirimynar/" target="_blank" rel="noopener noreferrer" className="underline decoration-line underline-offset-4 hover:text-ink">
          JIŘÍ MYNÁŘ — LINKEDIN
        </a>
      </p>
    </div>
  );
}

/** Z odpovědí odvozený profil pomoci, kterou firma potřebuje — co u dodavatele vyžadovat. */
function vendorProfile(a: Answers, ctx: Ctx, subList: string[]): { need: string; why: string }[] {
  const out: { need: string; why: string }[] = [];
  if (subList.some((s) => ["vyrReporting", "kvalita", "udrzba", "planovani"].includes(s)))
    out.push({ need: "Zkušenost přímo z výroby (technolog / OT), ne generického „AI konzultanta“", why: "Výrobní AI se potkává se stroji, senzory a bezpečností provozu. Kancelářský dodavatel tohle prostředí nezná a navrhne řešení, které údržba po prvním incidentu vypne." });
  if (!ctx.hasIT)
    out.push({ need: "Partner, který pokryje integraci a IT — přístupy, napojení, bezpečnost", why: "Vlastní IT nemáte, takže tohle musí dodat někdo zvenčí. Vybírejte podle referencí z podobných firem, ne podle nejnižší ceny — levná integrace bývá nakonec nejdražší." });
  if (ctx.regs.has("aiakt"))
    out.push({ need: "Doložené zkušenosti s vysoce rizikovým AI podle AI Actu", why: "Vaše použití (AI rozhoduje o lidech) spadá do nejpřísnější kategorie — povinný lidský dohled, dokumentace, transparentnost. Vyžadujte konkrétní příklady, ne ujištění." });
  else if (["gdpr", "zdravotnictvi", "finance", "verejny"].some((r) => ctx.regs.has(r)))
    out.push({ need: "Schopnost posoudit GDPR a AI Act a ošetřit smlouvy s poskytovateli", why: "Pracujete s regulovanými daty. Dodavatel, který tohle přejde mlčením, vás vystaví pokutě nebo zákazu zpracování — ideálně ať má vlastní právní podporu." });
  if (ctx.regs.has("koncern"))
    out.push({ need: "Zkušenost se schvalováním v nadnárodní struktuře", why: "Nástroje schvaluje vaše centrála a tahle smyčka bývá nejdelší položkou harmonogramu. Zeptejte se, jak dodavatel s koncernovými pravidly pracoval jinde." });
  if (ctx.dataQ < 2)
    out.push({ need: "Nejdřív někoho na data a digitalizaci, teprve pak dodavatele modelu", why: "Vaše data zatím nejsou ve stavu, ze kterého může AI těžit. Nákup nástroje je předčasný — 60–80 % práce je stejně na datech a procesech, tady začněte." });
  if ((a.jazyky?.length ?? 0) > 1 || (a.jazyky ?? []).includes("jine"))
    out.push({ need: "Ověřená kvalita ve vašich jazycích, ne jen v angličtině", why: "Komunikujete ve více jazycích. Nástroj, který září v anglickém demu, může na češtině nebo němčině výrazně ztrácet — vyžádejte si test na vašich reálných datech." });
  if (a.kapacita === "nikdo" || a.kapacita === "jeden")
    out.push({ need: "Důraz na předání know-how a možnost odejít — budete se o pomoc hodně opírat", why: "Interně máte málo rukou, takže externí partner ponese hodně. O to pečlivěji ověřte, že vás nezamkne k sobě — vyžadujte dokumentaci a jasný plán předání." });
  if (out.length === 0)
    out.push({ need: "Partner, který začíná vaším procesem a metrikou, ne svým produktem", why: "Vaše odpovědi nevyžadují žádnou specializaci navíc — o to víc rozhoduje přístup. Správná pomoc nejdřív pochopí, co měříte, a teprve pak navrhne nástroj." });
  return out;
}
