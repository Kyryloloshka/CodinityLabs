<template>
  <div class="">
    <div v-if="loading" class="flex justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto"></div>
        <p class="mt-4 text-sm text-theme-secondary">Завантаження завдання...</p>
      </div>
    </div>

    <div v-else-if="error" class="bg-error border border-error rounded-lg p-4">
      <div class="flex">
        <UIcon name="i-heroicons-exclamation-triangle" class="h-5 w-5 text-error" />
        <div class="ml-3">
          <h3 class="text-sm font-medium text-error">Помилка завантаження</h3>
          <p class="mt-1 text-sm text-error-light">{{ error }}</p>
        </div>
      </div>
    </div>

    <div v-else-if="assignment" class="max-w-4xl mx-auto">
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-theme-primary">{{ assignment.title }}</h1>
            <div class="flex items-center gap-4 mt-2 text-sm text-theme-secondary">
              <UBadge color="secondary" variant="subtle">
                Складність: {{ assignment.difficulty }}/10
              </UBadge>
              <span>Дедлайн: {{ formatDate(assignment.deadline) }}</span>
              <span>{{ assignment._count.submissions }} подань</span>
            </div>
          </div>
          
          <div class="flex gap-2">
            <UButton to="/assignments" variant="ghost" color="neutral" class="text-theme-primary hover:bg-theme-hover">
              <UIcon name="i-heroicons-arrow-left" class="mr-2 h-4 w-4" />
              Назад
            </UButton>
            
            <template v-if="!isTeacher && authStore.isAuthenticated">
              <UButton
                @click="navigateTo(`/assignments/${assignmentId}/submit`)"
                variant="solid"
                color="success"
                class="text-theme-primary cursor-pointer"
              >
                <UIcon name="i-heroicons-paper-airplane" class="mr-2 h-4 w-4" />
                Здати рішення
              </UButton>
            </template>
            
            <template v-if="!authStore.isAuthenticated">
              <UButton
                @click="loginToSubmit"
                variant="solid"
                color="primary"
              >
                <UIcon name="i-heroicons-arrow-right-on-rectangle" class="mr-2 h-4 w-4" />
                Увійти для подання
              </UButton>
            </template>
            
            <template v-if="isTeacher">
              <UButton
                @click="editAssignment"
                variant="solid"
                color="warning"
              >
                <UIcon name="i-heroicons-pencil" class="mr-2 h-4 w-4" />
                Редагувати
              </UButton>
            </template>
          </div>
        </div>
      </div>

      <div class="bg-theme-card shadow rounded-lg p-6 mb-6 border border-theme-primary">
        <h2 class="text-xl font-semibold text-theme-primary mb-4">Опис завдання</h2>
        <div class="prose max-w-none">
          <p class="text-theme-primary whitespace-pre-wrap">{{ assignment.description }}</p>
        </div>
      </div>

      <div class="bg-theme-card shadow rounded-lg p-6 mb-6 border border-theme-primary">
        <h2 class="text-xl font-semibold text-theme-primary mb-4">Тестові випадки</h2>
        <div class="grid gap-4">
          <div
            v-for="(testCase, index) in assignment.testCases"
            :key="testCase.id"
            class="border border-theme-primary rounded-lg p-4 bg-theme-secondary"
          >
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-medium text-theme-primary">Тест {{ index + 1 }}</h3>
              <UBadge color="primary" variant="subtle">Тестовий випадок</UBadge>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <label class="block text-sm font-medium text-theme-secondary mb-1">Опис</label>
                <div class="bg-theme-input p-2 rounded border border-theme-primary text-theme-primary">{{ testCase.description }}</div>
              </div>
              <div>
                <label class="block text-sm font-medium text-theme-secondary mb-1">Вхідні дані</label>
                <div class="bg-theme-input p-2 rounded border border-theme-primary font-mono text-theme-primary">{{ testCase.input }}</div>
              </div>
              <div>
                <label class="block text-sm font-medium text-theme-secondary mb-1">Очікуваний результат</label>
                <div class="bg-theme-input p-2 rounded border border-theme-primary font-mono text-theme-primary">{{ testCase.expected }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Подання студентів (тільки для викладачів) -->
      <div v-if="isTeacher" class="bg-theme-card shadow rounded-lg p-6 border border-theme-primary">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-theme-primary">Статистика подань</h2>
          <UButton
            :to="`/assignments/${assignmentId}/user-submissions`"
            variant="solid"
            color="info"
            class="text-theme-primary"
          >
            <UIcon name="i-heroicons-chart-bar" class="mr-2 h-4 w-4" />
            Переглянути статистику
          </UButton>
        </div>
        
        <div class="text-center py-8">
          <UIcon name="i-heroicons-chart-bar" class="mx-auto h-12 w-12 text-theme-muted" />
          <h3 class="mt-2 text-sm font-medium text-theme-primary">Статистика подань</h3>
          <p class="mt-1 text-sm text-theme-secondary">
            Натисніть кнопку вище, щоб переглянути детальну статистику по всім студентам
          </p>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'redirect-after-auth'
})

const route = useRoute()
const authStore = useAuthStore()
const { getAssignment, getAssignmentForStudent, getAssignmentForTeacher } = useAssignments()
const toast = useToast()

const assignment = ref<any>(null)
const loading = ref(true)
const error = ref('')

const isTeacher = computed(() => authStore.user?.role === 'TEACHER')
const assignmentId = computed(() => route.params.id as string)

const loadAssignment = async () => {
  try {
    loading.value = true
    error.value = ''
    
    if (authStore.isAuthenticated) {
      if (isTeacher.value) {
        assignment.value = await getAssignmentForTeacher(assignmentId.value)
      } else {
        assignment.value = await getAssignmentForStudent(assignmentId.value)
      }
    } else {
      assignment.value = await getAssignmentForStudent(assignmentId.value)
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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const editAssignment = () => {
      navigateTo(`/assignments/${assignmentId.value}/edit`)
}

const loginToSubmit = () => {
  // Зберігаємо поточну сторінку для редіректу після авторизації
  if (import.meta.client) {
    sessionStorage.setItem('redirectAfterAuth', `/assignments/${assignmentId.value}/submit`)
  }
  navigateTo('/login')
}


// Завантаження даних при монтуванні
onMounted(() => {
  loadAssignment()
})
</script> 