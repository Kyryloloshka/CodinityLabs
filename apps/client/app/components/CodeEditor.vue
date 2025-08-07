<template>
  <div class="code-editor-container h-full">
    <div ref="editorContainer" class="editor-wrapper h-full"></div>
  </div>
</template>

<script setup lang="ts">
// Робимо компонент клієнтським
definePageMeta({
  ssr: false
})

interface Props {
  modelValue: string
  language?: string
  theme?: string
  readOnly?: boolean
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  language: 'javascript',
  theme: 'vs-dark',
  readOnly: false,
  placeholder: '// Введіть ваш код тут...'
})

const { theme: appTheme } = useTheme()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editorContainer = ref<HTMLElement>()
let editor: any = null
let monacoInstance: any = null

// Ініціалізація редактора
const initEditor = async () => {
  if (!editorContainer.value) return

  try {
    console.log('Initializing Monaco Editor...')
    
    // Динамічно імпортуємо Monaco Editor тільки на клієнті
    monacoInstance = await import('monaco-editor')

    // Налаштування Monaco Editor з підтримкою тем
    const isDark = appTheme.value === 'dark'
    
    // Dark theme
    monacoInstance.editor.defineTheme('vs-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955' },
        { token: 'keyword', foreground: '569CD6' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'function', foreground: 'DCDCAA' },
        { token: 'variable', foreground: '9CDCFE' },
        { token: 'type', foreground: '4EC9B0' }
      ],
      colors: {
        'editor.background': '#0f1419',
        'editor.foreground': '#e2e8f0',
        'editor.lineHighlightBackground': '#1a1f2e',
        'editor.selectionBackground': '#374151',
        'editor.inactiveSelectionBackground': '#252b3d',
        'editor.lineNumbers': '#71717a',
        'editor.lineNumbers.active': '#a1a1aa'
      }
    })

    // Light theme
    monacoInstance.editor.defineTheme('vs-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955' },
        { token: 'keyword', foreground: '569CD6' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'function', foreground: 'DCDCAA' },
        { token: 'variable', foreground: '9CDCFE' },
        { token: 'type', foreground: '4EC9B0' }
      ],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#1e293b',
        'editor.lineHighlightBackground': '#f8fafc',
        'editor.selectionBackground': '#e2e8f0',
        'editor.inactiveSelectionBackground': '#f1f5f9',
        'editor.lineNumbers': '#64748b',
        'editor.lineNumbers.active': '#1e293b'
      }
    })

    console.log('Creating editor with language:', props.language)

    // Визначаємо тему на основі поточної теми додатку
    const editorTheme = isDark ? 'vs-dark' : 'vs-light'

    // Створення редактора
    editor = monacoInstance.editor.create(editorContainer.value, {
      value: props.modelValue || props.placeholder,
      language: props.language,
      theme: editorTheme,
      readOnly: props.readOnly,
      automaticLayout: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 14,
      fontFamily: 'JetBrains Mono, Consolas, "Courier New", monospace',
      lineNumbers: 'on',
      roundedSelection: false,
      scrollbar: { vertical: 'visible', horizontal: 'visible' },
      folding: true,
      wordWrap: 'on',
      suggestOnTriggerCharacters: true,
      quickSuggestions: true,
      parameterHints: { enabled: true },
      hover: { enabled: true },
      renderWhitespace: 'selection',
      tabSize: 2,
      insertSpaces: true,
      detectIndentation: false
    })

    console.log('Editor created successfully')

    // Підписка на зміни
    editor.onDidChangeModelContent(() => {
      const value = editor?.getValue() || ''
      emit('update:modelValue', value)
    })

    // Налаштування для JavaScript/TypeScript
    if (props.language === 'javascript' || props.language === 'typescript') {
      monacoInstance.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false
      })
    }
  } catch (error) {
    console.error('Error initializing Monaco Editor:', error)
  }
}

// Очищення редактора
const disposeEditor = () => {
  if (editor) {
    editor.dispose()
    editor = null
  }
}

// Отримання значення з редактора
const getValue = () => {
  return editor?.getValue() || ''
}

// Встановлення значення в редактор
const setValue = (value: string) => {
  if (editor) {
    editor.setValue(value)
  }
}

// Встановлення мови та значення одночасно
const setLanguageAndValue = (language: string, value: string) => {
  if (editor && monacoInstance) {
    try {
      const model = editor.getModel()
      if (model) {
        monacoInstance.editor.setModelLanguage(model, language)
        editor.setValue(value)
      }
    } catch (error) {
      console.error('Error updating language and value:', error)
    }
  }
}

// Експорт методів
defineExpose({
  getValue,
  setValue,
  setLanguageAndValue
})

// Життєвий цикл
onMounted(() => {
  nextTick(() => {
    initEditor()
  })
})

onBeforeUnmount(() => {
  disposeEditor()
})

// Спостерігач за змінами props
watch(() => props.modelValue, (newValue) => {
  if (editor && newValue !== editor.getValue()) {
    editor.setValue(newValue)
  }
})

watch(() => props.language, async (newLanguage) => {
  console.log('Language changed to:', newLanguage)
  if (editor && monacoInstance) {
    try {
      const model = editor.getModel()
      if (model) {
        monacoInstance.editor.setModelLanguage(model, newLanguage)
        console.log('Language updated successfully')
      }
    } catch (error) {
      console.error('Error updating language:', error)
    }
  }
})

// Watch for theme changes
watch(() => appTheme.value, (newTheme) => {
  if (editor && monacoInstance) {
    const editorTheme = newTheme === 'dark' ? 'vs-dark' : 'vs-light'
    monacoInstance.editor.setTheme(editorTheme)
    console.log('Editor theme updated to:', editorTheme)
  }
})
</script>

<style scoped>
.code-editor-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border: 1px solid var(--border-primary);
  transition: border-color 0.3s ease;
}

.editor-wrapper {
  width: 100%;
  height: 100%;
  min-height: 400px;
}

:deep(.monaco-editor) { 
  border-radius: 8px; 
  height: 100% !important;
}

[data-theme="dark"] :deep(.monaco-editor .margin) { 
  background-color: #0f1419; 
}

[data-theme="dark"] :deep(.monaco-editor .monaco-editor-background) { 
  background-color: #0f1419; 
}

[data-theme="dark"] :deep(.monaco-editor .line-numbers) { 
  color: #71717a; 
}

[data-theme="dark"] :deep(.monaco-editor .current-line) { 
  background-color: #1a1f2e; 
}

[data-theme="dark"] :deep(.monaco-editor .scrollbar) {
  background-color: #1a1f2e;
}

[data-theme="dark"] :deep(.monaco-editor .scrollbar .slider) {
  background-color: #374151;
}

[data-theme="dark"] :deep(.monaco-editor .scrollbar .slider:hover) {
  background-color: #4b5563;
}

[data-theme="light"] :deep(.monaco-editor .margin) { 
  background-color: #ffffff; 
}

[data-theme="light"] :deep(.monaco-editor .monaco-editor-background) { 
  background-color: #ffffff; 
}

[data-theme="light"] :deep(.monaco-editor .line-numbers) { 
  color: #64748b; 
}

[data-theme="light"] :deep(.monaco-editor .current-line) { 
  background-color: #f8fafc; 
}

[data-theme="light"] :deep(.monaco-editor .scrollbar) {
  background-color: #f8fafc;
}

[data-theme="light"] :deep(.monaco-editor .scrollbar .slider) {
  background-color: #e2e8f0;
}

[data-theme="light"] :deep(.monaco-editor .scrollbar .slider:hover) {
  background-color: #cbd5e1;
}
</style> 