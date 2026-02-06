import type { SubjectInfo } from '@/types'

export const fixtureSubjects: SubjectInfo[] = [
  { id: 'boden', name: 'Boden', description: 'Bodentypen, Bodenlebewesen, Kompost', lp21Refs: ['NMG.2.1', 'NMG.2.3', 'NMG.2.6'], materialCount: 6 },
  { id: 'fruchtfolge', name: 'Fruchtfolge', description: 'Rotation, Mischkultur, Pflanzpartner', lp21Refs: ['NMG.2.1'], materialCount: 1 },
  { id: 'gemusearten', name: 'Gemüsearten', description: 'Sorten, Anbau, Pflege verschiedener Gemüse', lp21Refs: ['NMG.2.1', 'NMG.2.2'], materialCount: 2 },
  { id: 'gesundheit', name: 'Gesundheit', description: 'Hygiene, Ernährung, Sicherheit im Garten', lp21Refs: ['NMG.2.4'], materialCount: 1 },
  { id: 'flachengestaltung', name: 'Flächengestaltung', description: 'Planung, Vermessung, Ausrichtung des Gartens', lp21Refs: ['MA.2.A', 'TTG.2'], materialCount: 1 },
  { id: 'beetplanung', name: 'Beetplanung', description: 'Layout, Pflanzplan, Reihenabstand', lp21Refs: ['MA.2.A', 'NMG.2.1'], materialCount: 1 },
  { id: 'ernahrung', name: 'Ernährung', description: 'Verarbeitung, Kochen, Nährwerte und Vitamine', lp21Refs: ['WAH.3', 'NMG.2.4'], materialCount: 2 },
  { id: 'okologie', name: 'Ökologie', description: 'Nachhaltigkeit, Biodiversität, Nützlinge', lp21Refs: ['NMG.2.6'], materialCount: 1 },
  { id: 'mathematik', name: 'Mathematik', description: 'Flächenberechnung, Preiskalkulation, Statistik', lp21Refs: ['MA.2.A', 'MA.3.A'], materialCount: 2 },
]
