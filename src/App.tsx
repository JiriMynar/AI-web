import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import Shell from "./design/Shell";
import Landing from "./pages/Landing";

/*
 * Striktní oddělení rolí: každá role je samostatný lazy modul.
 * Žádná role neimportuje obsah jiné role.
 */
const Vedeni = lazy(() => import("./roles/vedeni"));
const Hr = lazy(() => import("./roles/hr"));
const Specialista = lazy(() => import("./roles/specialista"));

export default function App() {
  return (
    <Shell>
      <Suspense
        fallback={
          <div className="mx-auto max-w-shell px-5 py-24 font-mono text-xs tracking-label text-faint">
            NAČÍTÁM MODUL…
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/vedeni/*" element={<Vedeni />} />
          <Route path="/hr/*" element={<Hr />} />
          <Route path="/specialista/*" element={<Specialista />} />
          <Route
            path="*"
            element={
              <div className="mx-auto max-w-shell px-5 py-24">
                <p className="font-mono text-xs tracking-label text-warn">CHYBA 404</p>
                <h1 className="mt-3 text-3xl font-semibold">Tahle obrazovka ve velínu není.</h1>
                <a href="/" className="mt-6 inline-block font-mono text-sm text-vedeni underline underline-offset-4">← Zpět na rozcestník</a>
              </div>
            }
          />
        </Routes>
      </Suspense>
    </Shell>
  );
}
