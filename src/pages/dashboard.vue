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
  { label: 'Pflanzen', emoji: '🌱', value: 'progress' },
  { label: 'Rangliste', emoji: '🏆', value: 'ranking' },
  { label: 'Aufgaben', emoji: '✅', value: 'todos' },
  { label: 'Statistik', emoji: '📊', value: 'stats' },
  { label: 'Kalender', emoji: '📅', value: 'calendar' }
]

const activeTab = ref(0)
const scrollContainer = ref<HTMLElement | null>(null)

function scrollToTab(index: number) {
  activeTab.value = index
  scrollContainer.value?.children[index]?.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'start'
  })
}

function onScroll() {
  const el = scrollContainer.value
  if (!el) return
  const scrollLeft = el.scrollLeft
  const panelWidth = el.offsetWidth
  activeTab.value = Math.round(scrollLeft / panelWidth)
}

function toggleTodo(id: number) {
  const todo = todos.value.find(t => t.id === id)
  if (todo) todo.done = !todo.done
}
</script>

<template>
  <div class="h-dvh flex flex-col bg-green-50/50 overflow-hidden select-none">
    <!-- Compact header -->
    <header class="bg-green-600 text-white px-4 py-2 shrink-0">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-2xl">🌱</span>
          <h1 class="text-lg font-bold">Plantoria</h1>
        </div>
        <div class="bg-amber-400 text-amber-900 font-bold rounded-full px-3 py-1 text-sm">
          🏆 1050
        </div>
      </div>
    </header>

    <!-- Swipeable panels -->
    <div
      ref="scrollContainer"
      class="flex-1 flex overflow-x-auto snap-x snap-mandatory scroll-smooth"
      style="scrollbar-width: none; -webkit-overflow-scrolling: touch"
      @scroll="onScroll"
    >
      <!-- Progress panel -->
      <section class="w-full shrink-0 snap-start snap-always overflow-y-auto p-4">
        <div class="space-y-5">
          <div v-for="item in progress" :key="item.crop" class="bg-white rounded-2xl p-4 shadow-sm">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xl font-bold">{{ item.icon }} {{ item.crop }}</span>
              <span class="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">
                {{ item.phase }}
              </span>
            </div>
            <div class="w-full bg-green-100 rounded-full h-5 overflow-hidden">
              <div
                class="bg-green-500 h-full rounded-full transition-all"
                :style="{ width: item.percent + '%' }"
              />
            </div>
            <p class="text-right text-sm text-gray-500 mt-1 font-bold">{{ item.percent }}%</p>
          </div>

          <div class="p-5 bg-green-100 rounded-2xl text-center">
            <p class="text-base text-green-800 font-medium">
              🌤️ Dein Beet sieht in 3 Monaten grossartig aus!
            </p>
          </div>
        </div>
      </section>

      <!-- Ranking panel -->
      <section class="w-full shrink-0 snap-start snap-always overflow-y-auto p-4">
        <div class="space-y-3">
          <div
            v-for="entry in rankings"
            :key="entry.rank"
            class="flex items-center gap-4 p-4 rounded-2xl shadow-sm"
            :class="entry.highlight ? 'bg-green-100 ring-2 ring-green-400' : 'bg-white'"
          >
            <span
              class="text-4xl font-black w-12 text-center"
              :class="entry.rank <= 3 ? 'text-amber-500' : 'text-gray-300'"
            >
              {{ entry.rank }}
            </span>
            <div class="flex-1 min-w-0">
              <p class="font-bold text-lg truncate">{{ entry.name }}</p>
              <p class="text-sm text-gray-500">{{ entry.school }}</p>
            </div>
            <span class="text-xl font-black text-green-700">{{ entry.points }}</span>
          </div>
        </div>
      </section>

      <!-- Todos panel -->
      <section class="w-full shrink-0 snap-start snap-always overflow-y-auto p-4">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-green-800">Aufgaben</h2>
          <span class="bg-amber-100 text-amber-800 font-bold rounded-full px-3 py-1 text-sm">
            {{ todos.filter(t => !t.done).length }} offen
          </span>
        </div>

        <div class="space-y-3">
          <div
            v-for="todo in todos"
            :key="todo.id"
            class="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
            @click="toggleTodo(todo.id)"
          >
            <div
              class="w-10 h-10 rounded-xl flex items-center justify-center text-2xl shrink-0"
              :class="todo.done ? 'bg-green-100' : 'bg-gray-100'"
            >
              {{ todo.done ? '✅' : '⬜' }}
            </div>
            <div class="flex-1 min-w-0">
              <p
                class="text-lg"
                :class="todo.done ? 'line-through text-gray-400' : 'font-semibold'"
              >
                {{ todo.title }}
              </p>
              <p class="text-sm text-gray-500">{{ todo.group }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats panel -->
      <section class="w-full shrink-0 snap-start snap-always overflow-y-auto p-4">
        <div class="space-y-4">
          <div class="p-6 bg-green-100 rounded-2xl text-center">
            <p class="text-6xl font-black text-green-700">
              {{ stats.tasksCompleted }}/{{ stats.tasksTotal }}
            </p>
            <p class="text-base text-green-800 mt-2 font-medium">Aufgaben erledigt</p>
            <div class="w-full bg-green-200 rounded-full h-5 mt-4 overflow-hidden">
              <div
                class="bg-green-500 h-full rounded-full transition-all"
                :style="{ width: (stats.tasksCompleted / stats.tasksTotal) * 100 + '%' }"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="p-6 bg-amber-50 rounded-2xl text-center shadow-sm">
              <p class="text-5xl font-black text-amber-600">{{ stats.harvestKg }}</p>
              <p class="text-base text-gray-600 mt-1 font-medium">kg Ernte</p>
            </div>
            <div class="p-6 bg-blue-50 rounded-2xl text-center shadow-sm">
              <p class="text-5xl font-black text-blue-600">{{ stats.activeProjects }}</p>
              <p class="text-base text-gray-600 mt-1 font-medium">Projekte</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Calendar panel -->
      <section class="w-full shrink-0 snap-start snap-always overflow-y-auto p-4">
        <div class="space-y-3">
          <div
            v-for="(event, i) in calendar"
            :key="i"
            class="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm"
          >
            <div class="shrink-0 w-16 h-16 bg-green-100 rounded-xl flex flex-col items-center justify-center">
              <p class="text-xs text-green-600 font-bold leading-tight">
                {{ event.date.split(' ')[0] }}
              </p>
              <p class="text-xl font-black text-green-800 leading-tight">
                {{ event.date.split(' ')[1] }}
              </p>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-bold text-lg">{{ event.task }}</p>
              <p class="text-sm text-gray-500">{{ event.crop }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Dot indicators -->
    <div class="flex justify-center gap-2 py-2 bg-white/80 shrink-0">
      <div
        v-for="(tab, i) in tabs"
        :key="tab.value"
        class="w-2 h-2 rounded-full transition-all"
        :class="activeTab === i ? 'bg-green-600 w-6' : 'bg-gray-300'"
      />
    </div>

    <!-- Bottom tab bar — big touch targets for kids -->
    <nav class="bg-white border-t border-gray-200 shrink-0 safe-area-bottom">
      <div class="flex">
        <button
          v-for="(tab, i) in tabs"
          :key="tab.value"
          class="flex-1 flex flex-col items-center py-2 transition-colors"
          :class="activeTab === i ? 'text-green-600' : 'text-gray-400'"
          @click="scrollToTab(i)"
        >
          <span class="text-2xl leading-none">{{ tab.emoji }}</span>
          <span class="text-xs font-bold mt-1">{{ tab.label }}</span>
        </button>
      </div>
    </nav>
  </div>
</template>

<style scoped>
/* Hide scrollbar across browsers */
div[style*="scrollbar-width"] ::-webkit-scrollbar {
  display: none;
}

/* Safe area for devices with home indicator */
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
</style>
