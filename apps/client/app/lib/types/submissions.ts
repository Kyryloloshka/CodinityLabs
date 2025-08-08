import type { Assignment } from './assignments'

export interface Submission {
  id: string
  userId: string
  assignmentId: string
  code: string
  language?: string
  eslintReport: any
  testResults: any
  score: number
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  createdAt: string
  updatedAt: string
  assignment: Assignment
}

export interface CreateSubmission {
  userId: string
  assignmentId: string
  code: string
  language?: string
}

export interface CheckCodeRequest {
  code: string
  language?: string
  assignmentId?: string
  testCases?: {
    input: string
    expected: string
    description: string
  }[]
}

export interface LintError {
  ruleId: string
  severity: number
  message: string
  line: number
  column: number
}

export interface TestResult {
  passed: boolean
  actual: string
  expected: string
  description: string
  input: string
  timeout?: boolean
}

export interface CheckCodeResponse {
  lint: LintError[]
  tests: TestResult[]
  score: number
} 