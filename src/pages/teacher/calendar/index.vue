<script setup lang="ts">
import { useCalendarStore } from '@/stores/calendar'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

definePageMeta({ layout: 'teacher' })

const calendarStore = useCalendarStore()

const viewMode = ref<'month' | 'week'>('month')

const monthNames = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
]

const weekDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

const calendarDays = computed(() => {
  const year = calendarStore.currentYear
  const month = calendarStore.currentMonth - 1 // 0-indexed for Date
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  // Monday-based week: 0=Mon, 6=Sun
  let startDow = firstDay.getDay() - 1
  if (startDow < 0) startDow = 6

  const days: { day: number; date: string; entries: typeof calendarStore.currentMonthEntries.value; isCurrentMonth: boolean }[] = []

  // Padding days from previous month
  for (let i = startDow - 1; i >= 0; i--) {
    const d = new Date(year, month, -i)
    days.push({ day: d.getDate(), date: '', entries: [], isCurrentMonth: false })
  }

  // Days of current month
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const entries = calendarStore.currentMonthEntries.filter((e) => e.date === dateStr)
    days.push({ day: d, date: dateStr, entries, isCurrentMonth: true })
  }

  // Padding days to fill last row
  const remaining = 7 - (days.length % 7)
  if (remaining < 7) {
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, date: '', entries: [], isCurrentMonth: false })
    }
  }

  return days
})

function entryColor(type: string) {
  switch (type) {
    case 'task': return 'bg-blue-500'
    case 'seasonal': return 'bg-green-500'
    case 'harvest_market': return 'bg-orange-500'
    case 'milestone': return 'bg-violet-500'
    default: return 'bg-gray-400'
  }
}
</script>

<template>
  <div>
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Kalender</h1>
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-1">
          <UButton variant="ghost" size="sm" @click="calendarStore.prevMonth()">
            <ChevronLeft :size="16" />
          </UButton>
          <span class="min-w-[140px] text-center font-semibold">
            {{ monthNames[calendarStore.currentMonth - 1] }} {{ calendarStore.currentYear }}
          </span>
          <UButton variant="ghost" size="sm" @click="calendarStore.nextMonth()">
            <ChevronRight :size="16" />
          </UButton>
        </div>
        <UButton variant="soft" size="sm" @click="calendarStore.goToToday()">
          Heute
        </UButton>
      </div>
    </div>

    <!-- View toggle -->
    <div class="mb-4 flex gap-2">
      <UButton
        :variant="viewMode === 'month' ? 'solid' : 'ghost'"
        :color="viewMode === 'month' ? 'primary' : 'neutral'"
        size="sm"
        @click="viewMode = 'month'"
      >
        Monat
      </UButton>
      <UButton
        :variant="viewMode === 'week' ? 'solid' : 'ghost'"
        :color="viewMode === 'week' ? 'primary' : 'neutral'"
        size="sm"
        @click="viewMode = 'week'"
      >
        Woche
      </UButton>
    </div>

    <!-- Calendar grid -->
    <div class="overflow-x-auto">
      <div class="min-w-[600px]">
        <!-- Week day headers -->
        <div class="grid grid-cols-7 gap-px mb-1">
          <div
            v-for="day in weekDays"
            :key="day"
            class="py-2 text-center text-xs font-semibold text-gray-500"
          >
            {{ day }}
          </div>
        </div>

        <!-- Day cells -->
        <div class="grid grid-cols-7 gap-px rounded-lg border border-gray-200 bg-gray-200 dark:border-gray-800 dark:bg-gray-800 overflow-hidden">
          <div
            v-for="(cell, idx) in calendarDays"
            :key="idx"
            :class="[
              'min-h-[80px] p-1.5 bg-white dark:bg-gray-900',
              !cell.isCurrentMonth ? 'opacity-40' : '',
            ]"
          >
            <div class="text-xs font-medium text-gray-500 mb-1">{{ cell.day }}</div>
            <div class="space-y-0.5">
              <div
                v-for="entry in cell.entries.slice(0, 3)"
                :key="entry.id"
                :class="['flex items-center gap-1 rounded px-1 py-0.5']"
              >
                <span :class="['h-1.5 w-1.5 rounded-full shrink-0', entryColor(entry.type)]" />
                <span class="text-[10px] truncate">{{ entry.title }}</span>
              </div>
              <div v-if="cell.entries.length > 3" class="text-[10px] text-gray-400 px-1">
                +{{ cell.entries.length - 3 }} mehr
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Legend -->
    <div class="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
      <span class="flex items-center gap-1"><span class="h-2 w-2 rounded-full bg-blue-500" /> Aufgaben</span>
      <span class="flex items-center gap-1"><span class="h-2 w-2 rounded-full bg-green-500" /> Saisonal</span>
      <span class="flex items-center gap-1"><span class="h-2 w-2 rounded-full bg-orange-500" /> Harvest-Markt</span>
      <span class="flex items-center gap-1"><span class="h-2 w-2 rounded-full bg-violet-500" /> Meilensteine</span>
    </div>

    <!-- Seasonal tips -->
    <div class="mt-6">
      <h2 class="text-lg font-semibold mb-3">
        Saisonale Hinweise für {{ monthNames[calendarStore.currentMonth - 1] }}
      </h2>
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
      <p v-if="calendarStore.currentMonthTips.length === 0" class="text-sm text-gray-400 italic">
        Keine saisonalen Hinweise für diesen Monat.
      </p>
    </div>
  </div>
</template>
