<template>
  <div></div>
</template>

<script setup lang="ts">
interface Props {
  language: string
  theme: string
  readOnly: boolean
  placeholder: string
}

const props = defineProps<Props>()

// Отримання конфігурації редактора
const getEditorConfig = (container: HTMLElement, value: string) => {
  return {
    value: value || props.placeholder,
    language: props.language,
    theme: props.theme,
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
}

// Налаштування для JavaScript/TypeScript
const setupLanguageSupport = (monacoInstance: any) => {
  if (props.language === 'javascript' || props.language === 'typescript') {
    monacoInstance.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false
    })
  }
}

// Експорт методів
defineExpose({
  getEditorConfig,
  setupLanguageSupport
})
</script> 