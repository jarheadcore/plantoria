<script setup lang="ts">
import { useProjectsStore } from '@/stores/projects'
import { useStudentsStore } from '@/stores/students'
import type { ProjectStatus, ProjectPhase } from '@/types'

definePageMeta({ layout: 'teacher' })

const route = useRoute()
const projectsStore = useProjectsStore()
const studentsStore = useStudentsStore()

const projectId = route.params.id as string
const project = computed(() => projectsStore.getProjectById(projectId))
const tasks = computed(() => projectsStore.getTasksByProjectId(projectId))
const cultures = computed(() => projectsStore.getCulturesByProjectId(projectId))
const groups = computed(() => projectsStore.getGroupsByProjectId(projectId))
const preProject = computed(() => projectsStore.getPreProjectByProjectId(projectId))

const activeTab = ref('tasks')

const statusOptions = [
  { label: 'Vorprojekt', value: 'Vorprojekt' },
  { label: 'Projektstart', value: 'Projektstart' },
  { label: 'Laufend', value: 'Laufend' },
  { label: 'Abgeschlossen', value: 'Abgeschlossen' },
]

const phaseOptions = [
  { label: 'Vorprojekt', value: 'Vorprojekt' },
  { label: 'Planung', value: 'Planung' },
  { label: 'Pflanzung', value: 'Pflanzung' },
  { label: 'Pflege', value: 'Pflege' },
  { label: 'Ernte', value: 'Ernte' },
  { label: 'Verarbeitung', value: 'Verarbeitung' },
  { label: 'Vermarktung', value: 'Vermarktung' },
]

// Task filtering
const taskPhaseFilter = ref('all')
const taskStatusFilter = ref('all')
const taskGroupFilter = ref('all')

const filteredTasks = computed(() => {
  return tasks.value.filter((t) => {
    if (taskPhaseFilter.value !== 'all' && t.phase !== taskPhaseFilter.value) return false
    if (taskStatusFilter.value !== 'all' && t.status !== taskStatusFilter.value) return false
    if (taskGroupFilter.value !== 'all' && t.groupId !== taskGroupFilter.value) return false
    return true
  })
})

const tasksByPhase = computed(() => {
  const phases: Record<string, typeof filteredTasks.value> = {}
  for (const t of filteredTasks.value) {
    if (!phases[t.phase]) phases[t.phase] = []
    phases[t.phase]!.push(t)
  }
  return phases
})

