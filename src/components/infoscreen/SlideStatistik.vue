<script setup lang="ts">
import { useDashboardStore } from '~/stores/dashboard'
import { useCurriculumStore } from '~/stores/curriculum'
import { useProjectsStore } from '~/stores/projects'

const store = useDashboardStore()
const curriculum = useCurriculumStore()
const projectsStore = useProjectsStore()

const taskPercent = computed(() =>
    Math.round((store.stats.tasksCompleted / store.stats.tasksTotal) * 100),
)

// Donut chart math
const R = 54
const C = 2 * Math.PI * R
function offset(percent: number) { return C - (percent / 100) * C }

// Subject colors for bars
const subjectBarColors: Record<string, { bg: string; track: string }> = {
    NMG: { bg: 'bg-emerald-400', track: 'bg-emerald-100 dark:bg-emerald-900/40' },
    MA: { bg: 'bg-blue-400', track: 'bg-blue-100 dark:bg-blue-900/40' },
    TTG: { bg: 'bg-violet-400', track: 'bg-violet-100 dark:bg-violet-900/40' },
    WAH: { bg: 'bg-orange-400', track: 'bg-orange-100 dark:bg-orange-900/40' },
}

const projectEmojis: Record<string, string> = {
    'proj-1': '🥬',
    'proj-2': '🐝',
}

const projectBarColors: Record<string, { bg: string; track: string }> = {
    'proj-1': { bg: 'bg-green-500', track: 'bg-green-100 dark:bg-green-900/40' },
    'proj-2': { bg: 'bg-amber-400', track: 'bg-amber-100 dark:bg-amber-900/40' },
}
</script>

