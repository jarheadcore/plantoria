<script setup lang="ts">
import { useMaterialsStore } from '@/stores/materials'
import { useCurriculumStore } from '@/stores/curriculum'
import { Search, Download, Eye, Link, Video, Headphones, FileText, File, Pencil, Trash2, Plus, Upload, X } from 'lucide-vue-next'
import type { Material, MaterialFormat, ProjectPhase, Difficulty } from '@/types'

definePageMeta({ layout: 'teacher' })

const materialsStore = useMaterialsStore()
const curriculumStore = useCurriculumStore()

const tagOptions = computed(() => [{ label: 'Alle Tags', value: 'all' }, ...materialsStore.allTags.map((t) => ({ label: t, value: t }))])

const gradeOptions = [
    { label: 'Alle Stufen', value: 'all' },
    { label: '1-2', value: '1' },
    { label: '3-6', value: '3' },
    { label: '5-6', value: '5' },
]

const phaseOptions = [
    { label: 'Alle Phasen', value: 'all' },
    { label: 'Vorprojekt', value: 'Vorprojekt' },
    { label: 'Planung', value: 'Planung' },
    { label: 'Pflanzung', value: 'Pflanzung' },
    { label: 'Pflege', value: 'Pflege' },
    { label: 'Ernte', value: 'Ernte' },
    { label: 'Verarbeitung', value: 'Verarbeitung' },
    { label: 'Vermarktung', value: 'Vermarktung' },
]

const formatOptions = [
    { label: 'Alle Formate', value: 'all' },
    { label: 'PDF', value: 'PDF' },
    { label: 'DOCX', value: 'DOCX' },
    { label: 'Video', value: 'Video' },
    { label: 'Audio', value: 'Audio' },
    { label: 'Link', value: 'Link' },
    { label: 'Datei', value: 'Datei' },
]

const editPhaseOptions = [
    { label: '– Keine –', value: 'none' },
    { label: 'Vorprojekt', value: 'Vorprojekt' },
    { label: 'Planung', value: 'Planung' },
    { label: 'Pflanzung', value: 'Pflanzung' },
    { label: 'Pflege', value: 'Pflege' },
    { label: 'Ernte', value: 'Ernte' },
    { label: 'Verarbeitung', value: 'Verarbeitung' },
    { label: 'Vermarktung', value: 'Vermarktung' },
]

const editGradeOptions = [
    { label: '1-2', value: '1-2' },
    { label: '3-6', value: '3-6' },
    { label: '5-6', value: '5-6' },
]

const difficultyOptions = [
    { label: 'Einfach', value: 'Einfach' },
    { label: 'Mittel', value: 'Mittel' },
    { label: 'Schwer', value: 'Schwer' },
]

// Download dialog
const showDownloadDialog = ref(false)
const downloadMaterial = ref<Material | null>(null)
const downloadFormat = ref<MaterialFormat>('PDF')

function startDownload(mat: Material, format: MaterialFormat) {
    downloadMaterial.value = mat
    downloadFormat.value = format
    showDownloadDialog.value = true
}

function confirmDownload() {
    if (downloadMaterial.value) {
        materialsStore.recordDownload(downloadMaterial.value.id, downloadFormat.value)
        for (const code of downloadMaterial.value.lp21Refs) {
            curriculumStore.markTopicTreated(code, downloadMaterial.value.title, 'Gemüsefläche HE24a')
        }
        // Trigger actual file download if fileUrl exists
        if (downloadMaterial.value.fileUrl) {
            triggerFileDownload(downloadMaterial.value.fileUrl, downloadMaterial.value.documentName || downloadMaterial.value.title)
        }
    }
    showDownloadDialog.value = false
}

function triggerFileDownload(url: string, filename: string) {
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.target = '_blank'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
}

// Edit / Create
const showEditModal = ref(false)
const editingId = ref<string | null>(null)

const editForm = ref({
    title: '',
    description: '',
    tags: '',
    gradeRange: '3-6',
    phase: 'none' as string,
    formats: ['PDF'] as MaterialFormat[],
    difficulty: 'Mittel' as Difficulty,
    lp21Refs: '',
    linkUrl: '',
    videoUrl: '',
    audioUrl: '',
    fileUrl: '' as string | undefined,
    documentName: '' as string | undefined,
})

const fileInput = ref<HTMLInputElement>()

const allFormatChoices: MaterialFormat[] = ['PDF', 'DOCX', 'Link', 'Video', 'Audio', 'Datei']

function openCreate() {
    editingId.value = null
    editForm.value = {
        title: '',
        description: '',
        tags: '',
        gradeRange: '3-6',
        phase: 'none',
        formats: ['PDF'],
        difficulty: 'Mittel',
        lp21Refs: '',
        linkUrl: '',
        videoUrl: '',
        audioUrl: '',
        fileUrl: undefined,
        documentName: undefined,
    }
    showEditModal.value = true
}

