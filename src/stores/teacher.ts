import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User, School, SchoolClass } from '@/types'
import { mockTeacher, mockSchool, mockClass } from '@/data/mock/teacher'

export const useTeacherStore = defineStore('teacher', () => {
  const teacher = ref<User>(mockTeacher)
  const school = ref<School>(mockSchool)
  const activeClass = ref<SchoolClass>(mockClass)

  return { teacher, school, activeClass }
})
