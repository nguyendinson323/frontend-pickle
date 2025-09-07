import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '../index'
import api from '../../services/api'

interface PlayerProfile {
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
  nationality?: string
  club_id?: number
  ranking_position?: number
  affiliation_expires_at?: string
  state?: {
    id: number
    name: string
  }
  club?: {
    id: number
    name: string
  }
}

interface PlayerStats {
  totalTournaments: number
  activeTournaments: number
  totalReservations: number
  upcomingReservations: number
  currentRanking?: number
  totalPoints: number
  unreadNotifications: number
}

interface TournamentRegistration {
  id: number
  tournament_id: number
  player_id: number
  category_id: number
  registration_date: string
  status: string
  tournament: {
    id: number
    name: string
    start_date: string
    end_date: string
    location: string
    status: string
  }
  category: {
    id: number
    name: string
    description: string
  }
}

interface CourtReservation {
  id: number
  court_id: number
  player_id: number
  reservation_date: string
  start_time: string
  end_time: string
  status: string
  total_cost: number
  court: {
    id: number
    name: string
    location: string
    hourly_rate: number
  }
}

interface PlayerRanking {
  id: number
  player_id: number
  category_id: number
  period_id: number
  ranking_position: number
  current_points: number
  previous_points?: number
  matches_played: number
  created_at: string
  category: {
    id: number
    name: string
    description: string
  }
  period: {
    id: number
    name: string
    start_date: string
    end_date: string
  }
}

interface PlayerState {
  profile: PlayerProfile | null
  stats: PlayerStats | null
  tournaments: TournamentRegistration[]
  reservations: CourtReservation[]
  rankings: PlayerRanking[]
  matchRequests: any[]
  notifications: any[]
  loading: boolean
  error: string | null
  activeTab: string
}

const initialState: PlayerState = {
  profile: null,
  stats: null,
  tournaments: [],
  reservations: [],
  rankings: [],
  matchRequests: [],
  notifications: [],
  loading: false,
  error: null,
  activeTab: 'credential'
}

const playerSlice = createSlice({
  name: 'player',
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
    setPlayerDashboardData: (state, action: PayloadAction<{
      profile: PlayerProfile
      stats: PlayerStats
      tournaments: TournamentRegistration[]
      reservations: CourtReservation[]
      rankings: PlayerRanking[]
      matchRequests: any[]
      notifications: any[]
    }>) => {
      state.profile = action.payload.profile
      state.stats = action.payload.stats
      state.tournaments = action.payload.tournaments
      state.reservations = action.payload.reservations
      state.rankings = action.payload.rankings
      state.matchRequests = action.payload.matchRequests
      state.notifications = action.payload.notifications
      state.loading = false
      state.error = null
    },
    updateProfile: (state, action: PayloadAction<Partial<PlayerProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload }
      }
    },
    clearPlayerData: (state) => {
      return initialState
    }
  }
})

export const {
  setLoading,
  setError,
  clearError,
  setActiveTab,
  setPlayerDashboardData,
  updateProfile,
  clearPlayerData
} = playerSlice.actions

// API function to fetch player dashboard data
export const fetchPlayerDashboard = () => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())
      
      const response = await api.get('/api/player/dashboard')
      
      dispatch(setPlayerDashboardData(response.data.data))
      
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch player dashboard'))
      dispatch(setLoading(false))
    }
  }
}

// API function to update player profile
export const updatePlayerProfile = (profileData: Partial<PlayerProfile>) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())
      
      const response = await api.put('/api/player/profile', profileData)
      
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

// API function to find nearby players (premium feature)
export const findNearbyPlayers = (searchParams: { location: string; radius: number; skill_level?: number }) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())
      
      const response = await api.post('/api/player/find-nearby', searchParams)
      
      dispatch(setLoading(false))
      return response.data.data
      
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Failed to find nearby players'))
      dispatch(setLoading(false))
      throw error
    }
  }
}

export default playerSlice.reducer