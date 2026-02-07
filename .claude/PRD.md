# PLANTORIA -- Product Requirements Document

## Vision

> So vielen Kindern wie möglich die Möglichkeit geben, draussen zu lernen.

PLANTORIA ist eine Bildungsplattform für Schulgärten, die digitales Lernen mit praktischer Gartenarbeit verbindet -- abgestimmt auf den Schweizer Lehrplan 21. Die Plattform begleitet Schüler:innen über ihre gesamte sechsjährige Primarschulzeit.

---

## 1. Problem und Lösung

### Das Problem

- Kinder verbringen immer weniger Zeit in der Natur
- Lehrpersonen müssen Unterrichtsmaterial für Gartenprojekte selbst zusammenstellen
- Der Fortschritt gegenüber dem Lehrplan 21 muss manuell nachgetragen werden
- Es gibt keinen einfachen, strukturierten Einstieg in Schulgarten-Projekte

### Die Lösung

Plantoria bietet Lehrpersonen ein Tool, mit dem sie ohne viel Aufwand Unterrichtsmaterialien aus fertigen Templates herunterladen können. Jedes Arbeitsblatt ist mit dem Lehrplan 21 verknüpft. Beim Download wird der Fortschritt automatisch getrackt -- die Lehrperson muss nichts manuell eintragen. Schüler erhalten einen spielerischen Zugang zu Natur und Gartenarbeit, der sie über Jahre begleitet.

---

## 2. Ziele

- Lehrmittel bereitstellen, die auf den Lehrplan 21 abgestimmt sind
- Spielerische Zugänge und zugängliches Unterrichtsmaterial bereitstellen
- Lernmaterialien optimal bereitstellen (PDF, Word-Arbeitsblätter)
- Vernetztes Denken fördern und Verantwortung übernehmen
- Automatisches Tracking des Lehrplan-21-Fortschritts beim Download von Arbeitsblättern
- Langzeitbegleitung über die gesamte sechsjährige Schulzeit

### MVP (Hackathon)

- 1 Massnahme / Projekt für Kinder (z.B. Gemüsebeet)
- Prototyp mit Basisfunktionalitäten:
  - Kinder können eine Massnahme / ein Projekt einsehen
  - Kinder können einen Standort wählen
  - Ansicht Lehrperson (Wissensbereich + Didaktikbereich mit Tasks für Kinder)
  - Dashboard

---

## 3. Zielgruppen

### Schüler:innen

- **1.--2. Klasse:** Kein eigener Tablet-Zugang. Die Lehrperson stellt das Material bereit und führt die Aktivitäten an.
- **Ab 3. Klasse (Fokus):** Eigener Tablet-Zugang mit einer kindgerechten Schüleransicht. Verschiedene Schwierigkeitsstufen je nach Alter (Entdecker, Gärtner, Experte, Profi).
- Schüler wählen gemeinsam als Klasse ein Projekt (z.B. Gemüsebeet, Hochbeet, Bienenstock).
- Sie lernen durch praktische Gartenarbeit kombiniert mit digitalem Material.
- Spielerischer Zugang: Beete visuell darstellen, Pflanzen digital platzieren, Factsheets lesen, Rankings vergleichen.

### Lehrpersonen

- Erhalten Lehrmittel nach Projektphase, verknüpft mit dem Lehrplan 21.
- Lehrmaterial ist fächer- und stufenübergreifend verfügbar (PDF- und Word-Arbeitsblätter).
- Können eigene Aufgaben erfassen, mit LP21-Codes verknüpfen und erweiterte Templates mit anderen Schulen teilen.
- Erhalten automatisches Fortschritts-Tracking: Beim Download eines Arbeitsblatts wird das verknüpfte Lernziel als "behandelt" markiert -- ohne manuelles Eintragen.
- Verwalten Projekte, Schüler und Gruppen zentral in einer Ansicht.

### Eltern

- Erhalten Einblick in den Lernstand ihres Kindes (nur lesend).
- Sehen, welche Lehrplan-21-Ziele durch Plantoria-Aktivitäten abgedeckt werden.
- Informationen zu Rahmenbedingungen, Terminen und anstehenden Ereignissen.

### Schulen / Firmen (Produktwebseite)

- Schulen erfahren, wie sie teilnehmen können.
- Verschiedene Produktpakete verfügbar (Basis, Standard, Material, Komplett -- inkl. Tablet, Saatgut, Baumaterial).
- Firmen können Sponsoring-Pakete (CSR) erwerben.

---

## 4. Kernkonzepte

### Fächerübergreifendes Lernen

Ein Gartenprojekt verbindet mehrere Fächer:

- **Werken:** Hochbeet bauen
- **Mathematik:** Beetplan zeichnen, Flächenberechnung
- **Natur, Mensch, Umwelt (NMG):** Ökologie, Boden, Lebewesen, Pflanzen
- **Ernährung:** Verarbeitung der Ernte, gemeinsames Kochen
- **Gesundheit:** Richtiges Händewaschen nach der Gartenarbeit

### Gamification

- Ranking zwischen Klassen innerhalb der Schule und schweizweit (ähnlich Nichtrauch-Challenges)
- Progress-Bars für jede Kultur der Klasse
- Badges und Erfolge (z.B. "Erste Ernte!", "10 Kulturen gepflanzt")
- Verschiedene Schwierigkeitsstufen nach Klassenstufe

### Langzeitbegleitung (6 Jahre)

| Phase | Zeitraum | Fokus |
|-------|----------|-------|
| Vorprojekt | 1.--2. Klasse | Projekt auswählen, einfache Tätigkeiten, Standort bestimmen |
| Aufbau | 2.--3. Klasse | Pflanzung starten, erste Bewirtschaftung |
| Bewirtschaftung | 3.--5. Klasse | Pflege, Ernte, Weiterentwicklung |
| Vermarktung | 5.--6. Klasse | Produkte herstellen, Harvest-Märkte, Verkauf |

### Praxis und Natur

- Verbindung zwischen Tablet und draussen sein
- Schädlinge und Misserfolge sind Teil der Lernerfahrung -- kein Störfaktor
- Digitale Prognose, wie das Beet in x Monaten aussieht
- Saisonale Inhalte: Was gibt es Einheimisches im Verlaufe des Jahres?

---

## 5. Plattform-Ansichten

### 5.1 Klassenzimmer-Dashboard (Tablet)

