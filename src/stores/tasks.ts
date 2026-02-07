import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Task } from '@/types'
import { fixtureTasks } from '@/data/fixtures/tasks'

export const useTasksStore = defineStore('tasks', () => {
    const allTasks = ref<Task[]>([...fixtureTasks])

    const getTasksByProject = computed(() => (projectId: string) => allTasks.value.filter((t) => t.projectId === projectId))

    const getTasksByTopic = computed(() => (topicId: string) => allTasks.value.filter((t) => t.topicId === topicId))

    const holidayTasks = computed(() => allTasks.value.filter((t) => t.isHolidayTask))

    const upcomingTasks = computed(() =>
        allTasks.value
            .filter((t) => t.status !== 'Erledigt')
            .sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''))
            .slice(0, 10),
    )

    function createTask(task: Task) {
        allTasks.value.push(task)
    }

    function updateTask(id: string, updates: Partial<Task>) {
        const idx = allTasks.value.findIndex((t) => t.id === id)
        if (idx !== -1 && allTasks.value[idx]) {
            Object.assign(allTasks.value[idx], updates)
        }
    }

    function deleteTask(id: string) {
        allTasks.value = allTasks.value.filter((t) => t.id !== id)
    }

    function toggleTask(id: string) {
        const task = allTasks.value.find((t) => t.id === id)
        if (task) {
            task.status = task.status === 'Erledigt' ? 'Offen' : 'Erledigt'
        }
    }

    return {
        allTasks,
        getTasksByProject,
        getTasksByTopic,
        holidayTasks,
        upcomingTasks,
        createTask,
        updateTask,
        deleteTask,
        toggleTask,
    }
})
