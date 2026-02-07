<script setup lang="ts">
import type { HeatmapData } from '@/types'

const props = defineProps<{
  data: HeatmapData
}>()

const monthLabels: Record<number, string> = {
  1: 'Jan', 2: 'Feb', 3: 'Mrz', 4: 'Apr', 5: 'Mai', 6: 'Jun',
  7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Okt', 11: 'Nov', 12: 'Dez',
}

function getCellCount(month: number, subject: string): number {
  const cell = props.data.cells.find((c) => c.month === month && c.subject === subject)
  return cell ? cell.count : 0
}

function getCellClass(count: number): string {
  if (count === 0) return 'bg-gray-100 dark:bg-gray-800'
  if (count === 1) return 'bg-green-200 dark:bg-green-900'
  if (count === 2) return 'bg-green-400 dark:bg-green-700'
  return 'bg-green-600 dark:bg-green-500'
}

// Highlight current month
const currentMonth = new Date().getMonth() + 1
</script>

<template>
  <div class="overflow-x-auto">
    <div class="min-w-[500px]">
      <!-- Header row: month labels -->
      <div class="grid gap-1" :style="{ gridTemplateColumns: `60px repeat(${data.months.length}, 1fr)` }">
        <div />
        <div
          v-for="m in data.months"
          :key="m"
          :class="[
            'text-center text-[10px] font-medium pb-1',
            m === currentMonth ? 'text-green-700 dark:text-green-400 font-bold' : 'text-gray-400',
          ]"
        >
          {{ monthLabels[m] }}
        </div>
      </div>

      <!-- Data rows -->
      <div
        v-for="subject in data.subjects"
        :key="subject"
        class="grid gap-1 mb-1"
        :style="{ gridTemplateColumns: `60px repeat(${data.months.length}, 1fr)` }"
      >
        <div class="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center">
          {{ subject }}
        </div>
        <div
          v-for="m in data.months"
          :key="m"
          :class="[
            'h-7 rounded-sm flex items-center justify-center text-[10px] font-medium transition-colors',
            getCellClass(getCellCount(m, subject)),
            getCellCount(m, subject) >= 2 ? 'text-white' : 'text-gray-500 dark:text-gray-400',
            m === currentMonth ? 'ring-1 ring-green-400' : '',
          ]"
        >
          {{ getCellCount(m, subject) || '' }}
        </div>
      </div>

      <!-- Legend -->
      <div class="flex items-center gap-3 mt-3 text-[10px] text-gray-400">
        <span>Legende:</span>
        <div class="flex items-center gap-1">
          <div class="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-800" />
          <span>0</span>
        </div>
        <div class="flex items-center gap-1">
          <div class="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900" />
          <span>1</span>
        </div>
        <div class="flex items-center gap-1">
          <div class="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-700" />
          <span>2</span>
        </div>
        <div class="flex items-center gap-1">
          <div class="w-3 h-3 rounded-sm bg-green-600 dark:bg-green-500" />
          <span>3+</span>
        </div>
      </div>
    </div>
  </div>
</template>
