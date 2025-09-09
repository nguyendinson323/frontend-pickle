import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

interface StateMicrositeInfo {
  id: number
  state_committee_id: number
  title: string
  description: string
  mission_statement: string
  contact_email: string
  contact_phone: string | null
  website_url: string | null
  facebook_url: string | null
  twitter_url: string | null
  instagram_url: string | null
  logo_url: string | null
  banner_image_url: string | null
  address: string | null
  established_year: number | null
  is_public: boolean
  custom_content: string | null
  created_at: string
  updated_at: string
  state_committee: {
    id: number
    name: string
    state_name: string
    state_code: string
    is_active: boolean
  }
}

interface StateMicrositeStats {
  total_tournaments: number
  total_clubs: number
  total_courts: number
  total_players: number
  active_tournaments: number
  upcoming_tournaments: number
  total_partners: number
  total_coaches: number
}

interface StateMicrositeEvent {
  id: number
  name: string
  start_date: string
  end_date: string
  venue_name: string | null
  venue_address: string | null
  tournament_type: string | null
  status: string
  entry_fee: number | null
  max_participants: number | null
  current_registrations: number
}

interface StateMicrositeClub {
  id: number
  name: string
  description: string | null
  address: string | null
  contact_email: string | null
  contact_phone: string | null
  website_url: string | null
  total_courts: number
  is_active: boolean
  membership_fee: number | null
  amenities: string | null
}

interface StateMicrositeNews {
  id: number
  title: string
  content: string
  author_name: string
  published_date: string
  is_featured: boolean
  image_url: string | null
}

interface StateMicrositeState {
  micrositeInfo: StateMicrositeInfo | null
  stats: StateMicrositeStats | null
  upcomingEvents: StateMicrositeEvent[]
  clubs: StateMicrositeClub[]
  news: StateMicrositeNews[]
  loading: boolean
  error: string | null
}

const initialState: StateMicrositeState = {
  micrositeInfo: null,
  stats: null,
  upcomingEvents: [],
  clubs: [],
  news: [],
  loading: false,
  error: null
}

const stateMicrositeSlice = createSlice({
  name: 'stateMicrosite',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setMicrositeData: (state, action: PayloadAction<{
      micrositeInfo: StateMicrositeInfo
      stats: StateMicrositeStats
      upcomingEvents: StateMicrositeEvent[]
      clubs: StateMicrositeClub[]
      news: StateMicrositeNews[]
    }>) => {
      state.micrositeInfo = action.payload.micrositeInfo
      state.stats = action.payload.stats
      state.upcomingEvents = action.payload.upcomingEvents
      state.clubs = action.payload.clubs
      state.news = action.payload.news
    },
    updateMicrositeInfo: (state, action: PayloadAction<StateMicrositeInfo>) => {
      state.micrositeInfo = action.payload
    },
    addNews: (state, action: PayloadAction<StateMicrositeNews>) => {
      state.news.unshift(action.payload)
    },
    updateNews: (state, action: PayloadAction<StateMicrositeNews>) => {
      const index = state.news.findIndex(news => news.id === action.payload.id)
      if (index !== -1) {
        state.news[index] = action.payload
      }
    },
    deleteNews: (state, action: PayloadAction<number>) => {
      state.news = state.news.filter(news => news.id !== action.payload)
    }
  }
})

export const {
  setLoading,
  setError,
  setMicrositeData,
  updateMicrositeInfo,
  addNews,
  updateNews,
  deleteNews
} = stateMicrositeSlice.actions

// API Functions
export const fetchStateMicrositeData = (stateId?: string) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    const url = stateId 
      ? `/api/state/microsite/${stateId}` 
      : '/api/state/microsite'
    
    const response = await axios.get(url)
    dispatch(setMicrositeData(response.data))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch microsite data'))
  } finally {
    dispatch(setLoading(false))
  }
}

export const updateStateMicrositeInfo = (micrositeData: Partial<StateMicrositeInfo>) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    const response = await axios.put('/api/state/microsite', micrositeData)
    dispatch(updateMicrositeInfo(response.data.micrositeInfo))
    
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to update microsite info'))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export const createStateMicrositeNews = (newsData: {
  title: string
  content: string
  is_featured?: boolean
  image_url?: string
}) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    const response = await axios.post('/api/state/microsite/news', newsData)
    dispatch(addNews(response.data.news))
    
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to create news'))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export const updateStateMicrositeNews = (newsId: number, newsData: Partial<StateMicrositeNews>) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    const response = await axios.put(`/api/state/microsite/news/${newsId}`, newsData)
    dispatch(updateNews(response.data.news))
    
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to update news'))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export const deleteStateMicrositeNews = (newsId: number) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    await axios.delete(`/api/state/microsite/news/${newsId}`)
    dispatch(deleteNews(newsId))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to delete news'))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export default stateMicrositeSlice.reducer

// Export types
export type {
  StateMicrositeInfo,
  StateMicrositeStats,
  StateMicrositeEvent,
  StateMicrositeClub,
  StateMicrositeNews
}