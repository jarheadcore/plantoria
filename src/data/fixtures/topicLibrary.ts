import type { TopicTemplate, TaskTemplate } from '@/types'

// ============================================================
// Eigenstaendige Fachbereich-Vorlagen (Bibliothek)
// isLibrary: true, templateId: '' (gehoeren keinem Projekt-Template)
// ============================================================

export const fixtureLibraryTopics: TopicTemplate[] = [
  {
    id: 'lib-topic-1',
    templateId: '',
    name: 'Beetplanung',
    phase: 'Planung',
    startMonth: 1,
    endMonth: 2,
    icon: '📋',
    color: 'bg-blue-400',
    goalDescription: 'Die Schüler:innen planen gemeinsam die Beetaufteilung, lernen Mischkultur-Regeln und berechnen Flächen massstabsgetreu.',
    physicalMaterials: [
      { name: 'Millimeterpapier', quantity: '1 pro Gruppe', source: 'Schulmaterial' },
      { name: 'Farbstifte', quantity: 'Set pro Gruppe', source: 'Schulmaterial' },
    ],
    lp21Refs: ['NMG.2.1', 'MA.2.A'],
    order: 1,
    materialIds: ['mat-4', 'mat-3'],
    isLibrary: true,
    category: 'Gemüse',
    createdBy: 'Plantoria',
  },
  {
    id: 'lib-topic-2',
    templateId: '',
    name: 'Kompostierung',
    phase: 'Pflege',
    startMonth: 3,
    endMonth: 10,
    icon: '♻️',
    color: 'bg-amber-400',
    goalDescription: 'Aufbau und Pflege eines Klassenkomposts. Die Schüler:innen lernen Kreislaufwirtschaft und die Bedeutung von Bodenorganismen.',
    physicalMaterials: [
      { name: 'Kompostbehälter', quantity: '1 Stück', source: 'Baumarkt' },
      { name: 'Grüngut', quantity: 'laufend', source: 'Schulküche / Garten' },
    ],
    lp21Refs: ['NMG.2.6', 'NMG.2.3'],
    order: 1,
    materialIds: ['mat-7'],
    isLibrary: true,
    category: 'Ökologie',
    createdBy: 'Plantoria',
  },
  {
    id: 'lib-topic-3',
    templateId: '',
    name: 'Bodenuntersuchung',
    phase: 'Planung',
    startMonth: 2,
    endMonth: 3,
    icon: '🔬',
    color: 'bg-blue-300',
    goalDescription: 'Experimentelle Untersuchung des Gartenbodens: pH-Wert, Bodenlebewesen, Textur. Die Schüler:innen lernen wissenschaftliches Arbeiten.',
    physicalMaterials: [
      { name: 'pH-Teststreifen', quantity: '1 Set', source: 'Gartencenter' },
      { name: 'Lupen', quantity: '6 Stück', source: 'Schulmaterial' },
      { name: 'Gläser mit Deckel', quantity: '6 Stück', source: 'Schulmaterial' },
    ],
    lp21Refs: ['NMG.2.1', 'NMG.2.3'],
    order: 2,
    materialIds: ['mat-1', 'mat-2', 'mat-5', 'mat-11'],
    isLibrary: true,
    category: 'Ökologie',
    createdBy: 'Plantoria',
  },
  {
    id: 'lib-topic-4',
    templateId: '',
    name: 'Ernte & Dokumentation',
    phase: 'Ernte',
    startMonth: 7,
    endMonth: 10,
    icon: '📊',
    color: 'bg-orange-400',
    goalDescription: 'Systematische Ernte und Dokumentation: Wiegen, Zählen, Protokollieren. Integration von Mathematik und Naturwissenschaften.',
    physicalMaterials: [
      { name: 'Küchenwaage', quantity: '2 Stück', source: 'Schulküche' },
      { name: 'Ernteprotokoll', quantity: '1 pro Gruppe', source: 'Plantoria-Material' },
    ],
    lp21Refs: ['NMG.2.2', 'MA.3.A'],
    order: 1,
    materialIds: [],
    isLibrary: true,
    category: 'Gemüse',
    createdBy: 'Plantoria',
  },
  {
    id: 'lib-topic-5',
    templateId: '',
    name: 'Hochbeet bauen',
    phase: 'Planung',
    startMonth: 2,
    endMonth: 4,
    icon: '🔨',
    color: 'bg-blue-500',
    goalDescription: 'Planung und Bau eines Hochbeets. Die Schüler:innen lernen handwerkliche Grundlagen, Masseinheiten und Teamarbeit.',
    physicalMaterials: [
      { name: 'Holzbretter (Lärche)', quantity: '8 Stück', source: 'Baumarkt' },
      { name: 'Schrauben', quantity: '1 Set', source: 'Baumarkt' },
      { name: 'Teichfolie', quantity: '2 m²', source: 'Baumarkt' },
      { name: 'Akku-Bohrer', quantity: '2 Stück', source: 'Werkzeugschuppen' },
    ],
    lp21Refs: ['TTG.2', 'MA.2.A'],
    order: 3,
    materialIds: ['mat-13'],
    isLibrary: true,
    category: 'Hochbeet',
    createdBy: 'Plantoria',
  },
]

