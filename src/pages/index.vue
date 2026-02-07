<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import {
    Leaf,
    Sprout,
    Sun,
    Droplets,
    TreePine,
    FileText,
    Sparkles,
    FolderKanban,
    Download,
    GraduationCap,
    LayoutTemplate,
    ClipboardList,
    Users,
    CalendarDays,
    FileDown,
    ChevronRight,
    Menu,
    X,
    CheckCircle,
} from 'lucide-vue-next'

definePageMeta({ layout: false })

const authStore = useAuthStore()
authStore.init()

const isScrolled = ref(false)
const mobileMenuOpen = ref(false)

const navLinks = [
    { label: 'Warum Plantoria', href: '#warum' },
    { label: 'Funktionen', href: '#funktionen' },
    { label: 'Lehrplan 21', href: '#lehrplan' },
    { label: 'Zielgruppen', href: '#zielgruppen' },
]

function scrollTo(href: string) {
    mobileMenuOpen.value = false
    const el = document.querySelector(href)
    if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
    }
}

function handleCta() {
    if (authStore.isAuthenticated) {
        navigateTo('/teacher')
    } else {
        navigateTo('/login')
    }
}

const ctaLabel = computed(() => (authStore.isAuthenticated ? 'Dashboard' : 'Jetzt starten'))

// IntersectionObserver for scroll animations
function useScrollAnimation() {
    onMounted(() => {
        // Sticky nav scroll detection
        const onScroll = () => {
            isScrolled.value = window.scrollY > 20
        }
        window.addEventListener('scroll', onScroll, { passive: true })

        // Fade-in animations
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-visible')
                        observer.unobserve(entry.target)
                    }
                })
            },
            { threshold: 0.1 },
        )
        document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el))
    })
}

useScrollAnimation()

const whyCards = [
    {
        icon: TreePine,
        title: 'Kinder brauchen Natur',
        text: 'Studien zeigen: Kinder verbringen immer weniger Zeit draussen. Der Schulgarten bringt Natur direkt in den Schulalltag.',
        color: 'bg-green-100 text-green-700',
    },
    {
        icon: FileText,
        title: 'Lehrpersonen brauchen Struktur',
        text: 'Materialien suchen, LP21 abgleichen, Gruppen organisieren — Plantoria nimmt Ihnen die Planung ab.',
        color: 'bg-amber-100 text-amber-700',
    },
    {
        icon: Sparkles,
        title: '6 Jahre, ein roter Faden',
        text: 'Vom Kindergarten bis zur 6. Klasse: Plantoria begleitet Ihre Klasse mit altersgerechten Projekten durch die gesamte Primarschulzeit.',
        color: 'bg-purple-100 text-purple-700',
    },
]

const steps = [
    {
        num: '01',
        icon: FolderKanban,
        title: 'Projekt wählen',
        text: 'Wählen Sie aus bewährten Vorlagen oder erstellen Sie eigene Projekte für Ihren Schulgarten.',
    },
    {
        num: '02',
        icon: Download,
        title: 'Material herunterladen',
        text: 'Arbeitsblätter, Anleitungen und Hintergrundwissen — fertig aufbereitet und sofort einsetzbar.',
    },
    {
        num: '03',
        icon: GraduationCap,
        title: 'Fortschritt tracken',
        text: 'LP21-Kompetenzen werden automatisch erfasst. Sie sehen jederzeit, wo Ihre Klasse steht.',
    },
]

const features = [
    { icon: LayoutTemplate, title: 'Projektvorlagen', text: 'Bewährte Gartenkonzepte als Startpunkt — sofort einsetzbar und anpassbar.' },
    { icon: GraduationCap, title: 'LP21-Tracking', text: 'Automatische Zuordnung zu Lehrplan-21-Kompetenzen über alle Fachbereiche.' },
    { icon: ClipboardList, title: 'Aufgabenpool', text: 'Fertige Aufgaben für jede Jahreszeit — inkl. Ferienaufgaben mit Erinnerungen.' },
    { icon: Users, title: 'Schülergruppen', text: 'Flexible Gruppenarbeit: Beete zuweisen, Verantwortung teilen, gemeinsam wachsen.' },
    { icon: CalendarDays, title: 'Saisonkalender', text: 'Wochen- und Monatsansicht mit Aussaat-, Pflege- und Ernteterminen.' },
    { icon: FileDown, title: 'Lehrmaterial', text: 'PDFs, Videos und Arbeitsblätter — kuratiert für den Unterricht im Schulgarten.' },
]

