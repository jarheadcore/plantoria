<script setup lang="ts">
import { useTemplatesStore } from '@/stores/templates'
import { ArrowLeft, ArrowRight } from 'lucide-vue-next'

definePageMeta({ layout: 'teacher' })

const templatesStore = useTemplatesStore()
const router = useRouter()

const step = ref(1)
const mode = ref<'template' | 'manual'>('template')
const selectedTemplateId = ref('')
const projectName = ref('')
const projectDescription = ref('')
const projectArea = ref<number | undefined>()
const projectLocation = ref('')

const templateOptions = computed(() =>
  templatesStore.templates.map((t) => ({ label: `${t.name} (${t.lp21Coverage}% LP21)`, value: t.id })),
)

function goNext() {
  if (step.value === 1) {
    if (mode.value === 'template' && selectedTemplateId.value) {
      const tmpl = templatesStore.getTemplateById(selectedTemplateId.value)
      if (tmpl && !projectName.value) {
        projectName.value = `HE24a - ${tmpl.name}`
      }
    }
    step.value = 2
  }
}

function goBack() {
  if (step.value === 2) step.value = 1
}

function createProject() {
  // In static mode, just navigate to project list
  router.push('/teacher/projects')
}
</script>

<template>
  <div>
    <div class="mb-6">
      <NuxtLink to="/teacher/projects" class="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block">
        ← Zurück zu Projekte
      </NuxtLink>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Neues Projekt erstellen</h1>
    </div>

    <!-- Steps indicator -->
    <div class="mb-8 flex items-center gap-4">
      <div
        :class="[
          'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold',
          step >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500',
        ]"
      >
        1
      </div>
      <div class="h-0.5 w-16 bg-gray-200">
        <div :class="['h-full bg-green-600 transition-all', step >= 2 ? 'w-full' : 'w-0']" />
      </div>
      <div
        :class="[
          'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold',
          step >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500',
        ]"
      >
        2
      </div>
    </div>

    <UCard class="max-w-xl">
      <!-- Step 1 -->
      <div v-if="step === 1">
        <h2 class="text-lg font-semibold mb-4">Template wählen oder manuell starten</h2>

        <div class="space-y-4">
          <label class="flex items-start gap-3 cursor-pointer rounded-lg border border-gray-200 p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
            <input v-model="mode" type="radio" value="template" class="mt-0.5 text-green-600" />
            <div>
              <p class="font-medium">Aus Template erstellen</p>
              <p class="text-sm text-gray-500">Wähle ein fertiges Template mit Aufgaben und LP21-Verknüpfungen</p>
              <USelect
                v-if="mode === 'template'"
                v-model="selectedTemplateId"
                :items="templateOptions"
                placeholder="Template wählen..."
                class="mt-3"
              />
            </div>
          </label>

          <label class="flex items-start gap-3 cursor-pointer rounded-lg border border-gray-200 p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
            <input v-model="mode" type="radio" value="manual" class="mt-0.5 text-green-600" />
            <div>
              <p class="font-medium">Manuell erstellen</p>
              <p class="text-sm text-gray-500">Erstelle ein leeres Projekt und füge Aufgaben selbst hinzu</p>
            </div>
          </label>
        </div>

        <div class="mt-6 flex justify-between">
          <UButton variant="ghost" to="/teacher/projects">Abbrechen</UButton>
          <UButton
            color="primary"
            :disabled="mode === 'template' && !selectedTemplateId"
            @click="goNext"
          >
            Weiter
            <ArrowRight :size="16" class="ml-1" />
          </UButton>
        </div>
      </div>

      <!-- Step 2 -->
      <div v-if="step === 2">
        <h2 class="text-lg font-semibold mb-4">Projektdaten erfassen</h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Name</label>
            <UInput v-model="projectName" placeholder="z.B. HE24a - Gemüsefläche" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Beschreibung</label>
            <UTextarea v-model="projectDescription" placeholder="Beschreibung des Projekts..." :rows="3" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Fläche (m²)</label>
              <UInput v-model="projectArea" type="number" placeholder="z.B. 10" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Standort</label>
              <UInput v-model="projectLocation" placeholder="z.B. Hinter dem Schulhaus" />
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-between">
          <UButton variant="ghost" @click="goBack">
            <ArrowLeft :size="16" class="mr-1" />
            Zurück
          </UButton>
          <UButton color="primary" :disabled="!projectName" @click="createProject">
            Erstellen
          </UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>
