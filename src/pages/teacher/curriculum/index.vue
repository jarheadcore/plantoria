<script setup lang="ts">
import { useCurriculumStore } from '@/stores/curriculum'
import { useProjectsStore } from '@/stores/projects'
import { useTeacherStore } from '@/stores/teacher'
import { FileDown, CheckCircle, Circle, CalendarClock, AlertTriangle } from 'lucide-vue-next'
import type { TaskWithContext, CurriculumTopic } from '@/types'

definePageMeta({ layout: 'teacher' })

const curriculumStore = useCurriculumStore()
const projectsStore = useProjectsStore()
const teacherStore = useTeacherStore()

const activeTab = ref('dashboard')
const showExportDialog = ref(false)
const expandedTopicCode = ref<string | null>(null)

// Export dialog state
const exportPeriod = ref('Ganzes Schuljahr')
const exportContent = ref({
  totalProgress: true,
  bySubject: true,
  treatedTopics: true,
  linkedProjects: true,
  radarChart: true,
  heatmap: false,
  downloadHistory: false,
})
const exportFormat = ref('PDF')

// Group filter options
const groupFilterOptions = computed(() => [
  { label: 'Alle Gruppen', value: 'all' },
  ...curriculumStore.allGroups.map((g) => ({
    label: `${g.name} (${g.projectName})`,
    value: g.id,
  })),
])

function onGroupFilterChange(val: string) {
  curriculumStore.activeGroupId = val === 'all' ? null : val
}

const activeGroupLabel = computed(() => {
  if (!curriculumStore.activeGroupId) return null
  const group = curriculumStore.allGroups.find((g) => g.id === curriculumStore.activeGroupId)
  return group ? group.name : null
})

const periodOptions = [
  { label: 'Ganzes Schuljahr', value: 'Ganzes Schuljahr' },
  { label: '1. Semester', value: '1. Semester' },
  { label: '2. Semester', value: '2. Semester' },
]

const formatOptions = [
  { label: 'PDF', value: 'PDF' },
  { label: 'CSV', value: 'CSV' },
]

const tabs = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'matrix', label: 'Projekt-Matrix' },
  { key: 'subject', label: 'Nach Fachbereich' },
  { key: 'timeline', label: 'Zeitverlauf' },
  { key: 'export', label: 'Export' },
]

function formatDate(date?: string) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// --- Projekt-Matrix ---

interface MatrixCellData {
  status: 'completed' | 'planned' | 'empty'
  taskCount: number
  completedCount: number
}

const matrixProjects = computed(() => projectsStore.projects)

const matrixCodes = computed(() => curriculumStore.allCurriculumCodes)

function getMatrixCell(projectId: string, code: string): MatrixCellData {
  const tasks = curriculumStore.filteredTasks.filter(
    (t) => t.projectId === projectId && t.lp21Refs.includes(code),
  )
  const completedCount = tasks.filter((t) => t.status === 'Erledigt').length
  if (completedCount > 0) return { status: 'completed', taskCount: tasks.length, completedCount }
  if (tasks.length > 0) return { status: 'planned', taskCount: tasks.length, completedCount: 0 }
  return { status: 'empty', taskCount: 0, completedCount: 0 }
}

const selectedMatrixCell = ref<{ projectId: string; code: string } | null>(null)

const matrixDrilldownTasks = computed<TaskWithContext[]>(() => {
  if (!selectedMatrixCell.value) return []
  return curriculumStore.tasksByCurriculumCode.get(selectedMatrixCell.value.code)?.filter(
    (entry) => entry.project.id === selectedMatrixCell.value!.projectId,
  ) ?? []
})

function clickMatrixCell(projectId: string, code: string) {
  const cell = getMatrixCell(projectId, code)
  if (cell.status === 'empty') {
    selectedMatrixCell.value = null
    return
  }
  if (selectedMatrixCell.value?.projectId === projectId && selectedMatrixCell.value?.code === code) {
    selectedMatrixCell.value = null
  } else {
    selectedMatrixCell.value = { projectId, code }
  }
}

