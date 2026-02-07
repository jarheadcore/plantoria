import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types'
import { fixtureTeacher } from '@/data/fixtures/teacher'

export const useAuthStore = defineStore('auth', () => {
    const isAuthenticated = ref(false)
    const currentUser = ref<User | null>(null)
    const rememberMe = ref(false)

    function init() {
        if (import.meta.client) {
            const stored = localStorage.getItem('plantoria_auth')
            const session = sessionStorage.getItem('plantoria_auth')
            if (stored === 'true' || session === 'true') {
                isAuthenticated.value = true
                currentUser.value = fixtureTeacher
                rememberMe.value = stored === 'true'
            }
        }
    }

    function login(email: string, password: string, remember: boolean): boolean {
        if (email === 'anna.mueller@schule-aarau.ch' && password === 'plantoria') {
            isAuthenticated.value = true
            currentUser.value = fixtureTeacher
            rememberMe.value = remember
            if (import.meta.client) {
                if (remember) {
                    localStorage.setItem('plantoria_auth', 'true')
                } else {
                    sessionStorage.setItem('plantoria_auth', 'true')
                    localStorage.removeItem('plantoria_auth')
                }
            }
            return true
        }
        return false
    }

    function logout() {
        isAuthenticated.value = false
        currentUser.value = null
        rememberMe.value = false
        if (import.meta.client) {
            localStorage.removeItem('plantoria_auth')
            sessionStorage.removeItem('plantoria_auth')
        }
    }

    function requestPasswordReset(email: string): boolean {
        // Fixture: only accept the known user email
        return email === 'anna.mueller@schule-aarau.ch'
    }

    return { isAuthenticated, currentUser, rememberMe, init, login, logout, requestPasswordReset }
})
