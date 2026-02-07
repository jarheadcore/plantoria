<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { Eye, EyeOff, Leaf, Mail, Lock, ArrowLeft, ChevronLeft, Sprout, Sun, Droplets } from 'lucide-vue-next'

definePageMeta({ layout: false, layoutTransition: false })

const authStore = useAuthStore()

// View state: 'login' | 'forgot' | 'forgot-sent'
const view = ref<'login' | 'forgot' | 'forgot-sent'>('login')

// Login form
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const error = ref('')
const loading = ref(false)

// Forgot password form
const resetEmail = ref('')
const resetError = ref('')
const resetLoading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true

  await new Promise((r) => setTimeout(r, 400))

  const success = authStore.login(email.value, password.value, rememberMe.value)
  if (success) {
    navigateTo('/teacher')
  } else {
    error.value = 'Ungültige E-Mail-Adresse oder Passwort.'
  }
  loading.value = false
}

async function handleResetPassword() {
  resetError.value = ''
  resetLoading.value = true

  await new Promise((r) => setTimeout(r, 500))

  const found = authStore.requestPasswordReset(resetEmail.value)
  if (found) {
    view.value = 'forgot-sent'
  } else {
    resetError.value = 'Kein Konto mit dieser E-Mail-Adresse gefunden.'
  }
  resetLoading.value = false
}

function goToForgot() {
  resetEmail.value = email.value
  resetError.value = ''
  view.value = 'forgot'
}

function goToLogin() {
  error.value = ''
  view.value = 'login'
}
</script>

