# PLANTORIA -- Lehrpersonen-Ansicht: UI/UX-Planung

> Zentrales Verwaltungstool fuer Lehrpersonen -- alle Funktionen ueber eine Sidebar + Content-Ansicht erreichbar.

---

## 1. Uebersicht und Ziele

### Zielgruppe

Lehrpersonen der Primarschule (1.--6. Klasse), die Schulgarten-Projekte mit ihrer Klasse durchfuehren.

### Kernziele der Ansicht

- Projekte und Aufgaben verwalten, ohne den Ueberblick zu verlieren
- Lehrmaterial nach Fachbereich und Phase finden und herunterladen
- LP21-Fortschritt automatisch tracken -- kein manuelles Eintragen
- Schueler und Gruppen zentral organisieren
- Templates nutzen, erweitern und mit anderen Schulen teilen
- Harvest-Maerkte planen und Termine im Blick behalten

### Design-Prinzipien

| Prinzip | Beschreibung |
|---------|-------------|
| Effizienz | Maximal 3 Klicks zu jeder Kernfunktion |
| Klarheit | Informationen auf einen Blick erfassbar, keine Ueberladung |
| Konsistenz | Gleiche Muster fuer Listen, Karten, Filter und Aktionen |
| Kontextbezug | Saisonale Inhalte und phasenabhaengige Hinweise automatisch anzeigen |

---

## 2. Globales Layout

### Struktur: Sidebar + Content

```
+--------+------------------------------------------------+
| LOGO   |  Header: Seitentitel         [Glocke] [Avatar] |
+--------+------------------------------------------------+
|        |                                                |
| Side-  |                                                |
| bar    |           Content-Bereich                      |
|        |                                                |
| - Dash |           (wechselt je nach                    |
| - Proj |            aktivem Menue-Punkt)                |
| - Fach |                                                |
| - Lehr |                                                |
| - Schue|                                                |
| - Temp |                                                |
| - LP21 |                                                |
| - Kale |                                                |
| - Harv |                                                |
| - Einst|                                                |
|        |                                                |
+--------+------------------------------------------------+
```

### Sidebar-Navigation

Die Sidebar ist dauerhaft sichtbar und enthaelt folgende Menue-Punkte:

| # | Menue-Punkt | Icon | Beschreibung |
|---|-------------|------|-------------|
| 1 | Dashboard | LayoutDashboard | Startseite mit Uebersicht |
| 2 | Projekte | FolderKanban | Projektverwaltung |
| 3 | Fachbereiche | BookOpen | Wissen nach Themengebiet |
| 4 | Lehrmaterial | FileDown | Arbeitsblaetter und Downloads |
| 5 | Schueler | Users | Schueler- und Gruppenverwaltung |
| 6 | Templates | LayoutTemplate | Projekt-Templates verwalten und teilen |
| 7 | Lehrplan 21 | GraduationCap | LP21-Fortschritts-Tracking |
| 8 | Kalender | CalendarDays | Termine, Deadlines, saisonale Hinweise |
| 9 | Harvest-Maerkte | Store | Maerkte planen und verwalten |
| 10 | Einstellungen | Settings | Profil, Klasse, Benachrichtigungen |

Am unteren Rand der Sidebar:

```
+--------+
| ...    |
|--------|
| [?]    |  Hilfe / Onboarding
| [Exit] |  Logout
+--------+
```

### Header

```
+------------------------------------------------------------------+
|  Seitentitel                              [Glocke 3] [Anna M. v] |
+------------------------------------------------------------------+
```

- **Seitentitel:** Wechselt dynamisch je nach aktivem Bereich (z.B. "Dashboard", "Projekte > Gemueseflaeche HE24a")
- **Benachrichtigungen (Glocke):** Badge mit Anzahl ungelesener Meldungen -- Klick oeffnet Dropdown
- **Profil-Avatar:** Klick oeffnet Dropdown mit Profil, Klasse wechseln, Logout

### Benachrichtigungen (Dropdown)

```
+------------------------------------------+
| Benachrichtigungen                       |
+------------------------------------------+
| * Neue Aufgabe faellig: Boden testen     |
|   Projekt: Gemueseflaeche  |  Heute     |
|------------------------------------------|
| * Template importiert: Hochbeet v2       |
|   Von: Schule Zug  |  Gestern           |
|------------------------------------------|
|   Saisonaler Hinweis: Tomaten vorziehen  |
|   Mai -- jetzt ist der richtige Zeitpunkt|
|------------------------------------------|
| [Alle anzeigen]                          |
+------------------------------------------+
```

**Typen von Benachrichtigungen:**

| Typ | Beispiel |
|-----|----------|
| Aufgaben-Erinnerung | "Aufgabe 'Boden testen' ist heute faellig" |
| Saisonaler Hinweis | "Mai: Tomaten und Gurken koennen jetzt ins Freiland" |
| Template-Update | "Neues Template verfuegbar: Bienenstock v3" |
| Harvest-Markt | "Anmeldefrist Herbst-Harvest-Markt endet in 7 Tagen" |
| LP21-Meilenstein | "50% LP21-Abdeckung erreicht in NMG" |
| System | "Neues Feature: Arbeitsblaetter jetzt auch als DOCX" |

---

## 3. Bereiche im Detail

---

### 3.1 Dashboard

> Startseite nach dem Login -- Ueberblick ueber alles Wichtige auf einen Blick.

