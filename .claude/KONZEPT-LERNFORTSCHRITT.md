# Konzept: Lernfortschritt & LP21-Integration

> Plantoria Teacher-View -- Verbesserung der Seite "Lehrplan 21"
> Stand: 07.02.2026 | Status: Entwurf

---

## Inhaltsverzeichnis

1. [Uebersicht & Ziel](#1-uebersicht--ziel)
2. [IST-Analyse](#2-ist-analyse)
3. [Neue Tab-Struktur (SOLL)](#3-neue-tab-struktur-soll)
4. [Feature-Liste](#4-feature-liste)
5. [Wireframes (ASCII)](#5-wireframes-ascii)
6. [Datenfluss & Store-Aenderungen](#6-datenfluss--store-aenderungen)
7. [Implementierungsplan](#7-implementierungsplan)
8. [Offene Fragen](#8-offene-fragen)

---

## 1. Uebersicht & Ziel

### Problem

Die aktuelle Seite "Lehrplan 21" (`/teacher/curriculum`) bietet nur eine statische Uebersicht
der LP21-Kompetenzen mit einfachen Fortschrittsbalken. Es besteht **keine lebendige Verbindung**
zwischen den tatsaechlichen Projektaktivitaeten (Aufgaben, Materialien) und den LP21-Lernzielen.

Konkret:

| Problem                           | Auswirkung                                                 |
| --------------------------------- | ---------------------------------------------------------- |
| "Nach Projekt"-Tab ist hardcoded  | Nur ein Projekt ("Gemuesflaeche HE24a") fest verdrahtet    |
| Keine Task-Level-Transparenz      | Unklar, welche Aufgabe welches LP21-Ziel abdeckt           |
| `markTopicTreated()` nie gerufen  | Aufgaben-Abschluss aktualisiert LP21-Fortschritt nicht     |
| `lp21Refs` auf Tasks unsichtbar   | Tasks tragen LP21-Codes, zeigen sie aber nirgends an       |
| Keine Visualisierungen            | Nur Fortschrittsbalken -- keine Radar-Charts, Heatmaps     |
| Keine Lueckenanalyse              | Lehrperson sieht nicht, welche LP21-Ziele gar nicht geplant sind |

### Ziel

Eine **umfassende, datengetriebene LP21-Seite**, die:

1. **Volle Rueckverfolgbarkeit** bietet: LP21-Ziel --> Projekt --> Fachbereich --> Aufgabe --> Material
2. **Visuelle Dashboards** bereitstellt: Radar-Chart, Heatmap, Projekt-Matrix
3. **Automatische Verknuepfung** herstellt: Aufgaben-Abschluss aktualisiert LP21-Fortschritt
4. **Luecken aufzeigt**: Welche LP21-Ziele werden durch kein Projekt abgedeckt?
5. **Alles auf einer Seite** mit verbesserter Tab-Struktur zusammenfasst

### Erfolgskriterien

- Lehrperson kann in max. 3 Klicks von einem LP21-Ziel zur ausfuehrenden Aufgabe navigieren
- Dashboard-Visualisierungen laden in unter 200ms (rein Client-seitig, Fixture-Daten)
- Alle bestehenden Features der aktuellen Seite bleiben erhalten
- Kein Breaking Change an bestehenden Typen oder Stores

---

## 2. IST-Analyse

### 2.1 Aktuelle Seitenstruktur

```
/teacher/curriculum/index.vue
  |
  +-- Gesamtfortschritt (UCard + ProgressBar)
  |     45% -- 4/10 Themen behandelt
  |
  +-- 3 Tabs:
       |
       +-- "Nach Fachbereich"
       |     Fuer jeden Curriculum-Eintrag (NMG, MA, TTG, WAH):
       |       - Fortschrittsbalken pro Fachbereich
       |       - Liste der CurriculumTopics mit Checkbox (disabled)
       |       - Badge: "Behandelt" / "Offen"
       |       - Zeigt treatedByDownload + treatedByProject (Text)
       |
       +-- "Nach Projekt"
       |     HARDCODED: Ein einziges UCard fuer "Gemuesflaeche HE24a"
       |     Filtert CurriculumTopics mit treatedByProject === 'Gemuesflaeche HE24a'
       |
       +-- "Chronologisch"
             Sortierte Liste behandelter Topics nach treatedDate
```

### 2.2 Relevantes Datenmodell (bestehend)

```
CurriculumTopic
  .code           = "NMG.2.1"
  .treated        = true/false
  .treatedDate    = "2026-05-08"
  .treatedByDownload = "Bodentypen bestimmen"   <-- Material-Titel
  .treatedByProject  = "Gemuesflaeche HE24a"    <-- Projekt-Name

Task (im Projekt-Kontext)
  .lp21Refs       = ["MA.2.A"]                  <-- LP21-Codes auf Task-Ebene
  .materialIds    = ["mat-4"]                    <-- Verknuepfte Materialien
  .status         = "Erledigt" / "Offen"
  .projectId      = "proj-1"
  .topicId        = "topic-1"                    <-- Fachbereich im Projekt

Topic (Fachbereich im Projekt)
  .lp21Refs       = ["NMG.2.1", "MA.2.A"]       <-- LP21-Codes auf Fachbereich-Ebene
  .projectId      = "proj-1"

Material
  .lp21Refs       = ["NMG.2.1.a", "NMG.2.3"]    <-- LP21-Codes auf Material-Ebene
```

### 2.3 LP21-Abdeckung in Fixture-Daten

| LP21-Code | Titel                            | Status    | Referenziert durch Tasks          |
| --------- | -------------------------------- | --------- | --------------------------------- |
| NMG.2.1   | Tiere und Pflanzen               | Behandelt | t-3, t-6, t-7, t-13, t-17        |
| NMG.2.2   | Wachstum, Entwicklung            | Offen     | t-6, t-14                         |
| NMG.2.3   | Stoffe, Energie, Bewegung        | Behandelt | t-5, t-9                          |
| NMG.2.4   | Sinne und Koerper                | Offen     | (nur Material mat-12, mat-14)     |
| NMG.2.6   | Natuerliche Umwelt               | Behandelt | t-10                              |
| MA.2.A    | Laengen, Flaechen, Volumen       | Behandelt | t-1, t-2                          |
| MA.3.A    | Daten und Zufall                 | Offen     | t-15                              |
| TTG.2     | Verfahren                        | Offen     | (nur Material mat-13)             |
| WAH.1     | Produktions- und Arbeitswelten   | Offen     | (nur TopicTemplate Vermarktung)   |
| WAH.3     | Konsum gestalten                 | Offen     | (nur TopicTemplate Verarbeitung)  |

**Erkenntnis:** NMG.2.2 ist als "Offen" markiert, obwohl Task t-6 (Erledigt) den Ref traegt.
Dies bestaetigt, dass `markTopicTreated()` nie automatisch aufgerufen wird.

---

## 3. Neue Tab-Struktur (SOLL)

Die Seite behaelt **einen Menu-Eintrag** ("Lehrplan 21") und erhaelt **5 Tabs**:

```
+-------------+------------------+------------------+--------------+-----------+
|  Dashboard  |  Projekt-Matrix  |  Nach Fachbereich |  Zeitverlauf |  Export   |
+-------------+------------------+------------------+--------------+-----------+
```

### Tab 1: Dashboard (NEU)

**Zweck:** Visuelle Gesamtuebersicht fuer schnelle Orientierung.

Inhalte:
- **Gesamtfortschritt** (bestehendes UCard, verschoben)
- **Radar-Chart** -- Fachbereich-Balance (NMG, MA, TTG, WAH als Achsen)
- **Heatmap** -- Zeitlicher Verlauf der LP21-Abdeckung (Monate x Fachbereiche)
- **Kennzahlen-Kacheln** -- 4 Karten: Behandelt, Offen, Geplant (durch Tasks abgedeckt), Luecken

### Tab 2: Projekt-Matrix (NEU)

**Zweck:** Welches Projekt deckt welche LP21-Ziele ab?

Inhalte:
- **Matrix-Tabelle**: Zeilen = Projekte, Spalten = LP21-Codes
- Zellen zeigen Status: Erledigt (gruen), Geplant (gelb), Leer (grau)
- **Klick auf Zelle**: Drill-down zu den konkreten Aufgaben
- Aggregation: Anzahl abgedeckter Ziele pro Projekt

### Tab 3: Nach Fachbereich (VERBESSERT)

**Zweck:** Detailansicht pro LP21-Kompetenz mit voller Rueckverfolgbarkeit.

Verbesserungen gegenueber IST:
- **Drill-down**: LP21-Ziel --> zugehoerige Projekte --> Fachbereiche --> Aufgaben --> Materialien
- **Task-Badges**: Zeigt konkret welche Tasks (mit Status) dieses Ziel abdecken
- **Material-Links**: Verknuepfte Materialien direkt sichtbar
- **"Nur via Material"**-Indikator: Wenn ein LP21-Ziel nur durch Material (nicht Task) abgedeckt wird

### Tab 4: Zeitverlauf (VERBESSERT)

**Zweck:** Wann wurden LP21-Ziele erreicht? Monatliche Aggregation.

Verbesserungen gegenueber "Chronologisch":
- **Monatsweise Gruppierung** statt flacher Liste
- **Kumulativer Fortschrittsbalken** pro Monat
- **Projektbezug** pro Eintrag (welches Projekt, welche Aufgabe)
- **Zukunfts-Projektion**: Geplante Aufgaben mit LP21-Refs als "Erwartet" anzeigen

### Tab 5: Export (BEHALTEN)

**Zweck:** Berichte fuer Schulleitung, Eltern, Dokumentation.

Verbesserungen:
- Neue Visualisierungen (Radar-Chart, Heatmap) im Export enthalten
- Zusaetzliche Option: "Projekt-Matrix einschliessen"
- Zusaetzliche Option: "Lueckenanalyse einschliessen"

---

## 4. Feature-Liste

### P1 -- Kernfunktionen

| ID  | Feature                         | Beschreibung                                                                                   | Abhaengigkeit |
| --- | ------------------------------- | ---------------------------------------------------------------------------------------------- | ------------- |
| F1  | Radar-Chart Fachbereich-Balance | SVG-basiertes Spinnendiagramm: Jeder Fachbereich (NMG, MA, TTG, WAH) als Achse. Wert = Abdeckungs-% pro Fachbereich. Ideal-Linie (100%) als Referenz, aktuelle Abdeckung als gefuellte Flaeche. | -- |
| F2  | Projekt-LP21-Matrix             | Tabelle: Projekte (Zeilen) x LP21-Codes (Spalten). Jede Zelle zeigt aggregierten Status (Erledigt/Geplant/Leer) basierend auf Tasks mit entsprechenden lp21Refs. Klick auf Zelle oeffnet Detail-Panel mit beteiligten Tasks und Materialien. | F4 |
| F3  | Task-Level-Traceability         | Im Tab "Nach Fachbereich": Jedes LP21-Ziel ist aufklappbar. Darunter erscheinen alle Projekte, die Tasks mit diesem LP21-Code haben. Pro Projekt: Liste der Tasks (mit Status-Badge), zugehoerige Materialien, und Fachbereich-Kontext. | F4 |
| F4  | Automatische LP21-Verknuepfung  | Wenn `toggleTask()` im ProjectsStore eine Aufgabe auf "Erledigt" setzt, werden die `lp21Refs` der Aufgabe geprueft und der CurriculumStore wird automatisch aktualisiert. Umgekehrt: Wird eine Aufgabe auf "Offen" zurueckgesetzt, wird der LP21-Status nur zurueckgesetzt, wenn keine andere erledigte Aufgabe denselben Code referenziert. | -- |
| F5  | Heatmap / Zeitlicher Verlauf    | Grid-Visualisierung: X-Achse = Monate (Aug-Jul Schuljahr), Y-Achse = Fachbereiche. Zellen-Farbe zeigt Intensitaet (Anzahl abgeschlossener LP21-Ziele in diesem Monat/Fachbereich). Basiert auf treatedDate der CurriculumTopics. | F4 |
| F6  | LP21-Badges in Projektansicht   | In `/teacher/projects/[id].vue` bei jeder Aufgabe: Neben dem Aufgabentitel werden die lp21Refs als kleine UBadge-Elemente angezeigt (z.B. "MA.2.A"). Bereits auf Topic-Ebene vorhanden (siehe LP21-Refs-Sektion), neu auch auf Task-Ebene. | -- |

### P2 -- Erweiterte Features

| ID  | Feature                         | Beschreibung                                                                                   | Abhaengigkeit |
| --- | ------------------------------- | ---------------------------------------------------------------------------------------------- | ------------- |
| F7  | LP21-Lueckenanalyse             | Dashboard-Kachel + eigene Sektion: Zeigt LP21-Ziele, die durch **kein** Projekt-Task und kein Material abgedeckt werden. Unterscheidung: "Nie referenziert" (kritisch) vs. "Referenziert aber nicht erledigt" (geplant). Empfehlung: "Fuer dieses Ziel gibt es X Materialien und Y Templates." | F4 |
| F8  | Vergleich mit Jahresziel        | Lehrperson setzt pro Semester ein Ziel (z.B. "60% NMG bis Ende 1. Semester"). Neue Felder im CurriculumProgress-Typ. Dashboard zeigt IST vs. SOLL pro Fachbereich. Gruen/Gelb/Rot-Ampel. | F1 |
| F9  | Drill-down aus Visualisierungen | Klick auf Radar-Chart-Segment oeffnet "Nach Fachbereich"-Tab mit Vorfilterung auf diesen Fachbereich. Klick auf Heatmap-Zelle oeffnet "Zeitverlauf"-Tab mit Scroll zu diesem Monat. | F1, F5 |
| F10 | Filter nach Kompetenz-Stufe     | Dropdown-Filter "Zyklus": Alle / Zyklus 1 (1-2) / Zyklus 2 (3-6). Filtert CurriculumTopics nach gradeRange. Relevant fuer Mehrklassen-Schulen. | -- |

### P3 -- Nice-to-have

| ID  | Feature                         | Beschreibung                                                                                   | Abhaengigkeit |
| --- | ------------------------------- | ---------------------------------------------------------------------------------------------- | ------------- |
| F11 | LP21-Vorschlaege                | Bei Luecken (F7): System schlaegt konkrete Materialien und Templates vor, die den fehlenden LP21-Code referenzieren. Basiert auf `lp21Refs` in Material- und Template-Daten. | F7 |
| F12 | Klassen-Vergleich               | Anonymisierter Vergleich der LP21-Abdeckung ueber mehrere Klassen/Schulen hinweg. Benchmark: "Ihre Klasse liegt bei NMG bei 60%, Durchschnitt ist 45%." Erfordert aggregierte Daten (spaeter Backend). | -- |
| F13 | Eltern-Report                   | Vereinfachte Ansicht fuer Elternkommunikation. Zeigt nur: Gesamtfortschritt, behandelte Fachbereiche, naechste geplante Themen. Export als PDF ohne Fachterminologie. | F1 |
| F14 | Dashboard-Startseiten-Widget    | Auf der Lehrer-Startseite (`/teacher`): Kompakte LP21-Fortschrittsanzeige mit Mini-Radar-Chart. Klick navigiert zur LP21-Seite. | F1 |

---

## 5. Wireframes (ASCII)

### 5.1 Tab "Dashboard"

```
+==============================================================================+
| Lehrplan 21                                        Klasse: 3a | SJ 2025/2026|
| [Dashboard] [Projekt-Matrix] [Nach Fachbereich] [Zeitverlauf] [Export]       |
+==============================================================================+
|                                                                              |
|  +-- Gesamtfortschritt --------------------------------------------------+  |
|  | ████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░  45%  (4/10 Themen)   |  |
|  +------------------------------------------------------------------------+  |
|                                                                              |
|  +-- Kennzahlen --------------------------------------------------------+   |
|  |  +----------+  +----------+  +----------+  +----------+              |   |
|  |  | 4        |  | 6        |  | 3        |  | 3        |              |   |
|  |  | Behandelt|  | Offen    |  | Geplant  |  | Luecken  |              |   |
|  |  | (gruen)  |  | (grau)   |  | (gelb)   |  | (rot)    |              |   |
|  |  +----------+  +----------+  +----------+  +----------+              |   |
|  +----------------------------------------------------------------------|   |
|                                                                              |
|  +-- Radar-Chart -----+  +-- Heatmap (Monat x Fachbereich) ------------+   |
|  |                     |  |                                              |   |
|  |        NMG          |  |       Aug Sep Okt Nov Dez Jan Feb Mrz Apr ..|   |
|  |       / | \         |  |  NMG [ ] [ ] [ ] [ ] [ ] [ ] [.] [.] [#] ..|   |
|  |      /  |  \        |  |  MA  [ ] [ ] [ ] [ ] [ ] [ ] [.] [.] [#] ..|   |
|  |  WAH----+----MA     |  |  TTG [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] ..|   |
|  |      \  |  /        |  |  WAH [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] ..|   |
|  |       \ | /         |  |                                              |   |
|  |        TTG          |  |  Legende: [#]=3+ [.]=1-2 [ ]=0              |   |
|  |                     |  |                                              |   |
|  |  --- Ist (60/30/0/0)|  +----------------------------------------------+  |
|  |  ... Soll (100%)    |  |                                              |   |
|  +---------------------+                                                    |
|                                                                              |
+==============================================================================+
```

**Kennzahlen-Erklaerung:**

| Kachel     | Berechnung                                                            |
| ---------- | --------------------------------------------------------------------- |
| Behandelt  | CurriculumTopics mit `treated === true`                               |
| Offen      | CurriculumTopics mit `treated === false`                              |
| Geplant    | Offene CurriculumTopics, deren Code in mindestens einem Task vorkommt |
| Luecken    | CurriculumTopics, deren Code in keinem Task und keinem Material vorkommt |

**Radar-Chart-Daten:**

| Achse | Wert                                                                  |
| ----- | --------------------------------------------------------------------- |
| NMG   | `curriculumStore.progress.bySubject.find(s => s.shortName === 'NMG').coveragePercent` |
| MA    | analog fuer MA                                                        |
| TTG   | analog fuer TTG                                                       |
| WAH   | analog fuer WAH                                                       |

### 5.2 Tab "Projekt-Matrix"

```
+==============================================================================+
| [Dashboard] [Projekt-Matrix] [Nach Fachbereich] [Zeitverlauf] [Export]       |
+==============================================================================+
|                                                                              |
|  Projekte x LP21-Kompetenzen                                                |
|                                                                              |
|  +------------------------------------------------------------------------+  |
|  |                | NMG   | NMG   | NMG   | NMG   | NMG   | MA    | MA   |  |
|  |                | 2.1   | 2.2   | 2.3   | 2.4   | 2.6   | 2.A   | 3.A  |  |
|  +----------------+-------+-------+-------+-------+-------+-------+------+  |
|  | Gemuesflaeche  |  [E]  |  [G]  |  [E]  |  [ ]  |  [E]  |  [E]  | [G]  |  |
|  | HE24a          |  5T   |  2T   |  2T   |       |  1T   |  2T   | 1T   |  |
|  +----------------+-------+-------+-------+-------+-------+-------+------+  |
|  | Bienenstock    |  [ ]  |  [ ]  |  [ ]  |  [ ]  |  [ ]  |  [ ]  | [ ]  |  |
|  | HE24a          |       |       |       |       |       |       |      |  |
|  +----------------+-------+-------+-------+-------+-------+-------+------+  |
|  (Forts.)         | TTG.2 | WAH.1 | WAH.3 |                                |
|  +----------------+-------+-------+-------+                                  |
|  | Gemuesflaeche  |  [ ]  |  [G]  |  [G]  |  Legende:                       |
|  | HE24a          |       |  *T   |  *T   |  [E] = Erledigt (gruen)         |
|  +----------------+-------+-------+-------+  [G] = Geplant  (gelb)          |
|  | Bienenstock    |  [ ]  |  [ ]  |  [ ]  |  [ ] = Nicht abgedeckt          |
|  | HE24a          |       |       |       |  3T  = 3 Tasks                   |
|  +----------------+-------+-------+-------+  *T  = via Topic (kein Task)     |
|                                                                              |
|  Klick auf Zelle --> Drill-down:                                             |
|  +-- Detail-Panel ---------------------------------------------------+      |
|  | LP21: NMG.2.1 | Projekt: Gemuesflaeche HE24a                     |      |
|  |                                                                    |      |
|  | Aufgaben:                                                          |      |
|  |  [x] Pflanzpartner bestimmen (Beetplanung) -- Gr. Gaensebluemchen |      |
|  |  [x] Saeen nach Beetplan (Aussaeen) -- Gr. Loewenzahn            |      |
|  |  [ ] Setzlinge einpflanzen (Aussaeen) -- Gr. Sonnenblume         |      |
|  |  [ ] Schaedlinge beobachten (Kulturschutz) -- Gr. Sonnenblume    |      |
|  |  [ ] Wachstum dokumentieren (Kulturschutz) -- Ferienaufgabe       |      |
|  |                                                                    |      |
|  | Materialien mit NMG.2.1:                                           |      |
|  |  - Bodentypen bestimmen (mat-1)                                    |      |
|  |  - Mischkultur-Tabelle (mat-3)                                     |      |
|  |  - Wer lebt im Boden? (mat-5)                                     |      |
|  |  - Regenwurm-Experiment (mat-11)                                   |      |
|  +--------------------------------------------------------------------+      |
|                                                                              |
+==============================================================================+
```

**Matrix-Zell-Berechnung:**

```
Fuer jede Zelle (Projekt P, LP21-Code C):
  1. Finde alle Tasks T wo T.projectId === P.id AND C in T.lp21Refs
  2. Finde alle Topics Top wo Top.projectId === P.id AND C in Top.lp21Refs
  3. Wenn mindestens ein Task mit Status "Erledigt" existiert --> [E]
  4. Wenn Tasks existieren aber keiner erledigt --> [G]
  5. Wenn kein Task aber Topic den Code referenziert --> [G] mit *T-Markierung
  6. Sonst --> [ ]
```

### 5.3 Tab "Nach Fachbereich" (verbessert)

```
+==============================================================================+
| [Dashboard] [Projekt-Matrix] [Nach Fachbereich] [Zeitverlauf] [Export]       |
+==============================================================================+
|  Filter: [Alle Zyklen v]  [Alle Fachbereiche v]  [Alle Status v]            |
|                                                                              |
|  +-- NMG -- Natur, Mensch, Gesellschaft  -------- 60% ---- 3/5 --------+   |
|  | ██████████████████████████████░░░░░░░░░░░░░░░░░░░░                   |   |
|  |                                                                       |   |
|  |  [v] NMG.2.1 -- Tiere und Pflanzen              [Behandelt]          |   |
|  |      +-- Aufklappbarer Detail-Bereich ----+                           |   |
|  |      |                                     |                          |   |
|  |      |  Projekt: Gemuesflaeche HE24a       |                          |   |
|  |      |  +- Fachbereich: Beetplanung ------+|                          |   |
|  |      |  |  [x] Pflanzpartner bestimmen    ||                          |   |
|  |      |  |      Gr. Gaensebluemchen        ||                          |   |
|  |      |  |      Material: Mischkultur-Tab. ||                          |   |
|  |      |  +--------------------------------+||                          |   |
|  |      |  +- Fachbereich: Aussaeen ---------+|                          |   |
|  |      |  |  [x] Saeen nach Beetplan        ||                          |   |
|  |      |  |      Gr. Loewenzahn             ||                          |   |
|  |      |  |  [ ] Setzlinge einpflanzen      ||                          |   |
|  |      |  |      Gr. Sonnenblume            ||                          |   |
|  |      |  +--------------------------------+||                          |   |
|  |      |  +- Fachbereich: Kulturschutz -----+|                          |   |
|  |      |  |  [ ] Schaedlinge beobachten     ||                          |   |
|  |      |  +--------------------------------+||                          |   |
|  |      |                                     |                          |   |
|  |      |  Materialien:                       |                          |   |
|  |      |  [PDF] Bodentypen bestimmen         |                          |   |
|  |      |  [PDF] Mischkultur-Tabelle          |                          |   |
|  |      |  [PDF] Wer lebt im Boden?           |                          |   |
|  |      +-------------------------------------+                          |   |
|  |                                                                       |   |
|  |  [ ] NMG.2.2 -- Wachstum, Entwicklung           [Geplant]            |   |
|  |      (2 Tasks geplant in Gemuesflaeche HE24a)                        |   |
|  |                                                                       |   |
|  |  [v] NMG.2.3 -- Stoffe, Energie, Bewegung       [Behandelt]          |   |
|  |      ...                                                              |   |
|  |                                                                       |   |
|  |  [ ] NMG.2.4 -- Sinne und Koerper               [Luecke!]            |   |
|  |      Kein Projekt deckt dieses Ziel ab.                               |   |
|  |      Vorhandene Materialien: Kraeutersalz herstellen,                 |   |
|  |                               Haendewaschen nach der Gartenarbeit     |   |
|  |                                                                       |   |
|  |  [v] NMG.2.6 -- Natuerliche Umwelt              [Behandelt]          |   |
|  |      ...                                                              |   |
|  +----------------------------------------------------------------------|   |
|                                                                              |
|  +-- MA -- Mathematik  ---------------------- 50% ---- 1/2 -------------+   |
|  | ...                                                                   |   |
|  +----------------------------------------------------------------------|   |
|                                                                              |
+==============================================================================+
```

**Neues Status-Badge-System:**

| Badge          | Farbe   | Bedeutung                                                  |
| -------------- | ------- | ---------------------------------------------------------- |
| Behandelt      | Gruen   | `treated === true`                                         |
| Geplant        | Gelb    | `treated === false`, aber Tasks mit diesem Code existieren  |
| Luecke!        | Rot     | `treated === false`, kein Task und kein aktives Material    |
| Offen          | Grau    | `treated === false`, Material vorhanden aber kein Task      |

### 5.4 Tab "Zeitverlauf" (verbessert)

```
+==============================================================================+
| [Dashboard] [Projekt-Matrix] [Nach Fachbereich] [Zeitverlauf] [Export]       |
+==============================================================================+
|                                                                              |
|  Kumulativer Fortschritt                                                     |
|  100% |                                                          ...         |
|       |                                                    .....             |
|   50% |                                         ..........                   |
|       |                               ..........                             |
|    0% +---+---+---+---+---+---+---+---+---+---+---+---+                     |
|        Aug Sep Okt Nov Dez Jan Feb Mrz Apr Mai Jun Jul                       |
|                                                                              |
|  +-- April 2026 ---- +2 Ziele ---- Gesamt: 3/10 (30%) -----------------+   |
|  |                                                                       |   |
|  |  20.04. NMG.2.6 Natuerliche Umwelt und Ressourcen                    |   |
|  |         via: Gemuesflaeche HE24a > Beetvorbereitung > Mulch auslegen |   |
|  |         Material: Kompost anlegen                                     |   |
|  |                                                                       |   |
|  |  28.04. MA.2.A Laengen, Flaechen, Volumen                           |   |
|  |         via: Gemuesflaeche HE24a > Beetplanung > Flaechenberechnung  |   |
|  |         Material: Flaechenberechnung im Garten                       |   |
|  +----------------------------------------------------------------------|   |
|                                                                              |
|  +-- Mai 2026 ---- +2 Ziele ---- Gesamt: 5/10 (50%) -------------------+   |
|  |  ...                                                                  |   |
|  +----------------------------------------------------------------------|   |
|                                                                              |
|  +-- Geplant (noch offen) ---- 3 Ziele erwartet -----------------------+    |
|  |                                                                       |   |
|  |  [~] NMG.2.2 Wachstum, Entwicklung                                  |   |
|  |      Erwartet via: t-14 "Erntezeitpunkt bestimmen" (Faellig: Jul)    |   |
|  |                                                                       |   |
|  |  [~] MA.3.A Daten und Zufall                                         |   |
|  |      Erwartet via: t-15 "Ernte dokumentieren" (Faellig: Jul)          |   |
|  |                                                                       |   |
|  |  [~] WAH.1 / WAH.3                                                   |   |
|  |      Erwartet via: Topic-Templates (Verarbeitung, Vermarktung)        |   |
|  +----------------------------------------------------------------------|   |
|                                                                              |
+==============================================================================+
```

---

## 6. Datenfluss & Store-Aenderungen

### 6.1 Uebersicht der Store-Interaktionen

```
+-------------------+          +---------------------+
|  ProjectsStore    |          |  CurriculumStore    |
|                   |          |                     |
|  tasks[]          +--------->|  curriculumData[]   |
|  topics[]         |  cross-  |  progress           |
|  projects[]       |  query   |                     |
|  toggleTask()  ---+--------->|  markTopicTreated() |
|                   |          |  recalculate()      |
+-------------------+          +---------------------+
        |                              |
        |                              |
        v                              v
+-------------------+          +---------------------+
|  MaterialsStore   |          |  TemplatesStore     |
|                   |          |                     |
|  materials[]      |          |  templates[]        |
|  (lp21Refs)       |          |  (lp21Refs)         |
+-------------------+          +---------------------+
```

### 6.2 Aenderungen am CurriculumStore

**Datei:** `src/stores/curriculum.ts`

Neue Computed Properties und Methoden:

```typescript
// ---- Neue Imports ----
// Cross-Store-Zugriff auf ProjectsStore und MaterialsStore

// ---- Neue Computed Properties ----

/**
 * Fuer jede CurriculumTopic: Alle Tasks aus allen Projekten,
 * deren lp21Refs diesen Code enthalten.
 * Return: Map<topicCode, TaskWithContext[]>
 */
const tasksByCurriculumCode: ComputedRef<Map<string, TaskWithContext[]>>

/**
 * Fuer jede CurriculumTopic: Alle Materialien,
 * deren lp21Refs diesen Code enthalten.
 * Return: Map<topicCode, Material[]>
 */
const materialsByCurriculumCode: ComputedRef<Map<string, Material[]>>

/**
 * Matrix-Daten: Fuer jede Kombination (Projekt, LP21-Code)
 * den aggregierten Status berechnen.
 * Return: MatrixCell[][]
 */
const projectMatrix: ComputedRef<ProjectMatrixData>

/**
 * Heatmap-Daten: Pro Monat pro Fachbereich die Anzahl
 * abgeschlossener LP21-Ziele.
 * Return: HeatmapData
 */
const heatmapData: ComputedRef<HeatmapData>

/**
 * Radar-Chart-Daten: Coverage-Prozent pro Fachbereich.
 * (Bereits teilweise in progress.bySubject vorhanden)
 */
const radarChartData: ComputedRef<RadarDataPoint[]>

/**
 * Kennzahlen: Behandelt, Offen, Geplant, Luecken
 */
const dashboardStats: ComputedRef<DashboardStats>

/**
 * Zeitverlauf-Daten: Gruppiert nach Monat,
 * mit kumulativem Fortschritt.
 */
const timelineData: ComputedRef<TimelineMonth[]>

// ---- Neue Methoden ----

/**
 * Automatisches Update: Wird aufgerufen wenn ein Task
 * seinen Status aendert. Prueft alle lp21Refs des Tasks
 * und aktualisiert die CurriculumTopics entsprechend.
 */
function syncTaskCompletion(task: Task, project: Project): void

/**
 * Inverse Pruefung: Gibt true zurueck wenn fuer einen
 * LP21-Code mindestens ein erledigter Task existiert.
 */
function hasCompletedTaskForCode(code: string): boolean
```

### 6.3 Aenderungen am ProjectsStore

**Datei:** `src/stores/projects.ts`

```typescript
// ---- Aenderung an toggleTask() ----

function toggleTask(taskId: string) {
  const task = tasks.value.find((t) => t.id === taskId)
  if (task) {
    task.status = task.status === 'Erledigt' ? 'Offen' : 'Erledigt'
    updateProjectProgress(task.projectId)

    // NEU: LP21-Sync
    const curriculumStore = useCurriculumStore()
    const project = projects.value.find((p) => p.id === task.projectId)
    if (project) {
      curriculumStore.syncTaskCompletion(task, project)
    }
  }
}
```

### 6.4 Neue TypeScript-Typen

**Datei:** `src/types/index.ts` (Ergaenzungen)

```typescript
// -- LP21 Dashboard Typen --

export interface TaskWithContext {
  task: Task
  project: Project
  topic: Topic
  materials: Material[]
}

export interface MatrixCell {
  projectId: string
  curriculumCode: string
  status: 'completed' | 'planned' | 'topic-only' | 'empty'
  taskCount: number
  completedTaskCount: number
  tasks: Task[]
}

export interface ProjectMatrixData {
  projects: Project[]
  codes: string[]
  cells: Record<string, Record<string, MatrixCell>>  // [projectId][code]
}

export interface HeatmapCell {
  month: number       // 1-12
  subject: string     // 'NMG', 'MA', etc.
  count: number       // Anzahl in diesem Monat abgeschlossener LP21-Ziele
}

export interface HeatmapData {
  months: number[]    // Reihenfolge Aug-Jul
  subjects: string[]
  cells: HeatmapCell[]
  maxCount: number
}

export interface RadarDataPoint {
  subject: string
  shortName: string
  actual: number      // 0-100
  target: number      // 0-100 (default: 100)
}

export interface DashboardStats {
  treated: number
  open: number
  planned: number     // Offen aber durch Tasks abgedeckt
  gaps: number        // Nicht durch Tasks oder Material abgedeckt
  total: number
}

export interface TimelineMonth {
  year: number
  month: number
  label: string                 // "April 2026"
  newlyTreated: TimelineEntry[]
  cumulativeCount: number
  cumulativePercent: number
}

export interface TimelineEntry {
  curriculumTopic: CurriculumTopic
  task?: Task
  project?: Project
  topic?: Topic
  material?: Material
}

// -- Erweiterung CurriculumProgress --

export interface SemesterTarget {
  semester: '1' | '2'
  targetPercent: number         // Ziel-Abdeckung
  subjectTargets: {
    shortName: string
    targetPercent: number
  }[]
}
```

### 6.5 Berechnungslogik (Pseudocode)

#### dashboardStats

```
treated  = curriculumData.flatMap(c => c.topics).filter(t => t.treated).length
open     = total - treated

allTaskLp21Codes = projectsStore.tasks
  .flatMap(t => t.lp21Refs)
  .toSet()

allMaterialLp21Codes = materialsStore.materials
  .flatMap(m => m.lp21Refs)
  .toSet()

planned = curriculumData.flatMap(c => c.topics)
  .filter(t => !t.treated && allTaskLp21Codes.has(t.code))
  .length

gaps = curriculumData.flatMap(c => c.topics)
  .filter(t => !t.treated
    && !allTaskLp21Codes.has(t.code)
    && !allMaterialLp21Codes.has(t.code))
  .length
```

#### syncTaskCompletion

```
function syncTaskCompletion(task, project):
  if task.status === 'Erledigt':
    for code in task.lp21Refs:
      markTopicTreated(code, '', project.name)
  else:
    // Task wurde zurueckgesetzt
    for code in task.lp21Refs:
      // Pruefe ob ein anderer erledigter Task denselben Code hat
      otherTasks = projectsStore.tasks
        .filter(t => t.id !== task.id
          && t.status === 'Erledigt'
          && t.lp21Refs.includes(code))
      if otherTasks.length === 0:
        unmarkTopicTreated(code)
```

#### projectMatrix

```
for each project P:
  for each curriculumCode C:
    tasks = projectsStore.tasks
      .filter(t => t.projectId === P.id && t.lp21Refs.includes(C))
    topics = projectsStore.topics
      .filter(t => t.projectId === P.id && t.lp21Refs.includes(C))

    completedTasks = tasks.filter(t => t.status === 'Erledigt')

    cell.status =
      completedTasks.length > 0  ? 'completed'  :
      tasks.length > 0           ? 'planned'    :
      topics.length > 0          ? 'topic-only' :
                                   'empty'
    cell.taskCount = tasks.length
    cell.completedTaskCount = completedTasks.length
```

---

## 7. Implementierungsplan

### Phase 1: Fundament (F4 + F6) -- Geschaetzte Dauer: 1-2 Tage

**Ziel:** Automatische LP21-Verknuepfung herstellen und LP21-Badges anzeigen.

| Schritt | Beschreibung                                            | Dateien                          |
| ------- | ------------------------------------------------------- | -------------------------------- |
| 1.1     | Neue Typen in types/index.ts ergaenzen                  | `src/types/index.ts`             |
| 1.2     | `unmarkTopicTreated()` im CurriculumStore ergaenzen     | `src/stores/curriculum.ts`       |
| 1.3     | `syncTaskCompletion()` im CurriculumStore implementieren | `src/stores/curriculum.ts`       |
| 1.4     | `toggleTask()` im ProjectsStore erweitern (LP21-Sync)   | `src/stores/projects.ts`         |
| 1.5     | LP21-Badges auf Tasks in Projektansicht anzeigen         | `src/pages/teacher/projects/[id].vue` |
| 1.6     | Fixture-Daten korrigieren (NMG.2.2 als behandelt, da Task t-6 erledigt) | `src/data/fixtures/curriculum.ts` |

**Abhaengigkeiten:** Keine. Kann sofort begonnen werden.
**Validierung:** Nach Abschluss von Task t-6 muss NMG.2.1 und NMG.2.2 automatisch auf "Behandelt" stehen.

### Phase 2: Dashboard-Tab (F1, F5) -- Geschaetzte Dauer: 2-3 Tage

**Ziel:** Neuer Dashboard-Tab mit Radar-Chart, Heatmap und Kennzahlen.

| Schritt | Beschreibung                                            | Dateien                          |
| ------- | ------------------------------------------------------- | -------------------------------- |
| 2.1     | `dashboardStats` Computed im CurriculumStore            | `src/stores/curriculum.ts`       |
| 2.2     | `radarChartData` Computed im CurriculumStore            | `src/stores/curriculum.ts`       |
| 2.3     | `heatmapData` Computed im CurriculumStore               | `src/stores/curriculum.ts`       |
| 2.4     | SVG-basierte RadarChart-Komponente erstellen             | `src/components/RadarChart.vue`  |
| 2.5     | CSS-Grid-basierte Heatmap-Komponente erstellen           | `src/components/Heatmap.vue`     |
| 2.6     | Dashboard-Tab in Curriculum-Seite integrieren            | `src/pages/teacher/curriculum/index.vue` |
| 2.7     | Tab-Struktur auf 5 Tabs umbauen                          | `src/pages/teacher/curriculum/index.vue` |

**Abhaengigkeiten:** Phase 1 (fuer korrekte Daten).
**Hinweis:** Radar-Chart und Heatmap werden als reine SVG/CSS-Komponenten gebaut (kein Chart-Library-Overhead).

### Phase 3: Projekt-Matrix (F2) -- Geschaetzte Dauer: 1-2 Tage

**Ziel:** Matrix-Ansicht mit Drill-down.

| Schritt | Beschreibung                                            | Dateien                          |
| ------- | ------------------------------------------------------- | -------------------------------- |
| 3.1     | `projectMatrix` Computed im CurriculumStore             | `src/stores/curriculum.ts`       |
| 3.2     | Matrix-Tabelle mit farbcodierten Zellen erstellen        | `src/pages/teacher/curriculum/index.vue` |
| 3.3     | Drill-down Panel (Klick auf Zelle)                       | `src/pages/teacher/curriculum/index.vue` |

**Abhaengigkeiten:** Phase 1.

### Phase 4: Fachbereich-Detail (F3) -- Geschaetzte Dauer: 1-2 Tage

**Ziel:** Verbesserter "Nach Fachbereich"-Tab mit Task-Level-Detail.

| Schritt | Beschreibung                                            | Dateien                          |
| ------- | ------------------------------------------------------- | -------------------------------- |
| 4.1     | `tasksByCurriculumCode` Computed im CurriculumStore     | `src/stores/curriculum.ts`       |
| 4.2     | `materialsByCurriculumCode` Computed im CurriculumStore | `src/stores/curriculum.ts`       |
| 4.3     | Aufklappbare Detail-Sektionen pro CurriculumTopic       | `src/pages/teacher/curriculum/index.vue` |
| 4.4     | Status-Badge-System (Behandelt/Geplant/Luecke/Offen)    | `src/pages/teacher/curriculum/index.vue` |
| 4.5     | MaterialsStore importieren und verknuepfen               | `src/stores/materials.ts` (falls noetig) |

**Abhaengigkeiten:** Phase 1.

### Phase 5: Zeitverlauf (F5 erweitert) -- Geschaetzte Dauer: 1 Tag

**Ziel:** Verbesserter Zeitverlauf-Tab.

| Schritt | Beschreibung                                            | Dateien                          |
| ------- | ------------------------------------------------------- | -------------------------------- |
| 5.1     | `timelineData` Computed im CurriculumStore              | `src/stores/curriculum.ts`       |
| 5.2     | Monatsweise Gruppierung mit kumulativem Fortschritt     | `src/pages/teacher/curriculum/index.vue` |
| 5.3     | Zukunfts-Projektion (geplante Tasks)                     | `src/pages/teacher/curriculum/index.vue` |

**Abhaengigkeiten:** Phase 1, Phase 4.

### Phase 6: Erweiterte Features (F7-F10) -- Geschaetzte Dauer: 2-3 Tage

| Schritt | Beschreibung                                            | Dateien                          |
| ------- | ------------------------------------------------------- | -------------------------------- |
| 6.1     | F7: Lueckenanalyse-Sektion im Dashboard                 | `src/pages/teacher/curriculum/index.vue` |
| 6.2     | F8: SemesterTarget-Typ und Soll/Ist-Vergleich           | `src/types/index.ts`, `src/stores/curriculum.ts` |
| 6.3     | F9: Drill-down Navigation aus Radar-Chart/Heatmap       | `src/pages/teacher/curriculum/index.vue` |
| 6.4     | F10: Zyklus-Filter (gradeRange-basiert)                  | `src/pages/teacher/curriculum/index.vue` |
| 6.5     | Export-Dialog erweitern                                  | `src/pages/teacher/curriculum/index.vue` |

**Abhaengigkeiten:** Phasen 2-5.

### Phase 7: Nice-to-have (F11-F14) -- Geschaetzte Dauer: 2-3 Tage

| Schritt | Beschreibung                                            | Dateien                          |
| ------- | ------------------------------------------------------- | -------------------------------- |
| 7.1     | F11: LP21-Vorschlaege bei Luecken                        | `src/stores/curriculum.ts`, Seite |
| 7.2     | F14: Dashboard-Widget auf Startseite                     | `src/pages/teacher/index.vue`    |
| 7.3     | F13: Eltern-Report (vereinfachter Export)                | Export-Dialog                    |
| 7.4     | F12: Klassen-Vergleich (Vorbereitung)                    | Backend-abhaengig, nur UI-Skeleton |

**Abhaengigkeiten:** Phase 6.

### Zusammenfassung Implementierungsplan

```
Woche 1:  Phase 1 (Fundament) + Phase 2 (Dashboard)
Woche 2:  Phase 3 (Matrix) + Phase 4 (Fachbereich-Detail) + Phase 5 (Zeitverlauf)
Woche 3:  Phase 6 (Erweiterte Features)
Woche 4:  Phase 7 (Nice-to-have) + QA + Feinschliff
```

### Dateien-Uebersicht (alle Aenderungen)

| Datei                                          | Aenderungstyp | Phase |
| ---------------------------------------------- | ------------- | ----- |
| `src/types/index.ts`                           | Erweitern     | 1, 6  |
| `src/stores/curriculum.ts`                     | Erweitern     | 1-6   |
| `src/stores/projects.ts`                       | Erweitern     | 1     |
| `src/pages/teacher/curriculum/index.vue`       | Umbauen       | 2-6   |
| `src/pages/teacher/projects/[id].vue`          | Erweitern     | 1     |
| `src/pages/teacher/index.vue`                  | Erweitern     | 7     |
| `src/components/RadarChart.vue`                | Neu           | 2     |
| `src/components/Heatmap.vue`                   | Neu           | 2     |
| `src/data/fixtures/curriculum.ts`              | Korrigieren   | 1     |

---

## 8. Offene Fragen

| Nr | Frage                                                                     | Entscheidung noetig bis |
| -- | ------------------------------------------------------------------------- | ----------------------- |
| 1  | Soll die LP21-Sync bidirektional sein? (Material-Download markiert LP21?) | Phase 1                 |
| 2  | Radar-Chart: Reine SVG-Eigenentwicklung oder leichtgewichtige Library?    | Phase 2                 |
| 3  | Soll der Export echte PDFs generieren oder nur als Demo funktionieren?     | Phase 6                 |
| 4  | Eltern-Report: Eigene Route oder Teil des Export-Dialogs?                 | Phase 7                 |
| 5  | Wie sollen TopicTemplates ohne zugehoerige Tasks in der Matrix erscheinen? | Phase 3                 |
| 6  | Soll F8 (Jahresziel) editierbar sein oder mit Fixture-Daten vorgefuellt?  | Phase 6                 |
