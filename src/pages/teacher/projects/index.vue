<script setup lang="ts">
import { useProjectsStore } from '@/stores/projects'
import { Plus, Search } from 'lucide-vue-next'

definePageMeta({ layout: 'teacher' })

const projectsStore = useProjectsStore()

const statusFilter = ref('all')
const phaseFilter = ref('all')
const searchQuery = ref('')

const statusOptions = [
  { label: 'Alle Status', value: 'all' },
  { label: 'Vorprojekt', value: 'Vorprojekt' },
  { label: 'Projektstart', value: 'Projektstart' },
  { label: 'Laufend', value: 'Laufend' },
  { label: 'Abgeschlossen', value: 'Abgeschlossen' },
]

const phaseOptions = [
  { label: 'Alle Phasen', value: 'all' },
  { label: 'Vorprojekt', value: 'Vorprojekt' },
  { label: 'Planung', value: 'Planung' },
  { label: 'Pflanzung', value: 'Pflanzung' },
  { label: 'Pflege', value: 'Pflege' },
  { label: 'Ernte', value: 'Ernte' },
  { label: 'Verarbeitung', value: 'Verarbeitung' },
  { label: 'Vermarktung', value: 'Vermarktung' },
]

const filteredProjects = computed(() => {
  return projectsStore.projects.filter((p) => {
    if (statusFilter.value !== 'all' && p.status !== statusFilter.value) return false
    if (phaseFilter.value !== 'all' && p.currentPhase !== phaseFilter.value) return false
    if (searchQuery.value) {
      return p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    }
    return true
  })
})

function statusColor(status: string) {
  switch (status) {
    case 'Laufend': return 'green' as const
    case 'Vorprojekt': return 'neutral' as const
    case 'Projektstart': return 'primary' as const
    case 'Abgeschlossen': return 'neutral' as const
    default: return 'neutral' as const
  }
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Projekte</h1>
        <p class="text-sm text-gray-500 mt-1">Verwalte deine Schulgarten-Projekte</p>
      </div>
      <UButton color="primary" :to="'/teacher/projects/new'">
        <Plus :size="16" class="mr-1" />
        Neues Projekt
      </UButton>
    </div>

    <!-- Filters -->
    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
      <USelect v-model="statusFilter" :items="statusOptions" class="w-full sm:w-44" />
      <USelect v-model="phaseFilter" :items="phaseOptions" class="w-full sm:w-44" />
      <UInput
        v-model="searchQuery"
        placeholder="Suche..."
        :ui="{ leading: 'pointer-events-none' }"
        class="w-full sm:w-64"
      >
        <template #leading>
          <Search :size="16" class="text-gray-400" />
        </template>
      </UInput>
    </div>

    <!-- Project cards -->
    <div class="space-y-4">
      <NuxtLink
        v-for="project in filteredProjects"
        :key="project.id"
        :to="`/teacher/projects/${project.id}`"
        class="block"
      >
        <UCard class="hover:ring-2 hover:ring-green-200 dark:hover:ring-green-900 transition-all">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <h3 class="text-lg font-semibold">{{ project.name }}</h3>
                <UBadge :color="statusColor(project.status)" variant="subtle" size="xs">
                  {{ project.status }}
                </UBadge>
              </div>
              <p class="text-sm text-gray-500 mb-3">{{ project.description }}</p>
              <div class="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500">
                <span>Phase: <strong>{{ project.currentPhase }}</strong></span>
                <span v-if="project.area">Fläche: <strong>{{ project.area }}m²</strong></span>
                <span>Aufgaben: <strong>{{ project.tasksDone }}/{{ project.taskCount }}</strong></span>
                <span v-if="project.groupCount">Gruppen: <strong>{{ project.groupCount }}</strong></span>
              </div>
            </div>
          </div>
          <div class="mt-4">
            <ProgressBar :value="project.progress" />
          </div>
        </UCard>
      </NuxtLink>

      <EmptyState
        v-if="filteredProjects.length === 0"
        title="Keine Projekte gefunden"
        description="Erstelle dein erstes Gartenprojekt aus einem Template!"
        action-label="Erstes Projekt erstellen"
        action-to="/teacher/projects/new"
      />
    </div>
  </div>
</template>