Ein Tablet hängt am Eingang jedes Klassenraums und zeigt eine permanente Live-Ansicht. Auch über die Web-App zugänglich.

**Tabs:**

| Tab | Inhalt |
|-----|--------|
| Projektübersicht | Alle Projekte der Klasse mit Name, Status, Phase, Fläche |
| Zeitstrahl | Visueller Zeitstrahl pro Projekt mit Meilensteinen und saisonalen Hinweisen |
| Fortschritt | Progress-Bars pro Kultur (Gesät/Wächst/Erntereif/Geerntet) + LP21-Fortschritt |
| Ranking | Schulinternes Klassen-Ranking + schweizweites Schulranking |
| Statistiken | Gesamtfläche, Anzahl Kulturen, Erfolgsquote, LP21-Abdeckung |
| Kalender | Monats-/Wochenansicht mit Aufgaben, Deadlines, Harvest-Markt-Terminen |

**Wireframes:**

```
Projektübersicht:
+-----------------------------------------------------+
|  Unsere Projekte                                    |
+-----------------------------------------------------+
|                                                     |
|  +------------------------------------------+       |
|  | Gemüsefläche      10m2    Laufend      |       |
|  |     Phase: Pflanzung                     |       |
|  +------------------------------------------+       |
|  +------------------------------------------+       |
|  | Bienenstock          --     Vorprojekt   |       |
|  |     Phase: Planung                       |       |
|  +------------------------------------------+       |
|                                                     |
+-----------------------------------------------------+

Zeitstrahl:
+-----------------------------------------------------+
|  Zeitstrahl: Gemüsefläche                         |
+-----------------------------------------------------+
|                                                     |
|  Jan  Feb  Mrz  Apr  Mai  Jun  Jul  Aug  Sep  Okt  |
|  ----------*------------*----------*------*-------- |
|            |            |          |      |         |
|         Planung     Pflanzung   Pflege  Ernte      |
|                         ^                           |
|                      Heute                          |
|                                                     |
+-----------------------------------------------------+

Fortschritt:
+-----------------------------------------------------+
|  Fortschritt                                        |
+-----------------------------------------------------+
|                                                     |
|  Gesamtprojekt:  ============------  60%            |
|                                                     |
|  Rübli:         ===============---  80%  Wächst   |
|  Kohl:           ==========--------  50%  Wächst   |
|  Tomaten:        =====--------------  20%  Gesät   |
|  Kräuter:       =================--  90%  Erntereif|
|                                                     |
|  Lehrplan 21:    =========----------  45%           |
|                                                     |
+-----------------------------------------------------+

Ranking:
+-----------------------------------------------------+
|  Ranking                                            |
+-----------------------------------------------------+
|                                                     |
|  Unsere Schule:              |  Schweizweit:        |
|  +------------------------+  |  +----------------+  |
|  | 1. Klasse HE24a  95pt  |  |  | 1. Schule Bern |  |
|  | 2. Klasse HE24b  82pt  |  |  | 2. Schule Zug  |  |
|  | 3. Klasse HE25a  78pt  |  |  | 3. Unsere!     |  |
|  | 4. Klasse HE25b  65pt  |  |  | 4. Schule Basel|  |
|  +------------------------+  |  +----------------+  |
|                              |                      |
+-----------------------------------------------------+
```

**Responsive Design:**

| Gerät | Layout |
|--------|--------|
| Klassenraum-Tablet (Landscape) | Vollbild-Dashboard, grosse Schrift, Touch-optimiert |
| Desktop (Lehrperson) | Volle Breite mit Sidebar-Navigation |
| Tablet (Schüler, ab 3. Klasse) | Vereinfachte Ansicht, spielerisch |

Das Dashboard aktualisiert sich automatisch (Polling oder WebSocket). Saisonale Inhalte ändern sich je nach Monat/Jahreszeit.

---

### 5.2 Lehrperson-Ansicht

Zentrales Verwaltungstool mit folgenden Bereichen:

#### Fachbereiche

Strukturierte Darstellung mit zugehörigem Lehrmaterial.

| Fachbereich | Beschreibung | Beispielthemen |
|-------------|-------------|----------------|
| Boden | Bodentypen, Bodenlebewesen, Kompost | Erdwürmer, Mikroorganismen, pH-Wert |
| Fruchtfolge | Rotation, Mischkultur | Welche Pflanzen nach welchen? |
| Gemüsearten | Sorten, Anbau, Pflege | Rübli, Kohl, Tomaten, Kräuter |
| Gesundheit | Hygiene, Ernährung | Händewaschen, Vitamine |
| Flächengestaltung | Planung, Vermessung | Flächenberechnung, Ausrichtung |
| Beetplanung | Layout, Pflanzplan | Reihenabstand, Pflanzpartner |

```
+-----------------------------------------------------+
|  Fachbereiche                                       |
+-----------------------------------------------------+
|                                                     |
|  +----------+ +----------+ +------------+           |
|  |  Boden   | |Fruchtfolge| |Gemüsearten|          |
|  +----------+ +----------+ +------------+           |
|  +----------+ +----------+ +----------+             |
|  |Gesundheit| |Flächen- | |Beetplanung|            |
|  |          | |gestaltung| |          |              |
|  +----------+ +----------+ +----------+             |
|                                                     |
|  Ausgewählter Fachbereich: Boden                   |
|  +------------------------------------------+       |
|  | Lehrmaterial 1.-2. Klasse                |       |
|  | - Arbeitsblatt: Wer lebt im Boden?      |       |
|  | - Arbeitsblatt: Erde anfassen & fühlen  |       |
|  |                                          |       |
|  | Lehrmaterial 3.-6. Klasse                |       |
|  | - Arbeitsblatt: Bodentypen bestimmen     |       |
|  | - Arbeitsblatt: pH-Wert messen           |       |
|  | - Praxis: Kompost anlegen                |       |
|  +------------------------------------------+       |
+-----------------------------------------------------+
```

#### Lehrmaterial

**1.--2. Klasse:**
- Lehrperson druckt Material aus und verteilt es
- Einfache, bebilderte Arbeitsblätter
- Fokus auf praktische, haptische Erfahrungen
- Kein digitaler Schüler-Zugang nötig

**3.--6. Klasse:**
- Schüler können Tablets nutzen
- Interaktive Materialien möglich
- Höhere Schwierigkeitsstufen
- Selbstständiges Arbeiten wird gefördert

