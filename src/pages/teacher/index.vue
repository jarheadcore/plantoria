<script setup lang="ts">
import { useTeacherStore } from '@/stores/teacher'
import { useProjectsStore } from '@/stores/projects'
import { useCurriculumStore } from '@/stores/curriculum'
import { useMaterialsStore } from '@/stores/materials'
import { useCalendarStore } from '@/stores/calendar'
import {
  FolderKanban,
  GraduationCap,
  CheckSquare,
  Leaf,
  Download,
  CalendarDays,
} from 'lucide-vue-next'

definePageMeta({ layout: 'teacher' })

const teacherStore = useTeacherStore()
const projectsStore = useProjectsStore()
const curriculumStore = useCurriculumStore()
const materialsStore = useMaterialsStore()
const calendarStore = useCalendarStore()

const upcomingTasks = computed(() =>
  projectsStore.tasks
    .filter((t) => t.status !== 'Erledigt')
    .sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''))
    .slice(0, 5),
)

const weekEntries = computed(() => calendarStore.entries.slice(0, 5))

function formatDate(date?: string) {
  if (!date) return '--'
  const d = new Date(date)
  return d.toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit' })
}
</script>

<template>
  <div>
    <!-- Welcome -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Willkommen, {{ teacherStore.teacher.name.split(' ')[0] }}!
      </h1>
      <p class="text-sm text-gray-500 mt-1">
        Klasse: {{ teacherStore.activeClass.name }} | Schuljahr {{ teacherStore.activeClass.schoolYear }}
      </p>
    </div>

    <!-- Dashboard grid -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <!-- Active Projects -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <FolderKanban :size="18" class="text-green-600" />
              <span class="font-semibold">Aktive Projekte</span>
            </div>
            <UBadge color="primary" variant="subtle">{{ projectsStore.activeProjects.length }}</UBadge>
          </div>
        </template>
        <div class="space-y-4">
          <NuxtLink
            v-for="project in projectsStore.activeProjects"
            :key="project.id"
            :to="`/teacher/projects/${project.id}`"
            class="block rounded-lg border border-gray-100 p-3 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50 transition-colors"
          >
            <div class="flex items-center justify-between mb-1">
              <span class="font-medium text-sm">{{ project.name }}</span>
              <UBadge
                :color="project.status === 'Laufend' ? 'success' : 'warning'"
                variant="subtle"
                size="xs"
              >
                {{ project.status }}
              </UBadge>
            </div>
            <p class="text-xs text-gray-500 mb-2">Phase: {{ project.currentPhase }}</p>
            <ProgressBar :value="project.progress" size="sm" />
          </NuxtLink>
        </div>
        <template #footer>
          <NuxtLink to="/teacher/projects" class="text-sm text-green-600 hover:text-green-700">
            Alle Projekte →
          </NuxtLink>
        </template>
      </UCard>

      <!-- LP21 Progress -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <GraduationCap :size="18" class="text-green-600" />
            <span class="font-semibold">LP21-Fortschritt</span>
          </div>
        </template>
        <div class="space-y-4">
          <div v-for="sub in curriculumStore.progress.bySubject" :key="sub.shortName">
            <div class="flex items-center justify-between mb-1">
              <span class="text-sm font-medium">{{ sub.shortName }}</span>
              <span class="text-xs text-gray-500">{{ sub.coveragePercent }}%</span>
            </div>
            <ProgressBar :value="sub.coveragePercent" :show-label="false" size="sm" />
          </div>
          <div class="border-t border-gray-100 pt-3 dark:border-gray-800">
            <div class="flex items-center justify-between mb-1">
              <span class="text-sm font-semibold">Gesamt</span>
              <span class="text-sm font-semibold text-green-600">{{ curriculumStore.progress.coveragePercent }}%</span>
            </div>
            <ProgressBar :value="curriculumStore.progress.coveragePercent" :show-label="false" />
          </div>
        </div>
        <template #footer>
          <NuxtLink to="/teacher/curriculum" class="text-sm text-green-600 hover:text-green-700">
            LP21-Tracking →
          </NuxtLink>
        </template>
      </UCard>

      <!-- Upcoming Tasks -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <CheckSquare :size="18" class="text-green-600" />
            <span class="font-semibold">Nächste Aufgaben</span>
          </div>
        </template>
        <ul class="space-y-2">
          <li
            v-for="task in upcomingTasks"
            :key="task.id"
            class="flex items-center gap-3 text-sm"
          >
            <input
              type="checkbox"
              class="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              :checked="task.status === 'Erledigt'"
              @change="projectsStore.toggleTask(task.id)"
            />
            <span class="flex-1 truncate">{{ task.title }}</span>
            <span class="text-xs text-gray-400 tabular-nums">{{ formatDate(task.dueDate) }}</span>
          </li>
        </ul>
        <template #footer>
          <NuxtLink to="/teacher/projects" class="text-sm text-green-600 hover:text-green-700">
            Alle Aufgaben →
          </NuxtLink>
        </template>
      </UCard>

      <!-- Seasonal Tips -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <Leaf :size="18" class="text-green-600" />
            <span class="font-semibold">Saisonale Hinweise</span>
          </div>
        </template>
        <ul class="space-y-2">
          <li
            v-for="tip in calendarStore.currentMonthTips"
            :key="tip.id"
            class="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
          >
            <span class="mt-0.5 text-green-500">•</span>
            <span>{{ tip.text }}</span>
          </li>
        </ul>
        <template #footer>
          <NuxtLink to="/teacher/calendar" class="text-sm text-green-600 hover:text-green-700">
            Saisonkalender →
          </NuxtLink>
        </template>
      </UCard>

      <!-- Recent Downloads -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <Download :size="18" class="text-green-600" />
            <span class="font-semibold">Letzte Downloads</span>
          </div>
        </template>
        <ul class="space-y-2">
          <li
            v-for="dl in materialsStore.recentDownloads.slice(0, 5)"
            :key="dl.id"
            class="flex items-center justify-between text-sm"
          >
            <span class="truncate">{{ dl.materialTitle }}</span>
            <span class="text-xs text-gray-400 tabular-nums ml-2">{{ formatDate(dl.date) }}</span>
          </li>
        </ul>
        <template #footer>
          <NuxtLink to="/teacher/materials" class="text-sm text-green-600 hover:text-green-700">
            Alle Downloads →
          </NuxtLink>
        </template>
      </UCard>

      <!-- Calendar Week -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <CalendarDays :size="18" class="text-green-600" />
            <span class="font-semibold">Kalender (Woche)</span>
          </div>
        </template>
        <ul class="space-y-2">
          <li
            v-for="entry in weekEntries"
            :key="entry.id"
            class="flex items-center gap-3 text-sm"
          >
            <span
              :class="[
                'h-2 w-2 rounded-full shrink-0',
                entry.type === 'task' ? 'bg-blue-500' :
                entry.type === 'seasonal' ? 'bg-green-500' :
                entry.type === 'harvest_market' ? 'bg-orange-500' :
                'bg-violet-500',
              ]"
            />
            <span class="text-xs text-gray-400 tabular-nums">{{ formatDate(entry.date) }}</span>
            <span class="truncate">{{ entry.title }}</span>
          </li>
        </ul>
        <template #footer>
          <NuxtLink to="/teacher/calendar" class="text-sm text-green-600 hover:text-green-700">
            Zum Kalender →
          </NuxtLink>
        </template>
      </UCard>
    </div>
  </div>
</template>
