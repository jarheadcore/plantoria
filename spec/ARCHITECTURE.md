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
├── src/                          # Source-Verzeichnis (srcDir: "src")
│   ├── App.vue                   # Root-Komponente
│   ├── types/
│   │   └── index.ts              # Alle TypeScript-Interfaces
│   ├── pages/
│   │   ├── index.vue             # Redirect → /teacher
│   │   ├── dashboard.vue         # Tablet-Dashboard (Kinder)
│   │   └── teacher/              # Lehrpersonen-Modul
│   │       ├── index.vue         # Dashboard
│   │       ├── projects/         # Projekte (CRUD)
│   │       ├── materials/        # Lehrmittel
│   │       ├── students/         # Schülerverwaltung
│   │       ├── subjects/         # Fachbereiche
│   │       ├── templates/        # Projektvorlagen
│   │       ├── curriculum/       # LP21-Abdeckung
│   │       ├── calendar/         # Kalender
│   │       ├── markets/          # Erntemärkte
│   │       └── settings/         # Einstellungen
│   ├── stores/                   # Pinia Stores (zentrale Datenquelle)
│   │   ├── projects.ts           # Projekte, Aufgaben, Kulturen, Gruppen
│   │   ├── students.ts           # Schülerdaten
│   │   ├── materials.ts          # Lehrmittel mit Filter-Logik
│   │   ├── teacher.ts            # Lehrperson & Schulkontext
│   │   ├── curriculum.ts         # LP21-Lehrplan & Fortschritt
│   │   ├── templates.ts          # Projektvorlagen
│   │   ├── calendar.ts           # Kalendereinträge
│   │   ├── notifications.ts      # Benachrichtigungen
│   │   └── markets.ts            # Erntemärkte
│   ├── data/
│   │   └── fixtures/             # Fixture-Daten für Entwicklung
│   │       ├── projects.ts
│   │       ├── tasks.ts
│   │       ├── students.ts
│   │       ├── templates.ts
│   │       ├── curriculum.ts
│   │       ├── materials.ts
│   │       ├── cultures.ts
│   │       ├── groups.ts
│   │       ├── calendar.ts
│   │       ├── notifications.ts
│   │       ├── teacher.ts
│   │       ├── subjects.ts
│   │       └── markets.ts
│   ├── components/
│   │   ├── shared/               # Wiederverwendbare Komponenten
│   │   └── layout/               # Layout-Komponenten
│   ├── layouts/
│   │   └── teacher.vue           # Sidebar-Layout Lehrpersonen
│   └── styles/
│       └── globals.css           # Tailwind-Konfiguration & Theme
├── spec/                         # Projektdokumentation
│   ├── PRD.md                    # Product Requirements Document
│   └── ARCHITECTURE.md           # Technische Architektur (diese Datei)
├── nuxt.config.ts
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
  modules: ["@pinia/nuxt", "@nuxt/ui", "@nuxt/content"],
  devtools: { enabled: true },
  components: [{ path: '~/components', pathPrefix: false }],
  ui: { theme: { colors: ['green'] } },
})
```

**Wichtig:**
- Source-Verzeichnis ist `src/` (nicht Root)
- `@/` zeigt auf `./src/`
- Routing ist file-based via `src/pages/`

---

## State Management mit Pinia

### Grundprinzip

**Alle Views werden durch Pinia Stores abgebildet.** Kein View hält eigene Daten lokal -- die Stores sind die **Single Source of Truth** für sämtliche Datenmodelle. Lokaler State in Komponenten beschränkt sich auf reines UI-Verhalten (z.B. `activeTab`, `scrollPosition`, `isModalOpen`).

### Architektur-Regeln

1. **Jede Entität bekommt einen eigenen Store** -- benannt nach dem Schema `use<Entity>Store` (z.B. `useProjectsStore`, `useStudentsStore`)
2. **Views lesen ausschliesslich aus Stores** -- kein Fetching oder Datenhalten in Komponenten
3. **Mutationen nur über Store-Actions** -- Komponenten rufen Actions auf, manipulieren nie direkt den State
4. **Abgeleiteter State via `computed`** -- Filter, Aggregationen und Sortierungen als Computed Properties im Store
5. **Stores sind unabhängig** -- kein Store importiert einen anderen Store. Cross-Store-Logik gehört in die Komponente oder in ein Composable

### Store-Aufbau (Composition API / Setup Syntax)

Alle Stores verwenden die **Setup Syntax** von Pinia (`defineStore('name', () => { ... })`):

```ts
// src/stores/projects.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Project } from '@/types'
import { fixtureProjects } from '@/data/fixtures/projects'

