import type { ProjectTemplate, TaskTemplate, TemplateMaterial } from '@/types'
import { fixtureTopicTemplates } from './topics'

// ============================================================
// Aufgaben-Vorlagen fuer Template "Gemueseflaeche" (tmpl-1)
// Jede TaskTemplate gehoert zu einer TopicTemplate via topicTemplateId
// Vorprojekt-Tasks entfallen (werden durch PreProject abgedeckt)
// ============================================================

export const fixtureTaskTemplates: TaskTemplate[] = [
  // -- Beetplanung (topic-tmpl-1) --
  { id: 'tt-1', templateId: 'tmpl-1', topicTemplateId: 'topic-tmpl-1', title: 'Beetplan zeichnen', lp21Refs: ['MA.2.A'], materialIds: ['mat-4'], order: 1 },
  { id: 'tt-2', templateId: 'tmpl-1', topicTemplateId: 'topic-tmpl-1', title: 'Flächenberechnung', lp21Refs: ['MA.2.A'], materialIds: ['mat-8'], order: 2 },
  { id: 'tt-3', templateId: 'tmpl-1', topicTemplateId: 'topic-tmpl-1', title: 'Pflanzpartner bestimmen', lp21Refs: ['NMG.2.1'], materialIds: ['mat-3'], order: 3 },
  { id: 'tt-4', templateId: 'tmpl-1', topicTemplateId: 'topic-tmpl-1', title: 'Zeitplan erstellen', lp21Refs: [], materialIds: [], order: 4 },

  // -- Beetvorbereitung (topic-tmpl-2) --
  { id: 'tt-5', templateId: 'tmpl-1', topicTemplateId: 'topic-tmpl-2', title: 'Boden vorbereiten', lp21Refs: ['NMG.2.3'], materialIds: ['mat-1'], order: 1 },

  // -- Jungpflanzen anziehen (topic-tmpl-3) --
  { id: 'tt-6', templateId: 'tmpl-1', topicTemplateId: 'topic-tmpl-3', title: 'Samen vorziehen (indoor)', lp21Refs: ['NMG.2.1', 'NMG.2.2'], materialIds: [], order: 1 },

  // -- Aussaeen / Auspflanzen (topic-tmpl-4) --
  { id: 'tt-7', templateId: 'tmpl-1', topicTemplateId: 'topic-tmpl-4', title: 'Säen nach Plan', lp21Refs: ['NMG.2.1', 'NMG.2.2'], materialIds: [], order: 1 },
  { id: 'tt-8', templateId: 'tmpl-1', topicTemplateId: 'topic-tmpl-4', title: 'Setzlinge einpflanzen', lp21Refs: ['NMG.2.1'], materialIds: [], order: 2 },
  { id: 'tt-9', templateId: 'tmpl-1', topicTemplateId: 'topic-tmpl-4', title: 'Beete beschriften', lp21Refs: [], materialIds: [], order: 3 },

  // -- Kulturschutz (topic-tmpl-5) --
  { id: 'tt-10', templateId: 'tmpl-1', topicTemplateId: 'topic-tmpl-5', title: 'Schädlinge beobachten', lp21Refs: ['NMG.2.1'], materialIds: [], order: 1 },

  // -- Jaeten (topic-tmpl-7) --
  { id: 'tt-11', templateId: 'tmpl-1', topicTemplateId: 'topic-tmpl-7', title: 'Unkraut jäten', lp21Refs: [], materialIds: [], order: 1 },

  // -- Bewaessern (topic-tmpl-8) --
  { id: 'tt-12', templateId: 'tmpl-1', topicTemplateId: 'topic-tmpl-8', title: 'Giessplan umsetzen', lp21Refs: [], materialIds: [], order: 1 },

  // -- Ernte (topic-tmpl-9) --
  { id: 'tt-13', templateId: 'tmpl-1', topicTemplateId: 'topic-tmpl-9', title: 'Erntezeitpunkt bestimmen', lp21Refs: ['NMG.2.2'], materialIds: [], order: 1 },
  { id: 'tt-14', templateId: 'tmpl-1', topicTemplateId: 'topic-tmpl-9', title: 'Ernte dokumentieren', lp21Refs: ['MA.3.A'], materialIds: [], order: 2 },

  // -- Verarbeitung (topic-tmpl-10) --
  { id: 'tt-15', templateId: 'tmpl-1', topicTemplateId: 'topic-tmpl-10', title: 'Gemüsesuppe kochen', lp21Refs: ['WAH.3'], materialIds: ['mat-9'], order: 1 },

  // -- Vermarktung (topic-tmpl-11) --
  { id: 'tt-16', templateId: 'tmpl-1', topicTemplateId: 'topic-tmpl-11', title: 'Produkte am Harvest-Markt verkaufen', lp21Refs: ['WAH.1', 'MA.3.A'], materialIds: ['mat-10'], order: 1 },
]

