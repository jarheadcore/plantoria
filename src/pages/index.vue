<script setup lang="ts">
const { data: todo } = await useAsyncData(() => queryCollection('content').path('/todos').first())

useSeoMeta({
  title: todo.value?.title,
  description: todo.value?.description
})
</script>

<template>
  <UContainer>
    <div class="py-8">
      <ContentRenderer v-if="todo" :value="todo" />
      <div v-else>Content not found - push testing? :D</div>
      <hr class="my-4 border-neutral-600" />
      <div class="flex gap-3">
          <UButton color="primary" variant="solid">Hello Nuxt UI</UButton>
          <UButton to="/pinia-store-test">Go to Pinia Store Testing</UButton>
          <UButton to="/infoscreen">Infoscreen</UButton>
      </div>
    </div>
  </UContainer>
</template>