export const useSession = () => {
  const setRedirectAfterAuth = (path: string) => {
    if (import.meta.client) {
      sessionStorage.setItem('redirectAfterAuth', path)
    }
  }

  const getRedirectAfterAuth = (): string | null => {
    if (import.meta.client) {
      return sessionStorage.getItem('redirectAfterAuth')
    }
    return null
  }

  const clearRedirectAfterAuth = () => {
    if (import.meta.client) {
      sessionStorage.removeItem('redirectAfterAuth')
    }
  }

  const setLastVisitedAssignment = (assignmentId: string) => {
    if (import.meta.client) {
      sessionStorage.setItem('lastVisitedAssignment', assignmentId)
    }
  }

  const getLastVisitedAssignment = (): string | null => {
    if (import.meta.client) {
      return sessionStorage.getItem('lastVisitedAssignment')
    }
    return null
  }

  const setEditorContent = (assignmentId: string, content: string) => {
    if (import.meta.client) {
      sessionStorage.setItem(`editor_${assignmentId}`, content)
    }
  }

  const getEditorContent = (assignmentId: string): string | null => {
    if (import.meta.client) {
      return sessionStorage.getItem(`editor_${assignmentId}`)
    }
    return null
  }

  const clearEditorContent = (assignmentId: string) => {
    if (import.meta.client) {
      sessionStorage.removeItem(`editor_${assignmentId}`)
    }
  }

  const setEditorLanguage = (assignmentId: string, language: string) => {
    if (import.meta.client) {
      sessionStorage.setItem(`editor_lang_${assignmentId}`, language)
    }
  }

  const getEditorLanguage = (assignmentId: string): string | null => {
    if (import.meta.client) {
      return sessionStorage.getItem(`editor_lang_${assignmentId}`)
    }
    return null
  }

  const clearEditorLanguage = (assignmentId: string) => {
    if (import.meta.client) {
      sessionStorage.removeItem(`editor_lang_${assignmentId}`)
    }
  }

  const clearAllSessionData = () => {
    if (import.meta.client) {
      sessionStorage.clear()
    }
  }

  return {
    setRedirectAfterAuth,
    getRedirectAfterAuth,
    clearRedirectAfterAuth,
    setLastVisitedAssignment,
    getLastVisitedAssignment,
    setEditorContent,
    getEditorContent,
    clearEditorContent,
    setEditorLanguage,
    getEditorLanguage,
    clearEditorLanguage,
    clearAllSessionData
  }
} 