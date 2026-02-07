import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types'
import { fixtureTeacher } from '@/data/fixtures/teacher'

export const useAuthStore = defineStore('auth', () => {
    // v1.0.0: Auth deaktiviert – immer eingeloggt als Fixture-User
    const isAuthenticated = ref(true)
    const currentUser = ref<User | null>(fixtureTeacher)
    const rememberMe = ref(false)

    function init() {
        // Kein Check nötig – immer authentifiziert
        isAuthenticated.value = true
        currentUser.value = fixtureTeacher
    }

    function login(_email: string, _password: string, remember: boolean): boolean {
        isAuthenticated.value = true
        currentUser.value = fixtureTeacher
        rememberMe.value = remember
        return true
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
