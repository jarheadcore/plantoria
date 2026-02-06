<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useItemsStore } from '@/stores/items'

const itemsStore = useItemsStore()
const { inputItems, isLoaded } = storeToRefs(itemsStore)

const draftValue = ref('')
const addItem = () => {
  itemsStore.addInputItem(draftValue.value)
  draftValue.value = ''
}
</script>

<template>
  <div class="p-12">
    <h1 class="text-3xl font-bold mb-4">Pinia Store Testing</h1>
    <div>
      <div>Task:</div>
      <div class="flex gap-4">
        <UInput v-model="draftValue" />
        <UButton @click="addItem">Add Item</UButton>
      </div>
    </div>
    <div class="mt-4 space-y-2">
      <div v-if="!isLoaded" class="text-sm opacity-70">Loading items...</div>
      <div v-else-if="inputItems.length === 0" class="text-sm opacity-70">No items</div>
      <div v-else v-for="(item, index) in inputItems" :key="`${item}-${index}`" class="flex items-center gap-2">
        <span>{{ item }}</span>
        <UButton color="neutral" variant="ghost" size="xs" @click="itemsStore.removeInputItem(index)">X</UButton>
      </div>
    </div>
    <div class="mt-4">
      <UButton to="/">Go Back to Home</UButton>
    </div>
  </div>
</template>