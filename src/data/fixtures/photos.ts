import type { GeoPhoto } from '@/types'
import { fixtureInspirationPhotos } from './inspiration-photos'

// Helper: build a thumbnail URL from an inspiration photo source
function inspirationThumb(index: number): { thumbnailUrl: string; fullUrl: string } {
    const photo = fixtureInspirationPhotos[index % fixtureInspirationPhotos.length]!
    return {
        thumbnailUrl: `https://picsum.photos/seed/${photo.id}/80/80`,
        fullUrl: `https://picsum.photos/seed/${photo.id}/800/600`,
    }
}

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

    // ── Liebegg / Gränichen – Cluster 1: Schulgarten Liebegg ──
    {
        id: 'photo-liebegg-1',
        projectId: 'proj-1',
        ...inspirationThumb(0),
        caption: 'Samen setzen im Schulgarten Liebegg',
        takenAt: '2026-03-12',
        coordinates: { lat: 47.3395, lng: 8.1180 },
    },
    {
        id: 'photo-liebegg-2',
        projectId: 'proj-1',
        ...inspirationThumb(1),
        caption: 'Gemeinsames Pflanzen mit Eltern',
        takenAt: '2026-03-12',
        coordinates: { lat: 47.3398, lng: 8.1184 },
    },
    {
        id: 'photo-liebegg-3',
        projectId: 'proj-1',
        ...inspirationThumb(2),
        caption: 'Giessen nach der Aussaat',
        takenAt: '2026-03-13',
        coordinates: { lat: 47.3393, lng: 8.1177 },
    },
    {
        id: 'photo-liebegg-4',
        projectId: 'proj-1',
        ...inspirationThumb(3),
        caption: 'Sorgfältige Pflege der Setzlinge',
        takenAt: '2026-03-14',
        coordinates: { lat: 47.3397, lng: 8.1182 },
    },
    {
        id: 'photo-liebegg-5',
        projectId: 'proj-1',
        ...inspirationThumb(4),
        caption: 'Kinder mit Gartenwerkzeug',
        takenAt: '2026-03-15',
        coordinates: { lat: 47.3391, lng: 8.1175 },
    },

    // ── Liebegg / Gränichen – Cluster 2: Obstgarten Nord ──
    {
        id: 'photo-liebegg-6',
        projectId: 'proj-1',
        ...inspirationThumb(5),
        caption: 'Obstbäume pflegen im Garten',
        takenAt: '2026-04-02',
        coordinates: { lat: 47.3420, lng: 8.1160 },
    },
    {
        id: 'photo-liebegg-7',
        projectId: 'proj-1',
        ...inspirationThumb(6),
        caption: 'Teamarbeit beim Giessen',
        takenAt: '2026-04-02',
        coordinates: { lat: 47.3423, lng: 8.1163 },
    },
    {
        id: 'photo-liebegg-8',
        projectId: 'proj-1',
        ...inspirationThumb(7),
        caption: 'Pflanzenpflege im Team',
        takenAt: '2026-04-03',
        coordinates: { lat: 47.3418, lng: 8.1157 },
    },
    {
        id: 'photo-liebegg-9',
        projectId: 'proj-1',
        ...inspirationThumb(8),
        caption: 'Bäume pflanzen beim Schulhaus',
        takenAt: '2026-04-04',
        coordinates: { lat: 47.3425, lng: 8.1165 },
    },

    // ── Liebegg / Gränichen – Cluster 3: Hochbeete Süd ──
    {
        id: 'photo-liebegg-10',
        projectId: 'proj-1',
        ...inspirationThumb(9),
        caption: 'Entdecken im Hochbeet',
        takenAt: '2026-04-10',
        coordinates: { lat: 47.3365, lng: 8.1200 },
    },
    {
        id: 'photo-liebegg-11',
        projectId: 'proj-1',
        ...inspirationThumb(10),
        caption: 'Geschwister erkunden die Pflanzen',
        takenAt: '2026-04-10',
        coordinates: { lat: 47.3363, lng: 8.1197 },
    },
    {
        id: 'photo-liebegg-12',
        projectId: 'proj-1',
        ...inspirationThumb(11),
        caption: 'Erste Ernte – Blumen pflücken',
        takenAt: '2026-04-12',
        coordinates: { lat: 47.3367, lng: 8.1203 },
    },
    {
        id: 'photo-liebegg-13',
        projectId: 'proj-1',
        ...inspirationThumb(12),
        caption: 'Familientag im Garten',
        takenAt: '2026-04-13',
        coordinates: { lat: 47.3362, lng: 8.1195 },
    },

    // ── Liebegg / Gränichen – Cluster 4: Kompostplatz Ost ──
    {
        id: 'photo-liebegg-14',
        projectId: 'proj-1',
        ...inspirationThumb(13),
        caption: 'Junge giesst am Kompostplatz',
        takenAt: '2026-04-18',
        coordinates: { lat: 47.3385, lng: 8.1240 },
    },
    {
        id: 'photo-liebegg-15',
        projectId: 'proj-1',
        ...inspirationThumb(14),
        caption: 'Setzling einpflanzen',
        takenAt: '2026-04-18',
        coordinates: { lat: 47.3387, lng: 8.1243 },
    },
    {
        id: 'photo-liebegg-16',
        projectId: 'proj-1',
        ...inspirationThumb(15),
        caption: 'Kleiner Gärtner bei der Topfpflanze',
        takenAt: '2026-04-19',
        coordinates: { lat: 47.3383, lng: 8.1237 },
    },
    {
        id: 'photo-liebegg-17',
        projectId: 'proj-1',
        ...inspirationThumb(16),
        caption: 'Vater-Sohn Pflanzaktion',
        takenAt: '2026-04-20',
        coordinates: { lat: 47.3388, lng: 8.1246 },
    },

    // ── Liebegg / Gränichen – Cluster 5: Wildblumenwiese West ──
    {
        id: 'photo-liebegg-18',
        projectId: 'proj-1',
        ...inspirationThumb(17),
        caption: 'Naturerkundung in der Wiese',
        takenAt: '2026-05-01',
        coordinates: { lat: 47.3400, lng: 8.1120 },
    },
    {
        id: 'photo-liebegg-19',
        projectId: 'proj-1',
        ...inspirationThumb(18),
        caption: 'Wasserspiel am Gartenschlauch',
        takenAt: '2026-05-01',
        coordinates: { lat: 47.3402, lng: 8.1123 },
    },
    {
        id: 'photo-liebegg-20',
        projectId: 'proj-1',
        ...inspirationThumb(19),
        caption: 'Hochbeet bepflanzen',
        takenAt: '2026-05-02',
        coordinates: { lat: 47.3398, lng: 8.1117 },
    },
    {
        id: 'photo-liebegg-21',
        projectId: 'proj-1',
        ...inspirationThumb(20),
        caption: 'Gemüse im Hochbeet pflanzen',
        takenAt: '2026-05-03',
        coordinates: { lat: 47.3404, lng: 8.1126 },
    },
    {
        id: 'photo-liebegg-22',
        projectId: 'proj-1',
        ...inspirationThumb(21),
        caption: 'Mädchen pflegen den Garten',
        takenAt: '2026-05-04',
        coordinates: { lat: 47.3396, lng: 8.1114 },
    },
    {
        id: 'photo-liebegg-23',
        projectId: 'proj-1',
        ...inspirationThumb(22),
        caption: 'Setzling behutsam einpflanzen',
        takenAt: '2026-05-05',
        coordinates: { lat: 47.3401, lng: 8.1121 },
    },
]
