import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

const LINKEDIN = "https://www.linkedin.com/in/jirimynar/";

const ROLE_LABEL: Record<string, { name: string; dot: string }> = {
  vedeni: { name: "MODUL · VEDENÍ", dot: "bg-vedeni" },
  hr: { name: "MODUL · HR", dot: "bg-hr" },
  specialista: { name: "MODUL · SPECIALISTA", dot: "bg-spec" },
};

/** Telemetrická hlavička — podpisový prvek velínu. */
function Telemetry() {
  const { pathname } = useLocation();
  const seg = pathname.split("/")[1];
  const role = ROLE_LABEL[seg];
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-shell items-center gap-4 px-5 py-3">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Zpět na rozcestník">
          <span className="grid h-7 w-7 place-items-center rounded-md border border-line bg-panel">
            <span className="flex flex-col gap-[3px]">
              <span className="block h-[2px] w-3.5 rounded bg-vedeni" />
              <span className="block h-[2px] w-2 rounded bg-hr" />
              <span className="block h-[2px] w-3 rounded bg-spec" />
            </span>
          </span>
          <span className="font-mono text-[11px] font-semibold tracking-label text-ink">VELÍN</span>
        </Link>
        <div className="telemetry-sep flex-1" aria-hidden />
        <span className="hidden font-mono text-[10px] tracking-label text-faint sm:block">
          PRŮVODCE IMPLEMENTACÍ AI
        </span>
        {role ? (
          <span className="flex items-center gap-2 rounded border border-line bg-panel px-2.5 py-1 font-mono text-[10px] tracking-label text-dim">
            <span className={`h-1.5 w-1.5 rounded-full ${role.dot}`} aria-hidden />
            {role.name}
          </span>
        ) : (
          <span className="flex items-center gap-2 rounded border border-line bg-panel px-2.5 py-1 font-mono text-[10px] tracking-label text-dim">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ok" aria-hidden />
            SYSTÉM PŘIPRAVEN
          </span>
        )}
      </div>
    </header>
  );
}

export default function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Telemetry />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-shell flex-col gap-2 px-5 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[10px] tracking-label text-faint">
            ORIENTAČNÍ PRŮVODCE · NENAHRAZUJE ODBORNÉ POSOUZENÍ
          </p>
          <p className="font-mono text-[10px] tracking-label text-faint">
            SESTAVIL JIŘÍ MYNÁŘ ·{" "}
            <a
              href={LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              className="text-dim underline decoration-line underline-offset-4 transition-colors hover:text-ink"
            >
              LINKEDIN
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
