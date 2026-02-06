import type { User, School, SchoolClass } from '@/types'

export const mockTeacher: User = {
  id: 'teacher-1',
  email: 'anna.mueller@schule-aarau.ch',
  role: 'Lehrperson',
  schoolId: 'school-1',
  name: 'Anna Mueller',
}

export const mockSchool: School = {
  id: 'school-1',
  name: 'Primarschule Aarau',
  location: 'Aarau, Aargau',
  canton: 'AG',
  ranking: 3,
  totalArea: 25,
}

export const mockClass: SchoolClass = {
  id: 'class-1',
  schoolId: 'school-1',
  name: 'HE24a',
  grade: 4,
  teacherId: 'teacher-1',
  studentCount: 22,
  schoolYear: '2025/2026',
}