**Formate:** PDF-Arbeitsblätter zum Ausdrucken und Word-Dateien (editierbar). Jede Aufgabe muss als downloadbares Material verfügbar und intuitiv zugänglich sein.

**Download-Tracking:**
1. Download wird protokolliert (wer, wann, welches Arbeitsblatt)
2. Verknüpfte LP21-Lernziele werden als "behandelt" markiert
3. Fortschritt im LP21-Tracking wird automatisch aktualisiert
4. Lehrperson muss nichts manuell eintragen

#### Projektverwaltung

- Neues Projekt erstellen (aus Template oder manuell)
- Bestehende Projekte einsehen und bearbeiten
- Projekt-Status ändern (Vorprojekt -> Projektstart -> Laufend -> Abgeschlossen)
- Aufgaben verwalten (erstellen, zuweisen, Status ändern)
- Standort wählen / ändern
- Materialien und Voraussetzungen einsehen

```
+-----------------------------------------------------+
|  Projektverwaltung                                  |
+-----------------------------------------------------+
|                                                     |
|  [+ Neues Projekt]                                  |
|                                                     |
|  +------------------------------------------+       |
|  | Gemüsefläche HE24a                     |       |
|  | Status: Laufend  |  Phase: Pflanzung     |       |
|  | Fortschritt: 60%  |  Fläche: 10m2       |       |
|  | Aufgaben: 8/15 erledigt                   |       |
|  | [Verwalten] [Aufgaben] [Material]         |       |
|  +------------------------------------------+       |
|                                                     |
+-----------------------------------------------------+
```

#### Schülerverwaltung

- Schüler-Übersicht der Klasse
- Schüler zu Projekten zuweisen
- Gruppen bilden innerhalb eines Projekts
- Fortschritt pro Schüler einsehen

#### Template-Verwaltung

- Template-Übersicht mit LP21-Abdeckung (z.B. "65% abgedeckt, 12/18 Aufgaben mit LP21-Ref")
- Aufgaben erweitern und mit LP21-Codes verknüpfen
- Templates mit anderen Schulen teilen und importieren

#### LP21-Fortschritts-Tracking

- Gesamtfortschritt der Klasse in Bezug auf LP21
- Aufschlüsselung nach Fachbereich
- Welche Lernziele behandelt (durch Worksheet-Downloads), welche noch offen
- Export-Möglichkeit für Berichte

#### Berechtigungen

| Funktion | Lehrperson | Schüler | Eltern |
|----------|-----------|----------|--------|
| Fachbereiche einsehen | Ja | Nein | Nein |
| Lehrmaterial downloaden | Ja | Nein | Nein |
| Projektverwaltung | Ja | Nein | Nein |
| Schülerverwaltung | Ja | Nein | Nein |
| Template bearbeiten/teilen | Ja | Nein | Nein |
| LP21-Fortschritt | Ja | Nein | Eingeschränkt |

---

### 5.3 Schüler-Ansicht (ab 3. Klasse)

Spielerischer, kindgerechter Zugang mit vier Schwierigkeitsstufen:

| Stufe | Klasse | Merkmale |
|-------|--------|----------|
| Entdecker | 3. Klasse | Sehr einfache Sprache, viele Bilder, grosse Buttons |
| Gärtner | 4. Klasse | Einfache Texte, bebildert, geführte Navigation |
| Experte | 5. Klasse | Mehr Text, eigenständigeres Arbeiten |
| Profi | 6. Klasse | Komplexere Aufgaben, Vermarktung, Statistiken |

**Bereiche:**

- **Mein Projekt:** Übersicht mit Phase, Fortschritt und nächster Aufgabe
- **Meine Aufgaben:** Aktuelle und erledigte Aufgaben der Schüler-Gruppe, saisonale Tipps
- **Unser Garten:** Visuelle Darstellung der Beete mit Kulturen, Status und Prognosen
- **Factsheets / Pflanzenwissen:** Kindgerechte Infos pro Pflanze (Aussaat, Ernte, Pflege, Nachbarn, Fun Facts)
- **Ranking und Erfolge:** Gamification-Elemente (Klassen-Ranking, Badges, motivierende Nachrichten)
- **Saisonale Inhalte:** Dynamische Tipps je nach Jahreszeit

```
Mein Projekt:
+-----------------------------------------------------+
|  Klasse HE24a                                       |
+-----------------------------------------------------+
|                                                     |
|  +---------------------------------------+          |
|  |  Unser Projekt: Gemüsefläche        |          |
|  |                                       |          |
|  |  Vorprojekt -> Pflanzung -> Pflege -> Ernte     |
|  |                   ^                   |          |
|  |                Hier sind wir!         |          |
|  |                                       |          |
|  |  Fortschritt: ========---  60%        |          |
|  +---------------------------------------+          |
|                                                     |
+-----------------------------------------------------+

Unser Garten:
+-----------------------------------------------------+
|  Unser Garten                                       |
+-----------------------------------------------------+
|                                                     |
|  +--------+ +--------+ +--------+ +--------+       |
|  | Beet 1 | | Beet 2 | | Beet 3 | | Beet 4 |       |
|  | Rübli | |Tomaten | |  Kohl  | |Kräuter|       |
|  |  80%   | |  20%   | |  50%   | |  90%   |       |
|  | Wächst| | Gesät | | Wächst| |Erntereif|      |
|  +--------+ +--------+ +--------+ +--------+       |
|                                                     |
|  Tippe auf ein Beet für mehr Infos!                |
|                                                     |
+-----------------------------------------------------+
```

**Interaktionen:**

- **Standort wählen:** Karte oder Planansicht des Schulgeländes, Markierung setzen, Bestätigung durch Lehrperson
- **Pflanzen digital anpflanzen:** Pflanzen aus Katalog wählen und auf dem Beetplan platzieren, Pflanz-Anleitung erhalten

**Barrierefreiheit:** Grosse, gut lesbare Schrift, hoher Kontrast, einfache Navigation mit wenigen Ebenen, Bilder und Icons, Touch-optimiert für Tablets.

---

### 5.4 Elternportal

Lesender Zugriff -- sieht nur Daten des eigenen Kindes:

