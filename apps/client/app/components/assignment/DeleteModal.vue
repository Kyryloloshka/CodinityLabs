<template>
  <div v-if="isTeacher" class="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-6 mt-6">
    <div class="flex items-start">
      <UIcon name="i-heroicons-exclamation-triangle" class="h-6 w-6 text-red-600 dark:text-red-400 mt-0.5" />
      <div class="ml-3 flex-1">
        <h3 class="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
          Небезпечна зона
        </h3>
        <p class="text-sm text-red-700 dark:text-red-300 mb-4">
          Видалення завдання призведе до втрати всіх даних, включно з поданнями студентів. Ця дія незворотна.
        </p>
        <UModal v-model:open="open">
          <UButton
            variant="solid"
            :disabled="deleting"
            class="bg-red-600 text-white hover:bg-red-700"
          >
            <UIcon name="i-heroicons-trash" class="mr-2 h-4 w-4" />
            Видалити завдання
          </UButton>
          <template #content>
            <UCard>
              <template #header>
                <div class="flex items-center justify-between">
                  <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                    Підтвердження видалення
                  </h3>
                  <UButton
                    color="neutral"
                    variant="ghost"
                    icon="i-heroicons-x-mark-20-solid"
                    class="-my-1"
                    @click="closeModal"
                  />
                </div>
              </template>
              <div class="py-4">
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <UIcon 
                      name="i-heroicons-exclamation-triangle" 
                      class="h-6 w-6 text-red-600 dark:text-red-400" 
                    />
                  </div>
                  <div class="ml-3 w-0 flex-1">
                    <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Ви дійсно хочете видалити це завдання?
                    </h4>
                    <div class="text-sm text-gray-500 dark:text-gray-400 space-y-2">
                      <p><strong>Назва:</strong> {{ assignmentTitle }}</p>
                      <p class="text-red-600 dark:text-red-400 font-medium">
                        ⚠️ Ця дія незворотна. Усі подання студентів також будуть видалені.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <template #footer>
                <div class="flex justify-end gap-3">
                  <UButton
                    color="neutral"
                    variant="solid"
                    @click="closeModal"
                    :disabled="deleting"
                  >
                    Скасувати
                  </UButton>
                  <UButton
                    variant="solid"
                    @click="confirmDelete"
                    :loading="deleting"
                    :disabled="deleting"
                    class="bg-red-600 text-white hover:bg-red-700"
                  >
                    <UIcon name="i-heroicons-trash" class="mr-2 h-4 w-4" />
                    {{ deleting ? 'Видалення...' : 'Видалити' }}
                  </UButton>
                </div>
              </template>
            </UCard>
          </template>
        </UModal> 
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  assignmentTitle: string
  deleting: boolean
  isTeacher: boolean
}

interface Emits {
  (e: 'confirm'): void
}

const open = ref(false)



defineProps<Props>()
const emit = defineEmits<Emits>()

const closeModal = () => {
  open.value = false
}

const confirmDelete = () => {
  open.value = false
  emit('confirm')
}
</script>