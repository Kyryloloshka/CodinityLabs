<template>
  <div class="">
    <UiErrorMessage 
      v-if="error" 
      :message="error" 
    />

    <div class="max-w-4xl mx-auto">
      <AssignmentPageHeader
        :title="editingAssignment ? 'Редагувати завдання' : 'Створити завдання'"
        :description="editingAssignment ? 'відредагуйте вже існуюче завдання' : 'створіть нове завдання для студентів'"
      />

      <div class="flex gap-2 mb-6">
        <UButton to="/assignments" variant="ghost" color="neutral">
          <UIcon name="i-heroicons-arrow-left" class="mr-2 h-4 w-4" />
          Назад
        </UButton>
      </div>

      <AssignmentForm
        v-model="form"
        :saving="saving"
        :submit-button-text="editingAssignment ? 'Оновити завдання' : 'Створити завдання'"
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

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { createAssignment, updateAssignment, getAssignment } = useAssignments()

const saving = ref(false)
const editingAssignment = ref<any>(null)
const error = ref('')

const form = ref({
  title: '',
  description: '',
  difficulty: 1,
  deadline: '',
  testCases: [] as { input: string; expected: string; description: string; isPublic: boolean }[],
  settings: {
    timeout: 2000, // 2 секунди
    maxAttempts: null as number | null, // Необмежено за замовчуванням
    passingThreshold: 80, // 80%
    allowPartialScore: false,
    strictMode: false,
    unlimitedAttempts: true // Необмежено за замовчуванням
  }
})

const assignmentId = route.params.id as string
const isEditing = computed(() => !!assignmentId && assignmentId !== 'create')

const loadAssignment = async () => {
  if (!isEditing.value) return
  
  try {
    editingAssignment.value = await getAssignment(assignmentId)
    form.value = {
      title: editingAssignment.value.title,
      description: editingAssignment.value.description,
      difficulty: editingAssignment.value.difficulty,
      deadline: new Date(editingAssignment.value.deadline).toISOString().slice(0, 16),
      testCases: editingAssignment.value.testCases.map((tc: any) => ({
        input: tc.input,
        expected: tc.expected,
        description: tc.description,
        isPublic: tc.isPublic
      })),
      settings: editingAssignment.value.settings || {
        timeout: 2000,
        maxAttempts: null,
        passingThreshold: 80,
        allowPartialScore: false,
        strictMode: false,
        unlimitedAttempts: true
      }
    }
    
    // Встановлюємо unlimitedAttempts на основі maxAttempts
    if (form.value.settings.maxAttempts === null) {
      form.value.settings.unlimitedAttempts = true
      form.value.settings.maxAttempts = 3 // Значення за замовчуванням для відображення
    } else {
      form.value.settings.unlimitedAttempts = false
    }
  } catch (error) {
    console.error('Error loading assignment:', error)
    await router.push('/assignments')
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
    
    // Перевіряємо мінімум 3 публічних тести
    const publicTests = formData.testCases.filter((tc: any) => tc.isPublic)
    if (publicTests.length < 3) {
      error.value = 'Потрібно мінімум 3 публічних тести для завдання'
      return
    }
    
    const assignmentData = {
      ...formData,
      difficulty: Number(formData.difficulty),
      deadline: new Date(formData.deadline).toISOString(),
      settings: {
        timeout: formData.settings.timeout,
        maxAttempts: formData.settings.unlimitedAttempts ? null : formData.settings.maxAttempts,
        passingThreshold: formData.settings.passingThreshold,
        allowPartialScore: formData.settings.allowPartialScore,
        strictMode: formData.settings.strictMode
      },
      teacherId: authStore.user!.id
    }

    if (isEditing.value) {
      await updateAssignment(assignmentId, assignmentData)
    } else {
      await createAssignment(assignmentData)
    }

    // Перенаправляємо на сторінку завдань
    await navigateTo('/assignments')
  } catch (err: any) {
    console.error('Error saving assignment:', err)
    error.value = err?.data?.message || err?.message || 'Помилка збереження завдання'
  } finally {
    saving.value = false
  }
}

// Завантаження даних при монтуванні
onMounted(() => {
  loadAssignment()
})
</script> 