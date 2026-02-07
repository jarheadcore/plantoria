<script setup lang="ts">
import { useTeacherStore } from '@/stores/teacher'
import { useProjectsStore } from '@/stores/projects'
import { useCurriculumStore } from '@/stores/curriculum'
import { useMaterialsStore } from '@/stores/materials'
import { useCalendarStore } from '@/stores/calendar'
import { useTasksStore } from '@/stores/tasks'
import { useSettingsStore } from '@/stores/settings'
import {
  FolderKanban,
  GraduationCap,
  ClipboardList,
  Leaf,
  Download,
  CalendarDays,
  Palmtree,
} from 'lucide-vue-next'

definePageMeta({ layout: 'teacher' })

const teacherStore = useTeacherStore()
const projectsStore = useProjectsStore()
const curriculumStore = useCurriculumStore()
const materialsStore = useMaterialsStore()
const calendarStore = useCalendarStore()
const tasksStore = useTasksStore()
const settingsStore = useSettingsStore()

const upcomingTasks = computed(() => tasksStore.upcomingTasks.slice(0, 5))

const weekEntries = computed(() => calendarStore.currentWeekEntries.slice(0, 5))

// Next holiday calculation
const nextHoliday = computed(() => {
  const now = new Date(2026, 4, 6) // "today" = May 6, 2026
  const upcoming = settingsStore.globalSettings.schoolHolidays
    .map((h) => ({ ...h, startObj: new Date(h.startDate) }))
    .filter((h) => h.startObj > now)
    .sort((a, b) => a.startObj.getTime() - b.startObj.getTime())
  return upcoming[0] || null
})

const daysUntilHoliday = computed(() => {
  if (!nextHoliday.value) return null
  const now = new Date(2026, 4, 6)
  const diff = nextHoliday.value.startObj.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
})

const holidayTaskCount = computed(() => tasksStore.holidayTasks.length)

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
        Klasse: <strong>{{ teacherStore.activeClass.name }}</strong> | Schuljahr {{ teacherStore.activeClass.schoolYear }}
      </p>
    </div>

    <!-- Holiday notice -->
    <div v-if="nextHoliday && daysUntilHoliday !== null && daysUntilHoliday <= 30" class="mb-6">
      <div class="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
        <div class="flex items-start gap-3">
          <Palmtree :size="20" class="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p class="text-sm font-medium text-amber-800 dark:text-amber-300">
              {{ nextHoliday.name }} in {{ daysUntilHoliday }} Tagen
            </p>
            <p class="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
              {{ holidayTaskCount }} Ferienaufgabe{{ holidayTaskCount !== 1 ? 'n' : '' }} vorbereitet
            </p>
            <NuxtLink to="/teacher/tasks" class="text-xs text-amber-700 hover:text-amber-800 underline mt-1 inline-block">
              Ferienaufgaben verwalten &rarr;
            </NuxtLink>
          </div>
        </div>
      </div>
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
                :color="project.status === 'Laufend' ? 'green' : 'neutral'"
                variant="subtle"
                size="sm"
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
            Alle Projekte &rarr;
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
            LP21-Tracking &rarr;
          </NuxtLink>
        </template>
      </UCard>

      <!-- Upcoming Tasks (from Aufgabenpool) -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <ClipboardList :size="18" class="text-green-600" />
            <span class="font-semibold">Anstehende Aufgaben</span>
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
              @change="tasksStore.toggleTask(task.id)"
            />
            <span class="flex-1 truncate">
              {{ task.title }}
              <UBadge v-if="task.isHolidayTask" color="neutral" variant="subtle" size="sm" class="ml-1">Ferien</UBadge>
            </span>
            <span class="text-xs text-gray-400 tabular-nums">{{ formatDate(task.dueDate) }}</span>
          </li>
        </ul>
        <template #footer>
          <NuxtLink to="/teacher/tasks" class="text-sm text-green-600 hover:text-green-700">
            Aufgabenpool &rarr;
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
            <span class="mt-0.5 text-green-500">&bull;</span>
            <span>{{ tip.text }}</span>
          </li>
        </ul>
        <template #footer>
          <NuxtLink to="/teacher/calendar" class="text-sm text-green-600 hover:text-green-700">
            Saisonkalender &rarr;
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
            Alle Downloads &rarr;
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
                entry.type === 'milestone' ? 'bg-violet-500' :
                'bg-gray-400',
              ]"
            />
            <span class="text-xs text-gray-400 tabular-nums">{{ formatDate(entry.date) }}</span>
            <span class="truncate">{{ entry.title }}</span>
          </li>
          <li v-if="weekEntries.length === 0" class="text-sm text-gray-400 italic">
            Keine Einträge diese Woche.
          </li>
        </ul>
        <template #footer>
          <NuxtLink to="/teacher/calendar" class="text-sm text-green-600 hover:text-green-700">
            Zum Kalender &rarr;
          </NuxtLink>
        </template>
      </UCard>
    </div>
  </div>
</template>
