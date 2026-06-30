import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Shell from "./design/Shell";
import Landing from "./pages/Landing";
import Vyber from "./pages/Vyber";
import AppLayout from "./app/AppLayout";
import {
  AITym,
  CharakteristikaPodniku,
  FiremniCile,
  MapovaniProcesu,
  PopisPrace,
  PrehledyMezd,
} from "./app/sections";
import { Roadmap } from "./app/roadmap";

/*
 * Dve vrstvy:
 *  - /app/*  bezi v samostatnem svetlem AppLayout (vlastni postranni menu, mimo Shell)
 *  - vse ostatni bezi pod puvodnim Shellem (landing, rozcestnik, role moduly)
 */
const Vedeni = lazy(() => import("./roles/vedeni"));
const Hr = lazy(() => import("./roles/hr"));
const Specialista = lazy(() => import("./roles/specialista"));

function ShellRoutes() {
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
          <Route path="/vyber" element={<Vyber />} />
          <Route path="/vedeni/*" element={<Vedeni />} />
          <Route path="/hr/*" element={<Hr />} />
          <Route path="/specialista/*" element={<Specialista />} />
          <Route
            path="*"
            element={
              <div className="mx-auto max-w-shell px-5 py-24">
                <p className="font-mono text-xs tracking-label text-warn">CHYBA 404</p>
                <h1 className="mt-3 text-3xl font-semibold">Tahle obrazovka ve velínu není.</h1>
                <a href="/" className="mt-6 inline-block font-mono text-sm text-vedeni underline underline-offset-4">← Zpět na úvod</a>
              </div>
            }
          />
        </Routes>
      </Suspense>
    </Shell>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<Navigate to="/app/charakteristika-podniku" replace />} />
        <Route path="charakteristika-podniku" element={<CharakteristikaPodniku />} />
        <Route path="firemni-cile" element={<FiremniCile />} />
        <Route path="ai-tym" element={<AITym />} />
        <Route path="popis-prace" element={<PopisPrace />} />
        <Route path="prehledy-mezd" element={<PrehledyMezd />} />
        <Route path="mapovani-procesu" element={<MapovaniProcesu />} />
        <Route path="roadmap" element={<Roadmap />} />
        <Route path="*" element={<Navigate to="/app/charakteristika-podniku" replace />} />
      </Route>
      <Route path="*" element={<ShellRoutes />} />
    </Routes>
  );
}
