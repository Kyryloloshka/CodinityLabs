import type { Ref } from 'vue'

interface MonacoEditorOptions {
  container: Ref<HTMLElement | undefined>
  props: {
    modelValue: string
    language?: string
    theme?: string
    readOnly?: boolean
    placeholder?: string
  }
  emit: (event: 'update:modelValue', value: string) => void
}

export const useMonacoEditor = ({ container, props, emit }: MonacoEditorOptions) => {
  const { theme: appTheme } = useTheme()
  
  let editor: any = null
  let monacoInstance: any = null

  // Ініціалізація редактора
  const initEditor = async () => {
    if (!container.value) return

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
      editor = monacoInstance.editor.create(container.value, {
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

  return {
    editor,
    monacoInstance,
    initEditor,
    disposeEditor,
    getValue,
    setValue,
    setLanguageAndValue
  }
} 