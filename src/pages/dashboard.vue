<script setup lang="ts">
const progress = ref([
  { crop: 'Karotten', icon: '🥕', percent: 72, phase: 'Wachstum' },
  { crop: 'Brokkoli', icon: '🥦', percent: 45, phase: 'Aussaat' },
  { crop: 'Tomaten', icon: '🍅', percent: 30, phase: 'Setzlinge' },
  { crop: 'Lauch', icon: '🌿', percent: 58, phase: 'Wachstum' }
])

const rankings = ref([
  { rank: 1, name: 'Klasse 4a', school: 'Schulhaus Moos', points: 1240 },
  { rank: 2, name: 'Klasse 3b', school: 'Schulhaus Rüti', points: 1180 },
  { rank: 3, name: 'Klasse HE24a', school: 'Unsere Klasse', points: 1050, highlight: true },
  { rank: 4, name: 'Klasse 5c', school: 'Schulhaus Dorf', points: 980 },
  { rank: 5, name: 'Klasse 3a', school: 'Schulhaus Berg', points: 920 }
])

const todos = ref([
  { id: 1, title: 'Kohl in Beet 3 pflanzen', group: 'Gruppe Sonnenblume', done: false },
  { id: 2, title: 'Erde im Hochbeet lockern', group: 'Alle', done: false },
  { id: 3, title: 'Karotten giessen', group: 'Gruppe Regenwurm', done: true },
  { id: 4, title: 'Wachstum messen und eintragen', group: 'Gruppe Sonnenblume', done: false },
  { id: 5, title: 'Händewaschen-Protokoll ausfüllen', group: 'Alle', done: true }
])

const stats = ref({
  tasksCompleted: 18,
  tasksTotal: 32,
  harvestKg: 4.2,
  activeProjects: 2
})

const calendar = ref([
  { date: 'Feb 10', task: 'Setzlinge vorziehen', crop: '🍅 Tomaten' },
  { date: 'Mär 01', task: 'Beet vorbereiten', crop: '🥕 Karotten' },
  { date: 'Mär 15', task: 'Aussaat Brokkoli', crop: '🥦 Brokkoli' },
  { date: 'Apr 05', task: 'Lauch auspflanzen', crop: '🌿 Lauch' },
  { date: 'Jun 20', task: 'Erste Ernte erwartet', crop: '🥕 Karotten' }
])

const tabs = [
  { label: 'Fortschritt', icon: 'i-lucide-bar-chart-3', value: 'progress', slot: 'progress' },
  { label: 'Rangliste', icon: 'i-lucide-trophy', value: 'ranking', slot: 'ranking' },
  { label: 'Pendenzen', icon: 'i-lucide-check-square', value: 'todos', slot: 'todos' },
  { label: 'Statistik', icon: 'i-lucide-trending-up', value: 'stats', slot: 'stats' },
  { label: 'Kalender', icon: 'i-lucide-calendar', value: 'calendar', slot: 'calendar' }
]

function toggleTodo(id: number) {
  const todo = todos.value.find(t => t.id === id)
  if (todo) todo.done = !todo.done
}
</script>

