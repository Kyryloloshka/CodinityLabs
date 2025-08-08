import type { Ref } from 'vue'

interface FileUploadOptions {
  fileInput: Ref<HTMLInputElement | undefined>
  codeEditor: Ref<any>
  props: {
    submissionCode: string
    selectedLanguage: string
  }
  emit: (event: string, value?: any) => void
}

export const useFileUpload = ({ fileInput, codeEditor, props, emit }: FileUploadOptions) => {
  const toast = useToast()

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

  return {
    handleFileUpload
  }
} 