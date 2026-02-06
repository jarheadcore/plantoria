// ============================================================
// PLANTORIA – TypeScript Interfaces (based on PRD data model)
// ============================================================

// -- Enums --

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

export type SubjectArea =
  | 'Boden'
  | 'Fruchtfolge'
  | 'Gemüsearten'
  | 'Gesundheit'
  | 'Flächengestaltung'
  | 'Beetplanung'
  | 'Ernährung'
  | 'Ökologie'
  | 'Mathematik'

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

// -- Interfaces --

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
  studentIds: string[]
  tasksCompleted?: number
  tasksTotal?: number
}

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
  taskCount: number
  tasksDone: number
  groupCount: number
}

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

export interface Task {
  id: string
  projectId: string
  taskTemplateId?: string
  title: string
  description?: string
  phase: ProjectPhase
  status: TaskStatus
  groupId?: string
  groupName?: string
  dueDate?: string
  season?: string
  lp21Refs: string[]
  worksheetIds?: string[]
  subjectAreaId?: string
  isHolidayTask?: boolean
  holidayAdvanceDays?: number
  emailReminder?: boolean
  classId?: string
}

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
}

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

export interface Material {
  id: string
  title: string
  description?: string
  subjectArea: SubjectArea
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

export interface ProjectTemplate {
  id: string
  name: string
  description: string
  category: TemplateCategory
  lp21Refs: string[]
  difficulty: Difficulty
  gradeRange: string
  estimatedDuration: string
  lp21Coverage: number
  taskCount: number
  taskCountWithLp21: number
  createdBy: string
  shared: boolean
  usedBySchools: number
  version: number
  isOwn: boolean
  isPlatform: boolean
  tasks?: TaskTemplate[]
  materials?: TemplateMaterial[]
}

export interface TaskTemplate {
  id: string
  templateId: string
  title: string
  description?: string
  phase: ProjectPhase
  gradeRange?: string
  difficulty?: Difficulty
  lp21Refs: string[]
  worksheetIds?: string[]
  estimatedEffort?: string
  subjectArea?: SubjectArea
  order: number
}

export interface TemplateMaterial {
  id: string
  name: string
  quantity: string
  source: string
  cost: string
}

export interface CalendarEntry {
  id: string
  date: string
  title: string
  type: CalendarEntryType
  projectId?: string
  color: string
}

export interface SeasonalTip {
  id: string
  month: number
  text: string
}

export interface SubjectAreaTemplate {
  id: string
  name: string
  subjectArea: SubjectArea
  description: string
  learningOrder: SubjectLearningItem[]
  createdBy: string
  shared: boolean
  isPlatform: boolean
}

export interface SubjectLearningItem {
  id: string
  title: string
  description?: string
  order: number
  materialIds: string[]
  lp21Refs: string[]
  difficulty: Difficulty
  gradeRange: string
}

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

export interface Notification {
  id: string
  type: NotificationType
  title: string
  description: string
  date: string
  read: boolean
  link?: string
}

export interface SubjectInfo {
  id: string
  name: SubjectArea
  description: string
  lp21Refs: string[]
  materialCount: number
  icon?: string
}

export interface NotificationSettings {
  category: string
  label: string
  inApp: boolean
  email: boolean
}

export interface RecentDownload {
  id: string
  materialTitle: string
  date: string
  format: MaterialFormat
  materialId: string
}
