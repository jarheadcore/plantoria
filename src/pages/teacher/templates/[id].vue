<script setup lang="ts">
import { useTemplatesStore } from '@/stores/templates'
import type { TopicTemplate, ProjectPhase } from '@/types'

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

const phases: { key: ProjectPhase; label: string; color: string }[] = [
  { key: 'Planung', label: 'Planung', color: 'bg-blue-400' },
  { key: 'Pflanzung', label: 'Pflanzung', color: 'bg-green-400' },
  { key: 'Pflege', label: 'Pflege', color: 'bg-amber-400' },
  { key: 'Ernte', label: 'Ernte', color: 'bg-orange-400' },
  { key: 'Verarbeitung', label: 'Verarbeitung', color: 'bg-red-300' },
  { key: 'Vermarktung', label: 'Vermarktung', color: 'bg-purple-400' },
]

const topicsByPhase = computed(() => {
  if (!template.value?.topics) return {}
  const result: Record<string, TopicTemplate[]> = {}
  for (const phase of phases) {
    const phaseTopics = template.value.topics.filter((t) => t.phase === phase.key)
    if (phaseTopics.length > 0) {
      result[phase.key] = phaseTopics.sort((a, b) => a.order - b.order)
    }
  }
  return result
})

function getPhaseColor(phaseKey: string) {
  const phase = phases.find((p) => p.key === phaseKey)
  return phase?.color ?? 'bg-gray-400'
}

function getTaskTemplatesForTopic(topicTemplateId: string) {
  return templatesStore.getTaskTemplatesByTopicId(topicTemplateId)
}

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
        <span>Fachbereiche: <strong>{{ template.topics.length }}</strong></span>
      </div>
    </UCard>

    <!-- Topics by phase -->
    <h2 class="text-lg font-semibold mb-3">Fachbereiche nach Phase</h2>
    <div class="space-y-6 mb-6">
      <div v-for="(phaseTopics, phase) in topicsByPhase" :key="phase">
        <div class="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <!-- Phase header -->
          <div :class="['px-4 py-2 text-xs font-bold uppercase tracking-wider text-white', getPhaseColor(phase as string)]">
            {{ phase }}
          </div>

          <!-- Topics in this phase -->
          <div class="divide-y divide-gray-100 dark:divide-gray-800">
            <div v-for="topic in phaseTopics" :key="topic.id" class="p-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-lg">{{ topic.icon }}</span>
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">{{ topic.name }}</h3>
                <span class="text-xs text-gray-400 ml-auto">{{ topic.startMonth }}–{{ topic.endMonth }} Monat</span>
              </div>
              <p class="text-xs text-gray-500 mb-3">{{ topic.goalDescription }}</p>

              <!-- Task templates for this topic -->
              <div class="space-y-2">
                <div
                  v-for="task in getTaskTemplatesForTopic(topic.id)"
                  :key="task.id"
                  class="flex items-center justify-between rounded-lg border border-gray-100 p-3 dark:border-gray-800"
                >
                  <div>
                    <span class="text-sm font-medium">{{ task.title }}</span>
                    <div class="flex gap-1 mt-1">
                      <UBadge v-for="lp21Ref in task.lp21Refs" :key="lp21Ref" color="primary" variant="subtle" size="sm">
                        {{ lp21Ref }}
                      </UBadge>
                      <UBadge v-if="!task.lp21Refs.length" color="neutral" variant="outline" size="sm">
                        Kein LP21
                      </UBadge>
                    </div>
                  </div>
                  <div class="flex gap-1">
                    <UButton size="sm" variant="ghost" disabled>Bearbeiten</UButton>
                  </div>
                </div>
              </div>

              <!-- LP21 refs for topic -->
              <div v-if="topic.lp21Refs.length > 0" class="mt-2 flex items-center gap-1">
                <span class="text-xs text-gray-400">LP21:</span>
                <UBadge v-for="lp21Ref in topic.lp21Refs" :key="lp21Ref" color="neutral" variant="subtle" size="sm">
                  {{ lp21Ref }}
                </UBadge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <UButton color="primary" variant="soft" class="mb-6" disabled>
      + Fachbereich hinzufügen
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
