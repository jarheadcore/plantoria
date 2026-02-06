<script setup lang="ts">
const schoolRankings = ref([
  { rank: 1, name: 'Klasse 4a', points: 1240 },
  { rank: 2, name: 'Klasse 3b', points: 1180 },
  { rank: 3, name: 'Klasse HE24a', points: 1050, highlight: true },
  { rank: 4, name: 'Klasse 5c', points: 980 },
  { rank: 5, name: 'Klasse 3a', points: 920 },
])

const swissRankings = ref([
  { rank: 1, name: 'Klasse 2a', school: 'Primarschule Zürich', points: 1580 },
  { rank: 2, name: 'Klasse 6b', school: 'Schulhaus Bern', points: 1420 },
  { rank: 3, name: 'Klasse 4a', school: 'Schulhaus Moos', points: 1240 },
  { rank: 12, name: 'Klasse HE24a', school: 'Unsere Schule', points: 1050, highlight: true },
  { rank: 13, name: 'Klasse 1c', school: 'Schule Luzern', points: 1020 },
])
</script>

<template>
  <section class="w-full shrink-0 snap-start snap-always overflow-y-auto p-4">
    <div class="grid grid-cols-2 gap-3 h-full">
      <!-- Meine Schule -->
      <div class="flex flex-col min-h-0">
        <h3 class="text-sm font-bold text-green-700 mb-2 text-center">🏫 Meine Schule</h3>
        <div class="space-y-2 overflow-y-auto flex-1">
          <div
            v-for="entry in schoolRankings"
            :key="entry.rank"
            class="flex items-center gap-2 p-2 rounded-xl shadow-sm"
            :class="entry.highlight ? 'bg-green-100 ring-2 ring-green-400' : 'bg-white'"
          >
            <span
              class="text-2xl font-black w-8 text-center"
              :class="entry.rank <= 3 ? 'text-amber-500' : 'text-gray-300'"
            >
              {{ entry.rank }}
            </span>
            <div class="flex-1 min-w-0">
              <p class="font-bold text-sm truncate">{{ entry.name }}</p>
            </div>
            <span class="text-sm font-black text-green-700">{{ entry.points }}</span>
          </div>
        </div>
      </div>

      <!-- Schweizweit -->
      <div class="flex flex-col min-h-0">
        <h3 class="text-sm font-bold text-blue-700 mb-2 text-center">🇨🇭 Schweizweit</h3>
        <div class="space-y-2 overflow-y-auto flex-1">
          <div
            v-for="entry in swissRankings"
            :key="entry.rank"
            class="flex items-center gap-2 p-2 rounded-xl shadow-sm"
            :class="entry.highlight ? 'bg-blue-100 ring-2 ring-blue-400' : 'bg-white'"
          >
            <span
              class="text-2xl font-black w-8 text-center"
              :class="entry.rank <= 3 ? 'text-amber-500' : 'text-gray-300'"
            >
              {{ entry.rank }}
            </span>
            <div class="flex-1 min-w-0">
              <p class="font-bold text-sm truncate">{{ entry.name }}</p>
              <p class="text-xs text-gray-500 truncate">{{ entry.school }}</p>
            </div>
            <span class="text-sm font-black text-green-700">{{ entry.points }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
