<script setup lang="ts">
import { useSubjectsStore } from '@/stores/subjects'
import { useMaterialsStore } from '@/stores/materials'
import { useCurriculumStore } from '@/stores/curriculum'
import { Download, Plus, ChevronUp, ChevronDown, Save, Trash2 } from 'lucide-vue-next'
import type { SubjectLearningItem } from '@/types'

definePageMeta({ layout: 'teacher' })

const route = useRoute()
const subjectsStore = useSubjectsStore()
const materialsStore = useMaterialsStore()
const curriculumStore = useCurriculumStore()

const subjectId = route.params.id as string
const subject = computed(() => subjectsStore.getSubjectById(subjectId))

const subjectMaterials = computed(() => {
  if (!subject.value) return []
  return materialsStore.materials.filter((m) => m.subjectArea === subject.value!.name)
})

const subjectTemplates = computed(() => {
  if (!subject.value) return []
  return subjectsStore.getTemplatesBySubject(subject.value.name)
})

const learningItems = computed(() => {
  return subjectTemplates.value
    .flatMap((t) => t.learningOrder)
    .sort((a, b) => a.order - b.order)
})

// Filters
const filterGrade = ref('all')
const gradeOptions = [
  { label: 'Alle Stufen', value: 'all' },
  { label: '1-2', value: '1-2' },
  { label: '3-4', value: '3-4' },
  { label: '5-6', value: '5-6' },
]

const filteredLearningItems = computed(() => {
  let items = learningItems.value
  if (filterGrade.value !== 'all') {
    items = items.filter((item) => item.gradeRange.includes(filterGrade.value.split('-')[0] ?? ''))
  }
  return items
})

// Download dialog
const showDownloadDialog = ref(false)
const downloadMaterial = ref<typeof subjectMaterials.value[0] | null>(null)

function startDownload(mat: typeof subjectMaterials.value[0]) {
  downloadMaterial.value = mat
  showDownloadDialog.value = true
}

function confirmDownload() {
  if (downloadMaterial.value) {
    materialsStore.recordDownload(downloadMaterial.value.id, downloadMaterial.value.formats[0] || 'PDF')
    for (const code of downloadMaterial.value.lp21Refs) {
      curriculumStore.markTopicTreated(code, downloadMaterial.value.title, 'Gemüsefläche HE24a')
    }
  }
  showDownloadDialog.value = false
}

// Learning item CRUD
const showAddItem = ref(false)
const newItem = ref({ title: '', description: '', gradeRange: '3-4', difficulty: 'Mittel' as const })

function addLearningItem() {
  if (!newItem.value.title.trim() || subjectTemplates.value.length === 0) return
  const template = subjectTemplates.value[0]
  if (!template) return
  const maxOrder = template.learningOrder.length > 0
    ? Math.max(...template.learningOrder.map((i) => i.order))
    : 0
  template.learningOrder.push({
    id: `sl-${Date.now()}`,
    title: newItem.value.title,
    description: newItem.value.description || undefined,
    order: maxOrder + 1,
    materialIds: [],
    lp21Refs: [],
    difficulty: newItem.value.difficulty,
    gradeRange: newItem.value.gradeRange,
  })
  showAddItem.value = false
  newItem.value = { title: '', description: '', gradeRange: '3-4', difficulty: 'Mittel' }
}

function moveItem(templateIdx: number, item: SubjectLearningItem, direction: 'up' | 'down') {
  const template = subjectTemplates.value[templateIdx]
  if (!template) return
  const items = template.learningOrder
  const idx = items.findIndex((i) => i.id === item.id)
  if (direction === 'up' && idx > 0) {
    const prev = items[idx - 1]
    const curr = items[idx]
    if (prev && curr) {
      const prevOrder = prev.order
      prev.order = curr.order
      curr.order = prevOrder
    }
  } else if (direction === 'down' && idx < items.length - 1) {
    const next = items[idx + 1]
    const curr = items[idx]
    if (next && curr) {
      const nextOrder = next.order
      next.order = curr.order
      curr.order = nextOrder
    }
  }
  items.sort((a, b) => a.order - b.order)
}

function removeItem(templateIdx: number, itemId: string) {
  const template = subjectTemplates.value[templateIdx]
  if (!template) return
  template.learningOrder = template.learningOrder.filter((i) => i.id !== itemId)
}

// Save as template
const showSaveTemplate = ref(false)
const templateName = ref('')

