<template>
  <div class="space-y-6">
    <!-- Інформація про користувача -->
    <div class="bg-theme-card overflow-hidden shadow rounded-lg border border-theme-primary">
      <div class="px-4 py-5 sm:p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="h-12 w-12 rounded-full bg-theme-tertiary flex items-center justify-center">
              <UIcon name="i-heroicons-user" class="h-6 w-6 text-accent-primary" />
            </div>
          </div>
          <div class="ml-4">
            <h2 class="text-lg font-medium text-theme-primary">
              Вітаємо, {{ authStore.user?.name }}!
            </h2>
            <p class="text-sm text-theme-secondary">
              Ви увійшли як {{ getRoleLabel(authStore.user?.role) }}
            </p>
          </div>
        </div>
        
        <div class="mt-6 border-t border-theme-primary pt-6">
          <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt class="text-sm font-medium text-theme-secondary">Email</dt>
              <dd class="mt-1 text-sm text-theme-primary">{{ authStore.user?.email }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-theme-secondary">Роль</dt>
              <dd class="mt-1 text-sm text-theme-primary">{{ getRoleLabel(authStore.user?.role) }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-theme-secondary">ID користувача</dt>
              <dd class="mt-1 text-sm text-theme-primary">{{ authStore.user?.id }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-theme-secondary">Статус</dt>
              <dd class="mt-1">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                  Активний
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>

    <div class="bg-theme-card overflow-hidden shadow rounded-lg border border-theme-primary">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg font-medium text-theme-primary mb-4">
          Змінити ім'я
        </h3>
        
        <form @submit.prevent="updateName" class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-theme-secondary mb-2">
              Нове ім'я
            </label>
            <input
              id="name"
              v-model="nameForm.name"
              type="text"
              required
              minlength="2"
              class="w-full px-3 py-2 border border-theme-primary rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-accent-primary bg-theme-background text-theme-primary"
              placeholder="Введіть нове ім'я"
            />
          </div>
          
          <div class="flex justify-end">
            <UButton
              type="submit"
              :loading="nameForm.loading"
              :disabled="!nameForm.name || nameForm.name.length < 2"
              color="primary"
            >
              Оновити ім'я
            </UButton>
          </div>
        </form>
      </div>
    </div>

    <div class="bg-theme-card overflow-hidden shadow rounded-lg border border-theme-primary">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg font-medium text-theme-primary mb-4">
          Змінити пароль
        </h3>
        
        <form @submit.prevent="updatePassword" class="space-y-4">
          <div>
            <label for="currentPassword" class="block text-sm font-medium text-theme-secondary mb-2">
              Поточний пароль
            </label>
            <input
              id="currentPassword"
              v-model="passwordForm.currentPassword"
              type="password"
              required
              class="w-full px-3 py-2 border border-theme-primary rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-accent-primary bg-theme-background text-theme-primary"
              placeholder="Введіть поточний пароль"
            />
          </div>
          
          <div>
            <label for="newPassword" class="block text-sm font-medium text-theme-secondary mb-2">
              Новий пароль
            </label>
            <input
              id="newPassword"
              v-model="passwordForm.newPassword"
              type="password"
              required
              minlength="6"
              class="w-full px-3 py-2 border border-theme-primary rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-accent-primary bg-theme-background text-theme-primary"
              placeholder="Введіть новий пароль"
            />
            <p class="mt-1 text-xs text-theme-secondary">
              Мінімум 6 символів
            </p>
          </div>
          
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-theme-secondary mb-2">
              Підтвердження паролю
            </label>
            <input
              id="confirmPassword"
              v-model="passwordForm.confirmPassword"
              type="password"
              required
              class="w-full px-3 py-2 border border-theme-primary rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-accent-primary bg-theme-background text-theme-primary"
              placeholder="Підтвердіть новий пароль"
            />
            <p v-if="passwordForm.newPassword && passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword" class="mt-1 text-xs text-red-700 dark:text-red-400">
              Паролі не співпадають
            </p>
          </div>
          
          <div class="flex justify-end">
            <UButton
              type="submit"
              :loading="passwordForm.loading"
              :disabled="!isPasswordFormValid"
              color="primary"
            >
              Змінити пароль
            </UButton>
          </div>
        </form>
      </div>
    </div>

    <div
      v-if="alert.show"
      class="mb-4 p-4 rounded-lg border"
      :class="{
        'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-700 dark:text-emerald-200': alert.type === 'success',
        'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-700 dark:text-red-200': alert.type === 'error'
      }"
    >
      <div class="flex">
        <UIcon 
          :name="alert.type === 'success' ? 'i-heroicons-check-circle' : 'i-heroicons-exclamation-triangle'" 
          class="h-5 w-5 mr-3 flex-shrink-0"
          :class="{
            'text-emerald-600 dark:text-emerald-400': alert.type === 'success',
            'text-red-600 dark:text-red-400': alert.type === 'error'
          }"
        />
        <div class="flex-1">
          <h3 class="text-sm font-medium">
            {{ alert.title }}
          </h3>
          <div class="mt-1 text-sm">
            {{ alert.message }}
          </div>
        </div>
        <button
          @click="alert.show = false"
          class="ml-3 flex-shrink-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <UIcon name="i-heroicons-x-mark" class="h-4 w-4" />
        </button>
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

const nameForm = ref({
  name: '',
  loading: false
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  loading: false
})

const alert = ref({
  show: false,
  title: '',
  message: '',
  type: 'success' as 'success' | 'error'
})

const isPasswordFormValid = computed(() => {
  return passwordForm.value.currentPassword &&
         passwordForm.value.newPassword &&
         passwordForm.value.confirmPassword &&
         passwordForm.value.newPassword.length >= 6 &&
         passwordForm.value.newPassword === passwordForm.value.confirmPassword
})

const showAlert = (type: 'success' | 'error', title: string, message: string) => {
  alert.value = {
    show: true,
    type,
    title,
    message
  }
  
  setTimeout(() => {
    alert.value.show = false
  }, 5000)
}

const updateName = async () => {
  if (!nameForm.value.name || nameForm.value.name.length < 2) {
    showAlert('error', 'Помилка', 'Ім\'я має бути не менше 2 символів')
    return
  }

  nameForm.value.loading = true
  
  try {
    const result = await authStore.updateProfile({
      name: nameForm.value.name
    })
    
    if (result.success) {
      showAlert('success', 'Успіх', 'Ім\'я успішно оновлено')
      nameForm.value.name = ''
    } else {
      showAlert('error', 'Помилка', result.error || 'Помилка оновлення імені')
    }
  } catch (error) {
    showAlert('error', 'Помилка', 'Помилка оновлення імені')
  } finally {
    nameForm.value.loading = false
  }
}

const updatePassword = async () => {
  if (!isPasswordFormValid.value) {
    showAlert('error', 'Помилка', 'Перевірте правильність введених даних')
    return
  }

  passwordForm.value.loading = true
  
  try {
    const result = await authStore.updateProfile({
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword,
      confirmPassword: passwordForm.value.confirmPassword
    })
    
    if (result.success) {
      showAlert('success', 'Успіх', 'Пароль успішно змінено')
      passwordForm.value.currentPassword = ''
      passwordForm.value.newPassword = ''
      passwordForm.value.confirmPassword = ''
    } else {
      showAlert('error', 'Помилка', result.error || 'Помилка зміни паролю')
    }
  } catch (error) {
    showAlert('error', 'Помилка', 'Помилка зміни паролю')
  } finally {
    passwordForm.value.loading = false
  }
}

const getRoleLabel = (role: string | undefined) => {
  switch (role) {
    case 'STUDENT':
      return 'Студент'
    case 'TEACHER':
      return 'Викладач'
    default:
      return 'Невідома роль'
  }
}
</script> 