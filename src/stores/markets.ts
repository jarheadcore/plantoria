import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { HarvestMarket } from '@/types'
import { mockMarkets } from '@/data/mock/markets'

export const useMarketsStore = defineStore('markets', () => {
  const markets = ref<HarvestMarket[]>(mockMarkets)

  function getMarketById(id: string) {
    return markets.value.find((m) => m.id === id)
  }

  function toggleMarketPhase(marketId: string, phaseId: string) {
    const market = markets.value.find((m) => m.id === marketId)
    if (market) {
      const phase = market.preparationPhases.find((p) => p.id === phaseId)
      if (phase) {
        phase.status = phase.status === 'Erledigt' ? 'Offen' : 'Erledigt'
      }
    }
  }

  function registerClass(marketId: string) {
    const market = markets.value.find((m) => m.id === marketId)
    if (market) {
      market.status = 'Angemeldet'
      const anmeldung = market.preparationPhases.find((p) => p.name === 'Anmeldung')
      if (anmeldung) anmeldung.status = 'Erledigt'
    }
  }

  return { markets, getMarketById, toggleMarketPhase, registerClass }
})
