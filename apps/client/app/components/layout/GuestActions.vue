<template>
  <div class="flex items-center space-x-2">
    <ThemeSwitcher />
    <UButton
      to="/login"
      variant="ghost"
      size="sm"
      class="text-theme-primary cursor-pointer"
    >
      Увійти
    </UButton>
    <UButton
      to="/register"
      variant="ghost"
      size="sm"
      class="text-theme-primary cursor-pointer"
    >
      Реєстрація
    </UButton>
  </div>
</template> 