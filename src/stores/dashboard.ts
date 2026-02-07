import { computed, onMounted, ref, watch } from 'vue'
import { defineStore } from 'pinia'

// ── Types ──────────────────────────────────────────────

export interface Milestone {
    at: number
    status: 'accomplished' | 'failed' | 'planned'
    label: string
    image?: string
}

export interface GemueseItem {
    crop: string
    icon: string
    percent: number
    phase: string
    milestones: Milestone[]
}

export interface BienenstockItem {
    task: string
    icon: string
    percent: number
    phase: string
    milestones: Milestone[]
}

export interface SchoolRanking {
    rank: number
    name: string
    points: number
    highlight?: boolean
}

export interface SwissRanking {
    rank: number
    name: string
    school: string
    points: number
    highlight?: boolean
}

export interface Todo {
    id: number
    title: string
    group: string
    done: boolean
}

export interface Stats {
    tasksCompleted: number
    tasksTotal: number
    harvestKg: number
    activeProjects: number
}

export interface Season {
    id: string
    name: string
    emoji: string
    bgColor: string
    textColor: string
    dotColor: string
    borderColor: string
}

export interface GardenEvent {
    seasonId: string
    sleeps: number
    task: string
    cropEmoji: string
    actionEmoji: string
    done: boolean
}

export interface Tab {
    label: string
    emoji: string
    value: string
    isProject: boolean
}

// ── Fixtures ───────────────────────────────────────────

const fixtureGemuese: GemueseItem[] = [
    {
        crop: 'Karotten',
        icon: '🥕',
        percent: 72,
        phase: 'Wachstum',
        milestones: [
            { at: 25, status: 'accomplished', label: 'Gekeimt', image: '/milestones/karotte-gekeimt.svg' },
            { at: 50, status: 'accomplished', label: 'Erstes Grün', image: '/milestones/karotte-erstes-gruen.svg' },
            { at: 75, status: 'planned', label: 'Erntereif', image: '/milestones/karotte-erntereif.svg' },
            { at: 100, status: 'planned', label: 'Geerntet', image: '/milestones/karotte-geerntet.svg' },
        ],
    },
    {
        crop: 'Brokkoli',
        icon: '🥦',
        percent: 45,
        phase: 'Aussaat',
        milestones: [
            { at: 25, status: 'accomplished', label: 'Gekeimt', image: '/milestones/brokkoli-gekeimt.svg' },
            { at: 50, status: 'planned', label: 'Kopfbildung', image: '/milestones/brokkoli-kopfbildung.svg' },
            { at: 75, status: 'planned', label: 'Erntereif', image: '/milestones/brokkoli-erntereif.svg' },
            { at: 100, status: 'planned', label: 'Geerntet', image: '/milestones/brokkoli-geerntet.svg' },
        ],
    },
    {
        crop: 'Tomaten',
        icon: '🍅',
        percent: 30,
        phase: 'Setzlinge',
        milestones: [
            { at: 25, status: 'accomplished', label: 'Gekeimt', image: '/milestones/tomate-gekeimt.svg' },
            { at: 50, status: 'failed', label: 'Umgetopft', image: '/milestones/tomate-umgetopft.svg' },
            { at: 75, status: 'planned', label: 'Erste Früchte', image: '/milestones/tomate-erste-fruechte.svg' },
            { at: 100, status: 'planned', label: 'Geerntet', image: '/milestones/tomate-geerntet.svg' },
        ],
    },
    {
        crop: 'Lauch',
        icon: '🌿',
        percent: 58,
        phase: 'Wachstum',
        milestones: [
            { at: 25, status: 'accomplished', label: 'Gekeimt', image: '/milestones/lauch-gekeimt.svg' },
            { at: 50, status: 'accomplished', label: 'Angewachsen', image: '/milestones/lauch-angewachsen.svg' },
            { at: 75, status: 'planned', label: 'Erntereif', image: '/milestones/lauch-erntereif.svg' },
            { at: 100, status: 'planned', label: 'Geerntet', image: '/milestones/lauch-geerntet.svg' },
        ],
    },
]

