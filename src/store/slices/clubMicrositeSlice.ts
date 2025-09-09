import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

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
  loading: boolean
  error: string | null
  previewMode: boolean
}

const initialState: ClubMicrositeState = {
  micrositeData: null,
  stats: null,
  loading: false,
  error: null,
  previewMode: false
}

const clubMicrositeSlice = createSlice({
  name: 'clubMicrosite',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
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
  setLoading,
  setError,
  setMicrositeData,
  updateMicrositeData,
  setPreviewMode
} = clubMicrositeSlice.actions

// API Functions
export const fetchClubMicrositeData = () => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    const response = await axios.get('/api/club/microsite')
    dispatch(setMicrositeData(response.data))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch microsite data'))
  } finally {
    dispatch(setLoading(false))
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
}) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    const response = await axios.put('/api/club/microsite', micrositeData)
    dispatch(updateMicrositeData(response.data.micrositeData))
    
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to update microsite data'))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export const uploadClubLogo = (formData: FormData) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    const response = await axios.post('/api/club/microsite/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    
    dispatch(updateMicrositeData({ logo_url: response.data.logo_url }))
    
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to upload logo'))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export const publishMicrosite = () => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    const response = await axios.post('/api/club/microsite/publish')
    
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to publish microsite'))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export default clubMicrositeSlice.reducer