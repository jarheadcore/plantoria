<script setup lang="ts">
import { useTeacherStore } from '@/stores/teacher'
import { useStudentsStore } from '@/stores/students'
import { useSettingsStore } from '@/stores/settings'
import { useTemplatesStore } from '@/stores/templates'
import { useMaterialsStore } from '@/stores/materials'
import type { NotificationSettings, ProjectPhase, TopicTemplate, Difficulty, TemplateCategory, Student, SchoolClass } from '@/types'
import { ChevronDown, ChevronRight, Plus, Pencil, Trash2, ArrowLeftRight, Copy, BookOpen, Search } from 'lucide-vue-next'

definePageMeta({ layout: 'teacher' })

const teacherStore = useTeacherStore()
const studentsStore = useStudentsStore()
const settingsStore = useSettingsStore()
const templatesStore = useTemplatesStore()
const materialsStore = useMaterialsStore()

const activeTab = ref('profile')

const profileName = ref(teacherStore.teacher.name)
const profileEmail = ref(teacherStore.teacher.email)

const notificationSettings = ref<NotificationSettings[]>([
  { category: 'task_reminder', label: 'Aufgaben-Erinnerungen', inApp: true, email: false },
  { category: 'seasonal_hint', label: 'Saisonale Hinweise', inApp: true, email: false },
  { category: 'template_update', label: 'Template-Updates', inApp: true, email: false },
  { category: 'lp21_milestone', label: 'LP21-Meilensteine', inApp: true, email: false },
  { category: 'holiday_task', label: 'Ferienaufgaben-Erinnerungen', inApp: true, email: true },
])

const holidayAdvanceDays = ref(settingsStore.globalSettings.holidayTaskAdvanceDays)

function saveHolidaySettings() {
  settingsStore.updateHolidayAdvanceDays(holidayAdvanceDays.value)
}

function switchClass(classId: string) {
  teacherStore.switchClass(classId)
}

// -- Class Tab State --
const expandedClassId = ref<string | null>(null)

function toggleClass(classId: string) {
  expandedClassId.value = expandedClassId.value === classId ? null : classId
}

function getClassStudents(classId: string) {
  return studentsStore.getStudentsByClassId(classId)
}

// Modal: Create Class
const showCreateClassModal = ref(false)
const newClassName = ref('')
const newClassGrade = ref(1)
const newClassSchoolYear = ref('2025/2026')

function openCreateClassModal() {
  newClassName.value = ''
  newClassGrade.value = 1
  newClassSchoolYear.value = '2025/2026'
  showCreateClassModal.value = true
}

function saveNewClass() {
  if (!newClassName.value.trim()) return
  teacherStore.addClass({
    name: newClassName.value.trim(),
    grade: newClassGrade.value,
    schoolYear: newClassSchoolYear.value,
  })
  showCreateClassModal.value = false
}

// Modal: Add Student
const showAddStudentModal = ref(false)
const addStudentClassId = ref('')
const newStudentName = ref('')
const newStudentTablet = ref(true)

function openAddStudentModal(classId: string, grade: number) {
  addStudentClassId.value = classId
  newStudentName.value = ''
  newStudentTablet.value = grade >= 3
  showAddStudentModal.value = true
}

function saveNewStudent() {
  if (!newStudentName.value.trim()) return
  const cls = teacherStore.availableClasses.find((c) => c.id === addStudentClassId.value)
  if (!cls) return
  studentsStore.addStudent({
    name: newStudentName.value.trim(),
    classId: addStudentClassId.value,
    grade: cls.grade,
    tabletAccess: newStudentTablet.value,
  })
  teacherStore.updateStudentCount(addStudentClassId.value, 1)
  showAddStudentModal.value = false
}

// Modal: Move Student
const showMoveStudentModal = ref(false)
const moveStudentRef = ref<Student | null>(null)
const moveTargetClassId = ref('')

function openMoveStudentModal(student: Student) {
  moveStudentRef.value = student
  const otherClasses = teacherStore.availableClasses.filter((c) => c.id !== student.classId)
  const first = otherClasses[0]
  moveTargetClassId.value = first ? first.id : ''
  showMoveStudentModal.value = true
}

const moveTargetOptions = computed(() => {
  if (!moveStudentRef.value) return []
  return teacherStore.availableClasses
    .filter((c) => c.id !== moveStudentRef.value!.classId)
    .map((c) => ({ label: `${c.name} (Stufe ${c.grade})`, value: c.id }))
})

function confirmMoveStudent() {
  if (!moveStudentRef.value || !moveTargetClassId.value) return
  const targetClass = teacherStore.availableClasses.find((c) => c.id === moveTargetClassId.value)
  if (!targetClass) return
  const result = studentsStore.moveStudent(moveStudentRef.value.id, moveTargetClassId.value, targetClass.grade)
  if (result) {
    teacherStore.updateStudentCount(result.sourceClassId, -1)
    teacherStore.updateStudentCount(result.targetClassId, 1)
  }
  showMoveStudentModal.value = false
}

// Modal: Delete Confirmation
const showDeleteModal = ref(false)
const deleteType = ref<'class' | 'student'>('student')
const deleteTargetId = ref('')
const deleteTargetName = ref('')

function openDeleteStudentModal(student: Student) {
  deleteType.value = 'student'
  deleteTargetId.value = student.id
  deleteTargetName.value = student.name
  showDeleteModal.value = true
}

function openDeleteClassModal(cls: SchoolClass) {
  deleteType.value = 'class'
  deleteTargetId.value = cls.id
  deleteTargetName.value = cls.name
  showDeleteModal.value = true
}

function confirmDelete() {
  if (deleteType.value === 'student') {
    const removed = studentsStore.deleteStudent(deleteTargetId.value)
    if (removed) {
      teacherStore.updateStudentCount(removed.classId, -1)
    }
  } else {
    teacherStore.deleteClass(deleteTargetId.value)
  }
  showDeleteModal.value = false
}

// ============================================================
// TEMPLATES TAB
// ============================================================

// -- Sub-Tabs --
const vorlagenSubTab = ref<'projects' | 'topics'>('projects')

// -- Project Templates --
const expandedTemplateId = ref<string | null>(null)
const expandedTopicIds = ref(new Set<string>())

const editName = ref('')
const editDescription = ref('')
const editCategory = ref<TemplateCategory>('Gemüse')
const editDifficulty = ref<Difficulty>('Mittel')
const editGradeRange = ref('')
const editDuration = ref('')

const categoryOptions = [
  { label: 'Gemüse', value: 'Gemüse' },
  { label: 'Hochbeet', value: 'Hochbeet' },
  { label: 'Bienen', value: 'Bienen' },
  { label: 'Ökologie', value: 'Ökologie' },
  { label: 'Garten', value: 'Garten' },
  { label: 'Sonstiges', value: 'Sonstiges' },
]

const difficultyOptions = [
  { label: 'Einfach', value: 'Einfach' },
  { label: 'Mittel', value: 'Mittel' },
  { label: 'Schwer', value: 'Schwer' },
]

const phases: { key: ProjectPhase; label: string; color: string }[] = [
  { key: 'Planung', label: 'Planung', color: 'bg-blue-400' },
  { key: 'Pflanzung', label: 'Pflanzung', color: 'bg-green-400' },
  { key: 'Pflege', label: 'Pflege', color: 'bg-amber-400' },
  { key: 'Ernte', label: 'Ernte', color: 'bg-orange-400' },
  { key: 'Verarbeitung', label: 'Verarbeitung', color: 'bg-red-300' },
  { key: 'Vermarktung', label: 'Vermarktung', color: 'bg-purple-400' },
]

const phaseOptions = phases.map((p) => ({ label: p.label, value: p.key }))

function getPhaseColor(phaseKey: string) {
  const phase = phases.find((p) => p.key === phaseKey)
  return phase?.color ?? 'bg-gray-400'
}

