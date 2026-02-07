<script setup lang="ts">
import { ChevronLeft, ChevronRight, X } from 'lucide-vue-next'

interface LightboxImage {
    src: string
    label: string
    status: string
}

const props = defineProps<{
    images: LightboxImage[]
    startIndex: number
}>()

const emit = defineEmits<{
    close: []
}>()

const currentIndex = ref(props.startIndex)

const currentImage = computed(() => {
    const img = props.images[currentIndex.value]
    return img ?? props.images[0]
})

function prev() {
    currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length
}

function next() {
    currentIndex.value = (currentIndex.value + 1) % props.images.length
}

// Keyboard navigation
function onKeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowLeft') prev()
    else if (e.key === 'ArrowRight') next()
    else if (e.key === 'Escape') emit('close')
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))

// Touch swipe support
const touchStartX = ref(0)
function onTouchStart(e: TouchEvent) {
    const touch = e.touches[0]
    if (touch) touchStartX.value = touch.clientX
}
function onTouchEnd(e: TouchEvent) {
    const touch = e.changedTouches[0]
    if (!touch) return
    const diff = touch.clientX - touchStartX.value
    if (Math.abs(diff) > 50) {
        if (diff > 0) prev()
        else next()
    }
}
</script>

<template>
    <Teleport to="body">
        <div
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            @click.self="emit('close')"
            @touchstart="onTouchStart"
            @touchend="onTouchEnd"
        >
            <!-- Close button -->
            <button
                class="absolute top-4 right-4 text-white/80 hover:text-white bg-black/40 rounded-full p-2 z-10"
                @click="emit('close')"
            >
                <X :size="24" />
            </button>

            <!-- Prev button -->
            <button
                v-if="images.length > 1"
                class="absolute left-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-black/40 rounded-full p-2 z-10"
                @click="prev"
            >
                <ChevronLeft :size="28" />
            </button>

            <!-- Image + label -->
            <div class="flex flex-col items-center gap-4 max-w-[85vw] max-h-[80vh]">
                <div class="relative rounded-2xl overflow-hidden bg-white/10 shadow-2xl">
                    <img
                        v-if="currentImage"
                        :src="currentImage.src"
                        :alt="currentImage.label"
                        class="max-w-[85vw] max-h-[65vh] object-contain"
                    />
                </div>
            </div>

            <!-- Next button -->
            <button
                v-if="images.length > 1"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-black/40 rounded-full p-2 z-10"
                @click="next"
            >
                <ChevronRight :size="28" />
            </button>
        </div>
    </Teleport>
</template>
