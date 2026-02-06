<script setup lang="ts">
const gemuese = ref([
  { crop: 'Karotten', icon: '🥕', percent: 72, phase: 'Wachstum' },
  { crop: 'Brokkoli', icon: '🥦', percent: 45, phase: 'Aussaat' },
  { crop: 'Tomaten', icon: '🍅', percent: 30, phase: 'Setzlinge' },
  { crop: 'Lauch', icon: '🌿', percent: 58, phase: 'Wachstum' },
])
</script>

<template>
  <section class="w-full shrink-0 snap-start snap-always overflow-y-auto p-4">
    <div class="space-y-5">
      <div v-for="item in gemuese" :key="item.crop" class="bg-white rounded-2xl p-4 shadow-sm">
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
</template>