function getTopicsByPhase(topics: TopicTemplate[]) {
  const result: Record<string, TopicTemplate[]> = {}
  for (const phase of phases) {
    const phaseTopics = topics.filter((t) => t.phase === phase.key)
    if (phaseTopics.length > 0) {
      result[phase.key] = phaseTopics.sort((a, b) => a.order - b.order)
    }
  }
  return result
}

function toggleTemplate(templateId: string) {
  if (expandedTemplateId.value === templateId) {
    expandedTemplateId.value = null
    return
  }
  expandedTemplateId.value = templateId
  expandedTopicIds.value.clear()
  const tpl = templatesStore.getTemplateById(templateId)
  if (tpl) {
    editName.value = tpl.name
    editDescription.value = tpl.description
    editCategory.value = tpl.category
    editDifficulty.value = tpl.difficulty
    editGradeRange.value = tpl.gradeRange
    editDuration.value = tpl.estimatedDuration
  }
}

function toggleTopic(topicId: string) {
  if (expandedTopicIds.value.has(topicId)) {
    expandedTopicIds.value.delete(topicId)
  } else {
    expandedTopicIds.value.add(topicId)
  }
}

function saveTemplate(templateId: string) {
  templatesStore.updateTemplate(templateId, {
    name: editName.value,
    description: editDescription.value,
    category: editCategory.value,
    difficulty: editDifficulty.value,
    gradeRange: editGradeRange.value,
    estimatedDuration: editDuration.value,
  })
}

function confirmDeleteTemplate(templateId: string) {
  templatesStore.deleteTemplate(templateId)
  expandedTemplateId.value = null
}

function handleDuplicateTemplate(templateId: string) {
  const dupe = templatesStore.duplicateTemplate(templateId)
  if (dupe) {
    expandedTemplateId.value = null
  }
}

// -- Task inline editing --
const editingTaskId = ref<string | null>(null)
const editTaskTitle = ref('')
const editTaskLp21 = ref('')

function startEditTask(taskId: string, title: string, lp21Refs: string[]) {
  editingTaskId.value = taskId
  editTaskTitle.value = title
  editTaskLp21.value = lp21Refs.join(', ')
}

function saveEditTask() {
  if (!editingTaskId.value) return
  templatesStore.updateTaskTemplate(editingTaskId.value, {
    title: editTaskTitle.value,
    lp21Refs: editTaskLp21.value.split(',').map((s) => s.trim()).filter(Boolean),
  })
  editingTaskId.value = null
}

function cancelEditTask() {
  editingTaskId.value = null
}

function deleteTask(taskId: string) {
  templatesStore.deleteTaskTemplate(taskId)
  if (editingTaskId.value === taskId) {
    editingTaskId.value = null
  }
}

// -- New Project Template Modal --
const showNewTemplateModal = ref(false)
const newTplName = ref('')
const newTplDescription = ref('')
const newTplCategory = ref<TemplateCategory>('Gemüse')
const newTplDifficulty = ref<Difficulty>('Mittel')
const newTplGradeRange = ref('3-6')
const newTplDuration = ref('1 Schuljahr')

function openNewTemplateModal() {
  newTplName.value = ''
  newTplDescription.value = ''
  newTplCategory.value = 'Gemüse'
  newTplDifficulty.value = 'Mittel'
  newTplGradeRange.value = '3-6'
  newTplDuration.value = '1 Schuljahr'
  showNewTemplateModal.value = true
}

function saveNewTemplate() {
  templatesStore.createEmptyTemplate({
    name: newTplName.value,
    description: newTplDescription.value,
    category: newTplCategory.value,
    difficulty: newTplDifficulty.value,
    gradeRange: newTplGradeRange.value,
    estimatedDuration: newTplDuration.value,
  })
  showNewTemplateModal.value = false
}

// -- Add Topic Modal --
const showAddTopicModal = ref(false)
const addTopicTemplateId = ref('')
const newTopicName = ref('')
const newTopicPhase = ref<ProjectPhase>('Planung')
const newTopicStartMonth = ref(1)
const newTopicEndMonth = ref(3)
const newTopicIcon = ref('🌱')
const newTopicGoal = ref('')

function openAddTopicModal(templateId: string) {
  addTopicTemplateId.value = templateId
  newTopicName.value = ''
  newTopicPhase.value = 'Planung'
  newTopicStartMonth.value = 1
  newTopicEndMonth.value = 3
  newTopicIcon.value = '🌱'
  newTopicGoal.value = ''
  showAddTopicModal.value = true
}

function saveNewTopic() {
  templatesStore.addTopicToTemplate(addTopicTemplateId.value, {
    name: newTopicName.value,
    phase: newTopicPhase.value,
    startMonth: newTopicStartMonth.value,
    endMonth: newTopicEndMonth.value,
    icon: newTopicIcon.value,
    color: getPhaseColor(newTopicPhase.value),
    goalDescription: newTopicGoal.value,
    physicalMaterials: [],
    lp21Refs: [],
    materialIds: [],
    isLibrary: false,
  })
  showAddTopicModal.value = false
}

// -- Import from Library Modal --
const showImportModal = ref(false)
const importTargetTemplateId = ref('')

const libraryByPhase = computed(() => {
  const result: Record<string, TopicTemplate[]> = {}
  for (const phase of phases) {
    const phaseTopics = templatesStore.libraryTopics.filter((t) => t.phase === phase.key)
    if (phaseTopics.length > 0) {
      result[phase.key] = phaseTopics
    }
  }
  return result
})

function openImportModal(templateId: string) {
  importTargetTemplateId.value = templateId
  showImportModal.value = true
}

function importFromLibrary(libraryTopicId: string) {
  templatesStore.importLibraryTopicToTemplate(libraryTopicId, importTargetTemplateId.value)
  showImportModal.value = false
}

// -- Add Task Modal --
const showAddTaskModal = ref(false)
const addTaskTemplateId = ref('')
const addTaskTopicId = ref('')
const newTaskTitle = ref('')
const newTaskLp21 = ref('')

function openAddTaskModal(templateId: string, topicId: string) {
  addTaskTemplateId.value = templateId
  addTaskTopicId.value = topicId
  newTaskTitle.value = ''
  newTaskLp21.value = ''
  showAddTaskModal.value = true
}

function saveNewTask() {
  templatesStore.addTaskTemplate({
    templateId: addTaskTemplateId.value,
    topicTemplateId: addTaskTopicId.value,
    title: newTaskTitle.value,
    lp21Refs: newTaskLp21.value.split(',').map((s) => s.trim()).filter(Boolean),
    materialIds: [],
  })
  showAddTaskModal.value = false
}

// ============================================================
// LIBRARY TOPICS TAB
// ============================================================

const expandedLibTopicId = ref<string | null>(null)

const libEditName = ref('')
const libEditPhase = ref<ProjectPhase>('Planung')
const libEditStartMonth = ref(1)
const libEditEndMonth = ref(3)
const libEditIcon = ref('🌱')
const libEditGoal = ref('')
const libEditCategory = ref<TemplateCategory>('Gemüse')

function toggleLibTopic(topicId: string) {
  if (expandedLibTopicId.value === topicId) {
    expandedLibTopicId.value = null
    return
  }
  expandedLibTopicId.value = topicId
  const topic = templatesStore.libraryTopics.find((t) => t.id === topicId)
  if (topic) {
    libEditName.value = topic.name
    libEditPhase.value = topic.phase
    libEditStartMonth.value = topic.startMonth
    libEditEndMonth.value = topic.endMonth
    libEditIcon.value = topic.icon
    libEditGoal.value = topic.goalDescription
    libEditCategory.value = topic.category ?? 'Sonstiges'
  }
}

function saveLibTopic(topicId: string) {
  templatesStore.updateLibraryTopic(topicId, {
    name: libEditName.value,
    phase: libEditPhase.value,
    startMonth: libEditStartMonth.value,
    endMonth: libEditEndMonth.value,
    icon: libEditIcon.value,
    goalDescription: libEditGoal.value,
    color: getPhaseColor(libEditPhase.value),
    category: libEditCategory.value,
  })
}

