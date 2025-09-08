// Export all types from individual modules
export * from './auth'
export type {
  Tournament as TournamentEntity,
  TournamentCategory,
  TournamentRegistration as TournamentReg,
  TournamentMatch,
  CreateTournamentRequest,
  CreateTournamentCategoryRequest,
  RegisterTournamentRequest,
  CreateMatchRequest,
  UpdateMatchRequest,
  TournamentFilters,
  TournamentsState
} from './tournaments'
export * from './courts'
export * from './communication'

// Common API response types
export interface ApiResponse<T> {
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  rows: T[]
  count: number
}

// Form types for registration
export interface UserSelectOption {
  value: import('./auth').UserRole
  label: string
  description: string
}

export interface RegistrationFormData {
  userType: import('./auth').UserRole | null
  userData: {
    username: string
    email: string
    password: string
    confirmPassword: string
    phone: string
  }
  profileData: Record<string, string | number | boolean>
  privacyAccepted: boolean
}

// Navigation types
export interface NavigationItem {
  label: string
  path: string
  roles?: import('./auth').UserRole[]
  icon?: string
}

// Generic state types
export interface BaseState {
  isLoading: boolean
  error: string | null
}

// Upload types for Cloudinary
export interface CloudinaryResponse {
  public_id: string
  secure_url: string
  format: string
  resource_type: string
  created_at: string
}

export interface UploadProgress {
  progress: number
  status: 'idle' | 'uploading' | 'success' | 'error'
  url?: string
  error?: string
}

// User management types
export interface UserFilters {
  role?: import('./auth').UserRole
  is_active?: boolean
  is_verified?: boolean
  limit?: number
  offset?: number
  search?: string
}

export interface UserStats {
  tournamentsPlayed?: number
  matchesPlayed?: number
  courtReservations?: number
  sessionsCompleted?: number
  certifications?: number
  matchesRefereed?: number
  members?: number
  courts?: number
  tournaments?: number
  players?: number
  clubs?: number
}

export interface UpdateProfileRequest {
  userUpdates?: {
    username?: string
    email?: string
    phone?: string
  }
  profileUpdates?: Record<string, string | number | boolean | null>
}

// State management root state type
export interface RootState {
  auth: import('./auth').AuthState
  tournaments: import('./tournaments').TournamentsState
  courts: import('./courts').CourtsState
  messages: import('./communication').MessagesState
  notifications: import('./communication').NotificationsState
}

// Redux action types
export interface AsyncThunkState {
  isLoading: boolean
  error: string | null
}