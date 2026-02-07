<script setup lang="ts">
definePageMeta({ layout: 'teacher' })

const name = ref('')
const category = ref('Gemüse')
const difficulty = ref('Mittel')
const gradeRange = ref('3-6')
const duration = ref('1 Schuljahr')

const categoryOptions = [
    { label: 'Gemüse', value: 'Gemüse' },
    { label: 'Hochbeet', value: 'Hochbeet' },
    { label: 'Bienen', value: 'Bienen' },
    { label: 'Ökologie', value: 'Ökologie' },
    { label: 'Garten', value: 'Garten' },
    { label: 'Sonstiges', value: 'Sonstiges' },
]

const difficultyOptions = [
    { label: 'Einfach', value: 'Einfach' },
    { label: 'Mittel', value: 'Mittel' },
    { label: 'Schwer', value: 'Schwer' },
]

const router = useRouter()

function save() {
    router.push('/teacher/templates')
}
</script>

<template>
    <div>
        <div class="mb-4">
            <NuxtLink to="/teacher/templates" class="text-sm text-gray-500 hover:text-gray-700"> ← Templates </NuxtLink>
        </div>

        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Neues Template erstellen</h1>

        <UCard class="max-w-xl">
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-1">Name</label>
                    <UInput v-model="name" placeholder="z.B. Kräutergarten" />
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-1">Kategorie</label>
                        <USelect v-model="category" :items="categoryOptions" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">Schwierigkeit</label>
                        <USelect v-model="difficulty" :items="difficultyOptions" />
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-1">Stufe</label>
                        <UInput v-model="gradeRange" placeholder="z.B. 3-6" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">Dauer</label>
                        <UInput v-model="duration" placeholder="z.B. 1 Schuljahr" />
                    </div>
                </div>
            </div>

            <div class="mt-6 flex justify-between">
                <UButton variant="ghost" to="/teacher/templates">Abbrechen</UButton>
                <UButton color="primary" :disabled="!name" @click="save">Speichern</UButton>
            </div>
        </UCard>
    </div>
</template>
