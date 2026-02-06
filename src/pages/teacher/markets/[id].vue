<script setup lang="ts">
import { useMarketsStore } from '@/stores/markets'

definePageMeta({ layout: 'teacher' })

const route = useRoute()
const marketsStore = useMarketsStore()

const marketId = route.params.id as string
const market = computed(() => marketsStore.getMarketById(marketId))

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit' })
}

function phaseStatusColor(status: string) {
  switch (status) {
    case 'Erledigt': return 'success' as const
    case 'In Bearbeitung': return 'warning' as const
    default: return 'neutral' as const
  }
}
</script>

<template>
  <div v-if="market">
    <div class="mb-4">
      <NuxtLink to="/teacher/markets" class="text-sm text-gray-500 hover:text-gray-700">
        ← Harvest-Märkte
      </NuxtLink>
    </div>

    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ market.name }}</h1>
      <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
        <span>Status: <UBadge :color="market.status === 'Angemeldet' ? 'success' : 'warning'" variant="subtle" size="xs">{{ market.status }}</UBadge></span>
        <span>Datum: <strong>{{ formatDate(market.date) }}</strong></span>
        <span>Ort: <strong>{{ market.location }}</strong></span>
      </div>
    </div>

    <!-- Preparation checklist -->
    <h2 class="text-lg font-semibold mb-3">Vorbereitung</h2>
    <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800 mb-6">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
        <thead class="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase w-8" />
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Phase</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Deadline</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
          <tr v-for="phase in market.preparationPhases" :key="phase.id">
            <td class="px-4 py-3">
              <input
                type="checkbox"
                :checked="phase.status === 'Erledigt'"
                class="h-4 w-4 rounded text-green-600"
                @change="marketsStore.toggleMarketPhase(market.id, phase.id)"
              />
            </td>
            <td class="px-4 py-3 text-sm font-medium">{{ phase.name }}</td>
            <td class="px-4 py-3">
              <UBadge :color="phaseStatusColor(phase.status)" variant="subtle" size="xs">
                {{ phase.status }}
              </UBadge>
            </td>
            <td class="px-4 py-3 text-sm text-gray-500">{{ formatDate(phase.deadline) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Products -->
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-lg font-semibold">Unsere Produkte</h2>
      <UButton size="sm" variant="soft" color="primary" disabled>+ Erfassen</UButton>
    </div>
    <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800 mb-6">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
        <thead class="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Produkt</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Menge</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Preis</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Gruppe</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
          <tr v-for="product in market.products" :key="product.id">
            <td class="px-4 py-3 text-sm font-medium">{{ product.name }}</td>
            <td class="px-4 py-3 text-sm text-gray-500">{{ product.quantity }}</td>
            <td class="px-4 py-3 text-sm text-gray-500">{{ product.price }}</td>
            <td class="px-4 py-3 text-sm text-gray-500">{{ product.groupName }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Revenue -->
    <UCard>
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-semibold">Einnahmen (nach Durchführung)</h3>
          <p class="text-2xl font-bold text-green-600 mt-1">
            {{ market.totalRevenue ? `CHF ${market.totalRevenue.toFixed(2)}` : '–' }}
          </p>
        </div>
        <UButton variant="soft" color="primary" disabled>Einnahmen erfassen</UButton>
      </div>
    </UCard>
  </div>

  <div v-else class="py-16 text-center text-gray-500">
    Markt nicht gefunden.
  </div>
</template>
