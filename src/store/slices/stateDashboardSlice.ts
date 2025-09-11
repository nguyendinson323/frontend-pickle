import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '../index'
import { startLoading, stopLoading } from './loadingSlice'
import api from '../../services/api'

export interface StateProfile {
  id: number
  user_id: number
  name: string
  president_name: string | null
  president_title: string | null
  rfc: string | null
  state_id: number
  logo_url: string | null
  website: string | null
  social_media: string | null
  institutional_email: string | null
  phone: string | null
  affiliation_expires_at: string | null
  created_at: string
  updated_at: string
  state?: {
    id: number
    name: string
    short_code: string | null
  }
}

export interface StateUpcomingTournament {
  id: number
  name: string
  description: string | null
  tournament_type: string | null
  organizer_type: 'federation' | 'state' | 'club' | 'partner'
  organizer_id: number
  state_id: number
  venue_name: string | null
  venue_address: string | null
  start_date: string
  end_date: string
  registration_start: string
  registration_end: string
  entry_fee: number | null
  max_participants: number | null
  status: 'upcoming' | 'ongoing' | 'completed' | 'canceled'
  banner_url: string | null
  is_ranking: boolean
  ranking_multiplier: number
  created_at: string
  updated_at: string
}

export interface StatePendingApproval {
  type: string
  name: string
  location: string
  submittedDate: string
}

export interface StateRecentActivity {
  icon: string
  message: string
  time: string
}

export interface StateStats {
  totalPlayers: number
  totalClubs: number
  totalPartners: number
  totalCoaches: number
  totalCourts: number
  activePlayers: number
  verifiedPlayers: number
  tournamentsThisYear: number
  activeTournaments: number
  playerGrowth: number
  clubGrowth: number
  newClubs: number
  tournamentParticipation: number
  nationalRanking: number
}

export interface StateDashboardData {
  profile: StateProfile
  upcomingTournaments: StateUpcomingTournament[]
  affiliationStatus: string | null
  pendingApprovals: StatePendingApproval[]
  recentActivity: StateRecentActivity[]
  stats: StateStats
}

interface StateDashboardState {
  dashboardData: StateDashboardData | null
  isLoading: boolean
  error: string | null
}

const initialState: StateDashboardState = {
  dashboardData: null,
  isLoading: false,
  error: null
}

const stateDashboardSlice = createSlice({
  name: 'stateDashboard',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setStateDashboardData: (state, action: PayloadAction<StateDashboardData>) => {
      state.dashboardData = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    }
  }
})

export const {
  setError,
  setStateDashboardData,
  setLoading
} = stateDashboardSlice.actions

// Define response interfaces
interface StateDashboardResponse {
  profile: StateProfile
  upcomingTournaments: StateUpcomingTournament[]
  affiliationStatus: string | null
  pendingApprovals: StatePendingApproval[]
  recentActivity: StateRecentActivity[]
  stats: StateStats
}

// API Functions
export const fetchStateDashboard = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(startLoading('Loading state dashboard...'))
    dispatch(setError(null))
    
    const response = await api.get<StateDashboardResponse>('/api/state/dashboard')
    dispatch(setStateDashboardData(response.data))
    
    dispatch(stopLoading())
  } catch (error: unknown) {
    dispatch(setError((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to fetch state dashboard data'))
    dispatch(stopLoading())
  }
}

// Fetch state performance metrics
export const fetchStatePerformanceMetrics = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(startLoading('Loading performance metrics...'))
    
    const response = await api.get('/api/state/dashboard/metrics')
    // Handle the metrics response if needed
    
    dispatch(stopLoading())
    return response.data
  } catch (error: unknown) {
    dispatch(setError((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to fetch performance metrics'))
    dispatch(stopLoading())
  }
}

export default stateDashboardSlice.reducer