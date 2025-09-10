import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '../index'
import { startLoading, stopLoading } from './loadingSlice'
import api from '../../services/api'

interface ClubProfile {
  id: number
  user_id: number
  name: string
  rfc: string | null
  manager_name: string
  manager_title: string
  state_id: number
  club_type: string
  website: string | null
  social_media: string | null
  logo_url: string | null
  has_courts: boolean
  premium_expires_at: string | null
  affiliation_expires_at: string | null
  created_at: string
  updated_at: string
  state: {
    id: number
    name: string
    code: string
  }
}

interface ClubStats {
  totalMembers: number
  totalCourts: number
  activeTournaments: number
  monthlyRevenue: number
  memberGrowth: number
  memberSatisfaction: number
  todaysBookings: number
  weeklyUsage: number
}

interface ClubRecentMember {
  id: number
  full_name: string
  profile_photo_url: string | null
  nrtp_level: number
  created_at: string
}

interface ClubUpcomingTournament {
  id: number
  name: string
  description: string | null
  start_date: string
  end_date: string
  registration_deadline: string
  entry_fee: number
  max_participants: number
  status: string
  created_at: string
}

interface ClubDashboardData {
  profile: ClubProfile
  stats: ClubStats
  recentMembers: ClubRecentMember[]
  upcomingTournaments: ClubUpcomingTournament[]
  affiliationStatus: string | null
  premiumStatus: string | null
}

interface ClubDashboardState {
  dashboardData: ClubDashboardData | null
  isLoading: boolean
  error: string | null
}

const initialState: ClubDashboardState = {
  dashboardData: null,
  isLoading: false,
  error: null
}

const clubDashboardSlice = createSlice({
  name: 'clubDashboard',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setClubDashboardData: (state, action: PayloadAction<ClubDashboardData>) => {
      state.dashboardData = action.payload
    },
    clearClubDashboardData: (state) => {
      state.dashboardData = null
      state.error = null
    }
  }
})

export const {
  setLoading,
  setError,
  setClubDashboardData,
  clearClubDashboardData
} = clubDashboardSlice.actions

// Define response interface
interface ClubDashboardResponse {
  profile: ClubProfile
  courts: number
  upcomingTournaments: ClubUpcomingTournament[]
  members: number
  affiliationStatus: string | null
  premiumStatus: string | null
  stats: {
    totalMembers: number
    totalCourts: number
    activeTournaments: number
  }
  recentMembers: ClubRecentMember[]
  dashboardStats: {
    monthlyRevenue: number
    memberGrowth: number
    memberSatisfaction: number
    todaysBookings: number
    weeklyUsage: number
  }
}

// API Functions
export const fetchClubDashboard = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(startLoading('Loading club dashboard...'))
    
    // Fetch dashboard data from auth endpoint
    const dashboardResponse = await api.get<ClubDashboardResponse>('/api/auth/dashboard')
    
    // Fetch additional dashboard stats from multiple endpoints
    const [membersResponse, courtsResponse, tournamentsResponse] = await Promise.all([
      api.get('/api/club/members'),
      api.get('/api/club/courts'),
      api.get('/api/club/tournaments')
    ])
    
    const combinedStats: ClubStats = {
      totalMembers: dashboardResponse.data.stats.totalMembers,
      totalCourts: dashboardResponse.data.stats.totalCourts,
      activeTournaments: dashboardResponse.data.stats.activeTournaments,
      monthlyRevenue: dashboardResponse.data.dashboardStats?.monthlyRevenue || 0,
      memberGrowth: dashboardResponse.data.dashboardStats?.memberGrowth || 0,
      memberSatisfaction: dashboardResponse.data.dashboardStats?.memberSatisfaction || 0,
      todaysBookings: dashboardResponse.data.dashboardStats?.todaysBookings || 0,
      weeklyUsage: dashboardResponse.data.dashboardStats?.weeklyUsage || 0
    }
    
    const dashboardData: ClubDashboardData = {
      profile: dashboardResponse.data.profile,
      stats: combinedStats,
      recentMembers: dashboardResponse.data.recentMembers || [],
      upcomingTournaments: dashboardResponse.data.upcomingTournaments || [],
      affiliationStatus: dashboardResponse.data.affiliationStatus,
      premiumStatus: dashboardResponse.data.premiumStatus
    }
    
    dispatch(setClubDashboardData(dashboardData))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(setError('Failed to load club dashboard data'))
    dispatch(stopLoading())
    throw error
  }
}

export default clubDashboardSlice.reducer