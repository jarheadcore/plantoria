import { useAuthStore } from '@/stores/auth'

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  authStore.init()

  const publicPaths = ['/', '/login', '/dashboard', '/infoscreen']
  const isPublic = publicPaths.some((p) => to.path === p || to.path.startsWith('/dashboard'))

  if (!authStore.isAuthenticated && !isPublic) {
    return navigateTo('/login')
  }

  if (authStore.isAuthenticated && to.path === '/login') {
    return navigateTo('/teacher')
  }
})
