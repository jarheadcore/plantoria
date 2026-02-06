<script setup lang="ts">
import { useTemplatesStore } from '@/stores/templates'

definePageMeta({ layout: 'teacher' })

const route = useRoute()
const templatesStore = useTemplatesStore()

const templateId = route.params.id as string
const template = computed(() => templatesStore.getTemplateById(templateId))

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

const tasksByPhase = computed(() => {
  if (!template.value?.tasks) return {}
  const phases: Record<string, typeof template.value.tasks> = {}
  for (const t of template.value.tasks) {
    if (!phases[t.phase]) phases[t.phase] = []
    phases[t.phase]!.push(t)
  }
  return phases
})

const router = useRouter()

function save() {
  router.push('/teacher/templates')
}
</script>

<template>
  <div v-if="template">
    <div class="mb-4">
      <NuxtLink to="/teacher/templates" class="text-sm text-gray-500 hover:text-gray-700">
        ← Templates
      </NuxtLink>
    </div>

    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      {{ template.name }} <span class="text-sm font-normal text-gray-400">(bearbeiten)</span>
    </h1>

    <!-- Template info -->
    <UCard class="mb-6">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">Kategorie</label>
          <USelect :model-value="template.category" :items="categoryOptions" size="sm" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">Schwierigkeit</label>
          <USelect :model-value="template.difficulty" :items="difficultyOptions" size="sm" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">Stufe</label>
          <span class="text-sm">{{ template.gradeRange }}</span>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">Dauer</label>
          <span class="text-sm">{{ template.estimatedDuration }}</span>
        </div>
      </div>
      <div class="mt-4 flex items-center gap-4 text-sm text-gray-500">
        <span>LP21-Abdeckung: <strong>{{ template.lp21Coverage }}%</strong></span>
        <span>Aufgaben: <strong>{{ template.taskCount }}</strong></span>
      </div>
    </UCard>

    <!-- Tasks by phase -->
    <h2 class="text-lg font-semibold mb-3">Aufgaben nach Phase</h2>
    <div class="space-y-6 mb-6">
      <div v-for="(phaseTasks, phase) in tasksByPhase" :key="phase">
        <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
          {{ phase }} ({{ phaseTasks.length }} Aufgaben)
        </h3>
        <div class="space-y-2">
          <div
            v-for="task in phaseTasks"
            :key="task.id"
            class="flex items-center justify-between rounded-lg border border-gray-100 p-3 dark:border-gray-800"
          >
            <div>
              <span class="text-sm font-medium">{{ task.title }}</span>
              <div class="flex gap-1 mt-1">
                <UBadge v-for="ref in task.lp21Refs" :key="ref" color="primary" variant="subtle" size="xs">
                  {{ ref }}
                </UBadge>
                <UBadge v-if="!task.lp21Refs.length" color="neutral" variant="outline" size="xs">
                  Kein LP21
                </UBadge>
              </div>
            </div>
            <div class="flex gap-1">
              <UButton size="xs" variant="ghost" disabled>Bearbeiten</UButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <UButton color="primary" variant="soft" class="mb-6" disabled>
      + Aufgabe hinzufügen
    </UButton>

    <!-- Materials -->
    <div v-if="template.materials?.length" class="mb-6">
      <h2 class="text-lg font-semibold mb-3">Materialien</h2>
      <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Material</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Menge</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Bezugsort</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Kosten</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="mat in template.materials" :key="mat.id">
              <td class="px-4 py-3 text-sm">{{ mat.name }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ mat.quantity }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ mat.source }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ mat.cost }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="flex gap-3">
      <UButton color="primary" @click="save">Speichern</UButton>
      <UButton variant="soft" color="primary" disabled>Teilen</UButton>
    </div>
  </div>

  <div v-else class="py-16 text-center text-gray-500">
    Template nicht gefunden.
  </div>
</template>
