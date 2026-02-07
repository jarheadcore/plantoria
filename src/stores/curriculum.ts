import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  Curriculum,
  CurriculumProgress,
  CurriculumTopic,
  Task,
  Project,
  Topic,
  Material,
  TaskWithContext,
  DashboardStats,
  RadarDataPoint,
  HeatmapData,
  HeatmapCell,
} from '@/types'
import { fixtureCurriculumData, fixtureCurriculumProgress } from '@/data/fixtures/curriculum'
import { useProjectsStore } from '@/stores/projects'
import { useMaterialsStore } from '@/stores/materials'

export const useCurriculumStore = defineStore('curriculum', () => {
  const curriculumData = ref<Curriculum[]>(fixtureCurriculumData)
  const progress = ref<CurriculumProgress>(fixtureCurriculumProgress)

  // Group filter state
  const activeGroupId = ref<string | null>(null)

  // All groups (flat) from projectsStore for the dropdown
  const allGroups = computed(() => {
    const projectsStore = useProjectsStore()
    return projectsStore.groups
      .filter((g) => g.id !== 'g-unassigned')
      .map((g) => {
        const project = projectsStore.getProjectById(g.projectId)
        return { id: g.id, name: g.name, projectName: project?.name ?? '' }
      })
  })

  // Tasks filtered by group: when activeGroupId set, only tasks of that group + tasks without group
  const filteredTasks = computed(() => {
    const projectsStore = useProjectsStore()
    if (!activeGroupId.value) return projectsStore.tasks
    return projectsStore.tasks.filter(
      (t) => t.groupId === activeGroupId.value || !t.groupId,
    )
  })

  // LP21 codes covered by filtered completed tasks
  const filteredTreatedCodes = computed(() => {
    const codes = new Set<string>()
    for (const task of filteredTasks.value) {
      if (task.status === 'Erledigt') {
        for (const ref of task.lp21Refs) codes.add(ref)
      }
    }
    return codes
  })

  // Whether a CurriculumTopic counts as "treated" in the current filter context
  function isTopicEffectivelyTreated(topic: CurriculumTopic): boolean {
    if (!activeGroupId.value) return topic.treated
    return filteredTreatedCodes.value.has(topic.code)
  }

  // Filtered overall progress
  const filteredProgress = computed(() => {
    const allTopics = curriculumData.value.flatMap((c) => c.topics)
    const total = allTopics.length
    const treated = allTopics.filter((t) => isTopicEffectivelyTreated(t)).length
    return {
      totalTopics: total,
      treatedTopics: treated,
      coveragePercent: total > 0 ? Math.round((treated / total) * 100) : 0,
    }
  })

  // Filtered radar chart data
  const filteredRadarChartData = computed<RadarDataPoint[]>(() => {
    return curriculumData.value.map((cur) => {
      const total = cur.topics.length
      const treated = cur.topics.filter((t) => isTopicEffectivelyTreated(t)).length
      return {
        subject: cur.subject,
        shortName: cur.shortName,
        actual: total > 0 ? Math.round((treated / total) * 100) : 0,
        target: 100,
      }
    })
  })

  // All LP21 codes as flat list
  const allCurriculumCodes = computed(() =>
    curriculumData.value.flatMap((c) => c.topics.map((t) => t.code)),
  )

  // Dashboard stats: treated, open, planned, gaps (uses filtered data)
  const dashboardStats = computed<DashboardStats>(() => {
    const materialsStore = useMaterialsStore()

    const allTopics = curriculumData.value.flatMap((c) => c.topics)
    const total = allTopics.length
    const treated = allTopics.filter((t) => isTopicEffectivelyTreated(t)).length

    const taskLp21Codes = new Set(filteredTasks.value.flatMap((t) => t.lp21Refs))
    const materialLp21Codes = new Set(materialsStore.materials.flatMap((m) => m.lp21Refs))

    const planned = allTopics.filter(
      (t) => !isTopicEffectivelyTreated(t) && taskLp21Codes.has(t.code),
    ).length

    const gaps = allTopics.filter(
      (t) => !isTopicEffectivelyTreated(t) && !taskLp21Codes.has(t.code) && !materialLp21Codes.has(t.code),
    ).length

    return { treated, open: total - treated, planned, gaps, total }
  })

  // Tasks grouped by curriculum code (for traceability, uses filtered tasks)
  const tasksByCurriculumCode = computed<Map<string, TaskWithContext[]>>(() => {
    const projectsStore = useProjectsStore()
    const materialsStore = useMaterialsStore()

    const map = new Map<string, TaskWithContext[]>()

    for (const code of allCurriculumCodes.value) {
      const entries: TaskWithContext[] = []
      for (const task of filteredTasks.value) {
        if (task.lp21Refs.includes(code)) {
          const project = projectsStore.getProjectById(task.projectId)
          const topic = projectsStore.topics.find((t) => t.id === task.topicId)
          const materials = task.materialIds
            .map((mid) => materialsStore.materials.find((m) => m.id === mid))
            .filter((m): m is Material => m !== undefined)

          if (project && topic) {
            entries.push({ task, project, topic, materials })
          }
        }
      }
      if (entries.length > 0) {
        map.set(code, entries)
      }
    }

    return map
  })

  // Radar chart data: coverage % per subject (uses filtered data)
  const radarChartData = computed<RadarDataPoint[]>(() => {
    return filteredRadarChartData.value
  })

  // Heatmap data: months (Aug-Jul school year) x subjects (uses filtered data)
  const heatmapData = computed<HeatmapData>(() => {
    const schoolYearMonths = [8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7]
    const subjects = curriculumData.value.map((c) => c.shortName)

    const cells: HeatmapCell[] = []
    let maxCount = 0

    for (const month of schoolYearMonths) {
      for (const cur of curriculumData.value) {
        const count = cur.topics.filter((t) => {
          if (!isTopicEffectivelyTreated(t) || !t.treatedDate) return false
          const treatedMonth = new Date(t.treatedDate).getMonth() + 1
          return treatedMonth === month
        }).length
        cells.push({ month, subject: cur.shortName, count })
        if (count > maxCount) maxCount = count
      }
    }

    return { months: schoolYearMonths, subjects, cells, maxCount }
  })

  function markTopicTreated(topicCode: string, downloadTitle: string, projectName: string) {
    for (const cur of curriculumData.value) {
      const topic = cur.topics.find((t) => t.code === topicCode)
      if (topic && !topic.treated) {
        topic.treated = true
        topic.treatedDate = new Date().toISOString().split('T')[0]
        if (downloadTitle) topic.treatedByDownload = downloadTitle
        topic.treatedByProject = projectName
        recalculateProgress()
        break
      }
    }
  }

  function unmarkTopicTreated(topicCode: string) {
    for (const cur of curriculumData.value) {
      const topic = cur.topics.find((t) => t.code === topicCode)
      if (topic && topic.treated) {
        topic.treated = false
        topic.treatedDate = undefined
        topic.treatedByDownload = undefined
        topic.treatedByProject = undefined
        recalculateProgress()
        break
      }
    }
  }

  function syncTaskCompletion(task: Task, project: Project) {
    const projectsStore = useProjectsStore()

    if (task.status === 'Erledigt') {
      for (const code of task.lp21Refs) {
        markTopicTreated(code, '', project.name)
      }
    } else {
      for (const code of task.lp21Refs) {
        const otherCompleted = projectsStore.tasks.some(
          (t) =>
            t.id !== task.id &&
            t.status === 'Erledigt' &&
            t.lp21Refs.includes(code),
        )
        if (!otherCompleted) {
          unmarkTopicTreated(code)
        }
      }
    }
  }

  function hasCompletedTaskForCode(code: string): boolean {
    const projectsStore = useProjectsStore()
    return projectsStore.tasks.some(
      (t) => t.status === 'Erledigt' && t.lp21Refs.includes(code),
    )
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

  return {
    curriculumData,
    progress,
    activeGroupId,
    allGroups,
    filteredTasks,
    filteredProgress,
    filteredRadarChartData,
    allCurriculumCodes,
    dashboardStats,
    tasksByCurriculumCode,
    radarChartData,
    heatmapData,
    isTopicEffectivelyTreated,
    markTopicTreated,
    unmarkTopicTreated,
    syncTaskCompletion,
    hasCompletedTaskForCode,
    recalculateProgress,
  }
})
