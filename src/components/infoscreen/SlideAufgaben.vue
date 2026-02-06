<script setup lang="ts">
const todos = ref([
  { id: 1, title: 'Kohl in Beet 3 pflanzen', group: 'Gruppe Sonnenblume', done: false },
  { id: 2, title: 'Erde im Hochbeet lockern', group: 'Alle', done: false },
  { id: 3, title: 'Karotten giessen', group: 'Gruppe Regenwurm', done: true },
  { id: 4, title: 'Wachstum messen und eintragen', group: 'Gruppe Sonnenblume', done: false },
  { id: 5, title: 'Händewaschen-Protokoll ausfüllen', group: 'Alle', done: true },
])

function toggleTodo(id: number) {
  const todo = todos.value.find((t) => t.id === id)
  if (todo) todo.done = !todo.done
}
</script>

<template>
  <section class="w-full shrink-0 snap-start snap-always overflow-y-auto p-4">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-green-800">Aufgaben</h2>
      <span class="bg-amber-100 text-amber-800 font-bold rounded-full px-3 py-1 text-sm">
        {{ todos.filter((t) => !t.done).length }} offen
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
          <p class="text-lg" :class="todo.done ? 'line-through text-gray-400' : 'font-semibold'">
            {{ todo.title }}
          </p>
          <p class="text-sm text-gray-500">{{ todo.group }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
