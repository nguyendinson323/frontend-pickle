import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '..'
import api from '../../services/api'
import {
  UserListItem,
  PlayerDetail,
  CoachDetail,
  ClubDetail,
  PartnerDetail,
  StateDetail,
  AdminStatistics,
  MessageTemplate,
  BroadcastMessage,
  CourtInfo,
  MembershipInfo,
  PaymentHistory,
  MicrositeInfo,
  TournamentAdmin,
  RankingChange,
  AdminLog,
  SuspendedAccount,
  ReportFilters,
  ExportRequest
} from '../../types/admin'

interface AdminState {
  // Dashboard Stats
  statistics: AdminStatistics | null
  
  // User Management
  users: UserListItem[]
  selectedUser: PlayerDetail | CoachDetail | ClubDetail | PartnerDetail | StateDetail | null
  userFilters: {
    role: string
    status: string
    search: string
    state: number | null
  }
  
  // Messaging
  messageTemplates: MessageTemplate[]
  messageHistory: any[]
  sentMessages: any[]
  
  // Courts
  courts: CourtInfo[]
  courtFilters: {
    state: number | null
    status: string
    search: string
  }
  
  // Payments & Memberships
  memberships: MembershipInfo[]
  payments: PaymentHistory[]
  subscriptions: any[]
  paymentFilters: {
    type: string
    status: string
    dateFrom: string
    dateTo: string
  }
  
  // Microsites
  microsites: MicrositeInfo[]
  selectedMicrosite: MicrositeInfo | null
  
  // Tournaments
  tournaments: TournamentAdmin[]
  selectedTournament: TournamentAdmin | null
  
  // Rankings
  rankingChanges: RankingChange[]
  rankings: any[]
  rankingCategories: any[]
  rankingPeriods: any[]
  
  // Support & Security
  adminLogs: AdminLog[]
  suspendedAccounts: SuspendedAccount[]
  securityLogs: any[]
  
  // UI State
  loading: boolean
  error: string | null
  activeTab: string
}

