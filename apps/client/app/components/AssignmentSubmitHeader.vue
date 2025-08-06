<template>
  <div class="bg-theme-card border-b border-theme-primary px-4 py-3 transition-colors duration-300">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <UButton to="/assignments" variant="ghost" color="neutral" size="lg" class="p-2 hover:bg-theme-hover">
          <UIcon name="i-heroicons-arrow-left" class="h-4 w-4 text-theme-primary" />
        </UButton>
        <div>
          <h1 class="text-base font-semibold text-theme-primary">{{ assignment?.title || 'Завантаження...' }}</h1>
          <p class="text-xs text-theme-secondary">Здати рішення</p>
        </div>
      </div>
      
      <div class="flex items-center gap-2">
        <ThemeSwitcher />
        <select
          :value="selectedLanguage"
          @change="handleLanguageChange"
          class="px-2 py-1 text-xs border border-theme-secondary rounded-md bg-theme-input text-theme-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition-colors duration-200"
        >
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
        </select>
        
        <UButton
          @click="$emit('resetCode')"
          variant="ghost"
          color="neutral"
          size="xs"
          title="Скинути код"
        >
          <UIcon name="i-heroicons-arrow-path" class="h-3 w-3 text-theme-primary" />
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  assignment?: any
  selectedLanguage: string
}

interface Emits {
  (e: 'update:selectedLanguage', value: string): void
  (e: 'resetCode'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleLanguageChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:selectedLanguage', target.value)
}
</script> 