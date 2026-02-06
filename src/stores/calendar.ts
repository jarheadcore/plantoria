import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CalendarEntry, SeasonalTip } from '@/types'
import { mockCalendarEntries, mockSeasonalTips } from '@/data/mock/calendar'

export const useCalendarStore = defineStore('calendar', () => {
  const entries = ref<CalendarEntry[]>(mockCalendarEntries)
  const seasonalTips = ref<SeasonalTip[]>(mockSeasonalTips)
  const currentMonth = ref(5) // May
  const currentYear = ref(2026)

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

  function goToToday() {
    currentMonth.value = 5
    currentYear.value = 2026
  }

  return {
    entries,
    seasonalTips,
    currentMonth,
    currentYear,
    currentMonthEntries,
    currentMonthTips,
    getEntriesForMonth,
    getTipsForMonth,
    nextMonth,
    prevMonth,
    goToToday,
  }
})
