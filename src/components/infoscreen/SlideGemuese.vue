<script setup lang="ts">
interface Milestone {
  at: number
  status: 'accomplished' | 'failed' | 'planned'
  label: string
  image?: string
}

const gemuese = ref([
  {
    crop: 'Karotten',
    icon: '🥕',
    percent: 72,
    phase: 'Wachstum',
    milestones: [
      { at: 25, status: 'accomplished', label: 'Gekeimt', image: '/milestones/karotte-gekeimt.svg' },
      { at: 50, status: 'accomplished', label: 'Erstes Grün', image: '/milestones/karotte-erstes-gruen.svg' },
      { at: 75, status: 'planned', label: 'Erntereif', image: '/milestones/karotte-erntereif.svg' },
      { at: 100, status: 'planned', label: 'Geerntet', image: '/milestones/karotte-geerntet.svg' },
    ] as Milestone[],
  },
  {
    crop: 'Brokkoli',
    icon: '🥦',
    percent: 45,
    phase: 'Aussaat',
    milestones: [
      { at: 25, status: 'accomplished', label: 'Gekeimt', image: '/milestones/brokkoli-gekeimt.svg' },
      { at: 50, status: 'planned', label: 'Kopfbildung', image: '/milestones/brokkoli-kopfbildung.svg' },
      { at: 75, status: 'planned', label: 'Erntereif', image: '/milestones/brokkoli-erntereif.svg' },
      { at: 100, status: 'planned', label: 'Geerntet', image: '/milestones/brokkoli-geerntet.svg' },
    ] as Milestone[],
  },
  {
    crop: 'Tomaten',
    icon: '🍅',
    percent: 30,
    phase: 'Setzlinge',
    milestones: [
      { at: 25, status: 'accomplished', label: 'Gekeimt', image: '/milestones/tomate-gekeimt.svg' },
      { at: 50, status: 'failed', label: 'Umgetopft', image: '/milestones/tomate-umgetopft.svg' },
      { at: 75, status: 'planned', label: 'Erste Früchte', image: '/milestones/tomate-erste-fruechte.svg' },
      { at: 100, status: 'planned', label: 'Geerntet', image: '/milestones/tomate-geerntet.svg' },
    ] as Milestone[],
  },
  {
    crop: 'Lauch',
    icon: '🌿',
    percent: 58,
    phase: 'Wachstum',
    milestones: [
      { at: 25, status: 'accomplished', label: 'Gekeimt', image: '/milestones/lauch-gekeimt.svg' },
      { at: 50, status: 'accomplished', label: 'Angewachsen', image: '/milestones/lauch-angewachsen.svg' },
      { at: 75, status: 'planned', label: 'Erntereif', image: '/milestones/lauch-erntereif.svg' },
      { at: 100, status: 'planned', label: 'Geerntet', image: '/milestones/lauch-geerntet.svg' },
    ] as Milestone[],
  },
])

const bubbleClasses = (status: Milestone['status']) => {
  switch (status) {
    case 'accomplished':
      return 'bg-green-500 border-green-600 text-white'
    case 'failed':
      return 'bg-red-400 border-red-500 text-white'
    case 'planned':
      return 'bg-white border-gray-300 text-gray-400'
  }
}
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
        <div class="relative w-full mb-6">
          <div class="w-full bg-green-100 rounded-full h-5 overflow-hidden">
            <div
              class="bg-green-500 h-full rounded-full transition-all"
              :style="{ width: item.percent + '%' }"
            />
          </div>
          <div
            v-for="ms in item.milestones"
            :key="ms.at"
            class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 group"
            :style="{ left: ms.at + '%' }"
          >
            <div
              class="w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold shadow-md transition-transform hover:scale-110 cursor-default"
              :class="bubbleClasses(ms.status)"
            >
              <template v-if="ms.image">
                <img
                  :src="ms.image"
                  :alt="ms.label"
                  class="w-full h-full rounded-full object-cover"
                />
              </template>
              <template v-else-if="ms.status === 'accomplished'">
                &#10003;
              </template>
              <template v-else-if="ms.status === 'failed'">
                &#10007;
              </template>
              <template v-else>
                {{ ms.at }}
              </template>
            </div>
            <span
              class="absolute left-1/2 -translate-x-1/2 top-full mt-1 text-xs text-gray-500 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            >
              {{ ms.label }}
            </span>
          </div>
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