- **Lernstand:** Zugewiesene Projekte, erledigte und offene Aufgaben, Fortschritt
- **LP21-Mapping:** Welche Lernziele abgedeckt werden, in verständlicher Sprache (nicht LP21-Fachsprache)
- **Projektinformationen:** Beschreibung, Ziele, Zeitplan, Meilensteine
- **Rahmenbedingungen:** Termine (Pflanzaktionen, Harvest-Märkte), Materialien, Sicherheitshinweise

Kein Zugriff auf Lehrmaterial, Verwaltungsfunktionen oder Daten anderer Kinder.

```
+-----------------------------------------------------+
|  Elternportal                    Kind: Anna M.      |
+-----------------------------------------------------+
|                                                     |
|  Projekt: Gemüsefläche HE24a                      |
|  Phase: Pflanzung  |  Fortschritt: 60%              |
|                                                     |
|  +------------------------------------------+       |
|  | Lehrplan-21-Bezug:                       |       |
|  | [x] NMG.2.1 - Tiere und Pflanzen        |       |
|  | [x] NMG.2.3 - Stoffe und Materialien    |       |
|  | [ ] MA.2.A  - Flächenberechnung        |       |
|  |                                          |       |
|  | Abgedeckte Kompetenzen: 45%              |       |
|  +------------------------------------------+       |
|                                                     |
|  Nächste Termine:                                  |
|  - 15. Mai: Pflanzaktion im Schulgarten             |
|  - 20. Jun: Erntefest                               |
|                                                     |
+-----------------------------------------------------+
```

---

### 5.5 Produktwebseite

Öffentliche Präsenz für Akquise und Information.

**Bereiche:**

- **Landing Page:** Vision, Produktvorstellung, Vorteile, Call-to-Action, Testimonials
- **Produktvorstellung:** Detaillierte Funktionsbeschreibung mit Screenshots/Demo-Videos
- **Teilnahme-Information:** Schritt-für-Schritt-Anleitung für Schulen (Informieren, Paket wählen, Schulung, Projekt starten)
- **Login:** Login für bestehende Nutzer, Weiterleitung nach Rolle, Passwort-Reset, Registrierung

**Produktpakete:**

| Paket | Inhalt | Zielgruppe |
|-------|--------|------------|
| Basis | Zugang zur Plattform, Lehrmaterial-Downloads | Schulen mit vorhandenem Equipment |
| Standard | Basis + Tablet für Klassenzimmer-Dashboard | Schulen, die ein Dashboard wollen |
| Material | Basis + Saatgut, Erde, Werkzeug | Schulen ohne Gartenmaterial |
| Komplett | Standard + Material + Baumaterial (z.B. für Hochbeet) | Schulen, die von Grund auf starten |

**Firmen-Pakete:** Sponsoring-Möglichkeiten, CSR-Pakete, Firmenlogo auf der Plattform, gemeinsame Veranstaltungen.

**Über uns:** Team-Vorstellung, Partner, Referenzen, Kontaktformular.

```
+-----------------------------------------------------+
|  PLANTORIA        [Über uns] [Pakete] [Login]     |
+-----------------------------------------------------+
|                                                     |
|        Schülern die Natur näher bringen           |
|                                                     |
|  Die Bildungsplattform für Schulgärten,           |
|  abgestimmt auf den Lehrplan 21.                    |
|                                                     |
|  [Jetzt teilnehmen]    [Mehr erfahren]              |
|                                                     |
+-----------------------------------------------------+
|                                                     |
|  Für Lehrpersonen | Für Schüler | Für Eltern   |
|                                                     |
|  +---------+  +---------+  +---------+              |
|  |Dashboard|  |Lehrmittel|  | Ranking |              |
|  |         |  |nach LP21 |  |& Spass  |              |
|  +---------+  +---------+  +---------+              |
|                                                     |
+-----------------------------------------------------+
|                                                     |
|  Unsere Partner:                                    |
|  [Bildung Aargau] [Gemüseackerdemie] [Schulgarten]|
|                                                     |
+-----------------------------------------------------+
```

---

## 6. Lehrplan-21-Integration

### Automatisches Fortschritts-Tracking

Der zentrale Flow:

```
LP21-Lernziel (z.B. NMG.2.1.a)
  -> Projekttemplate referenziert dieses Lernziel
    -> Aufgaben-Template referenziert dieses Lernziel
      -> Arbeitsblatt referenziert dieses Lernziel
        -> Lehrperson lädt Arbeitsblatt herunter
          -> System markiert NMG.2.1.a als "behandelt"
            -> Dashboard zeigt aktualisierten Fortschritt
```

Die Lehrperson muss nichts manuell eintragen. Alles wird beim Download automatisch getrackt.

### Relevante Fachbereiche

**Primär: Natur, Mensch, Gesellschaft (NMG)**

| Code | Thema | Plantoria-Bezug |
|------|-------|----------------|
| NMG.2.1 | Tiere und Pflanzen in ihren Lebensräumen | Pflanzen anbauen, Lebewesen im Boden |
| NMG.2.2 | Wachstum, Entwicklung, Fortpflanzung | Pflanzenwachstum beobachten |
| NMG.2.3 | Stoffe, Energie, Bewegung | Boden, Kompost, Nährstoffe |
| NMG.2.4 | Sinne und Körper | Ernährung, Gesundheit |
| NMG.2.6 | Natürliche Umwelt und Ressourcen | Ökologie, nachhaltige Bewirtschaftung |

**Sekundär:**

| Code | Thema | Plantoria-Bezug |
|------|-------|----------------|
| MA.2.A | Längen, Flächen, Volumen | Beetplanung, Flächenberechnung |
| MA.3.A | Daten und Zufall | Statistiken, Auswertungen, Preiskalkulation |
| TTG.2 | Verfahren | Bau von Hochbeeten, Werkzeugkunde |
| WAH.1 | Produktions- und Arbeitswelten | Vermarktung am Harvest-Markt |
| WAH.3 | Konsum gestalten | Ernährung, Herkunft von Lebensmitteln |

**Überfachliche Kompetenzen:**

| Kompetenz | Plantoria-Bezug |
|-----------|----------------|
| Personale Kompetenz | Eigenständigkeit, Verantwortung übernehmen |
| Soziale Kompetenz | Teamarbeit in Gruppen, gemeinsame Projekte |
| Methodische Kompetenz | Planen, Dokumentieren, Auswerten |

### LP21-Abdeckung bei Templates