const initialState: AdminState = {
  statistics: null,
  users: [],
  selectedUser: null,
  userFilters: {
    role: '',
    status: '',
    search: '',
    state: null
  },
  messageTemplates: [],
  messageHistory: [],
  sentMessages: [],
  courts: [],
  courtFilters: {
    state: null,
    status: '',
    search: ''
  },
  memberships: [],
  payments: [],
  subscriptions: [],
  paymentFilters: {
    type: '',
    status: '',
    dateFrom: '',
    dateTo: ''
  },
  microsites: [],
  selectedMicrosite: null,
  tournaments: [],
  selectedTournament: null,
  rankingChanges: [],
  rankings: [],
  rankingCategories: [],
  rankingPeriods: [],
  adminLogs: [],
  suspendedAccounts: [],
  securityLogs: [],
  loading: false,
  error: null,
  activeTab: 'dashboard'
}

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    // Loading & Error States
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    
    // Statistics
    setStatistics: (state, action: PayloadAction<AdminStatistics>) => {
      state.statistics = action.payload
    },
    
    // User Management
    setUsers: (state, action: PayloadAction<UserListItem[]>) => {
      state.users = action.payload
    },
    setSelectedUser: (state, action: PayloadAction<any>) => {
      state.selectedUser = action.payload
    },
    updateUserFilters: (state, action: PayloadAction<Partial<typeof initialState.userFilters>>) => {
      state.userFilters = { ...state.userFilters, ...action.payload }
    },
    updateUserStatus: (state, action: PayloadAction<{ userId: number; status: string }>) => {
      const user = state.users.find(u => u.id === action.payload.userId)
      if (user) {
        user.status = action.payload.status as any
      }
    },
    
    // Messaging
    setMessageTemplates: (state, action: PayloadAction<MessageTemplate[]>) => {
      state.messageTemplates = action.payload
    },
    setMessageHistory: (state, action: PayloadAction<any[]>) => {
      state.messageHistory = action.payload
    },
    setSentMessages: (state, action: PayloadAction<any[]>) => {
      state.sentMessages = action.payload
    },
    
    // Courts
    setCourts: (state, action: PayloadAction<CourtInfo[]>) => {
      state.courts = action.payload
    },
    updateCourtFilters: (state, action: PayloadAction<Partial<typeof initialState.courtFilters>>) => {
      state.courtFilters = { ...state.courtFilters, ...action.payload }
    },
    
    // Payments & Memberships
    setMemberships: (state, action: PayloadAction<MembershipInfo[]>) => {
      state.memberships = action.payload
    },
    setPayments: (state, action: PayloadAction<PaymentHistory[]>) => {
      state.payments = action.payload
    },
    setSubscriptions: (state, action: PayloadAction<any[]>) => {
      state.subscriptions = action.payload
    },
    updatePaymentFilters: (state, action: PayloadAction<Partial<typeof initialState.paymentFilters>>) => {
      state.paymentFilters = { ...state.paymentFilters, ...action.payload }
    },
    
    // Microsites
    setMicrosites: (state, action: PayloadAction<MicrositeInfo[]>) => {
      state.microsites = action.payload
    },
    setSelectedMicrosite: (state, action: PayloadAction<MicrositeInfo | null>) => {
      state.selectedMicrosite = action.payload
    },
    updateMicrositeStatus: (state, action: PayloadAction<{ micrositeId: number; status: string }>) => {
      const microsite = state.microsites.find(m => m.id === action.payload.micrositeId)
      if (microsite) {
        microsite.status = action.payload.status as any
      }
    },
    
    // Tournaments
    setTournaments: (state, action: PayloadAction<TournamentAdmin[]>) => {
      state.tournaments = action.payload
    },
    setSelectedTournament: (state, action: PayloadAction<TournamentAdmin | null>) => {
      state.selectedTournament = action.payload
    },
    
    // Rankings
    setRankingChanges: (state, action: PayloadAction<RankingChange[]>) => {
      state.rankingChanges = action.payload
    },
    setRankings: (state, action: PayloadAction<any[]>) => {
      state.rankings = action.payload
    },
    setRankingCategories: (state, action: PayloadAction<any[]>) => {
      state.rankingCategories = action.payload
    },
    setRankingPeriods: (state, action: PayloadAction<any[]>) => {
      state.rankingPeriods = action.payload
    },
    
    // Support & Security
    setAdminLogs: (state, action: PayloadAction<AdminLog[]>) => {
      state.adminLogs = action.payload
    },
    setSuspendedAccounts: (state, action: PayloadAction<SuspendedAccount[]>) => {
      state.suspendedAccounts = action.payload
    },
    setSecurityLogs: (state, action: PayloadAction<any[]>) => {
      state.securityLogs = action.payload
    },
    
    // UI State
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload
    },
    
    // Set complete admin dashboard data (for login)
    setAdminDashboardData: (state, action: PayloadAction<any>) => {
      if (action.payload.statistics) state.statistics = action.payload.statistics
      if (action.payload.users) state.users = action.payload.users
      if (action.payload.courts) state.courts = action.payload.courts
      if (action.payload.payments) state.payments = action.payload.payments
      if (action.payload.subscriptions) state.subscriptions = action.payload.subscriptions
      if (action.payload.microsites) state.microsites = action.payload.microsites
      if (action.payload.tournaments) state.tournaments = action.payload.tournaments
      if (action.payload.rankings) state.rankings = action.payload.rankings
      if (action.payload.rankingCategories) state.rankingCategories = action.payload.rankingCategories
      if (action.payload.rankingPeriods) state.rankingPeriods = action.payload.rankingPeriods
      if (action.payload.sentMessages) state.sentMessages = action.payload.sentMessages
      if (action.payload.adminLogs) state.adminLogs = action.payload.adminLogs
      if (action.payload.suspendedAccounts) state.suspendedAccounts = action.payload.suspendedAccounts
      if (action.payload.securityLogs) state.securityLogs = action.payload.securityLogs
      state.loading = false
      state.error = null
    }
  }
})

export const {
  setLoading,
  setError,
  clearError,
  setStatistics,
  setUsers,
  setSelectedUser,
  updateUserFilters,
  updateUserStatus,
  setMessageTemplates,
  setMessageHistory,
  setSentMessages,
  setCourts,
  updateCourtFilters,
  setMemberships,
  setPayments,
  setSubscriptions,
  updatePaymentFilters,
  setMicrosites,
  setSelectedMicrosite,
  updateMicrositeStatus,
  setTournaments,
  setSelectedTournament,
  setRankingChanges,
  setRankings,
  setRankingCategories,
  setRankingPeriods,
  setAdminLogs,
  setSuspendedAccounts,
  setSecurityLogs,
  setActiveTab,
  setAdminDashboardData
} = adminSlice.actions

