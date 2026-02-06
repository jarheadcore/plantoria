<script setup lang="ts">
import { useStudentsStore } from '@/stores/students'
import { useProjectsStore } from '@/stores/projects'
import { useTeacherStore } from '@/stores/teacher'
import { Plus, Pencil, UserPlus } from 'lucide-vue-next'

definePageMeta({ layout: 'teacher' })

const studentsStore = useStudentsStore()
const projectsStore = useProjectsStore()
const teacherStore = useTeacherStore()

const selectedProjectId = ref('proj-1')

const projectOptions = computed(() =>
  projectsStore.projects.map((p) => ({ label: p.name, value: p.id })),
)

const selectedProjectGroups = computed(() =>
  projectsStore.getGroupsByProjectId(selectedProjectId.value),
)

function getStudentNames(ids: string[]) {
  return studentsStore.getStudentsByIds(ids).map((s) => s.name)
}

// Group CRUD
const showCreateGroup = ref(false)
const showEditGroup = ref(false)
const editingGroup = ref<{ id: string; name: string; studentIds: string[] } | null>(null)
const newGroupName = ref('')
const selectedStudentIds = ref<string[]>([])

const allStudentOptions = computed(() =>
  studentsStore.students.map((s) => ({ label: s.name, value: s.id })),
)

function openCreateGroup() {
  newGroupName.value = ''
  selectedStudentIds.value = []
  showCreateGroup.value = true
}

function createGroup() {
  if (!newGroupName.value.trim()) return
  const newGroup = {
    id: `g-${Date.now()}`,
    projectId: selectedProjectId.value,
    name: newGroupName.value,
    studentIds: selectedStudentIds.value,
    tasksCompleted: 0,
    tasksTotal: 0,
  }
  projectsStore.groups.push(newGroup)
  showCreateGroup.value = false
}

function openEditGroup(group: typeof selectedProjectGroups.value[0]) {
  editingGroup.value = { id: group.id, name: group.name, studentIds: [...group.studentIds] }
  showEditGroup.value = true
}

function saveEditGroup() {
  if (!editingGroup.value) return
  const idx = projectsStore.groups.findIndex((g) => g.id === editingGroup.value!.id)
  if (idx !== -1) {
    const group = projectsStore.groups[idx]
    if (group) {
      group.name = editingGroup.value.name
      group.studentIds = editingGroup.value.studentIds
    }
  }
  showEditGroup.value = false
}

function deleteGroup(groupId: string) {
  projectsStore.groups = projectsStore.groups.filter((g) => g.id !== groupId)
}
</script>

<template>
  <div>
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Schüler & Gruppen</h1>
        <p class="text-sm text-gray-500 mt-1">
          Klasse: {{ teacherStore.activeClass.name }} | {{ studentsStore.students.length }} Schüler
        </p>
      </div>
      <div class="flex gap-2">
        <UButton color="primary" size="sm" @click="openCreateGroup">
          <Plus :size="16" class="mr-1" /> Neue Gruppe
        </UButton>
      </div>
    </div>

    <!-- Project selector -->
    <div class="mb-4">
      <USelect v-model="selectedProjectId" :items="projectOptions" class="w-64" />
    </div>

    <!-- Group cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <UCard v-for="group in selectedProjectGroups" :key="group.id">
        <div class="flex items-start justify-between mb-2">
          <h3 class="font-semibold">
            {{ group.name === 'Nicht zugewiesen' ? '&#9888;' : '&#127803;' }}
            {{ group.name }}
          </h3>
          <div class="flex gap-1">
            <UButton
              v-if="group.name !== 'Nicht zugewiesen'"
              size="xs"
              variant="ghost"
              @click="openEditGroup(group)"
            >
              <Pencil :size="14" />
            </UButton>
            <UButton
              v-if="group.name !== 'Nicht zugewiesen'"
              size="xs"
              variant="ghost"
              color="neutral"
              @click="deleteGroup(group.id)"
            >
              &times;
            </UButton>
          </div>
        </div>

        <div class="flex flex-wrap gap-1 mb-2">
          <UBadge
            v-for="name in getStudentNames(group.studentIds)"
            :key="name"
            color="neutral"
            variant="subtle"
            size="xs"
          >
            {{ name }}
          </UBadge>
          <span v-if="group.studentIds.length === 0" class="text-xs text-gray-400 italic">
            Keine Schüler zugewiesen
          </span>
        </div>

        <p v-if="group.tasksTotal" class="text-xs text-gray-400">
          Aufgaben: {{ group.tasksCompleted }}/{{ group.tasksTotal }} erledigt
        </p>
      </UCard>
    </div>

    <!-- Create group modal -->
    <UModal v-model:open="showCreateGroup">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-4">Neue Gruppe erstellen</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Gruppenname</label>
              <UInput v-model="newGroupName" placeholder="z.B. Sonnenblume" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Schüler zuweisen</label>
              <div class="max-h-48 overflow-y-auto space-y-1 rounded-lg border border-gray-200 p-2 dark:border-gray-700">
                <label
                  v-for="student in allStudentOptions"
                  :key="student.value"
                  class="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    :value="student.value"
                    v-model="selectedStudentIds"
                    class="h-4 w-4 rounded text-green-600"
                  />
                  <span class="text-sm">{{ student.label }}</span>
                </label>
              </div>
            </div>
          </div>
          <div class="mt-6 flex justify-end gap-2">
            <UButton variant="ghost" @click="showCreateGroup = false">Abbrechen</UButton>
            <UButton color="primary" @click="createGroup">Erstellen</UButton>
          </div>
        </div>
      </template>
    </UModal>

    <!-- Edit group modal -->
    <UModal v-model:open="showEditGroup">
      <template #content>
        <div class="p-6" v-if="editingGroup">
          <h3 class="text-lg font-semibold mb-4">Gruppe bearbeiten</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Gruppenname</label>
              <UInput v-model="editingGroup.name" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Schüler zuweisen</label>
              <div class="max-h-48 overflow-y-auto space-y-1 rounded-lg border border-gray-200 p-2 dark:border-gray-700">
                <label
                  v-for="student in allStudentOptions"
                  :key="student.value"
                  class="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    :value="student.value"
                    v-model="editingGroup.studentIds"
                    class="h-4 w-4 rounded text-green-600"
                  />
                  <span class="text-sm">{{ student.label }}</span>
                </label>
              </div>
            </div>
          </div>
          <div class="mt-6 flex justify-end gap-2">
            <UButton variant="ghost" @click="showEditGroup = false">Abbrechen</UButton>
            <UButton color="primary" @click="saveEditGroup">Speichern</UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