Bei jedem Projekttemplate wird angezeigt:

- Abdeckung in Prozent
- Anzahl Aufgaben mit vs. ohne LP21-Referenz
- Welche Lernziele noch nicht abgedeckt sind

Lehrpersonen können neue Aufgaben erfassen, mit LP21-Codes verknüpfen und das Template mit anderen Schulen teilen. So steigt die Abdeckung kollaborativ:

```
Template "Gemüsefläche" v1 -- LP21-Abdeckung: 40%
  -> Schule A fügt 5 Aufgaben hinzu -- LP21-Abdeckung: 55%
    -> Schule A teilt Template
      -> Schule B importiert und fügt 3 Aufgaben hinzu -- LP21-Abdeckung: 65%
        -> Alle Schulen profitieren von wachsender Abdeckung
```

---

## 7. Projekt-Templates

### Kern-Idee

- Lehrpersonen sollen ohne grossen Aufwand ein Projekt starten können
- Templates enthalten fertige Aufgaben mit Arbeitsblättern
- Jedes Template ist mit dem Lehrplan 21 verknüpft
- Templates können erweitert und mit anderen Schulen geteilt werden

### Aufbau eines Projekt-Templates

**Grundinformationen:**
- Name (z.B. "Gemüsefläche", "Hochbeet", "Bienenstock")
- Beschreibung, Kategorie (Gemüse, Ökologie, Bienen, Hochbeet, Garten, Sonstiges)
- Schwierigkeitsgrad (Einfach / Mittel / Schwer)
- Empfohlene Klassenstufe und geschätzte Dauer

**Aufgaben-Templates** -- gegliedert nach Projektphasen (Vorprojekt, Planung, Pflanzung, Pflege, Ernte, Verarbeitung, Vermarktung).

**Voraussetzungen** -- was im Vorprojekt vorbereitet werden muss (Material, Baumaterial, Schulungen, Genehmigungen, Infrastruktur).

**Materialien** -- Liste aller benötigten Materialien mit Bezeichnung, Menge, Bezugsort und Kosten.

### Template-Lebenszyklus

1. **Erstellen:** Plantoria stellt Basis-Templates bereit. Lehrpersonen können eigene erstellen.
2. **Verwenden:** Template auswählen, daraus konkretes Klassenprojekt erstellen. Aufgaben werden übernommen.
3. **Erweitern:** Neue Aufgaben hinzufügen, mit LP21-Codes verknüpfen, Arbeitsblätter ergänzen.
4. **Teilen:** Als "geteilt" markieren. Andere Schulen können es finden und importieren.
5. **Importieren:** Kopie erstellen, die wiederum erweitert werden kann. Versionierung.

### Template-Auswahl

**Filter:** Kategorie, Klassenstufe, Schwierigkeitsgrad, LP21-Abdeckung.

**Pro Template angezeigt:** Name, Beschreibung, Kategorie, Schwierigkeitsgrad, Klassenstufe, LP21-Abdeckung (%), Aufgabenanzahl (mit/ohne LP21-Ref), erstellt von, Nutzung durch andere Schulen.

```
+-----------------------------------------------------+
|  Projekt-Templates                                  |
|  Filter: [Alle] [Gemüse] [Hochbeet] [Bienen]      |
+-----------------------------------------------------+
|                                                     |
|  +------------------------------------------+       |
|  | Gemüsefläche                           |       |
|  | Kategorie: Gemüse  |  Stufe: 3-6       |       |
|  | Schwierigkeit: Mittel                    |       |
|  |                                          |       |
|  | LP21-Abdeckung: ========--  65%          |       |
|  | Aufgaben: 18 (12 mit LP21, 6 ohne)       |       |
|  | Erstellt von: Plantoria                  |       |
|  | Genutzt von: 12 Schulen                  |       |
|  |                                          |       |
|  | [Vorschau]  [Projekt erstellen]          |       |
|  +------------------------------------------+       |
|                                                     |
+-----------------------------------------------------+
```

---

## 8. Projektphasen und Vorprojekt

### Phasen innerhalb eines Projekts

Am Beispiel des Fokus-Projekts "Gemüsefläche":

| Phase | Beispiel-Aufgaben |
|-------|-------------------|
| **Vorprojekt** | Standort begutachten, Material beschaffen, Genehmigungen einholen |
| **Planung** | Beetplan zeichnen, Flächenberechnung, Pflanzpartner auswählen, Zeitplan erstellen |
| **Pflanzung** | Boden vorbereiten, Säen und Setzen nach Plan, Beete beschriften |
| **Pflege** | Giessplan umsetzen, Unkraut jäten, Schädlinge beobachten, Wachstum dokumentieren |
| **Ernte** | Erntezeitpunkt bestimmen, Ernten, Dokumentieren und Wiegen |
| **Verarbeitung** | Produkte herstellen (Suppe, Kräutersalz), gemeinsam kochen |
| **Vermarktung** | Preise kalkulieren, Verkaufsstand gestalten, am Harvest-Markt verkaufen |

### Vorprojekt im Detail

Jedes Projekt beginnt mit einem Vorprojekt -- einer strukturierten Checkliste für die Lehrperson.

**Kategorien von Voraussetzungen:**

| Kategorie | Beispiele |
|-----------|-----------|
| Material | Saatgut (Sorten, Mengen), Erde/Kompost, Werkzeug, Anzuchtschalen |
| Baumaterial | Holz, Schrauben, Folie/Vlies, Drainage-Material |
| Schulungen | Einführungskurs "Gärtnern mit Kindern", Workshop Beetplanung, Kurs Fruchtfolge |
| Genehmigungen | Schulleitung, Hauswart/Facility Management, Gemeinde, Einverständnis Eltern |
| Praxisaufträge | Standort begutachten/vermessen, Boden testen (pH-Wert), Sonnenverhältnisse prüfen |
| Infrastruktur | Wasseranschluss, Lagerraum, Zugang zum Gelände |

**Ablauf:**
1. Lehrperson wählt Projekttemplate
2. Vorprojekt wird automatisch generiert (Voraussetzungen aus Template)
3. Lehrperson geht Voraussetzungen durch und arbeitet Checkliste ab
4. Alle Voraussetzungen erfüllt -> Projekt kann gestartet werden (Status wechselt zu "Projektstart")