function openEdit(mat: Material) {
    editingId.value = mat.id
    editForm.value = {
        title: mat.title,
        description: mat.description || '',
        tags: mat.tags.join(', '),
        gradeRange: mat.gradeRange,
        phase: mat.phase || 'none',
        formats: [...mat.formats],
        difficulty: mat.difficulty,
        lp21Refs: mat.lp21Refs.join(', '),
        linkUrl: mat.linkUrl || '',
        videoUrl: mat.videoUrl || '',
        audioUrl: mat.audioUrl || '',
        fileUrl: mat.fileUrl,
        documentName: mat.documentName,
    }
    showEditModal.value = true
}

function toggleFormat(format: MaterialFormat) {
    const idx = editForm.value.formats.indexOf(format)
    if (idx !== -1) {
        if (editForm.value.formats.length > 1) {
            editForm.value.formats.splice(idx, 1)
        }
    } else {
        editForm.value.formats.push(format)
    }
}

function handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return

    const blobUrl = URL.createObjectURL(file)
    editForm.value.fileUrl = blobUrl
    editForm.value.documentName = file.name

    // Auto-detect format from extension
    const ext = file.name.split('.').pop()?.toUpperCase()
    if (ext === 'PDF' && !editForm.value.formats.includes('PDF')) {
        editForm.value.formats.push('PDF')
    } else if (ext === 'DOCX' && !editForm.value.formats.includes('DOCX')) {
        editForm.value.formats.push('DOCX')
    }

    input.value = ''
}

function removeFile() {
    if (editForm.value.fileUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(editForm.value.fileUrl)
    }
    editForm.value.fileUrl = undefined
    editForm.value.documentName = undefined
}

function saveForm() {
    const tags = editForm.value.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    const lp21Refs = editForm.value.lp21Refs
        .split(',')
        .map((r) => r.trim())
        .filter(Boolean)

    const materialData: Partial<Material> = {
        title: editForm.value.title,
        description: editForm.value.description || undefined,
        tags,
        gradeRange: editForm.value.gradeRange,
        phase: (editForm.value.phase === 'none' ? undefined : editForm.value.phase) as ProjectPhase | undefined,
        formats: editForm.value.formats,
        difficulty: editForm.value.difficulty,
        lp21Refs,
        linkUrl: editForm.value.linkUrl || undefined,
        videoUrl: editForm.value.videoUrl || undefined,
        audioUrl: editForm.value.audioUrl || undefined,
        fileUrl: editForm.value.fileUrl,
        documentName: editForm.value.documentName,
    }

    if (editingId.value) {
        materialsStore.updateMaterial(editingId.value, materialData)
    } else {
        const newMaterial: Material = {
            id: `mat-${Date.now()}`,
            title: materialData.title || 'Neues Material',
            tags: materialData.tags || [],
            gradeRange: materialData.gradeRange || '3-6',
            formats: materialData.formats || ['PDF'],
            difficulty: materialData.difficulty || 'Mittel',
            lp21Refs: materialData.lp21Refs || [],
            description: materialData.description,
            phase: materialData.phase,
            linkUrl: materialData.linkUrl,
            videoUrl: materialData.videoUrl,
            audioUrl: materialData.audioUrl,
            fileUrl: materialData.fileUrl,
            documentName: materialData.documentName,
        }
        materialsStore.addMaterial(newMaterial)
    }

    showEditModal.value = false
}

// Delete
const showDeleteDialog = ref(false)
const deletingMaterial = ref<Material | null>(null)

function confirmDeletePrompt(mat: Material) {
    deletingMaterial.value = mat
    showDeleteDialog.value = true
}

function confirmDelete() {
    if (deletingMaterial.value) {
        materialsStore.deleteMaterial(deletingMaterial.value.id)
    }
    showDeleteDialog.value = false
}

