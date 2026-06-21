import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Eyebrow, GhostButton, Panel, PrimaryButton } from "../../design/primitives";
import { useSeo } from "../../lib/seo";
import { encodeAnswers } from "../../lib/share";
import { Q, STEPS, SUBQ, Option } from "./data";
import { Answers } from "./logic";

function OptionCard({
  opt, selected, multi, compact, onClick,
}: { opt: Option; selected: boolean; multi?: boolean; compact?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group w-full rounded-md border text-left transition-colors duration-150 ${compact ? "px-3.5 py-2.5" : "px-4 py-3.5"} ${
        selected ? "border-vedeni bg-raised" : "border-line bg-panel hover:border-faint"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className={`mt-1 grid h-4 w-4 flex-shrink-0 place-items-center border transition-colors ${multi ? "rounded" : "rounded-full"} ${
            selected ? "border-vedeni bg-vedeni" : "border-faint"
          }`}
        >
          {selected && (
            <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5.2 4.2 7.4 8 3" stroke="#0A1017" strokeWidth="2" fill="none" strokeLinecap="round" /></svg>
          )}
        </span>
        <span>
          <span className={`block font-semibold ${compact ? "text-sm" : "text-[15px]"} text-ink`}>{opt.t}</span>
          <span className="mt-0.5 block text-[13px] leading-relaxed text-dim">{opt.d}</span>
        </span>
      </div>
    </button>
  );
}

function ProgressRail({ step }: { step: number }) {
  return (
    <div className="mb-8 flex items-center gap-1.5" aria-label="Postup průvodcem">
      {STEPS.map((s, i) => {
        const state = i < step ? "done" : i === step ? "active" : "todo";
        return (
          <div key={s.id} className="flex min-w-0 flex-1 flex-col gap-1.5">
            <div
              className={`h-1 rounded-full transition-colors duration-300 ${
                state === "active" ? "bg-vedeni" : state === "done" ? "bg-vedeni/40" : "bg-line"
              }`}
            />
            <span className={`hidden truncate font-mono text-[9px] tracking-label sm:block ${state === "active" ? "text-vedeni" : "text-faint"}`}>
              {String(i + 1).padStart(2, "0")} {s.label.toUpperCase()}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function Pruvodce() {
  useSeo("Průvodce pro vedení — Velín", "Interaktivní průvodce implementací AI z pohledu vedení firmy: náročnost, tým, rizika.");
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Answers>({});

  const set = (k: keyof Answers, v: unknown) => setA((p) => ({ ...p, [k]: v as never }));
  const setSub = (goal: string, vals: string[]) => setA((p) => ({ ...p, subs: { ...(p.subs || {}), [goal]: vals } }));

  const toggleMulti = (k: "regs" | "vize" | "goals" | "jazyky", opt: Option, opts: Option[]) => {
    const sel = (a[k] as string[] | undefined) || [];
    let next: string[];
    if (opt.exclusive) next = sel.includes(opt.v) ? [] : [opt.v];
    else {
      const excl = new Set(opts.filter((o) => o.exclusive).map((o) => o.v));
      next = sel.includes(opt.v) ? sel.filter((x) => x !== opt.v) : [...sel.filter((x) => !excl.has(x)), opt.v];
    }
    set(k, next);
  };

  const visible = useMemo(() => {
    const ids = STEPS[step].questions;
    return ids.filter((id) =>
      id === "erpUsage"
        ? a.data === "erp"
        : id === "strojeData"
        ? (a.goals || []).includes("vyrobaAI")
        : true
    );
  }, [step, a.data, a.goals]);

  const stepDone = useMemo(() => {
    return visible.every((id) => {
      const v = a[id as keyof Answers];
      if (Q[id]?.multi) {
        if (!Array.isArray(v) || v.length === 0) return false;
        if (id === "goals") return (v as string[]).every((g) => ((a.subs || {})[g] || []).length > 0);
        return true;
      }
      return typeof v === "string" && v.length > 0;
    });
  }, [visible, a]);

  const finish = () => navigate(`/vedeni/report#r=${encodeAnswers(a)}`);

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
      <ProgressRail step={step} />
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={reduce ? false : { opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduce ? undefined : { opacity: 0, x: -24 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          <Panel className="px-5 py-6 sm:px-8 sm:py-8">
            <div className="mb-7 border-b border-dashed border-line pb-5">
              <Eyebrow tone="text-vedeni">KROK {String(step + 1).padStart(2, "0")} / 05</Eyebrow>
              <h1 className="mt-1.5 text-2xl font-semibold">{STEPS[step].full}</h1>
              <p className="mt-1.5 text-sm leading-relaxed text-dim">{STEPS[step].desc}</p>
            </div>

            {visible.map((id) => {
              const q = Q[id];
              const val = a[id as keyof Answers];
              return (
                <div key={id} className="mb-8 last:mb-2">
                  <h2 className="text-lg font-semibold">{q.title}</h2>
                  <p className="mt-1 text-[13px] leading-relaxed text-dim">{q.subtitle}</p>
                  <div className="mt-3.5 flex flex-col gap-2">
                    {q.options.map((opt) =>
                      q.multi ? (
                        <OptionCard
                          key={opt.v}
                          opt={opt}
                          multi
                          selected={((val as string[]) || []).includes(opt.v)}
                          onClick={() => toggleMulti(id as "regs" | "vize" | "goals" | "jazyky", opt, q.options)}
                        />
                      ) : (
                        <OptionCard key={opt.v} opt={opt} selected={val === opt.v} onClick={() => set(id as keyof Answers, opt.v)} />
                      )
                    )}
                  </div>

                  {id === "goals" &&
                    ((a.goals as string[]) || []).map((g) => (
                      <div key={g} className="ml-2 mt-4 border-l-2 border-vedeni pl-4 sm:ml-5">
                        <Eyebrow tone="text-vedeni">Upřesněte — {SUBQ[g].label} · aspoň jedno</Eyebrow>
                        <div className="mt-2 flex flex-col gap-2">
                          {SUBQ[g].subs.map((s) => {
                            const sel = (a.subs && a.subs[g]) || [];
                            const isSel = sel.includes(s.v);
                            return (
                              <OptionCard
                                key={s.v}
                                compact
                                multi
                                opt={{ v: s.v, t: s.t, d: s.d }}
                                selected={isSel}
                                onClick={() => setSub(g, isSel ? sel.filter((x) => x !== s.v) : [...sel, s.v])}
                              />
                            );
                          })}
                        </div>
                      </div>
                    ))}
                </div>
              );
            })}

            <div className="mt-4 flex items-center justify-between gap-3">
              <GhostButton onClick={() => (step === 0 ? navigate("/vedeni") : setStep(step - 1))}>← Zpět</GhostButton>
              <PrimaryButton disabled={!stepDone} onClick={() => (step === STEPS.length - 1 ? finish() : setStep(step + 1))}>
                {step === STEPS.length - 1 ? "Vyhodnotit →" : "Pokračovat →"}
              </PrimaryButton>
            </div>
            {!stepDone && (
              <p className="mt-3 text-right text-xs italic text-faint">
                {STEPS[step].id === "vize"
                  ? "Pro pokračování odpovězte na vše — a u každého cíle vyberte aspoň jedno upřesnění."
                  : "Pro pokračování odpovězte na všechny otázky."}
              </p>
            )}
          </Panel>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