```
+--------+------------------------------------------------------------------+
| Side-  |  Dashboard                            [Glocke 3] [Anna M. v]    |
| bar    |------------------------------------------------------------------|
|        |                                                                  |
| [Dash] |  Willkommen, Anna!           Klasse: HE24a  |  Schuljahr 25/26 |
| Proj   |                                                                  |
| Fach   |  +---------------------------+ +-------------------------------+ |
| Lehr   |  | Aktive Projekte        2  | | LP21-Fortschritt              | |
| Schue  |  |                           | |                               | |
| Temp   |  | Gemueseflaeche   Laufend  | | NMG:  ========----  60%       | |
| LP21   |  | Phase: Pflanzung    60%   | | MA:   ====--------  30%       | |
| Kale   |  |                           | | TTG:  ==----------  15%       | |
| Harv   |  | Bienenstock    Vorprojekt | | Gesamt: ======----  45%       | |
| Einst  |  | Phase: Planung      20%   | |                               | |
|        |  +---------------------------+ +-------------------------------+ |
|        |                                                                  |
|        |  +---------------------------+ +-------------------------------+ |
|        |  | Naechste Aufgaben         | | Saisonale Hinweise            | |
|        |  |                           | |                               | |
|        |  | [ ] Boden testen    Heute | | Mai: Tomaten ins Freiland     | |
|        |  | [ ] Setzlinge     Mo 12.5 | | Mai: Kartoffeln anhaeufeln    | |
|        |  | [ ] Giessplan     Mi 14.5 | | Jun: Erdbeeren ernten         | |
|        |  |                           | |                               | |
|        |  | [Alle Aufgaben]           | | [Saisonkalender]              | |
|        |  +---------------------------+ +-------------------------------+ |
|        |                                                                  |
|        |  +---------------------------+ +-------------------------------+ |
|        |  | Letzte Downloads          | | Kalender (Woche)              | |
|        |  |                           | |                               | |
|        |  | Bodentypen.pdf   08.05.   | | Mo: --                        | |
|        |  | pH-Wert.pdf      06.05.   | | Di: Pflanzaktion Beet 2       | |
|        |  | Mischkultur.docx 03.05.   | | Mi: Giessplan umsetzen        | |
|        |  |                           | | Do: --                        | |
|        |  | [Alle Downloads]          | | Fr: Harvest-Markt Anmeldung   | |
|        |  +---------------------------+ +-------------------------------+ |
|        |                                                                  |
+--------+------------------------------------------------------------------+
```

**Dashboard-Karten:**

| Karte | Inhalt | Aktion |
|-------|--------|--------|
| Aktive Projekte | Projektname, Phase, Fortschritt (max. 3) | Klick -> Projektdetail |
| LP21-Fortschritt | Balken pro Fachbereich + Gesamtfortschritt | Klick -> LP21-Tracking |
| Naechste Aufgaben | Faellige Aufgaben nach Datum (max. 5) | Klick -> Aufgabendetail |
| Saisonale Hinweise | Automatische Tipps je nach Monat/Jahreszeit | Klick -> Fachbereich |
| Letzte Downloads | Zuletzt heruntergeladene Arbeitsblaetter (max. 5) | Klick -> erneut downloaden |
| Kalender (Woche) | Kompakte Wochenansicht mit Terminen | Klick -> Kalender |

---

### 3.2 Projektverwaltung

> Alle Projekte der Klasse erstellen, verwalten und im Detail steuern.

#### Projektliste

```
+------------------------------------------------------------------+
|  Projekte                                 [+ Neues Projekt]      |
|------------------------------------------------------------------|
|  Filter: [Alle Status v] [Alle Phasen v]       Suche: [_______] |
|------------------------------------------------------------------|
|                                                                  |
|  +------------------------------------------------------------+ |
|  | Gemueseflaeche HE24a                                       | |
|  | Status: Laufend  |  Phase: Pflanzung  |  Flaeche: 10m2     | |
|  | Fortschritt: ============------  60%                        | |
|  | Aufgaben: 8/15 erledigt  |  Gruppen: 4                     | |
|  | [Oeffnen]  [Aufgaben]  [Material]                           | |
|  +------------------------------------------------------------+ |
|                                                                  |
|  +------------------------------------------------------------+ |
|  | Bienenstock HE24a                                          | |
|  | Status: Vorprojekt  |  Phase: Planung  |  Flaeche: --      | |
|  | Fortschritt: =====--------------  20%                       | |
|  | Vorprojekt: 4/10 Voraussetzungen erfuellt                   | |
|  | [Oeffnen]  [Vorprojekt]  [Material]                         | |
|  +------------------------------------------------------------+ |
|                                                                  |
+------------------------------------------------------------------+
```

#### Neues Projekt erstellen (Wizard)

**Schritt 1: Template waehlen oder manuell starten**

```
+------------------------------------------+
|  Neues Projekt erstellen                 |
+------------------------------------------+
|                                          |
|  ( ) Aus Template erstellen              |
|      [Template waehlen v]                |
|                                          |
|  ( ) Manuell erstellen                   |
|                                          |
|  [Abbrechen]              [Weiter ->]   |
+------------------------------------------+
```

**Schritt 2: Projektdaten erfassen**

```
+------------------------------------------+
|  Projektdaten                            |
+------------------------------------------+
|                                          |
|  Name:        [HE24a - Gemueseflaeche ] |
|  Beschreibung:[_____________________ ]  |
|  Flaeche m2:  [10                     ] |
|  Standort:    [Hinter Schulhaus, Sued ] |
|                                          |
|  [<- Zurueck]             [Erstellen]   |
+------------------------------------------+
```

#### Projektdetail-Ansicht

