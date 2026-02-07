import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GeoPhoto } from '@/types'
import { fixturePhotos } from '@/data/fixtures/photos'

export const useMapStore = defineStore('map', () => {
    const photos = ref<GeoPhoto[]>(fixturePhotos)

    const allPhotos = computed(() => photos.value)

    function getPhotosByProjectId(projectId: string) {
        return photos.value.filter((p) => p.projectId === projectId)
    }

    return { photos, allPhotos, getPhotosByProjectId }
})
