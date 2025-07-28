interface TestCase {
  id: string
  input: string
  expected: string
  description: string
  assignmentId: string
  createdAt: string
  updatedAt: string
}

interface Assignment {
  id: string
  title: string
  description: string
  difficulty: number
  deadline: string
  teacherId: string
  createdAt: string
  updatedAt: string
  testCases: TestCase[]
  _count: {
    submissions: number
  }
}

interface CreateAssignment {
  title: string
  description: string
  difficulty: number
  deadline: string
  teacherId: string
  testCases: {
    input: string
    expected: string
    description: string
  }[]
}

interface UpdateAssignment {
  title?: string
  description?: string
  difficulty?: number
  deadline?: string
  teacherId?: string
  testCases?: {
    input: string
    expected: string
    description: string
  }[]
}

interface Submission {
  id: string
  userId: string
  assignmentId: string
  code: string
  eslintReport: any
  testResults: any
  score: number
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  createdAt: string
  updatedAt: string
  assignment: Assignment
}

interface CreateSubmission {
  userId: string
  assignmentId: string
  code: string
}

export const useAssignments = () => {
  const { get, post, patch, delete: del } = useApi()

  // Отримання всіх завдань (для студентів)
  const getAssignments = async (): Promise<Assignment[]> => {
    try {
      const response = await get<Assignment[]>('/assignments')
      return response
    } catch (error) {
      console.error('Error fetching assignments:', error)
      throw error
    }
  }

  // Отримання завдань викладача (для викладачів)
  const getTeacherAssignments = async (teacherId: string): Promise<Assignment[]> => {
    try {
      const response = await get<Assignment[]>(`/assignments/teacher/${teacherId}`)
      return response
    } catch (error) {
      console.error('Error fetching teacher assignments:', error)
      throw error
    }
  }

  // Отримання завдання за ID
  const getAssignment = async (id: string): Promise<Assignment> => {
    try {
      const response = await get<Assignment>(`/assignments/${id}`)
      return response
    } catch (error) {
      console.error('Error fetching assignment:', error)
      throw error
    }
  }

  // Створення завдання
  const createAssignment = async (assignment: CreateAssignment): Promise<Assignment> => {
    try {
      const response = await post<Assignment>('/assignments', assignment)
      return response
    } catch (error) {
      console.error('Error creating assignment:', error)
      throw error
    }
  }

  // Оновлення завдання
  const updateAssignment = async (id: string, assignment: UpdateAssignment): Promise<Assignment> => {
    try {
      const response = await patch<Assignment>(`/assignments/${id}`, assignment)
      return response
    } catch (error) {
      console.error('Error updating assignment:', error)
      throw error
    }
  }

  // Видалення завдання
  const deleteAssignment = async (id: string): Promise<void> => {
    try {
      await del(`/assignments/${id}`)
    } catch (error) {
      console.error('Error deleting assignment:', error)
      throw error
    }
  }

  // Отримання всіх подань
  const getSubmissions = async (): Promise<Submission[]> => {
    try {
      const response = await get<Submission[]>('/submissions')
      return response
    } catch (error) {
      console.error('Error fetching submissions:', error)
      throw error
    }
  }

  // Отримання подань користувача
  const getUserSubmissions = async (userId: string): Promise<Submission[]> => {
    try {
      const response = await get<Submission[]>(`/submissions/user/${userId}`)
      return response
    } catch (error) {
      console.error('Error fetching user submissions:', error)
      throw error
    }
  }

  // Отримання подань для завдання
  const getAssignmentSubmissions = async (assignmentId: string): Promise<Submission[]> => {
    try {
      const response = await get<Submission[]>(`/submissions/assignment/${assignmentId}`)
      return response
    } catch (error) {
      console.error('Error fetching assignment submissions:', error)
      throw error
    }
  }

  // Створення подання
  const createSubmission = async (submission: CreateSubmission): Promise<Submission> => {
    try {
      const response = await post<Submission>('/submissions', submission)
      return response
    } catch (error) {
      console.error('Error creating submission:', error)
      throw error
    }
  }

  // Видалення подання
  const deleteSubmission = async (id: string): Promise<void> => {
    try {
      await del(`/submissions/${id}`)
    } catch (error) {
      console.error('Error deleting submission:', error)
      throw error
    }
  }

  return {
    getAssignments,
    getTeacherAssignments,
    getAssignment,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    getSubmissions,
    getUserSubmissions,
    getAssignmentSubmissions,
    createSubmission,
    deleteSubmission
  }
} 