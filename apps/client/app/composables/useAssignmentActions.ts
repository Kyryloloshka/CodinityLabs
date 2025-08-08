import type { Assignment } from '~/lib/types'

export const useAssignmentActions = () => {
  const authStore = useAuthStore()
  const { setRedirectAfterAuth } = useSession()

  const viewAssignment = (assignment: Assignment) => {
    navigateTo(`/assignments/${assignment.id}`)
  }

  const submitAssignment = (assignment: Assignment) => {
    navigateTo(`/assignments/${assignment.id}/submit`)
  }

  const loginToSubmit = (assignment: Assignment) => {
    setRedirectAfterAuth(`/assignments/${assignment.id}/submit`)
    navigateTo('/login')
  }

  const handleAssignmentAction = (assignment: Assignment, action: 'view' | 'submit' | 'login') => {
    switch (action) {
      case 'view':
        viewAssignment(assignment)
        break
      case 'submit':
        if (authStore.isAuthenticated) {
          submitAssignment(assignment)
        } else {
          loginToSubmit(assignment)
        }
        break
      case 'login':
        loginToSubmit(assignment)
        break
    }
  }

  return {
    viewAssignment,
    submitAssignment,
    loginToSubmit,
    handleAssignmentAction
  }
} 