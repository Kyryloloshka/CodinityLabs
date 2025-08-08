<template>
  <div class="">
    <div class="max-w-4xl mx-auto">
      <AssignmentPageHeader
        title="Редагувати завдання"
        description="відредагуйте вже існуюче завдання"
      />

      <div class="flex gap-2 mb-6">
        <UButton to="/assignments" variant="ghost" color="neutral">
          <UIcon name="i-heroicons-arrow-left" class="mr-2 h-4 w-4" />
          Назад
        </UButton>
      </div>

      <UiLoadingSpinner 
        v-if="loading" 
        message="Завантаження завдання..." 
      />

      <UiErrorMessage 
        v-else-if="error" 
        :message="error" 
      />

      <AssignmentForm
        v-else-if="assignment"
        v-model="form"
        :saving="saving"
        submit-button-text="Оновити завдання"
        @submit="saveAssignment"
        @cancel="navigateTo('/assignments')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'teacher-only'
})

const route = useRoute()
const authStore = useAuthStore()
const { updateAssignment, getAssignment } = useAssignments()
const toast = useToast()

const assignment = ref<any>(null)
const loading = ref(true)
const error = ref('')
const saving = ref(false)

const form = ref({
  title: '',
  description: '',
  difficulty: 1,
  deadline: '',
  testCases: [] as { input: string; expected: string; description: string; isPublic: boolean }[],
  settings: {
    timeout: 2000,
    maxAttempts: null as number | null,
    passingThreshold: 80,
    allowPartialScore: false,
    strictMode: false,
    unlimitedAttempts: true
  }
})

const assignmentId = route.params.id as string

const loadAssignment = async () => {
  try {
    loading.value = true
    error.value = ''
    assignment.value = await getAssignment(assignmentId)
    
    form.value = {
      title: assignment.value.title,
      description: assignment.value.description,
      difficulty: assignment.value.difficulty,
      deadline: new Date(assignment.value.deadline).toISOString().slice(0, 16),
      testCases: assignment.value.testCases.map((tc: any) => ({
        input: tc.input,
        expected: tc.expected,
        description: tc.description,
        isPublic: tc.isPublic
      })),
      settings: assignment.value.settings || {
        timeout: 2000,
        maxAttempts: null,
        passingThreshold: 80,
        allowPartialScore: false,
        strictMode: false,
        unlimitedAttempts: true
      }
    }
  } catch (err: any) {
    error.value = 'Помилка завантаження завдання'
    console.error(err)
    
    if (err?.status === 404 || err?.statusCode === 404) {
      toast.add({
        title: 'Помилка',
        description: 'Таке завдання не доступне',
        color: 'error'
      })
      setTimeout(async () => {
        await navigateTo('/assignments')
      }, 2000)
      return
    }
    
    // Для інших помилок також показуємо повідомлення
    toast.add({
      title: 'Помилка',
      description: 'Помилка завантаження завдання',
      color: 'error'
    })
    setTimeout(async () => {
      await navigateTo('/assignments')
    }, 2000)
  } finally {
    loading.value = false
  }
}

const saveAssignment = async (formData: any) => {
  try {
    saving.value = true
    error.value = ''
    
    // Валідація
    if (!formData.title.trim()) {
      error.value = 'Назва завдання обов\'язкова'
      return
    }
    
    if (!formData.description.trim()) {
      error.value = 'Опис завдання обов\'язковий'
      return
    }
    
    if (formData.testCases.length === 0) {
      error.value = 'Додайте хоча б один тестовий випадок'
      return
    }
    
    // Перевіряємо, чи всі тестові випадки заповнені
    for (let i = 0; i < formData.testCases.length; i++) {
      const testCase = formData.testCases[i]
      if (testCase && (!testCase.input.trim() || !testCase.expected.trim() || !testCase.description.trim())) {
        error.value = `Тестовий випадок ${i + 1} має неповні дані`
        return
      }
    }
    
    const assignmentData = {
      ...formData,
      difficulty: Number(formData.difficulty),
      deadline: new Date(formData.deadline).toISOString(),
      teacherId: authStore.user!.id
    }

    await updateAssignment(assignmentId, assignmentData)

    // Перенаправляємо на сторінку завдань
    await navigateTo('/assignments')
  } catch (err: any) {
    console.error('Error updating assignment:', err)
    error.value = err?.data?.message || err?.message || 'Помилка оновлення завдання'
  } finally {
    saving.value = false
  }
}

// Завантаження даних при монтуванні
onMounted(() => {
  loadAssignment()
})
</script> 