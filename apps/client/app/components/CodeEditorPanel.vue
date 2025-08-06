<template>
  <div class="w-full h-full bg-theme-card border-r border-theme-primary flex flex-col transition-colors duration-300">
    <div class="border-b border-theme-primary p-3">
      <div class="flex items-center gap-2">
        <UButton
          @click="triggerFileUpload"
          variant="outline"
          color="primary"
          size="xs"
          class="flex items-center gap-1"
        >
          <UIcon name="i-heroicons-arrow-up-tray" class="h-3 w-3" />
          Завантажити файл
        </UButton>
        <span class="text-xs text-theme-secondary">
          (.ts, .js)
        </span>
      </div>
      <input
        ref="fileInput"
        type="file"
        accept=".ts,.js"
        @change="handleFileUpload"
        class="hidden"
      />
    </div>

    <div class="flex-1">
      <ClientOnly>
        <CodeEditor
          ref="codeEditor"
          :model-value="submissionCode"
          @update:model-value="$emit('update:submissionCode', $event)"
          :language="selectedLanguage"
          class="w-full h-full"
          placeholder="// Введіть ваш код тут..."
        />
      </ClientOnly>
    </div>
    
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
  (e: 'update:language', value: string): void
  (e: 'programmaticLanguageChange', value: string): void
  (e: 'fileUploadStart'): void
  (e: 'fileUploadEnd'): void
  (e: 'testCode'): void
  (e: 'submitSolution'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const fileInput = ref<HTMLInputElement>()
const codeEditor = ref<any>()
const toast = useToast()

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) {
    emit('fileUploadEnd')
    return
  }
  
  // Перевіряємо розширення файлу
  const fileName = file.name.toLowerCase()
  if (!fileName.endsWith('.ts') && !fileName.endsWith('.js')) {
    toast.add({
      title: 'Помилка',
      description: 'Підтримуються тільки файли .ts та .js',
      color: 'error'
    })
    emit('fileUploadEnd')
    return
  }
  
  // Повідомляємо про початок завантаження файлу
  emit('fileUploadStart')
  
  const reader = new FileReader()
  
  reader.onload = (e) => {
    const content = e.target?.result as string
    
    if (content) {
      // Визначаємо нову мову на основі розширення файлу
      const newLanguage = fileName.endsWith('.ts') ? 'typescript' : 'javascript'
      
      // Використовуємо прямий доступ до редактора для одночасного оновлення мови та контенту
      if (codeEditor.value && codeEditor.value.setLanguageAndValue) {
        setTimeout(() => {
          // Оновлюємо мову та контент з затримкою
          nextTick(() => {
            if (newLanguage !== props.selectedLanguage) {
              emit('programmaticLanguageChange', newLanguage)
            }
            emit('update:submissionCode', content)
            codeEditor.value.setLanguageAndValue(newLanguage, content)
          })
          
          // Завершуємо завантаження файлу після затримки
          setTimeout(() => {
            emit('fileUploadEnd')
          }, 50)
        }, 100)
        
      } else {
        // Fallback: якщо прямий доступ недоступний, використовуємо старий підхід
        nextTick(() => {
          if (newLanguage !== props.selectedLanguage) {
            emit('update:language', newLanguage)
          }
          emit('update:submissionCode', content)
        })
        
        // Завершуємо завантаження файлу після затримки
        setTimeout(() => {
          emit('fileUploadEnd')
        }, 50)
      }
      
      toast.add({
        title: 'Успішно',
        description: `Файл "${file.name}" завантажено`,
        color: 'success'
      })
    }
  }
  
  reader.onerror = () => {
    toast.add({
      title: 'Помилка',
      description: 'Помилка читання файлу',
      color: 'error'
    })
    // Повідомляємо про завершення завантаження файлу (навіть при помилці)
    emit('fileUploadEnd')
  }
  
  reader.readAsText(file)
  
  // Очищаємо input для можливості повторного завантаження того ж файлу
  target.value = ''
}
</script> 