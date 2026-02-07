import { computed, ref } from 'vue'
import {
  fixtureInspirationPhotos,
  type InspirationActivity,
  type InspirationPhoto,
} from '@/data/fixtures/inspiration-photos'

export function useInspirationPhotos() {
  const activeFilter = ref<InspirationActivity | null>(null)

  const photos = computed<InspirationPhoto[]>(() => {
    if (!activeFilter.value) return fixtureInspirationPhotos
    return fixtureInspirationPhotos.filter((p) => p.activity === activeFilter.value)
  })

  const activities: { value: InspirationActivity; label: string }[] = [
    { value: 'planting', label: 'Pflanzen' },
    { value: 'watering', label: 'Giessen' },
    { value: 'exploring', label: 'Entdecken' },
    { value: 'harvesting', label: 'Ernten' },
    { value: 'collaborative', label: 'Zusammenarbeit' },
    { value: 'raised-bed', label: 'Hochbeet' },
    { value: 'composting', label: 'Kompostieren' },
    { value: 'family', label: 'Familie' },
  ]

  function setFilter(activity: InspirationActivity | null) {
    activeFilter.value = activity
  }

  const totalCount = fixtureInspirationPhotos.length

  return { photos, activities, activeFilter, setFilter, totalCount }
}
