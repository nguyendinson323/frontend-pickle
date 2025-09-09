import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { UserListItem, PlayerDetail, CoachDetail, ClubDetail, PartnerDetail, StateDetail } from '../../types/admin'

interface UserFilter {
  role: string
  status: string
  state: string
  affiliation: string
  searchTerm: string
  dateFrom: string
  dateTo: string
}

interface AdminUserManagementState {
  users: UserListItem[]
  selectedUser: PlayerDetail | CoachDetail | ClubDetail | PartnerDetail | StateDetail | null
  userStats: {
    totalUsers: number
    activeUsers: number
    inactiveUsers: number
    suspendedUsers: number
    verifiedUsers: number
    premiumUsers: number
    playerCount: number
    coachCount: number
    clubCount: number
    partnerCount: number
    stateCount: number
  }
  userFilter: UserFilter
  loading: boolean
  error: string | null
  selectedUsers: number[]
  exportLoading: boolean
}

const initialState: AdminUserManagementState = {
  users: [],
  selectedUser: null,
  userStats: {
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    suspendedUsers: 0,
    verifiedUsers: 0,
    premiumUsers: 0,
    playerCount: 0,
    coachCount: 0,
    clubCount: 0,
    partnerCount: 0,
    stateCount: 0
  },
  userFilter: {
    role: '',
    status: '',
    state: '',
    affiliation: '',
    searchTerm: '',
    dateFrom: '',
    dateTo: ''
  },
  loading: false,
  error: null,
  selectedUsers: [],
  exportLoading: false
}

const adminUserManagementSlice = createSlice({
  name: 'adminUserManagement',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setUsers: (state, action: PayloadAction<UserListItem[]>) => {
      state.users = action.payload
    },
    setSelectedUser: (state, action: PayloadAction<PlayerDetail | CoachDetail | ClubDetail | PartnerDetail | StateDetail | null>) => {
      state.selectedUser = action.payload
    },
    setUserStats: (state, action: PayloadAction<typeof initialState.userStats>) => {
      state.userStats = action.payload
    },
    setUserFilter: (state, action: PayloadAction<Partial<UserFilter>>) => {
      state.userFilter = { ...state.userFilter, ...action.payload }
    },
    setSelectedUsers: (state, action: PayloadAction<number[]>) => {
      state.selectedUsers = action.payload
    },
    addSelectedUser: (state, action: PayloadAction<number>) => {
      if (!state.selectedUsers.includes(action.payload)) {
        state.selectedUsers.push(action.payload)
      }
    },
    removeSelectedUser: (state, action: PayloadAction<number>) => {
      state.selectedUsers = state.selectedUsers.filter(id => id !== action.payload)
    },
    clearSelectedUsers: (state) => {
      state.selectedUsers = []
    },
    setExportLoading: (state, action: PayloadAction<boolean>) => {
      state.exportLoading = action.payload
    },
    updateUserStatus: (state, action: PayloadAction<{ userId: number; status: 'active' | 'inactive' | 'suspended' }>) => {
      const userIndex = state.users.findIndex(user => user.id === action.payload.userId)
      if (userIndex !== -1) {
        state.users[userIndex].status = action.payload.status
        state.users[userIndex].is_active = action.payload.status === 'active'
      }
    },
    updateUserVerification: (state, action: PayloadAction<{ userId: number; verified: boolean }>) => {
      const userIndex = state.users.findIndex(user => user.id === action.payload.userId)
      if (userIndex !== -1) {
        state.users[userIndex].is_verified = action.payload.verified
      }
    },
    updateUserPremium: (state, action: PayloadAction<{ userId: number; premium: boolean }>) => {
      const userIndex = state.users.findIndex(user => user.id === action.payload.userId)
      if (userIndex !== -1) {
        state.users[userIndex].is_premium = action.payload.premium
      }
    }
  }
})

export const {
  setLoading,
  setError,
  setUsers,
  setSelectedUser,
  setUserStats,
  setUserFilter,
  setSelectedUsers,
  addSelectedUser,
  removeSelectedUser,
  clearSelectedUsers,
  setExportLoading,
  updateUserStatus,
  updateUserVerification,
  updateUserPremium
} = adminUserManagementSlice.actions

// API Functions
export const fetchUsers = (filters?: Partial<UserFilter>) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))

    const queryParams = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value)
      })
    }

    const response = await axios.get(`/api/admin/users?${queryParams.toString()}`)

    dispatch(setUsers(response.data.users))
    dispatch(setUserStats(response.data.stats))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch users'))
  } finally {
    dispatch(setLoading(false))
  }
}

export const fetchUserDetails = (userId: number) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))

    const response = await axios.get(`/api/admin/users/${userId}`)

    dispatch(setSelectedUser(response.data))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch user details'))
  } finally {
    dispatch(setLoading(false))
  }
}

export const updateUserStatusAction = (userId: number, status: 'active' | 'inactive' | 'suspended', reason?: string) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const response = await axios.put(`/api/admin/users/${userId}/status`, { status, reason })

    dispatch(updateUserStatus({ userId, status }))
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to update user status'))
    throw error
  }
}

export const updateUserVerificationAction = (userId: number, verified: boolean) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const response = await axios.put(`/api/admin/users/${userId}/verification`, { verified })

    dispatch(updateUserVerification({ userId, verified }))
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to update user verification'))
    throw error
  }
}

export const updateUserPremiumAction = (userId: number, premium: boolean, duration?: number) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const response = await axios.put(`/api/admin/users/${userId}/premium`, { premium, duration })

    dispatch(updateUserPremium({ userId, premium }))
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to update user premium status'))
    throw error
  }
}

export const resetUserPassword = (userId: number) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const response = await axios.post(`/api/admin/users/${userId}/reset-password`)

    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to reset user password'))
    throw error
  }
}

export const bulkUpdateUsers = (userIds: number[], action: string, data?: any) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))

    const response = await axios.post('/api/admin/users/bulk-update', {
      userIds,
      action,
      data
    })

    // Refresh users list
    dispatch(fetchUsers())
    dispatch(clearSelectedUsers())

    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to update users'))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export const exportUsers = (filters: Partial<UserFilter>, format: 'csv' | 'excel' | 'pdf') => async (dispatch: any) => {
  try {
    dispatch(setExportLoading(true))
    dispatch(setError(null))

    const queryParams = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value)
    })
    queryParams.append('format', format)

    const response = await axios.get(`/api/admin/users/export?${queryParams.toString()}`, {
      responseType: 'blob'
    })

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `users-export-${new Date().toISOString().split('T')[0]}.${format}`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)

    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to export users'))
    throw error
  } finally {
    dispatch(setExportLoading(false))
  }
}

export const sendUserNotification = (userIds: number[], subject: string, message: string) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const response = await axios.post('/api/admin/users/notify', {
      userIds,
      subject,
      message
    })

    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to send notification'))
    throw error
  }
}

export default adminUserManagementSlice.reducer