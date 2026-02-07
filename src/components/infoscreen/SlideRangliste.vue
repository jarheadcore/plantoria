<script setup lang="ts">
import { useDashboardStore } from '~/stores/dashboard'

const store = useDashboardStore()

// Color palette for schools — same school gets same color
const schoolColorPalette = [
    'bg-blue-400',
    'bg-amber-400',
    'bg-emerald-400',
    'bg-rose-400',
    'bg-violet-400',
    'bg-cyan-400',
    'bg-orange-400',
    'bg-teal-400',
    'bg-pink-400',
    'bg-indigo-400',
    'bg-lime-400',
    'bg-fuchsia-400',
    'bg-sky-400',
    'bg-red-400',
    'bg-yellow-400',
    'bg-purple-400',
    'bg-green-400',
    'bg-slate-400',
    'bg-zinc-400',
    'bg-stone-400',
]

const schoolColorMap = computed(() => {
    const map = new Map<string, string>()
    const schools = [...new Set(store.swissRankings.map((e) => e.school))]
    for (const [i, school] of schools.entries()) {
        const color = schoolColorPalette[i % schoolColorPalette.length]
        if (color) map.set(school, color)
    }
    return map
})

const mySchoolColor = computed(() => schoolColorMap.value.get(store.mySchoolName) ?? 'bg-emerald-400')

function swissBarColor(school: string, highlight: boolean | undefined): string {
    if (highlight) return 'bg-green-500 dark:bg-green-600'
    return schoolColorMap.value.get(school) ?? 'bg-gray-300 dark:bg-gray-600'
}

function schoolBarColor(highlight: boolean | undefined): string {
    if (highlight) return 'bg-green-500 dark:bg-green-600'
    return mySchoolColor.value
}
</script>

<template>
    <section class="w-full h-full shrink-0 snap-start snap-always overflow-hidden p-4 flex flex-col gap-1">
        <!-- Column headers -->
        <div class="grid grid-cols-2 gap-3 shrink-0">
            <h3 class="text-xl font-bold text-green-700 dark:text-green-400 text-center">
                🏫 {{ store.mySchoolName }}
            </h3>
            <h3 class="text-xl font-bold text-blue-700 dark:text-blue-400 text-center">🇨🇭 Schweizweit</h3>
        </div>

        <!-- Ranking bars -->
        <div class="grid grid-cols-2 gap-3 flex-1 min-h-0">
            <!-- Meine Schule -->
            <div class="space-y-1.5 overflow-y-auto">
                <div
                    v-for="entry in store.schoolRankings"
                    :key="entry.rank"
                    class="relative h-10 rounded-lg overflow-hidden"
                    :class="entry.highlight ? 'ring-2 ring-green-400' : ''"
                >
                    <div class="absolute inset-0 bg-gray-100 dark:bg-gray-800" />
                    <div
                        class="absolute inset-y-0 left-0 rounded-lg transition-all duration-700 ease-out"
                        :class="schoolBarColor(entry.highlight)"
                        :style="{ width: (entry.points / store.schoolMax) * 100 + '%', opacity: entry.highlight ? 1 : 0.7 }"
                    />
                    <div class="absolute inset-0 flex items-center px-2 gap-1.5">
                        <span class="text-sm font-black shrink-0 w-5 text-right" :class="entry.rank <= 3 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-400 dark:text-gray-500'">
                            {{ entry.rank }}
                        </span>
                        <span class="font-bold text-sm truncate dark:text-white">{{ entry.name }}</span>
                        <span class="ml-auto text-sm font-black text-green-800 dark:text-green-300">{{ entry.points }}</span>
                    </div>
                </div>
            </div>

            <!-- Schweizweit -->
            <div class="space-y-1.5 overflow-y-auto">
                <div
                    v-for="entry in store.swissRankings"
                    :key="entry.rank"
                    class="relative h-10 rounded-lg overflow-hidden"
                    :class="entry.highlight ? 'ring-2 ring-green-400' : ''"
                >
                    <div class="absolute inset-0 bg-gray-100 dark:bg-gray-800" />
                    <div
                        class="absolute inset-y-0 left-0 rounded-lg transition-all duration-700 ease-out"
                        :class="swissBarColor(entry.school, entry.highlight)"
                        :style="{ width: (entry.points / store.swissMax) * 100 + '%', opacity: entry.highlight ? 1 : 0.7 }"
                    />
                    <div class="absolute inset-0 flex items-center px-2 gap-1.5">
                        <span class="text-sm font-black shrink-0 w-5 text-right" :class="entry.rank <= 3 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-400 dark:text-gray-500'">
                            {{ entry.rank }}
                        </span>
                        <div class="min-w-0 flex-1">
                            <p class="font-bold text-sm truncate leading-tight dark:text-white">{{ entry.name }}
                                <span class="font-normal text-[10px] text-gray-500 dark:text-gray-400">{{ entry.school }}</span>
                            </p>
                        </div>
                        <span class="ml-auto text-sm font-black text-green-800 dark:text-green-300 shrink-0">{{ entry.points }}</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
div[style*='scrollbar-width'] ::-webkit-scrollbar {
    display: none;
}
</style>
