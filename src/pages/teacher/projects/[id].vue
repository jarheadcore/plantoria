<script setup lang="ts">
import { useProjectsStore } from '@/stores/projects'
import { useStudentsStore } from '@/stores/students'
import type { ProjectStatus, ProjectPhase, Topic, VegetableProfile } from '@/types'

definePageMeta({ layout: 'teacher' })

const route = useRoute()
const projectsStore = useProjectsStore()
const studentsStore = useStudentsStore()

const projectId = route.params.id as string
const project = computed(() => projectsStore.getProjectById(projectId))
const topics = computed(() => projectsStore.getTopicsByProjectId(projectId).sort((a, b) => a.order - b.order))
const cultures = computed(() => projectsStore.getCulturesByProjectId(projectId))
const groups = computed(() => projectsStore.getGroupsByProjectId(projectId))
const preProject = computed(() => projectsStore.getPreProjectByProjectId(projectId))

const activeTab = ref('topics')
const openTopicId = ref<string | null>(null)
const selectedVegetable = ref<VegetableProfile | null>(null)
const showVegetableModal = ref(false)

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

// Timeline / Gantt
const months = ['Jan', 'Feb', 'Mrz', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
const currentMonth = new Date().getMonth() // 0-indexed
const todayFraction = computed(() => {
  const now = new Date()
  const dayOfMonth = now.getDate()
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  return (currentMonth + dayOfMonth / daysInMonth) / 12
})

// Topics grouped by phase for accordion
const phases: { key: ProjectPhase; label: string; color: string }[] = [
  { key: 'Planung', label: 'Planung', color: 'bg-blue-400' },
  { key: 'Pflanzung', label: 'Pflanzung', color: 'bg-green-400' },
  { key: 'Pflege', label: 'Pflege', color: 'bg-amber-400' },
  { key: 'Ernte', label: 'Ernte', color: 'bg-orange-400' },
  { key: 'Verarbeitung', label: 'Verarbeitung', color: 'bg-red-300' },
  { key: 'Vermarktung', label: 'Vermarktung', color: 'bg-purple-400' },
]

const topicsByPhase = computed(() => {
  const result: Record<string, Topic[]> = {}
  for (const phase of phases) {
    result[phase.key] = topics.value.filter((t) => t.phase === phase.key)
  }
  return result
})

// Monthly detail cards
const monthTopics = computed(() => {
  return months.map((name, idx) => {
    const monthNum = idx + 1
    const active = topics.value.filter(
      (t) => monthNum >= t.startMonth && monthNum <= t.endMonth
    )
    return { name, monthNum, active }
  })
})

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

function cultureStatusColor(status: string): 'green' | 'primary' | 'neutral' {
  switch (status) {
    case 'Wächst': return 'green'
    case 'Gesät': return 'primary'
    case 'Erntereif': return 'green'
    case 'Geerntet': return 'neutral'
    default: return 'neutral'
  }
}

function cultureEmoji(plantName: string): string {
  if (plantName.includes('Rübli') || plantName.includes('Karotten')) return '🥕'
  if (plantName.includes('Kohl')) return '🥬'
  if (plantName.includes('Tomat')) return '🍅'
  if (plantName.includes('Paprika') || plantName.includes('Chili')) return '🌶'
  if (plantName.includes('Broccoli') || plantName.includes('Blumenkohl')) return '🥦'
  if (plantName.includes('Kräuter')) return '🌿'
  return '🌱'
}

function monthLabel(m: number): string {
  const item = months[m - 1]
  return item ?? ''
}

function toggleTopic(id: string) {
  openTopicId.value = openTopicId.value === id ? null : id
}

function scrollToTopic(topicId: string) {
  activeTab.value = 'topics'
  openTopicId.value = topicId
  nextTick(() => {
    const el = document.getElementById(`topic-${topicId}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  })
}

function openVegetableProfile(vegetableProfileId: string | undefined) {
  if (!vegetableProfileId) return
  const veg = projectsStore.getVegetableById(vegetableProfileId)
  if (veg) {
    selectedVegetable.value = veg
    showVegetableModal.value = true
  }
}

function difficultyColor(d: string): 'green' | 'primary' | 'neutral' {
  if (d === 'Einfach') return 'green'
  if (d === 'Mittel') return 'primary'
  return 'neutral'
}

function getTopicTasks(topicId: string) {
  return projectsStore.getTasksByTopicId(topicId)
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
        <span v-if="project.location" class="text-sm text-gray-500">
          {{ project.location }}
        </span>
      </div>
      <ProgressBar :value="project.progress" />
    </div>

    <!-- ============================================ -->
    <!-- HERO: Gantt-Chart Zeitstrahl                 -->
    <!-- ============================================ -->
    <UCard class="mb-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Zeitstrahl</h2>

      <!-- Gantt Chart -->
      <div class="overflow-x-auto">
        <div class="min-w-[800px]">
          <!-- Month headers -->
          <div class="flex mb-1">
            <div class="w-40 shrink-0" />
            <div
              v-for="(m, i) in months"
              :key="i"
              :class="[
                'flex-1 text-center text-xs',
                i === currentMonth ? 'font-bold text-green-600' : 'text-gray-400',
              ]"
            >
              {{ m }}
            </div>
          </div>

          <!-- Topic bars -->
          <div class="relative">
            <div
              v-for="topic in topics"
              :key="topic.id"
              class="flex items-center mb-1 group cursor-pointer"
              @click="scrollToTopic(topic.id)"
            >
              <div class="w-40 shrink-0 text-xs text-gray-600 dark:text-gray-400 truncate pr-2 flex items-center gap-1">
                <span>{{ topic.icon }}</span>
                <span>{{ topic.name }}</span>
              </div>
              <div class="flex-1 relative h-6">
                <div
                  :class="[topic.color, 'absolute top-0.5 bottom-0.5 rounded opacity-80 group-hover:opacity-100 transition-opacity']"
                  :style="{
                    left: `${((topic.startMonth - 1) / 12) * 100}%`,
                    width: `${((topic.endMonth - topic.startMonth + 1) / 12) * 100}%`,
                  }"
                >
                  <span class="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-white drop-shadow truncate px-1">
                    {{ monthLabel(topic.startMonth) }}–{{ monthLabel(topic.endMonth) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Today marker (overlaid on the bars area) -->
            <div
              class="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10 pointer-events-none"
              :style="{ left: `calc(10rem + ${todayFraction * 100}% * (1 - 10rem / 100%))` }"
            />
          </div>

          <!-- Today marker label -->
          <div class="flex mt-1">
            <div class="w-40 shrink-0" />
            <div class="flex-1 relative">
              <div
                class="absolute text-[10px] text-red-500 font-bold -translate-x-1/2"
                :style="{ left: `${todayFraction * 100}%` }"
              >
                Heute
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Monthly detail cards -->
      <div class="mt-8">
        <h3 class="text-sm font-semibold text-gray-500 mb-3">Monatsübersicht</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div
            v-for="month in monthTopics"
            :key="month.monthNum"
            :class="[
              'rounded-lg border p-3',
              month.monthNum === currentMonth + 1
                ? 'border-green-500 ring-2 ring-green-200 dark:ring-green-800'
                : 'border-gray-200 dark:border-gray-700',
            ]"
          >
            <h4 :class="['text-sm font-semibold mb-2', month.monthNum === currentMonth + 1 ? 'text-green-700 dark:text-green-400' : 'text-gray-700 dark:text-gray-300']">
              {{ month.name }}
            </h4>
            <div v-if="month.active.length > 0" class="space-y-1">
              <div
                v-for="t in month.active"
                :key="t.id"
                class="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400"
              >
                <span>{{ t.icon }}</span>
                <span>{{ t.name }}</span>
              </div>
            </div>
            <div v-else class="text-xs text-gray-400 flex items-center gap-1">
              <span>🌙</span>
              <span>Ruhephase</span>
            </div>
          </div>
        </div>
      </div>
    </UCard>

    <!-- ============================================ -->
    <!-- TABS                                         -->
    <!-- ============================================ -->
    <div class="mb-6 flex flex-wrap gap-1 border-b border-gray-200 dark:border-gray-800">
      <button
        v-for="tab in [
          { key: 'topics', label: 'Fachbereiche' },
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

    <!-- ============================================ -->
    <!-- Tab: Fachbereiche (Accordion by Phase)       -->
    <!-- ============================================ -->
    <div v-if="activeTab === 'topics'">
      <div class="space-y-4">
        <div v-for="phase in phases" :key="phase.key">
          <div
            v-if="topicsByPhase[phase.key]?.length"
            class="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <!-- Phase header -->
            <div :class="['px-4 py-2 text-xs font-bold uppercase tracking-wider text-white', phase.color]">
              {{ phase.label }}
            </div>

            <!-- Topics in this phase -->
            <div class="divide-y divide-gray-100 dark:divide-gray-800">
              <div
                v-for="topic in topicsByPhase[phase.key]"
                :key="topic.id"
                :id="`topic-${topic.id}`"
              >
                <!-- Topic header (click to expand) -->
                <button
                  class="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  @click="toggleTopic(topic.id)"
                >
                  <div class="flex items-center gap-2">
                    <span class="text-lg">{{ topic.icon }}</span>
                    <span class="text-sm font-medium text-gray-900 dark:text-white">{{ topic.name }}</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="text-xs text-gray-400">{{ monthLabel(topic.startMonth) }}–{{ monthLabel(topic.endMonth) }}</span>
                    <span class="text-xs text-gray-400">{{ getTopicTasks(topic.id).length }} Aufgaben</span>
                    <span :class="['text-xs transition-transform', openTopicId === topic.id ? 'rotate-90' : '']">
                      ▸
                    </span>
                  </div>
                </button>

                <!-- Expanded topic detail -->
                <div v-if="openTopicId === topic.id" class="px-4 pb-4 bg-gray-50/50 dark:bg-gray-800/30">
                  <!-- Goal -->
                  <div class="mb-4">
                    <h4 class="text-xs font-semibold text-gray-500 uppercase mb-1">Ziel</h4>
                    <p class="text-sm text-gray-700 dark:text-gray-300">{{ topic.goalDescription }}</p>
                  </div>

                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <!-- Tasks -->
                    <div>
                      <div class="flex items-center justify-between mb-2">
                        <h4 class="text-xs font-semibold text-gray-500 uppercase">Aufgaben</h4>
                        <UButton
                          v-if="topic.tutorialVideoUrl"
                          size="xs"
                          variant="soft"
                          color="primary"
                          disabled
                        >
                          ▶ Video
                        </UButton>
                      </div>
                      <div v-if="getTopicTasks(topic.id).length > 0" class="space-y-1.5">
                        <div
                          v-for="task in getTopicTasks(topic.id)"
                          :key="task.id"
                          class="flex items-center gap-2 text-sm"
                        >
                          <input
                            type="checkbox"
                            class="h-3.5 w-3.5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                            :checked="task.status === 'Erledigt'"
                            @change="projectsStore.toggleTask(task.id)"
                          />
                          <span :class="[task.status === 'Erledigt' ? 'line-through text-gray-400' : 'text-gray-600 dark:text-gray-400']">
                            {{ task.title }}
                          </span>
                          <UBadge v-if="task.isHolidayTask" color="neutral" variant="subtle" size="xs">Ferien</UBadge>
                        </div>
                      </div>
                      <p v-else class="text-xs text-gray-400 italic">Keine Aufgaben zugewiesen</p>
                    </div>

                    <!-- Physical Materials -->
                    <div>
                      <h4 class="text-xs font-semibold text-gray-500 uppercase mb-2">Material</h4>
                      <div class="overflow-x-auto">
                        <table class="w-full text-xs">
                          <thead>
                            <tr class="border-b border-gray-200 dark:border-gray-700">
                              <th class="text-left py-1 pr-2 font-medium text-gray-500">Material</th>
                              <th class="text-left py-1 pr-2 font-medium text-gray-500">Menge</th>
                              <th class="text-left py-1 font-medium text-gray-500">Quelle</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              v-for="(mat, idx) in topic.physicalMaterials"
                              :key="idx"
                              class="border-b border-gray-100 dark:border-gray-800 last:border-0"
                            >
                              <td class="py-1.5 pr-2 text-gray-700 dark:text-gray-300">{{ mat.name }}</td>
                              <td class="py-1.5 pr-2 text-gray-500">{{ mat.quantity }}</td>
                              <td class="py-1.5 text-gray-500">{{ mat.source }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <!-- LP21 References -->
                  <div v-if="topic.lp21Refs.length > 0" class="mt-3 flex items-center gap-2">
                    <span class="text-xs text-gray-400">LP21:</span>
                    <UBadge
                      v-for="lp21Ref in topic.lp21Refs"
                      :key="lp21Ref"
                      color="neutral"
                      variant="subtle"
                      size="xs"
                    >
                      {{ lp21Ref }}
                    </UBadge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- Tab: Kulturen (Grid + Steckbrief Modal)      -->
    <!-- ============================================ -->
    <div v-if="activeTab === 'cultures'">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <UCard
          v-for="culture in cultures"
          :key="culture.id"
          class="cursor-pointer hover:ring-2 hover:ring-green-200 transition-shadow"
          @click="openVegetableProfile(culture.vegetableProfileId)"
        >
          <div class="text-center">
            <div class="mb-2 text-4xl">{{ cultureEmoji(culture.plantName) }}</div>
            <h3 class="font-semibold text-gray-900 dark:text-white">{{ culture.plantName }}</h3>
            <p class="text-xs text-gray-500 mb-2">{{ culture.bedNumber }}</p>
            <UBadge :color="cultureStatusColor(culture.status)" variant="subtle" size="xs" class="mb-3">
              {{ culture.status }}
            </UBadge>
            <ProgressBar :value="culture.progress" size="sm" />
            <p v-if="culture.vegetableProfileId" class="mt-2 text-xs text-green-600 dark:text-green-400">
              Steckbrief ansehen →
            </p>
          </div>
        </UCard>
      </div>

      <!-- Vegetable Profile Modal -->
      <UModal v-model:open="showVegetableModal">
        <template #content>
          <div v-if="selectedVegetable" class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                  {{ selectedVegetable.name }}
                </h2>
                <p v-if="selectedVegetable.scientificName" class="text-sm text-gray-500 italic">
                  {{ selectedVegetable.scientificName }}
                </p>
              </div>
              <UBadge :color="difficultyColor(selectedVegetable.difficulty)" variant="subtle">
                {{ selectedVegetable.difficulty }}
              </UBadge>
            </div>

            <!-- Anbauzeiten -->
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div v-if="selectedVegetable.sowingIndoor" class="text-sm">
                <span class="text-gray-500">Aussaat Indoor:</span>
                <span class="ml-1 font-medium">{{ monthLabel(selectedVegetable.sowingIndoor.startMonth) }}–{{ monthLabel(selectedVegetable.sowingIndoor.endMonth) }}</span>
              </div>
              <div v-if="selectedVegetable.sowingOutdoor" class="text-sm">
                <span class="text-gray-500">Aussaat Outdoor:</span>
                <span class="ml-1 font-medium">{{ monthLabel(selectedVegetable.sowingOutdoor.startMonth) }}–{{ monthLabel(selectedVegetable.sowingOutdoor.endMonth) }}</span>
              </div>
              <div class="text-sm">
                <span class="text-gray-500">Ernte:</span>
                <span class="ml-1 font-medium">{{ monthLabel(selectedVegetable.harvestPeriod.startMonth) }}–{{ monthLabel(selectedVegetable.harvestPeriod.endMonth) }}</span>
              </div>
            </div>

            <!-- Pflanzinfos -->
            <div class="grid grid-cols-2 gap-3 mb-4 text-sm">
              <div>
                <span class="text-gray-500">Abstand:</span>
                <span class="ml-1">{{ selectedVegetable.spacing.inRow }}cm / {{ selectedVegetable.spacing.betweenRows }}cm</span>
              </div>
              <div>
                <span class="text-gray-500">Saattiefe:</span>
                <span class="ml-1">{{ selectedVegetable.depth }}cm</span>
              </div>
              <div>
                <span class="text-gray-500">Keimung:</span>
                <span class="ml-1">{{ selectedVegetable.germination.tempMin }}–{{ selectedVegetable.germination.tempMax }}°C, {{ selectedVegetable.germination.days }} Tage</span>
              </div>
              <div>
                <span class="text-gray-500">Wasser:</span>
                <span class="ml-1">{{ selectedVegetable.waterNeed }}</span>
              </div>
              <div>
                <span class="text-gray-500">Nährstoffe:</span>
                <span class="ml-1">{{ selectedVegetable.nutrientNeed }}</span>
              </div>
            </div>

            <!-- Pflanzpartner -->
            <div class="mb-3">
              <h4 class="text-xs font-semibold text-gray-500 uppercase mb-1">Gute Nachbarn</h4>
              <div class="flex flex-wrap gap-1">
                <UBadge
                  v-for="c in selectedVegetable.companions"
                  :key="c"
                  color="green"
                  variant="subtle"
                  size="xs"
                >
                  {{ c }}
                </UBadge>
              </div>
            </div>
            <div v-if="selectedVegetable.antagonists.length > 0" class="mb-3">
              <h4 class="text-xs font-semibold text-gray-500 uppercase mb-1">Schlechte Nachbarn</h4>
              <div class="flex flex-wrap gap-1">
                <UBadge
                  v-for="a in selectedVegetable.antagonists"
                  :key="a"
                  color="neutral"
                  variant="subtle"
                  size="xs"
                >
                  {{ a }}
                </UBadge>
              </div>
            </div>

            <!-- Special notes -->
            <div v-if="selectedVegetable.specialNotes" class="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <p class="text-sm text-amber-800 dark:text-amber-200">
                {{ selectedVegetable.specialNotes }}
              </p>
            </div>

            <div class="mt-4 flex justify-end">
              <UButton variant="soft" @click="showVegetableModal = false">Schliessen</UButton>
            </div>
          </div>
        </template>
      </UModal>
    </div>

    <!-- ============================================ -->
    <!-- Tab: Gruppen                                 -->
    <!-- ============================================ -->
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
    </div>

    <!-- ============================================ -->
    <!-- Tab: Vorprojekt                              -->
    <!-- ============================================ -->
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
