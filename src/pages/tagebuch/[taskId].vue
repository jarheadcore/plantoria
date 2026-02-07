<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  ArrowLeft,
  Camera,
  Lightbulb,
  Save,
  Trash2,
  CheckCircle2,
  X,
} from 'lucide-vue-next'
import type { DiaryPhoto } from '@/types'
import { useDiaryStore } from '@/stores/diary'

const route = useRoute()
const router = useRouter()
const diaryStore = useDiaryStore()

const taskId = computed(() => route.params.taskId as string)

const diaryTask = computed(() => diaryStore.getDiaryTask(taskId.value))
const existingEntry = computed(() => diaryStore.getEntryByTaskId(taskId.value))

// Form state
const notes = ref('')
const photos = ref<DiaryPhoto[]>([])
const saved = ref(false)

// Lightbox state
const lightboxPhoto = ref<DiaryPhoto | null>(null)

onMounted(() => {
  if (existingEntry.value) {
    notes.value = existingEntry.value.notes
    photos.value = [...existingEntry.value.photos]
  }
})

const fileInput = ref<HTMLInputElement>()

function triggerPhotoUpload() {
  fileInput.value?.click()
}

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  const files = input.files
  if (!files) return

  for (const file of Array.from(files)) {
    if (!file.type.startsWith('image/')) continue
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result as string
      photos.value.push({
        id: `photo-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        base64,
        caption: '',
        takenAt: new Date().toISOString().split('T')[0]!,
      })
    }
    reader.readAsDataURL(file)
  }
  input.value = ''
}

function removePhoto(photoId: string) {
  photos.value = photos.value.filter((p) => p.id !== photoId)
}

function updateCaption(photoId: string, caption: string) {
  const photo = photos.value.find((p) => p.id === photoId)
  if (photo) photo.caption = caption
}

function saveEntry() {
  if (!diaryTask.value) return

  diaryStore.createOrUpdateEntry(
    taskId.value,
    diaryTask.value.projectId,
    diaryTask.value.title,
    {
      notes: notes.value,
      photos: photos.value,
      knowledgeFacts: diaryTask.value.knowledgeFacts,
    },
  )
  saved.value = true
  setTimeout(() => { saved.value = false }, 2000)
}

function markCompleted() {
  saveEntry()
  const entry = diaryStore.getEntryByTaskId(taskId.value)
  if (entry) {
    diaryStore.markEntryCompleted(entry.id)
  }
  router.push('/tagebuch')
}
</script>

<template>
  <div class="min-h-dvh bg-green-50/50">
    <!-- Header -->
    <header class="bg-green-600 text-white px-4 py-3 sticky top-0 z-10">
      <div class="max-w-2xl mx-auto flex items-center gap-3">
        <NuxtLink to="/tagebuch" class="shrink-0">
          <ArrowLeft :size="22" />
        </NuxtLink>
        <h1 class="text-lg font-bold truncate">
          {{ diaryTask?.title || 'Tagebuch' }}
        </h1>
      </div>
    </header>

    <div class="max-w-2xl mx-auto p-4">
      <!-- Not found -->
      <div v-if="!diaryTask" class="text-center py-12">
        <p class="text-gray-500">Aufgabe nicht gefunden.</p>
        <NuxtLink to="/tagebuch" class="text-green-600 hover:text-green-700 text-sm mt-2 inline-block">
          &larr; Zurück zum Tagebuch
        </NuxtLink>
      </div>

      <template v-else>
        <!-- Completed badge -->
        <div v-if="existingEntry?.completed" class="flex items-center gap-1.5 mb-4">
          <CheckCircle2 :size="14" class="text-green-500" />
          <span class="text-xs text-green-600 font-medium">Abgeschlossen</span>
        </div>

        <!-- Knowledge facts -->
        <div v-if="diaryTask.knowledgeFacts.length > 0" class="mb-6 space-y-3">
          <div
            v-for="(fact, i) in diaryTask.knowledgeFacts"
            :key="i"
            class="rounded-xl border border-amber-200 bg-amber-50 p-4"
          >
            <div class="flex items-start gap-2.5">
              <Lightbulb :size="18" class="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h3 class="text-sm font-semibold text-amber-800">
                  {{ fact.title }}
                </h3>
                <p class="text-sm text-amber-700 mt-1">
                  {{ fact.text }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Photo upload section -->
        <div class="mb-6">
          <h2 class="text-sm font-semibold text-gray-900 mb-3">Fotos</h2>

          <!-- Photo grid -->
          <div v-if="photos.length > 0" class="grid grid-cols-2 gap-3 mb-3 sm:grid-cols-3">
            <div
              v-for="photo in photos"
              :key="photo.id"
              class="relative group"
            >
              <div
                class="aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer"
                @click="lightboxPhoto = photo"
              >
                <img
                  :src="photo.base64"
                  :alt="photo.caption || 'Foto'"
                  class="h-full w-full object-cover"
                />
              </div>
              <button
                class="absolute top-1.5 right-1.5 h-7 w-7 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                @click.stop="removePhoto(photo.id)"
              >
                <Trash2 :size="14" />
              </button>
              <input
                :value="photo.caption"
                type="text"
                placeholder="Beschreibung..."
                class="mt-1.5 w-full text-xs rounded-lg border border-gray-200 px-2 py-1.5 focus:border-green-400 focus:ring-1 focus:ring-green-400"
                @input="updateCaption(photo.id, ($event.target as HTMLInputElement).value)"
              />
            </div>
          </div>

          <!-- Upload button (large touch target for mobile) -->
          <button
            class="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-white py-6 text-sm text-gray-500 hover:border-green-400 hover:bg-green-50 hover:text-green-600 active:bg-green-100 transition-colors"
            @click="triggerPhotoUpload"
          >
            <Camera :size="20" />
            <span>Foto aufnehmen oder hochladen</span>
          </button>
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            capture="environment"
            multiple
            class="hidden"
            @change="handleFileSelect"
          />
        </div>

        <!-- Notes -->
        <div class="mb-6">
          <h2 class="text-sm font-semibold text-gray-900 mb-3">Notizen</h2>
          <textarea
            v-model="notes"
            rows="5"
            placeholder="Was habt ihr beobachtet? Wie sehen die Pflanzen aus? Was ist aufgefallen?"
            class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-green-400 focus:ring-1 focus:ring-green-400 resize-none"
          />
        </div>

        <!-- Actions (large touch targets for mobile) -->
        <div class="flex flex-col gap-3 pb-6">
          <button
            class="w-full rounded-xl bg-green-600 text-white font-medium py-3.5 text-sm flex items-center justify-center gap-2 hover:bg-green-700 active:bg-green-800 transition-colors"
            @click="saveEntry"
          >
            <Save :size="18" />
            {{ saved ? 'Gespeichert!' : 'Speichern' }}
          </button>
          <button
            v-if="!existingEntry?.completed"
            class="w-full rounded-xl border-2 border-green-600 text-green-700 font-medium py-3.5 text-sm flex items-center justify-center gap-2 hover:bg-green-50 active:bg-green-100 transition-colors"
            @click="markCompleted"
          >
            <CheckCircle2 :size="18" />
            Als erledigt markieren
          </button>
        </div>

        <!-- Lightbox -->
        <Teleport to="body">
          <div
            v-if="lightboxPhoto"
            class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
            @click.self="lightboxPhoto = null"
          >
            <button
              class="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30"
              @click="lightboxPhoto = null"
            >
              <X :size="24" />
            </button>
            <div class="max-w-full max-h-full">
              <img
                :src="lightboxPhoto.base64"
                :alt="lightboxPhoto.caption || 'Foto'"
                class="max-h-[85vh] max-w-full rounded-lg object-contain"
              />
              <p v-if="lightboxPhoto.caption" class="text-center text-white text-sm mt-3">
                {{ lightboxPhoto.caption }}
              </p>
            </div>
          </div>
        </Teleport>
      </template>
    </div>
  </div>
</template>
