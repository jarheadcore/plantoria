import { useAuthStore } from '@/stores/auth'

export default defineNuxtRouteMiddleware((to) => {
    // Auth state lives in localStorage/sessionStorage — not available during SSR.
    // Skip on server to avoid false redirects and hydration mismatches.
    if (import.meta.server) return

    const authStore = useAuthStore()
    authStore.init()

    // v1.0.0: Auth-Check deaktiviert – alle Routen offen
    // Login-Maske und Verlinkungen bleiben erhalten
})
