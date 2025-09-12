import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '../index'
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

interface MicrositeCustomization {
  primary_color?: string
  secondary_color?: string
  description?: string
  banner_url?: string
}

interface MicrositeAnalytics {
  pageViews: number
  monthlyVisitors: number
  contentScore: number
  seoScore: number
  performanceScore: number
  lastAudit: string | null
  visibilityStatus: string
  approvalStatus: string
  publicUrl: string | null
  socialShares: number
  averageSessionDuration: string
  bounceRate: string
  topPages: Array<{
    page: string
    views: number
  }>
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
  customization: MicrositeCustomization | null
  analytics: MicrositeAnalytics | null
  loading: boolean
  error: string | null
  previewMode: boolean
}

const initialState: ClubMicrositeState = {
  micrositeData: null,
  stats: null,
  customization: null,
  analytics: null,
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
    setCustomization: (state, action: PayloadAction<MicrositeCustomization>) => {
      state.customization = action.payload
    },
    setAnalytics: (state, action: PayloadAction<MicrositeAnalytics>) => {
      state.analytics = action.payload
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
  setCustomization,
  setAnalytics,
  setPreviewMode
} = clubMicrositeSlice.actions

// Define response interfaces
interface ClubMicrositeResponse {
  micrositeData: ClubMicrositeData
  stats: MicrositeStats
}

interface MicrositeUpdateResponse {
  micrositeData: ClubMicrositeData
  message?: string
}

interface LogoUploadResponse {
  logo_url: string
  message?: string
}

interface PublishResponse {
  message: string
  microsite_url?: string
  published_at?: string
  microsite_id?: number
}

interface BannerUploadResponse {
  banner_url: string
  message?: string
}

interface CustomizationResponse {
  microsite: any
  message?: string
}

interface AnalyticsResponse {
  analytics: MicrositeAnalytics
  message?: string
}

// API Functions
export const fetchClubMicrositeData = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))
  
  try {
    dispatch(setError(null))
    const response = await api.get<ClubMicrositeResponse>('/api/club/microsite')
    dispatch(setMicrositeData(response.data))
    dispatch(setLoading(false))
  } catch (error: unknown) {
    dispatch(setError((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to fetch microsite data'))
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
}) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))
  
  try {
    dispatch(setError(null))
    const response = await api.put<MicrositeUpdateResponse>('/api/club/microsite', micrositeData)
    dispatch(updateMicrositeData(response.data.micrositeData))
    dispatch(setLoading(false))
    return response.data
  } catch (error: unknown) {
    dispatch(setError((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to update microsite data'))
    dispatch(setLoading(false))
    throw error
  }
}

export const uploadClubLogo = (formData: FormData) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))
  
  try {
    dispatch(setError(null))
    const response = await api.post<LogoUploadResponse>('/api/club/microsite/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    
    dispatch(updateMicrositeData({ logo_url: response.data.logo_url }))
    dispatch(setLoading(false))
    return response.data
  } catch (error: unknown) {
    dispatch(setError((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to upload logo'))
    dispatch(setLoading(false))
    throw error
  }
}

export const publishMicrosite = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))
  
  try {
    dispatch(setError(null))
    const response = await api.post<PublishResponse>('/api/club/microsite/publish')
    dispatch(setLoading(false))
    return response.data
  } catch (error: unknown) {
    dispatch(setError((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to publish microsite'))
    dispatch(setLoading(false))
    throw error
  }
}

export const uploadBannerImage = (formData: FormData) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))
  
  try {
    dispatch(setError(null))
    const response = await api.post<BannerUploadResponse>('/api/club/microsite/banner', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    
    dispatch(setLoading(false))
    return response.data
  } catch (error: unknown) {
    dispatch(setError((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to upload banner'))
    dispatch(setLoading(false))
    throw error
  }
}

export const updateMicrositeCustomization = (customizationData: {
  primary_color?: string
  secondary_color?: string
  description?: string
}) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))
  
  try {
    dispatch(setError(null))
    const response = await api.put<CustomizationResponse>('/api/club/microsite/customization', customizationData)
    dispatch(setCustomization(customizationData))
    dispatch(setLoading(false))
    return response.data
  } catch (error: unknown) {
    dispatch(setError((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to update customization'))
    dispatch(setLoading(false))
    throw error
  }
}

export const fetchMicrositeAnalytics = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))
  
  try {
    dispatch(setError(null))
    const response = await api.get<AnalyticsResponse>('/api/club/microsite/analytics')
    dispatch(setAnalytics(response.data.analytics))
    dispatch(setLoading(false))
    return response.data
  } catch (error: unknown) {
    dispatch(setError((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to fetch analytics'))
    dispatch(setLoading(false))
    throw error
  }
}

export const unpublishMicrosite = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))
  
  try {
    dispatch(setError(null))
    const response = await api.post('/api/club/microsite/unpublish')
    dispatch(setLoading(false))
    return response.data
  } catch (error: unknown) {
    dispatch(setError((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to unpublish microsite'))
    dispatch(setLoading(false))
    throw error
  }
}

// Export types for use in components
export type { ClubMicrositeData, MicrositeStats, MicrositeCustomization, MicrositeAnalytics }

export default clubMicrositeSlice.reducer