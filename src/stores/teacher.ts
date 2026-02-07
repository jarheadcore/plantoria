import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User, School, SchoolClass } from '@/types'
import { fixtureTeacher, fixtureSchool, fixtureClass, fixtureAvailableClasses } from '@/data/fixtures/teacher'

export const useTeacherStore = defineStore('teacher', () => {
  const teacher = ref<User>(fixtureTeacher)
  const school = ref<School>(fixtureSchool)
  const activeClass = ref<SchoolClass>(fixtureClass)
  const availableClasses = ref<SchoolClass[]>(fixtureAvailableClasses)
  let nextClassId = 4

  function switchClass(classId: string) {
    const found = availableClasses.value.find((c) => c.id === classId)
    if (found) {
      activeClass.value = found
    }
  }

  function addClass(data: { name: string; grade: number; schoolYear: string }): SchoolClass {
    const newClass: SchoolClass = {
      id: `class-${nextClassId++}`,
      schoolId: school.value.id,
      name: data.name,
      grade: data.grade,
      teacherId: teacher.value.id,
      studentCount: 0,
      schoolYear: data.schoolYear,
    }
    availableClasses.value.push(newClass)
    return newClass
  }

  function deleteClass(classId: string): boolean {
    if (classId === activeClass.value.id) return false
    const cls = availableClasses.value.find((c) => c.id === classId)
    if (!cls || cls.studentCount !== 0) return false
    availableClasses.value = availableClasses.value.filter((c) => c.id !== classId)
    return true
  }

  function updateStudentCount(classId: string, delta: number) {
    const cls = availableClasses.value.find((c) => c.id === classId)
    if (cls) {
      cls.studentCount += delta
    }
    if (activeClass.value.id === classId) {
      activeClass.value.studentCount += delta
    }
  }

  return { teacher, school, activeClass, availableClasses, switchClass, addClass, deleteClass, updateStudentCount }
})
