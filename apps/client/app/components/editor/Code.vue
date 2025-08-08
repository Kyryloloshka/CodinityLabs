<template>
  <div class="code-editor-container h-full">
    <div ref="editorContainer" class="editor-wrapper h-full"></div>
    <EditorMonacoThemeManager ref="themeManager" :monaco-instance="monacoInstance" />
    <EditorMonacoEditorConfig 
      ref="configManager"
      :language="language"
      :theme="theme"
      :read-only="readOnly"
      :placeholder="placeholder"
    />
  </div>
</template>

<script setup lang="ts">
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
const themeManager = ref<{
  initializeThemes(): void
  setTheme(theme: string): void
}>()

const configManager = ref<{
  getEditorConfig(container: HTMLElement, value: string): any
  setupLanguageSupport(monaco: MonacoInstance): void
}>()

let editor: MonacoEditor | null = null
let monacoInstance: MonacoInstance | null = null

type MonacoEditor = any
type MonacoInstance = any

const initEditor = async () => {
  if (!editorContainer.value) {
    console.error('Editor container not found')
    return
  }

  try {
    console.log('Initializing Monaco Editor...')
    
    monacoInstance = await import('monaco-editor')
    console.log('Monaco instance loaded:', !!monacoInstance)

    themeManager.value?.initializeThemes()

    await nextTick()

    console.log('Creating editor with language:', props.language)

    const isDark = appTheme.value === 'dark'
    const editorTheme = isDark ? 'vs-dark' : 'vs-light'
    console.log('Editor theme:', editorTheme)

    const editorConfig = configManager.value?.getEditorConfig(editorContainer.value, props.modelValue) || {
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
    }

    console.log('Editor config:', editorConfig)

    editor = monacoInstance.editor.create(editorContainer.value, editorConfig)
    console.log('Editor created successfully:', !!editor)

    nextTick(() => {
      const editorElement = editorContainer.value?.querySelector('.monaco-editor')
      if (editorElement) {
        console.log('Editor element found, applying styles')
        editorElement.classList.add('monaco-editor-styled')
      } else {
        console.warn('Editor element not found')
      }
    })

    editor.onDidChangeModelContent(() => {
      const value = editor?.getValue() || ''
      emit('update:modelValue', value)
    })

    if (configManager.value && monacoInstance) {
      configManager.value.setupLanguageSupport(monacoInstance)
    }
  } catch (error) {
    console.error('Error initializing Monaco Editor:', error)
  }
}

const disposeEditor = () => {
  if (editor) {
    editor.dispose()
    editor = null
  }
}

const getValue = (): string => {
  return editor?.getValue() || ''
}

const setValue = (value: string): void => {
  if (editor) {
    editor.setValue(value)
  }
}

const setLanguageAndValue = (language: string, value: string): void => {
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

defineExpose({
  getValue,
  setValue,
  setLanguageAndValue
})

onMounted(() => {
  nextTick(() => {
    initEditor()
  })
})

onBeforeUnmount(() => {
  disposeEditor()
})

watch(() => props.modelValue, (newValue) => {
  if (editor && newValue !== editor.getValue()) {
    editor.setValue(newValue)
  }
})

watch(() => props.language, async (newLanguage) => {
  if (editor && monacoInstance) {
    try {
      const model = editor.getModel()
      if (model) {
        monacoInstance.editor.setModelLanguage(model, newLanguage)
      }
    } catch (error) {
      console.error('Error updating language:', error)
    }
  }
})

watch(() => appTheme.value, (newTheme) => {
  themeManager.value?.setTheme(newTheme as string)
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
  width: 100% !important;
}

:deep(.monaco-editor-styled) {
  border-radius: 8px !important;
  height: 100% !important;
  width: 100% !important;
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