const fixtureBienenstock: BienenstockItem[] = [
    {
        task: 'Bienenvolk beobachten',
        icon: '🐝',
        percent: 60,
        phase: 'Aktiv',
        milestones: [
            { at: 25, status: 'accomplished', label: 'Volk gesichtet', image: '/milestones/bienen-volk-gesichtet.svg' },
            { at: 50, status: 'accomplished', label: 'Königin gefunden', image: '/milestones/bienen-koenigin-gefunden.svg' },
            { at: 75, status: 'planned', label: 'Brut geprüft', image: '/milestones/bienen-brut-geprueft.svg' },
            { at: 100, status: 'planned', label: 'Bericht fertig', image: '/milestones/bienen-bericht-fertig.svg' },
        ],
    },
    {
        task: 'Honig ernten',
        icon: '🍯',
        percent: 25,
        phase: 'Vorbereitung',
        milestones: [
            { at: 25, status: 'accomplished', label: 'Waben voll', image: '/milestones/honig-waben-voll.svg' },
            { at: 50, status: 'planned', label: 'Schleudern', image: '/milestones/honig-schleudern.svg' },
            { at: 75, status: 'planned', label: 'Abfüllen', image: '/milestones/honig-abfuellen.svg' },
            { at: 100, status: 'planned', label: 'Etikettiert', image: '/milestones/honig-etikettiert.svg' },
        ],
    },
    {
        task: 'Waben kontrollieren',
        icon: '🪹',
        percent: 80,
        phase: 'Fertig',
        milestones: [
            { at: 25, status: 'accomplished', label: 'Geöffnet', image: '/milestones/waben-geoeffnet.svg' },
            { at: 50, status: 'accomplished', label: 'Inspiziert', image: '/milestones/waben-inspiziert.svg' },
            { at: 75, status: 'accomplished', label: 'Gereinigt', image: '/milestones/waben-gereinigt.svg' },
            { at: 100, status: 'planned', label: 'Dokumentiert', image: '/milestones/waben-dokumentiert.svg' },
        ],
    },
    {
        task: 'Blumenwiese pflegen',
        icon: '🌸',
        percent: 50,
        phase: 'Wachstum',
        milestones: [
            { at: 25, status: 'accomplished', label: 'Gesät', image: '/milestones/blumen-gesaet.svg' },
            { at: 50, status: 'failed', label: 'Bewässert', image: '/milestones/blumen-bewaessert.svg' },
            { at: 75, status: 'planned', label: 'Blüte', image: '/milestones/blumen-bluete.svg' },
            { at: 100, status: 'planned', label: 'Abgeerntet', image: '/milestones/blumen-abgeerntet.svg' },
        ],
    },
]

const fixtureSchoolRankings: SchoolRanking[] = [
    { rank: 1, name: 'Klasse 4a', points: 1240 },
    { rank: 2, name: 'Klasse 3b', points: 1180 },
    { rank: 3, name: 'Klasse HE24a', points: 1050, highlight: true },
    { rank: 4, name: 'Klasse 5c', points: 980 },
    { rank: 5, name: 'Klasse 3a', points: 920 },
]

const fixtureSwissRankings: SwissRanking[] = [
    { rank: 1, name: 'Klasse 2a', school: 'Primarschule Zürich', points: 1580 },
    { rank: 2, name: 'Klasse 6b', school: 'Schulhaus Bern', points: 1420 },
    { rank: 3, name: 'Klasse 4a', school: 'Schulhaus Moos', points: 1240 },
    { rank: 12, name: 'Klasse HE24a', school: 'Unsere Schule', points: 1050, highlight: true },
    { rank: 13, name: 'Klasse 1c', school: 'Schule Luzern', points: 1020 },
]

const fixtureTodos: Todo[] = [
    { id: 1, title: 'Kohl in Beet 3 pflanzen', group: 'Gruppe Sonnenblume', done: false },
    { id: 2, title: 'Erde im Hochbeet lockern', group: 'Alle', done: false },
    { id: 3, title: 'Karotten giessen', group: 'Gruppe Regenwurm', done: true },
    { id: 4, title: 'Wachstum messen und eintragen', group: 'Gruppe Sonnenblume', done: false },
    { id: 5, title: 'Händewaschen-Protokoll ausfüllen', group: 'Alle', done: true },
]

const fixtureStats: Stats = {
    tasksCompleted: 18,
    tasksTotal: 32,
    harvestKg: 4.2,
    activeProjects: 2,
}

const fixtureSeasons: Season[] = [
    {
        id: 'winter',
        name: 'Winter',
        emoji: '❄️',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
        dotColor: 'bg-blue-400',
        borderColor: 'border-blue-200',
    },
    {
        id: 'fruehling',
        name: 'Frühling',
        emoji: '🌸',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        dotColor: 'bg-green-400',
        borderColor: 'border-green-200',
    },
    {
        id: 'sommer',
        name: 'Sommer',
        emoji: '☀️',
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-700',
        dotColor: 'bg-amber-400',
        borderColor: 'border-amber-200',
    },
]

