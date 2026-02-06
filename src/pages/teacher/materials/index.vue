<script setup lang="ts">
import { useMaterialsStore } from '@/stores/materials'
import { useCurriculumStore } from '@/stores/curriculum'
import { Search, Download, Eye } from 'lucide-vue-next'
import type { Material } from '@/types'

definePageMeta({ layout: 'teacher' })

const materialsStore = useMaterialsStore()
const curriculumStore = useCurriculumStore()

const subjectOptions = [
  { label: 'Alle Fachbereiche', value: 'all' },
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

const gradeOptions = [
  { label: 'Alle Stufen', value: 'all' },
  { label: '1-2', value: '1' },
  { label: '3-6', value: '3' },
  { label: '5-6', value: '5' },
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

const formatOptions = [
  { label: 'Alle Formate', value: 'all' },
  { label: 'PDF', value: 'PDF' },
  { label: 'DOCX', value: 'DOCX' },
]

const showDownloadDialog = ref(false)
const downloadMaterial = ref<Material | null>(null)
const downloadFormat = ref<'PDF' | 'DOCX'>('PDF')

function startDownload(mat: Material, format: 'PDF' | 'DOCX') {
  downloadMaterial.value = mat
  downloadFormat.value = format
  showDownloadDialog.value = true
}

function confirmDownload() {
  if (downloadMaterial.value) {
    materialsStore.recordDownload(downloadMaterial.value.id, downloadFormat.value)
    for (const code of downloadMaterial.value.lp21Refs) {
      curriculumStore.markTopicTreated(code, downloadMaterial.value.title, 'Gemüsefläche HE24a')
    }
  }
  showDownloadDialog.value = false
}

function formatDate(date?: string) {
  if (!date) return null
  return new Date(date).toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Lehrmaterial</h1>
      <p class="text-sm text-gray-500 mt-1">Arbeitsblätter finden, herunterladen und LP21-Fortschritt tracken</p>
    </div>

    <!-- Filters -->
    <div class="mb-6 space-y-3">
      <div class="flex flex-wrap gap-3">
        <USelect v-model="materialsStore.filterSubject" :items="subjectOptions" class="w-40" />
        <USelect v-model="materialsStore.filterGrade" :items="gradeOptions" class="w-32" />
        <USelect v-model="materialsStore.filterPhase" :items="phaseOptions" class="w-40" />
        <USelect v-model="materialsStore.filterFormat" :items="formatOptions" class="w-32" />
      </div>
      <UInput
        v-model="materialsStore.searchQuery"
        placeholder="Suche nach Titel oder Beschreibung..."
        class="max-w-md"
      >
        <template #leading>
          <Search :size="16" class="text-gray-400" />
        </template>
      </UInput>
      <p class="text-sm text-gray-500">
        Ergebnisse: <strong>{{ materialsStore.filteredMaterials.length }}</strong> Arbeitsblätter
      </p>
    </div>

    <!-- Material cards -->
    <div class="space-y-4">
      <UCard v-for="mat in materialsStore.filteredMaterials" :key="mat.id">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div class="flex-1">
            <h3 class="font-semibold mb-1">{{ mat.title }}</h3>
            <p v-if="mat.description" class="text-sm text-gray-500 mb-2">{{ mat.description }}</p>
            <div class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-2">
              <span>Fachbereich: <strong>{{ mat.subjectArea }}</strong></span>
              <span>Stufe: <strong>{{ mat.gradeRange }}</strong></span>
              <span v-if="mat.phase">Phase: <strong>{{ mat.phase }}</strong></span>
              <span>Format: <strong>{{ mat.formats.join(' + ') }}</strong></span>
              <span>Schwierigkeit: <strong>{{ mat.difficulty }}</strong></span>
            </div>
            <div class="flex flex-wrap gap-1 mb-2">
              <UBadge v-for="ref in mat.lp21Refs" :key="ref" color="primary" variant="subtle" size="xs">
                {{ ref }}
              </UBadge>
            </div>
            <p v-if="mat.lastDownloaded" class="text-xs text-gray-400">
              Zuletzt heruntergeladen: {{ formatDate(mat.lastDownloaded) }}
            </p>
            <p v-else class="text-xs text-gray-400 italic">Noch nicht heruntergeladen</p>
          </div>
          <div class="flex gap-2 shrink-0">
            <UButton
              v-if="mat.formats.includes('PDF')"
              size="sm"
              variant="soft"
              color="primary"
              @click="startDownload(mat, 'PDF')"
            >
              <Download :size="14" class="mr-1" /> PDF
            </UButton>
            <UButton
              v-if="mat.formats.includes('DOCX')"
              size="sm"
              variant="soft"
              color="primary"
              @click="startDownload(mat, 'DOCX')"
            >
              <Download :size="14" class="mr-1" /> DOCX
            </UButton>
            <UButton size="sm" variant="ghost" color="neutral" disabled>
              <Eye :size="14" />
            </UButton>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Download confirmation dialog -->
    <UModal v-model:open="showDownloadDialog">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-2">Download gestartet</h3>
          <p class="text-sm text-gray-500 mb-1" v-if="downloadMaterial">
            Arbeitsblatt: <strong>{{ downloadMaterial.title }}</strong>
          </p>
          <p class="text-sm text-gray-500 mb-4">Format: {{ downloadFormat }}</p>
          <div v-if="downloadMaterial?.lp21Refs.length" class="mb-4">
            <p class="text-sm font-medium mb-2">Folgende LP21-Ziele werden als «behandelt» markiert:</p>
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
  </div>
</template>
