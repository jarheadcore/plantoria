import type { StudentGroup } from '@/types'

export const fixtureGroups: StudentGroup[] = [
  {
    id: 'g-1',
    projectId: 'proj-1',
    name: 'Sonnenblume',
    icon: 'flower',
    studentIds: ['s-1', 's-2', 's-3', 's-12', 's-13', 's-14'],
    tasksCompleted: 5,
    tasksTotal: 8,
  },
  {
    id: 'g-2',
    projectId: 'proj-1',
    name: 'Löwenzahn',
    icon: 'sprout',
    studentIds: ['s-4', 's-5', 's-6', 's-15', 's-16', 's-17'],
    tasksCompleted: 3,
    tasksTotal: 7,
  },
  {
    id: 'g-3',
    projectId: 'proj-1',
    name: 'Gänseblümchen',
    icon: 'flower-2',
    studentIds: ['s-7', 's-8', 's-9', 's-18', 's-19', 's-20'],
    tasksCompleted: 4,
    tasksTotal: 7,
  },
  {
    id: 'g-unassigned',
    projectId: 'proj-1',
    name: 'Nicht zugewiesen',
    studentIds: ['s-10', 's-11', 's-21', 's-22'],
    tasksCompleted: 0,
    tasksTotal: 0,
  },
]
