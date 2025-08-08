export const useDateUtils = () => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) {
      return 'Сьогодні'
    } else if (diffInDays === 1) {
      return 'Вчора'
    } else if (diffInDays < 7) {
      return `${diffInDays} днів тому`
    } else {
      return formatDate(dateString)
    }
  }

  const isDateInPast = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    return date < now
  }

  const isDateInFuture = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    return date > now
  }

  const getDaysUntil = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = date.getTime() - now.getTime()
    return Math.ceil(diffInMs / (1000 * 60 * 60 * 24))
  }

  return {
    formatDate,
    formatRelativeDate,
    isDateInPast,
    isDateInFuture,
    getDaysUntil
  }
} 