function formatDate(date?: string) {
    if (!date) return null
    return new Date(date).toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function getFormatIcon(format: MaterialFormat) {
    switch (format) {
        case 'PDF':
            return FileText
        case 'DOCX':
            return File
        case 'Video':
            return Video
        case 'Audio':
            return Headphones
        case 'Link':
            return Link
        default:
            return File
    }
}
</script>

<template>
    <div>
        <div class="mb-6 flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Lehrmaterial</h1>
                <p class="text-sm text-gray-500 mt-1">Arbeitsblätter finden, bearbeiten, hochladen und LP21-Fortschritt tracken</p>
            </div>
            <UButton color="primary" @click="openCreate">
                <Plus :size="16" class="mr-1" /> Neues Material
            </UButton>
        </div>

        <!-- Filters -->
        <div class="mb-6 space-y-3">
            <div class="flex flex-wrap gap-3">
                <USelect v-model="materialsStore.filterTag" :items="tagOptions" class="w-40" />
                <USelect v-model="materialsStore.filterGrade" :items="gradeOptions" class="w-32" />
                <USelect v-model="materialsStore.filterPhase" :items="phaseOptions" class="w-40" />
                <USelect v-model="materialsStore.filterFormat" :items="formatOptions" class="w-32" />
            </div>
            <UInput v-model="materialsStore.searchQuery" placeholder="Suche nach Titel oder Beschreibung..." class="max-w-md">
                <template #leading>
                    <Search :size="16" class="text-gray-400" />
                </template>
            </UInput>
            <p class="text-sm text-gray-500">
                Ergebnisse: <strong>{{ materialsStore.filteredMaterials.length }}</strong> Materialien
            </p>
        </div>

        <!-- Material cards -->
        <div class="space-y-4">
            <UCard v-for="mat in materialsStore.filteredMaterials" :key="mat.id">
                <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div class="flex-1">
                        <h3 class="font-semibold mb-1">{{ mat.title }}</h3>
                        <p v-if="mat.description" class="text-sm text-gray-500 mb-2">{{ mat.description }}</p>
                        <div class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-2">
                            <span>Stufe: <strong>{{ mat.gradeRange }}</strong></span>
                            <span v-if="mat.phase">Phase: <strong>{{ mat.phase }}</strong></span>
                            <span>Format: <strong>{{ mat.formats.join(' + ') }}</strong></span>
                            <span>Schwierigkeit: <strong>{{ mat.difficulty }}</strong></span>
                        </div>
                        <div class="flex flex-wrap gap-1 mb-2">
                            <UBadge v-for="tag in mat.tags" :key="tag" color="neutral" variant="subtle" size="xs">
                                {{ tag }}
                            </UBadge>
                            <UBadge v-for="lp21Ref in mat.lp21Refs" :key="lp21Ref" color="primary" variant="subtle" size="xs">
                                {{ lp21Ref }}
                            </UBadge>
                        </div>
                        <div class="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                            <p v-if="mat.lastDownloaded">
                                Zuletzt heruntergeladen: {{ formatDate(mat.lastDownloaded) }}
                            </p>
                            <p v-else class="italic">Noch nicht heruntergeladen</p>
                            <span v-if="mat.documentName" class="flex items-center gap-1 text-green-600">
                                <FileText :size="12" /> {{ mat.documentName }}
                            </span>
                        </div>
                    </div>
                    <div class="flex flex-col gap-2 shrink-0">
                        <div class="flex gap-2 flex-wrap">
                            <UButton
                                v-for="format in mat.formats"
                                :key="format"
                                size="sm"
                                variant="soft"
                                color="primary"
                                @click="startDownload(mat, format)"
                            >
                                <component :is="getFormatIcon(format)" :size="14" class="mr-1" /> {{ format }}
                            </UButton>
                        </div>
                        <div class="flex gap-1 justify-end">
                            <UButton size="xs" variant="ghost" color="neutral" @click="openEdit(mat)">
                                <Pencil :size="14" class="mr-1" /> Bearbeiten
                            </UButton>
                            <UButton size="xs" variant="ghost" color="neutral" @click="confirmDeletePrompt(mat)">
                                <Trash2 :size="14" class="mr-1" /> Löschen
                            </UButton>
                        </div>
                    </div>
                </div>
            </UCard>
        </div>

        <!-- Download confirmation dialog -->
        <UModal v-model:open="showDownloadDialog">
            <template #content>
                <div class="p-6">
                    <h3 class="text-lg font-semibold mb-2">Download</h3>
                    <p class="text-sm text-gray-500 mb-1" v-if="downloadMaterial">
                        Material: <strong>{{ downloadMaterial.title }}</strong>
                    </p>
                    <p class="text-sm text-gray-500 mb-4">Format: {{ downloadFormat }}</p>
                    <p v-if="downloadMaterial?.documentName" class="text-sm text-gray-500 mb-4">
                        Datei: {{ downloadMaterial.documentName }}
                    </p>
                    <div v-if="downloadMaterial?.lp21Refs.length" class="mb-4">
                        <p class="text-sm font-medium mb-2">Folgende LP21-Ziele werden als &laquo;behandelt&raquo; markiert:</p>
                        <ul class="space-y-1">
                            <li v-for="lp21Ref in downloadMaterial!.lp21Refs" :key="lp21Ref" class="flex items-center gap-2 text-sm">
                                <input type="checkbox" checked disabled class="text-green-600" />
                                <span>{{ lp21Ref }}</span>
                            </li>
                        </ul>
                    </div>
                    <div class="flex justify-end gap-2">
                        <UButton variant="ghost" color="neutral" @click="showDownloadDialog = false">Abbrechen</UButton>
                        <UButton color="primary" @click="confirmDownload">
                            <Download :size="14" class="mr-1" /> Herunterladen
                        </UButton>
                    </div>
                </div>
            </template>
        </UModal>

        <!-- Edit / Create modal -->
        <UModal v-model:open="showEditModal">
            <template #content>
                <div class="p-6 max-h-[80vh] overflow-y-auto">
                    <h3 class="text-lg font-semibold mb-4">
                        {{ editingId ? 'Material bearbeiten' : 'Neues Material erstellen' }}
                    </h3>

                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Titel *</label>
                            <UInput v-model="editForm.title" placeholder="Titel des Materials" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium mb-1">Beschreibung</label>
                            <UTextarea v-model="editForm.description" placeholder="Kurze Beschreibung..." :rows="2" />
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-sm font-medium mb-1">Stufe</label>
                                <USelect v-model="editForm.gradeRange" :items="editGradeOptions" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">Schwierigkeit</label>
                                <USelect v-model="editForm.difficulty" :items="difficultyOptions" />
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium mb-1">Phase</label>
                            <USelect v-model="editForm.phase" :items="editPhaseOptions" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium mb-1">Tags (kommagetrennt)</label>
                            <UInput v-model="editForm.tags" placeholder="z.B. Boden, Ökologie, Mathematik" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium mb-1">LP21-Referenzen (kommagetrennt)</label>
                            <UInput v-model="editForm.lp21Refs" placeholder="z.B. NMG.2.1, MA.2.A" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium mb-1">Formate</label>
                            <div class="flex flex-wrap gap-2">
                                <UButton
                                    v-for="f in allFormatChoices"
                                    :key="f"
                                    size="xs"
                                    :variant="editForm.formats.includes(f) ? 'solid' : 'outline'"
                                    :color="editForm.formats.includes(f) ? 'primary' : 'neutral'"
                                    @click="toggleFormat(f)"
                                >
                                    {{ f }}
                                </UButton>
                            </div>
                        </div>

                        <!-- Document upload -->
                        <div>
                            <label class="block text-sm font-medium mb-1">Dokument</label>
                            <div v-if="editForm.documentName" class="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <FileText :size="18" class="text-green-600 shrink-0" />
                                <span class="text-sm flex-1 truncate">{{ editForm.documentName }}</span>
                                <UButton size="xs" variant="ghost" color="neutral" @click="removeFile">
                                    <X :size="14" />
                                </UButton>
                            </div>
                            <div v-else class="flex items-center gap-2">
                                <UButton size="sm" variant="outline" color="neutral" @click="fileInput?.click()">
                                    <Upload :size="14" class="mr-1" /> Datei hochladen
                                </UButton>
                                <span class="text-xs text-gray-400">PDF, DOCX, oder andere Dateien</span>
                            </div>
                            <input
                                ref="fileInput"
                                type="file"
                                accept=".pdf,.docx,.doc,.xlsx,.xls,.pptx,.ppt,.txt,.csv,.zip"
                                class="hidden"
                                @change="handleFileUpload"
                            />
                        </div>

                        <!-- URL fields -->
                        <div v-if="editForm.formats.includes('Link')">
                            <label class="block text-sm font-medium mb-1">Link-URL</label>
                            <UInput v-model="editForm.linkUrl" placeholder="https://..." />
                        </div>
                        <div v-if="editForm.formats.includes('Video')">
                            <label class="block text-sm font-medium mb-1">Video-URL</label>
                            <UInput v-model="editForm.videoUrl" placeholder="https://..." />
                        </div>
                        <div v-if="editForm.formats.includes('Audio')">
                            <label class="block text-sm font-medium mb-1">Audio-URL</label>
                            <UInput v-model="editForm.audioUrl" placeholder="https://..." />
                        </div>
                    </div>

                    <div class="flex justify-end gap-2 mt-6">
                        <UButton variant="ghost" color="neutral" @click="showEditModal = false">Abbrechen</UButton>
                        <UButton color="primary" :disabled="!editForm.title.trim()" @click="saveForm">
                            {{ editingId ? 'Speichern' : 'Erstellen' }}
                        </UButton>
                    </div>
                </div>
            </template>
        </UModal>

        <!-- Delete confirmation dialog -->
        <UModal v-model:open="showDeleteDialog">
            <template #content>
                <div class="p-6">
                    <h3 class="text-lg font-semibold mb-2">Material löschen?</h3>
                    <p class="text-sm text-gray-500 mb-4">
                        Möchtest du <strong>{{ deletingMaterial?.title }}</strong> wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
                    </p>
                    <div class="flex justify-end gap-2">
                        <UButton variant="ghost" color="neutral" @click="showDeleteDialog = false">Abbrechen</UButton>
                        <UButton color="primary" variant="soft" @click="confirmDelete">Löschen</UButton>
                    </div>
                </div>
            </template>
        </UModal>
    </div>
</template>
