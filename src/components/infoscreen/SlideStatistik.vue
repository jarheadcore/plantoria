<script setup lang="ts">
const stats = ref({
  tasksCompleted: 18,
  tasksTotal: 32,
  harvestKg: 4.2,
  activeProjects: 2,
})
</script>

<template>
  <section class="w-full shrink-0 snap-start snap-always overflow-y-auto p-4">
    <div class="space-y-4">
      <div class="p-6 bg-green-100 rounded-2xl text-center">
        <p class="text-6xl font-black text-green-700">
          {{ stats.tasksCompleted }}/{{ stats.tasksTotal }}
        </p>
        <p class="text-base text-green-800 mt-2 font-medium">Aufgaben erledigt</p>
        <div class="w-full bg-green-200 rounded-full h-5 mt-4 overflow-hidden">
          <div
            class="bg-green-500 h-full rounded-full transition-all"
            :style="{ width: (stats.tasksCompleted / stats.tasksTotal) * 100 + '%' }"
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="p-6 bg-amber-50 rounded-2xl text-center shadow-sm">
          <p class="text-5xl font-black text-amber-600">{{ stats.harvestKg }}</p>
          <p class="text-base text-gray-600 mt-1 font-medium">kg Ernte</p>
        </div>
        <div class="p-6 bg-blue-50 rounded-2xl text-center shadow-sm">
          <p class="text-5xl font-black text-blue-600">{{ stats.activeProjects }}</p>
          <p class="text-base text-gray-600 mt-1 font-medium">Projekte</p>
        </div>
      </div>
    </div>
  </section>
</template>
