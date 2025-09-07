import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import api from '../../services/api'
import { AppDispatch } from '../index'
import {
  PlayerProfile,
  CoachProfile, 
  ClubProfile,
  PartnerProfile,
  StateCommitteeProfile,
  TournamentRegistration,
  CourtReservation,
  PlayerRanking,
  NotificationData,
  PlayerMatchRequest,
  CoachingSession,
  PlayerDashboardStats,
  CoachDashboardStats,
  ClubDashboardStats,
  PartnerDashboardStats,
  StateDashboardStats
} from '../../types/dashboard'

// Dashboard data for different user types
interface PlayerDashboardData {
  profile: PlayerProfile | null
  tournaments: TournamentRegistration[]
  reservations: CourtReservation[]
  rankings: PlayerRanking[]
  matchRequests: PlayerMatchRequest[]
  stats: PlayerDashboardStats | null
}

interface CoachDashboardData {
  profile: CoachProfile | null
  sessions: CoachingSession[]
  refereedMatches: any[] // Tournament matches where coach was referee
  stats: CoachDashboardStats | null
}

interface ClubDashboardData {
  profile: ClubProfile | null
  courts: any[] // Club's courts
  reservations: CourtReservation[]
  tournaments: any[] // Club's tournaments  
  stats: ClubDashboardStats | null
}

interface PartnerDashboardData {
  profile: PartnerProfile | null
  courts: any[] // Partner's courts
  reservations: CourtReservation[]
  stats: PartnerDashboardStats | null
}

interface StateDashboardData {
  profile: StateCommitteeProfile | null
  tournaments: any[] // State tournaments
  members: any[] // State members overview
  stats: StateDashboardStats | null
}

interface DashboardState {
  // Current user type dashboard data
  currentUserType: 'player' | 'coach' | 'club' | 'partner' | 'state' | null
  
  // Type-specific dashboard data
  playerData: PlayerDashboardData
  coachData: CoachDashboardData
  clubData: ClubDashboardData
  partnerData: PartnerDashboardData
  stateData: StateDashboardData
  
  // Common data
  notifications: NotificationData[]
  
  // Loading and error states
  loading: boolean
  error: string | null
}

const initialPlayerData: PlayerDashboardData = {
  profile: null,
  tournaments: [],
  reservations: [],
  rankings: [],
  matchRequests: [],
  stats: null
}

const initialCoachData: CoachDashboardData = {
  profile: null,
  sessions: [],
  refereedMatches: [],
  stats: null
}

const initialClubData: ClubDashboardData = {
  profile: null,
  courts: [],
  reservations: [],
  tournaments: [],
  stats: null
}

const initialPartnerData: PartnerDashboardData = {
  profile: null,
  courts: [],
  reservations: [],
  stats: null
}

const initialStateData: StateDashboardData = {
  profile: null,
  tournaments: [],
  members: [],
  stats: null
}

const initialState: DashboardState = {
  currentUserType: null,
  playerData: initialPlayerData,
  coachData: initialCoachData,
  clubData: initialClubData,
  partnerData: initialPartnerData,
  stateData: initialStateData,
  notifications: [],
  loading: false,
  error: null
}

