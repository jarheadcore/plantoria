import { defineStore } from 'pinia'
import { ref, computed, watch, nextTick } from 'vue'
import type { DiaryEntry, DiaryPhoto, DiaryKnowledgeFact } from '@/types'
import { fixtureDiaryEntries, fixtureDiaryTasks } from '@/data/fixtures/diary'

const STORAGE_KEY = 'plantoria-diary-entries'

function saveEntries(data: DiaryEntry[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch { /* quota exceeded */ }
}

export const useDiaryStore = defineStore('diary', () => {
  // Always start with fixtures; client hydrates from localStorage after SSR payload
  const entries = ref<DiaryEntry[]>([...fixtureDiaryEntries])
  const diaryTasks = ref(fixtureDiaryTasks)
  const _hydrated = ref(false)

  function _hydrateFromStorage() {
    if (_hydrated.value) return
    _hydrated.value = true
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as DiaryEntry[]
        if (Array.isArray(parsed) && parsed.length > 0) {
          entries.value = parsed
        }
      }
    } catch { /* ignore */ }

    // Start persisting after hydration
    watch(entries, (val) => saveEntries(val), { deep: true })
  }

  // Defer hydration to nextTick so it runs AFTER Pinia restores SSR payload
  if (!import.meta.server) {
    nextTick(() => _hydrateFromStorage())
  }

  const entriesByProject = computed(() => (projectId: string) =>
    entries.value.filter((e) => e.projectId === projectId),
  )

  const recentEntries = computed(() =>
    [...entries.value]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 10),
  )

  const allPhotos = computed(() =>
    entries.value
      .flatMap((e) => e.photos.map((p) => ({ ...p, entryId: e.id, taskTitle: e.taskTitle, date: e.date })))
      .sort((a, b) => b.takenAt.localeCompare(a.takenAt)),
  )

  // Milestone photos for infoscreen: completed entries with photos become milestones
  const milestonePhotos = computed(() =>
    entries.value
      .filter((e) => e.photos.length > 0)
      .map((e) => ({
        taskId: e.taskId,
        taskTitle: e.taskTitle,
        date: e.date,
        completed: e.completed,
        photo: e.photos[0]!,
        notes: e.notes,
      }))
      .sort((a, b) => a.date.localeCompare(b.date)),
  )

  function getEntryById(id: string) {
    return entries.value.find((e) => e.id === id)
  }

  function getEntryByTaskId(taskId: string) {
    return entries.value.find((e) => e.taskId === taskId)
  }

  function getDiaryTask(taskId: string) {
    return diaryTasks.value.find((t) => t.taskId === taskId)
  }

  function getDiaryTasksByProject(projectId: string) {
    return diaryTasks.value.filter((t) => t.projectId === projectId)
  }

  function createOrUpdateEntry(
    taskId: string,
    projectId: string,
    taskTitle: string,
    data: { notes: string; photos: DiaryPhoto[]; knowledgeFacts: DiaryKnowledgeFact[] },
  ) {
    const existing = entries.value.find((e) => e.taskId === taskId)
    if (existing) {
      existing.notes = data.notes
      existing.photos = data.photos
      existing.knowledgeFacts = data.knowledgeFacts
      existing.date = new Date().toISOString().split('T')[0]!
    } else {
      entries.value.push({
        id: `diary-${Date.now()}`,
        projectId,
        taskId,
        taskTitle,
        date: new Date().toISOString().split('T')[0]!,
        notes: data.notes,
        photos: data.photos,
        knowledgeFacts: data.knowledgeFacts,
        completed: false,
      })
    }
  }

  function markEntryCompleted(entryId: string) {
    const entry = entries.value.find((e) => e.id === entryId)
    if (entry) entry.completed = true
  }

  function addPhotoToEntry(entryId: string, photo: DiaryPhoto) {
    const entry = entries.value.find((e) => e.id === entryId)
    if (entry) entry.photos.push(photo)
  }

  return {
    entries,
    diaryTasks,
    entriesByProject,
    recentEntries,
    allPhotos,
    milestonePhotos,
    getEntryById,
    getEntryByTaskId,
    getDiaryTask,
    getDiaryTasksByProject,
    createOrUpdateEntry,
    markEntryCompleted,
    addPhotoToEntry,
  }
})
