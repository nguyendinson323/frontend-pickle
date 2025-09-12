import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '../index'
import api from '../../services/api'

// Interface definitions matching the backend response
export interface CoachProfileData {
  id: number
  user_id: number
  full_name: string
  birth_date: string
  gender: 'Male' | 'Female' | 'Other'
  state_id: number | null
  state_name: string | null
  curp: string
  nrtp_level: number
  profile_photo_url: string | null
  id_document_url: string
  hourly_rate: number | null
  affiliation_expires_at: string | null
  user: {
    id: number
    username: string
    email: string
    phone: string | null
    is_active: boolean
    is_verified: boolean
    is_premium: boolean
    is_searchable: boolean
    last_login: string | null
  }
}

export interface CoachProfileState {
  profile: CoachProfileData | null
  isLoading: boolean
  error: string | null
  isUpdating: boolean
  updateError: string | null
}

const initialState: CoachProfileState = {
  profile: null,
  isLoading: false,
  error: null,
  isUpdating: false,
  updateError: null
}

const coachProfileSlice = createSlice({
  name: 'coachProfile',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setProfile: (state, action: PayloadAction<CoachProfileData>) => {
      state.profile = action.payload
    },
    setUpdating: (state, action: PayloadAction<boolean>) => {
      state.isUpdating = action.payload
    },
    setUpdateError: (state, action: PayloadAction<string | null>) => {
      state.updateError = action.payload
    },
    updateProfileField: (state, action: PayloadAction<Partial<CoachProfileData>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload }
      }
    },
    clearProfile: (state) => {
      state.profile = null
      state.error = null
      state.updateError = null
    }
  }
})

export const {
  setLoading,
  setError,
  setProfile,
  setUpdating,
  setUpdateError,
  updateProfileField,
  clearProfile
} = coachProfileSlice.actions

// API response interfaces
interface CoachProfileResponse {
  profile: CoachProfileData
}

interface UpdateProfileRequest {
  full_name?: string
  email?: string
  phone?: string
  hourly_rate?: number
  nrtp_level?: number
  is_searchable?: boolean
}

interface UpdateProfileResponse {
  message: string
  profile: CoachProfileData
}

interface UploadPhotoResponse {
  message: string
  profile_photo_url: string
}

// API Functions
export const fetchCoachProfile = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    const response = await api.get<CoachProfileResponse>('/api/coach/profile')
    dispatch(setProfile(response.data.profile))
    dispatch(setLoading(false))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to load coach profile'))
    dispatch(setLoading(false))
    throw error
  }
}

export const updateCoachProfile = (profileData: UpdateProfileRequest) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setUpdating(true))
    dispatch(setUpdateError(null))
    const response = await api.put<UpdateProfileResponse>('/api/coach/profile', profileData)
    dispatch(setProfile(response.data.profile))
    dispatch(setUpdating(false))
    return response.data
  } catch (error: any) {
    dispatch(setUpdateError(error.response?.data?.message || 'Failed to update profile'))
    dispatch(setUpdating(false))
    throw error
  }
}

export const uploadProfilePhoto = (profile_photo_url: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setUpdating(true))
    dispatch(setUpdateError(null))
    const response = await api.put<UploadPhotoResponse>('/api/coach/profile/photo', { profile_photo_url })
    
    // Update the profile photo in the current profile
    dispatch(updateProfileField({ profile_photo_url: response.data.profile_photo_url }))
    dispatch(setUpdating(false))
    return response.data
  } catch (error: any) {
    dispatch(setUpdateError(error.response?.data?.message || 'Failed to upload photo'))
    dispatch(setUpdating(false))
    throw error
  }
}

export default coachProfileSlice.reducer