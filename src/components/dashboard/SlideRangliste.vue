<script setup lang="ts">
const rankings = ref([
  { rank: 1, name: 'Klasse 4a', school: 'Schulhaus Moos', points: 1240 },
  { rank: 2, name: 'Klasse 3b', school: 'Schulhaus Rüti', points: 1180 },
  { rank: 3, name: 'Klasse HE24a', school: 'Unsere Klasse', points: 1050, highlight: true },
  { rank: 4, name: 'Klasse 5c', school: 'Schulhaus Dorf', points: 980 },
  { rank: 5, name: 'Klasse 3a', school: 'Schulhaus Berg', points: 920 },
])
</script>

<template>
  <section class="w-full shrink-0 snap-start snap-always overflow-y-auto p-4">
    <div class="space-y-3">
      <div
        v-for="entry in rankings"
        :key="entry.rank"
        class="flex items-center gap-4 p-4 rounded-2xl shadow-sm"
        :class="entry.highlight ? 'bg-green-100 ring-2 ring-green-400' : 'bg-white'"
      >
        <span
          class="text-4xl font-black w-12 text-center"
          :class="entry.rank <= 3 ? 'text-amber-500' : 'text-gray-300'"
        >
          {{ entry.rank }}
        </span>
        <div class="flex-1 min-w-0">
          <p class="font-bold text-lg truncate">{{ entry.name }}</p>
          <p class="text-sm text-gray-500">{{ entry.school }}</p>
        </div>
        <span class="text-xl font-black text-green-700">{{ entry.points }}</span>
      </div>
    </div>
  </section>
</template>
