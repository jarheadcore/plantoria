import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Notification } from '@/types'
import { mockNotifications } from '@/data/mock/notifications'

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>(mockNotifications)

  const unreadCount = computed(() => notifications.value.filter((n) => !n.read).length)

  function markAsRead(id: string) {
    const n = notifications.value.find((notif) => notif.id === id)
    if (n) n.read = true
  }

  function markAllAsRead() {
    notifications.value.forEach((n) => (n.read = true))
  }

  return { notifications, unreadCount, markAsRead, markAllAsRead }
})
