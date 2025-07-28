<template>
  <div class="px-4 py-6 sm:px-0">
    <!-- Заголовок сторінки -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">
        {{ isTeacher ? 'Мої завдання' : 'Доступні завдання' }}
      </h1>
      <p class="mt-2 text-gray-600">
        {{ isTeacher ? 'Керуйте створеними вами завданнями' : 'Переглядайте та виконуйте завдання від викладачів' }}
      </p>
    </div>

    <!-- Кнопка створення завдання для викладачів -->
    <div v-if="isTeacher" class="mb-6">
      <UButton
        @click="navigateTo('/assignments/create')"
        variant="solid"
        color="blue"
      >
        <UIcon name="i-heroicons-plus" class="mr-2 h-4 w-4" />
        Створити завдання
      </UButton>
    </div>

    <!-- Фільтри та пошук -->
    <div class="mb-6 flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <UInput
          v-model="searchQuery"
          placeholder="Пошук завдань..."
          icon="i-heroicons-magnifying-glass"
        />
      </div>
      <div class="flex gap-2">
        <USelect
          v-model="difficultyFilter"
          :options="difficultyOptions"
          placeholder="Складність"
          class="w-40"
        />
        <USelect
          v-model="statusFilter"
          :options="statusOptions"
          placeholder="Статус"
          class="w-40"
        />
      </div>
    </div>

    <!-- Завантаження -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p class="mt-4 text-sm text-gray-600">Завантаження завдань...</p>
      </div>
    </div>

    <!-- Помилка -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex">
        <UIcon name="i-heroicons-exclamation-triangle" class="h-5 w-5 text-red-400" />
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Помилка завантаження</h3>
          <p class="mt-1 text-sm text-red-700">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Список завдань -->
    <div v-else-if="filteredAssignments.length > 0" class="grid gap-6">
      <div
        v-for="assignment in filteredAssignments"
        :key="assignment.id"
        class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
      >
        <div class="px-6 py-4">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ assignment.title }}
                </h3>
                <UBadge
                  :color="getDifficultyColor(assignment.difficulty)"
                  variant="subtle"
                >
                  Складність: {{ assignment.difficulty }}/10
                </UBadge>
              </div>
              
              <p class="text-gray-600 mb-4 line-clamp-2">
                {{ assignment.description }}
              </p>
              
              <div class="flex items-center gap-6 text-sm text-gray-500">
                <div class="flex items-center">
                  <UIcon name="i-heroicons-calendar" class="mr-1 h-4 w-4" />
                  Дедлайн: {{ formatDate(assignment.deadline) }}
                </div>
                <div class="flex items-center">
                  <UIcon name="i-heroicons-document-text" class="mr-1 h-4 w-4" />
                  {{ assignment._count.submissions }} подань
                </div>
                <div class="flex items-center">
                  <UIcon name="i-heroicons-cube" class="mr-1 h-4 w-4" />
                  {{ assignment.testCases.length }} тестів
                </div>
              </div>
            </div>
            
            <div class="flex items-center gap-2 ml-4">
              <!-- Для студентів -->
              <template v-if="!isTeacher">
                <UButton
                  @click="viewAssignment(assignment)"
                  variant="ghost"
                  color="blue"
                >
                  <UIcon name="i-heroicons-eye" class="mr-1 h-4 w-4" />
                  Переглянути
                </UButton>
                <UButton
                  @click="submitAssignment(assignment)"
                  variant="solid"
                  color="green"
                >
                  <UIcon name="i-heroicons-paper-airplane" class="mr-1 h-4 w-4" />
                  Здати
                </UButton>
              </template>
              
              <!-- Для викладачів -->
              <template v-else>
                <UButton
                  @click="viewAssignment(assignment)"
                  variant="ghost"
                  color="blue"
                >
                  <UIcon name="i-heroicons-eye" class="mr-1 h-4 w-4" />
                  Переглянути
                </UButton>
                <UButton
                  @click="editAssignment(assignment)"
                  variant="ghost"
                  color="yellow"
                >
                  <UIcon name="i-heroicons-pencil" class="mr-1 h-4 w-4" />
                  Редагувати
                </UButton>
                <UButton
                  @click="deleteAssignment(assignment)"
                  variant="ghost"
                  color="red"
                >
                  <UIcon name="i-heroicons-trash" class="mr-1 h-4 w-4" />
                  Видалити
                </UButton>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Порожній стан -->
    <div v-else class="text-center py-12">
      <UIcon name="i-heroicons-document-text" class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900">
        {{ isTeacher ? 'У вас немає створених завдань' : 'Немає доступних завдань' }}
      </h3>
      <p class="mt-1 text-sm text-gray-500">
        {{ isTeacher ? 'Створіть перше завдання для студентів' : 'Зачекайте поки викладачі створять завдання' }}
      </p>
      <div v-if="isTeacher" class="mt-6">
        <UButton
          @click="navigateTo('/assignments/create')"
          variant="solid"
          color="blue"
        >
          <UIcon name="i-heroicons-plus" class="mr-2 h-4 w-4" />
          Створити завдання
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const authStore = useAuthStore()
const { getAssignments, getTeacherAssignments, deleteAssignment: deleteAssignmentApi } = useAssignments()

// Реактивні дані
const assignments = ref<any[]>([])
const loading = ref(true)
const error = ref('')

// Фільтри
const searchQuery = ref('')
const difficultyFilter = ref('')
const statusFilter = ref('')

// Обчислювані властивості
const isTeacher = computed(() => authStore.user?.role === 'TEACHER')

const filteredAssignments = computed(() => {
  let filtered = assignments.value

  if (searchQuery.value) {
    filtered = filtered.filter(assignment =>
      assignment.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      assignment.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (difficultyFilter.value) {
    filtered = filtered.filter(assignment => assignment.difficulty === parseInt(difficultyFilter.value))
  }

  return filtered
})

const difficultyOptions = [
  { label: 'Всі', value: '' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '7', value: '7' },
  { label: '8', value: '8' },
  { label: '9', value: '9' },
  { label: '10', value: '10' }
]

const statusOptions = [
  { label: 'Всі', value: '' },
  { label: 'Активні', value: 'active' },
  { label: 'Завершені', value: 'completed' }
]

const loadAssignments = async () => {
  try {
    loading.value = true
    error.value = ''
    
    if (isTeacher.value) {
      assignments.value = await getTeacherAssignments(authStore.user!.id)
    } else {
      assignments.value = await getAssignments()
    }
  } catch (err) {
    error.value = 'Помилка завантаження завдань'
    console.error('Error in loadAssignments:', err)
  } finally {
    loading.value = false
  }
}

const getDifficultyColor = (difficulty: number) => {
  if (difficulty <= 3) return 'green'
  if (difficulty <= 6) return 'yellow'
  if (difficulty <= 8) return 'orange'
  return 'red'
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

const viewAssignment = (assignment: any) => {
  navigateTo(`/assignments/${assignment.id}`)
}

const editAssignment = (assignment: any) => {
  navigateTo(`/assignments/${assignment.id}/edit`)
}

const deleteAssignment = async (assignment: any) => {
  if (!confirm('Ви впевнені, що хочете видалити це завдання?')) return

  try {
    await deleteAssignmentApi(assignment.id)
    await loadAssignments()
  } catch (err) {
    console.error('Error deleting assignment:', err)
  }
}

const submitAssignment = (assignment: any) => {
  navigateTo(`/assignments/${assignment.id}/submit`)
}

// Завантаження даних при монтуванні
onMounted(() => {
  loadAssignments()
})
</script> 