**Verbindung zu Produktpaketen:** Die Voraussetzungen sind direkt mit den Produktpaketen der Produktwebseite verknüpft. Material-Paket deckt "Material" ab, Komplett-Paket deckt Material + Baumaterial ab. So kann fehlendes Material direkt bestellt werden.

```
+-----------------------------------------------------+
|  Vorprojekt: Gemüsefläche HE24a                  |
|  Status: In Bearbeitung  |  Fortschritt: 60%       |
+-----------------------------------------------------+
|                                                     |
|  Material:                                          |
|  [x] Saatgut (Rübli, Kohl, Kräuter)              |
|  [x] Erde und Kompost                              |
|  [ ] Werkzeug (Schaufeln, Giesskannen)              |
|                                                     |
|  Baumaterial:                                       |
|  [ ] Holz für Hochbeet                             |
|  [ ] Schrauben und Folie                            |
|                                                     |
|  Schulungen:                                        |
|  [x] Einführungskurs besucht                      |
|                                                     |
|  Genehmigungen:                                     |
|  [x] Schulleitung informiert                        |
|  [x] Hauswart kontaktiert                           |
|                                                     |
|  Praxisaufträge:                                   |
|  [x] Standort begutachtet                           |
|  [ ] Boden getestet                                 |
|                                                     |
|  Infrastruktur:                                     |
|  [x] Wasseranschluss vorhanden                      |
|  [x] Lagerraum verfügbar                           |
|                                                     |
+-----------------------------------------------------+
```

---

## 9. Harvest-Märkte

### Konzept

Mehrere Schulen, die Plantoria-Projekte umsetzen, stellen ihre Produkte und Projekte gemeinsam aus und verkaufen sie. Einnahmen fliessen z.B. in die Klassenfahrt.

**Zweck:**
- Motivation: Schüler arbeiten auf ein konkretes Ziel hin
- Lerneffekt: Vermarktung, Preiskalkulation, Präsentation
- Gemeinschaft: Schulen vernetzen sich
- Finanzierung: Einnahmen für Klassenkasse
- Sichtbarkeit: Plantoria-Projekte werden öffentlich sichtbar

**Was wird verkauft:** Frisches Gemüse/Kräuter, verarbeitete Produkte (Suppen, Saucen, Marmeladen), Kräutersalz/-öl, Saatgut-Tütchen, kreative Produkte der Schüler.

**Was wird ausgestellt:** Projektbeschreibung, Fotos, Statistiken, Erfahrungsberichte.

### Phasen der Vorbereitung

| Phase | Aktivität | Zeitpunkt |
|-------|-----------|----------|
| 1. Anmeldung | Klasse meldet sich an | Ca. 2 Monate vorher |
| 2. Produkt-Ideen | Schüler überlegen Produkte | Ca. 6 Wochen vorher |
| 3. Produktion | Produkte herstellen | Ca. 2--4 Wochen vorher |
| 4. Preiskalkulation | Preise berechnen | Ca. 2 Wochen vorher |
| 5. Standgestaltung | Verkaufsstand planen | Ca. 1 Woche vorher |
| 6. Durchführung | Verkauf am Markttag | Markttag |
| 7. Auswertung | Einnahmen, Reflexion | Nach dem Markt |

### Plattform-Integration

- Lehrpersonen: Märkte einsehen, Klasse anmelden, Produkte erfassen, Einnahmen dokumentieren
- Schüler: Harvest-Markt-Termine im Dashboard, Produkte vorbereiten als Aufgabe
- Dashboard: Termine im Kalender, Einnahmen in Statistiken

---

## 10. Datenmodell

### Übersicht

```
+--------------+     +-------------------+     +--------------+
|  Lehrplan 21 |---->|  Projekttemplate   |---->|   Projekt    |
|              |     |                   |     |              |
|  - Fachbereich    |  - Aufgaben-Tmpl   |     |  - Klasse    |
|  - Lernziele |     |  - Materialien    |     |  - Standort  |
|  - Kompetenzen    |  - Schwierigkeit   |     |  - Status    |
+--------------+     +-------------------+     +------+-------+
                                                      |
                              +----------------+------+-------+
                              |                |              |
                        +-----+------+  +------+-----+ +-----+------+
                        | Vorprojekt |  |  Aufgaben  | |  Schüler  |
                        |            |  |            | |  / Gruppen |
                        | - Voraus-  |  | - LP21-Ref | |            |
                        |   setzungen|  | - PDFs     | |            |
                        | - Material |  | - Status   | |            |
                        +------------+  +------------+ +------------+
```

### Entitäten

#### Lehrplan (Curriculum)

| Feld | Beschreibung | Beispiel |
|------|-------------|---------|
| ID | Eindeutiger Bezeichner | -- |
| Code | Lehrplan-21-Code | "NMG.2.1" |
| Fachbereich | Übergeordneter Bereich | "Natur, Mensch, Gesellschaft" |
| Themen | Liste von Lehrplan-Themen | -- |

#### Lehrplan-Thema (CurriculumTopic)

| Feld | Beschreibung | Beispiel |
|------|-------------|---------|
| ID | Eindeutiger Bezeichner | -- |
| Lehrplan-ID | Zugehöriger Lehrplan | -- |
| Code | LP21-Themen-Code | "NMG.2.1.a" |
| Titel | Themenbezeichnung | "Tiere und Pflanzen in ihren Lebensräumen" |
| Beschreibung | Detaillierte Beschreibung | -- |
| Klassenstufe | Für welche Stufe | 1--6 |
| Kompetenzen | Kompetenzbeschreibungen | -- |

#### Projekttemplate

| Feld | Beschreibung | Beispiel |
|------|-------------|---------|
| ID | Eindeutiger Bezeichner | -- |
| Name | Templatename | "Gemüsefläche", "Bienenstock" |
| Beschreibung | Detaillierte Beschreibung | -- |
| Kategorie | Projektkategorie | Gemüse, Ökologie, Bienen, Hochbeet, Garten, Sonstiges |
| LP21-Referenzen | Verknüpfungen zum Lehrplan 21 | Liste von Codes |
| Aufgaben-Templates | Vorlagen für Aufgaben | -- |
| Materialien | Benötigte Materialien | -- |
| Voraussetzungen | Vorprojekt-Voraussetzungen | -- |
| Schwierigkeit | Schwierigkeitsgrad | Einfach / Mittel / Schwer |
| Klassenstufe | Für welche Stufe | z.B. 3--6 |
| Geschätzte Dauer | Zeitrahmen | "1 Schuljahr", "6 Monate" |
| LP21-Abdeckung | Wie viel % vom LP21 abgedeckt | z.B. 65% |
| Erstellt von | Schule / Lehrperson | -- |
| Geteilt | Öffentlich für andere Schulen? | Ja / Nein |
| Version | Versionsnummer | -- |

