import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ProjectTemplate, TaskTemplate, TopicTemplate, TemplateCategory, Difficulty } from '@/types'
import { fixtureTemplates, fixtureTaskTemplates } from '@/data/fixtures/templates'
import { fixtureLibraryTopics, fixtureLibraryTaskTemplates } from '@/data/fixtures/topicLibrary'

let idCounter = 1000

export const useTemplatesStore = defineStore('templates', () => {
  const templates = ref<ProjectTemplate[]>(fixtureTemplates)
  const taskTemplates = ref<TaskTemplate[]>([...fixtureTaskTemplates, ...fixtureLibraryTaskTemplates])
  const topicLibrary = ref<TopicTemplate[]>(fixtureLibraryTopics)

  const ownTemplates = computed(() => templates.value.filter((t) => t.isOwn))
  const sharedTemplates = computed(() => templates.value.filter((t) => !t.isOwn && !t.isPlatform))
  const platformTemplates = computed(() => templates.value.filter((t) => t.isPlatform && !t.isOwn))

  const libraryTopics = computed(() => topicLibrary.value)

  function generateId(prefix: string) {
    idCounter++
    return `${prefix}-${idCounter}`
  }

  function getTemplateById(id: string) {
    return templates.value.find((t) => t.id === id)
  }

  function getTaskTemplatesByTemplateId(templateId: string) {
    return taskTemplates.value.filter((t) => t.templateId === templateId)
  }

  function getTaskTemplatesByTopicId(topicTemplateId: string) {
    return taskTemplates.value.filter((t) => t.topicTemplateId === topicTemplateId)
  }

  // -- Project Template CRUD --

  function createEmptyTemplate(data: {
    name: string
    description: string
    category: TemplateCategory
    difficulty: Difficulty
    gradeRange: string
    estimatedDuration: string
  }) {
    const newTemplate: ProjectTemplate = {
      id: generateId('tmpl'),
      name: data.name,
      description: data.description,
      category: data.category,
      difficulty: data.difficulty,
      gradeRange: data.gradeRange,
      estimatedDuration: data.estimatedDuration,
      lp21Refs: [],
      lp21Coverage: 0,
      createdBy: 'Eigene',
      shared: false,
      usedBySchools: 0,
      version: 1,
      isOwn: true,
      isPlatform: false,
      topics: [],
    }
    templates.value.push(newTemplate)
    return newTemplate
  }

  function updateTemplate(id: string, updates: Partial<ProjectTemplate>) {
    const tpl = templates.value.find((t) => t.id === id)
    if (tpl) {
      Object.assign(tpl, updates)
    }
  }

  function deleteTemplate(id: string) {
    taskTemplates.value = taskTemplates.value.filter((t) => t.templateId !== id)
    templates.value = templates.value.filter((t) => t.id !== id)
  }

  function duplicateTemplate(templateId: string) {
    const source = templates.value.find((t) => t.id === templateId)
    if (!source) return
    const newId = generateId('tmpl')
    const topicIdMap = new Map<string, string>()

    const newTopics: TopicTemplate[] = source.topics.map((topic) => {
      const newTopicId = generateId('topic-tmpl')
      topicIdMap.set(topic.id, newTopicId)
      return { ...topic, id: newTopicId, templateId: newId }
    })

    const sourceTasks = taskTemplates.value.filter((t) => t.templateId === templateId)
    const newTasks: TaskTemplate[] = sourceTasks.map((task) => ({
      ...task,
      id: generateId('tt'),
      templateId: newId,
      topicTemplateId: topicIdMap.get(task.topicTemplateId) ?? task.topicTemplateId,
    }))

    const newTemplate: ProjectTemplate = {
      ...source,
      id: newId,
      name: `${source.name} (Kopie)`,
      topics: newTopics,
      shared: false,
      usedBySchools: 0,
      isOwn: true,
      isPlatform: false,
      createdBy: 'Eigene',
    }

    templates.value.push(newTemplate)
    taskTemplates.value.push(...newTasks)
    return newTemplate
  }

  // -- Topic CRUD (embedded in project template) --

  function addTopicToTemplate(templateId: string, topic: Omit<TopicTemplate, 'id' | 'templateId' | 'order'>) {
    const tpl = templates.value.find((t) => t.id === templateId)
    if (!tpl) return
    const newTopic: TopicTemplate = {
      ...topic,
      id: generateId('topic-tmpl'),
      templateId,
      order: tpl.topics.length + 1,
    }
    tpl.topics.push(newTopic)
    return newTopic
  }

  function updateTopic(templateId: string, topicId: string, updates: Partial<TopicTemplate>) {
    const tpl = templates.value.find((t) => t.id === templateId)
    if (!tpl) return
    const topic = tpl.topics.find((t) => t.id === topicId)
    if (topic) {
      Object.assign(topic, updates)
    }
  }

  function deleteTopic(templateId: string, topicId: string) {
    const tpl = templates.value.find((t) => t.id === templateId)
    if (!tpl) return
    tpl.topics = tpl.topics.filter((t) => t.id !== topicId)
    taskTemplates.value = taskTemplates.value.filter((t) => t.topicTemplateId !== topicId)
  }

  // -- Import from library into project template --

  function importLibraryTopicToTemplate(libraryTopicId: string, templateId: string) {
    const libTopic = topicLibrary.value.find((t) => t.id === libraryTopicId)
    const tpl = templates.value.find((t) => t.id === templateId)
    if (!libTopic || !tpl) return

    const newTopicId = generateId('topic-tmpl')
    const newTopic: TopicTemplate = {
      ...libTopic,
      id: newTopicId,
      templateId,
      isLibrary: false,
      sourceLibraryId: libraryTopicId,
      order: tpl.topics.length + 1,
    }
    tpl.topics.push(newTopic)

    // Deep copy task templates
    const libTasks = taskTemplates.value.filter((t) => t.topicTemplateId === libraryTopicId)
    for (const task of libTasks) {
      taskTemplates.value.push({
        ...task,
        id: generateId('tt'),
        templateId,
        topicTemplateId: newTopicId,
      })
    }

    return newTopic
  }

  // -- Task Template CRUD --

  function addTaskTemplate(task: Omit<TaskTemplate, 'id' | 'order'>) {
    const existing = taskTemplates.value.filter((t) => t.topicTemplateId === task.topicTemplateId)
    const newTask: TaskTemplate = {
      ...task,
      id: generateId('tt'),
      order: existing.length + 1,
    }
    taskTemplates.value.push(newTask)
    return newTask
  }

  function updateTaskTemplate(taskId: string, updates: Partial<TaskTemplate>) {
    const task = taskTemplates.value.find((t) => t.id === taskId)
    if (task) {
      Object.assign(task, updates)
    }
  }

  function deleteTaskTemplate(taskId: string) {
    taskTemplates.value = taskTemplates.value.filter((t) => t.id !== taskId)
  }

  // -- Library Topic CRUD --

  function addLibraryTopic(topic: Omit<TopicTemplate, 'id' | 'templateId' | 'order' | 'isLibrary'>) {
    const newTopic: TopicTemplate = {
      ...topic,
      id: generateId('lib-topic'),
      templateId: '',
      order: topicLibrary.value.length + 1,
      isLibrary: true,
    }
    topicLibrary.value.push(newTopic)
    return newTopic
  }

  function updateLibraryTopic(topicId: string, updates: Partial<TopicTemplate>) {
    const topic = topicLibrary.value.find((t) => t.id === topicId)
    if (topic) {
      Object.assign(topic, updates)
    }
  }

  function deleteLibraryTopic(topicId: string) {
    topicLibrary.value = topicLibrary.value.filter((t) => t.id !== topicId)
    taskTemplates.value = taskTemplates.value.filter((t) => t.topicTemplateId !== topicId)
  }

  function duplicateLibraryTopic(topicId: string) {
    const source = topicLibrary.value.find((t) => t.id === topicId)
    if (!source) return
    const newTopicId = generateId('lib-topic')
    const newTopic: TopicTemplate = {
      ...source,
      id: newTopicId,
      name: `${source.name} (Kopie)`,
    }
    topicLibrary.value.push(newTopic)

    const sourceTasks = taskTemplates.value.filter((t) => t.topicTemplateId === topicId)
    for (const task of sourceTasks) {
      taskTemplates.value.push({
        ...task,
        id: generateId('lib-tt'),
        topicTemplateId: newTopicId,
      })
    }
    return newTopic
  }

  // -- Material assignment --

  function addMaterialToTopic(topicId: string, materialId: string, isLibrary: boolean) {
    const topic = isLibrary
      ? topicLibrary.value.find((t) => t.id === topicId)
      : templates.value.flatMap((t) => t.topics).find((t) => t.id === topicId)
    if (topic && !topic.materialIds.includes(materialId)) {
      topic.materialIds.push(materialId)
    }
  }

  function removeMaterialFromTopic(topicId: string, materialId: string, isLibrary: boolean) {
    const topic = isLibrary
      ? topicLibrary.value.find((t) => t.id === topicId)
      : templates.value.flatMap((t) => t.topics).find((t) => t.id === topicId)
    if (topic) {
      topic.materialIds = topic.materialIds.filter((id) => id !== materialId)
    }
  }

  return {
    templates,
    taskTemplates,
    topicLibrary,
    ownTemplates,
    sharedTemplates,
    platformTemplates,
    libraryTopics,
    generateId,
    getTemplateById,
    getTaskTemplatesByTemplateId,
    getTaskTemplatesByTopicId,
    createEmptyTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    addTopicToTemplate,
    updateTopic,
    deleteTopic,
    importLibraryTopicToTemplate,
    addTaskTemplate,
    updateTaskTemplate,
    deleteTaskTemplate,
    addLibraryTopic,
    updateLibraryTopic,
    deleteLibraryTopic,
    duplicateLibraryTopic,
    addMaterialToTopic,
    removeMaterialFromTopic,
  }
})