const fixtureGardenEvents: GardenEvent[] = [
    { seasonId: 'winter', sleeps: -5, task: 'Setzlinge vorziehen', cropEmoji: '🍅', actionEmoji: '🌱', done: true },
    { seasonId: 'fruehling', sleeps: 3, task: 'Beet vorbereiten', cropEmoji: '🥕', actionEmoji: '🪴', done: false },
    { seasonId: 'fruehling', sleeps: 17, task: 'Brokkoli säen', cropEmoji: '🥦', actionEmoji: '🌱', done: false },
    { seasonId: 'fruehling', sleeps: 38, task: 'Lauch pflanzen', cropEmoji: '🌿', actionEmoji: '🪴', done: false },
    { seasonId: 'sommer', sleeps: 114, task: 'Erste Ernte!', cropEmoji: '🥕', actionEmoji: '🧺', done: false },
]

const fixtureTabs: Tab[] = [
    { label: 'Gemüse', emoji: '🥬', value: 'gemuese', isProject: true },
    { label: 'Bienen', emoji: '🐝', value: 'bienenstock', isProject: true },
    { label: 'Rangliste', emoji: '🏆', value: 'ranking', isProject: false },
    { label: 'Aufgaben', emoji: '✅', value: 'todos', isProject: false },
    { label: 'Statistik', emoji: '📊', value: 'stats', isProject: false },
    { label: 'Kalender', emoji: '📅', value: 'calendar', isProject: false },
]

// ── localStorage helpers ───────────────────────────────

const STORAGE_KEY = 'dashboard'

interface DashboardSnapshot {
    gemuese: GemueseItem[]
    bienenstock: BienenstockItem[]
    schoolRankings: SchoolRanking[]
    swissRankings: SwissRanking[]
    todos: Todo[]
    stats: Stats
    gardenEvents: GardenEvent[]
}

function loadFromStorage(): Partial<DashboardSnapshot> | null {
    if (typeof window === 'undefined') return null
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return null
        return JSON.parse(raw) as Partial<DashboardSnapshot>
    } catch {
        return null
    }
}

function saveToStorage(snapshot: DashboardSnapshot) {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))
}

// ── Store ──────────────────────────────────────────────

export const useDashboardStore = defineStore('dashboard', () => {
    // State
    const gemuese = ref<GemueseItem[]>(structuredClone(fixtureGemuese))
    const bienenstock = ref<BienenstockItem[]>(structuredClone(fixtureBienenstock))
    const schoolRankings = ref<SchoolRanking[]>(structuredClone(fixtureSchoolRankings))
    const swissRankings = ref<SwissRanking[]>(structuredClone(fixtureSwissRankings))
    const todos = ref<Todo[]>(structuredClone(fixtureTodos))
    const stats = ref<Stats>(structuredClone(fixtureStats))
    const seasons = fixtureSeasons
    const gardenEvents = ref<GardenEvent[]>(structuredClone(fixtureGardenEvents))
    const tabs = fixtureTabs
    const activeTab = ref(0)
    const isLoaded = ref(false)

    // Computed
    const schoolMax = computed(() => Math.max(...schoolRankings.value.map((r) => r.points)))
    const swissMax = computed(() => Math.max(...swissRankings.value.map((r) => r.points)))
    const openTodoCount = computed(() => todos.value.filter((t) => !t.done).length)

    const eventsBySeason = computed(() => {
        return seasons
            .map((season) => ({
                ...season,
                events: gardenEvents.value.filter((e) => e.seasonId === season.id),
            }))
            .filter((group) => group.events.length > 0)
    })

    // Actions
    function toggleTodo(id: number) {
        const todo = todos.value.find((t) => t.id === id)
        if (todo) todo.done = !todo.done
    }

    // localStorage persistence
    const isClient = typeof window !== 'undefined'
    if (isClient) {
        onMounted(() => {
            const saved = loadFromStorage()
            if (saved) {
                if (saved.gemuese) gemuese.value = saved.gemuese
                if (saved.bienenstock) bienenstock.value = saved.bienenstock
                if (saved.schoolRankings) schoolRankings.value = saved.schoolRankings
                if (saved.swissRankings) swissRankings.value = saved.swissRankings
                if (saved.todos) todos.value = saved.todos
                if (saved.stats) stats.value = saved.stats
                if (saved.gardenEvents) gardenEvents.value = saved.gardenEvents
            }
            isLoaded.value = true
        })

        watch(
            () => ({
                gemuese: gemuese.value,
                bienenstock: bienenstock.value,
                schoolRankings: schoolRankings.value,
                swissRankings: swissRankings.value,
                todos: todos.value,
                stats: stats.value,
                gardenEvents: gardenEvents.value,
            }),
            (snapshot) => saveToStorage(snapshot),
            { deep: true },
        )
    }

    return {
        // State
        gemuese,
        bienenstock,
        schoolRankings,
        swissRankings,
        todos,
        stats,
        seasons,
        gardenEvents,
        tabs,
        activeTab,
        isLoaded,
        // Computed
        schoolMax,
        swissMax,
        openTodoCount,
        eventsBySeason,
        // Actions
        toggleTodo,
    }
})