// ============================================================
// Aufgaben-Vorlagen fuer die Bibliotheks-Fachbereiche
// ============================================================

export const fixtureLibraryTaskTemplates: TaskTemplate[] = [
  // -- Beetplanung (lib-topic-1) --
  { id: 'lib-tt-1', templateId: '', topicTemplateId: 'lib-topic-1', title: 'Beetplan massstabsgetreu zeichnen', lp21Refs: ['MA.2.A'], materialIds: ['mat-4'], order: 1 },
  { id: 'lib-tt-2', templateId: '', topicTemplateId: 'lib-topic-1', title: 'Pflanzpartner bestimmen', lp21Refs: ['NMG.2.1'], materialIds: ['mat-3'], order: 2 },

  // -- Kompostierung (lib-topic-2) --
  { id: 'lib-tt-3', templateId: '', topicTemplateId: 'lib-topic-2', title: 'Kompost aufsetzen', lp21Refs: ['NMG.2.6'], materialIds: ['mat-7'], order: 1 },
  { id: 'lib-tt-4', templateId: '', topicTemplateId: 'lib-topic-2', title: 'Kompost umsetzen und beobachten', lp21Refs: ['NMG.2.3'], materialIds: [], order: 2 },

  // -- Bodenuntersuchung (lib-topic-3) --
  { id: 'lib-tt-5', templateId: '', topicTemplateId: 'lib-topic-3', title: 'pH-Wert messen', lp21Refs: ['NMG.2.3'], materialIds: ['mat-2'], order: 1 },
  { id: 'lib-tt-6', templateId: '', topicTemplateId: 'lib-topic-3', title: 'Bodenlebewesen bestimmen', lp21Refs: ['NMG.2.1'], materialIds: ['mat-11'], order: 2 },

  // -- Ernte & Dokumentation (lib-topic-4) --
  { id: 'lib-tt-7', templateId: '', topicTemplateId: 'lib-topic-4', title: 'Erntemengen wiegen und protokollieren', lp21Refs: ['MA.3.A', 'NMG.2.2'], materialIds: [], order: 1 },

  // -- Hochbeet bauen (lib-topic-5) --
  { id: 'lib-tt-8', templateId: '', topicTemplateId: 'lib-topic-5', title: 'Hochbeet nach Anleitung bauen', lp21Refs: ['TTG.2'], materialIds: ['mat-13'], order: 1 },
  { id: 'lib-tt-9', templateId: '', topicTemplateId: 'lib-topic-5', title: 'Hochbeet befüllen (Schichten)', lp21Refs: ['NMG.2.3'], materialIds: [], order: 2 },
]
