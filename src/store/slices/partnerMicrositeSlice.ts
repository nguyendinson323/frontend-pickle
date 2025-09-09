import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

interface PartnerMicrositeInfo {
  id: number
  owner_type: string
  owner_id: number
  template_id: number
  subdomain: string | null
  title: string
  description: string | null
  logo_url: string | null
  banner_url: string | null
  primary_color: string
  secondary_color: string
  is_active: boolean
  partner: {
    id: number
    business_name: string
    contact_name: string | null
    contact_title: string | null
    partner_type: string | null
    website: string | null
    social_media: string | null
    has_courts: boolean
  }
}

interface PartnerCourt {
  id: number
  name: string
  address: string | null
  court_count: number
  surface_type: string | null
  indoor: boolean
  lights: boolean
  amenities: string | null
  description: string | null
  status: string
}

interface PartnerTournament {
  id: number
  name: string
  description: string | null
  tournament_type: string | null
  start_date: string
  end_date: string
  registration_start: string
  registration_end: string
  entry_fee: number | null
  max_participants: number | null
  status: string
  venue_name: string | null
  current_participants: number
}

interface MicrositeStats {
  total_courts: number
  active_courts: number
  total_tournaments: number
  upcoming_tournaments: number
  total_reservations: number
  total_revenue: number
}

interface MicrositePage {
  id: number
  microsite_id: number
  title: string
  slug: string
  content: string | null
  is_published: boolean
  display_order: number
}

interface PartnerMicrositeState {
  micrositeInfo: PartnerMicrositeInfo | null
  courts: PartnerCourt[]
  tournaments: PartnerTournament[]
  pages: MicrositePage[]
  stats: MicrositeStats | null
  loading: boolean
  error: string | null
  isPublicView: boolean
}

const initialState: PartnerMicrositeState = {
  micrositeInfo: null,
  courts: [],
  tournaments: [],
  pages: [],
  stats: null,
  loading: false,
  error: null,
  isPublicView: false
}

const partnerMicrositeSlice = createSlice({
  name: 'partnerMicrosite',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setMicrositeData: (state, action: PayloadAction<{
      micrositeInfo: PartnerMicrositeInfo
      courts: PartnerCourt[]
      tournaments: PartnerTournament[]
      pages: MicrositePage[]
      stats: MicrositeStats
      isPublicView: boolean
    }>) => {
      state.micrositeInfo = action.payload.micrositeInfo
      state.courts = action.payload.courts
      state.tournaments = action.payload.tournaments
      state.pages = action.payload.pages
      state.stats = action.payload.stats
      state.isPublicView = action.payload.isPublicView
    },
    updateMicrositeInfo: (state, action: PayloadAction<PartnerMicrositeInfo>) => {
      state.micrositeInfo = action.payload
    },
    addPage: (state, action: PayloadAction<MicrositePage>) => {
      state.pages.push(action.payload)
    },
    updatePage: (state, action: PayloadAction<MicrositePage>) => {
      const index = state.pages.findIndex(page => page.id === action.payload.id)
      if (index !== -1) {
        state.pages[index] = action.payload
      }
    },
    deletePage: (state, action: PayloadAction<number>) => {
      state.pages = state.pages.filter(page => page.id !== action.payload)
    }
  }
})

export const {
  setLoading,
  setError,
  setMicrositeData,
  updateMicrositeInfo,
  addPage,
  updatePage,
  deletePage
} = partnerMicrositeSlice.actions

// API Functions
export const fetchPartnerMicrositeData = (partnerId?: string) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    const url = partnerId 
      ? `/api/partner/microsite/${partnerId}`
      : '/api/partner/microsite'
    
    const response = await axios.get(url)
    
    dispatch(setMicrositeData({
      ...response.data,
      isPublicView: !!partnerId
    }))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch microsite data'))
  } finally {
    dispatch(setLoading(false))
  }
}

export const updatePartnerMicrositeInfo = (data: Partial<PartnerMicrositeInfo>) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    const response = await axios.put('/api/partner/microsite', data)
    dispatch(updateMicrositeInfo(response.data.micrositeInfo))
    
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to update microsite'))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export const createMicrositePage = (pageData: Partial<MicrositePage>) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    const response = await axios.post('/api/partner/microsite/pages', pageData)
    dispatch(addPage(response.data.page))
    
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to create page'))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export const updateMicrositePage = (pageId: number, pageData: Partial<MicrositePage>) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    const response = await axios.put(`/api/partner/microsite/pages/${pageId}`, pageData)
    dispatch(updatePage(response.data.page))
    
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to update page'))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export const deleteMicrositePage = (pageId: number) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    await axios.delete(`/api/partner/microsite/pages/${pageId}`)
    dispatch(deletePage(pageId))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to delete page'))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export default partnerMicrositeSlice.reducer

// Export types
export type {
  PartnerMicrositeInfo,
  PartnerCourt,
  PartnerTournament,
  MicrositeStats,
  MicrositePage
}