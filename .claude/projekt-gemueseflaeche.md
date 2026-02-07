# Technische Dokumentation — Projekt "Gemüsefläche"

> **Zweck:** Entwickler-Referenzdokument für die Überarbeitung der Project Detail Page (`src/pages/teacher/projects/[id].vue`).
> Beschreibt Aktivitäten, Gemüsearten, Zeitstrahl-Konzept, Vorprojekte und vorgeschlagene Datenmodell-Erweiterungen.
> **Keine Code-Änderungen** — nur Spezifikation.

---

## Inhaltsverzeichnis

1. [Projektübersicht](#1-projektübersicht)
2. [Zeitstrahl-Konzept (Hero-Element)](#2-zeitstrahl-konzept-hero-element)
3. [Phasen & Aktivitäten](#3-phasen--aktivitäten)
4. [Gemüsearten — Steckbriefe](#4-gemüsearten--steckbriefe)
5. [Vorprojekte](#5-vorprojekte)
6. [Datenmodell-Vorschläge](#6-datenmodell-vorschläge)
7. [UI-Konzept (Wireframe-Beschreibung)](#7-ui-konzept-wireframe-beschreibung)

---

## 1. Projektübersicht

### Basisdaten

| Feld | Wert |
|------|------|
| **Name** | Gemüsefläche HE24a |
| **Beschreibung** | Anlage und Bewirtschaftung einer Gemüsefläche hinter dem Schulhaus. Die Schüler lernen den gesamten Kreislauf vom Säen bis zur Ernte kennen. |
| **Fläche** | 10 m² |
| **Standort** | Hinter dem Schulhaus, Südseite |
| **Startdatum** | 15. Januar 2026 |
| **Status** | Laufend |
| **Aktuelle Phase** | Pflanzung |
| **Klasse** | HE24a |

### Mapping auf bestehendes `Project`-Interface

```typescript
// Bestehend in src/types/index.ts — keine Änderung nötig
interface Project {
  id: string              // 'proj-1'
  templateId?: string     // 'tmpl-1'
  schoolId: string        // 'school-1'
  classId: string         // 'class-1'
  name: string            // 'Gemüsefläche HE24a'
  description: string
  area?: number           // 10
  status: ProjectStatus   // 'Laufend'
  currentPhase: ProjectPhase // 'Pflanzung'
  progress: number        // 60
  location?: string       // 'Hinter dem Schulhaus, Südseite'
  startDate?: string      // '2026-01-15'
  taskCount: number       // 15
  tasksDone: number       // 8
  groupCount: number      // 4
}
```

### Vorprojekte (einmalig, vor Projektstart)

Zwei einmalige Infrastruktur-Aufgaben, die vor dem Jahreszyklus abgeschlossen werden müssen:

1. **Hochbeet bauen** — Konstruktion eines Hochbeets aus Holz
2. **Beet anlegen** — Vorbereitung einer Bodenfläche als Pflanzfläche

Details in [Sektion 5](#5-vorprojekte).

### Jahreszyklus

Das Projekt folgt einem Jahreszyklus mit **9 Aktivitäten**, die sich auf **4 Haupt-Phasen** verteilen:

| Phase | Aktivitäten | Zeitraum |
|-------|-------------|----------|
| Planung | Beetplanung | Jan – Feb |
| Pflanzung | Beetvorbereitung, Jungpflanzen anziehen, Aussäen/Auspflanzen | Feb – Mai |
| Pflege | Kulturschutz, Düngen, Jäten, Bewässern | Mai – Sep |
| Ernte | Ernten | Jul – Okt |

---

## 2. Zeitstrahl-Konzept (Hero-Element)

Der Zeitstrahl ist das prominenteste visuelle Element der Projektseite und besteht aus zwei Teilen:

### 2.1 Gantt-Chart (oberer Bereich)

Horizontale Balken über eine Januar–Dezember-Achse. Jede der 9 Aktivitäten wird als farbiger Balken dargestellt.

#### Spezifikation

| Eigenschaft | Beschreibung |
|-------------|-------------|
| **Achse** | 12 Spalten (Jan–Dez), gleichmässig verteilt |
| **Balken** | Pro Aktivität ein horizontaler Balken |
| **Farben** | Pro Phase (siehe Farbcodierung unten) |
| **Heute-Marker** | Vertikale rote Linie am aktuellen Datum |
| **Aktueller Monat** | Spaltenheader fett + farbig hervorgehoben |
| **Interaktion** | Klick auf Balken → Smooth-Scroll zur Aktivitäts-Detailkarte |
| **Responsive** | Horizontal scrollbar auf Mobile, min-width 800px |

#### Farbcodierung nach Phase

| Phase | Farbe | Tailwind-Klasse |
|-------|-------|-----------------|
| Planung | Blau | `bg-blue-400` / `bg-blue-500` |
| Pflanzung | Grün | `bg-green-400` / `bg-green-500` |
| Pflege | Gelb/Amber | `bg-amber-400` / `bg-amber-500` |
| Ernte | Orange | `bg-orange-400` / `bg-orange-500` |

#### Aktivitäten-Balken

| # | Aktivität | Phase | Start | Ende | Farbe |
|---|-----------|-------|-------|------|-------|
| 1 | Beetplanung | Planung | Jan | Feb | Blau |
| 2 | Beetvorbereitung | Pflanzung | Mrz | Apr | Grün |
| 3 | Jungpflanzen anziehen | Pflanzung | Feb | Apr | Grün (heller) |
| 4 | Aussäen / Auspflanzen | Pflanzung | Apr | Mai | Grün (dunkler) |
| 5 | Kulturschutz | Pflege | Mai | Sep | Amber |
| 6 | Düngen | Pflege | Mai | Aug | Amber (heller) |
| 7 | Jäten | Pflege | Mai | Sep | Amber (dunkler) |
| 8 | Bewässern | Pflege | Mai | Sep | Amber |
| 9 | Ernten | Ernte | Jul | Okt | Orange |

#### ASCII-Diagramm: Gantt-Chart

```
          Jan   Feb   Mrz   Apr   Mai   Jun   Jul   Aug   Sep   Okt   Nov   Dez
         ┌─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┐
Beetplan  │█████│█████│     │     │     │     │     │     │     │     │     │     │
         ├─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
Beetvorb. │     │     │█████│█████│     │     │     │     │     │     │     │     │
         ├─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
Jungpfl.  │     │█████│█████│█████│     │     │     │     │     │     │     │     │
         ├─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
Aussäen   │     │     │     │█████│█████│     │     │     │     │     │     │     │
         ├─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
Kultur-   │     │     │     │     │█████│█████│█████│█████│█████│     │     │     │
schutz    │     │     │     │     │     │     │     │     │     │     │     │     │
         ├─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
Düngen    │     │     │     │     │█████│█████│█████│█████│     │     │     │     │
         ├─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
Jäten     │     │     │     │     │█████│█████│█████│█████│█████│     │     │     │
         ├─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
Bewässern │     │     │     │     │█████│█████│█████│█████│█████│     │     │     │
         ├─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
Ernten    │     │     │     │     │     │     │█████│█████│█████│█████│     │     │
         └─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴──▲──┴─────┴─────┴─────┘
                                                             │
                                                         Heute-Marker
```

### 2.2 Monats-Detailansicht (unterer Bereich)

Unterhalb des Gantt-Charts werden **12 Monats-Karten** in einem Grid angezeigt. Jede Karte listet die in diesem Monat aktiven Aktivitäten.

#### Spezifikation

| Eigenschaft | Beschreibung |
|-------------|-------------|
| **Layout** | Grid: 4 Spalten auf Desktop, 2 auf Tablet, 1 auf Mobile |
| **Karten** | Jede Karte zeigt den Monatsnamen als Titel |
| **Aktive Aktivitäten** | Liste der Aktivitäten mit Phasen-Icon und -Farbe |
| **Aktueller Monat** | Hervorgehoben mit Ring/Border in Primärfarbe |
| **Leere Monate** | Nov/Dez zeigen "Ruhephase" mit 🌙-Icon |

#### Monats-Zuordnung

| Monat | Aktive Aktivitäten |
|-------|-------------------|
| **Januar** | Beetplanung |
| **Februar** | Beetplanung, Jungpflanzen anziehen |
| **März** | Beetvorbereitung, Jungpflanzen anziehen |
| **April** | Beetvorbereitung, Jungpflanzen anziehen, Aussäen/Auspflanzen |
| **Mai** | Aussäen/Auspflanzen, Kulturschutz, Düngen, Jäten, Bewässern |
| **Juni** | Kulturschutz, Düngen, Jäten, Bewässern |
| **Juli** | Kulturschutz, Düngen, Jäten, Bewässern, Ernten |
| **August** | Kulturschutz, Düngen, Jäten, Bewässern, Ernten |
| **September** | Kulturschutz, Jäten, Bewässern, Ernten |
| **Oktober** | Ernten |
| **November** | Ruhephase |
| **Dezember** | Ruhephase |

#### ASCII-Diagramm: Monats-Karten

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Januar     │  │  Februar     │  │    März      │  │   April      │
│              │  │              │  │              │  │              │
│ 📋 Beetplan  │  │ 📋 Beetplan  │  │ 🌱 Beetvorb. │  │ 🌱 Beetvorb. │
│              │  │ 🌱 Jungpfl.  │  │ 🌱 Jungpfl.  │  │ 🌱 Jungpfl.  │
│              │  │              │  │              │  │ 🌱 Aussäen   │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│    Mai       │  │    Juni      │  │    Juli      │  │   August     │
│              │  │              │  │              │  │              │
│ 🌱 Aussäen   │  │ 🛡 Schutz    │  │ 🛡 Schutz    │  │ 🛡 Schutz    │
│ 🛡 Schutz    │  │ 💧 Düngen    │  │ 💧 Düngen    │  │ 💧 Düngen    │
│ 💧 Düngen    │  │ 🌿 Jäten     │  │ 🌿 Jäten     │  │ 🌿 Jäten     │
│ 🌿 Jäten     │  │ 💦 Bewässern │  │ 💦 Bewässern │  │ 💦 Bewässern │
│ 💦 Bewässern │  │              │  │ 🥕 Ernten    │  │ 🥕 Ernten    │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  September   │  │   Oktober    │  │  November    │  │  Dezember    │
│              │  │              │  │              │  │              │
│ 🛡 Schutz    │  │ 🥕 Ernten    │  │ 🌙 Ruhephase │  │ 🌙 Ruhephase │
│ 🌿 Jäten     │  │              │  │              │  │              │
│ 💦 Bewässern │  │              │  │              │  │              │
│ 🥕 Ernten    │  │              │  │              │  │              │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
```

---

## 3. Phasen & Aktivitäten

### Übersicht: 9 Aktivitäten auf 4 Phasen

| Phase | Aktivität | Monate | Icon |
|-------|-----------|--------|------|
| **Planung** | Beetplanung | Jan–Feb | 📋 |
| **Pflanzung** | Beetvorbereitung | Mrz–Apr | 🌱 |
| **Pflanzung** | Jungpflanzen anziehen | Feb–Apr | 🌱 |
| **Pflanzung** | Aussäen / Auspflanzen | Apr–Mai | 🌱 |
| **Pflege** | Kulturschutz | Mai–Sep | 🛡 |
| **Pflege** | Düngen | Mai–Aug | 💧 |
| **Pflege** | Jäten | Mai–Sep | 🌿 |
| **Pflege** | Bewässern | Mai–Sep | 💦 |
| **Ernte** | Ernten | Jul–Okt | 🥕 |

---

### 3.1 Beetplanung

| Feld | Wert |
|------|------|
| **Phase** | Planung |
| **Zeitraum** | Januar – Februar |
| **Icon** | 📋 |

**Ziel (Lern- & Praxisziel):**
- Die Schüler:innen planen gemeinsam, welche Gemüsesorten auf der verfügbaren Fläche angebaut werden.
- Sie lernen Grundlagen der Fruchtfolge, Pflanzpartner und Flächenberechnung.
- Lehrplanbezug: NMG.2.1 (Tiere und Pflanzen), MA.2.A (Zahl und Variable — Flächenberechnung).

**Materialliste:**

| Material | Menge | Quelle |
|----------|-------|--------|
| Millimeterpapier / Zeichenpapier | 1 pro Gruppe | Schulmaterial |
| Farbstifte | Set pro Gruppe | Schulmaterial |
| Saatgut-Katalog (z.B. Sativa, Zollinger) | 1–2 Kataloge | Online bestellen |
| Pflanzpartner-Tabelle (Arbeitsblatt) | 1 pro Schüler:in | Plantoria-Material |

**Vorgehen (Schritte):**

1. Fläche vermessen und massstabsgetreu auf Papier übertragen (Mathe-Integration)
2. Gemüsesorten aus Katalog auswählen — gemeinsam entscheiden
3. Pflanzpartner-Tabelle ausfüllen: Welche Sorten vertragen sich?
4. Beete auf dem Plan einzeichnen (inkl. Wege, Wasserzugang)
5. Zeitplan erstellen: Wann wird was gesät/gepflanzt?
6. Plan im Klassenzimmer aufhängen als Referenz

**Tutorial-Video-Platzhalter:**
`tutorialVideoUrl: '/videos/beetplanung-intro.mp4'`

---

### 3.2 Beetvorbereitung

| Feld | Wert |
|------|------|
| **Phase** | Pflanzung |
| **Zeitraum** | März – April |
| **Icon** | 🌱 |

**Ziel (Lern- & Praxisziel):**
- Die Fläche wird nach dem Winter für die neue Saison vorbereitet.
- Die Schüler:innen lernen den Zusammenhang zwischen Bodenqualität und Pflanzenwachstum.
- Lehrplanbezug: NMG.2.3 (Stoffe im Alltag — Boden als Lebensraum).

**Materialliste:**

| Material | Menge | Quelle |
|----------|-------|--------|
| Spaten / Grabgabel | 4–6 Stück | Werkzeugschuppen |
| Handrechen | 4–6 Stück | Werkzeugschuppen |
| Kompost | ca. 100 Liter | Schulkompost / Gärtnerei |
| pH-Teststreifen | 1 Set | Gartencenter |
| Arbeitshandschuhe | 1 Paar pro Schüler:in | Schulmaterial |
| Schnur + Pflöcke (Beetbegrenzung) | nach Bedarf | Baumarkt |

**Vorgehen (Schritte):**

1. Beete von Laub und Pflanzenresten des Vorjahres befreien
2. Unkraut jäten (Wurzeln entfernen, nicht nur oberirdisch)
3. Boden spatentief lockern — Schollen grob umdrehen
4. Boden-pH testen und dokumentieren (ideal: pH 6.0–7.0)
5. Kompost gleichmässig verteilen (ca. 3–5 cm Schicht)
6. Kompost leicht einarbeiten mit Rechen
7. Beete gemäss Beetplan mit Schnur und Pflöcken markieren
8. Wege zwischen den Beeten trittfest machen (Holzschnitzel oder Platten)

**Tutorial-Video-Platzhalter:**
`tutorialVideoUrl: '/videos/beetvorbereitung.mp4'`

---

### 3.3 Jungpflanzen anziehen

| Feld | Wert |
|------|------|
| **Phase** | Pflanzung |
| **Zeitraum** | Februar – April |
| **Icon** | 🌱 |

**Ziel (Lern- & Praxisziel):**
- Bestimmte Gemüsearten (Tomaten, Paprika/Chili, Broccoli, Blumenkohl) werden indoor aus Samen vorgezogen.
- Die Schüler:innen beobachten Keimung und Wachstum über mehrere Wochen.
- Lehrplanbezug: NMG.2.1 (Tiere, Pflanzen und Lebensräume), NMG.2.2 (Wachstum, Entwicklung).

**Materialliste:**

| Material | Menge | Quelle |
|----------|-------|--------|
| Anzuchttöpfe (6–8 cm) | 40–60 Stück | Gartencenter |
| Aussaaterde (torffreie Anzuchterde) | 20 Liter | Gartencenter |
| Saatgut: Tomaten | 1 Tüte | Sativa / Zollinger |
| Saatgut: Paprika / Chili | 1 Tüte | Sativa / Zollinger |
| Saatgut: Broccoli | 1 Tüte | Sativa / Zollinger |
| Saatgut: Blumenkohl | 1 Tüte | Sativa / Zollinger |
| Untersetzer / Tabletts | 4–6 Stück | Schulmaterial |
| Sprühflasche | 2–3 Stück | Schulmaterial |
| Pflanzenetiketten | 50 Stück | Gartencenter |
| Fensterbank / heller Standort im Schulzimmer | — | Schulzimmer |

**Vorgehen (Schritte):**

1. Anzuchttöpfe mit feuchter Aussaaterde füllen (nicht pressen)
2. Saatgut gemäss Anleitung auf Tüte aussäen:
   - Tomaten: 0.5–1 cm tief, ab Mitte Feb
   - Paprika/Chili: 0.5 cm tief, ab Anfang Feb (brauchen lange)
   - Broccoli/Blumenkohl: 1 cm tief, ab Mitte Mrz
3. Töpfe beschriften (Sorte + Datum) mit Pflanzenetiketten
4. Auf Fensterbank stellen — hell, warm (18–22 °C)
5. Täglich mit Sprühflasche befeuchten (nicht ertränken)
6. Keimung beobachten und im Wachstumsprotokoll dokumentieren
7. Nach 2–3 Wochen: Pikieren (vereinzeln) in grössere Töpfe, falls nötig
8. Ab April: Abhärten — stundenweise nach draussen stellen
9. Mitte Mai (nach Eisheiligen): Auspflanzen ins Beet

**Tutorial-Video-Platzhalter:**
`tutorialVideoUrl: '/videos/jungpflanzen-anziehen.mp4'`

---

### 3.4 Aussäen / Auspflanzen

| Feld | Wert |
|------|------|
| **Phase** | Pflanzung |
| **Zeitraum** | April – Mai |
| **Icon** | 🌱 |

**Ziel (Lern- & Praxisziel):**
- Direktsaat von robusten Gemüsearten und Auspflanzen der vorgezogenen Jungpflanzen.
- Die Schüler:innen lernen korrekte Pflanzabstände, Saattiefe und die Bedeutung der Eisheiligen.
- Lehrplanbezug: NMG.2.1, NMG.2.2.

**Materialliste:**

| Material | Menge | Quelle |
|----------|-------|--------|
| Vorgezogene Jungpflanzen | gemäss Beetplan | Eigen (Sektion 3.3) |
| Saatgut: Rübli (Karotten) | 1–2 Tüten | Sativa / Zollinger |
| Saatgut: Kohl (Kohlrabi, Weisskohl) | 1 Tüte | Sativa / Zollinger |
| Saatgut: Kräuter (Basilikum, Petersilie, Schnittlauch) | je 1 Tüte | Sativa / Zollinger |
| Pflanzholz / Dibber | 4–6 Stück | Gartencenter / selbst gemacht |
| Giesskannen | 4–6 Stück | Werkzeugschuppen |
| Schnur (für Saatreihen) | 10 m | Baumarkt |
| Mulchmaterial (Stroh, Rasenschnitt) | nach Bedarf | Hauswart / Kompost |

**Vorgehen (Schritte):**

1. Beetplan konsultieren — wo kommt welche Sorte hin?
2. **Direktsaat (ab April):**
   - Rübli: Rillen 1–2 cm tief, Abstand 3 cm, Reihenabstand 20 cm
   - Kohl: Rillen 1 cm tief, Abstand 40 cm
   - Kräuter: Lichtkeimer — auf Erde streuen und leicht andrücken
3. **Auspflanzen (Mitte Mai, nach Eisheiligen = 15. Mai):**
   - Tomaten: Abstand 50 cm, tiefer setzen (bis zum ersten Blattpaar)
   - Paprika/Chili: Abstand 40 cm
   - Broccoli/Blumenkohl: Abstand 50 cm
4. Saatreihen/Pflanzstellen mit Schnur markieren
5. Nach dem Einsetzen gründlich angiessen
6. Mulch zwischen den Reihen verteilen (Verdunstungsschutz)
7. Pflanzenetiketten an den Beeten anbringen

**Tutorial-Video-Platzhalter:**
`tutorialVideoUrl: '/videos/aussaeen-auspflanzen.mp4'`

---

### 3.5 Kulturschutz

| Feld | Wert |
|------|------|
| **Phase** | Pflege |
| **Zeitraum** | Mai – September |
| **Icon** | 🛡 |

**Ziel (Lern- & Praxisziel):**
- Schutz der Kulturen vor Schädlingen und Witterung ohne chemische Mittel.
- Die Schüler:innen lernen biologische Schädlingsbekämpfung und Nützlingsförderung.
- Lehrplanbezug: NMG.2.1, NMG.2.6 (Beziehungen Mensch–Natur).

**Materialliste:**

| Material | Menge | Quelle |
|----------|-------|--------|
| Kulturschutznetz (feinmaschig) | 5–10 m² | Gartencenter |
| Schneckenzaun oder Schneckenkorn (Bio) | nach Bedarf | Gartencenter |
| Stützstäbe (für Tomaten) | 10–15 Stück | Gartencenter / Baumarkt |
| Bindfaden (weich) | 1 Rolle | Baumarkt |
| Nützlingshotel (optional) | 1 Stück | Selbst gebaut / Gartencenter |

**Vorgehen (Schritte):**

1. Kulturschutznetz über Kohlbeete spannen (Schutz vor Kohlfliege und Kohlweissling)
2. Netz mit Steinen/Haken am Boden fixieren — lückenlos
3. Tomatenstäbe setzen und Pflanzen anbinden (regelmässig nachwachsende Triebe anbinden)
4. Schneckenbarriere um empfindliche Kulturen errichten
5. Regelmässig kontrollieren: Blattläuse, Raupen, Schnecken
6. Bei Befall: Schädlinge von Hand ablesen (Lernmoment!)
7. Nützlinge fördern: Marienkäfer, Ohrwürmer, Florfliegen

**Tutorial-Video-Platzhalter:**
`tutorialVideoUrl: '/videos/kulturschutz.mp4'`

---

### 3.6 Düngen

| Feld | Wert |
|------|------|
| **Phase** | Pflege |
| **Zeitraum** | Mai – August |
| **Icon** | 💧 |

**Ziel (Lern- & Praxisziel):**
- Nährstoffversorgung der Pflanzen mit organischem Dünger.
- Die Schüler:innen lernen die Grundlagen von NPK (Stickstoff, Phosphor, Kalium) und warum Pflanzen Nährstoffe brauchen.
- Lehrplanbezug: NMG.2.3 (Stoffe im Alltag).

**Materialliste:**

| Material | Menge | Quelle |
|----------|-------|--------|
| Organischer Universaldünger (Pellets) | 2–5 kg | Gartencenter |
| Kompost (als Langzeitdünger) | 50 Liter | Schulkompost |
| Brennnesseljauche (optional, selbst hergestellt) | 20 Liter | Selbst hergestellt |
| Eimer | 2–3 Stück | Werkzeugschuppen |
| Arbeitshandschuhe | 1 Paar pro Schüler:in | Schulmaterial |

**Vorgehen (Schritte):**

1. Erste Düngung 2–3 Wochen nach dem Auspflanzen
2. Organische Pellets gemäss Packungsanleitung ausbringen (nicht überdüngen!)
3. Leicht in die oberste Bodenschicht einarbeiten
4. Anschliessend giessen, damit Nährstoffe in den Boden gelangen
5. Kompost als Mulch und Langzeitdünger zwischen den Reihen verteilen
6. Nachdüngen alle 4–6 Wochen bei Starkzehrern (Tomaten, Kohl)
7. Optional: Brennnesseljauche ansetzen (Brennnesseln + Wasser, 2 Wochen vergären) — 1:10 verdünnt giessen

**Tutorial-Video-Platzhalter:**
`tutorialVideoUrl: '/videos/duengen.mp4'`

---

### 3.7 Jäten

| Feld | Wert |
|------|------|
| **Phase** | Pflege |
| **Zeitraum** | Mai – September |
| **Icon** | 🌿 |

**Ziel (Lern- & Praxisziel):**
- Regelmässiges Entfernen von Unkraut, damit die Kulturpflanzen genug Licht, Wasser und Nährstoffe erhalten.
- Die Schüler:innen lernen Unkräuter von Kulturpflanzen zu unterscheiden.
- Lehrplanbezug: NMG.2.1 (Pflanzen erkennen und benennen).

**Materialliste:**

| Material | Menge | Quelle |
|----------|-------|--------|
| Handhacke | 4–6 Stück | Werkzeugschuppen |
| Unkrautstecher | 2–3 Stück | Gartencenter |
| Arbeitshandschuhe | 1 Paar pro Schüler:in | Schulmaterial |
| Eimer / Abfallsack (für Unkraut) | 2–3 Stück | Werkzeugschuppen |

**Vorgehen (Schritte):**

1. Wöchentlich jäten — am besten nach Regen (Unkraut lässt sich leichter ziehen)
2. Unkraut mit Wurzel entfernen, nicht nur abschneiden
3. Zwischen den Reihen hacken — lockert gleichzeitig den Boden
4. Vorsicht in der Nähe von Saatreihen — Keimlinge nicht verwechseln!
5. Unkraut auf den Kompost geben (ausser samentragende Unkräuter)
6. Mulch nachfüllen, wo nötig — unterdrückt neues Unkraut

**Tutorial-Video-Platzhalter:**
`tutorialVideoUrl: '/videos/jaeten.mp4'`

---

### 3.8 Bewässern

| Feld | Wert |
|------|------|
| **Phase** | Pflege |
| **Zeitraum** | Mai – September |
| **Icon** | 💦 |

**Ziel (Lern- & Praxisziel):**
- Regelmässige und bedarfsgerechte Bewässerung der Kulturen.
- Die Schüler:innen lernen den Wasserkreislauf und ressourcenschonenden Umgang mit Wasser.
- Lehrplanbezug: NMG.2.3, NMG.2.6.

**Materialliste:**

| Material | Menge | Quelle |
|----------|-------|--------|
| Giesskannen (10 Liter) | 4–6 Stück | Werkzeugschuppen |
| Gartenschlauch mit Brause | 1 Stück | Werkzeugschuppen |
| Wassertonne / Regenfass (optional) | 1 Stück | Baumarkt |
| Mulchmaterial (Stroh) | nach Bedarf | Bauernhof / Gartencenter |

**Vorgehen (Schritte):**

1. **Wann giessen?** Morgens oder abends — nie in der Mittagshitze
2. **Wie oft?** Abhängig von Wetter:
   - Heisse Tage (>25°C): täglich
   - Normaltage: alle 2–3 Tage
   - Nach Regen: Pause
3. **Wie viel?** Durchdringend giessen — lieber seltener, dafür richtig
4. Am Boden giessen, nicht über die Blätter (Pilzkrankheiten vermeiden)
5. Giessplan im Klassenzimmer aufhängen — Gruppen wechseln sich ab
6. In den Ferien: Giessplan an Hauswart/Eltern übergeben (→ Ferienaufgabe)
7. Mulch aufbringen, um Verdunstung zu reduzieren

**Tutorial-Video-Platzhalter:**
`tutorialVideoUrl: '/videos/bewaessern.mp4'`

---

### 3.9 Ernten

| Feld | Wert |
|------|------|
| **Phase** | Ernte |
| **Zeitraum** | Juli – Oktober |
| **Icon** | 🥕 |

**Ziel (Lern- & Praxisziel):**
- Die Schüler:innen ernten die selbst angebauten Gemüse und lernen, den richtigen Erntezeitpunkt zu erkennen.
- Dokumentation der Erntemengen (Wiegen, Zählen — Mathe-Integration).
- Lehrplanbezug: NMG.2.2, MA.3.A (Grössen, Funktionen — Wiegen, Messen).

**Materialliste:**

| Material | Menge | Quelle |
|----------|-------|--------|
| Erntekorb / Kisten | 4–6 Stück | Werkzeugschuppen |
| Gartenschere | 2–3 Stück | Werkzeugschuppen |
| Küchenwaage | 1–2 Stück | Schulküche |
| Ernteprotokoll (Arbeitsblatt) | 1 pro Gruppe | Plantoria-Material |
| Etiketten / Beschriftung | nach Bedarf | Schulmaterial |

**Vorgehen (Schritte):**

1. Erntezeitpunkt bestimmen:
   - Rübli: wenn Schulter aus der Erde ragt, ca. 10–12 Wochen nach Aussaat
   - Kohl: feste Köpfe, Kohlrabi wenn tennisballgross
   - Tomaten: vollständig rot/reif, leicht drehbar
   - Paprika: grün oder ausgefärbt (je nach Sorte)
   - Broccoli: vor dem Aufblühen ernten
   - Kräuter: laufend ernten, fördert Nachwachsen
2. Vorsichtig ernten — Pflanze nicht beschädigen
3. Ernte wiegen und im Ernteprotokoll dokumentieren
4. Ernte aufteilen: Schulküche, Schülerfamilien, Erntemarkt
5. Beete nach der Ernte aufräumen — Pflanzenreste kompostieren

**Tutorial-Video-Platzhalter:**
`tutorialVideoUrl: '/videos/ernten.mp4'`

---

## 4. Gemüsearten — Steckbriefe

### Vorgeschlagenes Interface: `VegetableProfile`

```typescript
interface VegetableProfile {
  id: string
  name: string
  scientificName?: string
  type: 'Gemüse' | 'Kräuter'
  difficulty: Difficulty  // 'Einfach' | 'Mittel' | 'Schwer'
  sowingIndoor?: { startMonth: number; endMonth: number }
  sowingOutdoor?: { startMonth: number; endMonth: number }
  harvestPeriod: { startMonth: number; endMonth: number }
  spacing: { inRow: number; betweenRows: number }  // in cm
  depth: number  // Saattiefe in cm
  germination: { tempMin: number; tempMax: number; days: number }
  waterNeed: 'Gering' | 'Mittel' | 'Hoch'
  nutrientNeed: 'Schwachzehrer' | 'Mittelzehrer' | 'Starkzehrer'
  companions: string[]     // gute Pflanzpartner
  antagonists: string[]    // schlechte Nachbarn
  specialNotes?: string    // Besonderheiten
  imageUrl?: string
}
```

---

### 4.1 Rübli (Karotten)

| Feld | Wert |
|------|------|
| **Name** | Rübli (Karotten) |
| **Wissenschaftlich** | *Daucus carota* |
| **Typ** | Gemüse |
| **Schwierigkeit** | Einfach |

**Anbauzeiten (Schweiz, Mittelland):**

| Phase | Zeitraum |
|-------|----------|
| Aussaat Outdoor | April – Juni |
| Ernte | Juli – Oktober |

**Pflanzabstände:**

| Parameter | Wert |
|-----------|------|
| In der Reihe | 3–5 cm |
| Reihenabstand | 20–25 cm |
| Saattiefe | 1–2 cm |

**Keimung:**
- Temperatur: 8–20 °C
- Keimdauer: 14–21 Tage (Langsamkeimer!)

**Pflege-Hinweise:**
- Wasserbedarf: Mittel — gleichmässig feucht halten
- Nährstoffbedarf: Mittelzehrer
- Boden regelmässig lockern, damit die Rüben gerade wachsen
- **Besonderheit:** Brauchen lockeren, steinfreien Boden. Bei schwerem Boden: kurze Sorten wählen (z.B. 'Pariser Markt') oder Hochbeet verwenden.

**Pflanzpartner:** Zwiebeln, Lauch, Tomaten, Erbsen, Salat
**Schlechte Nachbarn:** Dill, Sellerie

---

### 4.2 Kohl (Kohlrabi, Weisskohl)

| Feld | Wert |
|------|------|
| **Name** | Kohl (Kohlrabi, Weisskohl) |
| **Wissenschaftlich** | *Brassica oleracea* |
| **Typ** | Gemüse |
| **Schwierigkeit** | Mittel |

**Anbauzeiten (Schweiz, Mittelland):**

| Phase | Zeitraum |
|-------|----------|
| Aussaat Indoor | Februar – März |
| Auspflanzen | April – Mai |
| Ernte | Juni – Oktober |

**Pflanzabstände:**

| Parameter | Wert |
|-----------|------|
| In der Reihe | 30–40 cm (Kohlrabi: 25 cm) |
| Reihenabstand | 40–50 cm |
| Saattiefe | 1–2 cm |

**Keimung:**
- Temperatur: 15–20 °C
- Keimdauer: 5–10 Tage

**Pflege-Hinweise:**
- Wasserbedarf: Hoch — Kohl ist durstig
- Nährstoffbedarf: Starkzehrer — regelmässig düngen
- Kulturschutznetz gegen Kohlfliege und Kohlweissling obligatorisch!
- **Besonderheit:** Kohlhernie vermeiden — nicht nach anderem Kohl anbauen (Fruchtfolge beachten).

**Pflanzpartner:** Sellerie, Tomaten, Spinat, Erbsen
**Schlechte Nachbarn:** Erdbeeren, anderer Kohl, Zwiebeln

---

### 4.3 Tomaten

| Feld | Wert |
|------|------|
| **Name** | Tomaten |
| **Wissenschaftlich** | *Solanum lycopersicum* |
| **Typ** | Gemüse |
| **Schwierigkeit** | Mittel |

**Anbauzeiten (Schweiz, Mittelland):**

| Phase | Zeitraum |
|-------|----------|
| Aussaat Indoor | Mitte Februar – März |
| Auspflanzen | Mitte Mai (nach Eisheiligen) |
| Ernte | Juli – September |

**Pflanzabstände:**

| Parameter | Wert |
|-----------|------|
| In der Reihe | 50 cm |
| Reihenabstand | 60–80 cm |
| Saattiefe | 0.5–1 cm |

**Keimung:**
- Temperatur: 20–25 °C
- Keimdauer: 7–14 Tage

**Pflege-Hinweise:**
- Wasserbedarf: Hoch — regelmässig, aber nicht über die Blätter
- Nährstoffbedarf: Starkzehrer — alle 2 Wochen düngen ab Fruchtbildung
- Ausgeizen: Seitentriebe in Blattachseln regelmässig entfernen
- Stütze: An Stäben oder Schnüren hochbinden
- **Besonderheit:** Kälteempfindlich! Erst nach Eisheiligen (15. Mai) ins Freie. Regen/Nässe auf Blättern fördert Braunfäule — Regenschutz empfohlen.

**Pflanzpartner:** Basilikum, Karotten, Sellerie, Petersilie
**Schlechte Nachbarn:** Kartoffeln, Fenchel, Erbsen

---

### 4.4 Paprika / Chili

| Feld | Wert |
|------|------|
| **Name** | Paprika / Chili |
| **Wissenschaftlich** | *Capsicum annuum* |
| **Typ** | Gemüse |
| **Schwierigkeit** | Schwer |

**Anbauzeiten (Schweiz, Mittelland):**

| Phase | Zeitraum |
|-------|----------|
| Aussaat Indoor | Anfang Februar |
| Auspflanzen | Mitte Mai (nach Eisheiligen) |
| Ernte | August – Oktober |

**Pflanzabstände:**

| Parameter | Wert |
|-----------|------|
| In der Reihe | 40 cm |
| Reihenabstand | 50 cm |
| Saattiefe | 0.5 cm |

**Keimung:**
- Temperatur: 22–28 °C (braucht Wärme!)
- Keimdauer: 10–21 Tage

**Pflege-Hinweise:**
- Wasserbedarf: Hoch — gleichmässig feucht, nicht staunass
- Nährstoffbedarf: Starkzehrer — wöchentlich düngen während Fruchtbildung
- Königsblüte (erste Blüte) ausbrechen → fördert Verzweigung
- **Besonderheit:** Braucht viel Wärme und eine lange Vegetationsperiode. In der Schweiz eher anspruchsvoll — geschützter, sonniger Standort nötig. Im Hochbeet oder vor einer Südwand am besten.

**Pflanzpartner:** Tomaten, Basilikum, Karotten
**Schlechte Nachbarn:** Fenchel, Kartoffeln

---

### 4.5 Broccoli / Blumenkohl

| Feld | Wert |
|------|------|
| **Name** | Broccoli / Blumenkohl |
| **Wissenschaftlich** | *Brassica oleracea var. italica / botrytis* |
| **Typ** | Gemüse |
| **Schwierigkeit** | Mittel |

**Anbauzeiten (Schweiz, Mittelland):**

| Phase | Zeitraum |
|-------|----------|
| Aussaat Indoor | Mitte März – April |
| Auspflanzen | Mai |
| Ernte | Juli – September |

**Pflanzabstände:**

| Parameter | Wert |
|-----------|------|
| In der Reihe | 45–50 cm |
| Reihenabstand | 50–60 cm |
| Saattiefe | 1 cm |

**Keimung:**
- Temperatur: 15–20 °C
- Keimdauer: 5–10 Tage

**Pflege-Hinweise:**
- Wasserbedarf: Hoch — besonders während Kopfbildung
- Nährstoffbedarf: Starkzehrer — Kompost und Nachdüngung wichtig
- Kulturschutznetz gegen Kohlweissling
- Broccoli: Seitentriebe nach dem Ernten des Hauptkopfes weiter nutzen
- **Besonderheit:** Blumenkohl-Kopf vor Sonne schützen (Blätter darüber knicken) für weisse Farbe. Broccoli vor dem Aufblühen ernten!

**Pflanzpartner:** Sellerie, Erbsen, Kartoffeln, Dill
**Schlechte Nachbarn:** Erdbeeren, Tomaten, anderer Kohl

---

### 4.6 Kräuter (Basilikum, Petersilie, Schnittlauch)

| Feld | Wert |
|------|------|
| **Name** | Kräuter (Basilikum, Petersilie, Schnittlauch) |
| **Typ** | Kräuter |
| **Schwierigkeit** | Einfach |

**Anbauzeiten (Schweiz, Mittelland):**

| Kraut | Aussaat | Ernte |
|-------|---------|-------|
| Basilikum | Indoor ab März, Outdoor ab Mitte Mai | Juni – September |
| Petersilie | Outdoor ab März | Mai – Oktober |
| Schnittlauch | Outdoor ab März (mehrjährig!) | April – Oktober |

**Pflanzabstände:**

| Kraut | In Reihe | Reihenabstand | Saattiefe |
|-------|----------|---------------|-----------|
| Basilikum | 20 cm | 25 cm | Lichtkeimer (auf Erde) |
| Petersilie | 15 cm | 20 cm | 1–2 cm |
| Schnittlauch | 15 cm | 20 cm | 1 cm |

**Pflege-Hinweise:**
- Basilikum: Wärmeliebend, erst nach Eisheiligen raus. Blüten ausknipsen für buschigen Wuchs.
- Petersilie: Langsamkeimer (3–4 Wochen). Halbschatten tolerant.
- Schnittlauch: Mehrjährig, sehr pflegeleicht. Regelmässig schneiden fördert Nachwuchs.
- Alle: Wasserbedarf Mittel, Nährstoffbedarf Schwachzehrer.
- **Besonderheit:** Kräuter sind ideal als Einstiegs-Kultur für Schulkinder — schneller Erfolg, vielseitig einsetzbar (Schulküche, Pausensnack).

**Pflanzpartner:** Tomaten (Basilikum!), Karotten, nahezu alles
**Schlechte Nachbarn:** Wenige — Kräuter sind gute Nachbarn für fast alle Gemüse

---

## 5. Vorprojekte

Vorprojekte sind einmalige Aktivitäten, die **vor dem Jahreszyklus** erledigt werden müssen. Sie werden im bestehenden `PreProject`-Interface abgebildet.

### 5.1 Hochbeet bauen

| Feld | Wert |
|------|------|
| **Kategorie** | Infrastruktur |
| **Einmalig** | Ja |
| **Dauer** | ca. 2–3 Unterrichtslektionen |
| **Schwierigkeit** | Mittel |

**Materialliste:**

| Material | Menge | Quelle | Geschätzte Kosten |
|----------|-------|--------|-------------------|
| Lärchen- oder Douglasienholz (Bretter 30×200 cm) | 8 Stück | Holzhandel / Baumarkt | CHF 120–160 |
| Schrauben (rostfrei, 6×80 mm) | 40 Stück | Baumarkt | CHF 15 |
| Teichfolie (Noppenfolie) | 3 m² | Baumarkt | CHF 20 |
| Drahtgitter (Wühlmausschutz) | 1 m² | Baumarkt | CHF 10 |
| Akkuschrauber | 1 Stück | Werkraum | — |
| Wasserwaage | 1 Stück | Werkraum | — |
| Kompost, Äste, Laub (Füllung) | diverse | Schulgelände / Kompost | — |
| Erde (Hochbeeterde) | 200 Liter | Gartencenter | CHF 40–60 |

**Vorgehen (Schritte):**

1. Standort bestimmen: sonnig (min. 6h Sonne), ebener Untergrund, Wasserzugang in der Nähe
2. Grundfläche abstecken (z.B. 200×100 cm)
3. Wühlmausgitter auf den Boden legen
4. Bretter zu einem Rahmen verschrauben (2–3 Lagen hoch, ca. 60–80 cm)
5. Innenseite mit Noppenfolie auskleiden (Holzschutz, keine Staunässe)
6. Schichtung einfüllen:
   - Unterste Schicht: grobe Äste und Zweige (20 cm)
   - Mittlere Schicht: Laub, Rasenschnitt, halbverrotteter Kompost (20 cm)
   - Oberste Schicht: Hochbeeterde / Gartenerde-Kompost-Mix (20–30 cm)
7. Oberfläche glattziehen und einige Tage setzen lassen

**Mapping auf PreProjectItem:**

```typescript
{
  id: 'ppi-hb-1', category: 'Infrastruktur',
  label: 'Hochbeet bauen', completed: false
}
// + zugehörige Material-Items:
{
  id: 'ppi-hb-2', category: 'Baumaterial',
  label: 'Holz für Hochbeet (Lärche/Douglasie)', completed: false,
  orderUrl: 'https://example.com/holz'
}
// etc.
```

---

### 5.2 Beet anlegen

| Feld | Wert |
|------|------|
| **Kategorie** | Infrastruktur |
| **Einmalig** | Ja |
| **Dauer** | ca. 2 Unterrichtslektionen |
| **Schwierigkeit** | Einfach |

**Materialliste:**

| Material | Menge | Quelle | Geschätzte Kosten |
|----------|-------|--------|-------------------|
| Spaten | 4–6 Stück | Werkzeugschuppen | — |
| Grabgabel | 2–3 Stück | Werkzeugschuppen | — |
| Schnur + Pflöcke | nach Bedarf | Baumarkt | CHF 10 |
| Kompost | 100 Liter | Schulkompost / Gärtnerei | CHF 20–30 |
| Rasenkantensteine oder Bretter (Einfassung) | nach Bedarf | Baumarkt | CHF 30–50 |
| Holzschnitzel (für Wege) | 100 Liter | Hauswart / Gärtnerei | CHF 10–20 |

**Vorgehen (Schritte):**

1. Fläche gemäss Beetplan mit Schnur und Pflöcken abstecken
2. Grasnarbe abtragen (falls Rasen): ca. 5 cm tief mit Spaten abschälen
3. Boden spatentief umgraben (ca. 25–30 cm)
4. Steine und grobe Wurzeln entfernen
5. Kompost einarbeiten (5–10 cm Schicht)
6. Oberfläche mit Rechen glattziehen
7. Beeteinfassung setzen (Steine oder Bretter)
8. Wege zwischen den Beeten mit Holzschnitzeln auslegen
9. Beete beschriften (temporäre Schilder)

**Mapping auf PreProjectItem:**

```typescript
{
  id: 'ppi-ba-1', category: 'Infrastruktur',
  label: 'Beet anlegen (Bodenfläche)', completed: false
}
// + zugehörige Material- und Praxisauftrag-Items
```

---

## 6. Datenmodell-Vorschläge

### 6.1 Erweiterung des `Task`-Interface

Das bestehende `Task`-Interface (in `src/types/index.ts`) wird um folgende optionale Felder erweitert:

```typescript
interface Task {
  // ... bestehende Felder ...

  // NEU: Erweiterte Aktivitätsdaten
  tutorialVideoUrl?: string       // URL zum Tutorial-Video
  materialList?: TaskMaterial[]    // Strukturierte Materialliste
  steps?: string[]                // Vorgehen als Schritt-für-Schritt-Anleitung
  goalDescription?: string        // Lern- und Praxisziel (Freitext)
}

interface TaskMaterial {
  name: string
  quantity: string
  source: string
  cost?: string
}
```

**Begründung:**
- `tutorialVideoUrl`: Jede Aktivität hat ein zugeordnetes Erklärvideo. Wird neben der Aktivitätsbeschreibung eingebettet.
- `materialList`: Strukturierte Liste statt Freitext ermöglicht Anzeige als Tabelle und spätere Bestellfunktion.
- `steps`: Ermöglicht Checklisten-Darstellung im UI (einzelne Schritte abhaken).
- `goalDescription`: Lernziele und Praxisziele, relevant für LP21-Verknüpfung.

### 6.2 Neues Interface: `VegetableProfile`

```typescript
interface VegetableProfile {
  id: string
  name: string
  scientificName?: string
  type: 'Gemüse' | 'Kräuter'
  difficulty: Difficulty
  sowingIndoor?: { startMonth: number; endMonth: number }
  sowingOutdoor?: { startMonth: number; endMonth: number }
  harvestPeriod: { startMonth: number; endMonth: number }
  spacing: {
    inRow: number        // cm
    betweenRows: number  // cm
  }
  depth: number          // Saattiefe in cm
  germination: {
    tempMin: number      // °C
    tempMax: number      // °C
    days: number         // Keimdauer
  }
  waterNeed: 'Gering' | 'Mittel' | 'Hoch'
  nutrientNeed: 'Schwachzehrer' | 'Mittelzehrer' | 'Starkzehrer'
  companions: string[]
  antagonists: string[]
  specialNotes?: string
  imageUrl?: string
}
```

**Fixture-Daten:** Neue Datei `src/data/fixtures/vegetables.ts` mit den 6 Steckbriefen aus [Sektion 4](#4-gemüsearten--steckbriefe).

### 6.3 Erweiterung des `Culture`-Interface

```typescript
interface Culture {
  // ... bestehende Felder ...

  // NEU: Verknüpfung zum Gemüse-Steckbrief
  vegetableProfileId?: string  // Referenz auf VegetableProfile.id
}
```

### 6.4 Neues Interface: `ActivityDefinition`

Für die Darstellung im Gantt-Chart und den Aktivitätskarten:

```typescript
interface ActivityDefinition {
  id: string
  name: string
  phase: ProjectPhase
  startMonth: number     // 1-basiert (1=Jan, 12=Dez)
  endMonth: number
  icon: string           // z.B. '📋', '🌱', '🛡' etc.
  color: string          // Tailwind-Klasse, z.B. 'bg-blue-400'
  goalDescription: string
  materials: TaskMaterial[]
  steps: string[]
  tutorialVideoUrl?: string
  lp21Refs: string[]
}
```

**Fixture-Daten:** Neue Datei `src/data/fixtures/activities.ts` mit den 9 Aktivitäten.

### 6.5 Timeline-Daten (Ersatz für hardcoded Array)

Aktuell in `[id].vue`:

```typescript
// IST-Zustand (hardcoded, nur 5 Phasen)
const timelinePhases = [
  { name: 'Planung', start: 1, end: 3, color: 'bg-blue-400' },
  { name: 'Pflanzung', start: 3, end: 5, color: 'bg-green-400' },
  // ...
]
```

**SOLL-Zustand:** Dynamisch aus `ActivityDefinition[]` generiert:

```typescript
// Wird aus Fixture / Store geladen
const activities: ActivityDefinition[] = useProjectsStore().getActivitiesByProjectId(projectId)

// Gantt-Daten werden daraus abgeleitet
const ganttBars = computed(() =>
  activities.map(a => ({
    label: a.name,
    start: a.startMonth,
    end: a.endMonth,
    color: a.color,
    id: a.id,
  }))
)
```

---

## 7. UI-Konzept (Wireframe-Beschreibung)

### 7.1 Page-Layout

Die überarbeitete Projektseite folgt einem vertikalen Single-Page-Layout mit Scroll-Ankernavigation:

```
┌──────────────────────────────────────────────────────────┐
│ ← Projekte                                               │
│                                                          │
│ Gemüsefläche HE24a                                       │
│ Status: [Laufend ▾]  Phase: [Pflanzung ▾]  Fläche: 10m² │
│ ████████████████████████░░░░░░░░░░ 60%                   │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ ╔══════════════════════════════════════════════════════╗  │
│ ║            ZEITSTRAHL (Hero-Element)                 ║  │
│ ║                                                      ║  │
│ ║  Gantt-Chart: 9 Balken über Jan–Dez                 ║  │
│ ║  [Beetplan][Beetvorb.][Jungpfl.][Aussäen]...        ║  │
│ ║            ▼ Heute-Marker                           ║  │
│ ║                                                      ║  │
│ ║  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                   ║  │
│ ║  │ Jan │ │ Feb │ │ Mrz │ │ Apr │ ...               ║  │
│ ║  │     │ │     │ │     │ │     │                    ║  │
│ ║  └─────┘ └─────┘ └─────┘ └─────┘                   ║  │
│ ╚══════════════════════════════════════════════════════╝  │
│                                                          │
├──────────────────────────────────────────────────────────┤
│  Tabs: [Aktivitäten] [Kulturen] [Gruppen] [Vorprojekt]  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Tab: Aktivitäten (Accordion)                            │
│  ┌─ PLANUNG ─────────────────────────────────────────┐   │
│  │ ▸ Beetplanung                         Jan–Feb     │   │
│  └───────────────────────────────────────────────────┘   │
│  ┌─ PFLANZUNG ───────────────────────────────────────┐   │
│  │ ▸ Beetvorbereitung                    Mrz–Apr     │   │
│  │ ▸ Jungpflanzen anziehen               Feb–Apr     │   │
│  │ ▸ Aussäen / Auspflanzen               Apr–Mai     │   │
│  └───────────────────────────────────────────────────┘   │
│  ┌─ PFLEGE ──────────────────────────────────────────┐   │
│  │ ▸ Kulturschutz                        Mai–Sep     │   │
│  │ ▸ Düngen                              Mai–Aug     │   │
│  │ ▸ Jäten                               Mai–Sep     │   │
│  │ ▸ Bewässern                           Mai–Sep     │   │
│  └───────────────────────────────────────────────────┘   │
│  ┌─ ERNTE ───────────────────────────────────────────┐   │
│  │ ▸ Ernten                              Jul–Okt     │   │
│  └───────────────────────────────────────────────────┘   │
│                                                          │
│  Aufgeklappte Aktivität:                                 │
│  ┌───────────────────────────────────────────────────┐   │
│  │ ▾ Beetvorbereitung              🌱 Mrz–Apr        │   │
│  │                                                    │   │
│  │ Ziel:                                              │   │
│  │ Die Fläche wird nach dem Winter für die neue       │   │
│  │ Saison vorbereitet...                              │   │
│  │                                                    │   │
│  │ Schritte:                          ▶ Video         │   │
│  │ □ Beete von Laub befreien                          │   │
│  │ □ Unkraut jäten                                    │   │
│  │ ☑ Boden spatentief lockern                         │   │
│  │ □ Boden-pH testen...                               │   │
│  │                                                    │   │
│  │ Material:                                          │   │
│  │ ┌──────────┬────────┬───────────────┐              │   │
│  │ │ Material │ Menge  │ Quelle        │              │   │
│  │ ├──────────┼────────┼───────────────┤              │   │
│  │ │ Spaten   │ 4–6 St │ Werkzeugsch.  │              │   │
│  │ │ Kompost  │ 100 L  │ Schulkompost  │              │   │
│  │ └──────────┴────────┴───────────────┘              │   │
│  └───────────────────────────────────────────────────┘   │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Tab: Kulturen (Grid)                                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ 🥕       │ │ 🥬       │ │ 🍅       │ │ 🌶       │   │
│  │ Rübli    │ │ Kohl     │ │ Tomaten  │ │ Paprika  │   │
│  │ Beet 1   │ │ Beet 2   │ │ Beet 3   │ │ Beet 3   │   │
│  │ Wächst   │ │ Wächst   │ │ Gesät    │ │ Gesät    │   │
│  │ ████░ 80%│ │ ███░ 50% │ │ █░░ 20% │ │ █░░ 15% │   │
│  │          │ │          │ │          │ │          │   │
│  │ [Steckbrief →]        │ │          │ │          │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
│  ┌──────────┐ ┌──────────┐                               │
│  │ 🥦       │ │ 🌿       │                               │
│  │ Broccoli │ │ Kräuter  │                               │
│  │ Beet 4   │ │ Beet 4   │                               │
│  │ Gesät    │ │ Erntereif│                               │
│  │ █░░ 15% │ │ █████ 90%│                               │
│  └──────────┘ └──────────┘                               │
│                                                          │
│  Kultur-Steckbrief (Modal oder Inline-Expand):           │
│  ┌──────────────────────────────────────────────────┐    │
│  │ 🥕 Rübli (Daucus carota)          Einfach       │    │
│  │                                                   │    │
│  │ Aussaat: Apr–Jun   Ernte: Jul–Okt               │    │
│  │ Abstand: 3–5cm / 20–25cm   Tiefe: 1–2cm        │    │
│  │ Wasser: Mittel   Nährstoffe: Mittelzehrer       │    │
│  │                                                   │    │
│  │ Partner: Zwiebeln, Lauch, Tomaten                │    │
│  │ Meiden:  Dill, Sellerie                          │    │
│  │                                                   │    │
│  │ Hinweis: Braucht lockeren, steinfreien Boden.    │    │
│  └──────────────────────────────────────────────────┘    │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Tab: Vorprojekt (Checklist)                             │
│  Status: Abgeschlossen   ████████████████████ 100%       │
│                                                          │
│  INFRASTRUKTUR                                           │
│  ☑ Hochbeet bauen                                        │
│  ☑ Beet anlegen                                          │
│                                                          │
│  MATERIAL                                                │
│  ☑ Saatgut (Rübli, Kohl, Kräuter)                       │
│  ☑ Erde und Kompost                                      │
│  ☑ Werkzeug (Schaufeln, Giesskannen)                    │
│  ...                                                     │
└──────────────────────────────────────────────────────────┘
```

### 7.2 Tab-Struktur (überarbeitet)

| Tab | Inhalt | Komponente |
|-----|--------|------------|
| **Aktivitäten** | 9 Aktivitäten als Accordion, gruppiert nach Phase | Ersetzt bisheriges "Aufgaben"-Tab |
| **Kulturen** | Gemüsekarten-Grid mit Link zu Steckbrief | Wie bisher, erweitert um Steckbrief-Modal |
| **Gruppen** | Gruppenübersicht mit Aufgabenzuordnung | Unverändert |
| **Vorprojekt** | Checkliste mit Hochbeet/Beet als neue Items | Erweitert |

**Änderungen gegenüber aktuellem Stand:**
- Tab "Aufgaben" → wird zu "Aktivitäten" (Accordion statt flacher Liste)
- Tab "Zeitstrahl" → entfällt als eigenes Tab, wird zum Hero-Element (immer sichtbar)
- Tab "Kulturen" → erweitert um Steckbrief-Detail (Modal oder Inline)
- Tab "Vorprojekt" → erweitert um Hochbeet/Beet-Items mit Anleitungen

### 7.3 Responsive-Verhalten

| Breakpoint | Verhalten |
|------------|-----------|
| **Desktop** (≥1024px) | Gantt-Chart voll sichtbar, Monats-Grid 4 Spalten, Kulturen-Grid 4 Spalten |
| **Tablet** (≥768px) | Gantt-Chart scrollbar, Monats-Grid 2 Spalten, Kulturen-Grid 2 Spalten |
| **Mobile** (<768px) | Gantt-Chart horizontal scrollbar (min-width 800px), Monats-Grid 1 Spalte, Kulturen-Grid 1 Spalte, Accordion-Aktivitäten |

### 7.4 Interaktionen

| Interaktion | Beschreibung |
|-------------|-------------|
| Klick auf Gantt-Balken | Smooth-Scroll zum entsprechenden Accordion-Element, öffnet es |
| Klick auf Monats-Karte | Filtert Aktivitäten-Accordion auf diesen Monat |
| Klick auf Kultur-Karte | Öffnet Steckbrief als Modal (UModal) |
| Accordion öffnen | Zeigt Ziel, Schritte (Checklist), Material-Tabelle, Video-Button |
| Video-Button | Öffnet eingebetteten Video-Player (oder Platzhalter) |
| Schritte abhaken | Togglet Task-Status im Store (pro Schritt) |

---

## Anhang: Verifikations-Checkliste

- [x] Dokumentation enthält alle 9 Aktivitäten mit Ziel/Material/Vorgehen/Zeitpunkt
- [x] Zeitstrahl-Konzept (Gantt + Monats-Detail) ist klar beschrieben mit ASCII-Diagrammen
- [x] 6 Gemüsearten-Steckbriefe sind vollständig (Rübli, Kohl, Tomaten, Paprika/Chili, Broccoli/Blumenkohl, Kräuter)
- [x] 2 Vorprojekte sind dokumentiert (Hochbeet bauen, Beet anlegen) mit Material und Schritten
- [x] Datenmodell-Vorschläge sind konsistent mit bestehenden Types (`src/types/index.ts`)
- [x] UI-Konzept beschreibt die neue Seitenstruktur mit ASCII-Wireframes
- [x] Alle Anbaudaten basieren auf Schweizer Mittelland-Bedingungen
- [x] LP21-Lehrplanbezüge sind bei jeder Aktivität dokumentiert
