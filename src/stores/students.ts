import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Student } from '@/types'
import { fixtureStudents } from '@/data/fixtures/students'

export const useStudentsStore = defineStore('students', () => {
  const students = ref<Student[]>(fixtureStudents)
  let nextId = 61

  function getStudentById(id: string) {
    return students.value.find((s) => s.id === id)
  }

  function getStudentsByIds(ids: string[]) {
    return students.value.filter((s) => ids.includes(s.id))
  }

  function getStudentsByClassId(classId: string) {
    return students.value.filter((s) => s.classId === classId)
  }

  function addStudent(data: { name: string; classId: string; grade: number; tabletAccess: boolean }): Student {
    const student: Student = {
      id: `s-${nextId++}`,
      name: data.name,
      classId: data.classId,
      grade: data.grade,
      tabletAccess: data.tabletAccess,
    }
    students.value.push(student)
    return student
  }

  function deleteStudent(studentId: string): Student | null {
    const idx = students.value.findIndex((s) => s.id === studentId)
    if (idx === -1) return null
    const removed = students.value.splice(idx, 1)
    const student = removed[0]
    return student ?? null
  }

  function moveStudent(studentId: string, targetClassId: string, targetGrade: number): { sourceClassId: string; targetClassId: string } | null {
    const student = students.value.find((s) => s.id === studentId)
    if (!student) return null
    const sourceClassId = student.classId
    student.classId = targetClassId
    student.grade = targetGrade
    student.tabletAccess = targetGrade >= 3
    return { sourceClassId, targetClassId }
  }

  return { students, getStudentById, getStudentsByIds, getStudentsByClassId, addStudent, deleteStudent, moveStudent }
})
