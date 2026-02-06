<script setup lang="ts">
import { useStudentsStore } from '@/stores/students'
import { useProjectsStore } from '@/stores/projects'
import { useTeacherStore } from '@/stores/teacher'

definePageMeta({ layout: 'teacher' })

const studentsStore = useStudentsStore()
const projectsStore = useProjectsStore()
const teacherStore = useTeacherStore()

const viewMode = ref<'list' | 'groups'>('list')
const selectedProjectId = ref('proj-1')

const projectOptions = computed(() =>
  projectsStore.projects.map((p) => ({ label: p.name, value: p.id })),
)

const selectedProjectGroups = computed(() =>
  projectsStore.getGroupsByProjectId(selectedProjectId.value),
)

function getStudentGroup(studentId: string) {
  for (const g of projectsStore.groups) {
    if (g.studentIds.includes(studentId) && g.name !== 'Nicht zugewiesen') {
      return g.name
    }
  }
  return '--'
}

function getStudentTasks(studentId: string) {
  // simplified: return random-ish progress based on student index
  const idx = studentsStore.students.findIndex((s) => s.id === studentId)
  const total = 8
  const done = Math.min(total, Math.max(1, Math.floor((idx * 7 + 3) % total)))
  return { done, total }
}

function getStudentProgress(studentId: string) {
  const { done, total } = getStudentTasks(studentId)
  return Math.round((done / total) * 100)
}

function getStudentNames(ids: string[]) {
  return studentsStore.getStudentsByIds(ids).map((s) => s.name).join(', ')
}
</script>

<template>
  <div>
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Schüler</h1>
        <p class="text-sm text-gray-500 mt-1">
          Klasse: {{ teacherStore.activeClass.name }} | {{ studentsStore.students.length }} Schüler
        </p>
      </div>
      <div class="flex gap-2">
        <UButton
          :variant="viewMode === 'list' ? 'solid' : 'ghost'"
          :color="viewMode === 'list' ? 'primary' : 'neutral'"
          size="sm"
          @click="viewMode = 'list'"
        >
          Listenansicht
        </UButton>
        <UButton
          :variant="viewMode === 'groups' ? 'solid' : 'ghost'"
          :color="viewMode === 'groups' ? 'primary' : 'neutral'"
          size="sm"
          @click="viewMode = 'groups'"
        >
          Gruppenansicht
        </UButton>
      </div>
    </div>

    <!-- List view -->
    <div v-if="viewMode === 'list'">
      <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Gruppe</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Aufgaben</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Fortschritt</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="student in studentsStore.students" :key="student.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td class="px-4 py-3 text-sm font-medium">{{ student.name }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ getStudentGroup(student.id) }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">
                {{ getStudentTasks(student.id).done }}/{{ getStudentTasks(student.id).total }}
              </td>
              <td class="px-4 py-3 w-40">
                <ProgressBar :value="getStudentProgress(student.id)" size="sm" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-4 flex gap-2">
        <UButton variant="soft" color="primary" disabled>Gruppen verwalten</UButton>
        <UButton variant="soft" color="primary" disabled>Schüler zu Projekt zuweisen</UButton>
      </div>
    </div>

    <!-- Group view -->
    <div v-if="viewMode === 'groups'">
      <div class="mb-4">
        <USelect v-model="selectedProjectId" :items="projectOptions" class="w-64" />
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <UCard v-for="group in selectedProjectGroups" :key="group.id">
          <div class="flex items-start justify-between mb-2">
            <h3 class="font-semibold">
              {{ group.name === 'Nicht zugewiesen' ? '⚠️' : '🌻' }}
              {{ group.name }}
            </h3>
            <UButton
              v-if="group.name !== 'Nicht zugewiesen'"
              size="xs"
              variant="ghost"
              disabled
            >
              Bearbeiten
            </UButton>
            <UButton v-else size="xs" variant="soft" color="primary" disabled>
              Zuweisen
            </UButton>
          </div>
          <p class="text-sm text-gray-500 mb-2">{{ getStudentNames(group.studentIds) }}</p>
          <p v-if="group.tasksTotal" class="text-xs text-gray-400">
            Aufgaben: {{ group.tasksCompleted }}/{{ group.tasksTotal }} erledigt
          </p>
        </UCard>
      </div>

      <UButton color="primary" variant="soft" class="mt-4" disabled>
        + Neue Gruppe
      </UButton>
    </div>
  </div>
</template>
