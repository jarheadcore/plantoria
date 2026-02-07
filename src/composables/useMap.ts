import type { GeoCoordinates } from '@/types'

export const SWITZERLAND_CENTER: GeoCoordinates = { lat: 46.8182, lng: 8.2275 }
export const DEFAULT_ZOOM = 8
export const DETAIL_ZOOM = 17
export const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
export const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'

export function fixLeafletDefaultIcon() {
    if (typeof window === 'undefined') return

    import('leaflet').then((L) => {
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
            iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
            shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
        })
    })
}
