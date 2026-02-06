import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Curriculum, CurriculumProgress } from '@/types'
import { fixtureCurriculumData, fixtureCurriculumProgress } from '@/data/fixtures/curriculum'

export const useCurriculumStore = defineStore('curriculum', () => {
  const curriculumData = ref<Curriculum[]>(fixtureCurriculumData)
  const progress = ref<CurriculumProgress>(fixtureCurriculumProgress)

  function markTopicTreated(topicCode: string, downloadTitle: string, projectName: string) {
    for (const cur of curriculumData.value) {
      const topic = cur.topics.find((t) => t.code === topicCode)
      if (topic && !topic.treated) {
        topic.treated = true
        topic.treatedDate = new Date().toISOString().split('T')[0]
        topic.treatedByDownload = downloadTitle
        topic.treatedByProject = projectName
        recalculateProgress()
        break
      }
    }
  }

  function recalculateProgress() {
    let total = 0
    let treated = 0
    for (const cur of curriculumData.value) {
      total += cur.topics.length
      treated += cur.topics.filter((t) => t.treated).length
    }
    progress.value.totalTopics = total
    progress.value.treatedTopics = treated
    progress.value.coveragePercent = total > 0 ? Math.round((treated / total) * 100) : 0

    progress.value.bySubject = curriculumData.value.map((cur) => {
      const subTotal = cur.topics.length
      const subTreated = cur.topics.filter((t) => t.treated).length
      return {
        subject: cur.subject,
        shortName: cur.shortName,
        totalTopics: subTotal,
        treatedTopics: subTreated,
        coveragePercent: subTotal > 0 ? Math.round((subTreated / subTotal) * 100) : 0,
      }
    })
  }

  return { curriculumData, progress, markTopicTreated, recalculateProgress }
})
