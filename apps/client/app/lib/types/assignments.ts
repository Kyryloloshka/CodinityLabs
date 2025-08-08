export interface TestCase {
  id: string
  input: string
  expected: string
  description: string
  isPublic: boolean
  assignmentId: string
  createdAt: string
  updatedAt: string
}

export interface AssignmentSettings {
  id: string
  assignmentId: string
  timeout: number
  maxAttempts: number | null
  passingThreshold: number
  allowPartialScore: boolean
  strictMode: boolean
  createdAt: string
  updatedAt: string
}

export interface Assignment {
  id: string
  title: string
  description: string
  difficulty: number
  deadline: string
  teacherId: string
  createdAt: string
  updatedAt: string
  testCases: TestCase[]
  settings?: AssignmentSettings
  _count: {
    submissions: number
  }
}

export interface CreateAssignment {
  title: string
  description: string
  difficulty: number
  deadline: string
  teacherId: string
  testCases: {
    input: string
    expected: string
    description: string
    isPublic: boolean
  }[]
  settings?: {
    timeout: number
    maxAttempts: number | null
    passingThreshold: number
    allowPartialScore: boolean
    strictMode: boolean
  }
}

export interface UpdateAssignment {
  title?: string
  description?: string
  difficulty?: number
  deadline?: string
  teacherId?: string
  testCases?: {
    input: string
    expected: string
    description: string
    isPublic: boolean
  }[]
  settings?: {
    timeout?: number
    maxAttempts?: number | null
    passingThreshold?: number
    allowPartialScore?: boolean
    strictMode?: boolean
  }
} 