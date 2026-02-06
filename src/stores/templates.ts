import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ProjectTemplate } from '@/types'
import { mockTemplates } from '@/data/mock/templates'

export const useTemplatesStore = defineStore('templates', () => {
  const templates = ref<ProjectTemplate[]>(mockTemplates)

  const ownTemplates = computed(() => templates.value.filter((t) => t.isOwn))
  const sharedTemplates = computed(() => templates.value.filter((t) => !t.isOwn && !t.isPlatform))
  const platformTemplates = computed(() => templates.value.filter((t) => t.isPlatform && !t.isOwn))

  function getTemplateById(id: string) {
    return templates.value.find((t) => t.id === id)
  }

  return { templates, ownTemplates, sharedTemplates, platformTemplates, getTemplateById }
})
