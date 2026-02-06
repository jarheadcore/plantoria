<script setup lang="ts">
import { useTasksStore } from '@/stores/tasks'
import { useProjectsStore } from '@/stores/projects'
import { useSubjectsStore } from '@/stores/subjects'
import { Plus, Mail, MailX, Palmtree } from 'lucide-vue-next'
import type { Task, ProjectPhase, TaskStatus } from '@/types'

definePageMeta({ layout: 'teacher' })

const tasksStore = useTasksStore()
const projectsStore = useProjectsStore()
const subjectsStore = useSubjectsStore()

// Filters
const filterProject = ref('all')
const filterSubject = ref('all')
const filterStatus = ref('all')
const filterHoliday = ref('all')

const projectOptions = computed(() => [
  { label: 'Alle Projekte', value: 'all' },
  ...projectsStore.projects.map((p) => ({ label: p.name, value: p.id })),
])

const subjectOptions = computed(() => [
  { label: 'Alle Fachbereiche', value: 'all' },
  ...subjectsStore.subjects.map((s) => ({ label: s.name, value: s.id })),
])

const statusOptions = [
  { label: 'Alle Status', value: 'all' },
  { label: 'Offen', value: 'Offen' },
  { label: 'In Bearbeitung', value: 'In Bearbeitung' },
  { label: 'Erledigt', value: 'Erledigt' },
]

const holidayOptions = [
  { label: 'Alle Aufgaben', value: 'all' },
  { label: 'Nur Ferienaufgaben', value: 'holiday' },
  { label: 'Nur reguläre', value: 'regular' },
]

const filteredTasks = computed(() => {
  let tasks = tasksStore.allTasks
  if (filterProject.value !== 'all') {
    tasks = tasks.filter((t) => t.projectId === filterProject.value)
  }
  if (filterSubject.value !== 'all') {
    tasks = tasks.filter((t) => t.subjectAreaId === filterSubject.value)
  }
  if (filterStatus.value !== 'all') {
    tasks = tasks.filter((t) => t.status === filterStatus.value)
  }
  if (filterHoliday.value === 'holiday') {
    tasks = tasks.filter((t) => t.isHolidayTask)
  } else if (filterHoliday.value === 'regular') {
    tasks = tasks.filter((t) => !t.isHolidayTask)
  }
  return tasks.sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''))
})

// Create task modal
const showCreate = ref(false)
const newTask = ref({
  title: '',
  description: '',
  projectId: 'proj-1',
  phase: 'Pflege' as ProjectPhase,
  status: 'Offen' as TaskStatus,
  dueDate: '',
  isHolidayTask: false,
  emailReminder: false,
  subjectAreaId: '',
})

function openCreate() {
  newTask.value = {
    title: '',
    description: '',
    projectId: 'proj-1',
    phase: 'Pflege',
    status: 'Offen',
    dueDate: '',
    isHolidayTask: false,
    emailReminder: false,
    subjectAreaId: '',
  }
  showCreate.value = true
}

function createTask() {
  if (!newTask.value.title.trim()) return
  tasksStore.createTask({
    id: `t-${Date.now()}`,
    projectId: newTask.value.projectId,
    title: newTask.value.title,
    description: newTask.value.description || undefined,
    phase: newTask.value.phase,
    status: newTask.value.status,
    dueDate: newTask.value.dueDate || undefined,
    lp21Refs: [],
    isHolidayTask: newTask.value.isHolidayTask || undefined,
    emailReminder: newTask.value.emailReminder || undefined,
    subjectAreaId: newTask.value.subjectAreaId || undefined,
  })
  showCreate.value = false
}

function toggleEmailReminder(task: Task) {
  tasksStore.updateTask(task.id, { emailReminder: !task.emailReminder })
}

