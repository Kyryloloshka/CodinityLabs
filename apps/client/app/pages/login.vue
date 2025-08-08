<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-theme-secondary to-theme-tertiary py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-[300px] w-full space-y-8">
      <div>
        <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-theme-tertiary">
          <UIcon name="i-heroicons-academic-cap" class="h-8 w-8 text-accent-primary" />
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-theme-primary">
          Вхід в систему
        </h2>
        <p class="mt-2 text-center text-sm text-theme-secondary">
          Або
          <NuxtLink to="/register" class="font-medium text-primary hover:text-theme-secondary">
            створіть новий обліковий запис
          </NuxtLink>
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-theme-primary">
              Email
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="your@email.com"
                :error="errors.email"
                required
                autocomplete="email"  
                class="min-w-full px-2 text-sm py-1 h-8 border border-theme-secondary rounded-md shadow-sm bg-theme-input text-theme-primary focus:outline-none focus:ring-0"
              />
            </div>
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-theme-primary">
              Пароль
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="form.password"
                type="password"
                placeholder="••••••••"
                :error="errors.password"
                required
                autocomplete="current-password"
                class="min-w-full px-2 text-sm py-1 h-8 border border-theme-secondary rounded-md shadow-sm bg-theme-input text-theme-primary focus:outline-none focus:ring-0"
              />
            </div>
          </div>
        </div>

        <div v-if="errorMessage" class="rounded-md bg-error p-4">
          <div class="flex">
            <UIcon name="i-heroicons-exclamation-triangle" class="h-5 w-5 text-error" />
            <div class="ml-3">
              <h3 class="text-sm font-medium text-error">
                Помилка входу
              </h3>
              <div class="mt-2 text-sm text-error-light">
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
            class="w-full text-center flex items-center justify-center"
            size="lg"
          >
            <UIcon name="i-heroicons-arrow-right-on-rectangle" class="mr-2 h-5 w-5" />
            Увійти
          </UButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'no-container',
  middleware: 'guest'
})

const authStore = useAuthStore()
const router = useRouter()

const form = ref({
  email: '',
  password: ''
})

const errors = ref({
  email: '',
  password: ''
})

const errorMessage = ref('')

const validateForm = () => {
  errors.value = { email: '', password: '' }
  let isValid = true

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

  return isValid
}

const handleLogin = async () => {
  errorMessage.value = ''
  
  if (!validateForm()) {
    return
  }

  const result = await authStore.login({
    email: form.value.email,
    password: form.value.password
  })

  if (result.success) {
    const redirectPath = import.meta.client ? sessionStorage.getItem('redirectAfterAuth') : null
    if (redirectPath) {
      sessionStorage.removeItem('redirectAfterAuth')
      await router.push(redirectPath)
    } else {
      await router.push('/')
    }
  } else {
    errorMessage.value = result.error || 'Не вдалося ввійти'
  }
}
</script> 