const dashboardSlice = createSlice({
  name: 'dashboard',
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
    setCurrentUserType: (state, action: PayloadAction<'player' | 'coach' | 'club' | 'partner' | 'state'>) => {
      state.currentUserType = action.payload
    },
    
    // Player data setters
    setPlayerDashboardData: (state, action: PayloadAction<PlayerDashboardData>) => {
      state.playerData = action.payload
      state.currentUserType = 'player'
      state.loading = false
      state.error = null
    },
    
    // Coach data setters
    setCoachDashboardData: (state, action: PayloadAction<CoachDashboardData>) => {
      state.coachData = action.payload
      state.currentUserType = 'coach'
      state.loading = false
      state.error = null
    },
    
    // Club data setters
    setClubDashboardData: (state, action: PayloadAction<ClubDashboardData>) => {
      state.clubData = action.payload
      state.currentUserType = 'club'
      state.loading = false
      state.error = null
    },
    
    // Partner data setters
    setPartnerDashboardData: (state, action: PayloadAction<PartnerDashboardData>) => {
      state.partnerData = action.payload
      state.currentUserType = 'partner'
      state.loading = false
      state.error = null
    },
    
    // State data setters
    setStateDashboardData: (state, action: PayloadAction<StateDashboardData>) => {
      state.stateData = action.payload
      state.currentUserType = 'state'
      state.loading = false
      state.error = null
    },
    
    // Notifications
    setNotifications: (state, action: PayloadAction<NotificationData[]>) => {
      state.notifications = action.payload
    },
    
    markNotificationAsRead: (state, action: PayloadAction<number>) => {
      const notification = state.notifications.find(n => n.id === action.payload)
      if (notification) {
        notification.is_read = true
      }
    },
    
    // Clear all dashboard data
    clearDashboardData: (state) => {
      state.currentUserType = null
      state.playerData = initialPlayerData
      state.coachData = initialCoachData
      state.clubData = initialClubData
      state.partnerData = initialPartnerData
      state.stateData = initialStateData
      state.notifications = []
      state.loading = false
      state.error = null
    }
  }
})

export const {
  setLoading,
  setError,
  clearError,
  setCurrentUserType,
  setPlayerDashboardData,
  setCoachDashboardData,
  setClubDashboardData,
  setPartnerDashboardData,
  setStateDashboardData,
  setNotifications,
  markNotificationAsRead,
  clearDashboardData
} = dashboardSlice.actions

// API function to fetch dashboard data
export const fetchDashboardData = () => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())
      
      const response = await api.get('/api/dashboard')
      
      // Set dashboard data based on user type
      const { userType, data } = response.data.data
      
      switch (userType) {
        case 'player':
          dispatch(setPlayerDashboardData(data))
          break
        case 'coach':
          dispatch(setCoachDashboardData(data))
          break
        case 'club':
          dispatch(setClubDashboardData(data))
          break
        case 'partner':
          dispatch(setPartnerDashboardData(data))
          break
        case 'state':
          dispatch(setStateDashboardData(data))
          break
      }
      
      // Set notifications (common to all user types)
      if (response.data.data.notifications) {
        dispatch(setNotifications(response.data.data.notifications))
      }
      
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch dashboard data'))
      dispatch(setLoading(false))
    }
  }
}

// API function to mark notification as read
export const markNotificationRead = (notificationId: number) => {
  return async (dispatch: AppDispatch) => {
    try {
      await api.put(`/api/notifications/${notificationId}/read`)
      dispatch(markNotificationAsRead(notificationId))
    } catch (error: any) {
      console.error('Failed to mark notification as read:', error)
    }
  }
}

// API function to update player profile
export const updatePlayerProfile = (profileData: any) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())
      
      const response = await api.put('/api/profile/player', profileData)
      
      // Update the player data in Redux with the response
      dispatch(setPlayerDashboardData(response.data.data))
      
      return response.data
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Failed to update profile'))
      dispatch(setLoading(false))
      throw error
    }
  }
}

// API function to change password
export const changePassword = (passwordData: { currentPassword: string; newPassword: string }) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())
      
      await api.put('/api/auth/change-password', passwordData)
      
      dispatch(setLoading(false))
      return { success: true }
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Failed to change password'))
      dispatch(setLoading(false))
      throw error
    }
  }
}

// API function to update privacy settings
export const updatePrivacySettings = () => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())
      
      const response = await api.put('/api/profile/privacy-settings')
      
      dispatch(setLoading(false))
      return response.data
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Failed to update privacy settings'))
      dispatch(setLoading(false))
      throw error
    }
  }
}

// API function to renew affiliation
export const renewAffiliation = () => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())
      
      const response = await api.post('/api/profile/renew-affiliation')
      
      // Refresh dashboard data after renewal
      dispatch(fetchDashboardData())
      
      return response.data
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Failed to renew affiliation'))
      dispatch(setLoading(false))
      throw error
    }
  }
}

export default dashboardSlice.reducer