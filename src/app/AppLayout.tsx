import { ReactNode } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useLocalStorage } from "../lib/useLocalStorage";

const IC = "h-[18px] w-[18px] flex-shrink-0";

type Item = { to: string; label: string; icon: ReactNode };

const MAIN: Item[] = [
  {
    to: "/app/charakteristika-podniku",
    label: "Charakteristika podniku",
    icon: (
      <svg viewBox="0 0 24 24" className={IC} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="3" width="9" height="18" rx="1.5" />
        <path d="M13 8h7v13h-7" />
        <path d="M7 7h2M7 11h2M7 15h2M16 12h1M16 16h1" />
      </svg>
    ),
  },
  {
    to: "/app/firemni-cile",
    label: "Stanovení firemních cílů",
    icon: (
      <svg viewBox="0 0 24 24" className={IC} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    to: "/app/ai-tym",
    label: "Sestavení AI týmu",
    icon: (
      <svg viewBox="0 0 24 24" className={IC} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
        <path d="M16 5.5a3 3 0 0 1 0 5.4M20.5 20a5.5 5.5 0 0 0-4.2-5.3" />
      </svg>
    ),
  },
  {
    to: "/app/popis-prace",
    label: "Sestavit popis práce",
    icon: (
      <svg viewBox="0 0 24 24" className={IC} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <path d="M9 8h6M9 12h6M9 16h4" />
      </svg>
    ),
  },
  {
    to: "/app/prehledy-mezd",
    label: "Přehledy mezd v oboru AI",
    icon: (
      <svg viewBox="0 0 24 24" className={IC} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" />
        <rect x="5" y="11" width="3.5" height="8" rx="1" />
        <rect x="10.5" y="6" width="3.5" height="13" rx="1" />
        <rect x="16" y="9" width="3.5" height="10" rx="1" />
      </svg>
    ),
  },
];

const FIRST_STEPS: Item[] = [
  {
    to: "/app/mapovani-procesu",
    label: "Mapování procesů",
    icon: (
      <svg viewBox="0 0 24 24" className={IC} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="5" cy="6" r="2" />
        <circle cx="5" cy="18" r="2" />
        <circle cx="19" cy="12" r="2" />
        <path d="M7 6h6a4 4 0 0 1 4 4M7 18h6a4 4 0 0 0 4-4" />
      </svg>
    ),
  },
];

function linkClass({ isActive }: { isActive: boolean }) {
  return `flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] transition-colors ${
    isActive
      ? "bg-[#EAF2FB] font-semibold text-[#1F7AD4]"
      : "text-[#4A5A6B] hover:bg-[#F1F5F9] hover:text-[#0E1726]"
  }`;
}

export default function AppLayout() {
  const initialOpen = typeof window !== "undefined" ? window.innerWidth >= 1024 : true;
  const [open, setOpen] = useLocalStorage<boolean>("velin.sidebar.open", initialOpen);

  const closeOnMobile = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) setOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F6F9FC] text-[#0E1726]">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-[#E6ECF3] bg-white transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#E6ECF3] px-4 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-[#1F7AD4] text-[13px] font-bold text-white">V</span>
            <span className="font-semibold tracking-tight text-[#0E1726]">Velín</span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Skrýt menu"
            className="rounded-md p-1.5 text-[#9AA7B4] transition-colors hover:bg-[#F1F5F9] hover:text-[#0E1726]"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 7l-5 5 5 5" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {MAIN.map((it) => (
              <NavLink key={it.to} to={it.to} className={linkClass} onClick={closeOnMobile}>
                <span className="text-[#7A8794]">{it.icon}</span>
                <span>{it.label}</span>
              </NavLink>
            ))}
          </div>

          <div className="px-3 pb-2 pt-6 font-mono text-[10px] font-semibold tracking-label text-[#9AA7B4]">
            PRVNÍ KROKY TÝMU
          </div>
          <div className="space-y-1">
            {FIRST_STEPS.map((it) => (
              <NavLink key={it.to} to={it.to} className={linkClass} onClick={closeOnMobile}>
                <span className="text-[#7A8794]">{it.icon}</span>
                <span>{it.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="border-t border-[#E6ECF3] px-4 py-3">
          <a
            href="https://www.linkedin.com/in/jirimynar/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] tracking-label text-[#9AA7B4] transition-colors hover:text-[#0E1726]"
          >
            SESTAVIL JIŘÍ MYNÁŘ · LINKEDIN
          </a>
        </div>
      </aside>

      {/* Mobilní podklad */}
      {open && (
        <button
          type="button"
          aria-label="Zavřít menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
        />
      )}

      {/* Obsah */}
      <div className={`flex min-h-screen flex-col transition-[padding] duration-300 ${open ? "lg:pl-64" : "lg:pl-0"}`}>
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-[#E6ECF3] bg-[#F6F9FC]/85 px-4 py-3 backdrop-blur">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="Otevřít nebo skrýt menu"
            className="rounded-md p-2 text-[#52606D] transition-colors hover:bg-white hover:text-[#0E1726]"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
          <Link to="/" className="font-mono text-[11px] font-semibold tracking-label text-[#52606D] transition-colors hover:text-[#0E1726]">
            VELÍN
          </Link>
        </header>

        <main className="flex-1 px-5 py-8 sm:px-8 sm:py-10">
          <div className="mx-auto max-w-4xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
