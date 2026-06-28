import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

const LINKEDIN = "https://www.linkedin.com/in/jirimynar/";

/**
 * Obal aplikace. Horní lišta odstraněna — cestu domů drží odkaz „VELÍN" v patičce.
 * Hlavní stránka je ve světlém módu, zbytek appky tmavý, takže patičku ladíme
 * podle cesty — světlá na úvodu, tmavá jinde.
 */
export default function Shell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const light = pathname === "/";
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">{children}</main>
      <footer className={light ? "border-t border-[#E3EAF2] bg-[#F6F9FC]" : "border-t border-line"}>
        <div className="mx-auto flex max-w-shell flex-col gap-2 px-5 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className={`font-mono text-[10px] font-semibold tracking-label transition-colors ${light ? "text-[#5A6B7B] hover:text-[#0E1726]" : "text-dim hover:text-ink"}`}
            >
              VELÍN
            </Link>
            <span className={`font-mono text-[10px] tracking-label ${light ? "text-[#9AA7B4]" : "text-faint"}`}>
              ORIENTAČNÍ PRŮVODCE · NENAHRAZUJE ODBORNÉ POSOUZENÍ
            </span>
          </div>
          <p className={`font-mono text-[10px] tracking-label ${light ? "text-[#9AA7B4]" : "text-faint"}`}>
            SESTAVIL JIŘÍ MYNÁŘ ·{" "}
            <a
              href={LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              className={`underline underline-offset-4 transition-colors ${light ? "text-[#5A6B7B] decoration-[#CDD8E3] hover:text-[#0E1726]" : "text-dim decoration-line hover:text-ink"}`}
            >
              LINKEDIN
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
