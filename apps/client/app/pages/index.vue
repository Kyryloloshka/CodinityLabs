<template>
  <div class="space-y-8">
    <!-- Hero Section -->
    <div class="animate-on-scroll" ref="heroRef">
      <DashboardWelcomeHero 
        :is-authenticated="authStore.isAuthenticated" 
        :user-role="authStore.userRole"
      />
    </div>
    
    <!-- Feature Cards Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" ref="featuresRef">
      <div class="animate-on-scroll animation-delay-100" ref="featureCard1">
        <DashboardFeatureCard
          title="Автоматична перевірка коду"
          subtitle="Швидкий зворотний зв'язок"
          description="Миттєва перевірка вашого коду з детальним аналізом помилок та рекомендаціями для покращення"
          icon="🔍"
          gradient-colors="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          :tags="['Real-time', 'Feedback', 'Testing']"
        />
      </div>
      
      <div class="animate-on-scroll animation-delay-200" ref="featureCard2">
        <DashboardFeatureCard
          title="Інтерактивний редактор"
          subtitle="Зручне середовище розробки"
          description="Потужний онлайн-редактор з підсвічуванням синтаксису, автодоповненням та інтеграцією з Git"
          icon="💻"
          gradient-colors="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
          :tags="['Monaco Editor', 'Syntax Highlighting', 'Auto-complete']"
        />
      </div>
      
      <div class="animate-on-scroll animation-delay-300" ref="featureCard3">
        <DashboardFeatureCard
          title="Миттєвий результат"
          subtitle="Швидка перевірка рішень"
          description="Отримуйте результати перевірки вашого коду за лічені секунди з детальним аналізом помилок"
          icon="⚡"
          gradient-colors="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
          :tags="['Fast', 'Results', 'Instant']"
        />
      </div>
      
      <div class="animate-on-scroll animation-delay-400" ref="featureCard4">
        <DashboardFeatureCard
          title="Безпечне виконання коду"
          subtitle="Ізольоване середовище тестування"
          description="Ваш код виконується в безпечному ізольованому середовищі з обмеженими ресурсами та часом виконання"
          icon="🔒"
          gradient-colors="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
          :tags="['Docker', 'Security', 'Isolation']"
        />
      </div>
      
      <div class="animate-on-scroll animation-delay-500" ref="featureCard5">
        <DashboardFeatureCard
          title="Детальні тест-кейси"
          subtitle="Комплексна перевірка рішень"
          description="Система перевіряє ваші рішення на множині тест-кейсів, включаючи граничні випадки та edge cases"
          icon="🧪"
          gradient-colors="linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
          :tags="['Testing', 'Validation', 'Quality']"
        />
      </div>
      
      <div class="animate-on-scroll animation-delay-600" ref="featureCard6">
        <DashboardFeatureCard
          title="Історія подань"
          subtitle="Відстежуйте свій прогрес"
          description="Переглядайте всі свої спроби розв'язання завдань, аналізуйте помилки та покращуйте код"
          icon="📝"
          gradient-colors="linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)"
          :tags="['History', 'Progress', 'Analysis']"
        />
      </div>
    </div>

    
    <!-- Call to Action for Non-authenticated Users -->
    <div v-if="!authStore.isAuthenticated" class="animate-on-scroll text-center bg-gray-50 dark:bg-gray-800 rounded-xl p-8" ref="ctaRef">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Готові почати навчання?
      </h2>
      <p class="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
        Приєднайтесь до тисяч студентів, які вже покращують свої навички програмування на нашій платформі
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <NuxtLink 
          to="/register"
          class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          <span class="mr-2">🚀</span>
          Створити акаунт
        </NuxtLink>
        <NuxtLink 
          to="/assignments"
          class="inline-flex items-center px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          <span class="mr-2">👀</span>
          Переглянути завдання
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'redirect-after-auth'
})

const authStore = useAuthStore()

// Refs for animation
const heroRef = ref<HTMLElement>()
const featureCard1 = ref<HTMLElement>()
const featureCard2 = ref<HTMLElement>()
const featureCard3 = ref<HTMLElement>()
const featureCard4 = ref<HTMLElement>()
const featureCard5 = ref<HTMLElement>()
const featureCard6 = ref<HTMLElement>()
const ctaRef = ref<HTMLElement>()

// Intersection Observer for animations
onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view')
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: '50px'
    }
  )

  // Observe all elements with animate-on-scroll class
  const elementsToObserve = [
    heroRef.value,
    featureCard1.value,
    featureCard2.value,
    featureCard3.value,
    featureCard4.value,
    featureCard5.value,
    featureCard6.value,
    ctaRef.value
  ].filter(Boolean)

  elementsToObserve.forEach((el) => {
    if (el) observer.observe(el)
  })

  onUnmounted(() => {
    observer.disconnect()
  })
})
</script> 