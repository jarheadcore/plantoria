<script setup lang="ts">
const calendar = ref([
  { date: 'Feb 10', task: 'Setzlinge vorziehen', crop: '🍅 Tomaten' },
  { date: 'Mär 01', task: 'Beet vorbereiten', crop: '🥕 Karotten' },
  { date: 'Mär 15', task: 'Aussaat Brokkoli', crop: '🥦 Brokkoli' },
  { date: 'Apr 05', task: 'Lauch auspflanzen', crop: '🌿 Lauch' },
  { date: 'Jun 20', task: 'Erste Ernte erwartet', crop: '🥕 Karotten' },
])
</script>

<template>
  <section class="w-full shrink-0 snap-start snap-always overflow-y-auto p-4">
    <div class="space-y-3">
      <div
        v-for="(event, i) in calendar"
        :key="i"
        class="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm"
      >
        <div
          class="shrink-0 w-16 h-16 bg-green-100 rounded-xl flex flex-col items-center justify-center"
        >
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
</template>
