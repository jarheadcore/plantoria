<script setup lang="ts">
import type { RadarDataPoint } from '@/types'

const props = withDefaults(defineProps<{
  data: RadarDataPoint[]
  size?: number
}>(), {
  size: 280,
})

const center = computed(() => props.size / 2)
const radius = computed(() => props.size / 2 - 40)

// Calculate point position on the radar for a given axis index and value (0-100)
function getPoint(index: number, value: number): { x: number; y: number } {
  const count = props.data.length
  const angle = (Math.PI * 2 * index) / count - Math.PI / 2
  const r = (value / 100) * radius.value
  return {
    x: center.value + r * Math.cos(angle),
    y: center.value + r * Math.sin(angle),
  }
}

// Generate polygon points string
function polygonPoints(getValue: (d: RadarDataPoint) => number): string {
  return props.data
    .map((d, i) => {
      const pt = getPoint(i, getValue(d))
      return `${pt.x},${pt.y}`
    })
    .join(' ')
}

// Grid circles at 25%, 50%, 75%, 100%
const gridLevels = [25, 50, 75, 100]

// Label positions (slightly outside the chart)
function getLabelPos(index: number) {
  const count = props.data.length
  const angle = (Math.PI * 2 * index) / count - Math.PI / 2
  const r = radius.value + 24
  return {
    x: center.value + r * Math.cos(angle),
    y: center.value + r * Math.sin(angle),
  }
}
</script>

<template>
  <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`" class="overflow-visible">
    <!-- Grid circles -->
    <circle
      v-for="level in gridLevels"
      :key="level"
      :cx="center"
      :cy="center"
      :r="(level / 100) * radius"
      fill="none"
      stroke="currentColor"
      class="text-gray-200 dark:text-gray-700"
      stroke-width="1"
    />

    <!-- Grid lines (axes) -->
    <line
      v-for="(_, i) in data"
      :key="`axis-${i}`"
      :x1="center"
      :y1="center"
      :x2="getPoint(i, 100).x"
      :y2="getPoint(i, 100).y"
      stroke="currentColor"
      class="text-gray-200 dark:text-gray-700"
      stroke-width="1"
    />

    <!-- Target polygon (100% reference) -->
    <polygon
      :points="polygonPoints(() => 100)"
      fill="none"
      stroke="currentColor"
      class="text-gray-300 dark:text-gray-600"
      stroke-width="1"
      stroke-dasharray="4 3"
    />

    <!-- Actual value polygon -->
    <polygon
      :points="polygonPoints((d) => d.actual)"
      fill="currentColor"
      class="text-green-500/20"
      stroke="currentColor"
      stroke-width="2"
    />

    <!-- Value dots -->
    <circle
      v-for="(d, i) in data"
      :key="`dot-${i}`"
      :cx="getPoint(i, d.actual).x"
      :cy="getPoint(i, d.actual).y"
      r="4"
      fill="currentColor"
      class="text-green-600"
    />

    <!-- Labels -->
    <text
      v-for="(d, i) in data"
      :key="`label-${i}`"
      :x="getLabelPos(i).x"
      :y="getLabelPos(i).y"
      text-anchor="middle"
      dominant-baseline="central"
      class="fill-gray-600 dark:fill-gray-400 text-sm font-bold"
    >
      {{ d.shortName }}
    </text>

    <!-- Value labels next to dots -->
    <text
      v-for="(d, i) in data"
      :key="`val-${i}`"
      :x="getPoint(i, d.actual).x"
      :y="getPoint(i, d.actual).y - 12"
      text-anchor="middle"
      class="fill-green-700 dark:fill-green-400 text-xs font-bold"
    >
      {{ d.actual }}%
    </text>
  </svg>
</template>
