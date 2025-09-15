import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '../index'
import api from '../../services/api'

// Types for Partner Dashboard
export interface PartnerProfile {
  id: number
  business_name: string
  contact_name?: string
  contact_title?: string
  partner_type?: string
  state?: {
    id: number
    name: string
  }
  website?: string
  social_media?: string
  logo_url?: string
  has_courts: boolean
  premium_expires_at?: string
  user: {
    id: number
    username: string
    email: string
    phone?: string
    is_premium: boolean
  }
}

export interface PartnerUpcomingEvent {
  id: number
  name: string
  type: string
  date: string
  duration: string
  expected_revenue: number
  registrations: number
}

export interface PartnerRecentBooking {
  id: number
  player_name: string
  court_number: number
  date: string
  time: string
  amount: number
  status: string
}

export interface PartnerStats {
  total_courts: number
  active_tournaments: number
  monthly_bookings: number
  monthly_revenue: number
  court_utilization: number
  customer_rating: number
  repeat_customers: number
  revenue_growth: number
  booking_trend: number
}

export interface PartnerDashboardData {
  profile: PartnerProfile
  upcomingEvents: PartnerUpcomingEvent[]
  recentBookings: PartnerRecentBooking[]
  stats: PartnerStats
  premium_status: string | null
}

export interface PartnerDashboardResponse {
  profile: PartnerProfile
  upcomingEvents: PartnerUpcomingEvent[]
  recentBookings: PartnerRecentBooking[]
  stats: PartnerStats
  premiumStatus: string | null
}

interface PartnerDashboardState {
  dashboardData: PartnerDashboardData | null
  isLoading: boolean
  error: string | null
}

const initialState: PartnerDashboardState = {
  dashboardData: null,
  isLoading: false,
  error: null
}

export const partnerDashboardSlice = createSlice({
  name: 'partnerDashboard',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.isLoading = true
      state.error = null
    },
    stopLoading: (state) => {
      state.isLoading = false
    },
    setPartnerDashboardData: (state, action: PayloadAction<PartnerDashboardData>) => {
      state.dashboardData = action.payload
      state.isLoading = false
      state.error = null
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.isLoading = false
    },
    clearError: (state) => {
      state.error = null
    },
    clearDashboardData: (state) => {
      state.dashboardData = null
      state.error = null
    }
  }
})

export const {
  startLoading,
  stopLoading,
  setPartnerDashboardData,
  setError,
  clearError,
  clearDashboardData
} = partnerDashboardSlice.actions

// Async thunk to fetch partner dashboard data
export const fetchPartnerDashboard = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(startLoading())
    const response = await api.get('/api/auth/dashboard')

    const dashboardData: PartnerDashboardData = {
      profile: response.data.profile,
      upcomingEvents: response.data.upcomingEvents || [],
      recentBookings: response.data.recentBookings || [],
      stats: response.data.stats,
      premium_status: response.data.premiumStatus
    }

    dispatch(setPartnerDashboardData(dashboardData))
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch partner dashboard data'
    dispatch(setError(errorMessage))
  } finally {
    dispatch(stopLoading())
  }
}

export default partnerDashboardSlice.reducer