# PLANTORIA — Brainstorm

> Derived from brainstorm session on 2026-02-06
> Source: `spec/brainstorm-2026-02-06-1134.excalidraw`

---

## Vision

Plantoria is a **web-based educational platform** that brings gardening, nature, and sustainability into Swiss school classrooms. It connects digital learning with hands-on outdoor experience — from Kindergarten through 6th grade (with extension potential to secondary school).

**Core mission:** Give as many children as possible the opportunity to learn outdoors, supported by curriculum-aligned teaching materials (Lehrplan21).

---

## Target Users

| User | Needs |
|---|---|
| **Students (3rd grade primary focus)** | Engaging, gamified outdoor learning; age-appropriate tasks and content |
| **Teachers (Lehrpersonen)** | Curriculum-mapped teaching materials; project management tools; class administration |
| **Parents (Eltern)** | Visibility into what their children are learning and doing |

---

## Product Goals (Ziel des Produkts)

- Give as many children as possible the opportunity to learn outdoors
- Provide curriculum-aligned teaching materials (Lehrplan21)
- Connect multiple school subjects: science (NMG — Natur, Mensch, Umwelt), math, crafts (Werken), nutrition
- Foster appreciation for agriculture and its products
- Promote networked thinking and responsibility
- Accompany students from school start through their school career

---

## Hackathon Goals (Ziel des Hackathons)

- **1 project/measure for children:** Vegetable garden bed (Gemüsebeet)
- **Prototype with:**
  - Children can view a project/measure
  - Children can choose a location (Standort)
  - Teacher view with two areas: knowledge area + didactics area (tasks for children)
  - Dashboard

---

## Key Concepts

### Cross-curricular Learning (Fächer- und stufenübergreifend)
- Math: planning the raised bed dimensions
- Crafts (Werken): building the raised bed
- Science (NMG): soil biology, organisms, plant lifecycle
- Nutrition: harvesting, processing, eating together
- Health: proper handwashing after garden work

### Nature & Science Topics
- Soil activity and microorganisms
- Creatures in the soil (e.g. earthworms, earthworm composting)
- Plant lifecycles: carrots, caterpillars (swallowtail butterfly), food chains
- Seasonal awareness: what grows locally throughout the year
- Seed starting vs. seedlings; sourcing seeds and materials

### Gamification
- Rankings between classes as motivators
- School-wide, canton-wide, and Switzerland-wide comparisons (like non-smoking challenges)
- Points, progress bars, achievement tracking
- Difficulty levels adapted by grade/age

### Harvest Market
- Schools/classes sell their products and present their projects
- Products from the garden can fund class trips
- Connects to financial literacy learning
- Reference model: Bugalu Ostschweiz (multi-school market week)

### Learning Outdoors + Digital
- Tablets available from 3rd grade
- Connection between tablet use and being outdoors
- Digital forecast of how the garden bed will look in X months
- Timeline with long-term task overview
- Infoscreen with garden overview

---

## MVP Scope — Minimal Viable Product

**Goal:** MVP for first test & feedback

### Pre-project Phase
- Students choose their class project (ecological measures, raised bed, garden, beehive, etc.)
- Choose and record the project location

### Running Project Phase
- Fact sheets for each vegetable/berry/fruit (soil, sowing, health benefits, etc.)
- Teaching material provided per project phase
- Digital garden creation
- Progress tracking per crop/culture
- Practical outdoor tasks paired with teaching material

---

## App Views (Ansichten)

### Dashboard
- Progress overview
- Ranking (school-level and Switzerland-wide)
- To-dos
- Statistics and evaluations
- Calendar

### Teacher View (Lehrpersonen-Ansicht)
- Subject areas: soil, crop rotation, vegetable types, health, bed planning
- Teaching material (grades 1–2 and 3–6)
- Project management
- Student management
- Student-to-project mapping
- Tutorial

### Student View (Schüleransicht)
- Teaching material appropriate for grades 3–6
- Group tasks (e.g. "Plant cabbage in bed 3")
- Class overview (e.g. "Klasse HE24a")
- Subject areas with curriculum content
- Pending tasks (Pendenzen)
- Project materials list

### Parent Portal (Eltern-Portal)
- Information on child's learning progress
- Curriculum mapping information

### Product Website
- Platform login
- Idea publication: how other schools can participate
- Product presentation and project packages

---

## Work Packages / Epics (Arbeitspakete)

| Epic | Description |
|---|---|
| **Setup** | Tech stack definition (Vue.js); access/login concept; frontend; backend; data model |
| **Concept / Modeling** | Define app entities: curriculum, didactic materials, knowledge materials, tasks/projects, infrastructure |
| **Dashboard** | Progress, ranking, to-dos, statistics, calendar |
| **Teacher View** | Subject areas, teaching materials (by grade), project & student management |
| **Student View** | Grade-appropriate materials, group tasks, project interaction |
| **Parent Portal** | Learning progress info, curriculum mapping |
| **Product Website** | Login, onboarding for new schools, product packages |
| **Project Prerequisites** | Teacher training courses; project materials (seeds, beehive kits, etc.) with sourcing & shopping lists; packages for sale via the platform |

---

## Teaching Material & Didactics

- Word/PDF teaching materials per measure
- Running projects/beds as live content
- Template of activities mapped to Lehrplan21
- Content appropriate per difficulty level and age
- Existing material to review and integrate
- Optimal delivery of learning materials

### Curriculum Integration (Lehrplan21)
- NMG (Natur, Mensch, Umwelt)
- Math
- Cross-subject connections

---

## Existing Networks / Partners

- Bildung Aargau
- Gemüseackerdemie
- Schulgarten.ch

---

## Competitive Landscape

- Open question: What solutions already exist?
- Key differentiators (Alleinstellungsmerkmale) to be defined
- Scalability and reach (Ausbaufähigkeit / Verbreitung) as a design goal

---

## Technical Decisions

- **Platform:** Web-based, technology-open
- **Frontend:** Vue.js
- **Approach:** Prototype development with base functionalities
- **Design:** Moodboard to be created; UX/UI exploration needed
- **Mascots:** Cute vegetable characters (carrot, broccoli, tomato, leek) — colorful cartoon style, child-friendly, educational mood

---

## Data Model (High-Level)

```
Lehrplan (Curriculum)
  └── Projekttemplate (Project Template)
        ├── umsetzen (implement) → Projekt (Project)
        │     ├── bearbeiten (edit)
        │     ├── Aufgaben (Tasks)
        │     ├── Status / Fortschritt (Progress)
        │     └── Schüler / Gruppen (Students / Groups)
        └── Template teilen (share template)
```

---

## Open Questions

- How to display locations? Points on a map? Areas? Photos? Forms?
- Do we already have teaching material to review?
- Seeds: pre-grow or seedlings? Where to source?
- Can we already sketch the UI?
- How to show neighborhood connections — plant companions, animal territories, human activity?
- Failures and pests are part of the learning experience — not a bug, a feature

---

*Team: Roland, Louis*
