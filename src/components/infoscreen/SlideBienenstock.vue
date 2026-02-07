<script setup lang="ts">
import { useDashboardStore, type Milestone } from '~/stores/dashboard'

const store = useDashboardStore()

const bubbleClasses = (status: Milestone['status']) => {
    switch (status) {
        case 'accomplished':
            return 'bg-amber-400 border-amber-500 text-white'
        case 'failed':
            return 'bg-red-400 border-red-500 text-white'
        case 'planned':
            return 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-500 text-gray-400 dark:text-gray-300'
    }
}

// Lightbox state
const lightboxOpen = ref(false)
const lightboxImages = ref<{ src: string; label: string; status: string }[]>([])
const lightboxStartIndex = ref(0)

function openLightbox(milestones: Milestone[], index: number) {
    lightboxImages.value = milestones
        .filter((ms) => ms.image)
        .map((ms) => ({ src: ms.image!, label: ms.label, status: ms.status }))
    const ms = milestones[index]
    if (ms) {
        lightboxStartIndex.value = lightboxImages.value.findIndex((img) => img.src === ms.image)
        if (lightboxStartIndex.value < 0) lightboxStartIndex.value = 0
    }
    lightboxOpen.value = true
}
</script>

<template>
    <section class="w-full shrink-0 snap-start snap-always overflow-y-auto p-4">
        <div class="space-y-5">
            <div v-for="item in store.bienenstock" :key="item.task" class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm dark:shadow-none">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-xl font-bold dark:text-white">{{ item.icon }} {{ item.task }}</span>
                    <span class="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 text-sm font-semibold px-3 py-1 rounded-full">
                        {{ item.phase }}
                    </span>
                </div>
                <div class="relative w-full mb-6">
                    <div class="w-full bg-amber-100 dark:bg-amber-900/30 rounded-full h-5 overflow-hidden">
                        <div class="bg-amber-400 h-full rounded-full transition-all" :style="{ width: item.percent + '%' }" />
                    </div>
                    <div
                        v-for="(ms, msIdx) in item.milestones"
                        :key="ms.at"
                        class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 group"
                        :style="{ left: ms.at + '%' }"
                    >
                        <div
                            class="w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold shadow-md transition-transform hover:scale-110"
                            :class="[bubbleClasses(ms.status), ms.image ? 'cursor-pointer' : 'cursor-default']"
                            @click.stop="ms.image && openLightbox(item.milestones, msIdx)"
                        >
                            <template v-if="ms.image">
                                <img :src="ms.image" :alt="ms.label" class="w-full h-full rounded-full object-cover" />
                            </template>
                            <template v-else-if="ms.status === 'accomplished'"> &#10003; </template>
                            <template v-else-if="ms.status === 'failed'"> &#10007; </template>
                            <template v-else>
                                {{ ms.at }}
                            </template>
                        </div>
                        <span
                            class="absolute left-1/2 -translate-x-1/2 top-full mt-1 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                        >
                            {{ ms.label }}
                        </span>
                    </div>
                </div>
                <p class="text-right text-sm text-gray-500 dark:text-gray-400 mt-1 font-bold">{{ item.percent }}%</p>
            </div>

            <div class="p-5 bg-amber-100 dark:bg-amber-950/50 rounded-2xl text-center">
                <p class="text-base text-amber-800 dark:text-amber-300 font-medium">🐝 Die Bienen sind fleissig am Arbeiten!</p>
            </div>
        </div>

        <MilestoneLightbox
            v-if="lightboxOpen"
            :images="lightboxImages"
            :start-index="lightboxStartIndex"
            @close="lightboxOpen = false"
        />
    </section>
</template>