const gemueseMaterials: TemplateMaterial[] = [
  { id: 'tm-1', name: 'Saatgut Rübli', quantity: '2 Pck.', source: 'Landi', cost: 'CHF 4.50' },
  { id: 'tm-2', name: 'Saatgut Kohl', quantity: '1 Pck.', source: 'Landi', cost: 'CHF 3.80' },
  { id: 'tm-3', name: 'Erde', quantity: '50 Liter', source: 'Baumarkt', cost: 'CHF 15.00' },
  { id: 'tm-4', name: 'Kompost', quantity: '25 Liter', source: 'Gemeinde', cost: 'CHF 5.00' },
  { id: 'tm-5', name: 'Giesskannen', quantity: '4 Stk.', source: 'Baumarkt', cost: 'CHF 32.00' },
]

// TopicTemplates fuer tmpl-1 filtern
const gemuseTopics = fixtureTopicTemplates.filter(t => t.templateId === 'tmpl-1')

export const fixtureTemplates: ProjectTemplate[] = [
  {
    id: 'tmpl-1',
    name: 'Gemüsefläche',
    description: 'Vollständiges Template für den Aufbau und die Bewirtschaftung einer Gemüsefläche im Schulgarten. Deckt alle Phasen von der Planung bis zur Vermarktung ab.',
    category: 'Gemüse',
    lp21Refs: ['NMG.2.1', 'NMG.2.2', 'NMG.2.3', 'NMG.2.6', 'MA.2.A', 'MA.3.A', 'WAH.1', 'WAH.3'],
    difficulty: 'Mittel',
    gradeRange: '3-6',
    estimatedDuration: '1 Schuljahr',
    lp21Coverage: 65,
    createdBy: 'Plantoria',
    shared: true,
    usedBySchools: 12,
    version: 3,
    isOwn: true,
    isPlatform: true,
    topics: gemuseTopics,
    materials: gemueseMaterials,
  },
  {
    id: 'tmpl-2',
    name: 'Hochbeet kompakt',
    description: 'Einsteigerfreundliches Template für den Bau und die Bepflanzung eines Hochbeets. Ideal für Schulen mit wenig Platz.',
    category: 'Hochbeet',
    lp21Refs: ['NMG.2.1', 'NMG.2.3', 'TTG.2', 'MA.2.A'],
    difficulty: 'Einfach',
    gradeRange: '1-4',
    estimatedDuration: '6 Monate',
    lp21Coverage: 40,
    createdBy: 'Schule Zug',
    shared: true,
    usedBySchools: 8,
    version: 2,
    isOwn: false,
    isPlatform: false,
    topics: [],
  },
  {
    id: 'tmpl-3',
    name: 'Bienenstock',
    description: 'Umfassendes Bienenprojekt zur Förderung des Verständnisses für Biodiversität, Bestäubung und Ökologie.',
    category: 'Bienen',
    lp21Refs: ['NMG.2.1', 'NMG.2.2', 'NMG.2.6'],
    difficulty: 'Schwer',
    gradeRange: '4-6',
    estimatedDuration: '1 Schuljahr',
    lp21Coverage: 50,
    createdBy: 'Plantoria',
    shared: true,
    usedBySchools: 5,
    version: 1,
    isOwn: false,
    isPlatform: true,
    topics: [],
  },
]