```
+------------------------------------------------------------------+
|  Projekte > Gemueseflaeche HE24a                                 |
|------------------------------------------------------------------|
|                                                                  |
|  Status: [Laufend v]   Phase: [Pflanzung v]   Flaeche: 10m2     |
|  Fortschritt: ============------  60%                             |
|                                                                  |
|  [Aufgaben]  [Zeitstrahl]  [Kulturen]  [Gruppen]  [Vorprojekt]  |
|  ----------------------------------------------------------------|
|                                                                  |
|  Tab: Aufgaben                                                   |
|  Filter: [Alle Phasen v]  [Alle Status v]  [Alle Gruppen v]     |
|                                                                  |
|  Phase: Pflanzung                                                |
|  +------------------------------------------------------------+ |
|  | [x] Boden vorbereiten         Gruppe Sonnenblume  Erledigt | |
|  | [x] Saeen nach Beetplan       Gruppe Loewenzahn   Erledigt | |
|  | [ ] Setzlinge einpflanzen     Gruppe Sonnenblume  Offen    | |
|  | [ ] Beete beschriften          --                 Offen    | |
|  +------------------------------------------------------------+ |
|                                                                  |
|  Phase: Pflege                                                   |
|  +------------------------------------------------------------+ |
|  | [ ] Giessplan erstellen        --                 Offen    | |
|  | [ ] Unkraut jaeten (Woche 20)  --                 Offen    | |
|  +------------------------------------------------------------+ |
|                                                                  |
|  [+ Neue Aufgabe]                                                |
+------------------------------------------------------------------+
```

#### Tab: Zeitstrahl

```
|  Jan  Feb  Mrz  Apr  Mai  Jun  Jul  Aug  Sep  Okt  Nov  Dez    |
|  -------*-----------*----------*---------*------*-------------- |
|         |           |          |         |      |               |
|      Planung    Pflanzung   Pflege    Ernte  Verarbeitung       |
|                       ^                                          |
|                    Heute                                         |
|                                                                  |
|  Meilensteine:                                                   |
|  * 15. Mrz  Beetplan fertiggestellt                              |
|  * 20. Apr  Erste Aussaat                                        |
|  * 10. Mai  Setzlinge eingepflanzt (naechster Meilenstein)       |
|  * 15. Jul  Erste Ernte (geplant)                                |
```

#### Tab: Kulturen

```
|  +----------+ +----------+ +----------+ +----------+            |
|  | Ruebli   | | Kohl     | | Tomaten  | | Kraeuter |            |
|  | Beet 1   | | Beet 2   | | Beet 3   | | Beet 4   |            |
|  | Waechst  | | Waechst  | | Gesaet   | | Erntereif|            |
|  | 80%      | | 50%      | | 20%      | | 90%      |            |
|  | [Detail] | | [Detail] | | [Detail] | | [Detail] |            |
|  +----------+ +----------+ +----------+ +----------+            |
|                                                                  |
|  [+ Kultur hinzufuegen]                                          |
```

#### Tab: Gruppen

```
|  +------------------------------+ +----------------------------+ |
|  | Gruppe Sonnenblume           | | Gruppe Loewenzahn          | |
|  | Anna M., Ben K., Clara R.   | | David L., Eva S., Finn T.  | |
|  | Aufgaben: 5/8 erledigt      | | Aufgaben: 3/7 erledigt     | |
|  | [Bearbeiten]                 | | [Bearbeiten]               | |
|  +------------------------------+ +----------------------------+ |
|                                                                  |
|  [+ Neue Gruppe]                                                 |
```

#### Tab: Vorprojekt

```
|  Status: In Bearbeitung  |  Fortschritt: 60%                    |
|                                                                  |
|  Material:                                                       |
|  [x] Saatgut (Ruebli, Kohl, Kraeuter)                           |
|  [x] Erde und Kompost                                            |
|  [ ] Werkzeug (Schaufeln, Giesskannen)   [Bestellen ->]          |
|                                                                  |
|  Baumaterial:                                                    |
|  [ ] Holz fuer Hochbeet                  [Bestellen ->]          |
|  [ ] Schrauben und Folie                 [Bestellen ->]          |
|                                                                  |
|  Schulungen:                                                     |
|  [x] Einfuehrungskurs besucht                                   |
|                                                                  |
|  Genehmigungen:                                                  |
|  [x] Schulleitung informiert                                    |
|  [x] Hauswart kontaktiert                                        |
|                                                                  |
|  Praxisauftraege:                                                |
|  [x] Standort begutachtet                                        |
|  [ ] Boden getestet                                              |
|                                                                  |
|  Infrastruktur:                                                  |
|  [x] Wasseranschluss vorhanden                                  |
|  [x] Lagerraum verfuegbar                                       |
|                                                                  |
|  [Vorprojekt abschliessen]  (aktiv wenn 100%)                   |
```

---

### 3.3 Fachbereiche

> Strukturiertes Fachwissen nach Themengebiet -- mit verknuepftem Lehrmaterial.

```
+------------------------------------------------------------------+
|  Fachbereiche                                                    |
|------------------------------------------------------------------|
|                                                                  |
|  +----------+ +------------+ +-------------+                    |
|  |  Boden   | | Fruchtfolge| | Gemuesearten|                    |
|  | 12 Mater.| | 8 Material.| | 15 Material.|                    |
|  +----------+ +------------+ +-------------+                    |
|  +----------+ +------------+ +-------------+                    |
|  |Gesundheit| | Flaechen-  | | Beetplanung |                    |
|  | 6 Mater. | | gestaltung | | 10 Material.|                    |
|  +----------+ +------------+ +-------------+                    |
|  +----------+ +------------+ +-------------+                    |
|  |Ernaehrung| | Oekologie  | | Mathematik  |                    |
|  | 5 Mater. | | 7 Material.| | 8 Material. |                    |
|  +----------+ +------------+ +-------------+                    |
|                                                                  |
+------------------------------------------------------------------+
```

**Ergaenzende Fachbereiche (ueber PRD hinaus):**

| Fachbereich | Beschreibung | Beispielthemen |
|-------------|-------------|----------------|
| Ernaehrung | Verarbeitung, Kochen, Naehrwerte | Gemuesesuppe, Kraeutersalz, Vitamine |
| Oekologie | Nachhaltigkeit, Biodiversitaet | Nuetzlinge, Wasserkreislauf, Kompost |
| Mathematik | Rechnen im Gartenkontext | Flaechenberechnung, Preiskalkulation, Statistik |