function deleteLibTopic(topicId: string) {
  templatesStore.deleteLibraryTopic(topicId)
  expandedLibTopicId.value = null
}

function duplicateLibTopic(topicId: string) {
  templatesStore.duplicateLibraryTopic(topicId)
}

// Library task inline editing
const editingLibTaskId = ref<string | null>(null)
const editLibTaskTitle = ref('')
const editLibTaskLp21 = ref('')

function startEditLibTask(taskId: string, title: string, lp21Refs: string[]) {
  editingLibTaskId.value = taskId
  editLibTaskTitle.value = title
  editLibTaskLp21.value = lp21Refs.join(', ')
}

function saveEditLibTask() {
  if (!editingLibTaskId.value) return
  templatesStore.updateTaskTemplate(editingLibTaskId.value, {
    title: editLibTaskTitle.value,
    lp21Refs: editLibTaskLp21.value.split(',').map((s) => s.trim()).filter(Boolean),
  })
  editingLibTaskId.value = null
}

function cancelEditLibTask() {
  editingLibTaskId.value = null
}

function deleteLibTask(taskId: string) {
  templatesStore.deleteTaskTemplate(taskId)
  if (editingLibTaskId.value === taskId) {
    editingLibTaskId.value = null
  }
}

// Add task to library topic
const showAddLibTaskModal = ref(false)
const addLibTaskTopicId = ref('')
const newLibTaskTitle = ref('')
const newLibTaskLp21 = ref('')

function openAddLibTaskModal(topicId: string) {
  addLibTaskTopicId.value = topicId
  newLibTaskTitle.value = ''
  newLibTaskLp21.value = ''
  showAddLibTaskModal.value = true
}

function saveNewLibTask() {
  templatesStore.addTaskTemplate({
    templateId: '',
    topicTemplateId: addLibTaskTopicId.value,
    title: newLibTaskTitle.value,
    lp21Refs: newLibTaskLp21.value.split(',').map((s) => s.trim()).filter(Boolean),
    materialIds: [],
  })
  showAddLibTaskModal.value = false
}

// -- New Library Topic Modal --
const showNewLibTopicModal = ref(false)
const newLibName = ref('')
const newLibPhase = ref<ProjectPhase>('Planung')
const newLibStartMonth = ref(1)
const newLibEndMonth = ref(3)
const newLibIcon = ref('🌱')
const newLibGoal = ref('')
const newLibCategory = ref<TemplateCategory>('Gemüse')

function openNewLibTopicModal() {
  newLibName.value = ''
  newLibPhase.value = 'Planung'
  newLibStartMonth.value = 1
  newLibEndMonth.value = 3
  newLibIcon.value = '🌱'
  newLibGoal.value = ''
  newLibCategory.value = 'Gemüse'
  showNewLibTopicModal.value = true
}

function saveNewLibTopic() {
  templatesStore.addLibraryTopic({
    name: newLibName.value,
    phase: newLibPhase.value,
    startMonth: newLibStartMonth.value,
    endMonth: newLibEndMonth.value,
    icon: newLibIcon.value,
    color: getPhaseColor(newLibPhase.value),
    goalDescription: newLibGoal.value,
    physicalMaterials: [],
    lp21Refs: [],
    materialIds: [],
    category: newLibCategory.value,
    createdBy: 'Eigene',
  })
  showNewLibTopicModal.value = false
}

// -- Material Picker Modal --
const showMaterialPicker = ref(false)
const materialPickerTopicId = ref('')
const materialPickerIsLibrary = ref(false)
const materialPickerSearch = ref('')
const materialPickerTag = ref('all')
const materialPickerFormat = ref('all')

const materialPickerTagOptions = computed(() => [
  { label: 'Alle Tags', value: 'all' },
  ...materialsStore.allTags.map((t) => ({ label: t, value: t })),
])

const materialPickerFormatOptions = [
  { label: 'Alle Formate', value: 'all' },
  { label: 'PDF', value: 'PDF' },
  { label: 'DOCX', value: 'DOCX' },
  { label: 'Link', value: 'Link' },
  { label: 'Video', value: 'Video' },
]

const filteredPickerMaterials = computed(() => {
  return materialsStore.materials.filter((m) => {
    if (materialPickerTag.value !== 'all' && !m.tags.includes(materialPickerTag.value)) return false
    if (materialPickerFormat.value !== 'all' && !m.formats.includes(materialPickerFormat.value as 'PDF' | 'DOCX' | 'Link' | 'Video')) return false
    if (materialPickerSearch.value) {
      const q = materialPickerSearch.value.toLowerCase()
      return m.title.toLowerCase().includes(q) || m.description?.toLowerCase().includes(q)
    }
    return true
  })
})

function currentTopicMaterialIds(): string[] {
  if (materialPickerIsLibrary.value) {
    const topic = templatesStore.libraryTopics.find((t) => t.id === materialPickerTopicId.value)
    return topic?.materialIds ?? []
  }
  const topic = templatesStore.templates.flatMap((t) => t.topics).find((t) => t.id === materialPickerTopicId.value)
  return topic?.materialIds ?? []
}

function isMaterialAssigned(materialId: string): boolean {
  return currentTopicMaterialIds().includes(materialId)
}

function toggleMaterial(materialId: string) {
  if (isMaterialAssigned(materialId)) {
    templatesStore.removeMaterialFromTopic(materialPickerTopicId.value, materialId, materialPickerIsLibrary.value)
  } else {
    templatesStore.addMaterialToTopic(materialPickerTopicId.value, materialId, materialPickerIsLibrary.value)
  }
}

function openMaterialPicker(topicId: string, isLibrary: boolean) {
  materialPickerTopicId.value = topicId
  materialPickerIsLibrary.value = isLibrary
  materialPickerSearch.value = ''
  materialPickerTag.value = 'all'
  materialPickerFormat.value = 'all'
  showMaterialPicker.value = true
}

function getMaterialTitle(id: string): string {
  const mat = materialsStore.getMaterialById(id)
  return mat?.title ?? id
}

function getMaterialFormats(id: string): string[] {
  const mat = materialsStore.getMaterialById(id)
  return mat?.formats ?? []
}

