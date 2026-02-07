<script setup lang="ts">
import { useDashboardStore } from '~/stores/dashboard'

const store = useDashboardStore()

const barColors = ['bg-amber-400', 'bg-amber-300', 'bg-yellow-300', 'bg-green-300', 'bg-green-200']
</script>

<template>
  <section class="w-full shrink-0 snap-start snap-always overflow-y-auto p-4">
    <div class="grid grid-cols-2 gap-3 h-full">
      <!-- Meine Schule -->
      <div class="flex flex-col min-h-0">
        <h3 class="text-sm font-bold text-green-700 mb-2 text-center">🏫 Meine Schule</h3>
        <div class="space-y-2 overflow-y-auto flex-1">
          <div
            v-for="(entry, i) in store.schoolRankings"
            :key="entry.rank"
            class="relative h-10 rounded-xl overflow-hidden"
            :class="entry.highlight ? 'ring-2 ring-green-400' : ''"
          >
            <div class="absolute inset-0 bg-gray-100" />
            <div
              class="absolute inset-y-0 left-0 rounded-xl transition-all duration-700 ease-out"
              :class="entry.highlight ? 'bg-green-400' : barColors[i] || 'bg-gray-200'"
              :style="{ width: (entry.points / store.schoolMax) * 100 + '%' }"
            />
            <div class="absolute inset-0 flex items-center px-2 gap-1">
              <span
                class="text-lg font-black shrink-0"
                :class="entry.rank <= 3 ? 'text-amber-600' : 'text-gray-400'"
              >
                {{ entry.rank }}
              </span>
              <span class="font-bold text-sm truncate">{{ entry.name }}</span>
              <span class="ml-auto text-sm font-black text-green-800">{{ entry.points }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Schweizweit -->
      <div class="flex flex-col min-h-0">
        <h3 class="text-sm font-bold text-blue-700 mb-2 text-center">🇨🇭 Schweizweit</h3>
        <div class="space-y-2 overflow-y-auto flex-1">
          <div
            v-for="(entry, i) in store.swissRankings"
            :key="entry.rank"
            class="relative h-10 rounded-xl overflow-hidden"
            :class="entry.highlight ? 'ring-2 ring-blue-400' : ''"
          >
            <div class="absolute inset-0 bg-gray-100" />
            <div
              class="absolute inset-y-0 left-0 rounded-xl transition-all duration-700 ease-out"
              :class="entry.highlight ? 'bg-blue-400' : barColors[i] || 'bg-gray-200'"
              :style="{ width: (entry.points / store.swissMax) * 100 + '%' }"
            />
            <div class="absolute inset-0 flex items-center px-2 gap-1">
              <span
                class="text-lg font-black shrink-0"
                :class="entry.rank <= 3 ? 'text-amber-600' : 'text-gray-400'"
              >
                {{ entry.rank }}
              </span>
              <div class="min-w-0 flex-1">
                <p class="font-bold text-sm truncate leading-tight">{{ entry.name }}</p>
                <p class="text-[10px] text-gray-600 truncate leading-tight">{{ entry.school }}</p>
              </div>
              <span class="ml-auto text-sm font-black text-green-800 shrink-0">{{ entry.points }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
