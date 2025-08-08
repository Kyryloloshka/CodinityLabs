<template>
  <UButton
    :variant="variant"
    :color="color"
    :size="size"
    :loading="loading"
    :disabled="disabled"
    :class="customClass"
    @click="$emit('click')"
  >
    <UIcon v-if="icon" :name="icon" class="mr-1 h-3 w-3" />
    <slot />
  </UButton>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'solid' | 'outline' | 'ghost'
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  icon?: string
  customClass?: string
}

interface Emits {
  (e: 'click'): void
}

withDefaults(defineProps<Props>(), {
  variant: 'solid',
  color: 'primary',
  size: 'sm',
  loading: false,
  disabled: false
})

defineEmits<Emits>()
</script> 