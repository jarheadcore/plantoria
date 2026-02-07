import type { GeoPhoto } from '@/types'

export const fixturePhotos: GeoPhoto[] = [
    // Primarschule Aarau – Gemuesflaeche (proj-1)
    {
        id: 'photo-1',
        projectId: 'proj-1',
        thumbnailUrl: 'https://picsum.photos/seed/hochbeet/80/80',
        fullUrl: 'https://picsum.photos/seed/hochbeet/800/600',
        caption: 'Hochbeet nach dem Aufbau',
        takenAt: '2026-02-20',
        coordinates: { lat: 47.3925, lng: 8.0456 },
    },
    {
        id: 'photo-2',
        projectId: 'proj-1',
        thumbnailUrl: 'https://picsum.photos/seed/saeen/80/80',
        fullUrl: 'https://picsum.photos/seed/saeen/800/600',
        caption: 'Karotten aussaeen',
        takenAt: '2026-04-15',
        coordinates: { lat: 47.3926, lng: 8.0457 },
    },
    {
        id: 'photo-3',
        projectId: 'proj-1',
        thumbnailUrl: 'https://picsum.photos/seed/sproesslinge/80/80',
        fullUrl: 'https://picsum.photos/seed/sproesslinge/800/600',
        caption: 'Erste Sproesslinge sichtbar',
        takenAt: '2026-04-28',
        coordinates: { lat: 47.3924, lng: 8.0455 },
    },
    // Primarschule Aarau – Bienenstock (proj-2)
    {
        id: 'photo-4',
        projectId: 'proj-2',
        thumbnailUrl: 'https://picsum.photos/seed/bienenstock/80/80',
        fullUrl: 'https://picsum.photos/seed/bienenstock/800/600',
        caption: 'Standort fuer den Bienenstock',
        takenAt: '2026-03-10',
        coordinates: { lat: 47.393, lng: 8.044 },
    },
    // Andere Schulen (fuer Multi-Schul-Demo)
    {
        id: 'photo-5',
        projectId: 'proj-ext-1',
        thumbnailUrl: 'https://picsum.photos/seed/garten-bern/80/80',
        fullUrl: 'https://picsum.photos/seed/garten-bern/800/600',
        caption: 'Schulgarten Bern Mattenhof',
        takenAt: '2026-03-15',
        coordinates: { lat: 46.9467, lng: 7.4441 },
    },
    {
        id: 'photo-6',
        projectId: 'proj-ext-2',
        thumbnailUrl: 'https://picsum.photos/seed/garten-zuerich/80/80',
        fullUrl: 'https://picsum.photos/seed/garten-zuerich/800/600',
        caption: 'Hochbeet Primarschule Zuerich',
        takenAt: '2026-04-01',
        coordinates: { lat: 47.3769, lng: 8.5417 },
    },
]
