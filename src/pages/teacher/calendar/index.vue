<script setup lang="ts">
import { useCalendarStore } from '@/stores/calendar'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import type { CalendarEntry } from '@/types'
import { getGroupIcon } from '@/data/group-icons'

definePageMeta({ layout: 'teacher' })

const calendarStore = useCalendarStore()

const monthNames = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
]

const weekDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

const calendarDays = computed(() => {
  const year = calendarStore.currentYear
  const month = calendarStore.currentMonth - 1
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  let startDow = firstDay.getDay() - 1
  if (startDow < 0) startDow = 6

  const days: { day: number; date: string; entries: CalendarEntry[]; isCurrentMonth: boolean; isHoliday: boolean; holidayName?: string }[] = []

  for (let i = startDow - 1; i >= 0; i--) {
    const d = new Date(year, month, -i)
    const holiday = calendarStore.isHoliday(d)
    days.push({ day: d.getDate(), date: '', entries: [], isCurrentMonth: false, isHoliday: !!holiday, holidayName: holiday?.name })
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const entries = calendarStore.currentMonthEntries.filter((e) => e.date === dateStr)
    const dateObj = new Date(year, month, d)
    const holiday = calendarStore.isHoliday(dateObj)
    days.push({ day: d, date: dateStr, entries, isCurrentMonth: true, isHoliday: !!holiday, holidayName: holiday?.name })
  }

  const remaining = 7 - (days.length % 7)
  if (remaining < 7) {
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i)
      const holiday = calendarStore.isHoliday(d)
      days.push({ day: i, date: '', entries: [], isCurrentMonth: false, isHoliday: !!holiday, holidayName: holiday?.name })
    }
  }

  return days
})

// Week view
const weekDates = computed(() => {
  const start = calendarStore.currentWeekStart
  const dates: { date: Date; dateStr: string; dayLabel: string; entries: CalendarEntry[]; isHoliday: boolean; holidayName?: string }[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(start)
    d.setDate(d.getDate() + i)
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    const entries = calendarStore.entries.filter((e) => e.date === dateStr)
    const holiday = calendarStore.isHoliday(d)
    dates.push({
      date: d,
      dateStr,
      dayLabel: `${weekDays[i]} ${d.getDate()}.${d.getMonth() + 1}.`,
      entries,
      isHoliday: !!holiday,
      holidayName: holiday?.name,
    })
  }
  return dates
})

const weekLabel = computed(() => {
  const start = calendarStore.currentWeekStart
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  return `${start.getDate()}.${start.getMonth() + 1}. – ${end.getDate()}.${end.getMonth() + 1}.${end.getFullYear()}`
})

function entryGroupIcon(entry: CalendarEntry) {
  const group = calendarStore.getGroupForEntry(entry)
  if (!group?.icon) return null
  return getGroupIcon(group.icon) ?? null
}

function entryGroupName(entry: CalendarEntry): string | null {
  const group = calendarStore.getGroupForEntry(entry)
  return group ? group.name : null
}

function entryColor(type: string) {
  switch (type) {
    case 'task': return 'bg-blue-500'
    case 'seasonal': return 'bg-green-500'
    case 'milestone': return 'bg-violet-500'
    case 'holiday': return 'bg-amber-400'
    default: return 'bg-gray-400'
  }
}

function handlePrev() {
  if (calendarStore.viewMode === 'month') calendarStore.prevMonth()
  else calendarStore.prevWeek()
}

function handleNext() {
  if (calendarStore.viewMode === 'month') calendarStore.nextMonth()
  else calendarStore.nextWeek()
}

const navLabel = computed(() => {
  if (calendarStore.viewMode === 'month') {
    return `${monthNames[calendarStore.currentMonth - 1]} ${calendarStore.currentYear}`
  }
  return weekLabel.value
})
</script>

