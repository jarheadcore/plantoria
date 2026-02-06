<script setup lang="ts">
import { useMaterialsStore } from '@/stores/materials'
import { useCurriculumStore } from '@/stores/curriculum'
import { mockSubjects } from '@/data/mock/subjects'
import type { SubjectArea } from '@/types'
import { Download } from 'lucide-vue-next'

definePageMeta({ layout: 'teacher' })

const route = useRoute()
const materialsStore = useMaterialsStore()
const curriculumStore = useCurriculumStore()

const subjectId = route.params.id as string
const subject = computed(() => mockSubjects.find((s) => s.id === subjectId))

const subjectMaterials = computed(() => {
  if (!subject.value) return []
  return materialsStore.materials.filter((m) => m.subjectArea === subject.value!.name)
})

const lowerGradeMaterials = computed(() =>
  subjectMaterials.value.filter((m) => m.gradeRange.includes('1') || m.gradeRange.includes('2')),
)

const upperGradeMaterials = computed(() =>
  subjectMaterials.value.filter((m) => m.gradeRange.includes('3') || m.gradeRange.includes('4') || m.gradeRange.includes('5') || m.gradeRange.includes('6')),
)

const showDownloadDialog = ref(false)
const downloadMaterial = ref<typeof subjectMaterials.value[0] | null>(null)

function startDownload(mat: typeof subjectMaterials.value[0]) {
  downloadMaterial.value = mat
  showDownloadDialog.value = true
}

function confirmDownload() {
  if (downloadMaterial.value) {
    materialsStore.recordDownload(downloadMaterial.value.id, downloadMaterial.value.formats[0])
    for (const code of downloadMaterial.value.lp21Refs) {
      curriculumStore.markTopicTreated(code, downloadMaterial.value.title, 'Gemüsefläche HE24a')
    }
  }
  showDownloadDialog.value = false
}
</script>

<template>
  <div v-if="subject">
    <div class="mb-4">
      <NuxtLink to="/teacher/subjects" class="text-sm text-gray-500 hover:text-gray-700">
        ← Fachbereiche
      </NuxtLink>
    </div>

    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ subject.name }}</h1>
      <p class="text-sm text-gray-500 mt-1">{{ subject.description }}</p>
      <div class="mt-2 flex flex-wrap gap-2">
        <UBadge v-for="ref in subject.lp21Refs" :key="ref" color="primary" variant="subtle" size="xs">
          {{ ref }}
        </UBadge>
      </div>
    </div>

    <!-- Lower grade materials -->
    <div v-if="lowerGradeMaterials.length > 0" class="mb-8">
      <h2 class="text-lg font-semibold mb-3">Lehrmaterial 1.–2. Klasse</h2>
      <div class="space-y-2">
        <div
          v-for="mat in lowerGradeMaterials"
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
            </div>
          </div>
          <UButton size="sm" variant="soft" color="primary" @click="startDownload(mat)">
            <Download :size="14" class="mr-1" /> Download
          </UButton>
        </div>
      </div>
    </div>

    <!-- Upper grade materials -->
    <div v-if="upperGradeMaterials.length > 0">
      <h2 class="text-lg font-semibold mb-3">Lehrmaterial 3.–6. Klasse</h2>
      <div class="space-y-2">
        <div
          v-for="mat in upperGradeMaterials"
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
            </div>
          </div>
          <UButton size="sm" variant="soft" color="primary" @click="startDownload(mat)">
            <Download :size="14" class="mr-1" /> Download
          </UButton>
        </div>
      </div>
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

  <div v-else class="py-16 text-center text-gray-500">
    Fachbereich nicht gefunden.
  </div>
</template>
