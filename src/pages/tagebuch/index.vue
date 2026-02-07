<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Camera,
  CheckCircle2,
  ChevronRight,
  Circle,
  Image as ImageIcon,
} from 'lucide-vue-next'
import { useDiaryStore } from '@/stores/diary'
import { useProjectsStore } from '@/stores/projects'

const diaryStore = useDiaryStore()
const projectsStore = useProjectsStore()

const selectedProjectId = ref('proj-1')

const projects = computed(() => projectsStore.activeProjects)

const diaryTasks = computed(() =>
  diaryStore.getDiaryTasksByProject(selectedProjectId.value),
)

function getEntry(taskId: string) {
  return diaryStore.getEntryByTaskId(taskId)
}

function getPhotoCount(taskId: string) {
  const entry = getEntry(taskId)
  return entry?.photos.length ?? 0
}

function formatDate(date?: string) {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
</script>

<template>
  <div class="min-h-dvh bg-green-50/50">
    <!-- Header -->
    <header class="bg-green-600 text-white px-4 py-3 sticky top-0 z-10">
      <div class="max-w-2xl mx-auto flex items-center gap-3">
        <span class="text-2xl">📓</span>
        <h1 class="text-lg font-bold">Feld-Tagebuch</h1>
      </div>
    </header>

    <div class="max-w-2xl mx-auto p-4">
      <!-- Project selector -->
      <div class="mb-4">
        <select
          v-model="selectedProjectId"
          class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium focus:border-green-400 focus:ring-1 focus:ring-green-400"
        >
          <option v-for="p in projects" :key="p.id" :value="p.id">
            {{ p.name }}
          </option>
        </select>
      </div>

      <!-- Task list (mobile-optimized cards) -->
      <div class="space-y-3">
        <NuxtLink
          v-for="task in diaryTasks"
          :key="task.id"
          :to="`/tagebuch/${task.taskId}`"
          class="block rounded-xl border border-gray-200 bg-white p-4 hover:border-green-300 hover:shadow-sm active:bg-gray-50 transition-all"
        >
          <div class="flex items-center gap-3">
            <!-- Status icon -->
            <div class="shrink-0">
              <CheckCircle2
                v-if="getEntry(task.taskId)?.completed"
                :size="24"
                class="text-green-500"
              />
              <Circle
                v-else-if="getEntry(task.taskId)"
                :size="24"
                class="text-amber-400"
              />
              <Circle
                v-else
                :size="24"
                class="text-gray-300"
              />
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <h3 class="font-medium text-sm text-gray-900">
                {{ task.title }}
              </h3>
              <div class="flex items-center gap-3 mt-1">
                <span class="text-xs text-gray-400">
                  {{ task.knowledgeFacts.length }} Tipp{{ task.knowledgeFacts.length !== 1 ? 's' : '' }}
                </span>
                <span v-if="getPhotoCount(task.taskId) > 0" class="flex items-center gap-1 text-xs text-gray-400">
                  <Camera :size="12" />
                  {{ getPhotoCount(task.taskId) }}
                </span>
                <span v-if="getEntry(task.taskId)" class="text-xs text-gray-400">
                  {{ formatDate(getEntry(task.taskId)?.date) }}
                </span>
              </div>
              <p
                v-if="getEntry(task.taskId)?.notes"
                class="text-xs text-gray-500 mt-1.5 line-clamp-2"
              >
                {{ getEntry(task.taskId)?.notes }}
              </p>
            </div>

            <!-- Photo thumbnail + chevron -->
            <div class="flex items-center gap-2 shrink-0">
              <div
                v-if="getEntry(task.taskId)?.photos.length"
                class="h-10 w-10 rounded-lg overflow-hidden bg-gray-100"
              >
                <img
                  :src="getEntry(task.taskId)!.photos[0]!.base64"
                  :alt="getEntry(task.taskId)!.photos[0]!.caption || 'Foto'"
                  class="h-full w-full object-cover"
                />
              </div>
              <div
                v-else
                class="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center"
              >
                <ImageIcon :size="16" class="text-gray-300" />
              </div>
              <ChevronRight :size="18" class="text-gray-300" />
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Recent photos gallery -->
      <div v-if="diaryStore.allPhotos.length > 0" class="mt-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-3">Letzte Fotos</h2>
        <div class="grid grid-cols-3 gap-2 sm:grid-cols-4">
          <div
            v-for="photo in diaryStore.allPhotos.slice(0, 8)"
            :key="photo.id"
            class="aspect-square rounded-xl overflow-hidden bg-gray-100"
          >
            <img
              :src="photo.base64"
              :alt="photo.caption || 'Foto'"
              class="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