// --- Fachbereich Detail ---

function toggleTopicDetail(code: string) {
  expandedTopicCode.value = expandedTopicCode.value === code ? null : code
}

function getTopicStatus(topic: CurriculumTopic): { label: string; color: 'green' | 'primary' | 'neutral' } {
  if (curriculumStore.isTopicEffectivelyTreated(topic)) return { label: 'Behandelt', color: 'green' }
  const hasTasks = curriculumStore.tasksByCurriculumCode.has(topic.code)
  if (hasTasks) return { label: 'Geplant', color: 'primary' }
  return { label: 'Offen', color: 'neutral' }
}

// --- Zeitverlauf ---

const monthLabels: Record<number, string> = {
  1: 'Januar', 2: 'Februar', 3: 'März', 4: 'April', 5: 'Mai', 6: 'Juni',
  7: 'Juli', 8: 'August', 9: 'September', 10: 'Oktober', 11: 'November', 12: 'Dezember',
}

interface TimelineMonthData {
  month: number
  year: number
  label: string
  topics: { code: string; title: string; date: string; project?: string; download?: string }[]
  cumulativeCount: number
}

const timelineMonths = computed<TimelineMonthData[]>(() => {
  const allTopics = curriculumStore.curriculumData.flatMap((c) => c.topics)
  const treatedTopics = allTopics.filter((t) => curriculumStore.isTopicEffectivelyTreated(t) && t.treatedDate)

  // Group by month
  const monthMap = new Map<string, TimelineMonthData>()
  for (const topic of treatedTopics) {
    const d = new Date(topic.treatedDate!)
    const m = d.getMonth() + 1
    const y = d.getFullYear()
    const key = `${y}-${m}`
    if (!monthMap.has(key)) {
      monthMap.set(key, {
        month: m,
        year: y,
        label: `${monthLabels[m]} ${y}`,
        topics: [],
        cumulativeCount: 0,
      })
    }
    monthMap.get(key)!.topics.push({
      code: topic.code,
      title: topic.title,
      date: topic.treatedDate!,
      project: topic.treatedByProject,
      download: topic.treatedByDownload,
    })
  }

  // Sort chronologically
  const sorted = Array.from(monthMap.values()).sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year
    return a.month - b.month
  })

  // Cumulative count
  let cumulative = 0
  for (const entry of sorted) {
    cumulative += entry.topics.length
    entry.cumulativeCount = cumulative
  }

  return sorted
})