<template>
    <section class="w-full h-full shrink-0 snap-start snap-always p-3 flex flex-col gap-2">
        <!-- Row 1: Two big donuts (tasks + lernfortschritt) -->
        <div class="grid grid-cols-2 gap-2 flex-[3] min-h-0">
            <!-- Tasks donut -->
            <div class="bg-green-100 dark:bg-green-950/50 rounded-2xl flex items-center justify-center">
                <svg viewBox="0 0 128 128" class="w-full max-w-[10rem] aspect-square">
                    <circle cx="64" cy="64" :r="R" fill="none" stroke-width="12" class="stroke-green-200 dark:stroke-green-900/60" />
                    <circle
                        cx="64" cy="64" :r="R" fill="none" stroke-width="12" stroke-linecap="round"
                        class="stroke-green-500" :stroke-dasharray="C" :stroke-dashoffset="offset(taskPercent)"
                        transform="rotate(-90 64 64)" style="transition: stroke-dashoffset 0.8s ease"
                    />
                    <text x="64" y="56" text-anchor="middle" class="fill-green-700 dark:fill-green-400" style="font-size: 24px; font-weight: 900;">
                        {{ store.stats.tasksCompleted }}/{{ store.stats.tasksTotal }}
                    </text>
                    <text x="64" y="76" text-anchor="middle" class="fill-green-600 dark:fill-green-500" style="font-size: 12px; font-weight: 700;">Aufgaben</text>
                </svg>
            </div>

            <!-- LP21 donut -->
            <div class="bg-purple-50 dark:bg-purple-950/40 rounded-2xl flex items-center justify-center">
                <svg viewBox="0 0 128 128" class="w-full max-w-[10rem] aspect-square">
                    <circle cx="64" cy="64" :r="R" fill="none" stroke-width="12" class="stroke-purple-200 dark:stroke-purple-900/60" />
                    <circle
                        cx="64" cy="64" :r="R" fill="none" stroke-width="12" stroke-linecap="round"
                        class="stroke-purple-500" :stroke-dasharray="C" :stroke-dashoffset="offset(curriculum.filteredProgress.coveragePercent)"
                        transform="rotate(-90 64 64)" style="transition: stroke-dashoffset 0.8s ease"
                    />
                    <text x="64" y="56" text-anchor="middle" class="fill-purple-700 dark:fill-purple-400" style="font-size: 24px; font-weight: 900;">
                        {{ curriculum.filteredProgress.coveragePercent }}%
                    </text>
                    <text x="64" y="76" text-anchor="middle" class="fill-purple-600 dark:fill-purple-400" style="font-size: 11px; font-weight: 700;">
                        {{ curriculum.filteredProgress.treatedTopics }}/{{ curriculum.filteredProgress.totalTopics }} Lernziele
                    </text>
                </svg>
            </div>
        </div>

        <!-- Row 2: Stat pills -->
        <div class="grid grid-cols-2 gap-2 shrink-0">
            <div class="bg-amber-50 dark:bg-amber-950/40 rounded-2xl px-4 py-2.5 flex items-center gap-3">
                <span class="text-3xl">🌾</span>
                <div>
                    <p class="text-2xl font-black text-amber-600 dark:text-amber-400 leading-tight">{{ store.stats.harvestKg }} kg</p>
                    <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">Ernte</p>
                </div>
            </div>
            <div class="bg-blue-50 dark:bg-blue-950/40 rounded-2xl px-4 py-2.5 flex items-center gap-3">
                <span class="text-3xl">📋</span>
                <div>
                    <p class="text-2xl font-black text-blue-600 dark:text-blue-400 leading-tight">{{ store.stats.activeProjects }}</p>
                    <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">Projekte</p>
                </div>
            </div>
        </div>

        <!-- Row 3: Fachbereiche (bars) + Radar chart + Projekte (bars) -->
        <div class="grid grid-cols-[1fr_auto_1fr] gap-2 flex-[4] min-h-0">
            <!-- Fachbereich bars -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm dark:shadow-none flex flex-col min-h-0">
                <p class="text-sm font-bold text-gray-500 dark:text-gray-400 text-center mb-2 shrink-0">Fachbereiche</p>
                <div class="flex flex-col justify-center gap-2.5 flex-1 min-h-0">
                    <div
                        v-for="sub in curriculum.progress.bySubject"
                        :key="sub.shortName"
                    >
                        <div class="flex items-center justify-between mb-1">
                            <span class="text-base font-bold text-gray-700 dark:text-gray-200">{{ sub.shortName }}</span>
                            <span class="text-base font-black" :class="sub.coveragePercent > 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'">{{ sub.coveragePercent }}%</span>
                        </div>
                        <div class="w-full h-4 rounded-full overflow-hidden" :class="subjectBarColors[sub.shortName]?.track ?? 'bg-gray-100 dark:bg-gray-700'">
                            <div
                                class="h-full rounded-full transition-all duration-700"
                                :class="subjectBarColors[sub.shortName]?.bg ?? 'bg-gray-400'"
                                :style="{ width: Math.max(sub.coveragePercent, 2) + '%' }"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Radar chart (center) -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl px-2 py-3 shadow-sm dark:shadow-none flex items-center justify-center min-h-0">
                <RadarChart :data="curriculum.radarChartData" :size="200" />
            </div>

            <!-- Projekt progress bars -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm dark:shadow-none flex flex-col min-h-0">
                <p class="text-sm font-bold text-gray-500 dark:text-gray-400 text-center mb-2 shrink-0">Projekte</p>
                <div class="flex flex-col justify-center gap-4 flex-1 min-h-0">
                    <div
                        v-for="proj in projectsStore.activeProjects"
                        :key="proj.id"
                    >
                        <div class="flex items-center gap-2 mb-1">
                            <span class="text-xl">{{ projectEmojis[proj.id] ?? '📂' }}</span>
                            <span class="text-base font-bold text-gray-700 dark:text-gray-200 truncate flex-1">{{ proj.name.replace(/ HE24a$/, '') }}</span>
                            <span class="text-base font-black text-green-600 dark:text-green-400">{{ proj.progress }}%</span>
                        </div>
                        <div class="w-full h-4 rounded-full overflow-hidden" :class="projectBarColors[proj.id]?.track ?? 'bg-gray-100 dark:bg-gray-700'">
                            <div
                                class="h-full rounded-full transition-all duration-700"
                                :class="projectBarColors[proj.id]?.bg ?? 'bg-gray-400'"
                                :style="{ width: Math.max(proj.progress, 2) + '%' }"
                            />
                        </div>
                        <p class="text-sm text-gray-400 dark:text-gray-500 mt-1 font-medium">{{ proj.currentPhase }}</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
