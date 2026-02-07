import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Project, PreProject, Task, Culture, StudentGroup, Topic, VegetableProfile } from '@/types'
import { fixtureProjects, fixturePreProjects } from '@/data/fixtures/projects'
import { fixtureTasks } from '@/data/fixtures/tasks'
import { fixtureCultures } from '@/data/fixtures/cultures'
import { fixtureGroups } from '@/data/fixtures/groups'
import { fixtureTopics } from '@/data/fixtures/topics'
import { fixtureVegetables } from '@/data/fixtures/vegetables'

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref<Project[]>(fixtureProjects)
  const preProjects = ref<PreProject[]>(fixturePreProjects)
  const tasks = ref<Task[]>(fixtureTasks)
  const cultures = ref<Culture[]>(fixtureCultures)
  const groups = ref<StudentGroup[]>(fixtureGroups)
  const topics = ref<Topic[]>(fixtureTopics)
  const vegetables = ref<VegetableProfile[]>(fixtureVegetables)

  const activeProjects = computed(() => projects.value.filter((p) => p.status !== 'Abgeschlossen'))

  function getProjectById(id: string) {
    return projects.value.find((p) => p.id === id)
  }

  function getPreProjectByProjectId(projectId: string) {
    return preProjects.value.find((pp) => pp.projectId === projectId)
  }

  function getTasksByProjectId(projectId: string) {
    return tasks.value.filter((t) => t.projectId === projectId)
  }

  function getTopicsByProjectId(projectId: string) {
    return topics.value.filter((t) => t.projectId === projectId)
  }

  function getTasksByTopicId(topicId: string) {
    return tasks.value.filter((t) => t.topicId === topicId)
  }

  function getCulturesByProjectId(projectId: string) {
    return cultures.value.filter((c) => c.projectId === projectId)
  }

  function getGroupsByProjectId(projectId: string) {
    return groups.value.filter((g) => g.projectId === projectId)
  }

  function getVegetableById(id: string) {
    return vegetables.value.find((v) => v.id === id)
  }

  function getAllVegetables() {
    return vegetables.value
  }

  // Computed project stats (replaces taskCount/tasksDone/groupCount on Project)
  function getProjectStats(projectId: string) {
    const projectTasks = tasks.value.filter((t) => t.projectId === projectId)
    const done = projectTasks.filter((t) => t.status === 'Erledigt').length
    const groupCount = groups.value.filter((g) => g.projectId === projectId).length
    return { taskCount: projectTasks.length, tasksDone: done, groupCount }
  }

  function toggleTask(taskId: string) {
    const task = tasks.value.find((t) => t.id === taskId)
    if (task) {
      task.status = task.status === 'Erledigt' ? 'Offen' : 'Erledigt'
      updateProjectProgress(task.projectId)
    }
  }

  function togglePreProjectItem(preProjectId: string, itemId: string) {
    const pp = preProjects.value.find((p) => p.id === preProjectId)
    if (pp) {
      const item = pp.items.find((i) => i.id === itemId)
      if (item) {
        item.completed = !item.completed
      }
    }
  }

  function updateProjectProgress(projectId: string) {
    const project = projects.value.find((p) => p.id === projectId)
    if (project) {
      const projectTasks = tasks.value.filter((t) => t.projectId === projectId)
      const done = projectTasks.filter((t) => t.status === 'Erledigt').length
      project.progress = projectTasks.length > 0 ? Math.round((done / projectTasks.length) * 100) : 0
    }
  }

  function updateProjectStatus(projectId: string, status: Project['status']) {
    const project = projects.value.find((p) => p.id === projectId)
    if (project) project.status = status
  }

  function updateProjectPhase(projectId: string, phase: Project['currentPhase']) {
    const project = projects.value.find((p) => p.id === projectId)
    if (project) project.currentPhase = phase
  }

  return {
    projects,
    preProjects,
    tasks,
    cultures,
    groups,
    topics,
    vegetables,
    activeProjects,
    getProjectById,
    getPreProjectByProjectId,
    getTasksByProjectId,
    getTopicsByProjectId,
    getTasksByTopicId,
    getCulturesByProjectId,
    getGroupsByProjectId,
    getProjectStats,
    getVegetableById,
    getAllVegetables,
    toggleTask,
    togglePreProjectItem,
    updateProjectProgress,
    updateProjectStatus,
    updateProjectPhase,
  }
})
