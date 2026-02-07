<script setup lang="ts">
import { useDashboardStore } from '~/stores/dashboard'

const store = useDashboardStore()
const scrollContainer = ref<HTMLElement | null>(null)

function scrollToTab(index: number) {
    store.activeTab = index
    scrollContainer.value?.children[index]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
    })
}

function onScroll() {
    const el = scrollContainer.value
    if (!el) return
    const scrollLeft = el.scrollLeft
    const panelWidth = el.offsetWidth
    store.activeTab = Math.round(scrollLeft / panelWidth)
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
                <div class="bg-amber-400 text-amber-900 font-bold rounded-full px-3 py-1 text-sm">🏆 1050</div>
            </div>
        </header>

        <!-- Swipeable panels -->
        <div
            ref="scrollContainer"
            class="flex-1 flex overflow-x-auto snap-x snap-mandatory scroll-smooth"
            style="scrollbar-width: none; -webkit-overflow-scrolling: touch"
            @scroll="onScroll"
        >
            <SlideGemuese />
            <SlideBienenstock />
            <SlideRangliste />
            <SlideAufgaben />
            <SlideStatistik />
            <SlideKalender />
        </div>

        <!-- Dot indicators -->
        <div class="flex justify-center gap-2 py-2 bg-white/80 shrink-0">
            <div
                v-for="(tab, i) in store.tabs"
                :key="tab.value"
                class="w-2 h-2 rounded-full transition-all"
                :class="store.activeTab === i ? 'bg-green-600 w-6' : 'bg-gray-300'"
            />
        </div>

        <!-- Bottom tab bar — big touch targets for kids -->
        <nav class="bg-white border-t border-gray-200 shrink-0 safe-area-bottom">
            <div class="flex items-stretch">
                <!-- Project tabs (grouped left) -->
                <template v-for="(tab, i) in store.tabs" :key="tab.value">
                    <button
                        v-if="tab.isProject"
                        class="flex-1 flex flex-col items-center py-2 transition-colors"
                        :class="store.activeTab === i ? 'text-green-600' : 'text-gray-400'"
                        @click="scrollToTab(i)"
                    >
                        <span class="text-2xl leading-none">{{ tab.emoji }}</span>
                        <span class="text-xs font-bold mt-1">{{ tab.label }}</span>
                    </button>
                </template>

                <!-- Separator -->
                <div class="w-px bg-gray-200 my-2" />

                <!-- Other tabs -->
                <template v-for="(tab, i) in store.tabs" :key="'other-' + tab.value">
                    <button
                        v-if="!tab.isProject"
                        class="flex-1 flex flex-col items-center py-2 transition-colors"
                        :class="store.activeTab === i ? 'text-green-600' : 'text-gray-400'"
                        @click="scrollToTab(i)"
                    >
                        <span class="text-2xl leading-none">{{ tab.emoji }}</span>
                        <span class="text-xs font-bold mt-1">{{ tab.label }}</span>
                    </button>
                </template>
            </div>
        </nav>
    </div>
</template>

<style scoped>
/* Hide scrollbar across browsers */
div[style*='scrollbar-width'] ::-webkit-scrollbar {
    display: none;
}

/* Safe area for devices with home indicator */
.safe-area-bottom {
    padding-bottom: env(safe-area-inset-bottom, 0px);
}
</style>
