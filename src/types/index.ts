// ============================================================
// PLANTORIA – TypeScript Interfaces
// Bereinigt gemaess spec/KONZEPT-DATENSTRUKTUR.md
// ============================================================

// -- Enums / Literal Types --

export type ProjectStatus = 'Vorprojekt' | 'Projektstart' | 'Laufend' | 'Abgeschlossen'

export type ProjectPhase =
  | 'Vorprojekt'
  | 'Planung'
  | 'Pflanzung'
  | 'Pflege'
  | 'Ernte'
  | 'Verarbeitung'
  | 'Vermarktung'

export type TaskStatus = 'Offen' | 'In Bearbeitung' | 'Erledigt'

export type CultureStatus = 'Geplant' | 'Gesät' | 'Wächst' | 'Erntereif' | 'Geerntet'

export type Difficulty = 'Einfach' | 'Mittel' | 'Schwer'

export type FileFormat = 'PDF' | 'DOCX'

export type PreProjectCategory =
  | 'Material'
  | 'Baumaterial'
  | 'Schulung'
  | 'Genehmigung'
  | 'Praxisauftrag'
  | 'Infrastruktur'

export type TemplateCategory =
  | 'Gemüse'
  | 'Ökologie'
  | 'Bienen'
  | 'Hochbeet'
  | 'Garten'
  | 'Sonstiges'

export type MaterialFormat = 'PDF' | 'DOCX' | 'Link' | 'Video' | 'Audio' | 'Datei'

export type NotificationType =
  | 'task_reminder'
  | 'seasonal_hint'
  | 'template_update'
  | 'harvest_market'
  | 'lp21_milestone'
  | 'system'

export type UserRole = 'Admin' | 'Lehrperson' | 'Schüler' | 'Eltern'

export type CalendarEntryType = 'task' | 'seasonal' | 'harvest_market' | 'milestone' | 'holiday'

// -- User / School / Class --

export interface User {
  id: string
  email: string
  role: UserRole
  schoolId: string
  name: string
  avatarUrl?: string
}

export interface School {
  id: string
  name: string
  location: string
  canton: string
  ranking?: number
  totalArea?: number
}

export interface SchoolClass {
  id: string
  schoolId: string
  name: string
  grade: number
  teacherId: string
  studentCount: number
  schoolYear: string
  substituteTeacherId?: string
}

export interface Student {
  id: string
  name: string
  classId: string
  grade: number
  tabletAccess: boolean
}

export interface StudentGroup {
  id: string
  projectId: string
  name: string
  icon?: string
  studentIds: string[]
  tasksCompleted?: number
  tasksTotal?: number
}

// -- Physisches Material (Spaten, Erde, Saatgut) --

export interface TaskMaterial {
  name: string
  quantity: string
  source: string
  cost?: string
}

// -- Projekt-Template mit Fachbereich-Vorlagen --

export interface ProjectTemplate {
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
  topics: TopicTemplate[]
  materials?: TemplateMaterial[]
}

export interface TemplateMaterial {
  id: string
  name: string
  quantity: string
  source: string
  cost: string
}

// -- Fachbereich-Vorlage (im Template oder Bibliothek) --

export interface TopicTemplate {
  id: string
  templateId: string
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
  materialIds: string[]
  isLibrary: boolean
  sourceLibraryId?: string
  category?: TemplateCategory
  createdBy?: string
}

// -- Aufgaben-Vorlage (im Template, gehoert zu TopicTemplate) --

export interface TaskTemplate {
  id: string
  templateId: string
  topicTemplateId: string
  title: string
  description?: string
  steps?: string[]
  difficulty?: Difficulty
  lp21Refs: string[]
  materialIds: string[]
  estimatedEffort?: string
  order: number
}

// -- Projekt --

export interface Project {
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
}

// -- Fachbereich (im Projekt, dupliziert aus Template oder manuell) --

export interface Topic {
  id: string
  projectId: string
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
  fromTemplate: boolean
  templateSourceId?: string
}

// -- Aufgabe (im Projekt, gehoert zu Topic) --

export interface Task {
  id: string
  projectId: string
  topicId: string
  title: string
  description?: string
  steps?: string[]
  status: TaskStatus
  groupId?: string
  groupName?: string
  dueDate?: string
  lp21Refs: string[]
  materialIds: string[]
  fromTemplate: boolean
  templateSourceId?: string
  isHolidayTask?: boolean
  emailReminder?: boolean
}

// -- Vorprojekt --

export interface PreProject {
  id: string
  projectId: string
  status: 'Offen' | 'In Bearbeitung' | 'Abgeschlossen'
  items: PreProjectItem[]
}

