import { computed, onMounted, ref, watch } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'items:inputItems'

export const useItemsStore = defineStore('items', () => {
    const count = ref(0)
    const inputValue = ref('')
    const inputItems = ref<string[]>([])
    const isLoaded = ref(false)
    const doubleCount = computed(() => count.value * 2)

    const isClient = typeof window !== 'undefined'
    if (isClient) {
        onMounted(() => {
            const stored = localStorage.getItem(STORAGE_KEY)
            if (stored) {
                try {
                    const parsed = JSON.parse(stored)
                    if (Array.isArray(parsed)) {
                        inputItems.value = parsed
                    }
                } catch {
                    // Ignore invalid stored data.
                }
            }
            isLoaded.value = true
        })

        watch(
            () => inputItems.value,
            (value) => {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
            },
            { deep: true },
        )
    }

    function increment() {
        count.value++
    }

    function setInputValue(value: string) {
        inputValue.value = value
    }

    function addInputItem(value: string) {
        const trimmed = value.trim()
        if (!trimmed) return
        inputItems.value.push(trimmed)
    }

    function removeInputItem(index: number) {
        inputItems.value.splice(index, 1)
    }

    return { count, inputValue, inputItems, isLoaded, doubleCount, increment, setInputValue, addInputItem, removeInputItem }
})
