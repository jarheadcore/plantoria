<script setup lang="ts">
defineProps<{
    title: string
    description?: string
    actionLabel?: string
    actionTo?: string
}>()

defineEmits<{
    action: []
}>()
</script>

<template>
    <div class="flex flex-col items-center justify-center py-16 text-center">
        <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <slot name="icon">
                <span class="text-2xl text-gray-400">📋</span>
            </slot>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ title }}</h3>
        <p v-if="description" class="mt-1 max-w-sm text-sm text-gray-500">{{ description }}</p>
        <UButton v-if="actionLabel" color="primary" class="mt-4" :to="actionTo" @click="$emit('action')">
            {{ actionLabel }}
        </UButton>
    </div>
</template>