<template>
  <div class="h-screen flex flex-col bg-green-50/50">
    <!-- Header -->
    <header class="bg-green-600 text-white px-4 py-3 shrink-0">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="text-2xl">🌱</span>
          <div>
            <h1 class="text-xl font-bold leading-tight">Plantoria</h1>
            <p class="text-green-100 text-xs">Klasse HE24a — Gemüsebeet Projekt</p>
          </div>
        </div>
        <UBadge color="warning" variant="solid" size="lg">
          🏆 1050 Punkte
        </UBadge>
      </div>
    </header>

    <!-- Tabs + Content fill remaining height -->
    <UTabs :items="tabs" :default-value="'progress'" class="flex flex-col flex-1 min-h-0" variant="link" :ui="{ list: 'bg-white border-b border-green-200 px-2' }">
      <template #progress>
        <div class="flex-1 overflow-y-auto p-5">
          <div class="max-w-xl mx-auto space-y-6">
            <div v-for="item in progress" :key="item.crop" class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-lg font-semibold">{{ item.icon }} {{ item.crop }}</span>
                <UBadge color="success" variant="subtle">{{ item.phase }}</UBadge>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div class="bg-green-500 h-3 rounded-full" :style="{ width: item.percent + '%' }" />
              </div>
              <p class="text-right text-sm text-gray-500">{{ item.percent }}%</p>
            </div>

            <div class="mt-8 p-4 bg-green-100 rounded-2xl text-center">
              <p class="text-sm text-green-800">🌤️ Digitale Vorschau: Dein Beet in 3 Monaten sieht grossartig aus!</p>
            </div>
          </div>
        </div>
      </template>

      <template #ranking>
        <div class="flex-1 overflow-y-auto p-5">
          <div class="max-w-xl mx-auto space-y-3">
            <div
              v-for="entry in rankings"
              :key="entry.rank"
              class="flex items-center gap-4 p-4 rounded-2xl"
              :class="entry.highlight ? 'bg-green-100 ring-2 ring-green-400' : 'bg-white'"
            >
              <span
                class="text-3xl font-black w-10 text-center"
                :class="entry.rank <= 3 ? 'text-amber-500' : 'text-gray-300'"
              >
                {{ entry.rank }}
              </span>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-base truncate">{{ entry.name }}</p>
                <p class="text-sm text-gray-500">{{ entry.school }}</p>
              </div>
              <span class="text-lg font-bold text-green-700">{{ entry.points }}</span>
            </div>
          </div>
        </div>
      </template>

      <template #todos>
        <div class="flex-1 overflow-y-auto p-5">
          <div class="max-w-xl mx-auto">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-green-800">Aufgaben</h2>
              <UBadge color="neutral" variant="subtle" size="lg">
                {{ todos.filter(t => !t.done).length }} offen
              </UBadge>
            </div>

            <div class="space-y-2">
              <div
                v-for="todo in todos"
                :key="todo.id"
                class="flex items-center gap-4 p-4 bg-white rounded-2xl cursor-pointer active:bg-gray-50"
                @click="toggleTodo(todo.id)"
              >
                <UCheckbox :model-value="todo.done" size="lg" />
                <div class="flex-1 min-w-0">
                  <p class="text-base" :class="todo.done ? 'line-through text-gray-400' : 'font-medium'">
                    {{ todo.title }}
                  </p>
                  <p class="text-sm text-gray-500">{{ todo.group }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #stats>
        <div class="flex-1 overflow-y-auto p-5">
          <div class="max-w-xl mx-auto space-y-4">
            <div class="p-6 bg-green-100 rounded-2xl text-center">
              <p class="text-5xl font-black text-green-700">{{ stats.tasksCompleted }}/{{ stats.tasksTotal }}</p>
              <p class="text-sm text-green-800 mt-2">Aufgaben erledigt</p>
              <UProgress :value="(stats.tasksCompleted / stats.tasksTotal) * 100" color="success" size="lg" class="mt-3" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="p-6 bg-amber-50 rounded-2xl text-center">
                <p class="text-4xl font-black text-amber-700">{{ stats.harvestKg }} kg</p>
                <p class="text-sm text-gray-600 mt-2">Ernte bisher</p>
              </div>
              <div class="p-6 bg-blue-50 rounded-2xl text-center">
                <p class="text-4xl font-black text-blue-700">{{ stats.activeProjects }}</p>
                <p class="text-sm text-gray-600 mt-2">Aktive Projekte</p>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #calendar>
        <div class="flex-1 overflow-y-auto p-5">
          <div class="max-w-xl mx-auto space-y-3">
            <div
              v-for="(event, i) in calendar"
              :key="i"
              class="flex items-center gap-4 p-4 bg-white rounded-2xl"
            >
              <div class="shrink-0 w-16 h-16 bg-green-100 rounded-xl flex flex-col items-center justify-center">
                <p class="text-xs text-green-600 font-semibold leading-tight">{{ event.date.split(' ')[0] }}</p>
                <p class="text-lg font-black text-green-800 leading-tight">{{ event.date.split(' ')[1] }}</p>
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-base">{{ event.task }}</p>
                <p class="text-sm text-gray-500">{{ event.crop }}</p>
              </div>
            </div>
          </div>
        </div>
      </template>
    </UTabs>
  </div>
</template>
