<script setup lang="ts">
import { mockSubjects } from '@/data/mock/subjects'

definePageMeta({ layout: 'teacher' })
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Fachbereiche</h1>
      <p class="text-sm text-gray-500 mt-1">Strukturiertes Fachwissen nach Themengebiet</p>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        v-for="subject in mockSubjects"
        :key="subject.id"
        :to="`/teacher/subjects/${subject.id}`"
        class="block"
      >
        <UCard class="h-full hover:ring-2 hover:ring-green-200 dark:hover:ring-green-900 transition-all">
          <div class="text-center">
            <div class="mb-2 text-2xl">
              {{ subject.name === 'Boden' ? '🌍' :
                 subject.name === 'Fruchtfolge' ? '🔄' :
                 subject.name === 'Gemüsearten' ? '🥕' :
                 subject.name === 'Gesundheit' ? '💪' :
                 subject.name === 'Flächengestaltung' ? '📐' :
                 subject.name === 'Beetplanung' ? '🗺️' :
                 subject.name === 'Ernährung' ? '🍎' :
                 subject.name === 'Ökologie' ? '🌱' :
                 '📊' }}
            </div>
            <h3 class="font-semibold mb-1">{{ subject.name }}</h3>
            <p class="text-xs text-gray-500 mb-2">{{ subject.description }}</p>
            <UBadge color="neutral" variant="subtle" size="xs">
              {{ subject.materialCount }} Materialien
            </UBadge>
          </div>
        </UCard>
      </NuxtLink>
    </div>
  </div>
</template>