<template>
  <div>
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Kalender</h1>
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-1">
          <UButton variant="ghost" size="sm" @click="handlePrev">
            <ChevronLeft :size="16" />
          </UButton>
          <span class="min-w-[180px] text-center font-semibold text-sm">
            {{ navLabel }}
          </span>
          <UButton variant="ghost" size="sm" @click="handleNext">
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
        :variant="calendarStore.viewMode === 'week' ? 'solid' : 'ghost'"
        :color="calendarStore.viewMode === 'week' ? 'primary' : 'neutral'"
        size="sm"
        @click="calendarStore.viewMode = 'week'"
      >
        Woche
      </UButton>
      <UButton
        :variant="calendarStore.viewMode === 'month' ? 'solid' : 'ghost'"
        :color="calendarStore.viewMode === 'month' ? 'primary' : 'neutral'"
        size="sm"
        @click="calendarStore.viewMode = 'month'"
      >
        Monat
      </UButton>
    </div>

    <!-- Week view (default) -->
    <div v-if="calendarStore.viewMode === 'week'" class="overflow-x-auto">
      <div class="min-w-[600px] grid grid-cols-7 gap-2">
        <div
          v-for="day in weekDates"
          :key="day.dateStr"
          :class="[
            'rounded-lg border p-3 min-h-[140px]',
            day.isHoliday
              ? 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800'
              : 'bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-800',
          ]"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-semibold text-gray-500">{{ day.dayLabel }}</span>
            <UBadge v-if="day.isHoliday" color="neutral" variant="subtle" size="sm">
              Ferien
            </UBadge>
          </div>
          <div v-if="day.holidayName" class="text-[10px] text-amber-600 mb-1">{{ day.holidayName }}</div>
          <div class="space-y-1">
            <div
              v-for="entry in day.entries"
              :key="entry.id"
              class="group/entry relative flex items-center gap-1.5 rounded px-1.5 py-1 bg-gray-50 dark:bg-gray-800 cursor-default"
            >
              <span :class="['h-2 w-2 rounded-full shrink-0', entryColor(entry.type)]" />
              <component
                v-if="entryGroupIcon(entry)"
                :is="entryGroupIcon(entry)!.icon"
                :size="16"
                :class="['shrink-0', entryGroupIcon(entry)!.color]"
              />
              <span class="text-xs truncate">{{ entry.title }}</span>
              <span
                v-if="entryGroupName(entry)"
                class="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/entry:flex items-center gap-1 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-[11px] font-medium text-white shadow-lg z-50 dark:bg-gray-700"
              >
                Gruppe: {{ entryGroupName(entry) }}
              </span>
            </div>
            <p v-if="day.entries.length === 0 && !day.isHoliday" class="text-[10px] text-gray-300 italic">
              Keine Einträge
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Month view -->
    <div v-if="calendarStore.viewMode === 'month'" class="overflow-x-auto">
      <div class="min-w-[600px]">
        <div class="grid grid-cols-7 gap-px mb-1">
          <div
            v-for="day in weekDays"
            :key="day"
            class="py-2 text-center text-xs font-semibold text-gray-500"
          >
            {{ day }}
          </div>
        </div>

        <div class="grid grid-cols-7 gap-px rounded-lg border border-gray-200 bg-gray-200 dark:border-gray-800 dark:bg-gray-800 overflow-hidden">
          <div
            v-for="(cell, idx) in calendarDays"
            :key="idx"
            :class="[
              'min-h-[80px] p-1.5',
              cell.isHoliday
                ? 'bg-amber-50/80 dark:bg-amber-950/20'
                : 'bg-white dark:bg-gray-900',
              !cell.isCurrentMonth ? 'opacity-40' : '',
            ]"
          >
            <div class="flex items-center gap-1 mb-1">
              <span class="text-xs font-medium text-gray-500">{{ cell.day }}</span>
              <span v-if="cell.isHoliday && cell.isCurrentMonth" class="text-[8px] text-amber-500 truncate">F</span>
            </div>
            <div class="space-y-0.5">
              <div
                v-for="entry in cell.entries.slice(0, 3)"
                :key="entry.id"
                class="group/entry relative flex items-center gap-1 rounded px-1 py-0.5 cursor-default"
              >
                <span :class="['h-1.5 w-1.5 rounded-full shrink-0', entryColor(entry.type)]" />
                <component
                  v-if="entryGroupIcon(entry)"
                  :is="entryGroupIcon(entry)!.icon"
                  :size="14"
                  :class="['shrink-0', entryGroupIcon(entry)!.color]"
                />
                <span class="text-[10px] truncate">{{ entry.title }}</span>
                <span
                  v-if="entryGroupName(entry)"
                  class="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/entry:flex items-center gap-1 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-[11px] font-medium text-white shadow-lg z-50 dark:bg-gray-700"
                >
                  Gruppe: {{ entryGroupName(entry) }}
                </span>
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
      <span class="flex items-center gap-1"><span class="h-2 w-2 rounded-full bg-violet-500" /> Meilensteine</span>
      <span class="flex items-center gap-1"><span class="h-2 w-2 rounded-full bg-amber-400" /> Schulferien</span>
    </div>

    <!-- School holidays overview -->
    <div class="mt-6">
      <h2 class="text-lg font-semibold mb-3">Schulferien (Kanton AG)</h2>
      <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="holiday in calendarStore.schoolHolidays"
          :key="holiday.id"
          class="rounded-lg border border-amber-200 bg-amber-50/50 p-3 dark:border-amber-800 dark:bg-amber-950/20"
        >
          <span class="text-sm font-medium">{{ holiday.name }}</span>
          <p class="text-xs text-gray-500">
            {{ new Date(holiday.startDate).toLocaleDateString('de-CH') }} –
            {{ new Date(holiday.endDate).toLocaleDateString('de-CH') }}
          </p>
        </div>
      </div>
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
          <span class="mt-0.5 text-green-500">&bull;</span>
          <span>{{ tip.text }}</span>
        </li>
      </ul>
      <p v-if="calendarStore.currentMonthTips.length === 0" class="text-sm text-gray-400 italic">
        Keine saisonalen Hinweise für diesen Monat.
      </p>
    </div>
  </div>
</template>
