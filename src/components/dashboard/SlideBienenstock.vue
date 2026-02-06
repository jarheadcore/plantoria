<script setup lang="ts">
const bienenstock = ref([
  { task: 'Bienenvolk beobachten', icon: '🐝', percent: 60, phase: 'Aktiv' },
  { task: 'Honig ernten', icon: '🍯', percent: 25, phase: 'Vorbereitung' },
  { task: 'Waben kontrollieren', icon: '🪹', percent: 80, phase: 'Fertig' },
  { task: 'Blumenwiese pflegen', icon: '🌸', percent: 50, phase: 'Wachstum' },
])
</script>

<template>
  <section class="w-full shrink-0 snap-start snap-always overflow-y-auto p-4">
    <div class="space-y-5">
      <div
        v-for="item in bienenstock"
        :key="item.task"
        class="bg-white rounded-2xl p-4 shadow-sm"
      >
        <div class="flex items-center justify-between mb-2">
          <span class="text-xl font-bold">{{ item.icon }} {{ item.task }}</span>
          <span class="bg-amber-100 text-amber-700 text-sm font-semibold px-3 py-1 rounded-full">
            {{ item.phase }}
          </span>
        </div>
        <div class="w-full bg-amber-100 rounded-full h-5 overflow-hidden">
          <div
            class="bg-amber-400 h-full rounded-full transition-all"
            :style="{ width: item.percent + '%' }"
          />
        </div>
        <p class="text-right text-sm text-gray-500 mt-1 font-bold">{{ item.percent }}%</p>
      </div>

      <div class="p-5 bg-amber-100 rounded-2xl text-center">
        <p class="text-base text-amber-800 font-medium">
          🐝 Die Bienen sind fleissig am Arbeiten!
        </p>
      </div>
    </div>
  </section>
</template>
