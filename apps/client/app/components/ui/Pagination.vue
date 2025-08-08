<template>
  <div v-if="totalPages > 1" class="mt-8 flex items-center justify-between">
    <div class="text-sm text-theme-secondary">
      Показано {{ (currentPage - 1) * pageSize + 1 }}-{{ Math.min(currentPage * pageSize, totalItems) }} з {{ totalItems }} завдань
    </div>
    
    <div class="flex items-center gap-2">
      <UButton
        @click="$emit('prev')"
        :disabled="!hasPrev"
        variant="ghost"
        size="sm"
      >
        <UIcon name="i-heroicons-chevron-left" class="h-4 w-4" />
        Попередня
      </UButton>
      
      <div class="flex items-center gap-1">
        <UButton
          v-for="page in getVisiblePages()"
          :key="page"
          @click="$emit('page', page)"
          :variant="page === currentPage ? 'solid' : 'ghost'"
          color="primary"
          size="sm"
          class="w-8 h-8 hover:bg-theme-hover flex items-center justify-center"
        >
          {{ page }}
        </UButton>
      </div>
      
      <UButton
        @click="$emit('next')"
        :disabled="!hasNext"
        variant="ghost"
        size="sm"
      >
        Наступна
        <UIcon name="i-heroicons-chevron-right" class="h-4 w-4" />
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  hasNext: boolean
  hasPrev: boolean
}

interface Emits {
  (e: 'page', page: number): void
  (e: 'prev'): void
  (e: 'next'): void
}

const props = defineProps<Props>()

const getVisiblePages = () => {
  const pages: number[] = []
  const maxVisible = 5
  let start = Math.max(1, props.currentPage - Math.floor(maxVisible / 2))
  let end = Math.min(props.totalPages, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
}
</script> 