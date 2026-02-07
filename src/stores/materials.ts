import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Material, RecentDownload, Difficulty, ProjectPhase, MaterialFormat } from '@/types'
import { fixtureMaterials, fixtureRecentDownloads } from '@/data/fixtures/materials'

export const useMaterialsStore = defineStore('materials', () => {
  const materials = ref<Material[]>(fixtureMaterials)
  const recentDownloads = ref<RecentDownload[]>(fixtureRecentDownloads)

  const filterTag = ref('all')
  const filterGrade = ref('all')
  const filterPhase = ref<ProjectPhase | 'all'>('all')
  const filterFormat = ref<MaterialFormat | 'all'>('all')
  const filterLp21 = ref('all')
  const searchQuery = ref('')

  // All unique tags from materials
  const allTags = computed(() => {
    const tagSet = new Set<string>()
    for (const m of materials.value) {
      for (const tag of m.tags) {
        tagSet.add(tag)
      }
    }
    return [...tagSet].sort()
  })

  const filteredMaterials = computed(() => {
    return materials.value.filter((m) => {
      if (filterTag.value && filterTag.value !== 'all' && !m.tags.includes(filterTag.value)) return false
      if (filterGrade.value && filterGrade.value !== 'all' && !m.gradeRange.includes(filterGrade.value)) return false
      if (filterPhase.value && filterPhase.value !== 'all' && m.phase !== filterPhase.value) return false
      if (filterFormat.value && filterFormat.value !== 'all' && !m.formats.includes(filterFormat.value as MaterialFormat)) return false
      if (filterLp21.value && filterLp21.value !== 'all' && !m.lp21Refs.some((r) => r.includes(filterLp21.value))) return false
      if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase()
        return m.title.toLowerCase().includes(q) || m.description?.toLowerCase().includes(q)
      }
      return true
    })
  })

  function recordDownload(materialId: string, format: MaterialFormat | undefined) {
    const mat = materials.value.find((m) => m.id === materialId)
    if (mat) {
      const today = new Date().toISOString().split('T')[0] ?? ''
      mat.lastDownloaded = today
      recentDownloads.value.unshift({
        id: `dl-${Date.now()}`,
        materialTitle: mat.title,
        date: today,
        format: format || 'PDF',
        materialId,
      })
    }
  }

  function getMaterialById(id: string) {
    return materials.value.find((m) => m.id === id)
  }

  function getMaterialsByIds(ids: string[]) {
    return materials.value.filter((m) => ids.includes(m.id))
  }

  function getMaterialsByTag(tag: string) {
    return materials.value.filter((m) => m.tags.includes(tag))
  }

  function resetFilters() {
    filterTag.value = 'all'
    filterGrade.value = 'all'
    filterPhase.value = 'all'
    filterFormat.value = 'all'
    filterLp21.value = 'all'
    searchQuery.value = ''
  }

  return {
    materials,
    recentDownloads,
    allTags,
    filterTag,
    filterGrade,
    filterPhase,
    filterFormat,
    filterLp21,
    searchQuery,
    filteredMaterials,
    recordDownload,
    getMaterialById,
    getMaterialsByIds,
    getMaterialsByTag,
    resetFilters,
  }
})