export const useProjectsStore = defineStore('projects', () => {
  // State
  const projects = ref<Project[]>(fixtureProjects)

  // Getters (computed)
  const activeProjects = computed(() =>
    projects.value.filter((p) => p.status !== 'Abgeschlossen')
  )

  // Actions
  function getProjectById(id: string) {
    return projects.value.find((p) => p.id === id)
  }

  return { projects, activeProjects, getProjectById }
})
```

### Verwendung in Views

```vue
<script setup lang="ts">
const projectsStore = useProjectsStore()
const curriculumStore = useCurriculumStore()

// Lesen aus Store
const projects = computed(() => projectsStore.activeProjects)

// Mutieren über Actions
function onTaskToggle(taskId: string) {
  projectsStore.toggleTask(taskId)
}
</script>
```

### Übersicht aller Stores

| Store | Datei | Entitäten | Beschreibung |
|-------|-------|-----------|-------------|
| `useProjectsStore` | `stores/projects.ts` | Project, PreProject, Task, Culture, StudentGroup | Projekte mit Aufgaben, Kulturen, Gruppen und Vorprojekt-Checklisten |
| `useStudentsStore` | `stores/students.ts` | Student | Schülerdaten mit Lookup-Funktionen |
| `useMaterialsStore` | `stores/materials.ts` | Material, RecentDownload | Lehrmittel mit Multi-Filter-Logik (Fach, Stufe, Phase, Format, LP21) |
| `useTeacherStore` | `stores/teacher.ts` | User, School, SchoolClass | Lehrperson, Schule und aktive Klasse |
| `useCurriculumStore` | `stores/curriculum.ts` | Curriculum, CurriculumProgress | LP21-Fachbereiche mit Abdeckungsberechnung |
| `useTemplatesStore` | `stores/templates.ts` | ProjectTemplate | Projektvorlagen (eigene, geteilte, Plattform) |
| `useCalendarStore` | `stores/calendar.ts` | CalendarEntry | Kalendereinträge (Aufgaben, Saisonales, Erntemärkte) |
| `useNotificationsStore` | `stores/notifications.ts` | Notification | System-Benachrichtigungen |
| `useMarketsStore` | `stores/markets.ts` | HarvestMarket | Erntemärkte mit Produkten und Anmeldungen |

### View-zu-Store-Zuordnung

Jeder View deklariert, welche Stores er verwendet:

| View | Stores |
|------|--------|
| `/teacher` (Dashboard) | `teacher`, `projects`, `curriculum`, `materials`, `calendar` |
| `/teacher/projects` | `projects` |
| `/teacher/projects/[id]` | `projects`, `students` |
| `/teacher/materials` | `materials` |
| `/teacher/students` | `students` |
| `/teacher/curriculum` | `curriculum` |
| `/teacher/templates` | `templates` |
| `/teacher/calendar` | `calendar` |
| `/teacher/markets` | `markets` |
| `/dashboard` (Kinder-Tablet) | `projects`, `students`, `calendar` |

---

## Fixture-Daten

### Konzept

Solange kein Backend angebunden ist, werden alle Datenmodelle als **Fixtures** bereitgestellt. Fixtures sind typsichere, realistische Beispieldaten die den vollen Funktionsumfang der UI abbilden.

### Verzeichnis

```
src/data/fixtures/
├── projects.ts        # 2 Projekte (Gemüsefläche, Bienenstock)
├── tasks.ts           # Aufgaben mit LP21-Bezügen und Phasen
├── students.ts        # 22 Schüler mit Tablet-Zugang
├── templates.ts       # 3 Projektvorlagen mit LP21-Abdeckung
├── curriculum.ts      # 4 LP21-Fachbereiche (NMG, MA, TTG, WAH)
├── materials.ts       # 20+ Lehrmittel (PDF/DOCX) mit LP21-Refs
├── cultures.ts        # Gepflanzte Kulturen mit Fortschritt
├── groups.ts          # Schülergruppen pro Projekt
├── calendar.ts        # Kalendereinträge
├── notifications.ts   # Benachrichtigungen
├── teacher.ts         # Lehrperson, Schule, Klasse
├── subjects.ts        # Fachbereichsbeschreibungen
└── markets.ts         # Erntemärkte mit Produkten
```

### Regeln

1. **Typsicher** -- jede Fixture-Datei exportiert typisierte Arrays/Objekte passend zu `src/types/index.ts`
2. **Realistisch** -- Daten bilden echte Anwendungsfälle ab (z.B. LP21-Referenzen, Phasenzuordnung)
3. **Vollständig** -- alle Beziehungen zwischen Entitäten sind korrekt verknüpft (z.B. `task.projectId → project.id`)
4. **Benannt** -- Exporte folgen dem Schema `fixture<Entity>` (z.B. `fixtureProjects`, `fixtureTasks`)

### Übergang zu API

Wenn ein Backend angebunden wird, werden die Fixture-Imports in den Stores durch API-Calls ersetzt. Die Store-Schnittstelle nach aussen bleibt identisch -- Views müssen nicht angepasst werden:

```ts
// Vorher (Fixtures)
const projects = ref<Project[]>(fixtureProjects)

