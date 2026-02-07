import {
  Flower,
  Flower2,
  TreePine,
  Leaf,
  Sprout,
  Sun,
  Star,
  Heart,
  Bird,
  Bug,
  Fish,
  Rabbit,
  Cat,
  Dog,
  Squirrel,
  Turtle,
  Cherry,
  Apple,
  Rainbow,
  Clover,
} from 'lucide-vue-next'
import type { Component } from 'vue'

export interface GroupIconEntry {
  id: string
  label: string
  icon: Component
  color: string
}

export const GROUP_ICONS: GroupIconEntry[] = [
  { id: 'flower', label: 'Blume', icon: Flower, color: 'text-pink-500' },
  { id: 'flower-2', label: 'Gänseblümchen', icon: Flower2, color: 'text-yellow-500' },
  { id: 'tree-pine', label: 'Tanne', icon: TreePine, color: 'text-emerald-700' },
  { id: 'leaf', label: 'Blatt', icon: Leaf, color: 'text-green-500' },
  { id: 'sprout', label: 'Spross', icon: Sprout, color: 'text-lime-500' },
  { id: 'sun', label: 'Sonne', icon: Sun, color: 'text-amber-400' },
  { id: 'star', label: 'Stern', icon: Star, color: 'text-yellow-400' },
  { id: 'heart', label: 'Herz', icon: Heart, color: 'text-red-500' },
  { id: 'bird', label: 'Vogel', icon: Bird, color: 'text-sky-500' },
  { id: 'bug', label: 'Käfer', icon: Bug, color: 'text-orange-500' },
  { id: 'fish', label: 'Fisch', icon: Fish, color: 'text-cyan-500' },
  { id: 'rabbit', label: 'Hase', icon: Rabbit, color: 'text-amber-600' },
  { id: 'cat', label: 'Katze', icon: Cat, color: 'text-violet-500' },
  { id: 'dog', label: 'Hund', icon: Dog, color: 'text-amber-700' },
  { id: 'squirrel', label: 'Eichhörnchen', icon: Squirrel, color: 'text-orange-600' },
  { id: 'turtle', label: 'Schildkröte', icon: Turtle, color: 'text-teal-500' },
  { id: 'cherry', label: 'Kirsche', icon: Cherry, color: 'text-rose-500' },
  { id: 'apple', label: 'Apfel', icon: Apple, color: 'text-red-400' },
  { id: 'rainbow', label: 'Regenbogen', icon: Rainbow, color: 'text-indigo-500' },
  { id: 'clover', label: 'Kleeblatt', icon: Clover, color: 'text-emerald-500' },
]

export function getGroupIcon(iconId: string): GroupIconEntry | undefined {
  return GROUP_ICONS.find((i) => i.id === iconId)
}
