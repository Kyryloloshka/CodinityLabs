export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface User {
  id: string
  email: string
  name: string
  role: 'STUDENT' | 'TEACHER'
  createdAt: string
  updatedAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  role: 'STUDENT' | 'TEACHER'
}

export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
  difficulty?: number
  status?: string
} 