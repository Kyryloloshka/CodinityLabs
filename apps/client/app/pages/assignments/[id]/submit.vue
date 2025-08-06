<template>
  <div class="h-screen flex flex-col bg-theme-primary transition-colors duration-300">
    <!-- Header -->
    <AssignmentSubmitHeader
      :assignment="assignment"
      :selected-language="selectedLanguage"
      @update:selected-language="selectedLanguage = $event"
      @reset-code="resetCode"
    />

    <!-- Main Content -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Left Panel - Problem Description -->
      <div 
        class="relative"
        :style="{ width: `${leftPanelWidth}px` }"
      >
        <AssignmentDescription
          :assignment="assignment"
          :loading="loading"
        />
        <!-- Resize handle -->
        <div
          class="absolute top-0 right-0 w-1 h-full bg-theme-secondary hover:bg-theme-primary cursor-col-resize transition-colors duration-200"
          @mousedown="startResize('left', $event)"
        ></div>
      </div>

      <!-- Center Panel - Test Cases & Results -->
      <div 
        class="relative"
        :style="{ width: `${centerPanelWidth}px` }"
      >
        <ResultsPanel
          :assignment="assignment"
          :check-results="checkResults"
          :active-tab="activeTab"
          :selected-test-case-index="selectedTestCaseIndex"
          :selected-result-index="selectedResultIndex"
          @update:active-tab="activeTab = $event"
          @update:selected-test-case-index="selectedTestCaseIndex = $event"
          @update:selected-result-index="selectedResultIndex = $event"
        />
        <!-- Resize handle -->
        <div
          class="absolute top-0 right-0 w-1 h-full bg-theme-secondary hover:bg-theme-primary cursor-col-resize transition-colors duration-200"
          @mousedown="startResize('center', $event)"
        ></div>
      </div>

      <!-- Right Panel - Code Editor -->
      <div 
        class="relative flex-1"
        :style="{ width: `${rightPanelWidth}px` }"
      >
        <CodeEditorPanel
          :submission-code="submissionCode"
          :selected-language="selectedLanguage"
          :testing="testing"
          :submitting="submitting"
          @update:submission-code="submissionCode = $event"
          @test-code="testCode"
          @submit-solution="submitSolution"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'no-container',
  middleware: 'student-only',
  ssr: false
})

const route = useRoute()
const authStore = useAuthStore()
const { getAssignment, createSubmission, checkCode } = useAssignments()
const toast = useToast()

// Реактивні дані
const assignment = ref<any>(null)
const loading = ref(true)
const error = ref('')
const submitting = ref(false)
const testing = ref(false)
const submissionCode = ref('')
const checkResults = ref<any>(null)
const selectedLanguage = ref('javascript')
const selectedTestCaseIndex = ref(0)
const selectedResultIndex = ref(0)
const activeTab = ref('testCases')

// Resize state
const leftPanelWidth = ref(400)
const centerPanelWidth = ref(400)
const rightPanelWidth = ref(400)
const isResizing = ref(false)
const currentResizePanel = ref<'left' | 'center' | null>(null)
const startX = ref(0)
const startWidth = ref(0)

const assignmentId = route.params.id as string

const codeTemplates = {
  javascript: `// Ваше рішення
function solution(input) {
  // Введіть вашу логіку тут
  return input;
}

// Функція main для тестування
function main(args) {
  // Приклад використання
  const result = solution(args);
  return result;
}`,
  
  typescript: `// Ваше рішення
function solution(input: string): string {
  // Введіть вашу логіку тут
  return input;
}

// Функція main для тестування
function main(args: string): string {
  // Приклад використання
  const result: string = solution(args);
  return result;
}`
}

const resetCode = () => {
  const template = codeTemplates[selectedLanguage.value as keyof typeof codeTemplates] || codeTemplates.javascript
  submissionCode.value = template
}

const loadAssignment = async () => {
  try {
    loading.value = true
    error.value = ''
    assignment.value = await getAssignment(assignmentId)
    resetCode()
  } catch (err: any) {
    error.value = 'Помилка завантаження завдання'
    console.error(err)
    
    if (err?.status === 404 || err?.statusCode === 404) {
      toast.add({
        title: 'Помилка',
        description: 'Таке завдання не доступне',
        color: 'error'
      })
      await navigateTo('/assignments')
      return
    }
    
    toast.add({
      title: 'Помилка',
      description: 'Помилка завантаження завдання',
      color: 'error'
    })
    await navigateTo('/assignments')
  } finally {
    loading.value = false
  }
}

// Перевірка коду
const testCode = async () => {
  if (!submissionCode.value.trim()) return

  try {
    testing.value = true
    error.value = ''
    
    const request = {
      code: submissionCode.value,
      language: selectedLanguage.value,
      testCases: assignment.value.testCases.map((testCase: any) => ({
        input: testCase.input,
        expected: testCase.expected,
        description: testCase.description
      }))
    }
    
    checkResults.value = await checkCode(request)
    // Автоматично переключаємося на вкладку результатів
    activeTab.value = 'results'
    selectedResultIndex.value = 0 // Default to first result
  } catch (err: any) {
    error.value = 'Помилка перевірки коду'
    console.error('Error testing code:', err)
    toast.add({
      title: 'Помилка',
      description: 'Помилка перевірки коду',
      color: 'error'
    })
  } finally {
    testing.value = false
  }
}

const submitSolution = async () => {
  if (!submissionCode.value.trim()) return

  try {
    submitting.value = true
    
    await createSubmission({
      userId: authStore.user!.id,
      assignmentId: assignmentId,
      code: submissionCode.value,
      language: selectedLanguage.value
    })

    await navigateTo(`/assignments/${assignmentId}`)
  } catch (err: any) {
    console.error('Error submitting solution:', err)
    toast.add({
      title: 'Помилка',
      description: 'Помилка відправки рішення',
      color: 'error'
    })
  } finally {
    submitting.value = false
  }
}

watch(selectedLanguage, () => {
  resetCode()
})

onMounted(() => {
  loadAssignment()
})

// Resize functionality
const startResize = (panel: 'left' | 'center', event: MouseEvent) => {
  isResizing.value = true
  currentResizePanel.value = panel
  startX.value = event.clientX
  
  if (panel === 'left') {
    startWidth.value = leftPanelWidth.value
  } else if (panel === 'center') {
    startWidth.value = centerPanelWidth.value
  }
  
  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
}

const handleResize = (event: MouseEvent) => {
  if (!isResizing.value || !currentResizePanel.value) return
  
  const deltaX = event.clientX - startX.value
  
  if (currentResizePanel.value === 'left') {
    const newWidth = Math.max(200, Math.min(800, startWidth.value + deltaX))
    leftPanelWidth.value = newWidth
  } else if (currentResizePanel.value === 'center') {
    const newWidth = Math.max(200, Math.min(800, startWidth.value + deltaX))
    centerPanelWidth.value = newWidth
  }
}

const stopResize = () => {
  isResizing.value = false
  currentResizePanel.value = null
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
}
</script>

<style scoped>
.cursor-col-resize {
  cursor: col-resize;
}
</style> 