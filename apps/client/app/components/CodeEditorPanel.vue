<template>
  <div class="w-full h-full bg-theme-card border-r border-theme-primary flex flex-col transition-colors duration-300">
    <div class="flex-1">
      <ClientOnly>
        <CodeEditor
          :model-value="submissionCode"
          @update:model-value="$emit('update:submissionCode', $event)"
          :language="selectedLanguage"
          class="w-full h-full"
          placeholder="// Введіть ваш код тут..."
        />
      </ClientOnly>
    </div>
    
    <!-- Action Buttons -->
    <div class="border-t border-theme-primary p-3">
      <div class="flex gap-2">
        <UButton
          @click="$emit('testCode')"
          variant="outline"
          color="primary"
          :loading="testing"
          :disabled="!submissionCode.trim()"
          class="flex-1 cursor-pointer"
          size="xs"
        >
          <UIcon name="i-heroicons-play" class="mr-1 h-3 w-3" />
          Перевірити
        </UButton>
        <UButton
          @click="$emit('submitSolution')"
          variant="solid"
          color="success"
          :loading="submitting"
          :disabled="!submissionCode.trim()"
          class="flex-1 text-theme-primary cursor-pointer"
          size="xs"
        >
          <UIcon name="i-heroicons-paper-airplane" class="mr-1 h-3 w-3" />
          Здати
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  submissionCode: string
  selectedLanguage: string
  testing: boolean
  submitting: boolean
}

interface Emits {
  (e: 'update:submissionCode', value: string): void
  (e: 'testCode'): void
  (e: 'submitSolution'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script> 