import type { User, School, SchoolClass } from '@/types'

export const fixtureTeacher: User = {
  id: 'teacher-1',
  email: 'anna.mueller@schule-aarau.ch',
  role: 'Lehrperson',
  schoolId: 'school-1',
  name: 'Anna Mueller',
}

export const fixtureSchool: School = {
  id: 'school-1',
  name: 'Primarschule Aarau',
  location: 'Aarau, Aargau',
  canton: 'AG',
  ranking: 3,
  totalArea: 25,
}

export const fixtureClass: SchoolClass = {
  id: 'class-1',
  schoolId: 'school-1',
  name: 'HE24a',
  grade: 4,
  teacherId: 'teacher-1',
  studentCount: 22,
  schoolYear: '2025/2026',
}

export const fixtureAvailableClasses: SchoolClass[] = [
  {
    id: 'class-1',
    schoolId: 'school-1',
    name: 'HE24a',
    grade: 4,
    teacherId: 'teacher-1',
    studentCount: 22,
    schoolYear: '2025/2026',
  },
  {
    id: 'class-2',
    schoolId: 'school-1',
    name: 'HE23b',
    grade: 5,
    teacherId: 'teacher-2',
    studentCount: 18,
    schoolYear: '2025/2026',
    substituteTeacherId: 'teacher-1',
  },
  {
    id: 'class-3',
    schoolId: 'school-1',
    name: 'HE25a',
    grade: 3,
    teacherId: 'teacher-1',
    studentCount: 20,
    schoolYear: '2025/2026',
  },
]
