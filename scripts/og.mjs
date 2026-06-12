/**
 * Generuje public/og.png (1200×630) pro sdílení na LinkedIn — běží v prebuild.
 * Fail-soft: pokud generování selže, build pokračuje (jen se zaloguje varování).
 */
import { writeFileSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "public", "og.png");

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#0A1017"/>
  ${Array.from({ length: 24 }, (_, r) =>
    Array.from({ length: 46 }, (_, c) => `<circle cx="${30 + c * 26}" cy="${30 + r * 26}" r="1" fill="#4FC3F7" opacity="0.07"/>`).join("")
  ).join("")}
  <rect x="70" y="64" width="10" height="10" rx="5" fill="#43DD9A"/>
  <text x="96" y="74" font-family="JetBrains Mono, monospace" font-size="20" letter-spacing="4" fill="#92A6BB">VELÍN /// PRŮVODCE IMPLEMENTACÍ AI</text>
  <text x="70" y="240" font-family="Space Grotesk, sans-serif" font-weight="600" font-size="86" fill="#E9F0F7">Chcete nastartovat</text>
  <text x="70" y="340" font-family="Space Grotesk, sans-serif" font-weight="600" font-size="86" fill="#E9F0F7">AI ve firmě?</text>
  <text x="70" y="420" font-family="Space Grotesk, sans-serif" font-size="40" fill="#92A6BB">Záleží, odkud se díváte.</text>
  <rect x="70" y="492" width="330" height="64" rx="8" fill="#0F1722" stroke="#22303F" stroke-width="2"/>
  <circle cx="104" cy="524" r="6" fill="#4FC3F7"/>
  <text x="124" y="532" font-family="Space Grotesk, sans-serif" font-size="24" fill="#E9F0F7">Vedení / majitel</text>
  <rect x="420" y="492" width="270" height="64" rx="8" fill="#0F1722" stroke="#22303F" stroke-width="2"/>
  <circle cx="454" cy="524" r="6" fill="#FF8896"/>
  <text x="474" y="532" font-family="Space Grotesk, sans-serif" font-size="24" fill="#E9F0F7">HR / nábor</text>
  <rect x="710" y="492" width="300" height="64" rx="8" fill="#0F1722" stroke="#22303F" stroke-width="2"/>
  <circle cx="744" cy="524" r="6" fill="#43DD9A"/>
  <text x="764" y="532" font-family="Space Grotesk, sans-serif" font-size="24" fill="#E9F0F7">AI specialista</text>
</svg>`;

try {
  const { Resvg } = await import("@resvg/resvg-js");
  // Fonty pro render: variabilní soubory z fontsource balíčků v node_modules
  const fontFiles = [];
  const sg = join(root, "node_modules", "@fontsource-variable", "space-grotesk", "files", "space-grotesk-latin-ext-wght-normal.woff2");
  const jb = join(root, "node_modules", "@fontsource-variable", "jetbrains-mono", "files", "jetbrains-mono-latin-ext-wght-normal.woff2");
  if (existsSync(sg)) fontFiles.push(sg);
  if (existsSync(jb)) fontFiles.push(jb);

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 1200 },
    font: {
      loadSystemFonts: true,
      fontFiles,
      defaultFontFamily: "Space Grotesk",
    },
  });
  mkdirSync(join(root, "public"), { recursive: true });
  writeFileSync(out, resvg.render().asPng());
  console.log("[og] vygenerováno public/og.png");
} catch (err) {
  console.warn("[og] generování selhalo, build pokračuje bez og.png:", err?.message || err);
}