#### Aufgaben-Template (TaskTemplate)

| Feld | Beschreibung | Beispiel |
|------|-------------|---------|
| ID | Eindeutiger Bezeichner | -- |
| Template-ID | Zugehöriges Projekttemplate | -- |
| Titel | Aufgabentitel | "Standort analysieren" |
| Beschreibung | Detaillierte Beschreibung | -- |
| Phase | Projektphase | Vorprojekt / Planung / Pflanzung / Pflege / Ernte / Verarbeitung / Vermarktung |
| Klassenstufe | Für welche Stufe(n) | z.B. 3, 4, 5 |
| Schwierigkeit | Schwierigkeitsgrad | Einfach / Mittel / Schwer |
| LP21-Referenzen | Welche LP21-Ziele deckt die Aufgabe ab | Liste von Codes |
| Arbeitsblätter | Verknüpfte Arbeitsblätter | -- |
| Geschätzter Aufwand | Zeitaufwand | "2 Lektionen" |
| Fachbereich | Thematischer Fachbereich | Boden / Fruchtfolge / Gemüsearten / Gesundheit / Flächengestaltung / Beetplanung / Mathematik / Ernährung / Ökologie |
| Reihenfolge | Sortierung innerhalb der Phase | -- |

#### Arbeitsblatt (Worksheet)

| Feld | Beschreibung | Beispiel |
|------|-------------|---------|
| ID | Eindeutiger Bezeichner | -- |
| Aufgaben-Template-ID | Zugehörige Aufgabe | -- |
| Titel | Bezeichnung | "Bodentypen bestimmen" |
| Beschreibung | Inhaltsbeschreibung | -- |
| Dateiformat | Format | PDF / DOCX |
| Datei-URL | Download-Link | -- |
| LP21-Referenzen | LP21-Ziele, die beim Download als behandelt markiert werden | Liste von Codes |
| Klassenstufe | Für welche Stufe(n) | -- |
| Schwierigkeit | Schwierigkeitsgrad | Einfach / Mittel / Schwer |

#### Projekt (Project)

| Feld | Beschreibung | Beispiel |
|------|-------------|---------|
| ID | Eindeutiger Bezeichner | -- |
| Template-ID | Zugehöriges Projekttemplate | -- |
| Schul-ID | Zugehörige Schule | -- |
| Klassen-ID | Zugehörige Klasse | -- |
| Projektname | Bezeichnung | "HE24a - Gemüsefläche" |
| Beschreibung | Detaillierte Beschreibung | -- |
| Fläche | Fläche in m2 | 10 |
| Status | Projektstatus | Vorprojekt / Projektstart / Laufend / Abgeschlossen |
| Aktuelle Phase | Phase im Projektablauf | Vorprojekt / Planung / Pflanzung / Pflege / Ernte / Verarbeitung / Vermarktung |
| Fortschritt | Gesamtfortschritt | 0--100% |
| Standort | Geo-Koordinaten + Beschreibung | "Hinter dem Schulhaus, Südseite" |
| Startdatum | Projektbeginn | -- |

#### Vorprojekt (PreProject)

| Feld | Beschreibung |
|------|-------------|
| ID | Eindeutiger Bezeichner |
| Projekt-ID | Zugehöriges Projekt |
| Voraussetzungen | Liste der Voraussetzungen (Kategorien: Material, Baumaterial, Schulung, Genehmigung, Praxisauftrag, Infrastruktur) |
| Checkliste | Abzuarbeitende Punkte mit Status |
| Status | Offen / In Bearbeitung / Abgeschlossen |

#### Aufgabe (Task)

| Feld | Beschreibung | Beispiel |
|------|-------------|---------|
| ID | Eindeutiger Bezeichner | -- |
| Projekt-ID | Zugehöriges Projekt | -- |
| Aufgaben-Template-ID | Referenz auf Template (optional) | -- |
| Titel | Aufgabentitel | "Pflanzt Kohl in Beet 3" |
| Beschreibung | Detaillierte Beschreibung | -- |
| Phase | Projektphase | -- |
| Status | Bearbeitungsstatus | Offen / In Bearbeitung / Erledigt |
| Zugewiesene Gruppe | Schülergruppe | -- |
| Fälligkeitsdatum | Deadline | -- |
| Saison | Relevante Jahreszeit | "Mai" |
| LP21-Referenzen | Verknüpfte Lernziele | -- |
| Arbeitsblätter | Zugehörige Materialien | -- |
| Download-Tracking | Protokollierte Downloads | Wer, wann, welches Arbeitsblatt, welche LP21-Ziele |

#### Kultur (Culture)

| Feld | Beschreibung | Beispiel |
|------|-------------|---------|
| ID | Eindeutiger Bezeichner | -- |
| Projekt-ID | Zugehöriges Projekt | -- |
| Pflanzenname | Bezeichnung | "Rübli", "Kohl", "Tomaten" |
| Pflanzentyp | Kategorie | Gemüse / Kräuter / Beeren |
| Status | Wachstumsstatus | Geplant / Gesät / Wächst / Erntereif / Geerntet |
| Fortschritt | Wachstumsfortschritt | 0--100% |
| Aussaatdatum | Datum der Aussaat | -- |
| Erwartetes Erntedatum | Prognose | -- |
| Tatsächliches Erntedatum | Reales Datum | -- |
| Beet-Nummer | Wo angepflanzt | "Beet 3" |
| Factsheet-ID | Verknüpftes Factsheet | -- |

#### Factsheet

