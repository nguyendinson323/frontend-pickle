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
    
    // Fetch basic dashboard data first, then fetch detailed data from other endpoints
    const [
      dashboardResponse,
      sessionsResponse,
      certificationsResponse,
      studentsResponse
    ] = await Promise.all([
      api.get('/api/coach/dashboard'),
      api.get('/api/coach/sessions'),
      api.get('/api/coach/certifications'),
      api.get('/api/coach/students')
    ])

    const dashboardData: any = dashboardResponse.data
    const coachProfile = dashboardData.profile
    const user = dashboardData.user
    
    // Transform sessions data to separate upcoming from recent
    const sessionsData: any = sessionsResponse.data
    const allSessions = sessionsData.sessions || []
    const upcomingSessions = allSessions.filter((session: any) => 
      session.status === 'scheduled' && new Date(session.session_date) >= new Date()
    ).map((session: any) => ({
      id: session.id,
      student_id: session.player_id,
      student_name: session.player.full_name,
      session_date: session.session_date,
      start_time: session.start_time,
      end_time: session.end_time,
      court_id: session.court_id,
      court_name: session.court?.name || null,
      status: session.status,
      price: parseFloat(session.price),
      payment_status: session.payment_status
    }))

    const recentSessions = allSessions.filter((session: any) => 
      session.status !== 'scheduled' || new Date(session.session_date) < new Date()
    ).map((session: any) => ({
      id: session.id,
      student_id: session.player_id,
      student_name: session.player.full_name,
      session_date: session.session_date,
      start_time: session.start_time,
      end_time: session.end_time,
      court_id: session.court_id,
      court_name: session.court?.name || null,
      status: session.status,
      price: parseFloat(session.price),
      payment_status: session.payment_status,
      rating: session.rating
    }))

    // Transform students data for progress
    const studentsData: any = studentsResponse.data
    const studentProgress = studentsData.students?.map((student: any) => ({
      id: student.id,
      player_id: student.id,
      player_name: student.full_name,
      current_level: parseFloat(student.nrtp_level),
      sessions_count: student.sessions?.total_sessions || 0,
      last_session_date: student.sessions?.last_session_date,
      improvement_rate: student.progress?.improvement || 0
    })) || []

    // Aggregate stats from multiple sources
    const sessionStats = sessionsData.stats || {}
    const certificationsData: any = certificationsResponse.data
    const certStats = certificationsData.stats || {}
    const studentStats = studentsData.stats || {}

    const aggregatedStats: CoachStats = {
      totalSessions: sessionStats.total_sessions || 0,
      upcomingSessionsCount: upcomingSessions.length,
      totalStudents: studentStats.total_students || 0,
      activeStudents: studentStats.active_students || 0,
      totalCertifications: certStats.total_certifications || 0,
      activeCertifications: certStats.active_certifications || 0,
      monthlyRevenue: sessionStats.total_earnings || 0,
      averageRating: sessionStats.average_rating || 0,
      completedSessions: sessionStats.completed_sessions || 0,
      cancelledSessions: sessionStats.canceled_sessions || 0
    }

    // Aggregate dashboard data
    const finalDashboardData: CoachDashboardData = {
      profile: {
        id: coachProfile.id || 1,
        full_name: coachProfile.full_name || '',
        nrtp_level: parseFloat(coachProfile.nrtp_level) || 0,
        hourly_rate: parseFloat(coachProfile.hourly_rate) || 0,
        profile_photo_url: coachProfile.profile_photo_url || null,
        affiliation_expires_at: coachProfile.affiliation_expires_at || null,
        state_name: coachProfile.state_name || ''
      },
      stats: aggregatedStats,
      upcomingSessions,
      recentSessions,
      certifications: certificationsData.certifications || [],
      studentProgress
    }

    // Store user data for profile access
    const userData = {
      ...user,
      dashboard: finalDashboardData
    }
    localStorage.setItem('user', JSON.stringify(userData))

    dispatch(setDashboardData(finalDashboardData))
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