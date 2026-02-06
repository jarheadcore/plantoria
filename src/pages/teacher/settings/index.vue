<script setup lang="ts">
import { useTeacherStore } from '@/stores/teacher'
import type { NotificationSettings } from '@/types'

definePageMeta({ layout: 'teacher' })

const teacherStore = useTeacherStore()

const activeTab = ref('profile')

const profileName = ref(teacherStore.teacher.name)
const profileEmail = ref(teacherStore.teacher.email)

const notificationSettings = ref<NotificationSettings[]>([
  { category: 'task_reminder', label: 'Aufgaben-Erinnerungen', inApp: true, email: false },
  { category: 'seasonal_hint', label: 'Saisonale Hinweise', inApp: true, email: false },
  { category: 'template_update', label: 'Template-Updates', inApp: true, email: false },
  { category: 'harvest_market', label: 'Harvest-Markt-Termine', inApp: true, email: true },
  { category: 'lp21_milestone', label: 'LP21-Meilensteine', inApp: true, email: false },
])
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Einstellungen</h1>
    </div>

    <!-- Tabs -->
    <div class="mb-6 flex gap-1 border-b border-gray-200 dark:border-gray-800">
      <button
        v-for="tab in [
          { key: 'profile', label: 'Profil' },
          { key: 'class', label: 'Klasse' },
          { key: 'notifications', label: 'Benachrichtigungen' },
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

    <!-- Profile -->
    <div v-if="activeTab === 'profile'">
      <UCard class="max-w-lg">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Name</label>
            <UInput v-model="profileName" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">E-Mail</label>
            <UInput v-model="profileEmail" type="email" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Schule</label>
            <UInput :model-value="teacherStore.school.name" disabled />
            <p class="text-xs text-gray-400 mt-1">Nicht editierbar</p>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Rolle</label>
            <UInput model-value="Lehrperson" disabled />
            <p class="text-xs text-gray-400 mt-1">Nicht editierbar</p>
          </div>
        </div>
        <div class="mt-6 flex gap-3">
          <UButton variant="soft" disabled>Passwort ändern</UButton>
          <UButton color="primary">Speichern</UButton>
        </div>
      </UCard>
    </div>

    <!-- Class -->
    <div v-if="activeTab === 'class'">
      <UCard class="max-w-lg">
        <h3 class="font-semibold mb-3">Aktive Klasse</h3>
        <div class="rounded-lg border border-green-200 bg-green-50/50 p-4 dark:border-green-900 dark:bg-green-950/20 mb-4">
          <div class="flex items-center justify-between mb-2">
            <span class="font-semibold text-lg">{{ teacherStore.activeClass.name }}</span>
            <UBadge color="success" variant="subtle" size="xs">Aktiv</UBadge>
          </div>
          <div class="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
            <span>Stufe: <strong>{{ teacherStore.activeClass.grade }}</strong></span>
            <span>Schüler: <strong>{{ teacherStore.activeClass.studentCount }}</strong></span>
            <span>Schuljahr: <strong>{{ teacherStore.activeClass.schoolYear }}</strong></span>
          </div>
          <NuxtLink to="/teacher/students" class="mt-2 inline-block text-sm text-green-600 hover:text-green-700">
            Schüler verwalten →
          </NuxtLink>
        </div>

        <h4 class="text-sm font-medium text-gray-500 mb-2">Weitere Klassen</h4>
        <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
          <div class="flex items-center justify-between">
            <div>
              <span class="font-medium">HE23b</span>
              <span class="text-sm text-gray-500 ml-2">Stufe: 5 | 12 Schüler</span>
            </div>
            <UButton size="sm" variant="soft" disabled>Wechseln</UButton>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Notifications -->
    <div v-if="activeTab === 'notifications'">
      <UCard class="max-w-lg">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr>
                <th class="pb-3 text-left text-sm font-semibold">Kategorie</th>
                <th class="pb-3 text-center text-sm font-semibold w-24">In-App</th>
                <th class="pb-3 text-center text-sm font-semibold w-24">E-Mail</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr v-for="setting in notificationSettings" :key="setting.category">
                <td class="py-3 text-sm">{{ setting.label }}</td>
                <td class="py-3 text-center">
                  <input
                    v-model="setting.inApp"
                    type="checkbox"
                    class="h-4 w-4 rounded text-green-600"
                  />
                </td>
                <td class="py-3 text-center">
                  <input
                    v-model="setting.email"
                    type="checkbox"
                    class="h-4 w-4 rounded text-green-600"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-4">
          <UButton color="primary">Speichern</UButton>
        </div>
      </UCard>
    </div>
  </div>
</template>