function saveAsTemplate() {
  if (!subject.value || !templateName.value.trim()) return
  subjectsStore.createTemplate({
    id: `st-${Date.now()}`,
    name: templateName.value,
    subjectArea: subject.value.name,
    description: subject.value.description,
    learningOrder: learningItems.value,
    createdBy: 'teacher-1',
    shared: false,
    isPlatform: false,
  })
  showSaveTemplate.value = false
  templateName.value = ''
}

function getMaterialForItem(materialIds: string[]) {
  return materialsStore.materials.filter((m) => materialIds.includes(m.id))
}
</script>

<template>
  <div v-if="subject">
    <div class="mb-4">
      <NuxtLink to="/teacher/subjects" class="text-sm text-gray-500 hover:text-gray-700">
        &larr; Fachbereiche
      </NuxtLink>
    </div>

    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ subject.name }}</h1>
        <p class="text-sm text-gray-500 mt-1">{{ subject.description }}</p>
        <div class="mt-2 flex flex-wrap gap-2">
          <UBadge v-for="ref in subject.lp21Refs" :key="ref" color="primary" variant="subtle" size="xs">
            {{ ref }}
          </UBadge>
        </div>
      </div>
      <div class="flex gap-2">
        <UButton variant="soft" color="primary" @click="showSaveTemplate = true">
          <Save :size="16" class="mr-1" /> Als Template speichern
        </UButton>
        <UButton color="primary" @click="showAddItem = true">
          <Plus :size="16" class="mr-1" /> Lerninhalt hinzufügen
        </UButton>
      </div>
    </div>

    <!-- Filters -->
    <div class="mb-4 flex gap-3">
      <USelect v-model="filterGrade" :items="gradeOptions" class="w-32" />
    </div>

    <!-- Learning order -->
    <div v-for="(template, tIdx) in subjectTemplates" :key="template.id" class="mb-8">
      <h2 class="text-lg font-semibold mb-3">{{ template.name }}</h2>
      <p class="text-sm text-gray-500 mb-4">{{ template.description }}</p>

      <div class="space-y-3">
        <div
          v-for="(item, idx) in template.learningOrder.filter(i =>
            filterGrade === 'all' || i.gradeRange.includes(filterGrade.split('-')[0] ?? '')
          ).sort((a, b) => a.order - b.order)"
          :key="item.id"
          class="flex items-start gap-3 rounded-lg border border-gray-200 p-4 dark:border-gray-800"
        >
          <!-- Order controls -->
          <div class="flex flex-col gap-1 shrink-0">
            <UButton size="xs" variant="ghost" @click="moveItem(tIdx, item, 'up')">
              <ChevronUp :size="14" />
            </UButton>
            <span class="text-xs text-gray-400 text-center">{{ item.order }}</span>
            <UButton size="xs" variant="ghost" @click="moveItem(tIdx, item, 'down')">
              <ChevronDown :size="14" />
            </UButton>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <h4 class="font-medium text-sm">{{ item.title }}</h4>
            <p v-if="item.description" class="text-xs text-gray-500 mt-1">{{ item.description }}</p>
            <div class="flex flex-wrap gap-2 mt-2">
              <UBadge color="neutral" variant="subtle" size="xs">{{ item.gradeRange }}</UBadge>
              <UBadge color="neutral" variant="outline" size="xs">{{ item.difficulty }}</UBadge>
              <UBadge
                v-for="ref in item.lp21Refs"
                :key="ref"
                color="primary"
                variant="subtle"
                size="xs"
              >
                {{ ref }}
              </UBadge>
            </div>

            <!-- Linked materials -->
            <div v-if="getMaterialForItem(item.materialIds).length > 0" class="mt-2">
              <p class="text-xs text-gray-400 mb-1">Verknüpfte Materialien:</p>
              <div class="flex flex-wrap gap-1">
                <UBadge
                  v-for="mat in getMaterialForItem(item.materialIds)"
                  :key="mat.id"
                  color="neutral"
                  variant="subtle"
                  size="xs"
                >
                  {{ mat.title }}
                </UBadge>
              </div>
            </div>
          </div>

          <!-- Delete -->
          <UButton size="xs" variant="ghost" color="neutral" @click="removeItem(tIdx, item.id)">
            <Trash2 :size="14" />
          </UButton>
        </div>
      </div>
    </div>

    <!-- Materials section -->
    <div v-if="subjectMaterials.length > 0" class="mt-8">
      <h2 class="text-lg font-semibold mb-3">Verfügbare Materialien</h2>
      <div class="space-y-2">
        <div
          v-for="mat in subjectMaterials"
          :key="mat.id"
          class="flex items-center justify-between rounded-lg border border-gray-100 p-3 dark:border-gray-800"
        >
          <div>
            <span class="text-sm font-medium">{{ mat.title }}</span>
            <div class="flex gap-2 mt-1">
              <UBadge v-for="ref in mat.lp21Refs" :key="ref" color="neutral" variant="subtle" size="xs">
                {{ ref }}
              </UBadge>
              <UBadge color="neutral" variant="outline" size="xs">
                {{ mat.formats.join(' + ') }}
              </UBadge>
              <UBadge color="neutral" variant="outline" size="xs">
                {{ mat.gradeRange }}
              </UBadge>
            </div>
          </div>
          <UButton size="sm" variant="soft" color="primary" @click="startDownload(mat)">
            <Download :size="14" class="mr-1" /> Download
          </UButton>
        </div>
      </div>
    </div>

    <div v-if="subjectTemplates.length === 0 && subjectMaterials.length === 0" class="py-12 text-center text-gray-400">
      Noch keine Lerninhalte oder Materialien für diesen Fachbereich vorhanden.
    </div>

    <!-- Download confirmation dialog -->
    <UModal v-model:open="showDownloadDialog">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-2">Download gestartet</h3>
          <p class="text-sm text-gray-500 mb-4" v-if="downloadMaterial">
            Arbeitsblatt: <strong>{{ downloadMaterial.title }}</strong><br />
            Format: {{ downloadMaterial.formats[0] }}
          </p>
          <div v-if="downloadMaterial?.lp21Refs.length" class="mb-4">
            <p class="text-sm font-medium mb-2">Folgende LP21-Ziele werden als &laquo;behandelt&raquo; markiert:</p>
            <ul class="space-y-1">
              <li v-for="ref in downloadMaterial!.lp21Refs" :key="ref" class="flex items-center gap-2 text-sm">
                <input type="checkbox" checked disabled class="text-green-600" />
                <span>{{ ref }}</span>
              </li>
            </ul>
          </div>
          <div class="flex justify-end">
            <UButton color="primary" @click="confirmDownload">OK</UButton>
          </div>
        </div>
      </template>
    </UModal>

    <!-- Add learning item modal -->
    <UModal v-model:open="showAddItem">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-4">Lerninhalt hinzufügen</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Titel</label>
              <UInput v-model="newItem.title" placeholder="Titel des Lerninhalts" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Beschreibung</label>
              <UTextarea v-model="newItem.description" :rows="2" placeholder="Optional..." />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium mb-1">Stufe</label>
                <USelect v-model="newItem.gradeRange" :items="[
                  { label: '1-2', value: '1-2' },
                  { label: '3-4', value: '3-4' },
                  { label: '5-6', value: '5-6' },
                  { label: '3-6', value: '3-6' },
                  { label: '1-6', value: '1-6' },
                ]" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Schwierigkeit</label>
                <USelect v-model="newItem.difficulty" :items="[
                  { label: 'Einfach', value: 'Einfach' },
                  { label: 'Mittel', value: 'Mittel' },
                  { label: 'Schwer', value: 'Schwer' },
                ]" />
              </div>
            </div>
          </div>
          <div class="mt-6 flex justify-end gap-2">
            <UButton variant="ghost" @click="showAddItem = false">Abbrechen</UButton>
            <UButton color="primary" @click="addLearningItem">Hinzufügen</UButton>
          </div>
        </div>
      </template>
    </UModal>

    <!-- Save as template modal -->
    <UModal v-model:open="showSaveTemplate">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-4">Als Template speichern</h3>
          <div>
            <label class="block text-sm font-medium mb-1">Template-Name</label>
            <UInput v-model="templateName" :placeholder="`${subject?.name} - Mein Template`" />
          </div>
          <div class="mt-6 flex justify-end gap-2">
            <UButton variant="ghost" @click="showSaveTemplate = false">Abbrechen</UButton>
            <UButton color="primary" @click="saveAsTemplate">Speichern</UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>

  <div v-else class="py-16 text-center text-gray-500">
    Fachbereich nicht gefunden.
  </div>
</template>
