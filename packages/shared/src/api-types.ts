export interface ApiResponse<T> {
  data: T
  error?: string
}

export interface User {
  id: number
  email: string
  name: string
  created_at: string
}

export interface CreateUserRequest {
  email: string
  name: string
}
