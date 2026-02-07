<script setup lang="ts">
defineProps<{
    value: number
    color?: string
    showLabel?: boolean
    size?: 'sm' | 'md' | 'lg'
}>()
</script>

<template>
    <div class="flex items-center gap-3">
        <div
            :class="[
                'flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700',
                size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-4' : 'h-2.5',
            ]"
        >
            <div
                :class="['h-full rounded-full transition-all duration-500', color || 'bg-green-500']"
                :style="{ width: `${Math.min(Math.max(value, 0), 100)}%` }"
            />
        </div>
        <span v-if="showLabel !== false" class="text-sm font-medium text-gray-600 dark:text-gray-400 tabular-nums min-w-[3ch]">
            {{ value }}%
        </span>
    </div>
</template>
