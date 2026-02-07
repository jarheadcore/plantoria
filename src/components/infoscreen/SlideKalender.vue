<script setup lang="ts">
import { useDashboardStore, type GardenEvent } from '~/stores/dashboard'

const store = useDashboardStore()

function sleepLabel(sleeps: number): string {
    if (sleeps < 0) return '✅ Erledigt!'
    if (sleeps === 0) return '👉 Heute!'
    if (sleeps === 1) return '😴 1 Nacht'
    if (sleeps <= 7) return `😴 ${sleeps} Nächte`
    const weeks = Math.round(sleeps / 7)
    if (weeks === 1) return '🗓️ ~1 Woche'
    return `🗓️ ~${weeks} Wochen`
}

function isNextUp(event: GardenEvent): boolean {
    return !event.done && !store.gardenEvents.some((e) => !e.done && e.sleeps < event.sleeps)
}

// Dark mode aware season colors
const seasonDarkBg: Record<string, string> = {
    'bg-blue-50': 'dark:bg-blue-950/40',
    'bg-green-50': 'dark:bg-green-950/40',
    'bg-amber-50': 'dark:bg-amber-950/40',
}

const seasonDarkText: Record<string, string> = {
    'text-blue-700': 'dark:text-blue-400',
    'text-green-700': 'dark:text-green-400',
    'text-amber-700': 'dark:text-amber-400',
}

const seasonDarkBorder: Record<string, string> = {
    'border-blue-200': 'dark:border-blue-800',
    'border-green-200': 'dark:border-green-800',
    'border-amber-200': 'dark:border-amber-800',
}
</script>

<template>
    <section class="w-full shrink-0 snap-start snap-always overflow-y-auto p-4">
        <!-- Header -->
        <div class="flex items-center gap-3 mb-5">
            <span class="text-3xl">🌱</span>
            <div>
                <h2 class="text-xl font-bold text-green-800 dark:text-green-400">Garten-Reise</h2>
                <p class="text-sm text-green-600 dark:text-green-500">Was wächst wann?</p>
            </div>
        </div>

        <!-- Season groups -->
        <div class="space-y-2">
            <div v-for="(group, gi) in store.eventsBySeason" :key="group.id">
                <!-- Season banner -->
                <div class="flex items-center gap-3 px-4 py-3 rounded-2xl mb-3" :class="[group.bgColor, seasonDarkBg[group.bgColor] ?? '']">
                    <span class="text-3xl">{{ group.emoji }}</span>
                    <span class="text-lg font-bold" :class="[group.textColor, seasonDarkText[group.textColor] ?? '']">
                        {{ group.name }}
                    </span>
                </div>

                <!-- Path with events -->
                <div class="ml-6 pl-6 space-y-4 border-l-4" :class="[group.borderColor, seasonDarkBorder[group.borderColor] ?? '']">
                    <div v-for="(event, ei) in group.events" :key="ei" class="relative">
                        <!-- Path dot -->
                        <div
                            class="absolute -left-[calc(1.5rem+2px)] top-4 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                            :class="[
                                event.done ? 'bg-green-500 text-white' : isNextUp(event) ? 'bg-green-400 animate-pulse' : group.dotColor,
                            ]"
                        >
                            <template v-if="event.done">✓</template>
                            <template v-else-if="isNextUp(event)">👣</template>
                        </div>

                        <!-- Event card -->
                        <div class="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-none" :class="event.done ? 'opacity-60' : ''">
                            <span class="text-4xl shrink-0">{{ event.cropEmoji }}</span>

                            <div class="flex-1 min-w-0">
                                <p class="font-bold text-lg" :class="event.done ? 'line-through text-gray-400 dark:text-gray-500' : 'dark:text-white'">
                                    {{ event.task }}
                                </p>
                                <span
                                    class="inline-block mt-1 text-sm font-semibold px-3 py-1 rounded-full"
                                    :class="
                                        event.done
                                            ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400'
                                            : isNextUp(event)
                                              ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400'
                                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                    "
                                >
                                    {{ sleepLabel(event.sleeps) }}
                                </span>
                            </div>

                            <span class="text-2xl shrink-0">{{ event.actionEmoji }}</span>
                        </div>
                    </div>
                </div>

                <!-- Dashed connector between seasons -->
                <div v-if="gi < store.eventsBySeason.length - 1" class="ml-6 h-6 border-l-4 border-dashed border-gray-200 dark:border-gray-700" />
            </div>
        </div>

        <!-- Encouraging footer -->
        <div class="mt-5 p-5 bg-green-100 dark:bg-green-950/50 rounded-2xl text-center">
            <p class="text-base text-green-800 dark:text-green-300 font-medium">🌻 Am Ende wartet eine tolle Ernte auf euch!</p>
        </div>
    </section>
</template>
