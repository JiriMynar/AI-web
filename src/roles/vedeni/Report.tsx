import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eyebrow, GhostButton, Lamp, Panel, Reveal } from "../../design/primitives";
import { useSeo } from "../../lib/seo";
import { decodeAnswers, encodeAnswers } from "../../lib/share";
import { LEVELS } from "./data";
import {
  Answers, buildCtx, buildDuties, buildRules, buildScenarios, buildTeam,
  allSelectedSubs, evalSub, levelIndex, score,
} from "./logic";

const TONE = {
  ok: { lamp: "bg-ok", text: "text-ok", label: "PROVEDITELNÉ HNED" },
  warn: { lamp: "bg-warn", text: "text-warn", label: "PO PŘÍPRAVĚ" },
  stop: { lamp: "bg-stop", text: "text-stop", label: "ZATÍM NE" },
} as const;

const VERDICT_TONE = { hned: "ok", priprava: "warn", ne: "stop" } as const;

function SectionHead({ no, title, sub }: { no: string; title: string; sub?: string }) {
  return (
    <div className="mb-5 mt-14 flex items-baseline gap-3 first:mt-0">
      <span className="font-mono text-sm font-semibold text-vedeni">{no}</span>
      <div className="min-w-0">
        <h2 className="text-xl font-semibold sm:text-2xl">{title}</h2>
        {sub && <p className="mt-1 text-sm leading-relaxed text-dim">{sub}</p>}
      </div>
    </div>
  );
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
  useSeo("Report pro vedení — Velín", "Vyhodnocení implementace AI z pohledu vedení: náročnost, verdikty záměrů, tým a rizikové scénáře.");
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
  const lvl = LEVELS[levelIndex(score(a, ctx))];
  const lvlTone = TONE[lvl.tone];
  const subs = allSelectedSubs(a).map((s) => ({ ...s, ev: evalSub(s.sub, ctx) }));
  const { duties, verdict: dutyVerdict } = buildDuties(a, ctx);
  const team = buildTeam(a, ctx);
  const scenarios = buildScenarios(a, ctx);
  const rules = buildRules(a);

  return (
    <div className="mx-auto max-w-shell px-5 py-10 sm:py-14">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <Eyebrow tone="text-vedeni">/// REPORT PRO VEDENÍ</Eyebrow>
        <Link to="/vedeni/pruvodce" className="font-mono text-xs tracking-wide2 text-dim underline decoration-line underline-offset-4 hover:text-ink">
          UPRAVIT ODPOVĚDI
        </Link>
      </div>

      {/* 01 — Náročnost */}
      <Reveal>
        <Panel className="px-6 py-7 sm:px-8">
          <div className="flex items-center gap-3">
            <Lamp tone={lvlTone.lamp} pulse />
            <span className={`font-mono text-xs font-semibold tracking-label ${lvlTone.text}`}>CELKOVÁ NÁROČNOST</span>
          </div>
          <div className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{lvl.name}</div>
          <p className="mt-3 max-w-3xl leading-relaxed text-dim">{lvl.desc}</p>
        </Panel>
      </Reveal>

      {/* 02 — Verdikty záměrů */}
      <SectionHead no="01" title="Realističnost vašich záměrů" sub="Každý zvolený záměr má vlastní verdikt podle stavu vašich dat, procesů, IT a regulací." />
      <div className="grid gap-3 md:grid-cols-2">
        {subs.map(({ def, ev }, i) => {
          const t = TONE[VERDICT_TONE[ev.verdict]];
          return (
            <Reveal key={def.v} delay={i * 0.04}>
              <Panel className="h-full px-5 py-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold">{def.t}</div>
                    <div className="mt-0.5 font-mono text-[11px] text-faint">orientační pilot: {def.weeks}</div>
                  </div>
                  <span className={`flex items-center gap-2 font-mono text-[10px] font-semibold tracking-label ${t.text}`}>
                    <Lamp tone={t.lamp} /> {t.label}
                  </span>
                </div>
                {ev.gaps.length > 0 && (
                  <ul className="mt-3 flex flex-col gap-1.5">
                    {ev.gaps.map((g, j) => (
                      <li key={j} className="flex gap-2 text-[13px] leading-relaxed text-ink">
                        <span className={`font-mono ${t.text}`}>→</span>
                        {g}
                      </li>
                    ))}
                  </ul>
                )}
                {ev.note && <p className="mt-2.5 text-[13px] italic leading-relaxed text-dim">{ev.note}</p>}
              </Panel>
            </Reveal>
          );
        })}
      </div>

      {/* 03 — Tým */}
      <SectionHead no="02" title="Tým, který implementaci ponese" sub="Role odvozené z vašich odpovědí — a co se stane, když některá chybí." />
      <div className="grid gap-3 md:grid-cols-2">
        {team.map((r, i) => (
          <Reveal key={r.role} delay={i * 0.04}>
            <Panel className={`h-full px-5 py-4 ${r.missing ? "border-stop/50" : ""}`}>
              <div className="flex items-center gap-2.5">
                <Lamp tone={r.missing ? "bg-stop" : "bg-vedeni"} />
                <span className="font-semibold">{r.role}</span>
                {r.missing && <span className="font-mono text-[10px] font-semibold tracking-label text-stop">CHYBÍ</span>}
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-dim">{r.why}</p>
              <p className="mt-2 border-t border-dashed border-line pt-2 text-[13px] leading-relaxed text-ink">{r.risk}</p>
            </Panel>
          </Reveal>
        ))}
      </div>

      {/* 04 — Povinnosti */}
      <SectionHead no="03" title="8 oblastí práce a jejich vlastníci" sub="Rozdělení podle kapacity, kterou jste uvedli." />
      <Reveal>
        <Panel className="px-5 py-4">
          <p className={`text-sm leading-relaxed ${TONE[dutyVerdict.tone].text}`}>
            <Lamp tone={TONE[dutyVerdict.tone].lamp} /> <span className="ml-1">{dutyVerdict.text}</span>
          </p>
        </Panel>
      </Reveal>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {duties.map((d, i) => (
          <Reveal key={d.k} delay={i * 0.03}>
            <Panel className="h-full px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold">{d.t}</span>
                <span className={`rounded border px-2 py-0.5 font-mono text-[10px] tracking-wide2 ${d.owner.danger ? "border-stop/50 text-stop" : "border-line text-dim"}`}>
                  {d.owner.who.toUpperCase()}
                </span>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-dim">{d.d}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-faint">{d.risk}</p>
            </Panel>
          </Reveal>
        ))}
      </div>

      {/* 05 — Scénáře */}
      <SectionHead no="04" title="Rizikové scénáře" sub="Pojmenované kombinace, na kterých implementace umírají — a cesty ven." />
      <div className="grid gap-3 md:grid-cols-2">
        {scenarios.map((s, i) => (
          <Reveal key={s.t} delay={i * 0.04}>
            <Panel className="h-full overflow-hidden">
              <div className="h-1.5 w-full bg-gradient-to-r from-warn via-stop to-warn opacity-70" aria-hidden />
              <div className="px-5 py-4">
                <div className="font-mono text-xs font-semibold tracking-label text-warn">{s.t}</div>
                <p className="mt-2 text-[13px] leading-relaxed text-dim">{s.d}</p>
                <p className="mt-2.5 border-t border-dashed border-line pt-2.5 text-[13px] leading-relaxed text-ink">{s.out}</p>
              </div>
            </Panel>
          </Reveal>
        ))}
      </div>

      {/* 06 — Pravidla */}
      <SectionHead no="05" title="Pravidla z praxe" sub="Čísla a limity, které platí bez ohledu na dodavatele." />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {rules.map((r, i) => (
          <Reveal key={r.label} delay={i * 0.03}>
            <Panel className="h-full px-4 py-4">
              <div className="font-mono text-xl font-semibold tracking-tight text-vedeni">{r.big}</div>
              <div className="mt-1.5 text-[13px] font-semibold leading-snug">{r.label}</div>
              <p className="mt-1.5 text-xs leading-relaxed text-dim">{r.d}</p>
            </Panel>
          </Reveal>
        ))}
      </div>

      <div className="mt-14">
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