#### Fachbereich-Detail

```
+------------------------------------------------------------------+
|  Fachbereiche > Boden                                            |
|------------------------------------------------------------------|
|                                                                  |
|  Beschreibung:                                                   |
|  Alles rund um Bodentypen, Bodenlebewesen und Kompost.           |
|                                                                  |
|  LP21-Bezug: NMG.2.1, NMG.2.3, NMG.2.6                         |
|                                                                  |
|  Filter: [Alle Stufen v]  [Alle Formate v]  [Alle Phasen v]     |
|                                                                  |
|  Lehrmaterial 1.--2. Klasse                                      |
|  +------------------------------------------------------------+ |
|  | Wer lebt im Boden?              PDF   NMG.2.1  [Download] | |
|  | Erde anfassen & fuehlen         PDF   NMG.2.3  [Download] | |
|  +------------------------------------------------------------+ |
|                                                                  |
|  Lehrmaterial 3.--6. Klasse                                      |
|  +------------------------------------------------------------+ |
|  | Bodentypen bestimmen     PDF+DOCX  NMG.2.1.a  [Download]  | |
|  | pH-Wert messen           PDF       NMG.2.3    [Download]  | |
|  | Kompost anlegen (Praxis) PDF       NMG.2.6    [Download]  | |
|  | Regenwurm-Experiment     DOCX      NMG.2.1    [Download]  | |
|  +------------------------------------------------------------+ |
+------------------------------------------------------------------+
```

---

### 3.4 Lehrmaterial

> Zentrale Materialuebersicht mit Filtern, Download-Tracking und LP21-Verknuepfung.

```
+------------------------------------------------------------------+
|  Lehrmaterial                                                    |
|------------------------------------------------------------------|
|                                                                  |
|  Filter:                                                         |
|  [Fachbereich v] [Stufe v] [Phase v] [Format v] [LP21-Code v]   |
|  Suche: [_________________________________]                      |
|                                                                  |
|  Ergebnisse: 42 Arbeitsblaetter                                  |
|                                                                  |
|  +------------------------------------------------------------+ |
|  | Bodentypen bestimmen                                       | |
|  | Fachbereich: Boden  |  Stufe: 3-6  |  Phase: Planung       | |
|  | Format: PDF + DOCX  |  Schwierigkeit: Mittel                | |
|  | LP21: NMG.2.1.a, NMG.2.3                                   | |
|  | Zuletzt heruntergeladen: 08.05.2026                         | |
|  |                                                             | |
|  | [PDF herunterladen]  [DOCX herunterladen]  [Vorschau]       | |
|  +------------------------------------------------------------+ |
|                                                                  |
|  +------------------------------------------------------------+ |
|  | Beetplan zeichnen                                          | |
|  | Fachbereich: Beetplanung  |  Stufe: 3-6  |  Phase: Planung | |
|  | Format: PDF  |  Schwierigkeit: Einfach                      | |
|  | LP21: MA.2.A                                                | |
|  | Noch nicht heruntergeladen                                  | |
|  |                                                             | |
|  | [PDF herunterladen]  [Vorschau]                             | |
|  +------------------------------------------------------------+ |
+------------------------------------------------------------------+
```

**Download-Verhalten:**

```
Klick auf [PDF herunterladen]
  |
  v
+------------------------------------------+
|  Download gestartet                      |
|                                          |
|  Arbeitsblatt: Bodentypen bestimmen      |
|  Format: PDF                             |
|                                          |
|  Folgende LP21-Ziele werden als          |
|  "behandelt" markiert:                   |
|                                          |
|  [x] NMG.2.1.a - Tiere und Pflanzen     |
|  [x] NMG.2.3   - Stoffe und Materialien |
|                                          |
|  [OK]                                    |
+------------------------------------------+
```

---

### 3.5 Schuelerverwaltung

> Schueler der Klasse verwalten, Gruppen bilden und Fortschritt einsehen.

#### Listenansicht

```
+------------------------------------------------------------------+
|  Schueler                       Klasse: HE24a  |  22 Schueler   |
|------------------------------------------------------------------|
|                                                                  |
|  [Listenansicht]  [Gruppenansicht]                               |
|                                                                  |
|  +------------------------------------------------------------+ |
|  | Name          | Gruppe          | Aufgaben  | Fortschritt  | |
|  |---------------|-----------------|-----------|--------------|  |
|  | Anna M.       | Sonnenblume     | 5/8       | 65%          | |
|  | Ben K.        | Sonnenblume     | 4/8       | 50%          | |
|  | Clara R.      | Sonnenblume     | 6/8       | 75%          | |
|  | David L.      | Loewenzahn      | 3/7       | 40%          | |
|  | Eva S.        | Loewenzahn      | 5/7       | 70%          | |
|  | ...           | ...             | ...       | ...          | |
|  +------------------------------------------------------------+ |
|                                                                  |
|  [Gruppen verwalten]  [Schueler zu Projekt zuweisen]             |
+------------------------------------------------------------------+
```

#### Gruppenansicht

```
|  Projekt: [Gemueseflaeche v]                                     |
|                                                                  |
|  +---------------------------+ +-------------------------------+ |
|  | Gruppe Sonnenblume        | | Gruppe Loewenzahn             | |
|  | Anna M., Ben K., Clara R. | | David L., Eva S., Finn T.    | |
|  | Aufgaben: 5/8 erledigt    | | Aufgaben: 3/7 erledigt        | |
|  | [Bearbeiten]              | | [Bearbeiten]                  | |
|  +---------------------------+ +-------------------------------+ |
|                                                                  |
|  +---------------------------+ +-------------------------------+ |
|  | Gruppe Gaensebluemchen    | | Nicht zugewiesen              | |
|  | Gina W., Ivan P., Kim L. | | Hanna F., Jan B.              | |
|  | Aufgaben: 4/7 erledigt    | | [Zuweisen]                    | |
|  | [Bearbeiten]              | |                               | |
|  +---------------------------+ +-------------------------------+ |
|                                                                  |
|  [+ Neue Gruppe]                                                 |
```

