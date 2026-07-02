import { useState } from "react";
import { useLocalStorage } from "../lib/useLocalStorage";
import { Card, GRAD, SectionHeader } from "./ui";

type Status = "todo" | "doing" | "done";
type Step = { id: string; title: string; note: string; status: Status };

const DEFAULT_ROADMAP: Step[] = [
  { id: "s1", title: "Ujasnit cíle a vybrat první proces", note: "Jeden konkrétní proces s nejlepší návratností.", status: "todo" },
  { id: "s2", title: "Zmapovat proces a připravit data", note: "Popsané kroky, vlastník, výjimky; data do použitelné podoby.", status: "todo" },
  { id: "s3", title: "Ošetřit regulace a souhlasy", note: "AI Act, GDPR, interní směrnice, smlouva s dodavatelem.", status: "todo" },
  { id: "s4", title: "Vybrat nástroj nebo dodavatele", note: "Podle dat, regulací a rozpočtu — ne podle hype.", status: "todo" },
  { id: "s5", title: "Postavit pilot na jednom procesu", note: "Malý rozsah, jasné kritérium úspěchu, měření před a po.", status: "todo" },
  { id: "s6", title: "Změřit přínos a vyhodnotit", note: "Srovnat s výchozím číslem, rozhodnout jít/nejít dál.", status: "todo" },
  { id: "s7", title: "Zaškolit lidi a nasadit do provozu", note: "Adopce, úprava postupů, ambasadoři, zpětná vazba.", status: "todo" },
  { id: "s8", title: "Rozšířit na další procesy", note: "Co fungovalo, zopakovat jinde; držet provoz a správu.", status: "todo" },
];

const STATUS_META: Record<Status, { t: string; cls: string; dot: string }> = {
  todo: { t: "K udělání", cls: "border-[#D6DFEA] bg-white text-[#66788C]", dot: "#9AA7B4" },
  doing: { t: "Probíhá", cls: "border-[#1F7AD4] bg-[#EAF3FD] text-[#155FA8]", dot: "#1F7AD4" },
  done: { t: "Hotovo", cls: "border-[#12A065] bg-[#F1FBF6] text-[#0E8A57]", dot: "#12A065" },
};

const NEXT: Record<Status, Status> = { todo: "doing", doing: "done", done: "todo" };

const newId = () => Math.random().toString(36).slice(2, 10);

