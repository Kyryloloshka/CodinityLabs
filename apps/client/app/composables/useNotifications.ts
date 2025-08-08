export const useNotifications = () => {
  const toast = useToast()

  const showSuccess = (title: string, description?: string) => {
    toast.add({
      title,
      description,
      color: 'success',
      timeout: 5000
    })
  }

  const showError = (title: string, description?: string) => {
    toast.add({
      title,
      description,
      color: 'error',
      timeout: 8000
    })
  }

  const showWarning = (title: string, description?: string) => {
    toast.add({
      title,
      description,
      color: 'warning',
      timeout: 6000
    })
  }

  const showInfo = (title: string, description?: string) => {
    toast.add({
      title,
      description,
      color: 'primary',
      timeout: 4000
    })
  }

  const showLoading = (title: string, description?: string) => {
    return toast.add({
      title,
      description,
      color: 'primary',
      loading: true,
      timeout: 0
    })
  }

  const updateLoading = (id: string, title: string, description?: string, success = true) => {
    toast.update(id, {
      title,
      description,
      color: success ? 'success' : 'error',
      loading: false,
      timeout: success ? 3000 : 5000
    })
  }

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    updateLoading
  }
} 