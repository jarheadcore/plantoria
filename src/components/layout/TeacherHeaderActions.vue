<script setup lang="ts">
import { Bell, ChevronDown } from 'lucide-vue-next'
import { useNotificationsStore } from '@/stores/notifications'
import { useTeacherStore } from '@/stores/teacher'
import { useAuthStore } from '@/stores/auth'

const notifStore = useNotificationsStore()
const teacherStore = useTeacherStore()
const authStore = useAuthStore()

const showNotifications = ref(false)

function handleLogout() {
  authStore.logout()
  navigateTo('/login')
}

const classOptions = computed(() =>
  teacherStore.availableClasses.map((c) => ({
    label: `${c.name} (Stufe ${c.grade})`,
    value: c.id,
  })),
)

const selectedClassId = computed({
  get: () => teacherStore.activeClass.id,
  set: (val: string) => teacherStore.switchClass(val),
})
</script>

<template>
  <div class="flex items-center gap-3">
    <!-- Class switcher -->
    <div v-if="classOptions.length > 1" class="hidden sm:block">
      <USelect
        :model-value="selectedClassId"
        @update:model-value="(val: string) => selectedClassId = val"
        :items="classOptions"
        size="sm"
        class="w-44"
      />
    </div>

    <!-- Notifications -->
    <div class="relative">
      <UButton
        variant="ghost"
        color="neutral"
        size="sm"
        @click="showNotifications = !showNotifications"
      >
        <Bell :size="20" />
        <span
          v-if="notifStore.unreadCount > 0"
          class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white"
        >
          {{ notifStore.unreadCount }}
        </span>
      </UButton>

      <!-- Notification dropdown -->
      <div
        v-if="showNotifications"
        class="absolute right-0 top-full mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900 z-50"
      >
        <div class="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
          <span class="font-semibold text-sm">Benachrichtigungen</span>
          <button
            class="text-xs text-green-600 hover:text-green-700"
            @click="notifStore.markAllAsRead()"
          >
            Alle gelesen
          </button>
        </div>
        <ul class="max-h-80 overflow-y-auto">
          <li
            v-for="n in notifStore.notifications.slice(0, 5)"
            :key="n.id"
            :class="[
              'border-b border-gray-100 px-4 py-3 text-sm dark:border-gray-800',
              !n.read ? 'bg-green-50/50 dark:bg-green-950/20' : '',
            ]"
          >
            <NuxtLink
              :to="n.link || '#'"
              class="block"
              @click="notifStore.markAsRead(n.id); showNotifications = false"
            >
              <p :class="['font-medium', !n.read ? 'text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400']">
                {{ n.title }}
              </p>
              <p class="text-xs text-gray-500 mt-0.5">{{ n.description }}</p>
            </NuxtLink>
          </li>
        </ul>
        <div class="border-t border-gray-200 px-4 py-2 dark:border-gray-700">
          <NuxtLink
            to="/teacher/settings"
            class="text-xs text-green-600 hover:text-green-700"
            @click="showNotifications = false"
          >
            Alle anzeigen
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Avatar dropdown -->
    <UDropdownMenu
      :items="[
        [{ label: 'Profil', to: '/teacher/settings' }],
        [{ label: 'Logout', onSelect: handleLogout }],
      ]"
    >
      <UButton variant="ghost" color="neutral" size="sm" class="gap-2">
        <div class="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700 text-sm font-semibold">
          AM
        </div>
        <span class="hidden sm:inline text-sm">{{ teacherStore.teacher.name }}</span>
      </UButton>
    </UDropdownMenu>
  </div>
</template>