// Planned LP21 goals (not yet treated but have tasks)
const plannedGoals = computed(() => {
  const allTopics = curriculumStore.curriculumData.flatMap((c) => c.topics)
  return allTopics
    .filter((t) => !curriculumStore.isTopicEffectivelyTreated(t) && curriculumStore.tasksByCurriculumCode.has(t.code))
    .map((t) => {
      const entries = curriculumStore.tasksByCurriculumCode.get(t.code)
      const openTasks = entries?.filter((e) => e.task.status !== 'Erledigt') ?? []
      const nextDue = openTasks
        .filter((e) => e.task.dueDate)
        .sort((a, b) => (a.task.dueDate ?? '').localeCompare(b.task.dueDate ?? ''))[0]
      return {
        code: t.code,
        title: t.title,
        taskCount: entries?.length ?? 0,
        nextTask: nextDue?.task.title,
        nextDueDate: nextDue?.task.dueDate,
        project: nextDue?.project.name,
      }
    })
})
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Lehrplan 21</h1>
        <p class="text-sm text-gray-500 mt-1">
          Klasse: {{ teacherStore.activeClass.name }} | SJ {{ teacherStore.activeClass.schoolYear }}
          <span v-if="activeGroupLabel" class="text-green-600 font-medium"> | Gruppe: {{ activeGroupLabel }}</span>
        </p>
      </div>
      <div class="flex items-center gap-3">
        <USelect
          :model-value="curriculumStore.activeGroupId ?? 'all'"
          :items="groupFilterOptions"
          class="w-56"
          @update:model-value="onGroupFilterChange"
        />
        <UButton variant="soft" color="primary" @click="activeTab = 'export'">
          <FileDown :size="16" class="mr-1" /> Bericht exportieren
        </UButton>
      </div>
    </div>

    <!-- Tabs -->
    <div class="mb-6 flex flex-wrap gap-1 border-b border-gray-200 dark:border-gray-800">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="[
          'px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
          activeTab === tab.key
            ? 'border-green-600 text-green-700 dark:text-green-400'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
        ]"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- ============================================ -->
    <!-- Tab: Dashboard                               -->
    <!-- ============================================ -->
    <div v-if="activeTab === 'dashboard'">
      <!-- Overall progress -->
      <UCard class="mb-6">
        <div class="flex items-center justify-between mb-2">
          <span class="font-semibold">Gesamtfortschritt</span>
          <span class="text-sm text-gray-500">
            {{ curriculumStore.filteredProgress.treatedTopics }} / {{ curriculumStore.filteredProgress.totalTopics }} Themen behandelt
          </span>
        </div>
        <ProgressBar :value="curriculumStore.filteredProgress.coveragePercent" />
      </UCard>

      <!-- KPI Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <UCard>
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <CheckCircle :size="20" class="text-green-600" />
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ curriculumStore.dashboardStats.treated }}</p>
              <p class="text-xs text-gray-500">Behandelt</p>
            </div>
          </div>
        </UCard>
        <UCard>
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
              <Circle :size="20" class="text-gray-400" />
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ curriculumStore.dashboardStats.open }}</p>
              <p class="text-xs text-gray-500">Offen</p>
            </div>
          </div>
        </UCard>
        <UCard>
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <CalendarClock :size="20" class="text-blue-600" />
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ curriculumStore.dashboardStats.planned }}</p>
              <p class="text-xs text-gray-500">Geplant</p>
            </div>
          </div>
        </UCard>
        <UCard>
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
              <AlertTriangle :size="20" class="text-red-500" />
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ curriculumStore.dashboardStats.gaps }}</p>
              <p class="text-xs text-gray-500">Lücken</p>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Radar Chart + Heatmap -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UCard>
          <h3 class="font-semibold mb-4">Fachbereich-Balance</h3>
          <div class="flex items-center justify-center">
            <RadarChart :data="curriculumStore.radarChartData" :size="280" />
          </div>
          <p class="text-xs text-gray-400 text-center mt-2">
            Gestrichelt = Ziel (100%) | Fläche = Aktuell
          </p>
        </UCard>
        <UCard>
          <h3 class="font-semibold mb-4">LP21-Abdeckung im Schuljahr</h3>
          <Heatmap :data="curriculumStore.heatmapData" />
          <p class="text-xs text-gray-400 mt-2">
            Anzahl abgeschlossener LP21-Ziele pro Monat und Fachbereich
          </p>
        </UCard>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- Tab: Projekt-Matrix                          -->
    <!-- ============================================ -->
    <div v-if="activeTab === 'matrix'">
      <p class="text-sm text-gray-500 mb-4">Welches Projekt deckt welche LP21-Kompetenzen ab?</p>

      <UCard class="mb-4">
        <div class="overflow-x-auto">
          <table class="w-full text-xs">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-700">
                <th class="text-left py-2 pr-3 font-medium text-gray-500 min-w-[160px] sticky left-0 bg-white dark:bg-gray-900">Projekt</th>
                <th
                  v-for="code in matrixCodes"
                  :key="code"
                  class="text-center py-2 px-1.5 font-medium text-gray-500 min-w-[60px]"
                >
                  <div class="writing-mode-vertical-lr rotate-180" style="writing-mode: vertical-lr; transform: rotate(180deg);">
                    {{ code }}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="proj in matrixProjects"
                :key="proj.id"
                class="border-b border-gray-100 dark:border-gray-800"
              >
                <td class="py-2 pr-3 font-medium text-gray-700 dark:text-gray-300 sticky left-0 bg-white dark:bg-gray-900">
                  {{ proj.name }}
                </td>
                <td
                  v-for="code in matrixCodes"
                  :key="code"
                  class="text-center py-2 px-1.5"
                >
                  <button
                    :class="[
                      'w-8 h-8 rounded-md text-[10px] font-bold transition-all',
                      getMatrixCell(proj.id, code).status === 'completed'
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : getMatrixCell(proj.id, code).status === 'planned'
                          ? 'bg-amber-400 text-white hover:bg-amber-500'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600',
                      selectedMatrixCell?.projectId === proj.id && selectedMatrixCell?.code === code
                        ? 'ring-2 ring-green-400 ring-offset-1'
                        : '',
                    ]"
                    @click="clickMatrixCell(proj.id, code)"
                  >
                    <template v-if="getMatrixCell(proj.id, code).taskCount > 0">
                      {{ getMatrixCell(proj.id, code).taskCount }}
                    </template>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Legend -->
        <div class="flex items-center gap-4 mt-4 text-xs text-gray-500">
          <div class="flex items-center gap-1.5">
            <div class="w-4 h-4 rounded bg-green-500" />
            <span>Erledigt</span>
          </div>
          <div class="flex items-center gap-1.5">
            <div class="w-4 h-4 rounded bg-amber-400" />
            <span>Geplant</span>
          </div>
          <div class="flex items-center gap-1.5">
            <div class="w-4 h-4 rounded bg-gray-100 dark:bg-gray-800" />
            <span>Nicht abgedeckt</span>
          </div>
          <span class="text-gray-400">Zahl = Anzahl Tasks</span>
        </div>
      </UCard>

      <!-- Drill-down panel -->
      <UCard v-if="selectedMatrixCell && matrixDrilldownTasks.length > 0">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold text-sm">
            {{ selectedMatrixCell.code }} — {{ matrixProjects.find(p => p.id === selectedMatrixCell!.projectId)?.name }}
          </h3>
          <UButton size="sm" variant="ghost" @click="selectedMatrixCell = null">Schliessen</UButton>
        </div>
        <div class="space-y-2">
          <div
            v-for="entry in matrixDrilldownTasks"
            :key="entry.task.id"
            class="flex items-center gap-3 rounded-lg border border-gray-100 p-2.5 dark:border-gray-800"
          >
            <input
              type="checkbox"
              class="h-3.5 w-3.5 rounded border-gray-300 text-green-600"
              :checked="entry.task.status === 'Erledigt'"
              disabled
            />
            <div class="flex-1 min-w-0">
              <span :class="['text-sm', entry.task.status === 'Erledigt' ? 'line-through text-gray-400' : '']">
                {{ entry.task.title }}
              </span>
              <span class="text-xs text-gray-400 ml-2">({{ entry.topic.name }})</span>
            </div>
            <span v-if="entry.task.groupName" class="text-xs text-gray-400">{{ entry.task.groupName }}</span>
          </div>
        </div>
        <div v-if="matrixDrilldownTasks.some(e => e.materials.length > 0)" class="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
          <h4 class="text-xs font-medium text-gray-500 mb-2">Verknüpfte Materialien</h4>
          <div class="flex flex-wrap gap-1.5">
            <UBadge
              v-for="mat in [...new Set(matrixDrilldownTasks.flatMap(e => e.materials))]"
              :key="mat.id"
              color="neutral"
              variant="subtle"
              size="sm"
            >
              {{ mat.title }}
            </UBadge>
          </div>
        </div>
      </UCard>
    </div>

    <!-- ============================================ -->
    <!-- Tab: Nach Fachbereich (verbessert)           -->
    <!-- ============================================ -->
    <div v-if="activeTab === 'subject'" class="space-y-6">
      <UCard v-for="cur in curriculumStore.curriculumData" :key="cur.id">
        <div class="mb-3">
          <div class="flex items-center justify-between mb-1">
            <h3 class="font-semibold">
              {{ cur.shortName }} – {{ cur.subject }}
            </h3>
            <span class="text-sm font-semibold text-green-600">
              {{ Math.round((cur.topics.filter(t => curriculumStore.isTopicEffectivelyTreated(t)).length / cur.topics.length) * 100) }}%
            </span>
          </div>
          <ProgressBar
            :value="Math.round((cur.topics.filter(t => curriculumStore.isTopicEffectivelyTreated(t)).length / cur.topics.length) * 100)"
            :show-label="false"
            size="sm"
          />
        </div>
        <div class="space-y-3">
          <div
            v-for="topic in cur.topics"
            :key="topic.id"
            :class="[
              'rounded-lg border p-3 transition-colors',
              curriculumStore.isTopicEffectivelyTreated(topic)
                ? 'border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20'
                : curriculumStore.tasksByCurriculumCode.has(topic.code)
                  ? 'border-blue-200 bg-blue-50/30 dark:border-blue-900 dark:bg-blue-950/20'
                  : 'border-gray-100 dark:border-gray-800',
            ]"
          >
            <!-- Topic header (clickable for drill-down) -->
            <button
              class="w-full flex items-start gap-3 text-left"
              @click="toggleTopicDetail(topic.code)"
            >
              <input
                type="checkbox"
                :checked="curriculumStore.isTopicEffectivelyTreated(topic)"
                disabled
                class="mt-0.5 h-4 w-4 rounded text-green-600"
              />
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="text-sm font-medium">{{ topic.code }}</span>
                  <span class="text-sm">{{ topic.title }}</span>
                  <UBadge
                    :color="getTopicStatus(topic).color"
                    variant="subtle"
                    size="sm"
                  >
                    {{ getTopicStatus(topic).label }}
                  </UBadge>
                </div>
                <div v-if="curriculumStore.isTopicEffectivelyTreated(topic)" class="mt-1 text-xs text-gray-500">
                  <span v-if="topic.treatedByDownload">Download: {{ topic.treatedByDownload }}</span>
                  <span v-if="topic.treatedDate">{{ topic.treatedByDownload ? ' | ' : '' }}{{ formatDate(topic.treatedDate) }}</span>
                  <span v-if="topic.treatedByProject"> | Projekt: {{ topic.treatedByProject }}</span>
                </div>
                <div v-else-if="curriculumStore.tasksByCurriculumCode.has(topic.code)" class="mt-1 text-xs text-blue-600 dark:text-blue-400">
                  {{ curriculumStore.tasksByCurriculumCode.get(topic.code)!.length }} Tasks geplant
                </div>
              </div>
              <span :class="['text-xs text-gray-400 transition-transform', expandedTopicCode === topic.code ? 'rotate-90' : '']">
                ▸
              </span>
            </button>

            <!-- Drill-down: Tasks per project -->
            <div
              v-if="expandedTopicCode === topic.code && curriculumStore.tasksByCurriculumCode.has(topic.code)"
              class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700"
            >
              <!-- Group entries by project -->
              <div
                v-for="[projName, entries] in Object.entries(
                  curriculumStore.tasksByCurriculumCode.get(topic.code)!.reduce<Record<string, TaskWithContext[]>>((acc, e) => {
                    const key = e.project.name
                    if (!acc[key]) acc[key] = []
                    acc[key]!.push(e)
                    return acc
                  }, {})
                )"
                :key="projName"
                class="mb-3 last:mb-0"
              >
                <h4 class="text-xs font-semibold text-gray-500 mb-1.5">Projekt: {{ projName }}</h4>
                <div class="space-y-1 ml-2">
                  <div
                    v-for="entry in entries"
                    :key="entry.task.id"
                    class="flex items-center gap-2 text-xs"
                  >
                    <input
                      type="checkbox"
                      :checked="entry.task.status === 'Erledigt'"
                      disabled
                      class="h-3 w-3 rounded text-green-600"
                    />
                    <span :class="entry.task.status === 'Erledigt' ? 'line-through text-gray-400' : 'text-gray-600 dark:text-gray-400'">
                      {{ entry.task.title }}
                    </span>
                    <span class="text-gray-300">·</span>
                    <span class="text-gray-400">{{ entry.topic.name }}</span>
                    <span v-if="entry.task.groupName" class="text-gray-400">· {{ entry.task.groupName }}</span>
                  </div>
                </div>
                <!-- Materials for this project/code combo -->
                <div v-if="entries.some(e => e.materials.length > 0)" class="mt-1.5 ml-2 flex flex-wrap gap-1">
                  <span class="text-[10px] text-gray-400">Materialien:</span>
                  <UBadge
                    v-for="mat in [...new Map(entries.flatMap(e => e.materials).map(m => [m.id, m])).values()]"
                    :key="mat.id"
                    color="neutral"
                    variant="subtle"
                    size="sm"
                  >
                    {{ mat.title }}
                  </UBadge>
                </div>
              </div>
            </div>

            <!-- No tasks at all -->
            <div
              v-if="expandedTopicCode === topic.code && !curriculumStore.tasksByCurriculumCode.has(topic.code) && !curriculumStore.isTopicEffectivelyTreated(topic)"
              class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700"
            >
              <p class="text-xs text-gray-400 italic">Kein Projekt deckt dieses Ziel ab.</p>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- ============================================ -->
    <!-- Tab: Zeitverlauf (verbessert)                -->
    <!-- ============================================ -->
    <div v-if="activeTab === 'timeline'">
      <!-- Timeline chart (simple bar) -->
      <UCard v-if="timelineMonths.length > 0" class="mb-6">
        <h3 class="font-semibold mb-3">Kumulativer Fortschritt</h3>
        <div class="flex items-end gap-1 h-32">
          <div
            v-for="entry in timelineMonths"
            :key="`${entry.year}-${entry.month}`"
            class="flex-1 flex flex-col items-center justify-end"
          >
            <span class="text-[10px] font-bold text-green-700 dark:text-green-400 mb-1">
              {{ entry.cumulativeCount }}
            </span>
            <div
              class="w-full bg-green-500 rounded-t transition-all"
              :style="{ height: `${(entry.cumulativeCount / curriculumStore.filteredProgress.totalTopics) * 100}%` }"
            />
            <span class="text-[10px] text-gray-400 mt-1">
              {{ monthLabels[entry.month]?.slice(0, 3) }}
            </span>
          </div>
        </div>
      </UCard>

      <!-- Monthly entries -->
      <div class="space-y-4">
        <UCard v-for="entry in timelineMonths" :key="`${entry.year}-${entry.month}`">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold text-sm">{{ entry.label }}</h3>
            <div class="flex items-center gap-2">
              <UBadge color="green" variant="subtle" size="sm">+{{ entry.topics.length }} Ziele</UBadge>
              <span class="text-xs text-gray-400">
                Gesamt: {{ entry.cumulativeCount }}/{{ curriculumStore.filteredProgress.totalTopics }}
                ({{ Math.round((entry.cumulativeCount / curriculumStore.filteredProgress.totalTopics) * 100) }}%)
              </span>
            </div>
          </div>
          <div class="space-y-2">
            <div
              v-for="topic in entry.topics"
              :key="topic.code"
              class="flex items-center gap-3 text-sm"
            >
              <span class="text-xs text-gray-400 tabular-nums min-w-[70px]">{{ formatDate(topic.date) }}</span>
              <UBadge color="primary" variant="subtle" size="sm">{{ topic.code }}</UBadge>
              <span>{{ topic.title }}</span>
              <span v-if="topic.project" class="text-xs text-gray-400 ml-auto">{{ topic.project }}</span>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Planned goals -->
      <UCard v-if="plannedGoals.length > 0" class="mt-6">
        <h3 class="font-semibold text-sm mb-3">Geplant (noch offen)</h3>
        <p class="text-xs text-gray-500 mb-3">{{ plannedGoals.length }} Ziele werden durch geplante Aufgaben abgedeckt</p>
        <div class="space-y-2">
          <div
            v-for="goal in plannedGoals"
            :key="goal.code"
            class="flex items-center gap-3 rounded-lg border border-dashed border-gray-200 p-2.5 dark:border-gray-700"
          >
            <UBadge color="primary" variant="subtle" size="sm">{{ goal.code }}</UBadge>
            <span class="text-sm">{{ goal.title }}</span>
            <span v-if="goal.nextTask" class="text-xs text-gray-400 ml-auto">
              Nächste: {{ goal.nextTask }}
              <span v-if="goal.nextDueDate"> ({{ formatDate(goal.nextDueDate) }})</span>
            </span>
          </div>
        </div>
      </UCard>

      <div v-if="timelineMonths.length === 0" class="py-12 text-center text-gray-400 text-sm">
        Noch keine LP21-Ziele abgeschlossen.
      </div>
    </div>

    <!-- ============================================ -->
    <!-- Tab: Export                                   -->
    <!-- ============================================ -->
    <div v-if="activeTab === 'export'">
      <UCard class="max-w-lg">
        <h3 class="text-lg font-semibold mb-4">LP21-Bericht exportieren</h3>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Klasse</label>
            <p class="text-sm text-gray-500">{{ teacherStore.activeClass.name }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Schuljahr</label>
            <p class="text-sm text-gray-500">{{ teacherStore.activeClass.schoolYear }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Zeitraum</label>
            <USelect v-model="exportPeriod" :items="periodOptions" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Inhalt</label>
            <div class="space-y-2">
              <label class="flex items-center gap-2 text-sm">
                <input v-model="exportContent.totalProgress" type="checkbox" class="text-green-600 rounded" />
                Gesamtfortschritt
              </label>
              <label class="flex items-center gap-2 text-sm">
                <input v-model="exportContent.bySubject" type="checkbox" class="text-green-600 rounded" />
                Aufschlüsselung nach Fachbereich
              </label>
              <label class="flex items-center gap-2 text-sm">
                <input v-model="exportContent.treatedTopics" type="checkbox" class="text-green-600 rounded" />
                Behandelte Lernziele mit Datum
              </label>
              <label class="flex items-center gap-2 text-sm">
                <input v-model="exportContent.linkedProjects" type="checkbox" class="text-green-600 rounded" />
                Verknüpfte Projekte
              </label>
              <label class="flex items-center gap-2 text-sm">
                <input v-model="exportContent.radarChart" type="checkbox" class="text-green-600 rounded" />
                Fachbereich-Balance (Radar-Chart)
              </label>
              <label class="flex items-center gap-2 text-sm">
                <input v-model="exportContent.heatmap" type="checkbox" class="text-green-600 rounded" />
                Zeitliche Abdeckung (Heatmap)
              </label>
              <label class="flex items-center gap-2 text-sm">
                <input v-model="exportContent.downloadHistory" type="checkbox" class="text-green-600 rounded" />
                Download-Historie
              </label>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Format</label>
            <USelect v-model="exportFormat" :items="formatOptions" />
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <UButton variant="ghost" @click="activeTab = 'dashboard'">Abbrechen</UButton>
          <UButton color="primary" disabled>Exportieren</UButton>
        </div>
      </UCard>
    </div>

    <!-- Old export modal removed — export is now a tab -->
  </div>
</template>
