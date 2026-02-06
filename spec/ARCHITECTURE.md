# PLANTORIA -- Technische Architektur

## Tech Stack

| Bereich | Technologie | Version |
|---------|-------------|---------|
| Meta-Framework | Nuxt | 4.x |
| Framework | Vue 3 (Composition API) | via Nuxt |
| UI-Bibliothek | Nuxt UI | 4.x |
| CSS Framework | Tailwind CSS | 4.x |
| Sprache | TypeScript | 5.9 |
| State Management | Pinia | 3.x |
| Icons | Lucide Vue Next | -- |
| Routing | Vue Router (via Nuxt, file-based) | -- |
| Build Tool | Vite (via Nuxt) | -- |
| Code Style | Prettier (single quotes, no semicolons, 100 char width) | -- |
| Node | ^20.19.0 oder >=22.12.0 | -- |
| Backend | TBD | -- |

## Projektstruktur

```
plantoria/
├── src/                     # Source-Verzeichnis (srcDir: "src")
│   ├── App.vue              # Root-Komponente
│   ├── pages/
│   │   └── index.vue        # Startseite (file-based routing)
│   ├── stores/
│   │   └── counter.ts       # Pinia Store (Beispiel)
│   └── styles/
│       └── globals.css       # Globale Styles
├── spec/                    # Projektdokumentation
│   ├── PRD.md               # Product Requirements Document
│   └── ARCHITECTURE.md      # Technische Architektur (diese Datei)
├── nuxt.config.ts           # Nuxt-Konfiguration
├── package.json
├── tsconfig.json
└── .prettierrc.json
```

## Nuxt-Konfiguration

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  srcDir: "src",
  css: ["@/styles/globals.css"],
  modules: ["@pinia/nuxt", "@nuxt/ui"],
  devtools: { enabled: true },
})
```

**Wichtig:**
- Source-Verzeichnis ist `src/` (nicht Root)
- `@/` zeigt auf `./src/`
- Routing ist file-based via `src/pages/`

## Geplante Routen

| Route | View | Beschreibung |
|-------|------|-------------|
| `/` | Dashboard | Übersicht mit Tabs (Fortschritt, Ranking, ToDos, Statistiken, Kalender) |
| `/login` | Login | Anmeldung |
| `/teacher` | Lehrperson | Projekte, Fachbereiche, Lehrmittel, Schülerverwaltung |
| `/student` | Schüler | Aufgaben, Projektfortschritt, Lernmaterial |
| `/parent` | Eltern | Lernstand, Lehrplan-Info |
| `/project/:id` | Projekt | Einzelnes Projekt mit Zeitstrahl und Aufgaben |

## Scripts

| Command | Beschreibung |
|---------|-------------|
| `npm run dev` | Entwicklungsserver starten |
| `npm run build` | Produktion-Build |
| `npm run preview` | Produktion-Build lokal testen |
| `npm run type-check` | TypeScript prüfen |
| `npm run format` | Code formatieren mit Prettier |

## Code-Konventionen

- **Prettier:** Single quotes, keine Semicolons, 100 Zeichen Breite
- **Komponenten:** Vue 3 Composition API mit `<script setup lang="ts">`
- **State:** Pinia Stores in `src/stores/`
- **Styling:** Tailwind CSS Utility-Klassen, globale Styles in `src/styles/`
- **IDE:** VS Code + Vue (Official) Extension
