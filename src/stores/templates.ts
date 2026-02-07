import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ProjectTemplate, TaskTemplate } from '@/types'
import { fixtureTemplates, fixtureTaskTemplates } from '@/data/fixtures/templates'

export const useTemplatesStore = defineStore('templates', () => {
    const templates = ref<ProjectTemplate[]>(fixtureTemplates)
    const taskTemplates = ref<TaskTemplate[]>(fixtureTaskTemplates)

    const ownTemplates = computed(() => templates.value.filter((t) => t.isOwn))
    const sharedTemplates = computed(() => templates.value.filter((t) => !t.isOwn && !t.isPlatform))
    const platformTemplates = computed(() => templates.value.filter((t) => t.isPlatform && !t.isOwn))

    function getTemplateById(id: string) {
        return templates.value.find((t) => t.id === id)
    }

    function getTaskTemplatesByTemplateId(templateId: string) {
        return taskTemplates.value.filter((t) => t.templateId === templateId)
    }

    function getTaskTemplatesByTopicId(topicTemplateId: string) {
        return taskTemplates.value.filter((t) => t.topicTemplateId === topicTemplateId)
    }

    return {
        templates,
        taskTemplates,
        ownTemplates,
        sharedTemplates,
        platformTemplates,
        getTemplateById,
        getTaskTemplatesByTemplateId,
        getTaskTemplatesByTopicId,
    }
})
