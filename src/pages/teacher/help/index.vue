<script setup lang="ts">
import { BookOpen, FolderKanban, ClipboardList, Users, CalendarDays, Mail } from 'lucide-vue-next'

definePageMeta({ layout: 'teacher' })

const faqItems = ref([
    {
        question: 'Wie erstelle ich ein neues Projekt?',
        answer: 'Gehen Sie zu "Projekte" und klicken Sie auf "+ Neues Projekt". Sie können ein bestehendes Template als Grundlage wählen oder ein Projekt von Grund auf erstellen.',
        open: false,
    },
    {
        question: 'Wie funktioniert das LP21-Tracking?',
        answer: 'Beim Download von Lehrmaterialien werden die verknüpften LP21-Ziele automatisch als "behandelt" markiert. Den Überblick finden Sie unter "Lehrplan 21".',
        open: false,
    },
    {
        question: 'Wie verwalte ich Schülergruppen?',
        answer: 'Unter "Schüler & Gruppen" können Sie Gruppen erstellen, Schüler zuweisen und die Gruppen bearbeiten. Wählen Sie das Projekt, für das die Gruppen gelten.',
        open: false,
    },
    {
        question: 'Was sind Ferienaufgaben?',
        answer: 'Ferienaufgaben werden den Schülern vor den Schulferien angezeigt (z.B. Pflanzen giessen). Im "Aufgabenpool" können Sie Aufgaben als Ferienaufgabe markieren und E-Mail-Erinnerungen aktivieren.',
        open: false,
    },
    {
        question: 'Wie wechsle ich die Klasse?',
        answer: 'Im Header oben rechts finden Sie ein Dropdown zur Klassenauswahl. Alternativ können Sie unter "Einstellungen > Klasse" wechseln.',
        open: false,
    },
    {
        question: 'Wie importiere ich ein Fachbereich-Template?',
        answer: 'Gehen Sie zu "Fachbereiche" und klicken Sie auf "Template importieren". Dort finden Sie von der Plattform bereitgestellte und geteilte Templates anderer Lehrpersonen.',
        open: false,
    },
])
</script>

<template>
    <div>
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Hilfe & Support</h1>
            <p class="text-sm text-gray-500 mt-1">Anleitungen, FAQ und Kontakt</p>
        </div>

        <!-- Quick start -->
        <UCard class="mb-6">
            <template #header>
                <span class="font-semibold">Schnellstart</span>
            </template>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <NuxtLink
                    to="/teacher/projects"
                    class="flex items-start gap-3 rounded-lg border border-gray-100 p-3 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50 transition-colors"
                >
                    <FolderKanban :size="20" class="text-green-600 shrink-0 mt-0.5" />
                    <div>
                        <span class="text-sm font-medium">Projekt erstellen</span>
                        <p class="text-xs text-gray-500 mt-0.5">Neues Gartenprojekt mit Template starten</p>
                    </div>
                </NuxtLink>
                <NuxtLink
                    to="/teacher/tasks"
                    class="flex items-start gap-3 rounded-lg border border-gray-100 p-3 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50 transition-colors"
                >
                    <ClipboardList :size="20" class="text-green-600 shrink-0 mt-0.5" />
                    <div>
                        <span class="text-sm font-medium">Aufgaben verwalten</span>
                        <p class="text-xs text-gray-500 mt-0.5">Aufgabenpool mit Ferienaufgaben</p>
                    </div>
                </NuxtLink>
                <NuxtLink
                    to="/teacher/subjects"
                    class="flex items-start gap-3 rounded-lg border border-gray-100 p-3 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50 transition-colors"
                >
                    <BookOpen :size="20" class="text-green-600 shrink-0 mt-0.5" />
                    <div>
                        <span class="text-sm font-medium">Fachbereiche erkunden</span>
                        <p class="text-xs text-gray-500 mt-0.5">Lehrmaterial und Lernreihenfolge</p>
                    </div>
                </NuxtLink>
                <NuxtLink
                    to="/teacher/students"
                    class="flex items-start gap-3 rounded-lg border border-gray-100 p-3 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50 transition-colors"
                >
                    <Users :size="20" class="text-green-600 shrink-0 mt-0.5" />
                    <div>
                        <span class="text-sm font-medium">Gruppen einteilen</span>
                        <p class="text-xs text-gray-500 mt-0.5">Schüler in Gruppen zuweisen</p>
                    </div>
                </NuxtLink>
                <NuxtLink
                    to="/teacher/calendar"
                    class="flex items-start gap-3 rounded-lg border border-gray-100 p-3 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50 transition-colors"
                >
                    <CalendarDays :size="20" class="text-green-600 shrink-0 mt-0.5" />
                    <div>
                        <span class="text-sm font-medium">Kalender nutzen</span>
                        <p class="text-xs text-gray-500 mt-0.5">Wochenansicht mit Schulferien</p>
                    </div>
                </NuxtLink>
                <NuxtLink
                    to="/teacher/settings"
                    class="flex items-start gap-3 rounded-lg border border-gray-100 p-3 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50 transition-colors"
                >
                    <Mail :size="20" class="text-green-600 shrink-0 mt-0.5" />
                    <div>
                        <span class="text-sm font-medium">Benachrichtigungen</span>
                        <p class="text-xs text-gray-500 mt-0.5">E-Mail und In-App Einstellungen</p>
                    </div>
                </NuxtLink>
            </div>
        </UCard>

        <!-- FAQ -->
        <UCard class="mb-6">
            <template #header>
                <span class="font-semibold">Häufig gestellte Fragen</span>
            </template>
            <div class="divide-y divide-gray-100 dark:divide-gray-800">
                <div v-for="(item, idx) in faqItems" :key="idx" class="py-3">
                    <button class="flex w-full items-center justify-between text-left" @click="item.open = !item.open">
                        <span class="text-sm font-medium">{{ item.question }}</span>
                        <span class="text-gray-400 text-lg shrink-0 ml-2">{{ item.open ? '&minus;' : '+' }}</span>
                    </button>
                    <p v-if="item.open" class="mt-2 text-sm text-gray-500">{{ item.answer }}</p>
                </div>
            </div>
        </UCard>

        <!-- Contact -->
        <UCard>
            <template #header>
                <span class="font-semibold">Kontakt & Support</span>
            </template>
            <div class="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <p>Bei Fragen oder Problemen stehen wir Ihnen gerne zur Verfügung:</p>
                <div class="space-y-2">
                    <p><strong>E-Mail:</strong> support@plantoria.ch</p>
                    <p><strong>Telefon:</strong> +41 62 123 45 67 (Mo-Fr 8-17 Uhr)</p>
                    <p><strong>Dokumentation:</strong> docs.plantoria.ch</p>
                </div>
                <p class="text-xs text-gray-400 pt-2">Plantoria v2.0 - Schulgarten-Management für Schweizer Schulen</p>
            </div>
        </UCard>
    </div>
</template>
