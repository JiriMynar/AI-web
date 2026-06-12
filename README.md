# Velín — průvodce implementací AI

Webová aplikace pro lidi, kteří řeší implementaci AI ve firmách. Tři oddělené moduly podle role:
**vedení** (rozhodovací podklad), **HR** (podklad pro nábor) a **AI specialista** (postup a legislativa).
Čistě statická SPA — žádný backend, žádný sběr dat; sdílitelné reporty nesou odpovědi zakódované v URL.

## Stack

Vite · React 18 · TypeScript (strict) · Tailwind CSS (vlastní design tokeny „Velín") · Framer Motion · lz-string.
Fonty Space Grotesk a JetBrains Mono jsou self-hostované přes Fontsource.

## Lokální spuštění

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # produkční build do dist/ (prebuild vygeneruje OG obrázek)
npm run preview  # lokální náhled produkčního buildu
```

Vyžaduje Node 22 (viz `.node-version`). Po prvním lokálním `npm install` doporučujeme
commitnout vzniklý `package-lock.json` (zatím není v repu) a přepnout build na `npm ci`.

## Architektura — striktní oddělení rolí

```
src/
  pages/Landing.tsx       rozcestník
  roles/
    vedeni/               kompletní: úvod + průvodce + report (otázky, logika, UI)
    hr/                   fáze 1: úvodní stránka (průvodce ve výstavbě)
    specialista/          fáze 1: úvodní stránka (průvodce ve výstavbě)
  design/                 JEDINÉ sdílené místo: design systém (Shell, primitivy)
  lib/                    sdílené utility bez obsahu (share, seo)
```

Pravidlo: obsah a logika jedné role nikdy neimportuje nic z jiné role. Sdílí se jen design
systém a obecné utility. Každý modul je nasaditelný samostatně.

## Sdílitelný report

Odpovědi se komprimují (`lz-string`) do hashe URL: `/vedeni/report#r=…`. Formát je verzovaný
(`v: 1` uvnitř payloadu) — při neznámé verzi se zobrazí srozumitelná hláška místo rozbitého reportu.

## Nasazení na Render.com

Repo obsahuje `render.yaml` (Blueprint, typ *static site*):

1. Na [dashboard.render.com](https://dashboard.render.com) → **New → Blueprint** a připojte toto repo.
2. Render přečte `render.yaml`: build `npm install && npm run build`, publish `dist/`.
3. SPA rewrite `/* → /index.html` je v Blueprintu — přímé vstupy na `/vedeni` apod. fungují.

Zdroj obsahu: `inspirace.txt` (původní prototyp otázek a vyhodnocovací logiky — přidejte do rootu
repa ručně, slouží jako podklad pro dostavbu modulů HR a specialista).
