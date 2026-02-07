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
            return 'bg-white border-gray-300 text-gray-400'
    }
}
</script>

<template>
    <section class="w-full shrink-0 snap-start snap-always overflow-y-auto p-4">
        <div class="space-y-5">
            <div v-for="item in store.bienenstock" :key="item.task" class="bg-white rounded-2xl p-4 shadow-sm">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-xl font-bold">{{ item.icon }} {{ item.task }}</span>
                    <span class="bg-amber-100 text-amber-700 text-sm font-semibold px-3 py-1 rounded-full">
                        {{ item.phase }}
                    </span>
                </div>
                <div class="relative w-full mb-6">
                    <div class="w-full bg-amber-100 rounded-full h-5 overflow-hidden">
                        <div class="bg-amber-400 h-full rounded-full transition-all" :style="{ width: item.percent + '%' }" />
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

            <div class="p-5 bg-amber-100 rounded-2xl text-center">
                <p class="text-base text-amber-800 font-medium">🐝 Die Bienen sind fleissig am Arbeiten!</p>
            </div>
        </div>
    </section>
</template>