<template>
  <div class="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
    <!-- Left: Decorative panel -->
    <div class="hidden lg:flex lg:w-[52%] bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 relative overflow-hidden">
      <!-- Decorative background shapes -->
      <div class="absolute inset-0">
        <div class="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white/[0.07] blur-3xl" />
        <div class="absolute bottom-20 -right-20 h-80 w-80 rounded-full bg-teal-400/[0.12] blur-3xl" />
        <div class="absolute top-1/3 left-1/2 h-64 w-64 rounded-full bg-emerald-300/[0.08] blur-2xl" />
        <div class="absolute bottom-1/3 left-1/4 h-40 w-40 rounded-full bg-white/[0.05] blur-xl" />
      </div>

      <!-- Subtle grid pattern overlay -->
      <div class="absolute inset-0 opacity-[0.03]" style="background-image: radial-gradient(circle at 1px 1px, white 1px, transparent 0); background-size: 40px 40px;" />

      <div class="relative z-10 flex flex-col justify-between p-14 text-white w-full">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm ring-1 ring-white/10">
            <Leaf :size="22" stroke-width="2.5" />
          </div>
          <span class="text-lg font-bold tracking-wider">PLANTORIA</span>
        </NuxtLink>

        <!-- Main content -->
        <div class="max-w-lg -mt-8">
          <h2 class="text-4xl font-extrabold leading-[1.15] mb-5 drop-shadow-sm">
            Der digitale Begleiter<br>für Ihren Schulgarten
          </h2>
          <p class="text-green-50/80 text-[15px] leading-relaxed max-w-md">
            Planen Sie Projekte, verwalten Sie Aufgaben und begleiten Sie Ihre Klasse durch alle Phasen
            des Schulgartens &mdash; von der Aussaat bis zur Ernte.
          </p>

          <!-- Feature list -->
          <div class="mt-10 flex flex-col gap-4">
            <div class="flex items-center gap-4 group">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10 backdrop-blur-sm transition-all group-hover:bg-white/15 shrink-0">
                <Sprout :size="18" />
              </div>
              <div>
                <span class="text-sm font-semibold">Projekte im Jahresrhythmus</span>
                <p class="text-xs text-green-100/60 mt-0.5">Von der Aussaat bis zur Ernte planen</p>
              </div>
            </div>
            <div class="flex items-center gap-4 group">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10 backdrop-blur-sm transition-all group-hover:bg-white/15 shrink-0">
                <Sun :size="18" />
              </div>
              <div>
                <span class="text-sm font-semibold">Lehrplan-21-Anbindung</span>
                <p class="text-xs text-green-100/60 mt-0.5">Automatische Kompetenz-Zuordnung</p>
              </div>
            </div>
            <div class="flex items-center gap-4 group">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10 backdrop-blur-sm transition-all group-hover:bg-white/15 shrink-0">
                <Droplets :size="18" />
              </div>
              <div>
                <span class="text-sm font-semibold">Ferienaufgaben & Erinnerungen</span>
                <p class="text-xs text-green-100/60 mt-0.5">Automatische E-Mail-Benachrichtigungen</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <p class="text-xs text-green-200/40">&copy; 2026 Plantoria &middot; Schulgarten-Management</p>
      </div>
    </div>

    <!-- Right: Login form -->
    <div class="flex flex-1 items-center justify-center px-6 py-12">
      <div class="w-full max-w-[420px]">
        <!-- Back to landing page -->
        <NuxtLink
          to="/"
          class="mb-8 inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors font-medium"
        >
          <ChevronLeft :size="16" />
          Zurück zur Startseite
        </NuxtLink>

        <!-- Mobile logo -->
        <div class="mb-10 text-center lg:hidden">
          <NuxtLink to="/" class="inline-block">
            <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25">
              <Leaf :size="28" stroke-width="2.5" />
            </div>
          </NuxtLink>
          <h1 class="text-xl font-bold text-green-700 dark:text-green-400 tracking-wide">PLANTORIA</h1>
          <p class="mt-1 text-sm text-gray-400">Schulgarten-Management</p>
        </div>

        <!-- Login View -->
        <div v-if="view === 'login'">
          <div class="mb-8">
            <h2 class="text-[28px] font-extrabold text-gray-900 dark:text-white tracking-tight">Willkommen zurück</h2>
            <p class="mt-2 text-[15px] text-gray-400">Melden Sie sich in Ihrem Konto an</p>
          </div>

          <form @submit.prevent="handleLogin" class="space-y-5">
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">E-Mail-Adresse</label>
              <UInput
                v-model="email"
                type="email"
                placeholder="name@schule.ch"
                required
                autofocus
                size="xl"
              >
                <template #leading>
                  <Mail :size="18" class="text-gray-400" />
                </template>
              </UInput>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Passwort</label>
              <UInput
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Passwort eingeben"
                required
                size="xl"
              >
                <template #leading>
                  <Lock :size="18" class="text-gray-400" />
                </template>
                <template #trailing>
                  <button
                    type="button"
                    class="text-gray-300 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                    @click="showPassword = !showPassword"
                    tabindex="-1"
                  >
                    <component :is="showPassword ? EyeOff : Eye" :size="18" />
                  </button>
                </template>
              </UInput>
            </div>

            <div class="flex items-center justify-between">
              <label class="flex items-center gap-2.5 cursor-pointer select-none group">
                <input
                  v-model="rememberMe"
                  type="checkbox"
                  class="h-[18px] w-[18px] rounded-md border-gray-300 text-green-600 focus:ring-green-500/30 focus:ring-offset-0 transition-colors"
                />
                <span class="text-sm text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">Angemeldet bleiben</span>
              </label>
              <button
                type="button"
                class="text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium transition-colors"
                @click="goToForgot"
              >
                Passwort vergessen?
              </button>
            </div>

            <Transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 -translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-1"
            >
              <div
                v-if="error"
                class="flex items-center gap-2.5 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600 dark:bg-red-950/50 dark:border-red-900/50 dark:text-red-400"
              >
                <div class="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50 shrink-0">
                  <span class="text-xs font-bold">!</span>
                </div>
                <span>{{ error }}</span>
              </div>
            </Transition>

            <UButton type="submit" color="primary" block size="xl" :loading="loading" class="font-semibold mt-2">
              Anmelden
            </UButton>
          </form>

          <div class="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
            <p class="text-center text-xs text-gray-300 dark:text-gray-600">
              Demo-Zugang: <span class="font-medium text-gray-400 dark:text-gray-500">anna.mueller@schule-aarau.ch</span> / <span class="font-medium text-gray-400 dark:text-gray-500">plantoria</span>
            </p>
          </div>
        </div>

        <!-- Forgot Password View -->
        <div v-else-if="view === 'forgot'">
          <button
            class="mb-6 flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors font-medium"
            @click="goToLogin"
          >
            <ArrowLeft :size="15" />
            Zurück zur Anmeldung
          </button>

          <div class="mb-8">
            <h2 class="text-[28px] font-extrabold text-gray-900 dark:text-white tracking-tight">Passwort zurücksetzen</h2>
            <p class="mt-2 text-[15px] text-gray-400">
              Geben Sie Ihre E-Mail-Adresse ein. Wir senden Ihnen einen Link zum Zurücksetzen.
            </p>
          </div>

          <form @submit.prevent="handleResetPassword" class="space-y-5">
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">E-Mail-Adresse</label>
              <UInput
                v-model="resetEmail"
                type="email"
                placeholder="name@schule.ch"
                required
                autofocus
                size="xl"
              >
                <template #leading>
                  <Mail :size="18" class="text-gray-400" />
                </template>
              </UInput>
            </div>

            <Transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 -translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-1"
            >
              <div
                v-if="resetError"
                class="flex items-center gap-2.5 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600 dark:bg-red-950/50 dark:border-red-900/50 dark:text-red-400"
              >
                <div class="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50 shrink-0">
                  <span class="text-xs font-bold">!</span>
                </div>
                <span>{{ resetError }}</span>
              </div>
            </Transition>

            <UButton type="submit" color="primary" block size="xl" :loading="resetLoading" class="font-semibold">
              Link senden
            </UButton>
          </form>
        </div>

        <!-- Forgot Password Success View -->
        <div v-else-if="view === 'forgot-sent'">
          <div class="text-center">
            <div class="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/20 ring-1 ring-green-200/50 dark:ring-green-800/30">
              <Mail :size="32" class="text-green-600 dark:text-green-400" />
            </div>
            <h2 class="text-[28px] font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">E-Mail gesendet</h2>
            <p class="text-[15px] text-gray-400 mb-1">
              Wir haben einen Link zum Zurücksetzen an
            </p>
            <p class="text-[15px] font-semibold text-gray-700 dark:text-gray-300 mb-6">
              {{ resetEmail }}
            </p>
            <p class="text-xs text-gray-300 dark:text-gray-600 mb-8">
              Prüfen Sie auch Ihren Spam-Ordner. Der Link ist 24 Stunden gültig.
            </p>
            <UButton color="primary" variant="soft" block size="xl" class="font-semibold" @click="goToLogin">
              Zurück zur Anmeldung
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
