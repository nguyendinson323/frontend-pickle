import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import api from '../../services/api'
import { startLoading, stopLoading } from './loadingSlice'
import { AppDispatch } from '../index'
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

interface State {
  id: number
  name: string
  short_code: string
}

interface AdminUserManagementState {
  users: UserListItem[]
  selectedUser: PlayerDetail | CoachDetail | ClubDetail | PartnerDetail | StateDetail | null
  states: State[]
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
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  loading: boolean
  error: string | null
  selectedUsers: number[]
  exportLoading: boolean
}

const initialState: AdminUserManagementState = {
  users: [],
  selectedUser: null,
  states: [],
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
  pagination: {
    page: 1,
    limit: 50,
    total: 0,
    pages: 0
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
    setStates: (state, action: PayloadAction<State[]>) => {
      state.states = action.payload
    },
    setUserStats: (state, action: PayloadAction<typeof initialState.userStats>) => {
      state.userStats = action.payload
    },
    setUserFilter: (state, action: PayloadAction<Partial<UserFilter>>) => {
      state.userFilter = { ...state.userFilter, ...action.payload }
      // Reset to first page when filters change
      state.pagination.page = 1
    },
    setPagination: (state, action: PayloadAction<typeof initialState.pagination>) => {
      state.pagination = action.payload
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload
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
  setStates,
  setUserStats,
  setUserFilter,
  setPagination,
  setCurrentPage,
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
export const fetchUsers = (filters?: Partial<UserFilter>, page?: number, limit?: number) => async (dispatch: AppDispatch, getState: any) => {
  dispatch(startLoading('Loading users...'))

  try {
    dispatch(setError(null))

    const state = getState()
    const currentPagination = state.adminUserManagement.pagination

    const queryParams = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value)
      })
    }

    // Add pagination parameters
    queryParams.append('page', (page || currentPagination.page).toString())
    queryParams.append('limit', (limit || currentPagination.limit).toString())

    const response = await api.get(`/api/admin/users?${queryParams.toString()}`)

    const responseData = response.data as {
      users: UserListItem[],
      stats: typeof initialState.userStats,
      pagination: typeof initialState.pagination
    }
    dispatch(setUsers(responseData.users))
    dispatch(setUserStats(responseData.stats))
    dispatch(setPagination(responseData.pagination))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(setError('Failed to fetch users'))
    dispatch(stopLoading())
    throw error
  }
}

export const fetchUserDetails = (userId: number) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading user details...'))
  
  try {
    dispatch(setError(null))

    const response = await api.get(`/api/admin/users/${userId}`)

    dispatch(setSelectedUser(response.data as PlayerDetail | CoachDetail | ClubDetail | PartnerDetail | StateDetail))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(setError('Failed to fetch user details'))
    dispatch(stopLoading())
    throw error
  }
}

export const updateUserStatusAction = (userId: number, status: 'active' | 'inactive' | 'suspended', reason?: string) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Updating user status...'))
  
  try {
    dispatch(setError(null))

    const response = await api.put(`/api/admin/users/${userId}/status`, { status, reason })

    dispatch(updateUserStatus({ userId, status }))
    dispatch(stopLoading())
    return response.data
  } catch (error) {
    dispatch(setError('Failed to update user status'))
    dispatch(stopLoading())
    throw error
  }
}

export const updateUserVerificationAction = (userId: number, verified: boolean) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Updating user verification...'))
  
  try {
    dispatch(setError(null))

    const response = await api.put(`/api/admin/users/${userId}/verification`, { verified })

    dispatch(updateUserVerification({ userId, verified }))
    dispatch(stopLoading())
    return response.data
  } catch (error) {
    dispatch(setError('Failed to update user verification'))
    dispatch(stopLoading())
    throw error
  }
}

export const updateUserPremiumAction = (userId: number, premium: boolean, duration?: number) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Updating user premium status...'))
  
  try {
    dispatch(setError(null))

    const response = await api.put(`/api/admin/users/${userId}/premium`, { premium, duration })

    dispatch(updateUserPremium({ userId, premium }))
    dispatch(stopLoading())
    return response.data
  } catch (error) {
    dispatch(setError('Failed to update user premium status'))
    dispatch(stopLoading())
    throw error
  }
}

export const resetUserPassword = (userId: number) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Resetting user password...'))
  
  try {
    dispatch(setError(null))

    const response = await api.post(`/api/admin/users/${userId}/reset-password`)

    dispatch(stopLoading())
    return response.data
  } catch (error) {
    dispatch(setError('Failed to reset user password'))
    dispatch(stopLoading())
    throw error
  }
}

export const bulkUpdateUsers = (userIds: number[], action: string, data?: any) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Updating users...'))
  
  try {
    dispatch(setError(null))

    const response = await api.post('/api/admin/users/bulk-update', {
      userIds,
      action,
      data
    })

    // Refresh users list
    dispatch(fetchUsers())
    dispatch(clearSelectedUsers())
    dispatch(stopLoading())

    return response.data
  } catch (error) {
    dispatch(setError('Failed to update users'))
    dispatch(stopLoading())
    throw error
  }
}

export const exportUsers = (filters: Partial<UserFilter>, format: 'csv' | 'excel' | 'pdf') => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Exporting users...'))
  
  try {
    dispatch(setError(null))

    const queryParams = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value)
    })
    queryParams.append('format', format)

    const response = await api.get(`/api/admin/users/export?${queryParams.toString()}`, {
      responseType: 'blob'
    })

    const url = window.URL.createObjectURL(new Blob([response.data as BlobPart]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `users-export-${new Date().toISOString().split('T')[0]}.${format}`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)

    dispatch(stopLoading())
    return response.data
  } catch (error) {
    dispatch(setError('Failed to export users'))
    dispatch(stopLoading())
    throw error
  }
}

export const sendUserNotification = (userIds: number[], subject: string, message: string) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Sending notification...'))

  try {
    dispatch(setError(null))

    const response = await api.post('/api/admin/users/notify', {
      userIds,
      subject,
      message
    })

    dispatch(stopLoading())
    return response.data
  } catch (error) {
    dispatch(setError('Failed to send notification'))
    dispatch(stopLoading())
    throw error
  }
}

export const fetchStates = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setError(null))

    const response = await api.get('/api/admin/users/states')
    dispatch(setStates(response.data))
  } catch (error) {
    dispatch(setError('Failed to fetch states'))
    console.error('Failed to fetch states:', error)
  }
}

export default adminUserManagementSlice.reducer