---

### 3.6 Template-Verwaltung

> Projekt-Templates nutzen, erweitern und mit anderen Schulen teilen.

```
+------------------------------------------------------------------+
|  Templates                                [+ Neues Template]     |
|------------------------------------------------------------------|
|                                                                  |
|  [Meine Templates]  [Geteilte Templates]  [Plantoria-Templates]  |
|  Filter: [Kategorie v]  [Stufe v]  [Schwierigkeit v]            |
|                                                                  |
|  +------------------------------------------------------------+ |
|  | Gemueseflaeche                              [Eigenes]      | |
|  | Kategorie: Gemuese  |  Stufe: 3-6  |  Schwierigkeit: Mittel| |
|  | LP21-Abdeckung: ============------  65%                     | |
|  | Aufgaben: 18 (12 mit LP21-Ref, 6 ohne)                      | |
|  | Genutzt von: 12 Schulen                                     | |
|  |                                                             | |
|  | [Bearbeiten]  [Teilen]  [Projekt erstellen]  [Vorschau]    | |
|  +------------------------------------------------------------+ |
|                                                                  |
|  +------------------------------------------------------------+ |
|  | Hochbeet kompakt                            [Geteilt]      | |
|  | Kategorie: Hochbeet  |  Stufe: 1-4  |  Schwierigkeit: Einfach|
|  | LP21-Abdeckung: ========--------  40%                       | |
|  | Aufgaben: 10 (6 mit LP21-Ref, 4 ohne)                       | |
|  | Erstellt von: Schule Zug                                    | |
|  |                                                             | |
|  | [Importieren]  [Vorschau]                                   | |
|  +------------------------------------------------------------+ |
+------------------------------------------------------------------+
```

#### Template bearbeiten

```
+------------------------------------------------------------------+
|  Templates > Gemueseflaeche (bearbeiten)                         |
|------------------------------------------------------------------|
|                                                                  |
|  Name:          [Gemueseflaeche                               ]  |
|  Kategorie:     [Gemuese v]                                      |
|  Schwierigkeit: [Mittel v]     Stufe: [3-6]    Dauer: [1 SJ]    |
|                                                                  |
|  LP21-Abdeckung: 65%  |  Aufgaben: 18                            |
|                                                                  |
|  Aufgaben nach Phase:                                            |
|  +------------------------------------------------------------+ |
|  | Vorprojekt (3 Aufgaben)                                    | |
|  | - Standort analysieren          NMG.2.6  [Bearbeiten] [x]  | |
|  | - Material beschaffen           --       [Bearbeiten] [x]  | |
|  | - Genehmigungen einholen        --       [Bearbeiten] [x]  | |
|  |                                                             | |
|  | Planung (4 Aufgaben)                                       | |
|  | - Beetplan zeichnen             MA.2.A   [Bearbeiten] [x]  | |
|  | - Flaechenberechnung            MA.2.A   [Bearbeiten] [x]  | |
|  | - Pflanzpartner bestimmen       NMG.2.1  [Bearbeiten] [x]  | |
|  | - Zeitplan erstellen            --       [Bearbeiten] [x]  | |
|  | ...                                                         | |
|  +------------------------------------------------------------+ |
|                                                                  |
|  [+ Aufgabe hinzufuegen]                                         |
|                                                                  |
|  Materialien:                                                    |
|  +------------------------------------------------------------+ |
|  | Saatgut Ruebli    | 2 Pck.   | Landi     | CHF 4.50        | |
|  | Erde              | 50 Liter | Baumarkt  | CHF 15.00       | |
|  +------------------------------------------------------------+ |
|  [+ Material hinzufuegen]                                        |
|                                                                  |
|  [Speichern]  [Teilen]                                           |
+------------------------------------------------------------------+
```

---

### 3.7 Lehrplan 21 -- Fortschritts-Tracking

> Gesamtfortschritt der Klasse gegenueber dem Lehrplan 21 -- automatisch aktualisiert.

```
+------------------------------------------------------------------+
|  Lehrplan 21                       Klasse: HE24a  |  SJ 25/26   |
|------------------------------------------------------------------|
|                                                                  |
|  Gesamtfortschritt: ============----------  45%                   |
|  Behandelte Themen: 18 / 40                                      |
|                                                                  |
|  [Nach Fachbereich]  [Nach Projekt]  [Chronologisch]             |
|                                                                  |
|  +------------------------------------------------------------+ |
|  | NMG -- Natur, Mensch, Gesellschaft          60%             | |
|  | ================----------                                  | |
|  |                                                             | |
|  |   [x] NMG.2.1   Tiere und Pflanzen          Behandelt     | |
|  |                  Download: Bodentypen.pdf    08.05.2026     | |
|  |                  Projekt: Gemueseflaeche                    | |
|  |                                                             | |
|  |   [x] NMG.2.3   Stoffe und Materialien      Behandelt     | |
|  |                  Download: pH-Wert.pdf       06.05.2026     | |
|  |                  Projekt: Gemueseflaeche                    | |
|  |                                                             | |
|  |   [ ] NMG.2.2   Wachstum, Entwicklung       Offen          | |
|  |   [ ] NMG.2.4   Sinne und Koerper           Offen          | |
|  |   [ ] NMG.2.6   Natuerliche Umwelt          Offen          | |
|  +------------------------------------------------------------+ |
|                                                                  |
|  +------------------------------------------------------------+ |
|  | MA -- Mathematik                                30%         | |
|  | ========--------------                                      | |
|  |   [x] MA.2.A    Flaechenberechnung           Behandelt    | |
|  |   [ ] MA.3.A    Daten und Zufall              Offen         | |
|  +------------------------------------------------------------+ |
|                                                                  |
|  +------------------------------------------------------------+ |
|  | TTG -- Textiles und Technisches Gestalten       15%         | |
|  | ===------------------                                       | |
|  |   [ ] TTG.2     Verfahren                     Offen         | |
|  +------------------------------------------------------------+ |
|                                                                  |
|  [Bericht exportieren (PDF)]                                     |
+------------------------------------------------------------------+
```

