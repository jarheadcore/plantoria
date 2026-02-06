<script setup lang="ts">
import { useMarketsStore } from '@/stores/markets'

definePageMeta({ layout: 'teacher' })

const marketsStore = useMarketsStore()

const activeTab = ref<'upcoming' | 'registered' | 'past'>('upcoming')

const upcomingMarkets = computed(() =>
  marketsStore.markets.filter((m) => m.status === 'Anmeldung offen'),
)
const registeredMarkets = computed(() =>
  marketsStore.markets.filter((m) => m.status === 'Angemeldet'),
)
const pastMarkets = computed(() =>
  marketsStore.markets.filter((m) => m.status === 'Abgeschlossen'),
)

const currentMarkets = computed(() => {
  switch (activeTab.value) {
    case 'upcoming': return upcomingMarkets.value
    case 'registered': return registeredMarkets.value
    case 'past': return pastMarkets.value
  }
})

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('de-CH', { day: '2-digit', month: 'long', year: 'numeric' })
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Harvest-Märkte</h1>
      <p class="text-sm text-gray-500 mt-1">Märkte planen, anmelden und Produkte verwalten</p>
    </div>

    <!-- Tabs -->
    <div class="mb-6 flex gap-1 border-b border-gray-200 dark:border-gray-800">
      <button
        v-for="tab in [
          { key: 'upcoming', label: 'Kommende Märkte' },
          { key: 'registered', label: 'Meine Anmeldungen' },
          { key: 'past', label: 'Vergangene' },
        ]"
        :key="tab.key"
        :class="[
          'px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
          activeTab === tab.key
            ? 'border-green-600 text-green-700 dark:text-green-400'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
        ]"
        @click="activeTab = tab.key as any"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Market cards -->
    <div class="space-y-4">
      <UCard v-for="market in currentMarkets" :key="market.id">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 class="text-lg font-semibold mb-1">{{ market.name }}</h3>
            <div class="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
              <span>Datum: <strong>{{ formatDate(market.date) }}</strong></span>
              <span>Ort: <strong>{{ market.location }}</strong></span>
              <span>Teilnehmende Schulen: <strong>{{ market.participatingSchools }}</strong></span>
              <span>Anmeldefrist: <strong>{{ formatDate(market.registrationDeadline) }}</strong></span>
            </div>
            <UBadge
              :color="market.status === 'Angemeldet' ? 'success' : market.status === 'Anmeldung offen' ? 'warning' : 'neutral'"
              variant="subtle"
              class="mt-2"
            >
              {{ market.status }}
            </UBadge>
          </div>
          <div class="flex gap-2 shrink-0">
            <UButton
              v-if="market.status === 'Anmeldung offen'"
              color="primary"
              size="sm"
              @click="marketsStore.registerClass(market.id)"
            >
              Klasse anmelden
            </UButton>
            <UButton size="sm" variant="soft" :to="`/teacher/markets/${market.id}`">
              Details
            </UButton>
          </div>
        </div>
      </UCard>

      <EmptyState
        v-if="currentMarkets.length === 0"
        title="Keine Märkte in dieser Kategorie"
        description="Schau in einer anderen Kategorie nach."
      />
    </div>
  </div>
</template>
