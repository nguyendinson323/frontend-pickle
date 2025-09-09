import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '../index'
import { startLoading, stopLoading } from './loadingSlice'
import api from '../../services/api'

interface ClubMicrositeData {
  id: number
  name: string
  manager_name: string | null
  manager_title: string | null
  club_type: string | null
  website: string | null
  social_media: string | null
  logo_url: string | null
  has_courts: boolean
  state: {
    id: number
    name: string
  } | null
  user: {
    email: string
    phone: string | null
  }
  courts_count?: number
  members_count?: number
  tournaments_count?: number
  created_at: string
  updated_at: string
}

interface MicrositeStats {
  profile_completion: number
  public_visibility: boolean
  recent_visitors: number
  social_engagement: number
  content_freshness: number
}

interface ClubMicrositeState {
  micrositeData: ClubMicrositeData | null
  stats: MicrositeStats | null
  error: string | null
  previewMode: boolean
}

const initialState: ClubMicrositeState = {
  micrositeData: null,
  stats: null,
  error: null,
  previewMode: false
}

const clubMicrositeSlice = createSlice({
  name: 'clubMicrosite',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setMicrositeData: (state, action: PayloadAction<{
      micrositeData: ClubMicrositeData
      stats: MicrositeStats
    }>) => {
      state.micrositeData = action.payload.micrositeData
      state.stats = action.payload.stats
    },
    updateMicrositeData: (state, action: PayloadAction<Partial<ClubMicrositeData>>) => {
      if (state.micrositeData) {
        state.micrositeData = { ...state.micrositeData, ...action.payload }
      }
    },
    setPreviewMode: (state, action: PayloadAction<boolean>) => {
      state.previewMode = action.payload
    }
  }
})

export const {
  setError,
  setMicrositeData,
  updateMicrositeData,
  setPreviewMode
} = clubMicrositeSlice.actions

// API Functions
export const fetchClubMicrositeData = () => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading club microsite...'))
  
  try {
    dispatch(setError(null))
    const response = await api.get('/api/club/microsite')
    dispatch(setMicrositeData(response.data as { micrositeData: ClubMicrositeData, stats: MicrositeStats }))
    dispatch(stopLoading())
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch microsite data'
    dispatch(setError(errorMessage))
    dispatch(stopLoading())
  }
}

export const updateClubMicrositeData = (micrositeData: {
  name?: string
  manager_name?: string
  manager_title?: string
  club_type?: string
  website?: string
  social_media?: string
  logo_url?: string
}) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Updating club microsite...'))
  
  try {
    dispatch(setError(null))
    const response = await api.put('/api/club/microsite', micrositeData)
    dispatch(updateMicrositeData((response.data as { micrositeData: ClubMicrositeData }).micrositeData))
    dispatch(stopLoading())
    return response.data
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update microsite data'
    dispatch(setError(errorMessage))
    dispatch(stopLoading())
    throw error
  }
}

export const uploadClubLogo = (formData: FormData) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Uploading club logo...'))
  
  try {
    dispatch(setError(null))
    const response = await api.post('/api/club/microsite/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    
    dispatch(updateMicrositeData({ logo_url: (response.data as { logo_url: string }).logo_url }))
    dispatch(stopLoading())
    return response.data
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload logo'
    dispatch(setError(errorMessage))
    dispatch(stopLoading())
    throw error
  }
}

export const publishMicrosite = () => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Publishing microsite...'))
  
  try {
    dispatch(setError(null))
    const response = await api.post('/api/club/microsite/publish')
    dispatch(stopLoading())
    return response.data
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to publish microsite'
    dispatch(setError(errorMessage))
    dispatch(stopLoading())
    throw error
  }
}

export default clubMicrositeSlice.reducer