<script setup lang="ts">
const { data: todo } = await useAsyncData(() => queryCollection('content').path('/todos').first())

useSeoMeta({
  title: todo.value?.title,
  description: todo.value?.description
})
</script>

<template>
  <div class="space-y-4">
    <ContentRenderer v-if="todo" :value="todo" />
    <div v-else>Content not found</div>
    <hr>
    <div class="flex gap-3">
        <UButton color="primary" variant="solid">Hello Nuxt UI</UButton>
        <UButton to="/TestView">Go to Test View Page</UButton>
    </div>
  </div>
</template>