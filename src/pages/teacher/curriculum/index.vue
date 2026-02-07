<script setup lang="ts">
import { useCurriculumStore } from '@/stores/curriculum'
import { useTeacherStore } from '@/stores/teacher'
import { FileDown } from 'lucide-vue-next'

definePageMeta({ layout: 'teacher' })

const curriculumStore = useCurriculumStore()
const teacherStore = useTeacherStore()

const activeTab = ref('subject')
const showExportDialog = ref(false)

// Export dialog state
const exportPeriod = ref('Ganzes Schuljahr')
const exportContent = ref({
    totalProgress: true,
    bySubject: true,
    treatedTopics: true,
    linkedProjects: true,
    downloadHistory: false,
})
const exportFormat = ref('PDF')

const periodOptions = [
    { label: 'Ganzes Schuljahr', value: 'Ganzes Schuljahr' },
    { label: '1. Semester', value: '1. Semester' },
    { label: '2. Semester', value: '2. Semester' },
]

const formatOptions = [
    { label: 'PDF', value: 'PDF' },
    { label: 'CSV', value: 'CSV' },
]

function formatDate(date?: string) {
    if (!date) return ''
    return new Date(date).toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
</script>

<template>
    <div>
        <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Lehrplan 21</h1>
                <p class="text-sm text-gray-500 mt-1">
                    Klasse: {{ teacherStore.activeClass.name }} | SJ {{ teacherStore.activeClass.schoolYear }}
                </p>
            </div>
            <UButton variant="soft" color="primary" @click="showExportDialog = true">
                <FileDown :size="16" class="mr-1" /> Bericht exportieren
            </UButton>
        </div>

        <!-- Overall progress -->
        <UCard class="mb-6">
            <div class="flex items-center justify-between mb-2">
                <span class="font-semibold">Gesamtfortschritt</span>
                <span class="text-sm text-gray-500">
                    Behandelte Themen: {{ curriculumStore.progress.treatedTopics }} / {{ curriculumStore.progress.totalTopics }}
                </span>
            </div>
            <ProgressBar :value="curriculumStore.progress.coveragePercent" />
        </UCard>

        <!-- Tabs -->
        <div class="mb-6 flex gap-1 border-b border-gray-200 dark:border-gray-800">
            <button
                v-for="tab in [
                    { key: 'subject', label: 'Nach Fachbereich' },
                    { key: 'project', label: 'Nach Projekt' },
                    { key: 'chronological', label: 'Chronologisch' },
                ]"
                :key="tab.key"
                :class="[
                    'px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
                    activeTab === tab.key
                        ? 'border-green-600 text-green-700 dark:text-green-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                ]"
                @click="activeTab = tab.key"
            >
                {{ tab.label }}
            </button>
        </div>

        <!-- By Subject -->
        <div v-if="activeTab === 'subject'" class="space-y-6">
            <UCard v-for="cur in curriculumStore.curriculumData" :key="cur.id">
                <div class="mb-3">
                    <div class="flex items-center justify-between mb-1">
                        <h3 class="font-semibold">{{ cur.shortName }} – {{ cur.subject }}</h3>
                        <span class="text-sm font-semibold text-green-600">
                            {{ Math.round((cur.topics.filter((t) => t.treated).length / cur.topics.length) * 100) }}%
                        </span>
                    </div>
                    <ProgressBar
                        :value="Math.round((cur.topics.filter((t) => t.treated).length / cur.topics.length) * 100)"
                        :show-label="false"
                        size="sm"
                    />
                </div>
                <div class="space-y-3">
                    <div
                        v-for="topic in cur.topics"
                        :key="topic.id"
                        :class="[
                            'rounded-lg border p-3',
                            topic.treated
                                ? 'border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20'
                                : 'border-gray-100 dark:border-gray-800',
                        ]"
                    >
                        <div class="flex items-start gap-3">
                            <input type="checkbox" :checked="topic.treated" disabled class="mt-0.5 h-4 w-4 rounded text-green-600" />
                            <div class="flex-1">
                                <div class="flex items-center gap-2">
                                    <span class="text-sm font-medium">{{ topic.code }}</span>
                                    <span class="text-sm">{{ topic.title }}</span>
                                    <UBadge :color="topic.treated ? 'green' : 'neutral'" variant="subtle" size="xs">
                                        {{ topic.treated ? 'Behandelt' : 'Offen' }}
                                    </UBadge>
                                </div>
                                <div v-if="topic.treated" class="mt-1 text-xs text-gray-500">
                                    <span v-if="topic.treatedByDownload">Download: {{ topic.treatedByDownload }}</span>
                                    <span v-if="topic.treatedDate"> | {{ formatDate(topic.treatedDate) }}</span>
                                    <span v-if="topic.treatedByProject"> | Projekt: {{ topic.treatedByProject }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </UCard>
        </div>

        <!-- By Project (simplified) -->
        <div v-if="activeTab === 'project'" class="text-sm text-gray-500">
            <UCard>
                <h3 class="font-semibold mb-3">Gemüsefläche HE24a</h3>
                <p class="text-sm text-gray-500 mb-2">Behandelte Lernziele durch dieses Projekt:</p>
                <div class="space-y-1">
                    <p v-for="cur in curriculumStore.curriculumData" :key="cur.id">
                        <span
                            v-for="topic in cur.topics.filter((t) => t.treated && t.treatedByProject === 'Gemüsefläche HE24a')"
                            :key="topic.id"
                            class="block text-sm"
                        >
                            ✓ {{ topic.code }} – {{ topic.title }}
                        </span>
                    </p>
                </div>
            </UCard>
        </div>

        <!-- Chronological (simplified) -->
        <div v-if="activeTab === 'chronological'" class="space-y-2">
            <div v-for="cur in curriculumStore.curriculumData" :key="cur.id">
                <div
                    v-for="topic in cur.topics
                        .filter((t) => t.treated)
                        .sort((a, b) => (b.treatedDate || '').localeCompare(a.treatedDate || ''))"
                    :key="topic.id"
                    class="flex items-center gap-3 rounded-lg border border-gray-100 p-3 dark:border-gray-800"
                >
                    <span class="text-xs text-gray-400 tabular-nums min-w-[80px]">{{ formatDate(topic.treatedDate) }}</span>
                    <UBadge color="primary" variant="subtle" size="xs">{{ topic.code }}</UBadge>
                    <span class="text-sm">{{ topic.title }}</span>
                    <span class="text-xs text-gray-400 ml-auto">via {{ topic.treatedByDownload }}</span>
                </div>
            </div>
        </div>

        <!-- Export dialog -->
        <UModal v-model:open="showExportDialog">
            <template #content>
                <div class="p-6">
                    <h3 class="text-lg font-semibold mb-4">LP21-Bericht exportieren</h3>

                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Klasse</label>
                            <p class="text-sm text-gray-500">{{ teacherStore.activeClass.name }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Schuljahr</label>
                            <p class="text-sm text-gray-500">{{ teacherStore.activeClass.schoolYear }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Zeitraum</label>
                            <USelect v-model="exportPeriod" :items="periodOptions" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Inhalt</label>
                            <div class="space-y-2">
                                <label class="flex items-center gap-2 text-sm">
                                    <input v-model="exportContent.totalProgress" type="checkbox" class="text-green-600 rounded" />
                                    Gesamtfortschritt
                                </label>
                                <label class="flex items-center gap-2 text-sm">
                                    <input v-model="exportContent.bySubject" type="checkbox" class="text-green-600 rounded" />
                                    Aufschlüsselung nach Fachbereich
                                </label>
                                <label class="flex items-center gap-2 text-sm">
                                    <input v-model="exportContent.treatedTopics" type="checkbox" class="text-green-600 rounded" />
                                    Behandelte Lernziele mit Datum
                                </label>
                                <label class="flex items-center gap-2 text-sm">
                                    <input v-model="exportContent.linkedProjects" type="checkbox" class="text-green-600 rounded" />
                                    Verknüpfte Projekte
                                </label>
                                <label class="flex items-center gap-2 text-sm">
                                    <input v-model="exportContent.downloadHistory" type="checkbox" class="text-green-600 rounded" />
                                    Download-Historie
                                </label>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Format</label>
                            <USelect v-model="exportFormat" :items="formatOptions" />
                        </div>
                    </div>

                    <div class="mt-6 flex justify-end gap-3">
                        <UButton variant="ghost" @click="showExportDialog = false">Abbrechen</UButton>
                        <UButton color="primary" @click="showExportDialog = false">Exportieren</UButton>
                    </div>
                </div>
            </template>
        </UModal>
    </div>
</template>
