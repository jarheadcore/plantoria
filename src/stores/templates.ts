import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ProjectTemplate } from '@/types'
import { fixtureTemplates } from '@/data/fixtures/templates'

export const useTemplatesStore = defineStore('templates', () => {
  const templates = ref<ProjectTemplate[]>(fixtureTemplates)

  const ownTemplates = computed(() => templates.value.filter((t) => t.isOwn))
  const sharedTemplates = computed(() => templates.value.filter((t) => !t.isOwn && !t.isPlatform))
  const platformTemplates = computed(() => templates.value.filter((t) => t.isPlatform && !t.isOwn))

  function getTemplateById(id: string) {
    return templates.value.find((t) => t.id === id)
  }

  return { templates, ownTemplates, sharedTemplates, platformTemplates, getTemplateById }
})
