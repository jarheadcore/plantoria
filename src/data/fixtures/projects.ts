import type { Project, PreProject } from '@/types'

export const fixtureProjects: Project[] = [
  {
    id: 'proj-1',
    templateId: 'tmpl-1',
    schoolId: 'school-1',
    classId: 'class-1',
    name: 'Gemüsefläche HE24a',
    description:
      'Anlage und Bewirtschaftung einer Gemüsefläche hinter dem Schulhaus. Die Schüler lernen den gesamten Kreislauf vom Säen bis zur Ernte kennen.',
    area: 10,
    status: 'Laufend',
    currentPhase: 'Pflanzung',
    progress: 60,
    location: 'Hinter dem Schulhaus, Südseite',
    startDate: '2026-01-15',
    taskCount: 15,
    tasksDone: 8,
    groupCount: 4,
  },
  {
    id: 'proj-2',
    templateId: 'tmpl-3',
    schoolId: 'school-1',
    classId: 'class-1',
    name: 'Bienenstock HE24a',
    description:
      'Ein Bienenprojekt zur Förderung des Verständnisses für Biodiversität und Bestäubung. Aktuell noch in der Vorprojektphase.',
    status: 'Vorprojekt',
    currentPhase: 'Planung',
    progress: 20,
    location: 'Schulgelände, Nordwestecke',
    startDate: '2026-03-01',
    taskCount: 8,
    tasksDone: 0,
    groupCount: 0,
  },
]

export const fixturePreProjects: PreProject[] = [
  {
    id: 'pp-1',
    projectId: 'proj-1',
    status: 'Abgeschlossen',
    items: [
      { id: 'ppi-1', category: 'Material', label: 'Saatgut (Rübli, Kohl, Kräuter)', completed: true },
      { id: 'ppi-2', category: 'Material', label: 'Erde und Kompost', completed: true },
      { id: 'ppi-3', category: 'Material', label: 'Werkzeug (Schaufeln, Giesskannen)', completed: true },
      { id: 'ppi-4', category: 'Baumaterial', label: 'Holz für Hochbeet', completed: true },
      { id: 'ppi-5', category: 'Baumaterial', label: 'Schrauben und Folie', completed: true },
      { id: 'ppi-6', category: 'Schulung', label: 'Einführungskurs besucht', completed: true },
      { id: 'ppi-7', category: 'Genehmigung', label: 'Schulleitung informiert', completed: true },
      { id: 'ppi-8', category: 'Genehmigung', label: 'Hauswart kontaktiert', completed: true },
      { id: 'ppi-9', category: 'Praxisauftrag', label: 'Standort begutachtet', completed: true },
      { id: 'ppi-10', category: 'Infrastruktur', label: 'Wasseranschluss vorhanden', completed: true },
    ],
  },
  {
    id: 'pp-2',
    projectId: 'proj-2',
    status: 'In Bearbeitung',
    items: [
      { id: 'ppi-11', category: 'Material', label: 'Bienenstock-Bausatz', completed: false, orderUrl: '#' },
      { id: 'ppi-12', category: 'Material', label: 'Schutzausrüstung (Imkeranzüge)', completed: false, orderUrl: '#' },
      { id: 'ppi-13', category: 'Material', label: 'Imkerwerkzeug (Smoker, Stockmeissel)', completed: false, orderUrl: '#' },
      { id: 'ppi-14', category: 'Schulung', label: 'Imkerkurs für Lehrpersonen', completed: true },
      { id: 'ppi-15', category: 'Schulung', label: 'Sicherheitsschulung Bienenstiche', completed: true },
      { id: 'ppi-16', category: 'Genehmigung', label: 'Schulleitung informiert', completed: true },
      { id: 'ppi-17', category: 'Genehmigung', label: 'Veterinäramt Bewilligung', completed: false },
      { id: 'ppi-18', category: 'Praxisauftrag', label: 'Standort begutachtet', completed: true },
      { id: 'ppi-19', category: 'Praxisauftrag', label: 'Flugrouten-Analyse', completed: false },
      { id: 'ppi-20', category: 'Infrastruktur', label: 'Wasserquelle in der Nähe', completed: false },
    ],
  },
]
