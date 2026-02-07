import type { HarvestMarket } from '@/types'

export const mockMarkets: HarvestMarket[] = [
    {
        id: 'hm-1',
        name: 'Herbst-Harvest-Markt 2026',
        date: '2026-10-18',
        location: 'Marktplatz Aarau',
        participatingSchools: 8,
        registrationDeadline: '2026-08-18',
        status: 'Anmeldung offen',
        preparationPhases: [
            { id: 'mp-1', name: 'Anmeldung', status: 'Offen', deadline: '2026-08-18' },
            { id: 'mp-2', name: 'Produkt-Ideen', status: 'Offen', deadline: '2026-09-06' },
            { id: 'mp-3', name: 'Produktion', status: 'Offen', deadline: '2026-10-04' },
            { id: 'mp-4', name: 'Preiskalkulation', status: 'Offen', deadline: '2026-10-11' },
            { id: 'mp-5', name: 'Standgestaltung', status: 'Offen', deadline: '2026-10-17' },
            { id: 'mp-6', name: 'Durchführung', status: 'Offen', deadline: '2026-10-18' },
            { id: 'mp-7', name: 'Auswertung', status: 'Offen', deadline: '2026-10-25' },
        ],
        products: [
            { id: 'prod-1', name: 'Kräutersalz', quantity: '20 Gläser', price: 'CHF 5.00', groupName: 'Sonnenblume' },
            { id: 'prod-2', name: 'Rübli (frisch)', quantity: '5 kg', price: 'CHF 3.00/kg', groupName: 'Löwenzahn' },
        ],
    },
]
