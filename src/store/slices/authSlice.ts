import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import api from '../../services/api'
import { AppDispatch } from '../index'

interface User {
  id: number
  role: 'admin' | 'player' | 'coach' | 'club' | 'partner' | 'state'
  username: string
  email: string
  phone?: string
  is_active: boolean
  is_verified: boolean
  is_premium: boolean
  is_searchable: boolean
  last_login?: string
  created_at: string
  updated_at: string
}

interface AuthState {
  user: User | null
  profile: any | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  profile: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    setCredentials: (state, action: PayloadAction<{ user: User; token: string; profile?: any }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.profile = action.payload.profile || null
      state.isAuthenticated = true
      state.loading = false
      state.error = null
      localStorage.setItem('token', action.payload.token)
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
    setProfile: (state, action: PayloadAction<any>) => {
      state.profile = action.payload
    },
    clearCredentials: (state) => {
      state.user = null
      state.token = null
      state.profile = null
      state.isAuthenticated = false
      state.loading = false
      state.error = null
      localStorage.removeItem('token')
    },
    updateProfile: (state, action: PayloadAction<any>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload }
      }
    },
  },
})

export const { 
  setLoading,
  setError,
  clearError, 
  setCredentials, 
  setUser,
  setProfile,
  clearCredentials,
  updateProfile
} = authSlice.actions

// API function to login user (supports username or email)
export const loginUser = (credentials: { login: string; password: string }) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())
      
      // Enhanced login API call that returns both user auth data AND dashboard data
      const response = await api.post('/api/auth/login', credentials)
      
      const { user, token, profile, dashboardData } = response.data.data
      
      // Set authentication credentials
      dispatch(setCredentials({
        user,
        token,
        profile
      }))
      
      // Dispatch user-type specific dashboard data to the appropriate slice
      switch (user.role) {
        case 'admin':
          const { setAdminDashboardData } = await import('./adminSlice')
          if (dashboardData) {
            dispatch(setAdminDashboardData(dashboardData))
          }
          break
          
        case 'player':
          const { setPlayerDashboardData } = await import('./playerSlice')
          if (dashboardData) {
            dispatch(setPlayerDashboardData(dashboardData))
          }
          break
          
        case 'coach':
          const { setCoachDashboardData } = await import('./coachSlice')
          if (dashboardData) {
            dispatch(setCoachDashboardData(dashboardData))
          }
          break
          
        case 'club':
          const { setClubDashboardData } = await import('./clubSlice')
          if (dashboardData) {
            dispatch(setClubDashboardData(dashboardData))
          }
          break
          
        case 'partner':
          const { setPartnerDashboardData } = await import('./partnerSlice')
          if (dashboardData) {
            dispatch(setPartnerDashboardData(dashboardData))
          }
          break
          
        case 'state':
          const { setStateDashboardData } = await import('./stateSlice')
          if (dashboardData) {
            dispatch(setStateDashboardData(dashboardData))
          }
          break
          
        default:
          console.warn(`Unknown user role: ${user.role}`)
      }
      
      // Return user role for navigation routing
      return { 
        success: true, 
        userRole: user.role,
        redirectTo: getDashboardPath(user.role)
      }
      
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Login failed'))
      dispatch(setLoading(false))
      throw error
    }
  }
}

// Helper function to get dashboard path based on user role
const getDashboardPath = (role: string): string => {
  switch (role) {
    case 'admin':
      return '/admin/dashboard'
    case 'player':
      return '/player/dashboard'
    case 'coach':
      return '/coach/dashboard'
    case 'club':
      return '/club/dashboard'
    case 'partner':
      return '/partner/dashboard'
    case 'state':
      return '/state/dashboard'
    default:
      return '/dashboard' // fallback
  }
}

// API function to logout user
export const logoutUser = () => {
  return async (dispatch: AppDispatch) => {
    try {
      await api.post('/api/auth/logout')
      dispatch(clearCredentials())
      
      // Clear dashboard data on logout
      const { clearDashboardData } = await import('./dashboardSlice')
      dispatch(clearDashboardData())
    } catch (error: any) {
      // Even if logout fails on server, clear local credentials
      dispatch(clearCredentials())
      const { clearDashboardData } = await import('./dashboardSlice')
      dispatch(clearDashboardData())
    }
  }
}

// API function to get current user
export const getCurrentUser = () => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())
      
      const response = await api.get('/api/auth/me')
      
      dispatch(setCredentials({
        user: response.data.data.user,
        token: response.data.data.token,
        profile: response.data.data.profile
      }))
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Failed to get user'))
      dispatch(clearCredentials())
      dispatch(setLoading(false))
    }
  }
}

export default authSlice.reducer