const lp21Progress = [
    { label: 'NMG', value: 72, color: 'bg-green-500' },
    { label: 'MA', value: 45, color: 'bg-emerald-500' },
    { label: 'TTG', value: 38, color: 'bg-teal-500' },
    { label: 'WAH', value: 30, color: 'bg-cyan-500' },
]

const fachbereiche = ['Boden', 'Fruchtfolge', 'Gemüsearten', 'Gesundheit', 'Flächengestaltung', 'Beetplanung', 'Ernährung', 'Ökologie']

const audiences = [
    {
        title: 'Lehrpersonen',
        text: 'Weniger Vorbereitungszeit, mehr Zeit im Garten. Fertige Materialien, automatisches LP21-Tracking und klare Projektpläne.',
        accent: 'border-green-500',
    },
    {
        title: 'Schüler:innen',
        text: 'Hands-on lernen: säen, pflegen, ernten. Verantwortung übernehmen und Natur hautnah erleben — vom Kindergarten bis zur 6. Klasse.',
        accent: 'border-emerald-500',
    },
    {
        title: 'Schulen & Gemeinden',
        text: 'Ein nachhaltiges Konzept für den Schulstandort. LP21-konform, skalierbar und mit messbarem Bildungserfolg.',
        accent: 'border-teal-500',
    },
]

const stats = [
    { value: '8', label: 'Fachbereiche' },
    { value: '6', label: 'Jahre Begleitung' },
    { value: 'LP21', label: 'konform' },
]
</script>

