# PLANTORIA -- Konzept: Datenstruktur & Navigation

> **Zweck:** Ordnung schaffen zwischen Aufgaben, Fachbereichen, Projekten, Projekt-Templates und Lehrmaterial.
> Dieses Dokument definiert die bereinigte Struktur, die klaren Zustaendigkeiten jeder Entitaet und die daraus abgeleitete Navigation.

---

## Inhaltsverzeichnis

1. [Problemanalyse: Aktueller Zustand](#1-problemanalyse-aktueller-zustand)
2. [Zielstruktur: Entitaeten und ihre Rollen](#2-zielstruktur-entitaeten-und-ihre-rollen)
3. [Beziehungsmodell](#3-beziehungsmodell)
4. [Template-zu-Projekt-Flow](#4-template-zu-projekt-flow)
5. [Aufgaben-Konzept](#5-aufgaben-konzept)
6. [Fachbereiche-Konzept](#6-fachbereiche-konzept)
7. [Lehrmaterial-Konzept](#7-lehrmaterial-konzept)
8. [Navigation: Neue Struktur](#8-navigation-neue-struktur)
9. [Datenmodell: Bereinigte Interfaces](#9-datenmodell-bereinigte-interfaces)
10. [Migrations-Uebersicht](#10-migrations-uebersicht)

---

## 1. Problemanalyse: Aktueller Zustand

### Was existiert heute

| Entitaet | Typ / Datei | Zweck | Problem |
|----------|-------------|-------|---------|
| `Task` | `types/index.ts` | Einzelne Aufgabe im Projekt | Hat `steps[]`, `materialList[]`, `goalDescription` -- ueberladen, vermischt Aufgabe mit Aktivitaets-Definition |
| `ActivityDefinition` | `types/index.ts`, `fixtures/activities.ts` | Jahreszyklus-Aktivitaet (Beetplanung, Bewaessern...) | Existiert parallel zu Tasks, unklar wie sie zusammenhaengen. Wird nur fuer Gemuese-Projekt verwendet |
| `SubjectArea` (Fachbereich) | `types/index.ts`, `fixtures/subjects.ts` | Thematische Sammlung (Boden, Oekologie...) | Nur als Kategorie fuer Material verwendet, keine eigene Tiefe. Kein Bezug zu Projekten |
| `SubjectAreaTemplate` | `types/index.ts` | Lernpfad pro Fachbereich | Existiert als Interface, wird nirgends verwendet |
| `Material` | `types/index.ts`, `fixtures/materials.ts` | Arbeitsblaetter / Downloads | Hat `subjectArea`-Feld aber keine Verknuepfung zu Aufgaben oder Projekten |
| `TaskTemplate` | `types/index.ts`, `fixtures/templates.ts` | Aufgaben-Vorlage im Projekt-Template | Einfache Struktur, keine Verknuepfung zu Material oder Fachbereichen |
| `ProjectTemplate` | `types/index.ts`, `fixtures/templates.ts` | Vorlage fuer neues Projekt | Enthaelt TaskTemplates und TemplateMaterials, aber nicht ActivityDefinitions |

### Kern-Probleme

```
PROBLEM 1: Dopplung Aufgaben / Aktivitaeten
──────────────────────────────────────────────
Task ("Boden vorbereiten")  vs.  ActivityDefinition ("Beetvorbereitung")
  - Beide haben steps[], materials[], lp21Refs[]
  - Unklar: Ist eine Aktivitaet eine grosse Aufgabe? Enthaelt sie Aufgaben?
  - ActivityDefinition existiert nur fuer 1 Projekt (Gemueseflaeche)

PROBLEM 2: Fachbereiche ohne Funktion
──────────────────────────────────────
SubjectArea/SubjectInfo = nur Kategorie-Label fuer Material
  - Kein eigener Bereich mit Tiefe
  - Keine Verbindung zu Projekten
  - Verwechslungsgefahr mit ActivityDefinition (beides sind "Themen")

PROBLEM 3: Material schwebt frei
─────────────────────────────────
Material hat subjectArea-Feld, aber:
  - Keine Verknuepfung zu Aufgaben (worksheetIds im Task, aber umgekehrt nicht)
  - Kein Template-Bezug (Material lebt in eigenem Pool)
  - Download-Tracking ist nicht mit Projektkontext verbunden

PROBLEM 4: Template → Projekt unklar
─────────────────────────────────────
ProjectTemplate → hat TaskTemplates
Project → hat Tasks
  - Wie werden TaskTemplates zu Tasks? (Duplizierung undokumentiert)
  - Wo gehoeren ActivityDefinitions hin? (Nicht im Template)
  - Material aus Template ≠ Material aus Material-Pool
```

---

## 2. Zielstruktur: Entitaeten und ihre Rollen

### Uebersicht: 5 Kern-Entitaeten

```
┌─────────────────────────────────────────────────────────────────┐
│                      PROJEKT-TEMPLATE                           │
│  "Gemueseflaeche" -- wiederverwendbare Vorlage                  │
│                                                                 │
│  ┌──────────────────────┐  ┌──────────────────────┐            │
│  │  FACHBEREICH-VORLAGE │  │  FACHBEREICH-VORLAGE │  ...       │
│  │  "Beetplanung"       │  │  "Kulturschutz"      │            │
│  │                      │  │                      │            │
│  │  ┌────────────────┐  │  │  ┌────────────────┐  │            │
│  │  │ AUFGABEN-VORL. │  │  │  │ AUFGABEN-VORL. │  │            │
│  │  │ "Beetplan zeich"│  │  │  │ "Netz spannen" │  │            │
│  │  │ → Material-Ref  │  │  │  │ → Material-Ref  │  │            │
│  │  └────────────────┘  │  │  └────────────────┘  │            │
│  │  ┌────────────────┐  │  │                      │            │
│  │  │ AUFGABEN-VORL. │  │  │                      │            │
│  │  │ "Flaechenberech"│  │  │                      │            │
│  │  └────────────────┘  │  │                      │            │
│  └──────────────────────┘  └──────────────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                            │
                    "Projekt erstellen"
                    (Duplizierung)
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                         PROJEKT                                 │
│  "Gemueseflaeche HE24a" -- konkretes Klassen-Projekt            │
│                                                                 │
│  ┌──────────────────────┐  ┌──────────────────────┐            │
│  │  FACHBEREICH         │  │  FACHBEREICH         │  ...       │
│  │  "Beetplanung"       │  │  "Kulturschutz"      │            │
│  │  (aus Template)      │  │  (aus Template)      │            │
│  │                      │  │                      │            │
│  │  ┌────────────────┐  │  │  ┌────────────────┐  │            │
│  │  │ AUFGABE        │  │  │  │ AUFGABE        │  │            │
│  │  │ "Beetplan zeich"│  │  │  │ "Netz spannen" │  │            │
│  │  │ (dupliziert)   │  │  │  │ (dupliziert)   │  │            │
│  │  └────────────────┘  │  │  └────────────────┘  │            │
│  │  ┌────────────────┐  │  │  ┌────────────────┐  │            │
│  │  │ AUFGABE        │  │  │  │ AUFGABE        │  │            │
│  │  │ "Extra-Aufgabe"│  │  │  │ (vom Lehrer    │  │            │
│  │  │ (vom Lehrer)   │  │  │  │  hinzugefuegt) │  │            │
│  │  └────────────────┘  │  │  └────────────────┘  │            │
│  └──────────────────────┘  └──────────────────────┘            │
└─────────────────────────────────────────────────────────────────┘

                    LEHRMATERIAL (globaler Pool)
┌─────────────────────────────────────────────────────────────────┐
│  "Bodentypen bestimmen" (PDF)     → LP21: NMG.2.1.a            │
│  "pH-Wert messen" (PDF)           → LP21: NMG.2.3              │
│  "Mischkultur-Tabelle" (PDF/DOCX) → LP21: NMG.2.1              │
│  ...                                                            │
│  Material wird von Aufgaben REFERENZIERT, nicht dupliziert.     │
└─────────────────────────────────────────────────────────────────┘
```

### Rollen-Definition

| Entitaet | Rolle | Metapher |
|----------|-------|----------|
| **Projekt-Template** | Wiederverwendbare Blaupause fuer ein Gartenprojekt | Bauplan |
| **Projekt** | Konkretes Klassen-Projekt, erstellt aus Template | Gebautes Haus |
| **Fachbereich** | Thematische Einheit innerhalb eines Projekts mit Zeitraum, Lernzielen und Material | Kapitel im Lehrbuch |
| **Aufgabe** | Konkrete, zuweisbare Taetigkeit innerhalb eines Fachbereichs | Uebung im Kapitel |
| **Lehrmaterial** | Downloadbares Material (PDF, DOCX, Video...) -- lebt im globalen Pool | Arbeitsblatt |

---

## 3. Beziehungsmodell

### Entitaets-Diagramm (bereinigt)

```
                           ┌──────────────────────┐
                           │   LEHRMATERIAL        │
                           │   (globaler Pool)     │
                           │                       │
                           │ id, title, formats,   │
                           │ lp21Refs, difficulty,  │
                           │ gradeRange, tags[]    │
                           └───────────┬───────────┘
                                       │
                              referenziert von
                                       │
┌──────────────────┐          ┌────────▼───────────┐
│ PROJEKT-TEMPLATE │──1:N──▶  │ FACHBEREICH-VORLAGE│
│                  │          │ (TopicTemplate)     │
│ id, name,        │          │                     │
│ category,        │          │ id, name, phase,    │
│ difficulty,      │          │ startMonth, endMonth│
│ lp21Coverage,    │          │ goalDescription,    │
│ gradeRange       │          │ materialList[],     │
│                  │          │ lp21Refs[]          │
└──────────────────┘          └────────┬───────────┘
        │                              │
        │                     1:N      │
        │                              ▼
        │                    ┌─────────────────────┐
        │                    │ AUFGABEN-VORLAGE     │
        │                    │ (TaskTemplate)       │
        │                    │                      │
        │                    │ id, title, steps[],  │
        │                    │ lp21Refs[],          │
        │                    │ materialIds[],       │
        │                    │ difficulty, order     │
        │                    └─────────────────────┘
        │
  "Projekt erstellen"
  (Duplizierung)
        │
        ▼
┌──────────────────┐          ┌─────────────────────┐
│ PROJEKT          │──1:N──▶  │ FACHBEREICH (Topic)  │
│                  │          │                      │
│ id, name,        │          │ id, name, phase,     │
│ templateId?,     │          │ startMonth, endMonth,│
│ status, phase,   │          │ goalDescription,     │
│ classId,         │          │ materialList[],      │
│ progress         │          │ lp21Refs[],          │
│                  │          │ fromTemplate: bool    │
└──────────────────┘          └────────┬────────────┘
        │                              │
        │                     1:N      │
        │                              ▼
        │                    ┌─────────────────────┐
        │                    │ AUFGABE (Task)       │
        │                    │                      │
        │                    │ id, title, status,   │
        │                    │ groupId?, steps[],   │
        │                    │ lp21Refs[],          │
        │                    │ materialIds[],       │
        │                    │ fromTemplate: bool,  │
        │                    │ dueDate?             │
        │                    └─────────────────────┘
        │
        ├──1:N──▶  Kulturen (Culture)
        ├──1:N──▶  Gruppen (StudentGroup)
        └──1:1──▶  Vorprojekt (PreProject)
```

### Kardinalitaeten

| Beziehung | Kardinalitaet | Beschreibung |
|-----------|---------------|-------------|
| Template → Fachbereich-Vorlage | 1:N | Ein Template hat mehrere Fachbereich-Vorlagen |
| Fachbereich-Vorlage → Aufgaben-Vorlage | 1:N | Jede Vorlage enthaelt Standard-Aufgaben |
| Aufgabe → Lehrmaterial | N:M | Aufgaben referenzieren Material aus dem Pool |
| Projekt → Template | N:1 (optional) | Projekt kann aus Template erstellt sein |
| Projekt → Fachbereich | 1:N | Projekt enthaelt Fachbereiche (dupliziert oder manuell) |
| Fachbereich → Aufgabe | 1:N | Jeder Fachbereich enthaelt Aufgaben |
| Lehrmaterial → LP21 | N:M | Material ist mit LP21-Lernzielen verknuepft |

---

## 4. Template-zu-Projekt-Flow

### Erstellungs-Flow

```
Schritt 1: Lehrperson waehlt Template
─────────────────────────────────────
  Template "Gemueseflaeche" (tmpl-1)
    ├── Fachbereich-Vorl. "Beetplanung"
    │     ├── Aufgabe-Vorl. "Beetplan zeichnen"
    │     └── Aufgabe-Vorl. "Flaechenberechnung"
    ├── Fachbereich-Vorl. "Beetvorbereitung"
    │     ├── Aufgabe-Vorl. "Boden lockern"
    │     └── Aufgabe-Vorl. "pH-Wert testen"
    └── ...


Schritt 2: Projekt wird erstellt → Duplizierung
────────────────────────────────────────────────
  Projekt "Gemueseflaeche HE24a" (proj-1)
    ├── Fachbereich "Beetplanung"           ← dupliziert, fromTemplate: true
    │     ├── Aufgabe "Beetplan zeichnen"   ← dupliziert, fromTemplate: true
    │     └── Aufgabe "Flaechenberechnung"  ← dupliziert, fromTemplate: true
    ├── Fachbereich "Beetvorbereitung"      ← dupliziert, fromTemplate: true
    │     ├── Aufgabe "Boden lockern"       ← dupliziert, fromTemplate: true
    │     └── Aufgabe "pH-Wert testen"      ← dupliziert, fromTemplate: true
    └── ...


Schritt 3: Lehrperson ergaenzt im Projekt
──────────────────────────────────────────
  Projekt "Gemueseflaeche HE24a"
    ├── Fachbereich "Beetplanung"
    │     ├── Aufgabe "Beetplan zeichnen"    (aus Template)
    │     ├── Aufgabe "Flaechenberechnung"   (aus Template)
    │     └── Aufgabe "Mischkultur pruefen"  ← NEU (vom Lehrer)
    ├── Fachbereich "Beetvorbereitung"
    │     └── ...
    └── Fachbereich "Gartenjournal"          ← NEU (vom Lehrer)
          └── Aufgabe "Woechentlicher Eintrag" ← NEU
```

### Regeln fuer die Duplizierung

| Regel | Beschreibung |
|-------|-------------|
| **Vollstaendige Kopie** | Alle Fachbereich-Vorlagen und deren Aufgaben-Vorlagen werden in das Projekt kopiert |
| **Eigene IDs** | Duplizierte Entitaeten erhalten neue, projekt-spezifische IDs |
| **Herkunft markieren** | `fromTemplate: true` und `templateSourceId` zeigen, dass es aus Template stammt |
| **Material wird referenziert** | `materialIds[]` referenzieren den globalen Material-Pool -- Material wird NICHT dupliziert |
| **Unabhaengig nach Erstellung** | Aenderungen im Template wirken sich NICHT auf bestehende Projekte aus |
| **Erweiterbar** | Lehrer kann im Projekt neue Fachbereiche und Aufgaben hinzufuegen |

### Template-Erweiterung (Rueckweg)

Lehrpersonen koennen auch das Template erweitern:

```
Template "Gemueseflaeche"
  └── Lehrperson fuegt neue Aufgaben-Vorlage hinzu
      └── Wird zum Standard fuer NEUE Projekte aus diesem Template
          └── Bestehende Projekte bleiben unveraendert
```

---

## 5. Aufgaben-Konzept

### Was ist eine Aufgabe?

Eine **Aufgabe** ist eine konkrete, zuweisbare Taetigkeit mit klarem Ergebnis. Sie gehoert immer zu einem **Fachbereich** innerhalb eines **Projekts**.

### Aufgaben-Eigenschaften

| Eigenschaft | Beschreibung | Beispiel |
|-------------|-------------|---------|
| **Titel** | Kurze, aktive Beschreibung | "Beetplan massstabsgetreu zeichnen" |
| **Schritte** | Optionale Schritt-fuer-Schritt-Anleitung | ["Flaehe vermessen", "Auf Papier uebertragen", ...] |
| **Status** | Bearbeitungsstatus | Offen / In Bearbeitung / Erledigt |
| **Gruppe** | Zugewiesene Schuelergruppe | "Gruppe Sonnenblume" |
| **Faelligkeitsdatum** | Optionale Deadline | "2026-04-15" |
| **Material-Referenzen** | Verknuepftes Lehrmaterial | ["mat-4", "mat-8"] |
| **LP21-Referenzen** | Verknuepfte Lernziele | ["MA.2.A", "NMG.2.1"] |
| **Herkunft** | Aus Template oder manuell erstellt | `fromTemplate: true` |

### Aufgaben vs. bisherige Aktivitaeten

Die bisherigen `ActivityDefinition` (Beetplanung, Bewaessern, etc.) werden zu **Fachbereichen** (siehe Sektion 6). Was bisher `steps[]` in der ActivityDefinition war, wird zu einzelnen **Aufgaben** innerhalb des Fachbereichs.

**Vorher (unklar):**
```
ActivityDefinition "Beetvorbereitung"
  steps: ["Beete von Laub befreien", "Unkraut jaeten", "Boden lockern", ...]
  ← Was davon ist eine Aufgabe? Was ist nur ein Schritt?

Task "Boden vorbereiten"
  ← Ist das dasselbe wie die Activity? Ein Teil davon?
```

**Nachher (klar):**
```
Fachbereich "Beetvorbereitung" (Mrz–Apr, Phase: Pflanzung)
  ├── Aufgabe "Beete von Laub und Pflanzenresten befreien"
  ├── Aufgabe "Unkraut jaeten (Wurzeln entfernen)"
  ├── Aufgabe "Boden spatentief lockern"
  ├── Aufgabe "Boden-pH testen und dokumentieren"
  │     └── Material-Ref: "pH-Wert messen" (mat-2)
  ├── Aufgabe "Kompost verteilen und einarbeiten"
  └── Aufgabe "Beete mit Schnur und Pfloecken markieren"
```

---

## 6. Fachbereiche-Konzept

### Was ist ein Fachbereich?

Ein **Fachbereich** ist eine thematische Einheit innerhalb eines Projekts. Er buendelt zusammengehoerende Aufgaben, Material und Lernziele zu einem Thema. Er hat einen Zeitraum (wann im Jahr relevant) und gehoert zu einer Projektphase.

### Wichtige Abgrenzung

| Bisher | Neu |
|--------|-----|
| `SubjectArea` = flaches Kategorie-Label ("Boden", "Oekologie") fuer Material | **Entfaellt als eigene Navigation** -- wird zu `tag` auf Material |
| `ActivityDefinition` = Jahreszyklus-Aktivitaet mit Steps und Material | **Wird zum Fachbereich** (Topic) im Projekt/Template |
| `SubjectInfo` = Info-Karte in `/teacher/subjects` | **Entfaellt** -- Fachbereiche leben im Projektkontext |
| `SubjectAreaTemplate` = Lernpfad (nie implementiert) | **Entfaellt** -- Aufgaben innerhalb Fachbereich decken das ab |

### Fachbereich-Eigenschaften

| Eigenschaft | Beschreibung | Beispiel |
|-------------|-------------|---------|
| **Name** | Thematischer Titel | "Beetplanung", "Kulturschutz", "Ernte" |
| **Phase** | Zugehoerige Projektphase | Planung / Pflanzung / Pflege / Ernte |
| **Zeitraum** | Start- und Endmonat | Januar–Februar |
| **Lernziel** | Beschreibung des Lern- und Praxisziels | "Die Schueler planen gemeinsam..." |
| **Materialliste** | Physisches Material fuer die Aktivitaet | Spaten, Kompost, pH-Teststreifen |
| **LP21-Referenzen** | Uebergeordnete Lernziele des Fachbereichs | ["NMG.2.3", "NMG.2.6"] |
| **Tutorial-Video** | Optionales Erklaervideo | "/videos/beetvorbereitung.mp4" |
| **Icon / Farbe** | Visuelle Zuordnung im Zeitstrahl | Icon: Pflanze, Farbe: Gruen |

### Fachbereiche des Projekts "Gemueseflaeche"

| # | Fachbereich | Phase | Zeitraum | LP21-Bezug |
|---|-------------|-------|----------|------------|
| 1 | Beetplanung | Planung | Jan–Feb | NMG.2.1, MA.2.A |
| 2 | Beetvorbereitung | Pflanzung | Mrz–Apr | NMG.2.3 |
| 3 | Jungpflanzen anziehen | Pflanzung | Feb–Apr | NMG.2.1, NMG.2.2 |
| 4 | Aussaeen / Auspflanzen | Pflanzung | Apr–Mai | NMG.2.1, NMG.2.2 |
| 5 | Kulturschutz | Pflege | Mai–Sep | NMG.2.1, NMG.2.6 |
| 6 | Duengen | Pflege | Mai–Aug | NMG.2.3 |
| 7 | Jaeten | Pflege | Mai–Sep | NMG.2.1 |
| 8 | Bewaessern | Pflege | Mai–Sep | NMG.2.3, NMG.2.6 |
| 9 | Ernte | Ernte | Jul–Okt | NMG.2.2, MA.3.A |

### Darstellung in der UI

Fachbereiche werden innerhalb des Projekts als Accordion angezeigt, gruppiert nach Phase:

```
Projekt "Gemueseflaeche HE24a"
│
├── Zeitstrahl (Hero-Element mit Gantt-Chart)
│
├── PLANUNG ──────────────────────────────────
│   └── ▸ Beetplanung                Jan–Feb
│         ├── Aufgabe 1: Flaehe vermessen    [Erledigt]
│         ├── Aufgabe 2: Beetplan zeichnen   [Erledigt]
│         └── Aufgabe 3: Pflanzpartner       [Offen]
│
├── PFLANZUNG ────────────────────────────────
│   ├── ▸ Beetvorbereitung           Mrz–Apr
│   ├── ▸ Jungpflanzen anziehen      Feb–Apr
│   └── ▸ Aussaeen / Auspflanzen     Apr–Mai
│
├── PFLEGE ───────────────────────────────────
│   ├── ▸ Kulturschutz               Mai–Sep
│   ├── ▸ Duengen                    Mai–Aug
│   ├── ▸ Jaeten                     Mai–Sep
│   └── ▸ Bewaessern                 Mai–Sep
│
└── ERNTE ────────────────────────────────────
    └── ▸ Ernte                      Jul–Okt
```

---

## 7. Lehrmaterial-Konzept

### Was ist Lehrmaterial?

Lehrmaterial ist **downloadbares Unterrichtsmaterial** (Arbeitsblaetter, Anleitungen, Videos). Es lebt in einem **globalen Pool** und wird von Aufgaben **referenziert**.

### Abgrenzung: Lehrmaterial vs. physisches Material

| | Lehrmaterial | Physisches Material |
|---|-------------|-------------------|
| **Was** | Digitale Dateien (PDF, DOCX, Video) | Gegenstaende (Spaten, Saatgut, Erde) |
| **Wo** | Globaler Pool, downloadbar | In `materialList[]` des Fachbereichs |
| **Verknuepfung** | Ueber `materialIds[]` in Aufgaben referenziert | Direkt im Fachbereich gespeichert |
| **LP21** | Hat LP21-Referenzen (Download trackt Fortschritt) | Kein LP21-Bezug |
| **Beispiel** | "Bodentypen bestimmen" (PDF) | "Spaten, 4-6 Stueck" |

### Lehrmaterial-Eigenschaften (bereinigt)

| Eigenschaft | Beschreibung |
|-------------|-------------|
| **id** | Eindeutiger Bezeichner |
| **title** | Titel des Materials |
| **description** | Inhaltsbeschreibung |
| **formats** | Verfuegbare Formate (PDF, DOCX, Video, Audio, Link) |
| **gradeRange** | Zielstufe ("1-2", "3-6") |
| **difficulty** | Schwierigkeitsgrad |
| **lp21Refs** | LP21-Lernziele (werden bei Download als behandelt markiert) |
| **tags** | Thematische Tags zur Filterung (ersetzt `subjectArea`) |

### Aenderung: `subjectArea` → `tags[]`

Bisher hatte jedes Material genau einen `subjectArea` (z.B. "Boden"). Das war zu einschraenkend:

- "Bodentypen bestimmen" gehoert zu "Boden" UND "Beetvorbereitung"
- "Flaechenberechnung im Garten" gehoert zu "Mathematik" UND "Beetplanung"

**Neu:** Material hat `tags: string[]` fuer flexible Zuordnung:

```typescript
{
  id: 'mat-1',
  title: 'Bodentypen bestimmen',
  tags: ['Boden', 'Beetvorbereitung', 'Planung'],
  // statt: subjectArea: 'Boden'
}
```

### Verknuepfung zum Aufgaben-Kontext

```
Aufgabe "Boden-pH testen und dokumentieren"
  └── materialIds: ['mat-2']
      └── Material "pH-Wert messen" (PDF)
          └── lp21Refs: ['NMG.2.3']
              └── Download → NMG.2.3 als "behandelt" markiert
```

Material wird **immer im Kontext einer Aufgabe** heruntergeladen. Dadurch ist klar:
- Welches Projekt betroffen ist
- Welcher Fachbereich betroffen ist
- Welche LP21-Ziele getrackt werden

### Material-Zugang: Wo findet die Lehrperson Material?

1. **Im Projekt** → Fachbereich aufklappen → Aufgabe → verknuepftes Material
2. **Im Material-Pool** → Alle Materialien durchsuchen, filtern, downloaden
3. **Im Template** → Vorschau welches Material verknuepft ist

---

## 8. Navigation: Neue Struktur

### Probleme der bisherigen Navigation

Die bisherige Sidebar hatte 10 Eintraege, von denen einige redundant oder unklar waren:

| Bisheriger Eintrag | Problem |
|--------------------|---------|
| Fachbereiche | Zeigt nur Kategorie-Karten ohne Tiefe, kein Projektbezug |
| Lehrmaterial | Eigenstaendige Seite, aber Material wird im Projektkontext gebraucht |
| Templates | Wird selten gebraucht, koennte in Projekte integriert werden |
| Lehrplan 21 | Wichtig, aber koennte ins Dashboard integriert werden |

### Neue Navigation (7 statt 10 Eintraege)

```
┌─────────────────────────────────────────────────────┐
│  SIDEBAR (neu)                                      │
│                                                     │
│  ┌─ Hauptbereich ─────────────────────────────────┐ │
│  │                                                 │ │
│  │  1. Dashboard        (LayoutDashboard)          │ │
│  │     Uebersicht, LP21-Fortschritt, naechste      │ │
│  │     Aufgaben, saisonale Hinweise                │ │
│  │                                                 │ │
│  │  2. Projekte         (FolderKanban)             │ │
│  │     Projektliste, Projektdetail mit             │ │
│  │     Fachbereichen, Aufgaben, Kulturen,          │ │
│  │     Gruppen, Vorprojekt                         │ │
│  │                                                 │ │
│  │  3. Material         (FileDown)                 │ │
│  │     Globaler Material-Pool mit                  │ │
│  │     Tag-Filter, LP21-Filter, Download           │ │
│  │                                                 │ │
│  │  4. Schueler         (Users)                    │ │
│  │     Schueler- und Gruppenverwaltung             │ │
│  │                                                 │ │
│  │  5. Kalender         (CalendarDays)             │ │
│  │     Termine, Deadlines, saisonale Hinweise,     │ │
│  │     Harvest-Maerkte                             │ │
│  │                                                 │ │
│  └─────────────────────────────────────────────────┘ │
│                                                     │
│  ┌─ Sekundaer ────────────────────────────────────┐ │
│  │                                                 │ │
│  │  6. Hilfe            (HelpCircle)               │ │
│  │  7. Einstellungen    (Settings)                 │ │
│  │                                                 │ │
│  └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

### Was wurde zusammengefuehrt / entfernt

| Bisherig | Neu | Begruendung |
|----------|-----|-------------|
| **Fachbereiche** (eigene Seite) | Entfaellt | Fachbereiche leben jetzt IM Projekt |
| **Lehrmaterial** | → **Material** | Vereinfachter Name, gleiche Funktion |
| **Templates** | → In **Projekte** integriert | Beim Erstellen eines neuen Projekts waehlt man ein Template. Eigene Templates koennen ueber Projektdetail oder Einstellungen verwaltet werden |
| **Lehrplan 21** | → In **Dashboard** integriert | LP21-Fortschritt als prominente Karte auf dem Dashboard. Detail-View als Modal oder Unterseite |
| **Harvest-Maerkte** | → In **Kalender** integriert | Maerkte sind Termine. Anmeldung und Details ueber den Kalender-Eintrag erreichbar |

### Neue Routen-Struktur

```
/teacher
  │
  ├── /teacher                           Dashboard
  │     └── LP21-Fortschritt (Karte → Modal/Detail)
  │
  ├── /teacher/projects                   Projektliste
  │     ├── /teacher/projects/new         Neues Projekt (Template-Auswahl)
  │     └── /teacher/projects/:id         Projektdetail
  │           ├── Tab: Fachbereiche       Accordion nach Phase, mit Aufgaben
  │           ├── Tab: Kulturen           Gemuese-Grid mit Steckbriefen
  │           ├── Tab: Gruppen            Schuelergruppen
  │           └── Tab: Vorprojekt         Checkliste
  │
  ├── /teacher/materials                  Material-Pool
  │     └── Filter: Tags, Stufe, Format, LP21-Code
  │
  ├── /teacher/students                   Schueler & Gruppen
  │
  ├── /teacher/calendar                   Kalender
  │     └── Inkl. Harvest-Maerkte als Eintraege
  │
  ├── /teacher/help                       Hilfe
  └── /teacher/settings                   Einstellungen
        └── Inkl. Template-Verwaltung (eigene/geteilte)
```

### Vergleich: Alt vs. Neu

```
ALT (10 Eintraege)              NEU (7 Eintraege)
──────────────────              ──────────────────
Dashboard                  →    Dashboard (+ LP21-Karte)
Projekte                   →    Projekte (+ Fachbereiche als Tabs)
Fachbereiche               ✕    (in Projekte integriert)
Lehrmaterial               →    Material
Schueler                   →    Schueler
Templates                  ✕    (in Projekte/Einstellungen integriert)
Lehrplan 21                ✕    (in Dashboard integriert)
Kalender                   →    Kalender (+ Harvest-Maerkte)
Harvest-Maerkte            ✕    (in Kalender integriert)
Einstellungen              →    Einstellungen (+ Templates)
                                Hilfe (neu in Sidebar)
```

---

## 9. Datenmodell: Bereinigte Interfaces

### Entfallende Interfaces

| Interface | Ersetzt durch | Begruendung |
|-----------|--------------|-------------|
| `ActivityDefinition` | `Topic` / `TopicTemplate` | Aktivitaeten werden zu Fachbereichen |
| `SubjectArea` (Type) | `string` (Tags) | Wird zu flexiblen Tags auf Material |
| `SubjectInfo` | Entfaellt | Keine eigene Fachbereich-Seite mehr |
| `SubjectAreaTemplate` | `TopicTemplate` | Nie implementiert, Konzept geht in TopicTemplate auf |
| `SubjectLearningItem` | `TaskTemplate` | Aufgaben innerhalb eines Fachbereichs |

### Neue / Ueberarbeitete Interfaces

```typescript
// ============================================================
// FACHBEREICH im Projekt-Template
// ============================================================
interface TopicTemplate {
  id: string
  templateId: string            // Zugehoeriges Projekt-Template
  name: string                  // "Beetplanung", "Kulturschutz"
  phase: ProjectPhase           // Planung / Pflanzung / Pflege / Ernte
  startMonth: number            // 1-basiert (1=Jan)
  endMonth: number
  icon: string                  // Emoji oder Lucide-Icon-Name
  color: string                 // Tailwind-Klasse (fuer Gantt-Chart)
  goalDescription: string       // Lern- und Praxisziel
  physicalMaterials: TaskMaterial[]  // Physisches Material (Spaten, Erde...)
  lp21Refs: string[]            // Uebergeordnete LP21-Referenzen
  tutorialVideoUrl?: string
  order: number                 // Sortierung innerhalb des Templates
}

// ============================================================
// FACHBEREICH im Projekt (dupliziert aus Template oder manuell)
// ============================================================
interface Topic {
  id: string
  projectId: string             // Zugehoeriges Projekt
  name: string
  phase: ProjectPhase
  startMonth: number
  endMonth: number
  icon: string
  color: string
  goalDescription: string
  physicalMaterials: TaskMaterial[]
  lp21Refs: string[]
  tutorialVideoUrl?: string
  order: number
  fromTemplate: boolean         // Stammt aus Template-Duplizierung?
  templateSourceId?: string     // Original-TopicTemplate-ID
}

// ============================================================
// AUFGABEN-VORLAGE im Template (ueberarbeitet)
// ============================================================
interface TaskTemplate {
  id: string
  templateId: string            // Zugehoeriges Projekt-Template
  topicTemplateId: string       // Zugehoeriger Fachbereich  ← NEU
  title: string
  description?: string
  steps?: string[]              // Optionale Schritt-fuer-Schritt-Anleitung
  difficulty?: Difficulty
  lp21Refs: string[]
  materialIds: string[]         // Referenzen auf globales Lehrmaterial  ← NEU
  estimatedEffort?: string
  order: number
}

// ============================================================
// AUFGABE im Projekt (ueberarbeitet)
// ============================================================
interface Task {
  id: string
  projectId: string
  topicId: string               // Zugehoeriger Fachbereich  ← NEU
  title: string
  description?: string
  steps?: string[]
  status: TaskStatus            // Offen / In Bearbeitung / Erledigt
  groupId?: string
  groupName?: string
  dueDate?: string
  lp21Refs: string[]
  materialIds: string[]         // Referenzen auf globales Lehrmaterial  ← NEU
  fromTemplate: boolean         // Stammt aus Template-Duplizierung?  ← NEU
  templateSourceId?: string     // Original-TaskTemplate-ID  ← NEU
  isHolidayTask?: boolean
  emailReminder?: boolean
}

// ============================================================
// LEHRMATERIAL (bereinigt)
// ============================================================
interface Material {
  id: string
  title: string
  description?: string
  formats: MaterialFormat[]     // PDF, DOCX, Video, Audio, Link
  gradeRange: string            // "1-2", "3-6", "5-6"
  difficulty: Difficulty
  lp21Refs: string[]
  tags: string[]                // Flexible thematische Tags  ← NEU (ersetzt subjectArea)
  lastDownloaded?: string
  fileUrl?: string
  linkUrl?: string
  videoUrl?: string
  audioUrl?: string
}

// ============================================================
// PROJEKT-TEMPLATE (ueberarbeitet)
// ============================================================
interface ProjectTemplate {
  id: string
  name: string
  description: string
  category: TemplateCategory
  difficulty: Difficulty
  gradeRange: string
  estimatedDuration: string
  lp21Refs: string[]
  lp21Coverage: number
  createdBy: string
  shared: boolean
  usedBySchools: number
  version: number
  isOwn: boolean
  isPlatform: boolean
  topics: TopicTemplate[]        // Fachbereich-Vorlagen  ← NEU (ersetzt tasks)
  materials?: TemplateMaterial[] // Physische Materialien fuer Beschaffung
}

// ============================================================
// PROJEKT (ueberarbeitet)
// ============================================================
interface Project {
  id: string
  templateId?: string
  schoolId: string
  classId: string
  name: string
  description: string
  area?: number
  status: ProjectStatus
  currentPhase: ProjectPhase
  progress: number
  location?: string
  startDate?: string
  // taskCount / tasksDone entfernt → wird dynamisch aus Topics/Tasks berechnet
  // groupCount entfernt → wird dynamisch berechnet
}
```

### Entfernte Felder aus `Task`

| Entferntes Feld | Begruendung |
|-----------------|-------------|
| `phase` | Wird vom zugehoerigen Topic geerbt |
| `subjectAreaId` | Entfaellt — Topic IST der Fachbereich |
| `taskTemplateId` | Ersetzt durch `templateSourceId` |
| `season` | Wird vom zugehoerigen Topic geerbt (startMonth/endMonth) |
| `tutorialVideoUrl` | Gehoert zum Topic, nicht zur Aufgabe |
| `materialList` | Physisches Material gehoert zum Topic |
| `goalDescription` | Gehoert zum Topic |
| `worksheetIds` | Ersetzt durch `materialIds` (konsistenter Name) |
| `classId` | Kommt vom Projekt |

### Entfernte Felder aus `Project`

| Entferntes Feld | Begruendung |
|-----------------|-------------|
| `taskCount` | Wird dynamisch berechnet: `topics.flatMap(t => t.tasks).length` |
| `tasksDone` | Wird dynamisch berechnet: Filter auf `status === 'Erledigt'` |
| `groupCount` | Wird dynamisch berechnet aus `studentGroups.length` |

---

## 10. Migrations-Uebersicht

### Zusammenfassung der Aenderungen

```
ENTFAELLT                    WIRD ZU                      BLEIBT
─────────                    ────────                     ──────
ActivityDefinition      →    TopicTemplate / Topic        Project
SubjectArea (Type)      →    string (Tags)                Culture
SubjectInfo             →    (entfaellt)                  Student / StudentGroup
SubjectAreaTemplate     →    TopicTemplate                PreProject
SubjectLearningItem     →    TaskTemplate                 Curriculum / CurriculumProgress
                                                          CalendarEntry
                                                          Notification
                                                          VegetableProfile
                                                          HarvestMarket (wird CalendarEntry)
```

### Betroffene Dateien

| Datei | Aenderung |
|-------|-----------|
| `src/types/index.ts` | Neue Interfaces (Topic, TopicTemplate), bereinigtes Task/Material/Project |
| `src/data/fixtures/activities.ts` | → Wird zu `fixtures/topics.ts` (TopicTemplate-Daten) |
| `src/data/fixtures/subjects.ts` | → Entfaellt |
| `src/data/fixtures/templates.ts` | TaskTemplates erhalten `topicTemplateId`, Template erhaelt `topics[]` |
| `src/data/fixtures/tasks.ts` | Tasks erhalten `topicId`, entfernt ueberfluessige Felder |
| `src/data/fixtures/materials.ts` | `subjectArea` → `tags[]` |
| `src/stores/projects.ts` | Topics und Tasks statt nur Tasks |
| `src/stores/materials.ts` | Filter nach Tags statt SubjectArea |
| `src/pages/teacher/subjects/` | → Entfaellt (Seiten loeschen) |
| `src/pages/teacher/projects/[id].vue` | Neues Tab "Fachbereiche" statt "Aufgaben" |
| `src/pages/teacher/materials/` | Filter-Anpassung auf Tags |
| `src/pages/teacher/markets/` | → In Kalender integriert |
| `src/pages/teacher/curriculum/` | → In Dashboard integriert |
| `src/pages/teacher/templates/` | → In Projekte/Einstellungen integriert |
| `src/layouts/teacher.vue` | Navigation von 10 auf 7 Eintraege reduziert |

### Schritt-fuer-Schritt Migrations-Plan

| # | Schritt | Abhaengigkeit |
|---|---------|--------------|
| 1 | Neue Interfaces in `types/index.ts` definieren (Topic, TopicTemplate) | — |
| 2 | `fixtures/activities.ts` → `fixtures/topics.ts` migrieren | Schritt 1 |
| 3 | `fixtures/templates.ts` anpassen: Topics statt Tasks auf Top-Level | Schritt 1, 2 |
| 4 | `fixtures/tasks.ts` anpassen: `topicId` statt `phase`, entfernte Felder | Schritt 1, 2 |
| 5 | `fixtures/materials.ts` anpassen: `tags[]` statt `subjectArea` | Schritt 1 |
| 6 | `fixtures/subjects.ts` entfernen | Schritt 5 |
| 7 | `stores/projects.ts` ueberarbeiten: Topics + Tasks laden und verwalten | Schritt 2, 3, 4 |
| 8 | `stores/materials.ts` ueberarbeiten: Filter nach Tags | Schritt 5 |
| 9 | Sidebar-Navigation in `layouts/teacher.vue` anpassen (7 Eintraege) | — |
| 10 | `/teacher/subjects/` Seiten entfernen | Schritt 9 |
| 11 | `/teacher/projects/[id].vue` ueberarbeiten: Fachbereich-Tab | Schritt 7 |
| 12 | `/teacher/materials/` ueberarbeiten: Tag-Filter | Schritt 8 |
| 13 | LP21-Karte ins Dashboard integrieren, `/teacher/curriculum/` vereinfachen | Schritt 7 |
| 14 | Harvest-Maerkte in Kalender integrieren, `/teacher/markets/` vereinfachen | — |
| 15 | Template-Verwaltung in Einstellungen oder Projekt-Erstellungs-Flow integrieren | Schritt 3 |

---

## Anhang: Glossar

| Begriff | Definition |
|---------|-----------|
| **Fachbereich** (Topic) | Thematische Einheit innerhalb eines Projekts (z.B. "Beetplanung", "Kulturschutz") |
| **Fachbereich-Vorlage** (TopicTemplate) | Fachbereich innerhalb eines Projekt-Templates -- wird bei Projekterstellung dupliziert |
| **Aufgabe** (Task) | Konkrete, zuweisbare Taetigkeit innerhalb eines Fachbereichs |
| **Aufgaben-Vorlage** (TaskTemplate) | Aufgabe innerhalb eines Fachbereich-Templates -- wird bei Projekterstellung dupliziert |
| **Lehrmaterial** (Material) | Downloadbares Unterrichtsmaterial (PDF, DOCX, Video) im globalen Pool |
| **Physisches Material** (TaskMaterial) | Gegenstaende fuer die Gartenarbeit (Spaten, Erde, Saatgut) -- gehoert zum Fachbereich |
| **Projekt-Template** (ProjectTemplate) | Wiederverwendbare Blaupause mit Fachbereich-Vorlagen und Aufgaben-Vorlagen |
| **Projekt** (Project) | Konkretes Klassen-Projekt mit duplizierten Fachbereichen und Aufgaben |
| **Tags** | Flexible thematische Labels auf Lehrmaterial (ersetzt fixen SubjectArea-Typ) |