// Timeline data
const timelinePhases = [
  { name: 'Planung', start: 1, end: 3, color: 'bg-blue-400' },
  { name: 'Pflanzung', start: 3, end: 5, color: 'bg-green-400' },
  { name: 'Pflege', start: 5, end: 7, color: 'bg-yellow-400' },
  { name: 'Ernte', start: 7, end: 9, color: 'bg-orange-400' },
  { name: 'Verarbeitung', start: 9, end: 10, color: 'bg-red-400' },
]
const months = ['Jan', 'Feb', 'Mrz', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
const currentMonthIndex = 4 // May (0-indexed)

// PreProject helpers
const preProjectProgress = computed(() => {
  if (!preProject.value) return 0
  const done = preProject.value.items.filter((i) => i.completed).length
  return Math.round((done / preProject.value.items.length) * 100)
})

const preProjectByCategory = computed(() => {
  if (!preProject.value) return {}
  const cats: Record<string, typeof preProject.value.items> = {}
  for (const item of preProject.value.items) {
    if (!cats[item.category]) cats[item.category] = []
    cats[item.category]!.push(item)
  }
  return cats
})

function onStatusChange(val: string) {
  projectsStore.updateProjectStatus(projectId, val as ProjectStatus)
}

function onPhaseChange(val: string) {
  projectsStore.updateProjectPhase(projectId, val as ProjectPhase)
}

function getStudentNames(studentIds: string[]) {
  return studentsStore
    .getStudentsByIds(studentIds)
    .map((s) => s.name)
    .join(', ')
}

function cultureStatusColor(status: string) {
  switch (status) {
    case 'Gesät': return 'warning'
    case 'Wächst': return 'success'
    case 'Erntereif': return 'info'
    case 'Geerntet': return 'neutral'
    default: return 'neutral'
  }
}
</script>

<template>
  <div v-if="project">
    <!-- Breadcrumb -->
    <div class="mb-4">
      <NuxtLink to="/teacher/projects" class="text-sm text-gray-500 hover:text-gray-700">
        ← Projekte
      </NuxtLink>
    </div>

    <!-- Project header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">{{ project.name }}</h1>
      <div class="flex flex-wrap items-center gap-4 mb-4">
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-500">Status:</span>
          <USelect
            :model-value="project.status"
            :items="statusOptions"
            size="sm"
            @update:model-value="onStatusChange"
          />
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-500">Phase:</span>
          <USelect
            :model-value="project.currentPhase"
            :items="phaseOptions"
            size="sm"
            @update:model-value="onPhaseChange"
          />
        </div>
        <span v-if="project.area" class="text-sm text-gray-500">
          Fläche: <strong>{{ project.area }}m²</strong>
        </span>
      </div>
      <ProgressBar :value="project.progress" />
    </div>

    <!-- Tabs -->
    <div class="mb-6 flex flex-wrap gap-1 border-b border-gray-200 dark:border-gray-800">
      <button
        v-for="tab in [
          { key: 'tasks', label: 'Aufgaben' },
          { key: 'timeline', label: 'Zeitstrahl' },
          { key: 'cultures', label: 'Kulturen' },
          { key: 'groups', label: 'Gruppen' },
          { key: 'preproject', label: 'Vorprojekt' },
        ]"
        :key="tab.key"
        :class="[
          'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px',
          activeTab === tab.key
            ? 'border-green-600 text-green-700 dark:text-green-400'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
        ]"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab: Tasks -->
    <div v-if="activeTab === 'tasks'">
      <div class="mb-4 flex flex-wrap gap-3">
        <USelect
          v-model="taskPhaseFilter"
          :items="[{ label: 'Alle Phasen', value: 'all' }, ...phaseOptions]"
          size="sm"
        />
        <USelect
          v-model="taskStatusFilter"
          :items="[
            { label: 'Alle Status', value: 'all' },
            { label: 'Offen', value: 'Offen' },
            { label: 'In Bearbeitung', value: 'In Bearbeitung' },
            { label: 'Erledigt', value: 'Erledigt' },
          ]"
          size="sm"
        />
      </div>

      <div class="space-y-6">
        <div v-for="(phaseTasks, phase) in tasksByPhase" :key="phase">
          <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            {{ phase }}
          </h3>
          <div class="space-y-2">
            <div
              v-for="task in phaseTasks"
              :key="task.id"
              class="flex items-center gap-3 rounded-lg border border-gray-100 p-3 dark:border-gray-800"
            >
              <input
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                :checked="task.status === 'Erledigt'"
                @change="projectsStore.toggleTask(task.id)"
              />
              <span :class="['flex-1 text-sm', task.status === 'Erledigt' ? 'line-through text-gray-400' : '']">
                {{ task.title }}
              </span>
              <span v-if="task.groupName" class="text-xs text-gray-400">{{ task.groupName }}</span>
              <UBadge
                :color="task.status === 'Erledigt' ? 'green' : task.status === 'In Bearbeitung' ? 'primary' : 'neutral'"
                variant="subtle"
                size="xs"
              >
                {{ task.status }}
              </UBadge>
            </div>
          </div>
        </div>
      </div>

      <UButton color="primary" variant="soft" class="mt-4" disabled>
        + Neue Aufgabe
      </UButton>
    </div>

    <!-- Tab: Timeline -->
    <div v-if="activeTab === 'timeline'">
      <div class="overflow-x-auto">
        <div class="min-w-[700px]">
          <!-- Month labels -->
          <div class="flex mb-2">
            <div
              v-for="(m, i) in months"
              :key="i"
              :class="['flex-1 text-center text-xs text-gray-400', i === currentMonthIndex ? 'font-bold text-green-600' : '']"
            >
              {{ m }}
            </div>
          </div>
          <!-- Timeline bar -->
          <div class="relative h-10 rounded-lg bg-gray-100 dark:bg-gray-800">
            <div
              v-for="phase in timelinePhases"
              :key="phase.name"
              :class="['absolute top-1 bottom-1 rounded', phase.color, 'opacity-80']"
              :style="{
                left: `${(phase.start / 12) * 100}%`,
                width: `${((phase.end - phase.start) / 12) * 100}%`,
              }"
            >
              <span class="absolute inset-0 flex items-center justify-center text-xs font-medium text-white drop-shadow">
                {{ phase.name }}
              </span>
            </div>
            <!-- Today marker -->
            <div
              class="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
              :style="{ left: `${((currentMonthIndex + 0.5) / 12) * 100}%` }"
            >
              <span class="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-red-500 font-bold whitespace-nowrap">
                Heute
              </span>
            </div>
          </div>
          <!-- Milestones -->
          <div class="mt-6 space-y-2">
            <h4 class="text-sm font-semibold text-gray-500">Meilensteine</h4>
            <div class="text-sm text-gray-600 space-y-1">
              <p>• 15. Mrz – Beetplan fertiggestellt</p>
              <p>• 20. Apr – Erste Aussaat</p>
              <p class="font-semibold text-green-600">• 10. Mai – Setzlinge eingepflanzt (nächster Meilenstein)</p>
              <p>• 15. Jul – Erste Ernte (geplant)</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab: Cultures -->
    <div v-if="activeTab === 'cultures'">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <UCard v-for="culture in cultures" :key="culture.id">
          <div class="text-center">
            <div class="mb-2 text-3xl">
              {{ culture.plantType === 'Kräuter' ? '🌿' : '🥬' }}
            </div>
            <h3 class="font-semibold">{{ culture.plantName }}</h3>
            <p class="text-xs text-gray-500 mb-1">{{ culture.bedNumber }}</p>
            <UBadge :color="cultureStatusColor(culture.status) as any" variant="subtle" size="xs" class="mb-2">
              {{ culture.status }}
            </UBadge>
            <ProgressBar :value="culture.progress" size="sm" />
          </div>
        </UCard>
      </div>
      <UButton color="primary" variant="soft" class="mt-4" disabled>
        + Kultur hinzufügen
      </UButton>
    </div>

    <!-- Tab: Groups -->
    <div v-if="activeTab === 'groups'">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <UCard v-for="group in groups" :key="group.id">
          <div class="flex items-start justify-between mb-2">
            <h3 class="font-semibold">
              {{ group.name === 'Nicht zugewiesen' ? '⚠️ ' : '🌻 ' }}{{ group.name }}
            </h3>
            <UButton v-if="group.name !== 'Nicht zugewiesen'" size="xs" variant="ghost" disabled>
              Bearbeiten
            </UButton>
            <UButton v-else size="xs" variant="soft" color="primary" disabled>
              Zuweisen
            </UButton>
          </div>
          <p class="text-sm text-gray-500 mb-2">{{ getStudentNames(group.studentIds) }}</p>
          <p v-if="group.tasksTotal" class="text-xs text-gray-400">
            Aufgaben: {{ group.tasksCompleted }}/{{ group.tasksTotal }} erledigt
          </p>
        </UCard>
      </div>
      <UButton color="primary" variant="soft" class="mt-4" disabled>
        + Neue Gruppe
      </UButton>
    </div>

    <!-- Tab: PreProject -->
    <div v-if="activeTab === 'preproject' && preProject">
      <div class="mb-4 flex items-center gap-4">
        <UBadge
          :color="preProject.status === 'Abgeschlossen' ? 'green' : 'neutral'"
          variant="subtle"
        >
          {{ preProject.status }}
        </UBadge>
        <div class="flex-1">
          <ProgressBar :value="preProjectProgress" />
        </div>
      </div>

      <div class="space-y-6">
        <div v-for="(items, category) in preProjectByCategory" :key="category">
          <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            {{ category }}
          </h3>
          <div class="space-y-2">
            <div
              v-for="item in items"
              :key="item.id"
              class="flex items-center gap-3 rounded-lg border border-gray-100 p-3 dark:border-gray-800"
            >
              <input
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                :checked="item.completed"
                @change="projectsStore.togglePreProjectItem(preProject.id, item.id)"
              />
              <span :class="['flex-1 text-sm', item.completed ? 'line-through text-gray-400' : '']">
                {{ item.label }}
              </span>
              <UButton v-if="item.orderUrl && !item.completed" size="xs" variant="soft" disabled>
                Bestellen →
              </UButton>
            </div>
          </div>
        </div>
      </div>

      <UButton
        color="primary"
        class="mt-6"
        :disabled="preProjectProgress < 100"
      >
        Vorprojekt abschliessen
      </UButton>
    </div>
  </div>

  <div v-else class="py-16 text-center text-gray-500">
    Projekt nicht gefunden.
  </div>
</template>