<template>
    <div class="min-h-screen bg-white text-gray-900 overflow-x-hidden">
        <!-- Sticky Navigation -->
        <nav
            class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
            :class="isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'"
        >
            <div class="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
                <!-- Logo -->
                <button class="flex items-center gap-2.5" @click="scrollTo('#hero')">
                    <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-green-600 text-white">
                        <Leaf :size="18" stroke-width="2.5" />
                    </div>
                    <span class="text-base font-bold tracking-wider text-green-800">PLANTORIA</span>
                </button>

                <!-- Desktop nav links -->
                <div class="hidden md:flex items-center gap-8">
                    <button
                        v-for="link in navLinks"
                        :key="link.href"
                        class="text-sm font-medium text-gray-600 hover:text-green-700 transition-colors"
                        @click="scrollTo(link.href)"
                    >
                        {{ link.label }}
                    </button>
                    <UButton color="primary" size="sm" @click="handleCta">
                        {{ ctaLabel }}
                        <template #trailing>
                            <ChevronRight :size="14" />
                        </template>
                    </UButton>
                </div>

                <!-- Mobile hamburger -->
                <button class="md:hidden p-2 text-gray-600" @click="mobileMenuOpen = !mobileMenuOpen">
                    <component :is="mobileMenuOpen ? X : Menu" :size="24" />
                </button>
            </div>

            <!-- Mobile menu -->
            <Transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="opacity-0 -translate-y-2"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition duration-150 ease-in"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-2"
            >
                <div v-if="mobileMenuOpen" class="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 px-6 py-4 space-y-3">
                    <button
                        v-for="link in navLinks"
                        :key="link.href"
                        class="block w-full text-left text-sm font-medium text-gray-600 hover:text-green-700 py-2"
                        @click="scrollTo(link.href)"
                    >
                        {{ link.label }}
                    </button>
                    <UButton color="primary" block size="sm" @click="handleCta">
                        {{ ctaLabel }}
                    </UButton>
                </div>
            </Transition>
        </nav>

        <!-- Hero -->
        <section id="hero" class="relative pt-28 pb-20 lg:pt-36 lg:pb-28 bg-gradient-to-b from-green-50/50 via-white to-white">
            <div class="mx-auto max-w-7xl px-6 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                <!-- Left: Text -->
                <div class="flex-1 text-center lg:text-left">
                    <UBadge color="green" variant="subtle" class="mb-5"> Für Schweizer Primarschulen </UBadge>
                    <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-gray-900">
                        Kinder zurück<br />in die <span class="text-green-600">Natur</span> bringen
                    </h1>
                    <p class="mt-6 text-lg text-gray-500 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                        Plantoria verbindet den Schulgarten mit dem Lehrplan 21 und begleitet Ihre Klasse über 6 Jahre — von der Aussaat bis
                        zur Ernte.
                    </p>
                    <div class="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                        <UButton color="primary" size="xl" @click="handleCta">
                            Kostenlos testen
                            <template #trailing>
                                <ChevronRight :size="16" />
                            </template>
                        </UButton>
                        <UButton color="neutral" variant="outline" size="xl" @click="scrollTo('#warum')"> Mehr erfahren </UButton>
                    </div>
                </div>

                <!-- Right: Decorative illustration -->
                <div class="flex-1 flex justify-center lg:justify-end">
                    <div class="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
                        <!-- Background circles -->
                        <div class="absolute inset-0 rounded-full bg-green-100/60" />
                        <div class="absolute inset-6 rounded-full bg-green-50/80" />
                        <!-- Floating icons -->
                        <div
                            class="absolute top-6 left-1/2 -translate-x-1/2 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 shadow-lg shadow-amber-200/50 animate-bounce-slow"
                        >
                            <Sun :size="28" />
                        </div>
                        <div
                            class="absolute bottom-12 left-8 flex h-12 w-12 items-center justify-center rounded-xl bg-green-200 text-green-700 shadow-lg shadow-green-200/50 animate-bounce-slow-delay-1"
                        >
                            <Leaf :size="24" />
                        </div>
                        <div
                            class="absolute bottom-12 right-8 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 shadow-lg shadow-blue-200/50 animate-bounce-slow-delay-2"
                        >
                            <Droplets :size="24" />
                        </div>
                        <div
                            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-20 w-20 items-center justify-center rounded-2xl bg-green-600 text-white shadow-xl shadow-green-600/30"
                        >
                            <Sprout :size="40" />
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Warum Plantoria -->
        <section id="warum" class="py-20 lg:py-28 bg-green-50/30">
            <div class="mx-auto max-w-7xl px-6">
                <div class="text-center mb-14 animate-on-scroll">
                    <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight">Warum Plantoria?</h2>
                    <p class="mt-4 text-gray-500 max-w-2xl mx-auto">Vom Problem zur Lösung — so bringen wir Natur in den Schulalltag.</p>
                </div>
                <div class="grid md:grid-cols-3 gap-6 lg:gap-8">
                    <div
                        v-for="card in whyCards"
                        :key="card.title"
                        class="animate-on-scroll bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                        <div class="flex h-12 w-12 items-center justify-center rounded-xl mb-5" :class="card.color">
                            <component :is="card.icon" :size="24" />
                        </div>
                        <h3 class="text-lg font-bold mb-2">{{ card.title }}</h3>
                        <p class="text-sm text-gray-500 leading-relaxed">{{ card.text }}</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- 3 Schritte -->
        <section class="py-20 lg:py-28">
            <div class="mx-auto max-w-7xl px-6">
                <div class="text-center mb-14 animate-on-scroll">
                    <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight">In drei Schritten zum Schulgarten</h2>
                    <p class="mt-4 text-gray-500 max-w-2xl mx-auto">So einfach starten Sie mit Plantoria.</p>
                </div>
                <div class="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
                    <!-- Dashed connection line (desktop) -->
                    <div class="hidden md:block absolute top-16 left-[20%] right-[20%] border-t-2 border-dashed border-green-200" />
                    <div v-for="step in steps" :key="step.num" class="animate-on-scroll text-center relative">
                        <div
                            class="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-green-600 text-white shadow-lg shadow-green-600/20 mb-5 relative z-10"
                        >
                            <component :is="step.icon" :size="24" />
                        </div>
                        <div class="text-xs font-bold text-green-600 tracking-widest mb-2">SCHRITT {{ step.num }}</div>
                        <h3 class="text-lg font-bold mb-2">{{ step.title }}</h3>
                        <p class="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">{{ step.text }}</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Features Grid -->
        <section id="funktionen" class="py-20 lg:py-28 bg-gray-50/50">
            <div class="mx-auto max-w-7xl px-6">
                <div class="text-center mb-14 animate-on-scroll">
                    <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight">Alles, was Sie brauchen</h2>
                    <p class="mt-4 text-gray-500 max-w-2xl mx-auto">Durchdachte Funktionen für einen erfolgreichen Schulgarten.</p>
                </div>
                <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div
                        v-for="feature in features"
                        :key="feature.title"
                        class="animate-on-scroll bg-white rounded-2xl p-7 border border-gray-100 hover:border-green-200 hover:shadow-md transition-all group"
                    >
                        <div
                            class="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600 group-hover:bg-green-100 transition-colors mb-4"
                        >
                            <component :is="feature.icon" :size="22" />
                        </div>
                        <h3 class="text-base font-bold mb-1.5">{{ feature.title }}</h3>
                        <p class="text-sm text-gray-500 leading-relaxed">{{ feature.text }}</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- LP21 Integration -->
        <section id="lehrplan" class="py-20 lg:py-28">
            <div class="mx-auto max-w-7xl px-6">
                <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    <!-- Left: Text -->
                    <div class="flex-1 animate-on-scroll">
                        <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight mb-6">
                            Nahtlose <span class="text-green-600">Lehrplan-21</span>-Integration
                        </h2>
                        <p class="text-gray-500 leading-relaxed mb-8">
                            Plantoria ordnet jede Aktivität im Schulgarten automatisch den passenden LP21-Kompetenzen zu. So dokumentieren
                            Sie Lernfortschritte mühelos.
                        </p>
                        <ul class="space-y-4">
                            <li class="flex items-start gap-3">
                                <CheckCircle :size="20" class="text-green-500 mt-0.5 shrink-0" />
                                <span class="text-sm text-gray-600"
                                    ><strong>4 Fachbereiche</strong> abgedeckt: NMG, Mathematik, TTG, WAH</span
                                >
                            </li>
                            <li class="flex items-start gap-3">
                                <CheckCircle :size="20" class="text-green-500 mt-0.5 shrink-0" />
                                <span class="text-sm text-gray-600"
                                    ><strong>Automatisches Tracking</strong> — keine manuelle Zuordnung nötig</span
                                >
                            </li>
                            <li class="flex items-start gap-3">
                                <CheckCircle :size="20" class="text-green-500 mt-0.5 shrink-0" />
                                <span class="text-sm text-gray-600"
                                    ><strong>6 Jahre Progression</strong> vom Kindergarten bis zur 6. Klasse</span
                                >
                            </li>
                        </ul>
                    </div>

                    <!-- Right: Stylized card -->
                    <div class="flex-1 flex justify-center animate-on-scroll">
                        <div
                            class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 w-full max-w-sm transform rotate-1 hover:rotate-0 transition-transform"
                        >
                            <div class="flex items-center gap-3 mb-6">
                                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
                                    <GraduationCap :size="20" />
                                </div>
                                <div>
                                    <div class="text-sm font-bold">LP21-Fortschritt</div>
                                    <div class="text-xs text-gray-400">Klasse 4a — 2025/26</div>
                                </div>
                            </div>
                            <div class="space-y-4">
                                <div v-for="item in lp21Progress" :key="item.label">
                                    <div class="flex items-center justify-between text-sm mb-1.5">
                                        <span class="font-medium text-gray-700">{{ item.label }}</span>
                                        <span class="text-gray-400 text-xs">{{ item.value }}%</span>
                                    </div>
                                    <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            class="h-full rounded-full transition-all"
                                            :class="item.color"
                                            :style="{ width: item.value + '%' }"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Fachbereiche -->
        <section class="py-16 lg:py-20 bg-green-50/30">
            <div class="mx-auto max-w-7xl px-6 text-center animate-on-scroll">
                <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight mb-8">8 Fachbereiche</h2>
                <div class="flex flex-wrap justify-center gap-3">
                    <span
                        v-for="fach in fachbereiche"
                        :key="fach"
                        class="inline-flex items-center px-5 py-2.5 rounded-full bg-white text-sm font-medium text-gray-700 border border-gray-200 shadow-sm hover:border-green-300 hover:text-green-700 transition-colors"
                    >
                        {{ fach }}
                    </span>
                </div>
            </div>
        </section>

        <!-- Zielgruppen -->
        <section id="zielgruppen" class="py-20 lg:py-28">
            <div class="mx-auto max-w-7xl px-6">
                <div class="text-center mb-14 animate-on-scroll">
                    <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight">Für alle, die den Schulgarten leben</h2>
                    <p class="mt-4 text-gray-500 max-w-2xl mx-auto">Plantoria unterstützt jede Rolle im Schulumfeld.</p>
                </div>
                <div class="grid md:grid-cols-3 gap-6 lg:gap-8">
                    <div
                        v-for="audience in audiences"
                        :key="audience.title"
                        class="animate-on-scroll bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow border-t-4"
                        :class="audience.accent"
                    >
                        <h3 class="text-lg font-bold mb-3">{{ audience.title }}</h3>
                        <p class="text-sm text-gray-500 leading-relaxed">{{ audience.text }}</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Inspirations-Zitat + Stats -->
        <section class="py-20 lg:py-28 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 text-white relative overflow-hidden">
            <!-- Decorative shapes -->
            <div class="absolute inset-0">
                <div class="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white/[0.07] blur-3xl" />
                <div class="absolute bottom-20 -right-20 h-80 w-80 rounded-full bg-teal-400/[0.12] blur-3xl" />
            </div>
            <div class="relative z-10 mx-auto max-w-7xl px-6 text-center">
                <div class="animate-on-scroll mb-14">
                    <blockquote class="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight max-w-3xl mx-auto">
                        &laquo;Jedes Kind verdient es, die Welt mit den Händen in der Erde zu begreifen.&raquo;
                    </blockquote>
                    <p class="mt-5 text-green-100/70 text-sm">Die Vision hinter Plantoria</p>
                </div>
                <div class="grid grid-cols-3 gap-8 max-w-lg mx-auto animate-on-scroll">
                    <div v-for="stat in stats" :key="stat.label" class="text-center">
                        <div class="text-3xl sm:text-4xl font-extrabold">{{ stat.value }}</div>
                        <div class="text-xs sm:text-sm text-green-100/70 mt-1">{{ stat.label }}</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Finaler CTA -->
        <section class="py-20 lg:py-28">
            <div class="mx-auto max-w-7xl px-6 text-center animate-on-scroll">
                <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">Bereit, den Schulgarten zu starten?</h2>
                <p class="text-gray-500 max-w-xl mx-auto mb-8">
                    Erstellen Sie Ihr kostenloses Konto und entdecken Sie, wie Plantoria Ihren Unterricht bereichert.
                </p>
                <UButton color="primary" size="xl" @click="handleCta">
                    Kostenlos starten
                    <template #trailing>
                        <ChevronRight :size="16" />
                    </template>
                </UButton>
            </div>
        </section>

        <!-- Footer -->
        <footer class="bg-gray-900 text-gray-400 py-16">
            <div class="mx-auto max-w-7xl px-6">
                <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
                    <!-- Logo -->
                    <div>
                        <div class="flex items-center gap-2.5 mb-4">
                            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-white">
                                <Leaf :size="16" stroke-width="2.5" />
                            </div>
                            <span class="text-sm font-bold tracking-wider text-white">PLANTORIA</span>
                        </div>
                        <p class="text-sm leading-relaxed">
                            Der digitale Begleiter für Ihren Schulgarten. LP21-konform, praxiserprobt, kostenlos.
                        </p>
                    </div>

                    <!-- Plattform -->
                    <div>
                        <h4 class="text-sm font-semibold text-white mb-4">Plattform</h4>
                        <ul class="space-y-2.5 text-sm">
                            <li><button class="hover:text-white transition-colors" @click="scrollTo('#funktionen')">Funktionen</button></li>
                            <li><button class="hover:text-white transition-colors" @click="scrollTo('#lehrplan')">Lehrplan 21</button></li>
                            <li>
                                <button class="hover:text-white transition-colors" @click="scrollTo('#zielgruppen')">Zielgruppen</button>
                            </li>
                        </ul>
                    </div>

                    <!-- Ressourcen -->
                    <div>
                        <h4 class="text-sm font-semibold text-white mb-4">Ressourcen</h4>
                        <ul class="space-y-2.5 text-sm">
                            <li><span class="text-gray-500">Dokumentation</span></li>
                            <li><span class="text-gray-500">Blog</span></li>
                            <li><span class="text-gray-500">FAQ</span></li>
                        </ul>
                    </div>

                    <!-- Rechtliches -->
                    <div>
                        <h4 class="text-sm font-semibold text-white mb-4">Rechtliches</h4>
                        <ul class="space-y-2.5 text-sm">
                            <li><span class="text-gray-500">Impressum</span></li>
                            <li><span class="text-gray-500">Datenschutz</span></li>
                            <li><span class="text-gray-500">AGB</span></li>
                        </ul>
                    </div>
                </div>

                <div class="mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
                    &copy; 2026 Plantoria &middot; Schulgarten-Management für Schweizer Primarschulen
                </div>
            </div>
        </footer>
    </div>
</template>

<style scoped>
/* Scroll animation base */
.animate-on-scroll {
    opacity: 0;
    transform: translateY(24px);
    transition:
        opacity 0.6s ease-out,
        transform 0.6s ease-out;
}

.animate-visible {
    opacity: 1;
    transform: translateY(0);
}

/* Floating icon animations */
@keyframes bounce-slow {
    0%,
    100% {
        transform: translateY(0) translateX(-50%);
    }
    50% {
        transform: translateY(-10px) translateX(-50%);
    }
}

@keyframes bounce-slow-left {
    0%,
    100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-8px);
    }
}

@keyframes bounce-slow-right {
    0%,
    100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-12px);
    }
}

.animate-bounce-slow {
    animation: bounce-slow 3s ease-in-out infinite;
}

.animate-bounce-slow-delay-1 {
    animation: bounce-slow-left 3.5s ease-in-out infinite;
    animation-delay: 0.5s;
}

.animate-bounce-slow-delay-2 {
    animation: bounce-slow-right 4s ease-in-out infinite;
    animation-delay: 1s;
}
</style>
