<template>
  <div class="mb-6 flex flex-col sm:flex-row gap-4">
    <div class="flex-1">
      <input
        v-model="searchQuery"
        placeholder="Пошук завдань..."
        icon="i-heroicons-magnifying-glass"
        class="min-w-64 px-2 text-sm py-1 h-8 border border-theme-secondary rounded-md shadow-sm bg-theme-input text-theme-primary focus:outline-none focus:ring-0"
      />
    </div>
    <div class="flex gap-2">
      <UButton
        v-if="hasActiveFilters"
        @click="$emit('clear')"
        variant="ghost"
        color="neutral"
        class="self-start text-sm px-2 border border-theme-secondary rounded-md shadow-sm bg-theme-input text-theme-primary focus:outline-none focus:ring-0 h-8 w-8 flex items-center justify-center"
      >
        <UIcon name="i-heroicons-x-mark" class="h-4 w-4 text-theme-primary" />
      </UButton>
      <select
        v-model="difficultyFilter"
        class="w-40 py-1 flex items-center h-8 self-start text-sm px-2 border border-theme-secondary rounded-md shadow-sm bg-theme-input text-theme-primary focus:outline-none focus:ring-0"
      >
        <option value="">Всі складності</option>
        <option value="1">Складність 1</option>
        <option value="2">Складність 2</option>
        <option value="3">Складність 3</option>
        <option value="4">Складність 4</option>
        <option value="5">Складність 5</option>
        <option value="6">Складність 6</option>
        <option value="7">Складність 7</option>
        <option value="8">Складність 8</option>
        <option value="9">Складність 9</option>
        <option value="10">Складність 10</option>
      </select>
      <select
        v-model="statusFilter"
        class="w-40 py-1 flex items-center h-8 self-start text-sm px-2 border border-theme-secondary rounded-md shadow-sm bg-theme-input text-theme-primary focus:outline-none focus:ring-0"
      >
        <option value="">Всі статуси</option>
        <option value="active">Активні</option>
        <option value="completed">Завершені</option>
      </select>
    </div>
  </div>

  <div v-if="hasActiveFilters" class="mb-4 text-sm text-theme-secondary">
    Знайдено {{ totalItems }} завдань
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: {
    searchQuery: string
    difficultyFilter: string
    statusFilter: string
  }
  totalItems: number
}

interface Emits {
  (e: 'update:modelValue', value: { searchQuery: string; difficultyFilter: string; statusFilter: string }): void
  (e: 'clear'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const searchQuery = computed({
  get: () => props.modelValue.searchQuery,
  set: (value) => emit('update:modelValue', { ...props.modelValue, searchQuery: value })
})

const difficultyFilter = computed({
  get: () => props.modelValue.difficultyFilter,
  set: (value) => emit('update:modelValue', { ...props.modelValue, difficultyFilter: value })
})

const statusFilter = computed({
  get: () => props.modelValue.statusFilter,
  set: (value) => emit('update:modelValue', { ...props.modelValue, statusFilter: value })
})

const hasActiveFilters = computed(() => {
  return searchQuery.value || difficultyFilter.value || statusFilter.value
})
</script> 