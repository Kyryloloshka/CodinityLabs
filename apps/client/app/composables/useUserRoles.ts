export const useUserRoles = () => {
  const getRoleLabel = (role: string | undefined) => {
    switch (role) {
      case 'STUDENT':
        return 'Студент'
      case 'TEACHER':
        return 'Викладач'
      default:
        return 'Невідома роль'
    }
  }

  const getRoleColor = (role: string | undefined) => {
    switch (role) {
      case 'STUDENT':
        return 'primary'
      case 'TEACHER':
        return 'success'
      default:
        return 'secondary'
    }
  }

  const isStudent = (role: string | undefined) => {
    return role === 'STUDENT'
  }

  const isTeacher = (role: string | undefined) => {
    return role === 'TEACHER'
  }

  const canCreateAssignments = (role: string | undefined) => {
    return role === 'TEACHER'
  }

  const canViewAllSubmissions = (role: string | undefined) => {
    return role === 'TEACHER'
  }

  const canEditAssignments = (role: string | undefined) => {
    return role === 'TEACHER'
  }

  const canDeleteAssignments = (role: string | undefined) => {
    return role === 'TEACHER'
  }

  return {
    getRoleLabel,
    getRoleColor,
    isStudent,
    isTeacher,
    canCreateAssignments,
    canViewAllSubmissions,
    canEditAssignments,
    canDeleteAssignments
  }
} 