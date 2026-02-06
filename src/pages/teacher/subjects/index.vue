<script setup lang="ts">
import { useSubjectsStore } from '@/stores/subjects'
import { Plus, Download, Trash2 } from 'lucide-vue-next'
import type { SubjectInfo, SubjectArea, SubjectAreaTemplate } from '@/types'

definePageMeta({ layout: 'teacher' })

const subjectsStore = useSubjectsStore()

const subjectEmojis: Record<string, string> = {
  Boden: '&#127757;',
  Fruchtfolge: '&#128260;',
  'Gemüsearten': '&#129365;',
  Gesundheit: '&#128170;',
  'Flächengestaltung': '&#128208;',
  Beetplanung: '&#128506;',
  'Ernährung': '&#127822;',
  'Ökologie': '&#127793;',
  Mathematik: '&#128202;',
}

// Create subject modal
const showCreate = ref(false)
const newSubject = ref({ name: '' as SubjectArea, description: '' })
const subjectAreaOptions: { label: string; value: SubjectArea }[] = [
  { label: 'Boden', value: 'Boden' },
  { label: 'Fruchtfolge', value: 'Fruchtfolge' },
  { label: 'Gemüsearten', value: 'Gemüsearten' },
  { label: 'Gesundheit', value: 'Gesundheit' },
  { label: 'Flächengestaltung', value: 'Flächengestaltung' },
  { label: 'Beetplanung', value: 'Beetplanung' },
  { label: 'Ernährung', value: 'Ernährung' },
  { label: 'Ökologie', value: 'Ökologie' },
  { label: 'Mathematik', value: 'Mathematik' },
]

function openCreate() {
  newSubject.value = { name: 'Boden', description: '' }
  showCreate.value = true
}

function createSubject() {
  if (!newSubject.value.description.trim()) return
  subjectsStore.createSubject({
    id: `sub-${Date.now()}`,
    name: newSubject.value.name,
    description: newSubject.value.description,
    lp21Refs: [],
    materialCount: 0,
  })
  showCreate.value = false
}

function deleteSubject(id: string) {
  subjectsStore.deleteSubject(id)
}

// Import template modal
const showImport = ref(false)

const availableTemplates = computed(() =>
  subjectsStore.subjectTemplates.filter((t) => t.isPlatform || t.shared),
)

function importTemplate(template: SubjectAreaTemplate) {
  const exists = subjectsStore.subjects.find((s) => s.name === template.subjectArea)
  if (!exists) {
    subjectsStore.createSubject({
      id: `sub-${Date.now()}`,
      name: template.subjectArea,
      description: template.description,
      lp21Refs: template.learningOrder.flatMap((l) => l.lp21Refs).filter((v, i, a) => a.indexOf(v) === i),
      materialCount: template.learningOrder.reduce((acc, l) => acc + l.materialIds.length, 0),
    })
  }
  showImport.value = false
}
</script>

<template>
  <div>
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Fachbereiche</h1>
        <p class="text-sm text-gray-500 mt-1">Strukturiertes Fachwissen nach Themengebiet</p>
      </div>
      <div class="flex gap-2">
        <UButton variant="soft" color="primary" @click="showImport = true">
          <Download :size="16" class="mr-1" /> Template importieren
        </UButton>
        <UButton color="primary" @click="openCreate">
          <Plus :size="16" class="mr-1" /> Neuer Fachbereich
        </UButton>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="subject in subjectsStore.subjects" :key="subject.id" class="relative group">
        <NuxtLink
          :to="`/teacher/subjects/${subject.id}`"
          class="block"
        >
          <UCard class="h-full hover:ring-2 hover:ring-green-200 dark:hover:ring-green-900 transition-all">
            <div class="text-center">
              <div class="mb-2 text-2xl" v-html="subjectEmojis[subject.name] || '&#128218;'" />
              <h3 class="font-semibold mb-1">{{ subject.name }}</h3>
              <p class="text-xs text-gray-500 mb-2">{{ subject.description }}</p>
              <UBadge color="neutral" variant="subtle" size="xs">
                {{ subject.materialCount }} Materialien
              </UBadge>
            </div>
          </UCard>
        </NuxtLink>
        <UButton
          size="xs"
          variant="ghost"
          color="neutral"
          class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          @click.prevent="deleteSubject(subject.id)"
        >
          <Trash2 :size="14" />
        </UButton>
      </div>
    </div>

    <!-- Create subject modal -->
    <UModal v-model:open="showCreate">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-4">Neuer Fachbereich</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Fachbereich</label>
              <USelect v-model="newSubject.name" :items="subjectAreaOptions" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Beschreibung</label>
              <UTextarea v-model="newSubject.description" :rows="2" placeholder="Kurze Beschreibung..." />
            </div>
          </div>
          <div class="mt-6 flex justify-end gap-2">
            <UButton variant="ghost" @click="showCreate = false">Abbrechen</UButton>
            <UButton color="primary" @click="createSubject">Erstellen</UButton>
          </div>
        </div>
      </template>
    </UModal>

    <!-- Import template modal -->
    <UModal v-model:open="showImport">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-4">Template importieren</h3>
          <div class="space-y-3">
            <div
              v-for="template in availableTemplates"
              :key="template.id"
              class="flex items-start justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700"
            >
              <div>
                <span class="text-sm font-medium">{{ template.name }}</span>
                <p class="text-xs text-gray-500">{{ template.description }}</p>
                <div class="flex gap-2 mt-1">
                  <UBadge color="neutral" variant="subtle" size="xs">{{ template.subjectArea }}</UBadge>
                  <UBadge v-if="template.isPlatform" color="primary" variant="subtle" size="xs">Plattform</UBadge>
                  <UBadge v-else color="neutral" variant="subtle" size="xs">Geteilt</UBadge>
                </div>
              </div>
              <UButton size="sm" variant="soft" color="primary" @click="importTemplate(template)">
                Importieren
              </UButton>
            </div>
          </div>
          <div class="mt-4 flex justify-end">
            <UButton variant="ghost" @click="showImport = false">Schliessen</UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
