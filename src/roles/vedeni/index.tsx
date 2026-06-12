import { Route, Routes } from "react-router-dom";
import Intro from "./Intro";
import Pruvodce from "./Pruvodce";
import Report from "./Report";

/** Modul VEDENÍ — samostatně nasaditelný, bez vazeb na ostatní role. */
export default function VedeniModule() {
  return (
    <Routes>
      <Route index element={<Intro />} />
      <Route path="pruvodce" element={<Pruvodce />} />
      <Route path="report" element={<Report />} />
    </Routes>
  );
}
