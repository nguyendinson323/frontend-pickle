import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '../index'
import { startLoading, stopLoading } from './loadingSlice'
import axios from 'axios'

const BASE_URL = 'http://localhost:5000'

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export interface PlayerFinderPlayer {
  id: number
  user_id: number
  full_name: string
  birth_date: string
  gender: string
  state_id: number
  nrtp_level: number
  profile_photo_url: string | null
  nationality: string
  club_id: number | null
  ranking_position: number | null
  state: {
    id: number
    name: string
    short_code: string
  } | null
  club: {
    id: number
    name: string
    logo_url: string | null
  } | null
  user: {
    id: number
    username: string
    email: string
    phone: string | null
    is_premium: boolean
    is_searchable: boolean
  }
  distance?: number
}

export interface MatchRequest {
  id: number
  requester_id: number
  receiver_id: number
  preferred_date: string
  preferred_time: string
  message: string | null
  status: 'pending' | 'accepted' | 'rejected' | 'canceled'
  response_message: string | null
  court_id: number | null
  created_at: string
  updated_at: string
  requester?: PlayerFinderPlayer
  receiver?: PlayerFinderPlayer
  court?: {
    id: number
    name: string
    location_name: string
  } | null
}

export interface PlayerFinderFilters {
  state_id: number | null
  nrtp_level_min: number | null
  nrtp_level_max: number | null
  gender: string | null
  age_min: number | null
  age_max: number | null
  distance_km: number | null
  has_premium: boolean | null
  location_lat: number | null
  location_lng: number | null
}

export interface PlayerFinderState {
  players: PlayerFinderPlayer[]
  sentRequests: MatchRequest[]
  receivedRequests: MatchRequest[]
  filters: PlayerFinderFilters
  isLoading: boolean
  error: string | null
  searchPerformed: boolean
  userLocation: {
    lat: number
    lng: number
  } | null
  locationPermission: 'granted' | 'denied' | 'prompt' | null
}

const initialState: PlayerFinderState = {
  players: [],
  sentRequests: [],
  receivedRequests: [],
  filters: {
    state_id: null,
    nrtp_level_min: null,
    nrtp_level_max: null,
    gender: null,
    age_min: null,
    age_max: null,
    distance_km: 25,
    has_premium: null,
    location_lat: null,
    location_lng: null
  },
  isLoading: false,
  error: null,
  searchPerformed: false,
  userLocation: null,
  locationPermission: null
}

const playerFinderSlice = createSlice({
  name: 'playerFinder',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setPlayers: (state, action: PayloadAction<PlayerFinderPlayer[]>) => {
      state.players = action.payload
      state.searchPerformed = true
    },
    setSentRequests: (state, action: PayloadAction<MatchRequest[]>) => {
      state.sentRequests = action.payload
    },
    setReceivedRequests: (state, action: PayloadAction<MatchRequest[]>) => {
      state.receivedRequests = action.payload
    },
    setFilters: (state, action: PayloadAction<Partial<PlayerFinderFilters>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    setUserLocation: (state, action: PayloadAction<{lat: number, lng: number} | null>) => {
      state.userLocation = action.payload
      if (action.payload) {
        state.filters.location_lat = action.payload.lat
        state.filters.location_lng = action.payload.lng
      }
    },
    setLocationPermission: (state, action: PayloadAction<'granted' | 'denied' | 'prompt' | null>) => {
      state.locationPermission = action.payload
    },
    addMatchRequest: (state, action: PayloadAction<MatchRequest>) => {
      state.sentRequests.unshift(action.payload)
    },
    updateMatchRequest: (state, action: PayloadAction<MatchRequest>) => {
      const index = state.sentRequests.findIndex(req => req.id === action.payload.id)
      if (index !== -1) {
        state.sentRequests[index] = action.payload
      }
      const receivedIndex = state.receivedRequests.findIndex(req => req.id === action.payload.id)
      if (receivedIndex !== -1) {
        state.receivedRequests[receivedIndex] = action.payload
      }
    },
    clearPlayerFinder: (state) => {
      state.players = []
      state.sentRequests = []
      state.receivedRequests = []
      state.error = null
      state.searchPerformed = false
    }
  }
})

export const {
  setLoading,
  setError,
  setPlayers,
  setSentRequests,
  setReceivedRequests,
  setFilters,
  setUserLocation,
  setLocationPermission,
  addMatchRequest,
  updateMatchRequest,
  clearPlayerFinder
} = playerFinderSlice.actions

// Search for players based on filters
export const searchPlayers = (filters: Partial<PlayerFinderFilters>) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Searching for players...'))
  
  try {
    const response = await apiClient.post<PlayerFinderPlayer[]>('/api/player-finder/search', filters)
    dispatch(setPlayers(response.data))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(setError('Failed to search players'))
    dispatch(stopLoading())
    throw error
  }
}

// Get current user's sent match requests
export const fetchSentRequests = () => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading sent requests...'))
  
  try {
    const response = await apiClient.get<MatchRequest[]>('/api/player-finder/requests/sent')
    dispatch(setSentRequests(response.data))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(setError('Failed to load sent requests'))
    dispatch(stopLoading())
    throw error
  }
}

// Get current user's received match requests
export const fetchReceivedRequests = () => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading received requests...'))
  
  try {
    const response = await apiClient.get<MatchRequest[]>('/api/player-finder/requests/received')
    dispatch(setReceivedRequests(response.data))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(setError('Failed to load received requests'))
    dispatch(stopLoading())
    throw error
  }
}

// Send a match request to a player
export const sendMatchRequest = (requestData: {
  receiver_id: number
  preferred_date: string
  preferred_time: string
  message?: string
  court_id?: number
}) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Sending match request...'))
  
  try {
    const response = await apiClient.post<MatchRequest>('/api/player-finder/requests', requestData)
    dispatch(addMatchRequest(response.data))
    dispatch(stopLoading())
    return response.data
  } catch (error) {
    dispatch(setError('Failed to send match request'))
    dispatch(stopLoading())
    throw error
  }
}

// Respond to a match request (accept/reject)
export const respondToMatchRequest = (requestId: number, response: {
  status: 'accepted' | 'rejected'
  response_message?: string
  court_id?: number
}) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Responding to request...'))
  
  try {
    const apiResponse = await apiClient.put<MatchRequest>(`/api/player-finder/requests/${requestId}`, response)
    dispatch(updateMatchRequest(apiResponse.data))
    dispatch(stopLoading())
    return apiResponse.data
  } catch (error) {
    dispatch(setError('Failed to respond to request'))
    dispatch(stopLoading())
    throw error
  }
}

// Cancel a sent match request
export const cancelMatchRequest = (requestId: number) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Canceling request...'))
  
  try {
    const response = await apiClient.put<MatchRequest>(`/api/player-finder/requests/${requestId}`, {
      status: 'canceled'
    })
    dispatch(updateMatchRequest(response.data))
    dispatch(stopLoading())
    return response.data
  } catch (error) {
    dispatch(setError('Failed to cancel request'))
    dispatch(stopLoading())
    throw error
  }
}

export default playerFinderSlice.reducer