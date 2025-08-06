<template>
  <div class="w-full h-full bg-theme-card border-r border-theme-primary overflow-y-auto transition-colors duration-300">
    <div v-if="loading" class="p-4">
      <div class="animate-pulse">
        <div class="h-3 bg-theme-tertiary rounded w-3/4 mb-3"></div>
        <div class="h-3 bg-theme-tertiary rounded w-1/2 mb-2"></div>
        <div class="h-3 bg-theme-tertiary rounded w-2/3 mb-2"></div>
        <div class="h-3 bg-theme-tertiary rounded w-1/3"></div>
      </div>
    </div>
    
    <div v-else-if="assignment" class="p-4">
      <div class="space-y-4">
        <!-- Problem Info -->
        <div>
          <div class="flex items-center gap-2 mb-2">
            <div class="text-xs text-theme-primary bg-theme-secondary rounded-full px-2 py-1">
              {{ assignment.difficulty }}/10
            </div>
            <span class="text-xs text-theme-secondary">{{ totalTestCasesCount || assignment.testCases.length }} тестів</span>
          </div>
          <p class="text-sm text-theme-primary leading-relaxed">{{ assignment.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  assignment?: any
  loading: boolean
  totalTestCasesCount?: number
}

defineProps<Props>()

</script> 