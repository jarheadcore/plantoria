import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { GlobalSettings } from '@/types'
import { fixtureSchoolHolidays } from '@/data/fixtures/holidays'

export const useSettingsStore = defineStore('settings', () => {
  const globalSettings = ref<GlobalSettings>({
    id: 'settings-1',
    holidayTaskAdvanceDays: 14,
    schoolHolidays: fixtureSchoolHolidays,
  })

  function updateHolidayAdvanceDays(days: number) {
    globalSettings.value.holidayTaskAdvanceDays = days
  }

  return { globalSettings, updateHolidayAdvanceDays }
})
