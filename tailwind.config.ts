import type { Config } from "tailwindcss";

/**
 * Design tokeny konceptu „Velín" — řídicí panel implementace AI.
 * Tmavé prostředí dispečinku, mono telemetrie, akcentové kontrolky rolí.
 */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0A1017",        // hala velínu
        panel: "#0F1722",     // panel přístroje
        raised: "#15202E",    // vystouplý prvek
        line: "#22303F",      // dělicí linka
        linesoft: "#1A2532",
        ink: "#E9F0F7",       // primární text
        dim: "#92A6BB",       // sekundární text
        faint: "#5C7185",     // popisky
        vedeni: "#4FC3F7",    // modrá kontrolka — vedení
        hr: "#FF8896",        // korálová — HR
        spec: "#43DD9A",      // zelená — specialista
        ok: "#43DD9A",
        warn: "#FFB547",
        stop: "#FF6B6B",
      },
      fontFamily: {
        sans: ["'Space Grotesk Variable'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono Variable'", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        label: "0.14em",
        wide2: "0.08em",
      },
      maxWidth: { shell: "76rem" },
      boxShadow: {
        panel: "0 1px 0 rgba(255,255,255,0.04) inset, 0 12px 40px rgba(0,0,0,0.35)",
      },
    },
  },
  plugins: [],
} satisfies Config;
