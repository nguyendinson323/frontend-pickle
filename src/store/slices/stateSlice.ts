import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '../index'
import api from '../../services/api'

interface StateProfile {
  id: number
  user_id: number
  name: string
  president_name?: string
  president_title?: string
  rfc?: string
  state_id: number
  logo_url?: string
  website?: string
  social_media?: string
  institutional_email?: string
  phone?: string
  affiliation_expires_at?: string
  state?: {
    id: number
    name: string
  }
}

interface StateStats {
  totalMembers: number
  totalClubs: number
  totalTournaments: number
  activeTournaments: number
  stateRanking?: number
  unreadNotifications: number
}

interface StateState {
  profile: StateProfile | null
  stats: StateStats | null
  members: any[]
  tournaments: any[]
  microsite: any
  reports: any[]
  loading: boolean
  error: string | null
  activeTab: string
}

const initialState: StateState = {
  profile: null,
  stats: null,
  members: [],
  tournaments: [],
  microsite: null,
  reports: [],
  loading: false,
  error: null,
  activeTab: 'profile'
}

const stateSlice = createSlice({
  name: 'state',
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
    setStateDashboardData: (state, action: PayloadAction<any>) => {
      state.profile = action.payload.profile
      state.stats = action.payload.stats
      state.members = action.payload.members
      state.tournaments = action.payload.tournaments
      state.microsite = action.payload.microsite
      state.reports = action.payload.reports
      state.loading = false
      state.error = null
    },
    clearStateData: (state) => {
      return initialState
    }
  }
})

export const {
  setLoading,
  setError,
  clearError,
  setActiveTab,
  setStateDashboardData,
  clearStateData
} = stateSlice.actions

export const fetchStateDashboard = () => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())
      
      const response = await api.get('/api/state/dashboard')
      dispatch(setStateDashboardData(response.data.data))
      
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch state dashboard'))
      dispatch(setLoading(false))
    }
  }
}

export default stateSlice.reducer