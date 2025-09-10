import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import api from '../../services/api'
import { startLoading, stopLoading } from './loadingSlice'
import { AppDispatch } from '../index'

interface PartnerProfile {
  id: number
  user_id: number
  business_name: string
  rfc: string | null
  contact_name: string | null
  contact_title: string | null
  partner_type: string | null
  state_id: number | null
  website: string | null
  social_media: string | null
  logo_url: string | null
  has_courts: boolean
  premium_expires_at: string | null
  created_at: string
  updated_at: string
  user: {
    id: number
    username: string
    email: string
    phone: string | null
    is_active: boolean
    is_verified: boolean
    is_premium: boolean
    last_login: string | null
  }
  state: {
    id: number
    name: string
    short_code: string
  } | null
}

interface AffiliationStatus {
  business_name: string
  is_premium: boolean
  premium_expires_at: string | null
  days_until_expiry: number | null
  member_since: string
  status: string
}

interface PartnerProfileState {
  profile: PartnerProfile | null
  affiliationStatus: AffiliationStatus | null
  error: string | null
}

const initialState: PartnerProfileState = {
  profile: null,
  affiliationStatus: null,
  error: null
}

const partnerProfileSlice = createSlice({
  name: 'partnerProfile',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<PartnerProfile>) => {
      state.profile = action.payload
      state.error = null
    },
    setAffiliationStatus: (state, action: PayloadAction<AffiliationStatus>) => {
      state.affiliationStatus = action.payload
      state.error = null
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearProfile: (state) => {
      state.profile = null
      state.affiliationStatus = null
      state.error = null
    }
  }
})

export const {
  setProfile,
  setAffiliationStatus,
  setError,
  clearProfile
} = partnerProfileSlice.actions

// API Functions
export const fetchPartnerProfile = () => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading partner profile...'))
  
  try {
    dispatch(setError(null))
    
    const response = await api.get('/api/partner/profile')
    dispatch(setProfile(response.data.partner as PartnerProfile))
    dispatch(stopLoading())
  } catch (error: unknown) {
    dispatch(setError('Failed to fetch partner profile'))
    dispatch(stopLoading())
    throw error
  }
}

export const updatePartnerProfile = (data: Partial<PartnerProfile>) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Updating partner profile...'))
  
  try {
    dispatch(setError(null))
    
    const response = await api.put('/api/partner/profile', data)
    dispatch(setProfile(response.data.partner as PartnerProfile))
    dispatch(stopLoading())
    
    return response.data
  } catch (error: unknown) {
    dispatch(setError('Failed to update partner profile'))
    dispatch(stopLoading())
    throw error
  }
}

export const fetchAffiliationStatus = () => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading affiliation status...'))
  
  try {
    dispatch(setError(null))
    
    const response = await api.get('/api/partner/affiliation')
    dispatch(setAffiliationStatus(response.data.affiliation as AffiliationStatus))
    dispatch(stopLoading())
  } catch (error: unknown) {
    dispatch(setError('Failed to fetch affiliation status'))
    dispatch(stopLoading())
    throw error
  }
}

export default partnerProfileSlice.reducer

// Export types
export type {
  PartnerProfile,
  AffiliationStatus
}