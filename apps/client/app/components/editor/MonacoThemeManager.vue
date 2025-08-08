<template>
  <div></div>
</template>

<script setup lang="ts">
interface Props {
  monacoInstance: any
}

const props = defineProps<Props>()

// Ініціалізація тем
const initializeThemes = () => {
  if (!props.monacoInstance) {
    console.warn('Monaco instance not available for theme initialization')
    return
  }

  console.log('Initializing Monaco themes...')

  // Dark theme
  props.monacoInstance.editor.defineTheme('vs-dark', {
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
  props.monacoInstance.editor.defineTheme('vs-light', {
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

  console.log('Monaco themes initialized successfully')
}

// Встановлення теми
const setTheme = (theme: 'dark' | 'light') => {
  if (!props.monacoInstance) return
  
  const editorTheme = theme === 'dark' ? 'vs-dark' : 'vs-light'
  props.monacoInstance.editor.setTheme(editorTheme)
  console.log('Editor theme updated to:', editorTheme)
}

// Експорт методів
defineExpose({
  initializeThemes,
  setTheme
})

// Ініціалізація при монтуванні
onMounted(() => {
  initializeThemes()
})
</script> 