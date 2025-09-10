import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '../index'
import { startLoading, stopLoading } from './loadingSlice'
import api from '../../services/api'

export interface CoachStats {
  totalSessions: number
  upcomingSessionsCount: number
  totalStudents: number
  activeStudents: number
  totalCertifications: number
  activeCertifications: number
  monthlyRevenue: number
  averageRating: number
  completedSessions: number
  cancelledSessions: number
}

export interface CoachUpcomingSession {
  id: number
  student_id: number
  student_name: string
  session_date: string
  start_time: string
  end_time: string
  court_id: number | null
  court_name: string | null
  status: 'scheduled' | 'completed' | 'canceled'
  price: number
  payment_status: 'pending' | 'paid' | 'refunded'
}

export interface CoachRecentSession {
  id: number
  student_id: number
  student_name: string
  session_date: string
  start_time: string
  end_time: string
  court_id: number | null
  court_name: string | null
  status: 'scheduled' | 'completed' | 'canceled'
  price: number
  payment_status: 'pending' | 'paid' | 'refunded'
  rating: number | null
}

export interface CoachCertificationSummary {
  id: number
  name: string
  issuer: string
  issue_date: string
  expiry_date: string | null
  certificate_url: string | null
}

export interface CoachStudentProgress {
  id: number
  player_id: number
  player_name: string
  current_level: number
  sessions_count: number
  last_session_date: string | null
  improvement_rate: number
}

export interface CoachProfile {
  id: number
  full_name: string
  nrtp_level: number
  hourly_rate: number
  profile_photo_url: string | null
  affiliation_expires_at: string | null
  state_name: string
}

export interface CoachDashboardData {
  profile: CoachProfile
  stats: CoachStats
  upcomingSessions: CoachUpcomingSession[]
  recentSessions: CoachRecentSession[]
  certifications: CoachCertificationSummary[]
  studentProgress: CoachStudentProgress[]
}

export interface CoachDashboardState {
  dashboardData: CoachDashboardData | null
  isLoading: boolean
  error: string | null
}

const initialState: CoachDashboardState = {
  dashboardData: null,
  isLoading: false,
  error: null
}

const coachDashboardSlice = createSlice({
  name: 'coachDashboard',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setDashboardData: (state, action: PayloadAction<CoachDashboardData>) => {
      state.dashboardData = action.payload
    },
    updateSessionStatus: (state, action: PayloadAction<{ sessionId: number; status: 'scheduled' | 'completed' | 'canceled' }>) => {
      if (state.dashboardData) {
        // Update upcoming sessions
        const upcomingIndex = state.dashboardData.upcomingSessions.findIndex(s => s.id === action.payload.sessionId)
        if (upcomingIndex !== -1) {
          state.dashboardData.upcomingSessions[upcomingIndex].status = action.payload.status
          // If completed or cancelled, move to recent sessions
          if (action.payload.status === 'completed' || action.payload.status === 'canceled') {
            const session = state.dashboardData.upcomingSessions[upcomingIndex]
            state.dashboardData.recentSessions.unshift(session as CoachRecentSession)
            state.dashboardData.upcomingSessions.splice(upcomingIndex, 1)
          }
        }
        
        // Update recent sessions
        const recentIndex = state.dashboardData.recentSessions.findIndex(s => s.id === action.payload.sessionId)
        if (recentIndex !== -1) {
          state.dashboardData.recentSessions[recentIndex].status = action.payload.status
        }
      }
    },
    clearDashboard: (state) => {
      state.dashboardData = null
      state.error = null
    }
  }
})

export const {
  setLoading,
  setError,
  setDashboardData,
  updateSessionStatus,
  clearDashboard
} = coachDashboardSlice.actions

// Fetch coach dashboard data from multiple endpoints
export const fetchCoachDashboard = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(startLoading('Loading dashboard...'))
    
    // Fetch data from multiple coach endpoints in parallel
    const [
      sessionsResponse,
      certificationsResponse,
      studentsResponse,
      membershipResponse
    ] = await Promise.all([
      api.get('/api/coach/sessions'),
      api.get('/api/coach/certifications'),
      api.get('/api/coach/students'),
      api.get('/api/coach/membership')
    ])

    // Get current user profile from auth
    const profileResponse = await api.get('/api/auth/me')
    
    // Aggregate dashboard data
    const dashboardData: CoachDashboardData = {
      profile: {
        id: profileResponse.data.coach.id,
        full_name: profileResponse.data.coach.full_name,
        nrtp_level: profileResponse.data.coach.nrtp_level,
        hourly_rate: profileResponse.data.coach.hourly_rate,
        profile_photo_url: profileResponse.data.coach.profile_photo_url,
        affiliation_expires_at: profileResponse.data.coach.affiliation_expires_at,
        state_name: profileResponse.data.state?.name || ''
      },
      stats: sessionsResponse.data.stats,
      upcomingSessions: sessionsResponse.data.upcomingSessions || [],
      recentSessions: sessionsResponse.data.recentSessions || [],
      certifications: certificationsResponse.data.certifications || [],
      studentProgress: studentsResponse.data.studentProgress || []
    }

    dispatch(setDashboardData(dashboardData))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(setError('Failed to load dashboard data'))
    dispatch(stopLoading())
    throw error
  }
}

// Update session status
export const updateCoachSessionStatus = (sessionId: number, status: 'scheduled' | 'completed' | 'canceled') => async (dispatch: AppDispatch) => {
  try {
    dispatch(startLoading('Updating session...'))
    await api.put(`/api/coach/sessions/${sessionId}/status`, { status })
    dispatch(updateSessionStatus({ sessionId, status }))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(setError('Failed to update session'))
    dispatch(stopLoading())
    throw error
  }
}

export default coachDashboardSlice.reducer