// API Functions

// Fetch admin dashboard data
export const fetchAdminDashboard = () => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())
      
      const response = await api.get('/api/admin/dashboard')
      const { statistics, recentUsers, recentPayments, activeTournaments, adminLogs } = response.data.data
      
      dispatch(setStatistics(statistics))
      dispatch(setUsers(recentUsers))
      dispatch(setPayments(recentPayments))
      dispatch(setTournaments(activeTournaments))
      dispatch(setAdminLogs(adminLogs))
      
      dispatch(setLoading(false))
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch admin dashboard'))
      dispatch(setLoading(false))
    }
  }
}

// Fetch all users with filters
export const fetchUsers = (filters?: Partial<typeof initialState.userFilters>) => {
  return async (dispatch: AppDispatch, getState: any) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())
      
      const currentFilters = filters || getState().admin.userFilters
      const response = await api.get('/api/admin/users', { params: currentFilters })
      
      dispatch(setUsers(response.data.data))
      dispatch(setLoading(false))
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch users'))
      dispatch(setLoading(false))
    }
  }
}

// Fetch user details
export const fetchUserDetails = (userId: number) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())
      
      const response = await api.get(`/api/admin/users/${userId}`)
      
      dispatch(setSelectedUser(response.data.data))
      dispatch(setLoading(false))
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch user details'))
      dispatch(setLoading(false))
    }
  }
}

// Update user status
export const updateUserAccountStatus = (userId: number, status: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())
      
      await api.put(`/api/admin/users/${userId}/status`, { status })
      
      dispatch(updateUserStatus({ userId, status }))
      dispatch(setLoading(false))
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Failed to update user status'))
      dispatch(setLoading(false))
    }
  }
}

// Send broadcast message
export const sendBroadcastMessage = (message: BroadcastMessage) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())
      
      await api.post('/api/admin/messages/broadcast', message)
      
      // Refresh message history
      const historyResponse = await api.get('/api/admin/messages/history')
      dispatch(setMessageHistory(historyResponse.data.data))
      
      dispatch(setLoading(false))
      return { success: true }
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Failed to send broadcast message'))
      dispatch(setLoading(false))
      throw error
    }
  }
}

// Fetch courts
export const fetchCourts = (filters?: Partial<typeof initialState.courtFilters>) => {
  return async (dispatch: AppDispatch, getState: any) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())
      
      const currentFilters = filters || getState().admin.courtFilters
      const response = await api.get('/api/admin/courts', { params: currentFilters })
      
      dispatch(setCourts(response.data.data))
      dispatch(setLoading(false))
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch courts'))
      dispatch(setLoading(false))
    }
  }
}

// Fetch memberships
export const fetchMemberships = () => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())
      
      const response = await api.get('/api/admin/memberships')
      
      dispatch(setMemberships(response.data.data))
      dispatch(setLoading(false))
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch memberships'))
      dispatch(setLoading(false))
    }
  }
}

// Fetch payment history
export const fetchPaymentHistory = (filters?: Partial<typeof initialState.paymentFilters>) => {
  return async (dispatch: AppDispatch, getState: any) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())
      
      const currentFilters = filters || getState().admin.paymentFilters
      const response = await api.get('/api/admin/payments', { params: currentFilters })
      
      dispatch(setPayments(response.data.data))
      dispatch(setLoading(false))
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch payment history'))
      dispatch(setLoading(false))
    }
  }
}

// Fetch microsites
export const fetchMicrosites = () => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())
      
      const response = await api.get('/api/admin/microsites')
      
      dispatch(setMicrosites(response.data.data))
      dispatch(setLoading(false))
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch microsites'))
      dispatch(setLoading(false))
    }
  }
}