export function Roadmap() {
  const [steps, setSteps] = useLocalStorage<Step[]>("velin.roadmap.v1", DEFAULT_ROADMAP);
  const [draft, setDraft] = useState("");

  const update = (id: string, patch: Partial<Step>) =>
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  const remove = (id: string) => setSteps((prev) => prev.filter((s) => s.id !== id));
  const move = (id: string, dir: "up" | "down") =>
    setSteps((prev) => {
      const i = prev.findIndex((s) => s.id === id);
      if (i < 0) return prev;
      const j = dir === "up" ? i - 1 : i + 1;
      if (j < 0 || j >= prev.length) return prev;
      const copy = [...prev];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
  const add = () => {
    const t = draft.trim();
    if (!t) return;
    setSteps((prev) => [...prev, { id: newId(), title: t, note: "", status: "todo" }]);
    setDraft("");
  };
  const reset = () => {
    if (window.confirm("Obnovit doporučenou šablonu? Vaše úpravy se ztratí.")) setSteps(DEFAULT_ROADMAP);
  };

  const list = steps || [];
  const done = list.filter((s) => s.status === "done").length;
  const pct = list.length > 0 ? Math.round((done / list.length) * 100) : 0;

  return (
    <div>
      <SectionHeader
        eyebrow="ROADMAPA"
        title="Sestavte si plán zavedení AI"
        intro="Doporučená cesta od cíle k provozu. Upravte si ji podle sebe — přidávejte a mažte kroky, řaďte je a označujte stav. Ukládá se do tohoto prohlížeče."
      />

      <div className="mb-5 rounded-2xl border border-[#E3EAF3] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_28px_-18px_rgba(15,23,42,0.12)]">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[10.5px] font-semibold tracking-label text-[#7A8794]">POSTUP PLÁNU</span>
          <span className="font-mono text-[11px] font-semibold text-[#155FA8]">
            {done} / {list.length} HOTOVO
          </span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#E7EEF6]">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: GRAD }} />
        </div>
      </div>

      <div className="space-y-3">
        {list.map((s, i) => {
          const meta = STATUS_META[s.status];
          return (
            <Card key={s.id} className="flex gap-4 transition-all duration-200 hover:shadow-[0_14px_30px_-18px_rgba(15,23,42,0.25)]">
              <div className="flex flex-shrink-0 flex-col items-center gap-2">
                {s.status === "done" ? (
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-[#12A065] text-white shadow-[0_6px_14px_-7px_rgba(18,160,101,0.8)]">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                ) : (
                  <span
                    className={`grid h-7 w-7 place-items-center rounded-full border font-mono text-[12px] font-semibold ${
                      s.status === "doing" ? "border-[#BBDCF8] bg-[#EAF3FD] text-[#155FA8]" : "border-[#E6ECF3] bg-[#F6F9FC] text-[#7A8794]"
                    }`}
                  >
                    {i + 1}
                  </span>
                )}
                <div className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => move(s.id, "up")}
                    disabled={i === 0}
                    aria-label="Posunout nahoru"
                    className="rounded p-1 text-[#9AA7B4] transition-colors enabled:hover:bg-[#F1F5F9] enabled:hover:text-[#1F7AD4] disabled:opacity-25"
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 14l6-6 6 6" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => move(s.id, "down")}
                    disabled={i === list.length - 1}
                    aria-label="Posunout dolů"
                    className="rounded p-1 text-[#9AA7B4] transition-colors enabled:hover:bg-[#F1F5F9] enabled:hover:text-[#1F7AD4] disabled:opacity-25"
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 10l6 6 6-6" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <input
                  value={s.title}
                  onChange={(e) => update(s.id, { title: e.target.value })}
                  placeholder="Název kroku"
                  className="-mx-1 w-full rounded bg-transparent px-1 py-0.5 text-[15px] font-semibold text-[#0E1726] placeholder:text-[#9AA7B4] transition-colors hover:bg-[#F6F9FC] focus:bg-[#F6F9FC] focus:outline-none"
                />
                <input
                  value={s.note}
                  onChange={(e) => update(s.id, { note: e.target.value })}
                  placeholder="poznámka…"
                  className="-mx-1 mt-0.5 w-full rounded bg-transparent px-1 py-0.5 text-[13px] leading-relaxed text-[#52606D] placeholder:text-[#9AA7B4] transition-colors hover:bg-[#F6F9FC] focus:bg-[#F6F9FC] focus:outline-none"
                />
                <div className="mt-2.5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => update(s.id, { status: NEXT[s.status] })}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-medium transition-all active:scale-[0.97] ${meta.cls}`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: meta.dot }} />
                    {meta.t}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(s.id)}
                    aria-label="Smazat krok"
                    className="ml-auto rounded-md p-1.5 text-[#9AA7B4] transition-colors hover:bg-[#FCEBEE] hover:text-[#D1495B]"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") add();
          }}
          placeholder="Nový krok…"
          className="flex-1 rounded-xl border border-[#D6DFEA] bg-white px-3.5 py-2.5 text-[14px] text-[#0E1726] placeholder:text-[#9AA7B4] transition-colors focus:border-[#1F7AD4] focus:outline-none"
        />
        <button
          type="button"
          onClick={add}
          className="flex-shrink-0 rounded-full px-5 py-2.5 text-[14px] font-semibold text-white shadow-[0_10px_22px_-10px_rgba(31,122,212,0.65)] transition-all hover:brightness-110 active:scale-[0.98]"
          style={{ background: GRAD }}
        >
          Přidat
        </button>
      </div>

      <button
        type="button"
        onClick={reset}
        className="mt-6 text-[12px] font-medium text-[#96A3B3] underline-offset-4 transition-colors hover:text-[#52606D] hover:underline"
      >
        Obnovit doporučenou šablonu
      </button>
    </div>
  );
}
