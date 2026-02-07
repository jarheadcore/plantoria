import { useAuthStore } from '@/stores/auth'

export default defineNuxtRouteMiddleware((to) => {
    // Auth state lives in localStorage/sessionStorage — not available during SSR.
    // Skip on server to avoid false redirects and hydration mismatches.
    if (import.meta.server) return

    const authStore = useAuthStore()
    authStore.init()

    const publicPaths = ['/', '/login', '/dashboard', '/infoscreen']
    const isPublic = publicPaths.some((p) => to.path === p || to.path.startsWith('/dashboard'))
        || to.path.startsWith('/tagebuch')

    if (!authStore.isAuthenticated && !isPublic) {
        return navigateTo('/login')
    }

    if (authStore.isAuthenticated && to.path === '/login') {
        return navigateTo('/teacher')
    }
})
