import type { Assignment } from '~/lib/types'

export const useAssignmentsData = () => {
  const { getAssignments } = useAssignments()
  const { formatDate } = useDateUtils()
  const { getRoleLabel } = useUserRoles()
  
  const assignments = ref<Assignment[]>([])
  const loading = ref(true)
  const error = ref('')

  const loadAssignments = async (page?: number, limit?: number) => {
    try {
      loading.value = true
      error.value = ''
      
      const response = await getAssignments(page || 1, limit || 10)
      assignments.value = response.data
    } catch (err) {
      error.value = 'Помилка завантаження завдань'
      console.error('Error in loadAssignments:', err)
    } finally {
      loading.value = false
    }
  }

  const isAssignmentActive = (assignment: Assignment) => {
    const now = new Date()
    const deadline = new Date(assignment.deadline)
    return deadline > now
  }

  return {
    assignments,
    loading,
    error,
    loadAssignments,
    getRoleLabel,
    formatDate,
    isAssignmentActive
  }
} 