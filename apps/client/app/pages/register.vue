<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-emerald-100">
          <UIcon name="i-heroicons-user-plus" class="h-8 w-8 text-emerald-600" />
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Створити обліковий запис
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Або
          <NuxtLink to="/login" class="font-medium text-emerald-600 hover:text-emerald-500">
            увійдіть в існуючий акаунт
          </NuxtLink>
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">
              Ім'я
            </label>
            <div class="mt-1">
              <UInput
                id="name"
                v-model="form.name"
                type="text"
                placeholder="Ваше ім'я"
                :error="errors.name"
                required
                autocomplete="name"
              />
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div class="mt-1">
              <UInput
                id="email"
                v-model="form.email"
                type="email"
                placeholder="your@email.com"
                :error="errors.email"
                required
                autocomplete="email"
              />
            </div>
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Пароль
            </label>
            <div class="mt-1">
              <UInput
                id="password"
                v-model="form.password"
                type="password"
                placeholder="••••••••"
                :error="errors.password"
                required
                autocomplete="new-password"
              />
            </div>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              Підтвердження пароля
            </label>
            <div class="mt-1">
              <UInput
                id="confirmPassword"
                v-model="form.confirmPassword"
                type="password"
                placeholder="••••••••"
                :error="errors.confirmPassword"
                required
                autocomplete="new-password"
              />
            </div>
          </div>

          <div>
            <label for="role" class="block text-sm font-medium text-gray-700">
              Роль
            </label>
            <div class="mt-1">
              <select
                id="role"
                v-model="form.role"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md bg-white"
                :class="{ 'border-red-300': errors.role }"
                required
              >
                <option value="">Оберіть роль</option>
                <option value="STUDENT">Студент</option>
                <option value="TEACHER">Викладач</option>
              </select>
              <div v-if="errors.role" class="mt-1 text-sm text-red-600">
                {{ errors.role }}
              </div>
            </div>
          </div>
        </div>

        <div v-if="errorMessage" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <UIcon name="i-heroicons-exclamation-triangle" class="h-5 w-5 text-red-400" />
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                Помилка реєстрації
              </h3>
              <div class="mt-2 text-sm text-red-700">
                {{ errorMessage }}
              </div>
            </div>
          </div>
        </div>

        <div>
          <UButton
            type="submit"
            :loading="authStore.isLoading"
            :disabled="authStore.isLoading"
            class="w-full"
            size="lg"
          >
            <UIcon name="i-heroicons-user-plus" class="mr-2 h-5 w-5" />
            Зареєструватися
          </UButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})

const authStore = useAuthStore()
const router = useRouter()

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: ''
})

const errors = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: ''
})

const errorMessage = ref('')



const validateForm = () => {
  errors.value = { name: '', email: '', password: '', confirmPassword: '', role: '' }
  let isValid = true

  if (!form.value.name.trim()) {
    errors.value.name = 'Ім\'я обов\'язкове'
    isValid = false
  }

  if (!form.value.email) {
    errors.value.email = 'Email обов\'язковий'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = 'Невірний формат email'
    isValid = false
  }

  if (!form.value.password) {
    errors.value.password = 'Пароль обов\'язковий'
    isValid = false
  } else if (form.value.password.length < 6) {
    errors.value.password = 'Пароль має бути не менше 6 символів'
    isValid = false
  }

  if (!form.value.confirmPassword) {
    errors.value.confirmPassword = 'Підтвердження пароля обов\'язкове'
    isValid = false
  } else if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = 'Паролі не співпадають'
    isValid = false
  }

  if (!form.value.role) {
    errors.value.role = 'Роль обов\'язкова'
    isValid = false
  }

  return isValid
}

const handleRegister = async () => {
  errorMessage.value = ''
  
  if (!validateForm()) {
    return
  }

  const result = await authStore.register({
    name: form.value.name,
    email: form.value.email,
    password: form.value.password,
    role: form.value.role
  })

  if (result.success) {
    await router.push('/')
  } else {
    errorMessage.value = result.error || 'Не вдалося зареєструватися'
  }
}
</script> 