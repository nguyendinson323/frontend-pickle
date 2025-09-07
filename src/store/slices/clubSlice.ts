import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '../index'
import api from '../../services/api'

interface ClubProfile {
  id: number
  user_id: number
  name: string
  rfc?: string
  manager_name?: string
  manager_title?: string
  state_id?: number
  club_type?: string
  website?: string
  social_media?: string
  logo_url?: string
  has_courts: boolean
  premium_expires_at?: string
  affiliation_expires_at?: string
  state?: {
    id: number
    name: string
  }
}

interface ClubStats {
  totalCourts: number
  activeCourts: number
  todayReservations: number
  monthlyRevenue: number
  totalTournaments: number
  activeTournaments: number
  totalMembers: number
  unreadNotifications: number
}

interface ClubState {
  profile: ClubProfile | null
  stats: ClubStats | null
  courts: any[]
  reservations: any[]
  tournaments: any[]
  microsite: any
  loading: boolean
  error: string | null
  activeTab: string
}

const initialState: ClubState = {
  profile: null,
  stats: null,
  courts: [],
  reservations: [],
  tournaments: [],
  microsite: null,
  loading: false,
  error: null,
  activeTab: 'profile'
}

const clubSlice = createSlice({
  name: 'club',
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
    setClubDashboardData: (state, action: PayloadAction<any>) => {
      state.profile = action.payload.profile
      state.stats = action.payload.stats
      state.courts = action.payload.courts
      state.reservations = action.payload.reservations
      state.tournaments = action.payload.tournaments
      state.microsite = action.payload.microsite
      state.loading = false
      state.error = null
    },
    clearClubData: (state) => {
      return initialState
    }
  }
})

export const {
  setLoading,
  setError,
  clearError,
  setActiveTab,
  setClubDashboardData,
  clearClubData
} = clubSlice.actions

export const fetchClubDashboard = () => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())
      
      const response = await api.get('/api/club/dashboard')
      dispatch(setClubDashboardData(response.data.data))
      
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch club dashboard'))
      dispatch(setLoading(false))
    }
  }
}

export default clubSlice.reducer