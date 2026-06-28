import { ReactNode } from "react";
import { Link } from "react-router-dom";

const LINKEDIN = "https://www.linkedin.com/in/jirimynar/";

/**
 * Obal aplikace. Horní telemetrická lišta byla odstraněna — cestu domů drží
 * jen decentní odkaz „VELÍN" v patičce, ať to neruší nový vzhled.
 */
export default function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">{children}</main>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-shell flex-col gap-2 px-5 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="font-mono text-[10px] font-semibold tracking-label text-dim transition-colors hover:text-ink"
            >
              VELÍN
            </Link>
            <span className="font-mono text-[10px] tracking-label text-faint">
              ORIENTAČNÍ PRŮVODCE · NENAHRAZUJE ODBORNÉ POSOUZENÍ
            </span>
          </div>
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
