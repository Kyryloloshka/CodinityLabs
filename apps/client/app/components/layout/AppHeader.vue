<template>
  <header class="bg-theme-card shadow-md border-b border-theme-primary transition-colors duration-300">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-1">
        <LayoutAppLogo />
        
        <UserInfo
          v-if="authStore.isAuthenticated"
          :user="authStore.user"
          :is-logging-out="isLoggingOut"
          @logout="handleLogout"
        />
        <GuestActions v-else />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import AppLogo from './AppLogo.vue'
import UserInfo from './UserInfo.vue'
import GuestActions from './GuestActions.vue'

const authStore = useAuthStore()
const router = useRouter()
const isLoggingOut = ref(false)

const handleLogout = async () => {
  isLoggingOut.value = true
  authStore.logout()
  await router.push('/login')
  isLoggingOut.value = false
}
</script> 