<script setup lang="ts">
import { useTemplatesStore } from '@/stores/templates'
import { Plus } from 'lucide-vue-next'
import type { ProjectTemplate } from '@/types'

definePageMeta({ layout: 'teacher' })

const templatesStore = useTemplatesStore()

const activeTab = ref<'own' | 'shared' | 'platform'>('own')
const filterCategory = ref('all')
const filterGrade = ref('all')
const filterDifficulty = ref('all')

const categoryOptions = [
  { label: 'Alle Kategorien', value: 'all' },
  { label: 'Gemüse', value: 'Gemüse' },
  { label: 'Hochbeet', value: 'Hochbeet' },
  { label: 'Bienen', value: 'Bienen' },
  { label: 'Ökologie', value: 'Ökologie' },
  { label: 'Garten', value: 'Garten' },
]

const gradeOptions = [
  { label: 'Alle Stufen', value: 'all' },
  { label: '1-4', value: '1-4' },
  { label: '3-6', value: '3-6' },
  { label: '4-6', value: '4-6' },
]

const difficultyOptions = [
  { label: 'Alle', value: 'all' },
  { label: 'Einfach', value: 'Einfach' },
  { label: 'Mittel', value: 'Mittel' },
  { label: 'Schwer', value: 'Schwer' },
]

const currentTemplates = computed(() => {
  let list: ProjectTemplate[] = []
  switch (activeTab.value) {
    case 'own': list = templatesStore.ownTemplates; break
    case 'shared': list = templatesStore.sharedTemplates; break
    case 'platform': list = templatesStore.platformTemplates; break
  }
  return list.filter((t) => {
    if (filterCategory.value !== 'all' && t.category !== filterCategory.value) return false
    if (filterGrade.value !== 'all' && t.gradeRange !== filterGrade.value) return false
    if (filterDifficulty.value !== 'all' && t.difficulty !== filterDifficulty.value) return false
    return true
  })
})

function difficultyColor(d: string) {
  switch (d) {
    case 'Einfach': return 'success'
    case 'Mittel': return 'warning'
    case 'Schwer': return 'error'
    default: return 'neutral'
  }
}
</script>

<template>
  <div>
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Templates</h1>
        <p class="text-sm text-gray-500 mt-1">Projekt-Templates nutzen, erweitern und teilen</p>
      </div>
      <UButton color="primary" to="/teacher/templates/new">
        <Plus :size="16" class="mr-1" />
        Neues Template
      </UButton>
    </div>

    <!-- Tabs -->
    <div class="mb-4 flex gap-1 border-b border-gray-200 dark:border-gray-800">
      <button
        v-for="tab in [
          { key: 'own', label: 'Meine Templates' },
          { key: 'shared', label: 'Geteilte Templates' },
          { key: 'platform', label: 'Plantoria-Templates' },
        ]"
        :key="tab.key"
        :class="[
          'px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
          activeTab === tab.key
            ? 'border-green-600 text-green-700 dark:text-green-400'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
        ]"
        @click="activeTab = tab.key as any"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Filters -->
    <div class="mb-6 flex flex-wrap gap-3">
      <USelect v-model="filterCategory" :items="categoryOptions" class="w-40" />
      <USelect v-model="filterGrade" :items="gradeOptions" class="w-32" />
      <USelect v-model="filterDifficulty" :items="difficultyOptions" class="w-32" />
    </div>

    <!-- Template cards -->
    <div class="space-y-4">
      <UCard v-for="tmpl in currentTemplates" :key="tmpl.id">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <h3 class="text-lg font-semibold">{{ tmpl.name }}</h3>
              <UBadge v-if="tmpl.isOwn" color="primary" variant="subtle" size="xs">Eigenes</UBadge>
              <UBadge v-else-if="tmpl.isPlatform" color="info" variant="subtle" size="xs">Plantoria</UBadge>
              <UBadge v-else color="neutral" variant="subtle" size="xs">Geteilt</UBadge>
            </div>
            <p class="text-sm text-gray-500 mb-3">{{ tmpl.description }}</p>
            <div class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-3">
              <span>Kategorie: <strong>{{ tmpl.category }}</strong></span>
              <span>Stufe: <strong>{{ tmpl.gradeRange }}</strong></span>
              <span>
                Schwierigkeit:
                <UBadge :color="difficultyColor(tmpl.difficulty) as any" variant="subtle" size="xs">
                  {{ tmpl.difficulty }}
                </UBadge>
              </span>
              <span>Aufgaben: <strong>{{ tmpl.taskCount }}</strong> ({{ tmpl.taskCountWithLp21 }} mit LP21)</span>
              <span v-if="tmpl.usedBySchools">Genutzt von: <strong>{{ tmpl.usedBySchools }} Schulen</strong></span>
              <span v-if="tmpl.createdBy !== 'Plantoria'">Erstellt von: <strong>{{ tmpl.createdBy }}</strong></span>
            </div>
            <div class="max-w-xs">
              <div class="flex items-center justify-between text-xs mb-1">
                <span>LP21-Abdeckung</span>
                <span class="font-semibold">{{ tmpl.lp21Coverage }}%</span>
              </div>
              <ProgressBar :value="tmpl.lp21Coverage" :show-label="false" size="sm" />
            </div>
          </div>
          <div class="flex flex-wrap gap-2 shrink-0">
            <UButton v-if="tmpl.isOwn" size="sm" variant="soft" :to="`/teacher/templates/${tmpl.id}`">
              Bearbeiten
            </UButton>
            <UButton v-if="tmpl.isOwn" size="sm" variant="soft" color="primary" disabled>
              Teilen
            </UButton>
            <UButton v-if="!tmpl.isOwn" size="sm" variant="soft" color="primary" disabled>
              Importieren
            </UButton>
            <UButton size="sm" variant="ghost" color="neutral" disabled>
              Vorschau
            </UButton>
            <UButton size="sm" color="primary" to="/teacher/projects/new">
              Projekt erstellen
            </UButton>
          </div>
        </div>
      </UCard>
    </div>

    <EmptyState
      v-if="currentTemplates.length === 0"
      title="Keine Templates gefunden"
      description="Erstelle ein eigenes Template oder importiere eines."
      action-label="Neues Template"
      action-to="/teacher/templates/new"
    />
  </div>
</template>