#### Bericht exportieren (Dialog)

```
+------------------------------------------+
|  LP21-Bericht exportieren                |
+------------------------------------------+
|                                          |
|  Klasse:    HE24a                        |
|  Schuljahr: 2025/2026                    |
|  Zeitraum:  [Ganzes Schuljahr v]         |
|                                          |
|  Inhalt:                                 |
|  [x] Gesamtfortschritt                  |
|  [x] Aufschluesselung nach Fachbereich  |
|  [x] Behandelte Lernziele mit Datum     |
|  [x] Verknuepfte Projekte               |
|  [ ] Download-Historie                   |
|                                          |
|  Format: [PDF v]                         |
|                                          |
|  [Abbrechen]          [Exportieren]     |
+------------------------------------------+
```

---

### 3.8 Kalender

> Monats- und Wochenansicht mit Aufgaben-Deadlines, Harvest-Markt-Terminen und saisonalen Hinweisen.

```
+------------------------------------------------------------------+
|  Kalender                            [< Mai 2026 >]  [Heute]    |
|------------------------------------------------------------------|
|                                                                  |
|  [Monat]  [Woche]                                                |
|                                                                  |
|  +----+----+----+----+----+----+----+                            |
|  | Mo | Di | Mi | Do | Fr | Sa | So |                            |
|  +----+----+----+----+----+----+----+                            |
|  |    |    |    | 1  | 2  | 3  | 4  |                            |
|  +----+----+----+----+----+----+----+                            |
|  | 5  | 6  | 7  | 8  | 9  | 10 | 11 |                           |
|  |    |    |Giess|    |    |    |    |                            |
|  +----+----+----+----+----+----+----+                            |
|  | 12 | 13 | 14 | 15 | 16 | 17 | 18 |                           |
|  |Setzl|   |    |Pflanz|   |    |    |                           |
|  +----+----+----+----+----+----+----+                            |
|  | 19 | 20 | 21 | 22 | 23 | 24 | 25 |                           |
|  |    |    |    |    |HM  |    |    |                            |
|  |    |    |    |    |Anm.|    |    |                            |
|  +----+----+----+----+----+----+----+                            |
|  | 26 | 27 | 28 | 29 | 30 | 31 |    |                           |
|  +----+----+----+----+----+----+----+                            |
|                                                                  |
|  Legende:                                                        |
|  Blau = Aufgaben  |  Gruen = Saisonal  |  Orange = Harvest-Markt |
|                                                                  |
|  Saisonale Hinweise fuer Mai:                                    |
|  - Tomaten und Gurken ins Freiland setzen                        |
|  - Kartoffeln anhaeufeln                                         |
|  - Erdbeeren ernten                                              |
+------------------------------------------------------------------+
```

**Termin-Kategorien:**

| Kategorie | Farbe | Beispiele |
|-----------|-------|-----------|
| Aufgaben | Blau | Faellige Aufgaben aus Projekten |
| Saisonal | Gruen | Automatische Hinweise je nach Monat |
| Harvest-Markt | Orange | Anmeldefristen, Markttag |
| Meilensteine | Violett | Projektmeilensteine (Ernte, Pflanzung) |

---

### 3.9 Harvest-Maerkte

> Maerkte einsehen, Klasse anmelden, Produkte erfassen und Ergebnisse dokumentieren.

```
+------------------------------------------------------------------+
|  Harvest-Maerkte                                                 |
|------------------------------------------------------------------|
|                                                                  |
|  [Kommende Maerkte]  [Meine Anmeldungen]  [Vergangene]          |
|                                                                  |
|  +------------------------------------------------------------+ |
|  | Herbst-Harvest-Markt 2026                                  | |
|  | Datum: 18. Oktober 2026  |  Ort: Marktplatz Aarau          | |
|  | Teilnehmende Schulen: 8  |  Anmeldefrist: 18. August       | |
|  | Status: Anmeldung offen                                     | |
|  |                                                             | |
|  | [Klasse anmelden]  [Details]                                | |
|  +------------------------------------------------------------+ |
+------------------------------------------------------------------+
```

#### Markt-Detail (nach Anmeldung)

```
+------------------------------------------------------------------+
|  Harvest-Maerkte > Herbst-Harvest-Markt 2026                     |
|------------------------------------------------------------------|
|                                                                  |
|  Status: Angemeldet  |  Klasse: HE24a  |  Markt: 18.10.2026     |
|                                                                  |
|  Vorbereitung:                                                   |
|  +------------------------------------------------------------+ |
|  | Phase                  | Status          | Deadline         | |
|  |------------------------|-----------------|------------------|  |
|  | [x] Anmeldung          | Erledigt        | 18.08.           | |
|  | [ ] Produkt-Ideen      | In Bearbeitung  | 06.09.           | |
|  | [ ] Produktion         | Offen           | 04.10.           | |
|  | [ ] Preiskalkulation   | Offen           | 11.10.           | |
|  | [ ] Standgestaltung    | Offen           | 17.10.           | |
|  | [ ] Durchfuehrung      | Offen           | 18.10.           | |
|  | [ ] Auswertung         | Offen           | 25.10.           | |
|  +------------------------------------------------------------+ |
|                                                                  |
|  Unsere Produkte:                                [+ Erfassen]    |
|  +------------------------------------------------------------+ |
|  | Produkt          | Menge      | Preis     | Gruppe          | |
|  |------------------|------------|-----------|-----------------|  |
|  | Kraeutersalz     | 20 Glaeser | CHF 5.00  | Sonnenblume     | |
|  | Ruebli (frisch)  | 5 kg       | CHF 3/kg  | Loewenzahn      | |
|  +------------------------------------------------------------+ |
|                                                                  |
|  Einnahmen (nach Durchfuehrung):                                 |
|  Gesamt: CHF 185.00  |  [Einnahmen erfassen]                    |
+------------------------------------------------------------------+
```

