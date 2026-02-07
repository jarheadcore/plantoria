<script setup lang="ts">
import { useDashboardStore, type Milestone } from '~/stores/dashboard'
import { useDiaryStore } from '@/stores/diary'
import { mascots, milestonePhotos } from '@/utils/images'

const store = useDashboardStore()
const diaryStore = useDiaryStore()

const milestoneGallery = [
    { id: 'ms-saen', src: milestonePhotos.ruebliSaen, title: 'Rüebli säen', date: '12.03' },
    { id: 'ms-wachstum', src: milestonePhotos.ruebliWachstum, title: 'Rüebli Wachstum', date: '28.04' },
    { id: 'ms-ernte', src: milestonePhotos.ruebliErnte, title: 'Rüebli Ernte', date: '15.07' },
]

const cropMascot: Record<string, string> = {
    Karotten: mascots.karotte,
    Tomaten: mascots.tomate,
    Lauch: mascots.lauch,
}

const bubbleClasses = (ms: Milestone) => {
    switch (ms.status) {
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
            <div v-for="item in store.gemuese" :key="item.crop" class="bg-white rounded-2xl p-4 shadow-sm">
                <div class="flex items-center justify-between mb-2">
                    <span class="flex items-center gap-2 text-xl font-bold">
                        <img v-if="cropMascot[item.crop]" :src="cropMascot[item.crop]" :alt="item.crop" class="w-8 h-8 rounded-full object-cover" />
                        <template v-else>{{ item.icon }}</template>
                        {{ item.crop }}
                    </span>
                    <span class="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">
                        {{ item.phase }}
                    </span>
                </div>
                <div class="relative w-full mb-8">
                    <div class="w-full bg-green-100 rounded-full h-5 overflow-hidden">
                        <div class="bg-green-500 h-full rounded-full transition-all" :style="{ width: item.percent + '%' }" />
                    </div>
                    <div
                        v-for="ms in item.milestones"
                        :key="ms.at"
                        class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 group"
                        :style="{ left: ms.at + '%' }"
                    >
                        <div
                            :class="[
                                'rounded-full border-2 flex items-center justify-center font-bold shadow-md transition-transform hover:scale-110 cursor-default overflow-hidden w-12 h-12 text-base',
                                bubbleClasses(ms),
                            ]"
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
                            class="absolute left-1/2 -translate-x-1/2 top-full mt-1 text-xs text-gray-500 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                        >
                            {{ ms.label }}
                        </span>
                    </div>
                </div>
                <p class="text-right text-sm text-gray-500 mt-1 font-bold">{{ item.percent }}%</p>
            </div>

            <!-- Diary photo strip from Tagebuch -->
            <div class="bg-white rounded-2xl p-4 shadow-sm">
                <h3 class="text-base font-bold mb-3">📸 Aus dem Tagebuch</h3>
                <div class="flex gap-3 overflow-x-auto pb-1">
                    <!-- Milestone photos -->
                    <div
                        v-for="ms in milestoneGallery"
                        :key="ms.id"
                        class="shrink-0 w-24"
                    >
                        <div class="h-24 w-24 rounded-xl overflow-hidden bg-gray-100 shadow-sm">
                            <img
                                :src="ms.src"
                                :alt="ms.title"
                                class="h-full w-full object-cover"
                            />
                        </div>
                        <p class="text-xs text-gray-600 mt-1.5 text-center font-medium truncate">
                            {{ ms.title }}
                        </p>
                        <p class="text-xs text-gray-400 text-center">
                            {{ ms.date }}
                        </p>
                    </div>
                    <!-- User diary photos -->
                    <div
                        v-for="photo in diaryStore.allPhotos.slice(0, 5)"
                        :key="photo.id"
                        class="shrink-0 w-24"
                    >
                        <div class="h-24 w-24 rounded-xl overflow-hidden bg-gray-100 shadow-sm">
                            <img
                                :src="photo.base64"
                                :alt="photo.taskTitle"
                                class="h-full w-full object-cover"
                            />
                        </div>
                        <p class="text-xs text-gray-600 mt-1.5 text-center font-medium truncate">
                            {{ photo.taskTitle }}
                        </p>
                        <p class="text-xs text-gray-400 text-center">
                            {{ new Date(photo.takenAt).toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit' }) }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="p-5 bg-green-100 rounded-2xl text-center">
                <p class="text-base text-green-800 font-medium">🌤️ Dein Beet sieht in 3 Monaten grossartig aus!</p>
            </div>
        </div>
    </section>
</template>