function getMaterialLp21(id: string): string[] {
  const mat = materialsStore.getMaterialById(id)
  return mat?.lp21Refs ?? []
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Einstellungen</h1>
    </div>

    <!-- Tabs -->
    <div class="mb-6 flex gap-1 border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
      <button
        v-for="tab in [
          { key: 'profile', label: 'Profil' },
          { key: 'class', label: 'Klasse' },
          { key: 'holidays', label: 'Ferien & Aufgaben' },
          { key: 'notifications', label: 'Benachrichtigungen' },
          { key: 'templates', label: 'Vorlagen' },
        ]"
        :key="tab.key"
        :class="[
          'px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap',
          activeTab === tab.key
            ? 'border-green-600 text-green-700 dark:text-green-400'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
        ]"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Profile -->
    <div v-if="activeTab === 'profile'">
      <UCard class="max-w-lg">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Name</label>
            <UInput v-model="profileName" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">E-Mail</label>
            <UInput v-model="profileEmail" type="email" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Schule</label>
            <UInput :model-value="teacherStore.school.name" disabled />
            <p class="text-xs text-gray-400 mt-1">Nicht editierbar</p>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Rolle</label>
            <UInput model-value="Lehrperson" disabled />
            <p class="text-xs text-gray-400 mt-1">Nicht editierbar</p>
          </div>
        </div>
        <div class="mt-6 flex gap-3">
          <UButton variant="soft" disabled>Passwort ändern</UButton>
          <UButton color="primary">Speichern</UButton>
        </div>
      </UCard>
    </div>

    <!-- Class -->
    <div v-if="activeTab === 'class'">
      <div class="max-w-2xl">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold">Aktive Klasse</h3>
          <UButton size="sm" color="primary" @click="openCreateClassModal">
            <Plus class="h-4 w-4 mr-1" />
            Neue Klasse
          </UButton>
        </div>

        <UCard class="mb-6">
          <button
            class="w-full text-left flex items-center gap-3"
            @click="toggleClass(teacherStore.activeClass.id)"
          >
            <component :is="expandedClassId === teacherStore.activeClass.id ? ChevronDown : ChevronRight" class="h-5 w-5 text-gray-400 shrink-0" />
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-semibold text-lg text-gray-900 dark:text-white">{{ teacherStore.activeClass.name }}</span>
                <UBadge color="green" variant="subtle" size="sm">Aktiv</UBadge>
              </div>
              <div class="text-sm text-gray-500 mt-0.5">
                Stufe {{ teacherStore.activeClass.grade }} | {{ teacherStore.activeClass.studentCount }} Schüler | {{ teacherStore.activeClass.schoolYear }}
              </div>
            </div>
          </button>

          <div v-if="expandedClassId === teacherStore.activeClass.id" class="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            <div v-if="getClassStudents(teacherStore.activeClass.id).length === 0" class="text-sm text-gray-400 py-2">
              Keine Schüler in dieser Klasse.
            </div>
            <div class="space-y-1.5">
              <div
                v-for="student in getClassStudents(teacherStore.activeClass.id)"
                :key="student.id"
                class="flex items-center justify-between rounded-lg border border-gray-100 dark:border-gray-800 px-3 py-2"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ student.name }}</span>
                  <span class="text-xs text-gray-500">Stufe {{ student.grade }}</span>
                  <UBadge :color="student.tabletAccess ? 'green' : 'neutral'" variant="subtle" size="sm">
                    Tablet: {{ student.tabletAccess ? 'Ja' : 'Nein' }}
                  </UBadge>
                </div>
                <div class="flex gap-1 shrink-0">
                  <UButton size="xs" variant="ghost" @click="openMoveStudentModal(student)">
                    <ArrowLeftRight class="h-3.5 w-3.5" />
                  </UButton>
                  <UButton size="xs" variant="ghost" @click="openDeleteStudentModal(student)">
                    <Trash2 class="h-3.5 w-3.5" />
                  </UButton>
                </div>
              </div>
            </div>
            <button
              class="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 mt-3"
              @click="openAddStudentModal(teacherStore.activeClass.id, teacherStore.activeClass.grade)"
            >
              <Plus class="h-4 w-4" />
              Schüler hinzufügen
            </button>
          </div>
        </UCard>

        <h4 class="text-sm font-medium text-gray-500 mb-2">Weitere Klassen</h4>
        <div class="space-y-3">
          <UCard
            v-for="cls in teacherStore.availableClasses.filter(c => c.id !== teacherStore.activeClass.id)"
            :key="cls.id"
          >
            <button
              class="w-full text-left flex items-center gap-3"
              @click="toggleClass(cls.id)"
            >
              <component :is="expandedClassId === cls.id ? ChevronDown : ChevronRight" class="h-5 w-5 text-gray-400 shrink-0" />
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="font-semibold text-gray-900 dark:text-white">{{ cls.name }}</span>
                  <UBadge v-if="cls.substituteTeacherId" color="neutral" variant="subtle" size="sm">Stellvertretung</UBadge>
                </div>
                <div class="text-sm text-gray-500 mt-0.5">
                  Stufe {{ cls.grade }} | {{ cls.studentCount }} Schüler | {{ cls.schoolYear }}
                </div>
              </div>
              <div class="flex gap-2 shrink-0" @click.stop>
                <UButton size="sm" variant="soft" color="primary" @click="switchClass(cls.id)">
                  Wechseln
                </UButton>
                <UButton
                  size="sm"
                  variant="soft"
                  color="neutral"
                  :disabled="cls.studentCount > 0"
                  @click="openDeleteClassModal(cls)"
                >
                  <Trash2 class="h-4 w-4" />
                </UButton>
              </div>
            </button>

            <div v-if="expandedClassId === cls.id" class="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
              <div v-if="getClassStudents(cls.id).length === 0" class="text-sm text-gray-400 py-2">
                Keine Schüler in dieser Klasse.
              </div>
              <div class="space-y-1.5">
                <div
                  v-for="student in getClassStudents(cls.id)"
                  :key="student.id"
                  class="flex items-center justify-between rounded-lg border border-gray-100 dark:border-gray-800 px-3 py-2"
                >
                  <div class="flex items-center gap-3 min-w-0">
                    <span class="text-sm font-medium text-gray-900 dark:text-white">{{ student.name }}</span>
                    <span class="text-xs text-gray-500">Stufe {{ student.grade }}</span>
                    <UBadge :color="student.tabletAccess ? 'green' : 'neutral'" variant="subtle" size="sm">
                      Tablet: {{ student.tabletAccess ? 'Ja' : 'Nein' }}
                    </UBadge>
                  </div>
                  <div class="flex gap-1 shrink-0">
                    <UButton size="xs" variant="ghost" @click="openMoveStudentModal(student)">
                      <ArrowLeftRight class="h-3.5 w-3.5" />
                    </UButton>
                    <UButton size="xs" variant="ghost" @click="openDeleteStudentModal(student)">
                      <Trash2 class="h-3.5 w-3.5" />
                    </UButton>
                  </div>
                </div>
              </div>
              <button
                class="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 mt-3"
                @click="openAddStudentModal(cls.id, cls.grade)"
              >
                <Plus class="h-4 w-4" />
                Schüler hinzufügen
              </button>
            </div>
          </UCard>
        </div>
      </div>

      <!-- Class Modals -->
      <UModal v-model:open="showCreateClassModal">
        <template #content>
          <div class="p-6">
            <h3 class="text-lg font-semibold mb-4">Neue Klasse erstellen</h3>
            <div class="space-y-3">
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">Name</label>
                <UInput v-model="newClassName" size="sm" placeholder="z.B. HE26a" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">Stufe</label>
                <UInput v-model.number="newClassGrade" type="number" min="1" max="9" size="sm" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">Schuljahr</label>
                <UInput v-model="newClassSchoolYear" size="sm" placeholder="2025/2026" />
              </div>
            </div>
            <div class="mt-4 flex gap-2 justify-end">
              <UButton variant="ghost" size="sm" @click="showCreateClassModal = false">Abbrechen</UButton>
              <UButton color="primary" size="sm" :disabled="!newClassName.trim()" @click="saveNewClass">Erstellen</UButton>
            </div>
          </div>
        </template>
      </UModal>

      <UModal v-model:open="showAddStudentModal">
        <template #content>
          <div class="p-6">
            <h3 class="text-lg font-semibold mb-4">Schüler hinzufügen</h3>
            <div class="space-y-3">
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">Name</label>
                <UInput v-model="newStudentName" size="sm" placeholder="Vor- und Nachname" />
              </div>
              <div class="flex items-center gap-2">
                <input v-model="newStudentTablet" type="checkbox" class="h-4 w-4 rounded text-green-600" />
                <label class="text-sm">Tablet-Zugang</label>
              </div>
            </div>
            <div class="mt-4 flex gap-2 justify-end">
              <UButton variant="ghost" size="sm" @click="showAddStudentModal = false">Abbrechen</UButton>
              <UButton color="primary" size="sm" :disabled="!newStudentName.trim()" @click="saveNewStudent">Hinzufügen</UButton>
            </div>
          </div>
        </template>
      </UModal>

      <UModal v-model:open="showMoveStudentModal">
        <template #content>
          <div class="p-6">
            <h3 class="text-lg font-semibold mb-4">Schüler verschieben</h3>
            <div class="space-y-3">
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">Schüler</label>
                <UInput :model-value="moveStudentRef?.name ?? ''" disabled size="sm" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">Zielklasse</label>
                <USelect v-model="moveTargetClassId" :items="moveTargetOptions" size="sm" />
              </div>
              <p class="text-xs text-gray-400">Stufe und Tablet-Zugang werden automatisch angepasst.</p>
            </div>
            <div class="mt-4 flex gap-2 justify-end">
              <UButton variant="ghost" size="sm" @click="showMoveStudentModal = false">Abbrechen</UButton>
              <UButton color="primary" size="sm" :disabled="!moveTargetClassId" @click="confirmMoveStudent">Verschieben</UButton>
            </div>
          </div>
        </template>
      </UModal>

      <UModal v-model:open="showDeleteModal">
        <template #content>
          <div class="p-6">
            <h3 class="text-lg font-semibold mb-4">{{ deleteType === 'class' ? 'Klasse' : 'Schüler' }} löschen</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              {{ deleteType === 'class' ? 'Klasse' : 'Schüler' }} <strong>{{ deleteTargetName }}</strong> wirklich löschen?
            </p>
            <div class="mt-4 flex gap-2 justify-end">
              <UButton variant="ghost" size="sm" @click="showDeleteModal = false">Abbrechen</UButton>
              <UButton color="primary" size="sm" @click="confirmDelete">Löschen</UButton>
            </div>
          </div>
        </template>
      </UModal>
    </div>

    <!-- Holidays & Tasks -->
    <div v-if="activeTab === 'holidays'">
      <UCard class="max-w-lg mb-6">
        <h3 class="font-semibold mb-3">Ferienaufgaben-Einstellungen</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Tage im Voraus anzeigen</label>
            <div class="flex items-center gap-3">
              <UInput v-model.number="holidayAdvanceDays" type="number" min="1" max="30" class="w-24" />
              <span class="text-sm text-gray-500">Tage</span>
            </div>
            <p class="text-xs text-gray-400 mt-1">Ferienaufgaben werden den Schülern so viele Tage vor den Ferien angezeigt.</p>
          </div>
          <UButton color="primary" @click="saveHolidaySettings">Speichern</UButton>
        </div>
      </UCard>

      <UCard class="max-w-lg">
        <h3 class="font-semibold mb-3">Schulferien (Kanton {{ teacherStore.school.canton }})</h3>
        <div class="space-y-2">
          <div
            v-for="holiday in settingsStore.globalSettings.schoolHolidays"
            :key="holiday.id"
            class="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-800"
          >
            <div>
              <span class="text-sm font-medium">{{ holiday.name }}</span>
              <p class="text-xs text-gray-500">
                {{ new Date(holiday.startDate).toLocaleDateString('de-CH') }} –
                {{ new Date(holiday.endDate).toLocaleDateString('de-CH') }}
              </p>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Notifications -->
    <div v-if="activeTab === 'notifications'">
      <UCard class="max-w-lg">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr>
                <th class="pb-3 text-left text-sm font-semibold">Kategorie</th>
                <th class="pb-3 text-center text-sm font-semibold w-24">In-App</th>
                <th class="pb-3 text-center text-sm font-semibold w-24">E-Mail</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr v-for="setting in notificationSettings" :key="setting.category">
                <td class="py-3 text-sm">{{ setting.label }}</td>
                <td class="py-3 text-center">
                  <input v-model="setting.inApp" type="checkbox" class="h-4 w-4 rounded text-green-600" />
                </td>
                <td class="py-3 text-center">
                  <input v-model="setting.email" type="checkbox" class="h-4 w-4 rounded text-green-600" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-4">
          <UButton color="primary">Speichern</UButton>
        </div>
      </UCard>
    </div>

    <!-- ============================================================ -->
    <!-- Templates / Vorlagen                                         -->
    <!-- ============================================================ -->
    <div v-if="activeTab === 'templates'">
      <div class="max-w-3xl">
        <!-- Sub-Tab Navigation -->
        <div class="mb-4 flex gap-1 border-b border-gray-200 dark:border-gray-800">
          <button
            :class="[
              'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
              vorlagenSubTab === 'projects'
                ? 'border-green-600 text-green-700 dark:text-green-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
            @click="vorlagenSubTab = 'projects'"
          >
            Projekt-Vorlagen
          </button>
          <button
            :class="[
              'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
              vorlagenSubTab === 'topics'
                ? 'border-green-600 text-green-700 dark:text-green-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
            @click="vorlagenSubTab = 'topics'"
          >
            Fachbereich-Vorlagen
          </button>
        </div>

        <!-- ========================================== -->
        <!-- SUB-TAB: Projekt-Vorlagen                  -->
        <!-- ========================================== -->
        <div v-if="vorlagenSubTab === 'projects'">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold">
              Projekt-Vorlagen
              <span class="text-sm font-normal text-gray-400 ml-1">({{ templatesStore.ownTemplates.length }})</span>
            </h2>
            <UButton size="sm" color="primary" @click="openNewTemplateModal">
              <Plus class="h-4 w-4 mr-1" />
              Neue Vorlage
            </UButton>
          </div>

          <div v-if="templatesStore.ownTemplates.length === 0" class="text-center py-12 text-gray-400">
            Keine eigenen Vorlagen vorhanden.
          </div>

          <div class="space-y-3">
            <div v-for="tpl in templatesStore.ownTemplates" :key="tpl.id">
              <UCard>
                <button class="w-full text-left flex items-center gap-3" @click="toggleTemplate(tpl.id)">
                  <component :is="expandedTemplateId === tpl.id ? ChevronDown : ChevronRight" class="h-5 w-5 text-gray-400 shrink-0" />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="font-semibold text-gray-900 dark:text-white">{{ tpl.name }}</span>
                      <UBadge color="primary" variant="subtle" size="sm">{{ tpl.category }}</UBadge>
                      <UBadge color="neutral" variant="subtle" size="sm">{{ tpl.difficulty }}</UBadge>
                    </div>
                    <div class="text-xs text-gray-500 mt-1">
                      Stufe {{ tpl.gradeRange }} · {{ tpl.topics.length }} Fachbereiche · {{ tpl.estimatedDuration }}
                    </div>
                  </div>
                </button>

                <!-- Expanded template editing -->
                <div v-if="expandedTemplateId === tpl.id" class="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label class="block text-xs font-medium text-gray-500 mb-1">Name</label>
                      <UInput v-model="editName" size="sm" />
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-gray-500 mb-1">Kategorie</label>
                      <USelect v-model="editCategory" :items="categoryOptions" size="sm" />
                    </div>
                    <div class="sm:col-span-2">
                      <label class="block text-xs font-medium text-gray-500 mb-1">Beschreibung</label>
                      <UTextarea v-model="editDescription" :rows="2" size="sm" />
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-gray-500 mb-1">Schwierigkeit</label>
                      <USelect v-model="editDifficulty" :items="difficultyOptions" size="sm" />
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-gray-500 mb-1">Stufe</label>
                      <UInput v-model="editGradeRange" size="sm" placeholder="z.B. 3-6" />
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-gray-500 mb-1">Dauer</label>
                      <UInput v-model="editDuration" size="sm" placeholder="z.B. 1 Schuljahr" />
                    </div>
                  </div>
                  <div class="mt-4 flex gap-2">
                    <UButton color="primary" size="sm" @click="saveTemplate(tpl.id)">Speichern</UButton>
                    <UButton color="neutral" variant="soft" size="sm" @click="handleDuplicateTemplate(tpl.id)">
                      <Copy class="h-4 w-4 mr-1" />
                      Duplizieren
                    </UButton>
                    <UButton color="neutral" variant="soft" size="sm" @click="confirmDeleteTemplate(tpl.id)">
                      <Trash2 class="h-4 w-4 mr-1" />
                      Löschen
                    </UButton>
                  </div>

                  <!-- Topics by phase -->
                  <div class="mt-6">
                    <h3 class="text-sm font-semibold mb-3">Fachbereiche nach Phase</h3>
                    <div class="space-y-4">
                      <div v-for="(phaseTopics, phase) in getTopicsByPhase(tpl.topics)" :key="phase">
                        <div class="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                          <div :class="['px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white', getPhaseColor(phase as string)]">
                            {{ phase }}
                          </div>
                          <div class="divide-y divide-gray-100 dark:divide-gray-800">
                            <div v-for="topic in phaseTopics" :key="topic.id" class="p-3">
                              <button class="w-full text-left flex items-center gap-2" @click="toggleTopic(topic.id)">
                                <component :is="expandedTopicIds.has(topic.id) ? ChevronDown : ChevronRight" class="h-4 w-4 text-gray-400 shrink-0" />
                                <span class="text-base">{{ topic.icon }}</span>
                                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ topic.name }}</span>
                                <span class="text-xs text-gray-400 ml-auto">
                                  {{ templatesStore.getTaskTemplatesByTopicId(topic.id).length }} Aufg. · {{ topic.materialIds.length }} Mat. · Monat {{ topic.startMonth }}–{{ topic.endMonth }}
                                </span>
                              </button>

                              <div v-if="expandedTopicIds.has(topic.id)" class="mt-3 ml-6 space-y-3">
                                <p class="text-xs text-gray-500">{{ topic.goalDescription }}</p>

                                <!-- Materials -->
                                <div v-if="topic.materialIds.length > 0">
                                  <p class="text-xs font-medium text-gray-500 mb-1">Lehrmaterial</p>
                                  <div class="space-y-1">
                                    <div v-for="matId in topic.materialIds" :key="matId" class="flex items-center justify-between text-xs rounded bg-gray-50 dark:bg-gray-900 px-2 py-1.5">
                                      <div class="flex items-center gap-2">
                                        <span class="font-medium">{{ getMaterialTitle(matId) }}</span>
                                        <UBadge v-for="fmt in getMaterialFormats(matId)" :key="fmt" color="neutral" variant="subtle" size="sm">{{ fmt }}</UBadge>
                                        <UBadge v-for="lp in getMaterialLp21(matId)" :key="lp" color="primary" variant="subtle" size="sm">{{ lp }}</UBadge>
                                      </div>
                                      <button class="text-gray-400 hover:text-red-500" @click="templatesStore.removeMaterialFromTopic(topic.id, matId, false)">
                                        <Trash2 class="h-3 w-3" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                <button class="flex items-center gap-1 text-xs text-green-600 hover:text-green-700" @click="openMaterialPicker(topic.id, false)">
                                  <Plus class="h-3.5 w-3.5" />
                                  Material hinzufügen
                                </button>

                                <!-- Tasks -->
                                <div>
                                  <p class="text-xs font-medium text-gray-500 mb-1">Aufgaben</p>
                                  <div class="space-y-2">
                                    <div
                                      v-for="task in templatesStore.getTaskTemplatesByTopicId(topic.id)"
                                      :key="task.id"
                                      class="rounded-lg border border-gray-100 dark:border-gray-800 p-2.5"
                                    >
                                      <div v-if="editingTaskId === task.id" class="space-y-2">
                                        <UInput v-model="editTaskTitle" size="sm" placeholder="Aufgabentitel" />
                                        <UInput v-model="editTaskLp21" size="sm" placeholder="LP21-Refs (kommagetrennt)" />
                                        <div class="flex gap-1">
                                          <UButton size="xs" color="primary" @click="saveEditTask">Speichern</UButton>
                                          <UButton size="xs" variant="ghost" @click="cancelEditTask">Abbrechen</UButton>
                                        </div>
                                      </div>
                                      <div v-else class="flex items-center justify-between">
                                        <div>
                                          <span class="text-sm font-medium">{{ task.title }}</span>
                                          <div class="flex gap-1 mt-1">
                                            <UBadge v-for="lp21Ref in task.lp21Refs" :key="lp21Ref" color="primary" variant="subtle" size="sm">{{ lp21Ref }}</UBadge>
                                            <UBadge v-if="!task.lp21Refs.length" color="neutral" variant="outline" size="sm">Kein LP21</UBadge>
                                          </div>
                                        </div>
                                        <div class="flex gap-1 shrink-0">
                                          <UButton size="xs" variant="ghost" @click="startEditTask(task.id, task.title, task.lp21Refs)">
                                            <Pencil class="h-3.5 w-3.5" />
                                          </UButton>
                                          <UButton size="xs" variant="ghost" @click="deleteTask(task.id)">
                                            <Trash2 class="h-3.5 w-3.5" />
                                          </UButton>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <button class="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 mt-2" @click="openAddTaskModal(tpl.id, topic.id)">
                                    <Plus class="h-3.5 w-3.5" />
                                    Aufgabe hinzufügen
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div v-if="Object.keys(getTopicsByPhase(tpl.topics)).length === 0" class="text-sm text-gray-400">
                        Keine Fachbereiche vorhanden.
                      </div>
                    </div>

                    <div class="flex items-center gap-3 mt-3">
                      <button class="flex items-center gap-1 text-sm text-green-600 hover:text-green-700" @click="openAddTopicModal(tpl.id)">
                        <Plus class="h-4 w-4" />
                        Fachbereich hinzufügen
                      </button>
                      <button class="flex items-center gap-1 text-sm text-green-600 hover:text-green-700" @click="openImportModal(tpl.id)">
                        <BookOpen class="h-4 w-4" />
                        Aus Bibliothek importieren
                      </button>
                    </div>
                  </div>
                </div>
              </UCard>
            </div>
          </div>
        </div>

        <!-- ========================================== -->
        <!-- SUB-TAB: Fachbereich-Vorlagen (Bibliothek) -->
        <!-- ========================================== -->
        <div v-if="vorlagenSubTab === 'topics'">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold">
              Fachbereich-Vorlagen
              <span class="text-sm font-normal text-gray-400 ml-1">({{ templatesStore.libraryTopics.length }})</span>
            </h2>
            <UButton size="sm" color="primary" @click="openNewLibTopicModal">
              <Plus class="h-4 w-4 mr-1" />
              Neuer Fachbereich
            </UButton>
          </div>

          <div v-if="templatesStore.libraryTopics.length === 0" class="text-center py-12 text-gray-400">
            Keine Fachbereich-Vorlagen in der Bibliothek.
          </div>

          <div class="space-y-4">
            <div v-for="(phaseTopics, phase) in libraryByPhase" :key="phase">
              <div class="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div :class="['px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white', getPhaseColor(phase as string)]">
                  {{ phase }}
                </div>

                <div class="divide-y divide-gray-100 dark:divide-gray-800">
                  <div v-for="topic in phaseTopics" :key="topic.id" class="p-3">
                    <button class="w-full text-left flex items-center gap-2" @click="toggleLibTopic(topic.id)">
                      <component :is="expandedLibTopicId === topic.id ? ChevronDown : ChevronRight" class="h-4 w-4 text-gray-400 shrink-0" />
                      <span class="text-base">{{ topic.icon }}</span>
                      <span class="text-sm font-medium text-gray-900 dark:text-white">{{ topic.name }}</span>
                      <UBadge v-if="topic.category" color="primary" variant="subtle" size="sm" class="ml-1">{{ topic.category }}</UBadge>
                      <span class="text-xs text-gray-400 ml-auto">
                        {{ topic.materialIds.length }} Mat. · {{ templatesStore.getTaskTemplatesByTopicId(topic.id).length }} Aufg.
                        <template v-if="topic.lp21Refs.length"> · {{ topic.lp21Refs.join(', ') }}</template>
                      </span>
                    </button>

                    <!-- Expanded library topic -->
                    <div v-if="expandedLibTopicId === topic.id" class="mt-4 ml-6 space-y-4">
                      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label class="block text-xs font-medium text-gray-500 mb-1">Name</label>
                          <UInput v-model="libEditName" size="sm" />
                        </div>
                        <div>
                          <label class="block text-xs font-medium text-gray-500 mb-1">Phase</label>
                          <USelect v-model="libEditPhase" :items="phaseOptions" size="sm" />
                        </div>
                        <div>
                          <label class="block text-xs font-medium text-gray-500 mb-1">Kategorie</label>
                          <USelect v-model="libEditCategory" :items="categoryOptions" size="sm" />
                        </div>
                        <div>
                          <label class="block text-xs font-medium text-gray-500 mb-1">Icon</label>
                          <UInput v-model="libEditIcon" size="sm" />
                        </div>
                        <div>
                          <label class="block text-xs font-medium text-gray-500 mb-1">Startmonat</label>
                          <UInput v-model.number="libEditStartMonth" type="number" min="1" max="12" size="sm" />
                        </div>
                        <div>
                          <label class="block text-xs font-medium text-gray-500 mb-1">Endmonat</label>
                          <UInput v-model.number="libEditEndMonth" type="number" min="1" max="12" size="sm" />
                        </div>
                        <div class="sm:col-span-2">
                          <label class="block text-xs font-medium text-gray-500 mb-1">Zielbeschreibung</label>
                          <UTextarea v-model="libEditGoal" :rows="2" size="sm" />
                        </div>
                      </div>

                      <!-- Lehrmaterial -->
                      <div>
                        <p class="text-xs font-semibold text-gray-500 mb-2">Lehrmaterial ({{ topic.materialIds.length }})</p>
                        <div v-if="topic.materialIds.length > 0" class="space-y-1 mb-2">
                          <div v-for="matId in topic.materialIds" :key="matId" class="flex items-center justify-between text-xs rounded bg-gray-50 dark:bg-gray-900 px-2 py-1.5">
                            <div class="flex items-center gap-2">
                              <span class="font-medium">{{ getMaterialTitle(matId) }}</span>
                              <UBadge v-for="fmt in getMaterialFormats(matId)" :key="fmt" color="neutral" variant="subtle" size="sm">{{ fmt }}</UBadge>
                              <UBadge v-for="lp in getMaterialLp21(matId)" :key="lp" color="primary" variant="subtle" size="sm">{{ lp }}</UBadge>
                            </div>
                            <button class="text-gray-400 hover:text-red-500" @click="templatesStore.removeMaterialFromTopic(topic.id, matId, true)">
                              <Trash2 class="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        <button class="flex items-center gap-1 text-xs text-green-600 hover:text-green-700" @click="openMaterialPicker(topic.id, true)">
                          <Plus class="h-3.5 w-3.5" />
                          Material hinzufügen
                        </button>
                      </div>

                      <!-- Aufgaben -->
                      <div>
                        <p class="text-xs font-semibold text-gray-500 mb-2">Aufgaben ({{ templatesStore.getTaskTemplatesByTopicId(topic.id).length }})</p>
                        <div class="space-y-2">
                          <div
                            v-for="task in templatesStore.getTaskTemplatesByTopicId(topic.id)"
                            :key="task.id"
                            class="rounded-lg border border-gray-100 dark:border-gray-800 p-2.5"
                          >
                            <div v-if="editingLibTaskId === task.id" class="space-y-2">
                              <UInput v-model="editLibTaskTitle" size="sm" placeholder="Aufgabentitel" />
                              <UInput v-model="editLibTaskLp21" size="sm" placeholder="LP21-Refs (kommagetrennt)" />
                              <div class="flex gap-1">
                                <UButton size="xs" color="primary" @click="saveEditLibTask">Speichern</UButton>
                                <UButton size="xs" variant="ghost" @click="cancelEditLibTask">Abbrechen</UButton>
                              </div>
                            </div>
                            <div v-else class="flex items-center justify-between">
                              <div>
                                <span class="text-sm font-medium">{{ task.title }}</span>
                                <div class="flex gap-1 mt-1">
                                  <UBadge v-for="lp21Ref in task.lp21Refs" :key="lp21Ref" color="primary" variant="subtle" size="sm">{{ lp21Ref }}</UBadge>
                                  <UBadge v-if="!task.lp21Refs.length" color="neutral" variant="outline" size="sm">Kein LP21</UBadge>
                                </div>
                              </div>
                              <div class="flex gap-1 shrink-0">
                                <UButton size="xs" variant="ghost" @click="startEditLibTask(task.id, task.title, task.lp21Refs)">
                                  <Pencil class="h-3.5 w-3.5" />
                                </UButton>
                                <UButton size="xs" variant="ghost" @click="deleteLibTask(task.id)">
                                  <Trash2 class="h-3.5 w-3.5" />
                                </UButton>
                              </div>
                            </div>
                          </div>
                        </div>
                        <button class="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 mt-2" @click="openAddLibTaskModal(topic.id)">
                          <Plus class="h-3.5 w-3.5" />
                          Aufgabe hinzufügen
                        </button>
                      </div>

                      <!-- Actions -->
                      <div class="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                        <UButton color="primary" size="sm" @click="saveLibTopic(topic.id)">Speichern</UButton>
                        <UButton color="neutral" variant="soft" size="sm" @click="duplicateLibTopic(topic.id)">
                          <Copy class="h-4 w-4 mr-1" />
                          Duplizieren
                        </UButton>
                        <UButton color="neutral" variant="soft" size="sm" @click="deleteLibTopic(topic.id)">
                          <Trash2 class="h-4 w-4 mr-1" />
                          Löschen
                        </UButton>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================ -->
      <!-- TEMPLATE MODALS                              -->
      <!-- ============================================ -->

      <!-- New Project Template Modal -->
      <UModal v-model:open="showNewTemplateModal">
        <template #content>
          <div class="p-6">
            <h3 class="text-lg font-semibold mb-4">Neue Projekt-Vorlage</h3>
            <div class="space-y-3">
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">Name</label>
                <UInput v-model="newTplName" size="sm" placeholder="z.B. Kräutergarten" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">Beschreibung</label>
                <UTextarea v-model="newTplDescription" :rows="2" size="sm" placeholder="Kurzbeschreibung der Vorlage" />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-medium text-gray-500 mb-1">Kategorie</label>
                  <USelect v-model="newTplCategory" :items="categoryOptions" size="sm" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-500 mb-1">Schwierigkeit</label>
                  <USelect v-model="newTplDifficulty" :items="difficultyOptions" size="sm" />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-medium text-gray-500 mb-1">Stufe</label>
                  <UInput v-model="newTplGradeRange" size="sm" placeholder="z.B. 3-6" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-500 mb-1">Dauer</label>
                  <UInput v-model="newTplDuration" size="sm" placeholder="z.B. 1 Schuljahr" />
                </div>
              </div>
            </div>
            <div class="mt-4 flex gap-2 justify-end">
              <UButton variant="ghost" size="sm" @click="showNewTemplateModal = false">Abbrechen</UButton>
              <UButton color="primary" size="sm" :disabled="!newTplName" @click="saveNewTemplate">Erstellen</UButton>
            </div>
          </div>
        </template>
      </UModal>

      <!-- Add Topic Modal -->
      <UModal v-model:open="showAddTopicModal">
        <template #content>
          <div class="p-6">
            <h3 class="text-lg font-semibold mb-4">Fachbereich hinzufügen</h3>
            <div class="space-y-3">
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">Name</label>
                <UInput v-model="newTopicName" size="sm" placeholder="z.B. Kompostierung" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">Phase</label>
                <USelect v-model="newTopicPhase" :items="phaseOptions" size="sm" />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-medium text-gray-500 mb-1">Startmonat</label>
                  <UInput v-model.number="newTopicStartMonth" type="number" min="1" max="12" size="sm" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-500 mb-1">Endmonat</label>
                  <UInput v-model.number="newTopicEndMonth" type="number" min="1" max="12" size="sm" />
                </div>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">Icon</label>
                <UInput v-model="newTopicIcon" size="sm" placeholder="z.B. 🌱" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">Zielbeschreibung</label>
                <UTextarea v-model="newTopicGoal" :rows="2" size="sm" placeholder="Lernziel des Fachbereichs" />
              </div>
            </div>
            <div class="mt-4 flex gap-2 justify-end">
              <UButton variant="ghost" size="sm" @click="showAddTopicModal = false">Abbrechen</UButton>
              <UButton color="primary" size="sm" :disabled="!newTopicName" @click="saveNewTopic">Speichern</UButton>
            </div>
          </div>
        </template>
      </UModal>

      <!-- Import from Library Modal -->
      <UModal v-model:open="showImportModal">
        <template #content>
          <div class="p-6">
            <h3 class="text-lg font-semibold mb-4">Aus Bibliothek importieren</h3>
            <p class="text-xs text-gray-500 mb-4">Wähle einen Fachbereich aus der Bibliothek. Er wird als Kopie in die Vorlage eingefügt.</p>

            <div v-if="Object.keys(libraryByPhase).length === 0" class="text-center py-8 text-gray-400 text-sm">
              Keine Fachbereiche in der Bibliothek vorhanden.
            </div>

            <div class="space-y-3 max-h-96 overflow-y-auto">
              <div v-for="(phaseTopics, phase) in libraryByPhase" :key="phase">
                <div class="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div :class="['px-3 py-1 text-xs font-bold uppercase tracking-wider text-white', getPhaseColor(phase as string)]">
                    {{ phase }}
                  </div>
                  <div class="divide-y divide-gray-100 dark:divide-gray-800">
                    <button
                      v-for="topic in phaseTopics"
                      :key="topic.id"
                      class="w-full text-left px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors flex items-center gap-2"
                      @click="importFromLibrary(topic.id)"
                    >
                      <span class="text-base">{{ topic.icon }}</span>
                      <div class="flex-1 min-w-0">
                        <span class="text-sm font-medium">{{ topic.name }}</span>
                        <div class="text-xs text-gray-400">
                          {{ templatesStore.getTaskTemplatesByTopicId(topic.id).length }} Aufg. · {{ topic.materialIds.length }} Mat.
                          <template v-if="topic.lp21Refs.length"> · {{ topic.lp21Refs.join(', ') }}</template>
                        </div>
                      </div>
                      <UBadge v-if="topic.category" color="neutral" variant="subtle" size="sm">{{ topic.category }}</UBadge>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-4 flex justify-end">
              <UButton variant="ghost" size="sm" @click="showImportModal = false">Abbrechen</UButton>
            </div>
          </div>
        </template>
      </UModal>

      <!-- Add Task Modal (Project Templates) -->
      <UModal v-model:open="showAddTaskModal">
        <template #content>
          <div class="p-6">
            <h3 class="text-lg font-semibold mb-4">Aufgabe hinzufügen</h3>
            <div class="space-y-3">
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">Titel</label>
                <UInput v-model="newTaskTitle" size="sm" placeholder="Aufgabentitel" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">LP21-Referenzen (kommagetrennt)</label>
                <UInput v-model="newTaskLp21" size="sm" placeholder="z.B. NMG.2.1, MA.2.A" />
              </div>
            </div>
            <div class="mt-4 flex gap-2 justify-end">
              <UButton variant="ghost" size="sm" @click="showAddTaskModal = false">Abbrechen</UButton>
              <UButton color="primary" size="sm" :disabled="!newTaskTitle" @click="saveNewTask">Speichern</UButton>
            </div>
          </div>
        </template>
      </UModal>

      <!-- Add Task Modal (Library Topics) -->
      <UModal v-model:open="showAddLibTaskModal">
        <template #content>
          <div class="p-6">
            <h3 class="text-lg font-semibold mb-4">Aufgabe hinzufügen</h3>
            <div class="space-y-3">
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">Titel</label>
                <UInput v-model="newLibTaskTitle" size="sm" placeholder="Aufgabentitel" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">LP21-Referenzen (kommagetrennt)</label>
                <UInput v-model="newLibTaskLp21" size="sm" placeholder="z.B. NMG.2.1, MA.2.A" />
              </div>
            </div>
            <div class="mt-4 flex gap-2 justify-end">
              <UButton variant="ghost" size="sm" @click="showAddLibTaskModal = false">Abbrechen</UButton>
              <UButton color="primary" size="sm" :disabled="!newLibTaskTitle" @click="saveNewLibTask">Speichern</UButton>
            </div>
          </div>
        </template>
      </UModal>

      <!-- New Library Topic Modal -->
      <UModal v-model:open="showNewLibTopicModal">
        <template #content>
          <div class="p-6">
            <h3 class="text-lg font-semibold mb-4">Neuer Fachbereich (Bibliothek)</h3>
            <div class="space-y-3">
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">Name</label>
                <UInput v-model="newLibName" size="sm" placeholder="z.B. Wurmkompost" />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-medium text-gray-500 mb-1">Phase</label>
                  <USelect v-model="newLibPhase" :items="phaseOptions" size="sm" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-500 mb-1">Kategorie</label>
                  <USelect v-model="newLibCategory" :items="categoryOptions" size="sm" />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-medium text-gray-500 mb-1">Startmonat</label>
                  <UInput v-model.number="newLibStartMonth" type="number" min="1" max="12" size="sm" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-500 mb-1">Endmonat</label>
                  <UInput v-model.number="newLibEndMonth" type="number" min="1" max="12" size="sm" />
                </div>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">Icon</label>
                <UInput v-model="newLibIcon" size="sm" placeholder="z.B. 🌱" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">Zielbeschreibung</label>
                <UTextarea v-model="newLibGoal" :rows="2" size="sm" placeholder="Lernziel des Fachbereichs" />
              </div>
            </div>
            <div class="mt-4 flex gap-2 justify-end">
              <UButton variant="ghost" size="sm" @click="showNewLibTopicModal = false">Abbrechen</UButton>
              <UButton color="primary" size="sm" :disabled="!newLibName" @click="saveNewLibTopic">Erstellen</UButton>
            </div>
          </div>
        </template>
      </UModal>

      <!-- Material Picker Modal -->
      <UModal v-model:open="showMaterialPicker">
        <template #content>
          <div class="p-6">
            <h3 class="text-lg font-semibold mb-4">Material hinzufügen</h3>

            <div class="space-y-3 mb-4">
              <div class="relative">
                <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <UInput v-model="materialPickerSearch" size="sm" placeholder="Suche..." class="pl-8" />
              </div>
              <div class="flex gap-2">
                <USelect v-model="materialPickerTag" :items="materialPickerTagOptions" size="sm" class="flex-1" />
                <USelect v-model="materialPickerFormat" :items="materialPickerFormatOptions" size="sm" class="w-36" />
              </div>
            </div>

            <div class="max-h-80 overflow-y-auto space-y-1">
              <button
                v-for="mat in filteredPickerMaterials"
                :key="mat.id"
                class="w-full text-left rounded-lg border px-3 py-2 text-sm transition-colors"
                :class="isMaterialAssigned(mat.id)
                  ? 'border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950/30'
                  : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900'"
                @click="toggleMaterial(mat.id)"
              >
                <div class="flex items-center gap-2">
                  <input type="checkbox" :checked="isMaterialAssigned(mat.id)" class="h-4 w-4 rounded text-green-600 pointer-events-none" />
                  <span class="font-medium flex-1">{{ mat.title }}</span>
                  <div class="flex gap-1">
                    <UBadge v-for="fmt in mat.formats" :key="fmt" color="neutral" variant="subtle" size="sm">{{ fmt }}</UBadge>
                  </div>
                </div>
                <div class="ml-6 flex gap-1 mt-0.5">
                  <UBadge v-for="lp in mat.lp21Refs" :key="lp" color="primary" variant="subtle" size="sm">{{ lp }}</UBadge>
                  <span v-if="isMaterialAssigned(mat.id)" class="text-xs text-green-600 ml-1">(zugewiesen)</span>
                </div>
              </button>
            </div>

            <div class="mt-4 flex justify-end">
              <UButton color="primary" size="sm" @click="showMaterialPicker = false">Fertig</UButton>
            </div>
          </div>
        </template>
      </UModal>
    </div>
  </div>
</template>
