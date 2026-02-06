import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User, School, SchoolClass } from '@/types'
import { fixtureTeacher, fixtureSchool, fixtureClass, fixtureAvailableClasses } from '@/data/fixtures/teacher'

export const useTeacherStore = defineStore('teacher', () => {
  const teacher = ref<User>(fixtureTeacher)
  const school = ref<School>(fixtureSchool)
  const activeClass = ref<SchoolClass>(fixtureClass)
  const availableClasses = ref<SchoolClass[]>(fixtureAvailableClasses)

  function switchClass(classId: string) {
    const found = availableClasses.value.find((c) => c.id === classId)
    if (found) {
      activeClass.value = found
    }
  }

  return { teacher, school, activeClass, availableClasses, switchClass }
})