// Nachher (API)
const projects = ref<Project[]>([])
async function fetchProjects() {
  projects.value = await $fetch('/api/projects')
}
```

---

## Routen

| Route | View | Layout | Beschreibung |
|-------|------|--------|-------------|
| `/` | Redirect | -- | Weiterleitung zu `/teacher` |
| `/dashboard` | Kinder-Dashboard | -- | Tablet-optimiert, Swipe-Navigation |
| `/teacher` | Lehrer-Dashboard | `teacher` | Übersicht mit 6 Karten |
| `/teacher/projects` | Projektliste | `teacher` | Filter nach Status, Phase, Suche |
| `/teacher/projects/new` | Neues Projekt | `teacher` | Projekt erstellen |
| `/teacher/projects/[id]` | Projektdetail | `teacher` | Aufgaben, Gruppen, Kulturen, Vorprojekt |
| `/teacher/materials` | Lehrmittel | `teacher` | Multi-Filter, Download-Tracking |
| `/teacher/students` | Schüler | `teacher` | Klassenliste, Tablet-Zugang |
| `/teacher/subjects` | Fachbereiche | `teacher` | LP21-Übersicht |
| `/teacher/subjects/[id]` | Fachdetail | `teacher` | Themen eines Fachbereichs |
| `/teacher/curriculum` | LP21-Abdeckung | `teacher` | Fortschritt pro Fach |
| `/teacher/templates` | Vorlagen | `teacher` | Plattform-, eigene, geteilte Vorlagen |
| `/teacher/templates/new` | Neue Vorlage | `teacher` | Vorlage erstellen |
| `/teacher/templates/[id]` | Vorlagendetail | `teacher` | Aufgaben, Materialien, LP21-Abdeckung |
| `/teacher/calendar` | Kalender | `teacher` | Aufgaben, Saisonales, Erntemärkte |
| `/teacher/markets` | Erntemärkte | `teacher` | Marktübersicht |
| `/teacher/markets/[id]` | Marktdetail | `teacher` | Produkte, Anmeldung |
| `/teacher/settings` | Einstellungen | `teacher` | Profil, Klasse, Schule |

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
- **State:** Pinia Stores in `src/stores/` -- alle Views lesen aus Stores, kein lokaler Daten-State
- **Fixtures:** Typsichere Testdaten in `src/data/fixtures/` -- Exporte als `fixture<Entity>`
- **Types:** Alle Interfaces zentral in `src/types/index.ts`
- **Styling:** Tailwind CSS Utility-Klassen, globale Styles in `src/styles/`
- **IDE:** VS Code + Vue (Official) Extension
