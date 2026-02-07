<script setup lang="ts">
import { ref } from 'vue'
import { LayoutDashboard, FolderKanban, FileDown, Users, CalendarDays, BookOpen, Settings, HelpCircle, LogOut, Menu, X } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const sidebarOpen = ref(false)
const authStore = useAuthStore()

const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/teacher' },
    { label: 'Projekte', icon: FolderKanban, to: '/teacher/projects' },
    { label: 'Material', icon: FileDown, to: '/teacher/materials' },
    { label: 'Schüler & Gruppen', icon: Users, to: '/teacher/students' },
    { label: 'Kalender', icon: CalendarDays, to: '/teacher/calendar' },
    { label: 'Tagebuch', icon: BookOpen, to: '/tagebuch' },
]

function handleLogout() {
    authStore.logout()
    navigateTo('/login')
}

const route = useRoute()

function isActive(to: string) {
    if (to === '/teacher') return route.path === '/teacher'
    if (to === '/tagebuch') return route.path.startsWith('/tagebuch')
    return route.path.startsWith(to)
}

function closeSidebar() {
    sidebarOpen.value = false
}
</script>

<template>
    <div class="flex h-screen bg-gray-50 dark:bg-gray-950">
        <!-- Mobile overlay -->
        <div v-if="sidebarOpen" class="fixed inset-0 z-40 bg-black/50 lg:hidden" @click="closeSidebar" />

        <!-- Sidebar -->
        <aside
            :class="[
                'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 transition-all duration-200',
                'w-64 xl:w-64 lg:w-16 lg:hover:w-64',
                sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
            ]"
            @mouseenter="() => {}"
        >
            <!-- Logo -->
            <div class="flex h-16 items-center gap-3 border-b border-gray-200 px-4 dark:border-gray-800">
                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-600 text-white font-bold text-sm">P</div>
                <span class="text-lg font-bold text-green-700 dark:text-green-400 lg:hidden lg:group-hover:inline xl:inline sidebar-label">
                    PLANTORIA
                </span>
            </div>

            <!-- Navigation -->
            <nav class="flex-1 overflow-y-auto px-2 py-4">
                <ul class="space-y-1">
                    <li v-for="item in navItems" :key="item.to">
                        <NuxtLink
                            :to="item.to"
                            :class="[
                                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                                isActive(item.to)
                                    ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200',
                            ]"
                            @click="closeSidebar"
                        >
                            <component :is="item.icon" :size="20" class="shrink-0" />
                            <span class="sidebar-label lg:hidden lg:group-hover:inline xl:inline">{{ item.label }}</span>
                        </NuxtLink>
                    </li>
                </ul>
            </nav>

            <!-- Bottom actions -->
            <div class="border-t border-gray-200 px-2 py-4 dark:border-gray-800">
                <ul class="space-y-1">
                    <li>
                        <NuxtLink
                            to="/teacher/help"
                            :class="[
                                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                                isActive('/teacher/help')
                                    ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800',
                            ]"
                            @click="closeSidebar"
                        >
                            <HelpCircle :size="20" class="shrink-0" />
                            <span class="sidebar-label lg:hidden lg:group-hover:inline xl:inline">Hilfe</span>
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink
                            to="/teacher/settings"
                            :class="[
                                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                                isActive('/teacher/settings')
                                    ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800',
                            ]"
                            @click="closeSidebar"
                        >
                            <Settings :size="20" class="shrink-0" />
                            <span class="sidebar-label lg:hidden lg:group-hover:inline xl:inline">Einstellungen</span>
                        </NuxtLink>
                    </li>
                    <li>
                        <button
                            class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-red-600 dark:text-gray-400 dark:hover:bg-gray-800"
                            @click="handleLogout"
                        >
                            <LogOut :size="20" class="shrink-0" />
                            <span class="sidebar-label lg:hidden lg:group-hover:inline xl:inline">Logout</span>
                        </button>
                    </li>
                </ul>
            </div>
        </aside>

        <!-- Main content -->
        <div class="flex flex-1 flex-col lg:pl-16 xl:pl-64">
            <!-- Header -->
            <header
                class="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 dark:border-gray-800 dark:bg-gray-900"
            >
                <div class="flex items-center gap-3">
                    <button class="lg:hidden" @click="sidebarOpen = !sidebarOpen">
                        <component :is="sidebarOpen ? X : Menu" :size="24" />
                    </button>
                </div>

                <div class="flex items-center gap-3">
                    <TeacherHeaderActions />
                </div>
            </header>

            <!-- Page content -->
            <main class="flex-1 overflow-y-auto p-4 sm:p-6">
                <slot />
            </main>
        </div>
    </div>
</template>

<style scoped>
aside:hover .sidebar-label {
    display: inline !important;
}
</style>