---

### 3.10 Einstellungen

> Profil, Klasse und Benachrichtigungen konfigurieren.

```
+------------------------------------------------------------------+
|  Einstellungen                                                   |
|------------------------------------------------------------------|
|                                                                  |
|  [Profil]  [Klasse]  [Benachrichtigungen]                        |
|                                                                  |
|  Profil:                                                         |
|  +------------------------------------------------------------+ |
|  | Name:       [Anna Mueller                               ]  | |
|  | E-Mail:     [anna.mueller@schule-aarau.ch                ]  | |
|  | Schule:     Primarschule Aarau (nicht editierbar)           | |
|  | Rolle:      Lehrperson (nicht editierbar)                   | |
|  |                                                             | |
|  | [Passwort aendern]     [Speichern]                          | |
|  +------------------------------------------------------------+ |
|                                                                  |
|  Klasse:                                                         |
|  +------------------------------------------------------------+ |
|  | Aktive Klasse: HE24a  |  Stufe: 4  |  22 Schueler          | |
|  | Schuljahr: 2025/2026  |  Aktive Projekte: 2                | |
|  | [Schueler verwalten ->]                                     | |
|  |                                                             | |
|  | Weitere Klassen:                                            | |
|  | HE23b  |  Stufe: 5  |  12 Schueler  |  [Wechseln]          | |
|  +------------------------------------------------------------+ |
|                                                                  |
|  Benachrichtigungen:                                             |
|  +------------------------------------------------------------+ |
|  | Aufgaben-Erinnerungen    [x] In-App   [ ] E-Mail           | |
|  | Saisonale Hinweise       [x] In-App   [ ] E-Mail           | |
|  | Template-Updates         [x] In-App   [ ] E-Mail           | |
|  | Harvest-Markt-Termine    [x] In-App   [x] E-Mail           | |
|  | LP21-Meilensteine        [x] In-App   [ ] E-Mail           | |
|  +------------------------------------------------------------+ |
|  [Speichern]                                                     |
+------------------------------------------------------------------+
```

---

## 4. User Flows

### Flow 1: Arbeitsblatt herunterladen (LP21-Tracking)

```
Login -> Dashboard (LP21: 45%)
  -> Sidebar: "Lehrmaterial"
    -> Filter: Fachbereich "Boden", Stufe "3-6"
      -> "Bodentypen bestimmen" -> [PDF herunterladen]
        -> Bestaetigung: "NMG.2.1.a und NMG.2.3 als behandelt markiert"
          -> Dashboard: LP21-Fortschritt steigt auf 48%
            -> PDF wird heruntergeladen, Lehrperson druckt aus
```

### Flow 2: Neues Projekt aus Template erstellen

```
Sidebar: "Projekte" -> [+ Neues Projekt]
  -> Wizard Schritt 1: "Aus Template erstellen" -> Template waehlen
    -> Durchsuchen: Filter "Gemuese", Stufe "3-6"
      -> "Gemueseflaeche" waehlen (LP21-Abdeckung: 65%)
        -> Wizard Schritt 2: Projektdaten eingeben
          -> [Erstellen] -> Projekt mit Status "Vorprojekt"
            -> Vorprojekt-Checkliste abarbeiten
              -> Alle erfuellt -> [Vorprojekt abschliessen]
                -> Status wechselt zu "Projektstart"
```

### Flow 3: Schueler in Gruppen einteilen

```
Sidebar: "Schueler" -> [Gruppenansicht]
  -> Projekt waehlen: "Gemueseflaeche"
    -> Bestehende Gruppen + nicht zugewiesene Schueler sichtbar
      -> [+ Neue Gruppe] -> Name eingeben, Schueler waehlen
        -> [Speichern] -> Aufgaben koennen zugewiesen werden
```

### Flow 4: Template erweitern und teilen

```
Sidebar: "Templates" -> "Gemueseflaeche" -> [Bearbeiten]
  -> [+ Aufgabe hinzufuegen]
    -> Titel, Phase, LP21-Code, Arbeitsblatt hochladen
      -> LP21-Abdeckung steigt: 65% -> 70%
        -> [Teilen] -> Template fuer andere Schulen sichtbar
```

### Flow 5: Harvest-Markt Anmeldung bis Auswertung

```
Sidebar: "Harvest-Maerkte" -> [Klasse anmelden]
  -> Anmeldung bestaetigen
    -> Vorbereitungs-Checkliste mit Deadlines
      -> Produkt-Ideen erfassen, Preise kalkulieren
        -> Nach Markttag: Einnahmen erfassen
          -> Auswertung einsehen
```

### Flow 6: LP21-Bericht exportieren

```
Sidebar: "Lehrplan 21" -> Fortschritt: 45%, 18/40 Themen
  -> [Bericht exportieren (PDF)]
    -> Zeitraum und Inhalte waehlen
      -> PDF generiert mit Fortschritt, Themen, Projekt-Bezug
        -> Nutzung fuer Elterngespraech / Schulleitung
```

