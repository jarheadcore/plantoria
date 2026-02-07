<script setup lang="ts">
import { watch, onMounted, onUnmounted, ref, inject } from 'vue'
import type { GeoPhoto } from '@/types'

const props = defineProps<{
    photos: GeoPhoto[]
}>()

const emit = defineEmits<{
    'photo-click': [photo: GeoPhoto]
    'cluster-click': [photos: GeoPhoto[]]
}>()

// Injected by LMap from @vue-leaflet/vue-leaflet
const addLayer = inject<(layer: any) => void>('addLayer')
const removeLayer = inject<(layer: any) => void>('removeLayer')

let L: typeof import('leaflet') | null = null
let clusterGroup: any = null
const markerPhotoMap = new WeakMap<any, GeoPhoto>()
const ready = ref(false)

async function init() {
    L = await import('leaflet')
    await import('leaflet.markercluster')

    clusterGroup = (L as any).markerClusterGroup({
        maxClusterRadius: 60,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        iconCreateFunction(cluster: any) {
            const count = cluster.getChildCount()
            const childMarkers = cluster.getAllChildMarkers()
            const firstPhoto = markerPhotoMap.get(childMarkers[0])
            const thumbUrl = firstPhoto?.thumbnailUrl

            let size = 'small'
            let px = 40
            if (count >= 10) {
                size = 'large'
                px = 56
            } else if (count >= 5) {
                size = 'medium'
                px = 48
            }

            const html = thumbUrl
                ? `<div class="photo-cluster photo-cluster--${size}">
             <img src="${thumbUrl}" alt="" />
             <span>${count}</span>
           </div>`
                : `<div class="photo-cluster photo-cluster--${size}">
             <span>${count}</span>
           </div>`

            return L!.divIcon({
                html,
                className: 'photo-cluster-icon',
                iconSize: L!.point(px, px),
                iconAnchor: L!.point(px / 2, px / 2),
            })
        },
    })

    clusterGroup.on('clusterclick', (e: any) => {
        const childMarkers = e.layer.getAllChildMarkers()
        const photos = childMarkers.map((m: any) => markerPhotoMap.get(m)).filter(Boolean) as GeoPhoto[]
        emit('cluster-click', photos)
    })

    addLayer?.(clusterGroup)
    ready.value = true
    syncMarkers()
}

function syncMarkers() {
    if (!clusterGroup || !L) return

    clusterGroup.clearLayers()

    for (const photo of props.photos) {
        const icon = L.divIcon({
            className: 'photo-marker-icon',
            html: `<div class="photo-marker">
               <img src="${photo.thumbnailUrl}" alt="${photo.caption ?? ''}" />
             </div>`,
            iconSize: L.point(44, 44),
            iconAnchor: L.point(22, 22),
        })

        const marker = L.marker([photo.coordinates.lat, photo.coordinates.lng], { icon })
        markerPhotoMap.set(marker, photo)

        marker.on('click', () => {
            emit('photo-click', photo)
        })

        marker.bindTooltip(photo.caption ?? '', {
            direction: 'top',
            offset: L.point(0, -24),
            className: 'photo-tooltip',
        })

        clusterGroup.addLayer(marker)
    }
}

watch(
    () => props.photos,
    () => {
        if (ready.value) syncMarkers()
    },
    { deep: true },
)

onMounted(() => {
    init()
})

onUnmounted(() => {
    if (clusterGroup) {
        removeLayer?.(clusterGroup)
    }
})
</script>

<template>
    <slot />
</template>
