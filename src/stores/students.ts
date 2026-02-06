import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Student } from '@/types'
import { fixtureStudents } from '@/data/fixtures/students'

export const useStudentsStore = defineStore('students', () => {
  const students = ref<Student[]>(fixtureStudents)

  function getStudentById(id: string) {
    return students.value.find((s) => s.id === id)
  }

  function getStudentsByIds(ids: string[]) {
    return students.value.filter((s) => ids.includes(s.id))
  }

  return { students, getStudentById, getStudentsByIds }
})
