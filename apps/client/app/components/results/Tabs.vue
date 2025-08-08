<template>
  <div class="flex items-center border-b border-theme-primary mb-4">
    <button
      @click="$emit('update:activeTab', 'testCases')"
      class="flex items-center gap-1 px-3 py-2 text-xs font-medium transition-colors"
      :class="activeTab === 'testCases' 
        ? 'text-theme-primary border-b-2 border-theme-primary' 
        : 'text-theme-secondary hover:text-theme-primary'"
    >
      <UIcon name="i-heroicons-check-circle" class="h-3 w-3" />
      Тестові випадки
    </button>
    <button
      v-if="checkResults"
      @click="$emit('update:activeTab', 'results')"
      class="flex items-center gap-1 px-3 py-2 text-xs font-medium transition-colors"
      :class="activeTab === 'results' 
        ? 'text-theme-primary border-b-2 border-theme-primary' 
        : 'text-theme-secondary hover:text-theme-primary'"
    >
      <UIcon name="i-heroicons-chart-bar" class="h-3 w-3" />
      Результати
    </button>
    <button
      @click="$emit('update:activeTab', 'history')"
      class="flex items-center gap-1 px-3 py-2 text-xs font-medium transition-colors"
      :class="activeTab === 'history' 
        ? 'text-theme-primary border-b-2 border-theme-primary' 
        : 'text-theme-secondary hover:text-theme-primary'"
    >
      <UIcon name="i-heroicons-clock" class="h-3 w-3" />
      Історія
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  activeTab: string
  checkResults?: any
}

interface Emits {
  (e: 'update:activeTab', value: string): void
}

defineProps<Props>()
defineEmits<Emits>()
</script> 