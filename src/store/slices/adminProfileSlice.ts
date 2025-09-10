import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '../index'
import { startLoading, stopLoading } from './loadingSlice'
import api from '../../services/api'

export interface AdminProfileState {
  activityLog: ActivityLogEntry[]
  securitySettings: SecuritySettings
  isLoading: boolean
  error: string | null
}

export interface ActivityLogEntry {
  id: number
  action: string
  timestamp: string
  details: string
  ip_address: string
}

export interface SecuritySettings {
  is_searchable: boolean
  two_factor_enabled?: boolean
  login_notifications?: boolean
}

const initialState: AdminProfileState = {
  activityLog: [],
  securitySettings: {
    is_searchable: false,
    two_factor_enabled: false,
    login_notifications: true
  },
  isLoading: false,
  error: null
}

const adminProfileSlice = createSlice({
  name: 'adminProfile',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setActivityLog: (state, action: PayloadAction<ActivityLogEntry[]>) => {
      state.activityLog = action.payload
    },
    updateSecuritySettings: (state, action: PayloadAction<SecuritySettings>) => {
      state.securitySettings = { ...state.securitySettings, ...action.payload }
    },
    clearError: (state) => {
      state.error = null
    }
  }
})

export const {
  setLoading,
  setError,
  setActivityLog,
  updateSecuritySettings,
  clearError
} = adminProfileSlice.actions

// Fetch admin activity log
export const fetchAdminActivityLog = (page: number = 1, limit: number = 10) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading activity log...'))
  
  try {
    const response = await api.get(`/api/admin/profile/activity?page=${page}&limit=${limit}`)
    dispatch(setActivityLog(response.data.activities))
    return response.data
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch activity log'
    dispatch(setError(errorMessage))
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

// Fetch admin profile data
export const fetchAdminProfile = () => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading profile data...'))
  
  try {
    const response = await api.get('/api/admin/profile')
    // Update security settings based on profile data
    dispatch(updateSecuritySettings({
      is_searchable: response.data.is_searchable
    }))
    return response.data
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch profile data'
    dispatch(setError(errorMessage))
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

export default adminProfileSlice.reducer