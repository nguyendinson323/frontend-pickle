import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '../index'
import api from '../../services/api'

interface CoachProfile {
  id: number
  user_id: number
  full_name: string
  birth_date: string
  gender?: string
  state_id?: number
  curp?: string
  nrtp_level?: number
  profile_photo_url?: string
  id_document_url: string
  hourly_rate?: number
  affiliation_expires_at?: string
  state?: {
    id: number
    name: string
  }
}

interface CoachStats {
  totalSessions: number
  upcomingSessions: number
  totalStudents: number
  monthlyEarnings: number
  refereedMatches: number
  unreadNotifications: number
}

interface CoachingSession {
  id: number
  coach_id: number
  player_id: number
  session_date: string
  start_time: string
  end_time: string
  hourly_rate: number
  total_cost: number
  status: string
  notes?: string
  player: {
    id: number
    full_name: string
    nrtp_level?: number
  }
}

interface CoachCertification {
  id: number
  coach_id: number
  certification_name: string
  issuing_organization: string
  issue_date: string
  expiry_date?: string
  certificate_url?: string
  status: string
}

interface CoachAvailability {
  id: number
  coach_id: number
  day_of_week: number
  start_time: string
  end_time: string
  is_available: boolean
}

interface RefereeMatch {
  id: number
  tournament_id: number
  referee_id: number
  match_date: string
  match_time: string
  player1_name: string
  player2_name: string
  status: string
  tournament: {
    id: number
    name: string
    location: string
  }
}

interface CoachState {
  profile: CoachProfile | null
  stats: CoachStats | null
  sessions: CoachingSession[]
  certifications: CoachCertification[]
  availability: CoachAvailability[]
  refereeMatches: RefereeMatch[]
  notifications: any[]
  loading: boolean
  error: string | null
  activeTab: string
}

const initialState: CoachState = {
  profile: null,
  stats: null,
  sessions: [],
  certifications: [],
  availability: [],
  refereeMatches: [],
  notifications: [],
  loading: false,
  error: null,
  activeTab: 'profile'
}

const coachSlice = createSlice({
  name: 'coach',
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
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload
    },
    setCoachDashboardData: (state, action: PayloadAction<{
      profile: CoachProfile
      stats: CoachStats
      sessions: CoachingSession[]
      certifications: CoachCertification[]
      availability: CoachAvailability[]
      refereeMatches: RefereeMatch[]
      notifications: any[]
    }>) => {
      state.profile = action.payload.profile
      state.stats = action.payload.stats
      state.sessions = action.payload.sessions
      state.certifications = action.payload.certifications
      state.availability = action.payload.availability
      state.refereeMatches = action.payload.refereeMatches
      state.notifications = action.payload.notifications
      state.loading = false
      state.error = null
    },
    updateProfile: (state, action: PayloadAction<Partial<CoachProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload }
      }
    },
    addSession: (state, action: PayloadAction<CoachingSession>) => {
      state.sessions.unshift(action.payload)
    },
    updateSession: (state, action: PayloadAction<{ id: number; updates: Partial<CoachingSession> }>) => {
      const session = state.sessions.find(s => s.id === action.payload.id)
      if (session) {
        Object.assign(session, action.payload.updates)
      }
    },
    clearCoachData: (state) => {
      return initialState
    }
  }
})

export const {
  setLoading,
  setError,
  clearError,
  setActiveTab,
  setCoachDashboardData,
  updateProfile,
  addSession,
  updateSession,
  clearCoachData
} = coachSlice.actions

// API function to fetch coach dashboard data
export const fetchCoachDashboard = () => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())
      
      const response = await api.get('/api/coach/dashboard')
      
      dispatch(setCoachDashboardData(response.data.data))
      
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch coach dashboard'))
      dispatch(setLoading(false))
    }
  }
}

// API function to update coach profile
export const updateCoachProfile = (profileData: Partial<CoachProfile>) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())
      
      const response = await api.put('/api/coach/profile', profileData)
      
      dispatch(updateProfile(response.data.data))
      dispatch(setLoading(false))
      
      return response.data
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Failed to update profile'))
      dispatch(setLoading(false))
      throw error
    }
  }
}

// API function to create coaching session
export const createCoachingSession = (sessionData: Partial<CoachingSession>) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())
      
      const response = await api.post('/api/coach/sessions', sessionData)
      
      dispatch(addSession(response.data.data))
      dispatch(setLoading(false))
      
      return response.data
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Failed to create coaching session'))
      dispatch(setLoading(false))
      throw error
    }
  }
}

// API function to update coaching session
export const updateCoachingSession = (sessionId: number, updates: Partial<CoachingSession>) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())
      
      const response = await api.put(`/api/coach/sessions/${sessionId}`, updates)
      
      dispatch(updateSession({ id: sessionId, updates: response.data.data }))
      dispatch(setLoading(false))
      
      return response.data
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Failed to update coaching session'))
      dispatch(setLoading(false))
      throw error
    }
  }
}

export default coachSlice.reducer