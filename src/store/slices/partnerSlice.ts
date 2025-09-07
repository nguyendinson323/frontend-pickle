import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '../index'
import api from '../../services/api'

interface PartnerProfile {
  id: number
  user_id: number
  business_name: string
  rfc?: string
  contact_name?: string
  contact_title?: string
  partner_type?: string
  state_id?: number
  website?: string
  social_media?: string
  logo_url?: string
  has_courts: boolean
  premium_expires_at?: string
  state?: {
    id: number
    name: string
  }
}

interface PartnerStats {
  totalCourts: number
  todayReservations: number
  monthlyRevenue: number
  activeEvents: number
  totalBookings: number
  unreadNotifications: number
}

interface PartnerState {
  profile: PartnerProfile | null
  stats: PartnerStats | null
  courts: any[]
  reservations: any[]
  tournaments: any[]
  microsite: any
  loading: boolean
  error: string | null
  activeTab: string
}

const initialState: PartnerState = {
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

const partnerSlice = createSlice({
  name: 'partner',
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
    setPartnerDashboardData: (state, action: PayloadAction<any>) => {
      state.profile = action.payload.profile
      state.stats = action.payload.stats
      state.courts = action.payload.courts
      state.reservations = action.payload.reservations
      state.tournaments = action.payload.tournaments
      state.microsite = action.payload.microsite
      state.loading = false
      state.error = null
    },
    clearPartnerData: (state) => {
      return initialState
    }
  }
})

export const {
  setLoading,
  setError,
  clearError,
  setActiveTab,
  setPartnerDashboardData,
  clearPartnerData
} = partnerSlice.actions

export const fetchPartnerDashboard = () => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())
      
      const response = await api.get('/api/partner/dashboard')
      dispatch(setPartnerDashboardData(response.data.data))
      
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch partner dashboard'))
      dispatch(setLoading(false))
    }
  }
}

export default partnerSlice.reducer