export interface PreProjectItem {
  id: string
  category: PreProjectCategory
  label: string
  completed: boolean
  orderUrl?: string
}

// -- Kulturen --

export interface Culture {
  id: string
  projectId: string
  plantName: string
  plantType: 'Gemüse' | 'Kräuter' | 'Beeren'
  status: CultureStatus
  progress: number
  sowingDate?: string
  expectedHarvestDate?: string
  actualHarvestDate?: string
  bedNumber: string
  factsheetId?: string
  vegetableProfileId?: string
}

// -- Gemuese-Steckbriefe --

export interface VegetableProfile {
  id: string
  name: string
  scientificName?: string
  type: 'Gemüse' | 'Kräuter'
  difficulty: Difficulty
  sowingIndoor?: { startMonth: number; endMonth: number }
  sowingOutdoor?: { startMonth: number; endMonth: number }
  harvestPeriod: { startMonth: number; endMonth: number }
  spacing: { inRow: number; betweenRows: number }
  depth: number
  germination: { tempMin: number; tempMax: number; days: number }
  waterNeed: 'Gering' | 'Mittel' | 'Hoch'
  nutrientNeed: 'Schwachzehrer' | 'Mittelzehrer' | 'Starkzehrer'
  companions: string[]
  antagonists: string[]
  specialNotes?: string
  imageUrl?: string
}

// -- Lehrmaterial (globaler Pool, tags statt subjectArea) --

export interface Material {
  id: string
  title: string
  description?: string
  tags: string[]
  gradeRange: string
  phase?: ProjectPhase
  formats: MaterialFormat[]
  difficulty: Difficulty
  lp21Refs: string[]
  lastDownloaded?: string
  fileUrl?: string
  linkUrl?: string
  videoUrl?: string
  audioUrl?: string
}

export interface RecentDownload {
  id: string
  materialTitle: string
  date: string
  format: MaterialFormat
  materialId: string
}

// -- Lehrplan 21 --

export interface Curriculum {
  id: string
  code: string
  subject: string
  shortName: string
  topics: CurriculumTopic[]
}

export interface CurriculumTopic {
  id: string
  curriculumId: string
  code: string
  title: string
  description?: string
  gradeRange: string
  treated: boolean
  treatedDate?: string
  treatedByDownload?: string
  treatedByProject?: string
}

export interface CurriculumProgress {
  id: string
  classId: string
  schoolYear: string
  totalTopics: number
  treatedTopics: number
  coveragePercent: number
  bySubject: SubjectProgress[]
}

export interface SubjectProgress {
  subject: string
  shortName: string
  totalTopics: number
  treatedTopics: number
  coveragePercent: number
}

// -- Kalender --

export interface CalendarEntry {
  id: string
  date: string
  title: string
  type: CalendarEntryType
  projectId?: string
  groupId?: string
  color: string
}

export interface SeasonalTip {
  id: string
  month: number
  text: string
}

// -- Benachrichtigungen --

export interface Notification {
  id: string
  type: NotificationType
  title: string
  description: string
  date: string
  read: boolean
  link?: string
}

export interface NotificationSettings {
  category: string
  label: string
  inApp: boolean
  email: boolean
}

// -- Einstellungen --

export interface GlobalSettings {
  id: string
  holidayTaskAdvanceDays: number
  schoolHolidays: SchoolHoliday[]
}

export interface SchoolHoliday {
  id: string
  name: string
  startDate: string
  endDate: string
  canton: string
  municipality?: string
}

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
  cells: Record<string, Record<string, MatrixCell>>
}

export interface HeatmapCell {
  month: number
  subject: string
  count: number
}

export interface HeatmapData {
  months: number[]
  subjects: string[]
  cells: HeatmapCell[]
  maxCount: number
}

export interface RadarDataPoint {
  subject: string
  shortName: string
  actual: number
  target: number
}

export interface DashboardStats {
  treated: number
  open: number
  planned: number
  gaps: number
  total: number
}

export interface TimelineMonth {
  year: number
  month: number
  label: string
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

// -- Harvest-Markt (wird spaeter in CalendarEntry integriert) --

export interface HarvestMarketProduct {
  id: string
  name: string
  quantity: string
  price: string
  groupName: string
}

export interface HarvestMarketPhase {
  id: string
  name: string
  status: string
  deadline: string
}

export interface HarvestMarket {
  id: string
  name: string
  date: string
  location: string
  participatingSchools: number
  registrationDeadline: string
  status: string
  preparationPhases: HarvestMarketPhase[]
  products: HarvestMarketProduct[]
}
