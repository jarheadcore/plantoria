<script setup lang="ts">
import { useDashboardStore } from '~/stores/dashboard'

const store = useDashboardStore()
</script>

<template>
  <section class="w-full shrink-0 snap-start snap-always overflow-y-auto p-4">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-green-800">Aufgaben</h2>
      <span class="bg-amber-100 text-amber-800 font-bold rounded-full px-3 py-1 text-sm">
        {{ store.openTodoCount }} offen
      </span>
    </div>

    <div class="space-y-3">
      <div
        v-for="todo in store.todos"
        :key="todo.id"
        class="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
        @click="store.toggleTodo(todo.id)"
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
