import type { 
  Assignment, 
  CreateAssignment, 
  UpdateAssignment, 
  Submission, 
  CreateSubmission, 
  CheckCodeRequest, 
  CheckCodeResponse,
  PaginatedResponse 
} from '~/lib/types'

export const useAssignments = () => {
  const api = useApi()

  const getAssignments = async (page?: number, limit?: number, search?: string, difficulty?: number, status?: string): Promise<PaginatedResponse<Assignment>> => {
    const params = new URLSearchParams()
    if (page) params.append('page', page.toString())
    if (limit) params.append('limit', limit.toString())
    if (search) params.append('search', search)
    if (difficulty) params.append('difficulty', difficulty.toString())
    if (status) params.append('status', status)

    const response = await api.get<PaginatedResponse<Assignment>>(`/assignments?${params.toString()}`)
    return response
  }

  const getTeacherAssignments = async (teacherId: string, page?: number, limit?: number, search?: string, difficulty?: number, status?: string): Promise<PaginatedResponse<Assignment>> => {
    const params = new URLSearchParams()
    if (page) params.append('page', page.toString())
    if (limit) params.append('limit', limit.toString())
    if (search) params.append('search', search)
    if (difficulty) params.append('difficulty', difficulty.toString())
    if (status) params.append('status', status)

    const response = await api.get<PaginatedResponse<Assignment>>(`/assignments/teacher/${teacherId}?${params.toString()}`)
    return response
  }

  const getAssignment = async (id: string): Promise<Assignment> => {
    const response = await api.get<Assignment>(`/assignments/${id}`)
    return response
  }

  const getAssignmentForStudent = async (id: string): Promise<Assignment> => {
    const response = await api.get<Assignment>(`/assignments/${id}/student`)
    return response
  }

  const getAssignmentForTeacher = async (id: string): Promise<Assignment> => {
    try {
      const response = await api.get<Assignment>(`/assignments/${id}/teacher`)
      return response
    } catch (error: any) {
      if (error?.message === 'AUTH_CANCELLED') {
        // Не прокидаємо помилку далі при скасуванні авторизації
        throw error
      }
      console.error('Error fetching assignment for teacher:', error)
      throw error
    }
  }

  const createAssignment = async (assignment: CreateAssignment): Promise<Assignment> => {
    try {
      const response = await api.post<Assignment>('/assignments', assignment)
      return response
    } catch (error) {
      console.error('Error creating assignment:', error)
      throw error
    }
  }

  const updateAssignment = async (id: string, assignment: UpdateAssignment): Promise<Assignment> => {
    try {
      const response = await api.patch<Assignment>(`/assignments/${id}`, assignment)
      return response
    } catch (error) {
      console.error('Error updating assignment:', error)
      throw error
    }
  }

  const deleteAssignment = async (id: string): Promise<void> => {
    try {
      await api.delete(`/assignments/${id}`)
    } catch (error) {
      console.error('Error deleting assignment:', error)
      throw error
    }
  }

  const getSubmissions = async (): Promise<Submission[]> => {
    try {
      const response = await api.get<Submission[]>('/submissions')
      return response
    } catch (error) {
      console.error('Error fetching submissions:', error)
      throw error
    }
  }

  const getUserSubmissions = async (userId: string): Promise<Submission[]> => {
    try {
      const response = await api.get<Submission[]>(`/submissions/user/${userId}`)
      return response
    } catch (error) {
      console.error('Error fetching user submissions:', error)
      throw error
    }
  }

  const getUserAssignmentSubmissions = async (userId: string, assignmentId: string): Promise<Submission[]> => {
    try {
      const response = await api.get<Submission[]>(`/submissions/user/${userId}/assignment/${assignmentId}`)
      return response
    } catch (error) {
      console.error('Error fetching user assignment submissions:', error)
      throw error
    }
  }

  const getAssignmentSubmissions = async (assignmentId: string): Promise<Submission[]> => {
    try {
      const response = await api.get<Submission[]>(`/submissions/assignment/${assignmentId}`)
      return response
    } catch (error) {
      console.error('Error fetching assignment submissions:', error)
      throw error
    }
  }

  const getAssignmentStatistics = async (assignmentId: string): Promise<any> => {
    const response = await api.get<any>(`/submissions/assignment/${assignmentId}/statistics`)
    return response
  }

  const getAssignmentStatisticsWithUsers = async (assignmentId: string): Promise<any> => {
    try {
      const response = await api.get<any>(`/submissions/assignment/${assignmentId}/statistics-with-users`)
      return response
    } catch (error: any) {
      if (error?.message === 'AUTH_CANCELLED') {
        // Не прокидаємо помилку далі при скасуванні авторизації
        throw error
      }
      console.error('Error fetching assignment statistics:', error)
      throw error
    }
  }

  const createSubmission = async (submission: CreateSubmission): Promise<Submission> => {
    try {
      const response = await api.post<Submission>('/submissions', submission)
      return response
    } catch (error) {
      console.error('Error creating submission:', error)
      throw error
    }
  }

  const deleteSubmission = async (id: string): Promise<void> => {
    try {
      await api.delete(`/submissions/${id}`)
    } catch (error) {
      console.error('Error deleting submission:', error)
      throw error
    }
  }

  const checkCode = async (request: CheckCodeRequest): Promise<CheckCodeResponse> => {
    try {
      const response = await api.post<CheckCodeResponse>('/assignments/check', request)
      return response
    } catch (error) {
      console.error('Error checking code:', error)
      throw error
    }
  }

  const checkMaxAttempts = async (userId: string, assignmentId: string): Promise<any> => {
    try {
      const response = await api.get<any>(`/assignments/${assignmentId}/check-max-attempts/${userId}`)
      return response
    } catch (error) {
      console.error('Error checking max attempts:', error)
      throw error
    }
  }

  return {
    getAssignments,
    getTeacherAssignments,
    getAssignment,
    getAssignmentForStudent,
    getAssignmentForTeacher,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    getSubmissions,
    getUserSubmissions,
    getUserAssignmentSubmissions,
    getAssignmentSubmissions,
    getAssignmentStatistics,
    getAssignmentStatisticsWithUsers,
    createSubmission,
    deleteSubmission,
    checkCode,
    checkMaxAttempts,
  }
} 