// Update microsite status
export const updateMicrosite = (micrositeId: number, status: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())
      
      await api.put(`/api/admin/microsites/${micrositeId}`, { status })
      
      dispatch(updateMicrositeStatus({ micrositeId, status }))
      dispatch(setLoading(false))
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Failed to update microsite'))
      dispatch(setLoading(false))
    }
  }
}

// Fetch tournaments
export const fetchAdminTournaments = () => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())
      
      const response = await api.get('/api/admin/tournaments')
      
      dispatch(setTournaments(response.data.data))
      dispatch(setLoading(false))
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch tournaments'))
      dispatch(setLoading(false))
    }
  }
}

// Fetch ranking changes
export const fetchRankingChanges = () => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())
      
      const response = await api.get('/api/admin/rankings/changes')
      
      dispatch(setRankingChanges(response.data.data))
      dispatch(setLoading(false))
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch ranking changes'))
      dispatch(setLoading(false))
    }
  }
}

// Adjust player ranking
export const adjustPlayerRanking = (playerId: number, newPoints: number, reason: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())
      
      await api.post('/api/admin/rankings/adjust', {
        playerId,
        newPoints,
        reason
      })
      
      // Refresh ranking changes
      dispatch(fetchRankingChanges())
      
      dispatch(setLoading(false))
      return { success: true }
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Failed to adjust ranking'))
      dispatch(setLoading(false))
      throw error
    }
  }
}

// Export data
export const exportData = (request: ExportRequest) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())
      
      const response = await api.post('/api/admin/export', request, {
        responseType: 'blob'
      })
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `export_${request.type}_${Date.now()}.${request.format}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      
      dispatch(setLoading(false))
      return { success: true }
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Failed to export data'))
      dispatch(setLoading(false))
      throw error
    }
  }
}

// Reset user password
export const resetUserPassword = (userId: number) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())
      
      const response = await api.post(`/api/admin/users/${userId}/reset-password`)
      
      dispatch(setLoading(false))
      return { success: true, tempPassword: response.data.tempPassword }
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Failed to reset password'))
      dispatch(setLoading(false))
      throw error
    }
  }
}

// Suspend user account
export const suspendUserAccount = (userId: number, reason: string, duration?: number) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())
      
      await api.post(`/api/admin/users/${userId}/suspend`, {
        reason,
        duration
      })
      
      // Refresh suspended accounts
      const response = await api.get('/api/admin/suspended-accounts')
      dispatch(setSuspendedAccounts(response.data.data))
      
      dispatch(setLoading(false))
      return { success: true }
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Failed to suspend account'))
      dispatch(setLoading(false))
      throw error
    }
  }
}

// Fetch suspended accounts
export const getSuspendedAccounts = () => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())
      
      const response = await api.get('/api/admin/suspended-accounts')
      
      dispatch(setSuspendedAccounts(response.data.data))
      dispatch(setLoading(false))
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch suspended accounts'))
      dispatch(setLoading(false))
    }
  }
}

// Unsuspend user account
export const unsuspendUserAccount = (userId: number) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())
      
      await api.post(`/api/admin/users/${userId}/unsuspend`)
      
      // Refresh suspended accounts
      dispatch(getSuspendedAccounts())
      
      dispatch(setLoading(false))
      return { success: true }
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Failed to unsuspend account'))
      dispatch(setLoading(false))
      throw error
    }
  }
}

// Create new admin account
export const createAdminAccount = (adminData: { username: string; email: string; permissions: string[] }) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())
      
      const response = await api.post('/api/admin/admins/create', adminData)
      
      dispatch(setLoading(false))
      return { success: true, data: response.data.data }
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Failed to create admin account'))
      dispatch(setLoading(false))
      throw error
    }
  }
}

// Fetch message templates
export const fetchMessageTemplates = () => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())
      
      const response = await api.get('/api/admin/messages/templates')
      
      dispatch(setMessageTemplates(response.data.data))
      dispatch(setLoading(false))
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch message templates'))
      dispatch(setLoading(false))
    }
  }
}

// Fetch message history
export const fetchMessageHistory = () => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())
      
      const response = await api.get('/api/admin/messages/history')
      
      dispatch(setMessageHistory(response.data.data))
      dispatch(setLoading(false))
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch message history'))
      dispatch(setLoading(false))
    }
  }
}

export default adminSlice.reducer