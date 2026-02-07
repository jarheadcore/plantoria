<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted } from 'vue'
import type { GeoCoordinates, GeoPhoto } from '@/types'
import { SWITZERLAND_CENTER, DEFAULT_ZOOM, DETAIL_ZOOM, TILE_URL, TILE_ATTRIBUTION, fixLeafletDefaultIcon } from '@/composables/useMap'

const LMap = defineAsyncComponent(() => import('@vue-leaflet/vue-leaflet').then((m) => m.LMap))
const LTileLayer = defineAsyncComponent(() => import('@vue-leaflet/vue-leaflet').then((m) => m.LTileLayer))
const LMarker = defineAsyncComponent(() => import('@vue-leaflet/vue-leaflet').then((m) => m.LMarker))

const props = withDefaults(
    defineProps<{
        mode: 'location-chooser' | 'photo-gallery'
        modelValue?: GeoCoordinates | null
        photos?: GeoPhoto[]
        center?: GeoCoordinates
        zoom?: number
        height?: string
        interactive?: boolean
    }>(),
    {
        modelValue: null,
        photos: () => [],
        center: undefined,
        zoom: undefined,
        height: '400px',
        interactive: true,
    },
)

const emit = defineEmits<{
    'update:modelValue': [value: GeoCoordinates]
    'photo-click': [photo: GeoPhoto]
    'cluster-click': [photos: GeoPhoto[]]
}>()

onMounted(() => {
    fixLeafletDefaultIcon()
})

const effectiveCenter = computed<[number, number]>(() => {
    if (props.center) return [props.center.lat, props.center.lng]
    if (props.mode === 'location-chooser' && props.modelValue) {
        return [props.modelValue.lat, props.modelValue.lng]
    }
    return [SWITZERLAND_CENTER.lat, SWITZERLAND_CENTER.lng]
})

const effectiveZoom = computed(() => {
    if (props.zoom !== undefined) return props.zoom
    if (props.mode === 'location-chooser' && props.modelValue) return DETAIL_ZOOM
    if (props.mode === 'location-chooser' && props.center) return DETAIL_ZOOM
    return DEFAULT_ZOOM
})

const markerLatLng = computed<[number, number] | null>(() => {
    if (props.modelValue) return [props.modelValue.lat, props.modelValue.lng]
    return null
})

function onMapClick(e: any) {
    if (props.mode !== 'location-chooser' || !props.interactive) return
    const { lat, lng } = e.latlng
    emit('update:modelValue', { lat, lng })
}

function onMarkerDrag(e: any) {
    const { lat, lng } = e.target.getLatLng()
    emit('update:modelValue', { lat, lng })
}
</script>

<template>
    <div :style="{ height }" class="relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        <ClientOnly>
            <LMap
                :zoom="effectiveZoom"
                :center="effectiveCenter"
                :use-global-leaflet="false"
                :options="{ zoomControl: interactive, dragging: interactive, scrollWheelZoom: interactive }"
                class="z-0 h-full w-full"
                @click="onMapClick"
            >
                <LTileLayer :url="TILE_URL" :attribution="TILE_ATTRIBUTION" />

                <!-- Location chooser: single draggable marker -->
                <LMarker
                    v-if="mode === 'location-chooser' && markerLatLng"
                    :lat-lng="markerLatLng"
                    :draggable="interactive"
                    @moveend="onMarkerDrag"
                />

                <!-- Photo gallery: clustered photo markers -->
                <AppMapPhotoGallery
                    v-if="mode === 'photo-gallery'"
                    :photos="photos ?? []"
                    @photo-click="(p: GeoPhoto) => emit('photo-click', p)"
                    @cluster-click="(ps: GeoPhoto[]) => emit('cluster-click', ps)"
                />
            </LMap>

            <template #fallback>
                <div class="flex h-full items-center justify-center bg-gray-100 dark:bg-gray-800">
                    <span class="text-sm text-gray-400">Karte wird geladen...</span>
                </div>
            </template>
        </ClientOnly>
    </div>
</template>