---

## 5. Navigationsstruktur (Sitemap)

```
/teacher
  |
  +-- /teacher                          Dashboard
  +-- /teacher/projects                  Projektliste
  |     +-- /teacher/projects/new        Neues Projekt (Wizard)
  |     +-- /teacher/projects/:id        Projektdetail
  |           +-- ?tab=tasks             Aufgaben
  |           +-- ?tab=timeline          Zeitstrahl
  |           +-- ?tab=cultures          Kulturen
  |           +-- ?tab=groups            Gruppen
  |           +-- ?tab=preproject        Vorprojekt
  |
  +-- /teacher/subjects                  Fachbereiche
  |     +-- /teacher/subjects/:id        Fachbereich-Detail
  |
  +-- /teacher/materials                 Lehrmaterial
  |
  +-- /teacher/students                  Schuelerverwaltung
  |
  +-- /teacher/templates                 Template-Verwaltung
  |     +-- /teacher/templates/new       Neues Template
  |     +-- /teacher/templates/:id       Template bearbeiten
  |
  +-- /teacher/curriculum                LP21-Tracking
  |
  +-- /teacher/calendar                  Kalender
  |
  +-- /teacher/markets                   Harvest-Maerkte
  |     +-- /teacher/markets/:id         Markt-Detail
  |
  +-- /teacher/settings                  Einstellungen
```

**Breadcrumbs** im Content-Bereich: `Dashboard > Projekte > Gemueseflaeche HE24a > Aufgaben`

---

## 6. Interaktionsmuster

### Wiederkehrende Patterns

| Pattern | Verwendung | Beschreibung |
|---------|-----------|-------------|
| Karten-Liste | Projekte, Templates, Maerkte | Karten mit Titel, Meta-Daten, Aktions-Buttons |
| Filter-Leiste | Lehrmaterial, Templates, Aufgaben | Dropdowns fuer Kategorie, Stufe, Phase, Format |
| Progress-Bar | LP21, Projekte, Vorprojekt | Farbiger Balken mit Prozentzahl |
| Checkliste | Vorprojekt, Harvest-Vorbereitung | Abzuhakende Items mit Status |
| Wizard (Steps) | Neues Projekt, Template erstellen | Mehrstufiger Dialog mit Zurueck/Weiter |
| Detail-Tabs | Projektdetail | Tabs innerhalb des Content-Bereichs |
| Confirmation-Dialog | Download, Loeschen, Teilen | Bestaetigung vor Aktionen |

### Leere Zustaende (Empty States)

```
+------------------------------------------+
|                                          |
|            (Illustration)                |
|                                          |
|  Noch keine Projekte vorhanden.          |
|  Starten Sie Ihr erstes Gartenprojekt    |
|  aus einem Template!                     |
|                                          |
|  [Erstes Projekt erstellen]              |
+------------------------------------------+
```

### Feedback

| Aktion | Feedback |
|--------|----------|
| Download | Toast: "Arbeitsblatt heruntergeladen. LP21-Ziele aktualisiert." |
| Speichern | Toast: "Aenderungen gespeichert." |
| Loeschen | Confirmation-Dialog vor Ausfuehrung |
| Teilen | Toast: "Template erfolgreich geteilt." |
| Fehler | Inline-Meldung mit Fehlerbeschreibung |

---

## 7. Responsive Verhalten

| Breakpoint | Sidebar | Content |
|-----------|---------|---------|
| Desktop (>1280px) | Ausgeklappt mit Labels | Volle Breite |
| Tablet Landscape (1024--1280px) | Eingeklappt (nur Icons), per Klick ausklappbar | Volle Breite |
| Tablet Portrait (768--1024px) | Versteckt (Hamburger-Menue), Overlay | Volle Breite |
| Mobil (<768px) | Versteckt (Hamburger-Menue), Overlay | Gestapelte Karten |

---

## 8. Abhaengigkeiten zu anderen Ansichten

| Bereich | Verbindung | Ziel-Ansicht |
|---------|------------|-------------|
| Projekte / Aufgaben | Schueler sehen zugewiesene Aufgaben | Schueler-Ansicht |
| LP21-Fortschritt | Eltern sehen vereinfachten Fortschritt | Elternportal |
| Projekte / Kulturen | Dashboard zeigt Projekt-Uebersicht | Klassenzimmer-Dashboard |
| Harvest-Maerkte | Termine im Schueler-Dashboard | Schueler-Ansicht |
| Templates | Geteilte Templates fuer andere Schulen | Andere Lehrpersonen |

---

## Anhang: Bereichs-Uebersicht

| # | Bereich | Kernfunktion | Quelle |
|---|---------|-------------|--------|
| 1 | Dashboard | Ueberblick ueber alles Wichtige | Neu (ergaenzt) |
| 2 | Projekte | Erstellen, verwalten, Aufgaben, Zeitstrahl, Kulturen, Gruppen | PRD 5.2, 8 |
| 3 | Fachbereiche | Fachwissen nach Themengebiet mit Material | PRD 5.2 |
| 4 | Lehrmaterial | Arbeitsblaetter filtern, downloaden, LP21-Tracking | PRD 5.2 |
| 5 | Schueler | Schueler- und Gruppenverwaltung | PRD 5.2 |
| 6 | Templates | Templates nutzen, erweitern, teilen | PRD 5.2, 7 |
| 7 | Lehrplan 21 | Automatisches Fortschritts-Tracking, Export | PRD 5.2, 6 |
| 8 | Kalender | Termine, Deadlines, saisonale Hinweise | Neu (ergaenzt) |
| 9 | Harvest-Maerkte | Maerkte planen, Produkte, Einnahmen | Neu (aus PRD 9) |
| 10 | Einstellungen | Profil, Klasse, Benachrichtigungen | Neu (ergaenzt) |
