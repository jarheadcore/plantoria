import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { SubjectInfo, SubjectAreaTemplate } from '@/types'
import { fixtureSubjects } from '@/data/fixtures/subjects'
import { fixtureSubjectTemplates } from '@/data/fixtures/subjectTemplates'

export const useSubjectsStore = defineStore('subjects', () => {
  const subjects = ref<SubjectInfo[]>([...fixtureSubjects])
  const subjectTemplates = ref<SubjectAreaTemplate[]>([...fixtureSubjectTemplates])

  function getSubjectById(id: string) {
    return subjects.value.find((s) => s.id === id)
  }

  function getTemplatesBySubject(subjectArea: string) {
    return subjectTemplates.value.filter((t) => t.subjectArea === subjectArea)
  }

  function createSubject(subject: SubjectInfo) {
    subjects.value.push(subject)
  }

  function updateSubject(id: string, updates: Partial<SubjectInfo>) {
    const idx = subjects.value.findIndex((s) => s.id === id)
    if (idx !== -1 && subjects.value[idx]) {
      Object.assign(subjects.value[idx], updates)
    }
  }

  function deleteSubject(id: string) {
    subjects.value = subjects.value.filter((s) => s.id !== id)
  }

  function importTemplate(template: SubjectAreaTemplate) {
    subjectTemplates.value.push(template)
  }

  function createTemplate(template: SubjectAreaTemplate) {
    subjectTemplates.value.push(template)
  }

  function deleteTemplate(id: string) {
    subjectTemplates.value = subjectTemplates.value.filter((t) => t.id !== id)
  }

  function getLearningItemsBySubject(subjectArea: string) {
    const templates = getTemplatesBySubject(subjectArea)
    return templates.flatMap((t) => t.learningOrder)
  }

  return {
    subjects,
    subjectTemplates,
    getSubjectById,
    getTemplatesBySubject,
    createSubject,
    updateSubject,
    deleteSubject,
    importTemplate,
    createTemplate,
    deleteTemplate,
    getLearningItemsBySubject,
  }
})
