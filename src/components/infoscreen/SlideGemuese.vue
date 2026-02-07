<script setup lang="ts">
import { useDashboardStore, type Milestone } from '~/stores/dashboard'
import { useDiaryStore } from '@/stores/diary'

const store = useDashboardStore()
const diaryStore = useDiaryStore()

const bubbleClasses = (ms: Milestone & { diaryPhoto?: string }) => {
    if (ms.diaryPhoto) return 'border-green-500 shadow-lg'
    switch (ms.status) {
        case 'accomplished':
            return 'bg-green-500 border-green-600 text-white'
        case 'failed':
            return 'bg-red-400 border-red-500 text-white'
        case 'planned':
            return 'bg-white border-gray-300 text-gray-400'
    }
}

// Inject diary photos into accomplished milestones of the dashboard gemuese data
const gemuese = computed(() => {
    const photos = diaryStore.allPhotos
    return store.gemuese.map((item) => {
        let photoIdx = 0
        const milestones = item.milestones.map((ms) => {
            if (ms.status === 'accomplished' && photos[photoIdx]) {
                const result = { ...ms, diaryPhoto: photos[photoIdx]!.base64 }
                photoIdx++
                return result
            }
            return { ...ms, diaryPhoto: undefined }
        })
        return { ...item, milestones }
    })
})
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
                                'rounded-full border-2 flex items-center justify-center font-bold shadow-md transition-transform hover:scale-110 cursor-default overflow-hidden',
                                ms.diaryPhoto ? 'w-11 h-11 -mt-0.5' : 'w-8 h-8 text-sm',
                                bubbleClasses(ms),
                            ]"
                        >
                            <!-- Diary photo from Tagebuch upload -->
                            <template v-if="ms.diaryPhoto">
                                <img
                                    :src="ms.diaryPhoto"
                                    :alt="ms.label"
                                    class="w-full h-full object-cover"
                                />
                            </template>
                            <!-- Fallback: SVG milestone image -->
                            <template v-else-if="ms.image">
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
            <div v-if="diaryStore.allPhotos.length > 0" class="bg-white rounded-2xl p-4 shadow-sm">
                <h3 class="text-base font-bold mb-3">📸 Aus dem Tagebuch</h3>
                <div class="flex gap-3 overflow-x-auto pb-1">
                    <div
                        v-for="photo in diaryStore.allPhotos.slice(0, 8)"
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