| Feld | Beschreibung | Beispiel |
|------|-------------|---------|
| Pflanzenname | Bezeichnung | "Rübli", "Kohl" |
| Pflanzentyp | Kategorie | -- |
| Bodenanforderungen | Welcher Boden | "Lockerer, sandiger Boden" |
| Aussaatzeitpunkt | Wann säen | "März--Mai" |
| Erntezeitpunkt | Wann ernten | "Juli--Oktober" |
| Gesundheitsaspekte | Nährwert, Vitamine | -- |
| Pflegeanleitung | Wie pflegen | -- |
| Gute Nachbarn | Begleitpflanzen | Zwiebeln, Salat |
| Schlechte Nachbarn | Unverträgliche Pflanzen | Dill |
| Schwierigkeit | Anbau-Schwierigkeit | Einfach / Mittel / Schwer |

#### Schule (School)

| Feld | Beschreibung | Beispiel |
|------|-------------|---------|
| ID | Eindeutiger Bezeichner | -- |
| Name | Schulname | "Primarschule Musterstadt" |
| Standort | Geo-Koordinaten + Adresse | -- |
| Kanton | Schweizer Kanton | "AG" |
| Ranking | Platzierung | -- |
| Gesamtfläche | Bewirtschaftete Fläche in m2 | -- |

#### Schulklasse (SchoolClass)

| Feld | Beschreibung | Beispiel |
|------|-------------|---------|
| ID | Eindeutiger Bezeichner | -- |
| Schul-ID | Zugehörige Schule | -- |
| Name | Klassenbezeichnung | "HE24a" |
| Klassenstufe | Stufe 1--6 | 4 |
| Lehrperson-ID | Zugewiesene Lehrperson | -- |

#### Schüler (Student)

| Feld | Beschreibung | Beispiel |
|------|-------------|---------|
| ID | Eindeutiger Bezeichner | -- |
| Name | Schülername | "Anna M." |
| Klassen-ID | Zugehörige Klasse | -- |
| Klassenstufe | Stufe 1--6 | 4 |
| Tablet-Zugang | Hat Tablet ab 3. Klasse | Ja / Nein |

#### Schülergruppe (StudentGroup)

| Feld | Beschreibung | Beispiel |
|------|-------------|---------|
| ID | Eindeutiger Bezeichner | -- |
| Projekt-ID | Zugehöriges Projekt | -- |
| Name | Gruppenname | "Gruppe Sonnenblume" |
| Schüler | Liste der Schüler-IDs | -- |

#### Benutzer (User)

| Feld | Beschreibung | Beispiel |
|------|-------------|---------|
| ID | Eindeutiger Bezeichner | -- |
| E-Mail | E-Mail-Adresse | -- |
| Rolle | Benutzerrolle | Admin / Lehrperson / Schüler / Eltern |
| Schul-ID | Zugehörige Schule | -- |
| Name | Anzeigename | -- |

#### Lehrplan-Fortschritt (CurriculumProgress)

| Feld | Beschreibung | Beispiel |
|------|-------------|---------|
| ID | Eindeutiger Bezeichner | -- |
| Klassen-ID | Zugehörige Klasse | -- |
| Schuljahr | Aktuelles Schuljahr | "2025/2026" |
| Behandelte Themen | Liste der behandelten LP21-Themen | -- |
| Gesamtanzahl Themen | Alle relevanten LP21-Themen | -- |
| Abdeckung in Prozent | Fortschritt | z.B. 45% |

Pro behandeltes Thema wird festgehalten: LP21-Code, Datum, durch welche Aufgabe/welchen Download, in welchem Projekt.

#### Harvest-Markt (HarvestMarket)

| Feld | Beschreibung | Beispiel |
|------|-------------|---------|
| ID | Eindeutiger Bezeichner | -- |
| Name | Marktbezeichnung | "Herbst-Harvest-Markt 2026" |
| Datum | Veranstaltungsdatum | -- |
| Standort | Ort der Veranstaltung | -- |
| Teilnehmende Schulen | Liste der Schulen | -- |
| Produkte | Liste der angebotenen Produkte (Name, Preis, Menge, hergestellt von) | -- |

### Beziehungen

```
Curriculum --1:N--> CurriculumTopic
ProjectTemplate --N:M--> CurriculumTopic (via LP21-Referenzen)
ProjectTemplate --1:N--> TaskTemplate
ProjectTemplate --1:N--> Material
ProjectTemplate --1:N--> Prerequisite
TaskTemplate --N:M--> CurriculumTopic (via LP21-Referenzen)
TaskTemplate --1:N--> Worksheet
Worksheet --N:M--> CurriculumTopic (via LP21-Referenzen)
Project --N:1--> ProjectTemplate
Project --N:1--> School
Project --N:1--> SchoolClass
Project --1:1--> PreProject
Project --1:N--> Task
Project --1:N--> Culture
Project --1:N--> StudentGroup
Task --N:1--> TaskTemplate (optional)
Task --1:N--> WorksheetDownload
StudentGroup --N:M--> Student
SchoolClass --1:N--> Student
SchoolClass --N:1--> User (Lehrperson)
School --1:N--> SchoolClass
School --1:N--> Project
CurriculumProgress --N:1--> SchoolClass
HarvestMarket --N:M--> School
HarvestMarket --1:N--> MarketProduct
```

### Kern-Flows

**Flow 1: Lehrplan -> Aufgabe -> Fortschritt**

```
Lehrplan 21 (Lernziel NMG.2.1.a)
    -> Projekttemplate "Gemüsefläche" (referenziert NMG.2.1.a)
      -> Aufgaben-Template "Boden analysieren" (referenziert NMG.2.1.a)
        -> Arbeitsblatt "Bodentypen" (referenziert NMG.2.1.a)
          -> Lehrperson lädt Arbeitsblatt herunter
            -> System markiert NMG.2.1.a als "behandelt" in CurriculumProgress
              -> Dashboard zeigt aktualisierten Fortschritt
```

**Flow 2: Template-Sharing zwischen Schulen**

```
Schule A erstellt Projekttemplate
  -> Lehrperson erweitert Template um neue Aufgaben
    -> Template wird als "geteilt" markiert
      -> Schule B findet Template in der Plattform
        -> Schule B importiert Template und erstellt eigenes Projekt daraus
          -> LP21-Abdeckung steigt durch mehr Aufgaben
```

---

## 11. Team und Partner

**Team:** Louis, Roland

**Partner:**
- Bildung Aargau
- Gemüseackerdemie
- Schulgarten.ch

**Referenzen:**
- Bugalu Ostschweiz -- Marktwoche, bei der mehrere Schulen Produkte herstellen und verkaufen
- Nichtrauch-Challenges -- Vorbild für Gamification und Schulrankings
