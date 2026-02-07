import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CalendarEntry, SeasonalTip, SchoolHoliday, StudentGroup } from '@/types'
import { fixtureCalendarEntries, fixtureSeasonalTips } from '@/data/fixtures/calendar'
import { fixtureSchoolHolidays } from '@/data/fixtures/holidays'
import { useProjectsStore } from '@/stores/projects'

export const useCalendarStore = defineStore('calendar', () => {
  const entries = ref<CalendarEntry[]>(fixtureCalendarEntries)
  const seasonalTips = ref<SeasonalTip[]>(fixtureSeasonalTips)
  const schoolHolidays = ref<SchoolHoliday[]>(fixtureSchoolHolidays)
  const currentMonth = ref(5) // May
  const currentYear = ref(2026)
  const viewMode = ref<'month' | 'week'>('month')

  // Week navigation
  const currentWeekStart = ref(new Date(2026, 4, 4)) // Mon May 4, 2026

  function getEntriesForMonth(month: number, year: number) {
    return entries.value.filter((e) => {
      const d = new Date(e.date)
      return d.getMonth() + 1 === month && d.getFullYear() === year
    })
  }

  function getTipsForMonth(month: number) {
    return seasonalTips.value.filter((t) => t.month === month)
  }

  const currentMonthEntries = computed(() =>
    getEntriesForMonth(currentMonth.value, currentYear.value),
  )

  const currentMonthTips = computed(() => getTipsForMonth(currentMonth.value))

  const currentWeekEntries = computed(() => {
    const start = currentWeekStart.value
    const end = new Date(start)
    end.setDate(end.getDate() + 6)
    return entries.value.filter((e) => {
      const d = new Date(e.date)
      return d >= start && d <= end
    })
  })

  function isHoliday(date: Date): SchoolHoliday | undefined {
    return schoolHolidays.value.find((h) => {
      const start = new Date(h.startDate)
      const end = new Date(h.endDate)
      return date >= start && date <= end
    })
  }

  function nextMonth() {
    if (currentMonth.value === 12) {
      currentMonth.value = 1
      currentYear.value++
    } else {
      currentMonth.value++
    }
  }

  function prevMonth() {
    if (currentMonth.value === 1) {
      currentMonth.value = 12
      currentYear.value--
    } else {
      currentMonth.value--
    }
  }

  function nextWeek() {
    const d = new Date(currentWeekStart.value)
    d.setDate(d.getDate() + 7)
    currentWeekStart.value = d
  }

  function prevWeek() {
    const d = new Date(currentWeekStart.value)
    d.setDate(d.getDate() - 7)
    currentWeekStart.value = d
  }

  function goToToday() {
    currentMonth.value = 5
    currentYear.value = 2026
    currentWeekStart.value = new Date(2026, 4, 4)
  }

  function getGroupForEntry(entry: CalendarEntry): StudentGroup | undefined {
    if (!entry.groupId) return undefined
    const projectsStore = useProjectsStore()
    return projectsStore.groups.find((g) => g.id === entry.groupId)
  }

  return {
    entries,
    seasonalTips,
    schoolHolidays,
    currentMonth,
    currentYear,
    viewMode,
    currentWeekStart,
    currentMonthEntries,
    currentMonthTips,
    currentWeekEntries,
    getEntriesForMonth,
    getTipsForMonth,
    isHoliday,
    getGroupForEntry,
    nextMonth,
    prevMonth,
    nextWeek,
    prevWeek,
    goToToday,
  }
})