function formatDate(date?: string) {
  if (!date) return '--'
  const d = new Date(date)
  return d.toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function getProjectName(projectId: string) {
  return projectsStore.projects.find((p) => p.id === projectId)?.name || projectId
}

function getSubjectName(subjectAreaId?: string) {
  if (!subjectAreaId) return null
  return subjectsStore.subjects.find((s) => s.id === subjectAreaId)?.name || null
}

const phaseOptions = [
  { label: 'Vorprojekt', value: 'Vorprojekt' },
  { label: 'Planung', value: 'Planung' },
  { label: 'Pflanzung', value: 'Pflanzung' },
  { label: 'Pflege', value: 'Pflege' },
  { label: 'Ernte', value: 'Ernte' },
  { label: 'Verarbeitung', value: 'Verarbeitung' },
  { label: 'Vermarktung', value: 'Vermarktung' },
]
</script>

<template>
  <div>
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Aufgabenpool</h1>
        <p class="text-sm text-gray-500 mt-1">Alle Aufgaben klassenübergreifend verwalten</p>
      </div>
      <UButton color="primary" @click="openCreate">
        <Plus :size="16" class="mr-1" /> Neue Aufgabe
      </UButton>
    </div>

    <!-- Filters -->
    <div class="mb-6 flex flex-wrap gap-3">
      <USelect v-model="filterProject" :items="projectOptions" class="w-44" />
      <USelect v-model="filterSubject" :items="subjectOptions" class="w-44" />
      <USelect v-model="filterStatus" :items="statusOptions" class="w-36" />
      <USelect v-model="filterHoliday" :items="holidayOptions" class="w-44" />
    </div>

    <p class="mb-4 text-sm text-gray-500">
      {{ filteredTasks.length }} Aufgaben gefunden
    </p>

    <!-- Task list -->
    <div class="space-y-3">
      <UCard v-for="task in filteredTasks" :key="task.id">
        <div class="flex items-start gap-3">
          <input
            type="checkbox"
            class="mt-1 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            :checked="task.status === 'Erledigt'"
            @change="tasksStore.toggleTask(task.id)"
          />
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span :class="['text-sm font-medium', task.status === 'Erledigt' ? 'line-through text-gray-400' : '']">
                {{ task.title }}
              </span>
              <UBadge v-if="task.isHolidayTask" color="neutral" variant="subtle" size="xs">
                Ferienaufgabe
              </UBadge>
              <UBadge
                :color="task.status === 'Erledigt' ? 'primary' : 'neutral'"
                variant="subtle"
                size="xs"
              >
                {{ task.status }}
              </UBadge>
            </div>
            <p v-if="task.description" class="text-xs text-gray-500 mt-1">{{ task.description }}</p>
            <div class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 mt-1">
              <span>Projekt: {{ getProjectName(task.projectId) }}</span>
              <span>Phase: {{ task.phase }}</span>
              <span v-if="getSubjectName(task.subjectAreaId)">Fachbereich: {{ getSubjectName(task.subjectAreaId) }}</span>
              <span>Fällig: {{ formatDate(task.dueDate) }}</span>
              <span v-if="task.groupName">Gruppe: {{ task.groupName }}</span>
            </div>
          </div>
          <div class="flex items-center gap-1 shrink-0">
            <UButton
              v-if="task.isHolidayTask"
              size="xs"
              :variant="task.emailReminder ? 'soft' : 'ghost'"
              :color="task.emailReminder ? 'primary' : 'neutral'"
              @click="toggleEmailReminder(task)"
              :title="task.emailReminder ? 'E-Mail-Erinnerung aktiv' : 'E-Mail-Erinnerung aus'"
            >
              <component :is="task.emailReminder ? Mail : MailX" :size="14" />
            </UButton>
            <UButton
              size="xs"
              variant="ghost"
              color="neutral"
              @click="tasksStore.deleteTask(task.id)"
            >
              &times;
            </UButton>
          </div>
        </div>
      </UCard>
    </div>

    <p v-if="filteredTasks.length === 0" class="py-12 text-center text-gray-400">
      Keine Aufgaben gefunden.
    </p>

    <!-- Create task modal -->
    <UModal v-model:open="showCreate">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-4">Neue Aufgabe</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Titel</label>
              <UInput v-model="newTask.title" placeholder="Aufgabentitel" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Beschreibung</label>
              <UTextarea v-model="newTask.description" placeholder="Optional..." :rows="2" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium mb-1">Projekt</label>
                <USelect v-model="newTask.projectId" :items="projectOptions.slice(1)" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Phase</label>
                <USelect v-model="newTask.phase" :items="phaseOptions" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium mb-1">Fachbereich</label>
                <USelect v-model="newTask.subjectAreaId" :items="subjectOptions" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Fälligkeitsdatum</label>
                <UInput v-model="newTask.dueDate" type="date" />
              </div>
            </div>
            <div class="flex items-center gap-4">
              <label class="flex items-center gap-2 text-sm">
                <input type="checkbox" v-model="newTask.isHolidayTask" class="h-4 w-4 rounded text-green-600" />
                Ferienaufgabe
              </label>
              <label v-if="newTask.isHolidayTask" class="flex items-center gap-2 text-sm">
                <input type="checkbox" v-model="newTask.emailReminder" class="h-4 w-4 rounded text-green-600" />
                E-Mail-Erinnerung
              </label>
            </div>
          </div>
          <div class="mt-6 flex justify-end gap-2">
            <UButton variant="ghost" @click="showCreate = false">Abbrechen</UButton>
            <UButton color="primary" @click="createTask">Erstellen</UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
