import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '../index'
import api from '../../services/api'
import { startLoading, stopLoading } from './loadingSlice'

export interface PlayerFinderPlayer {
  id: number
  user_id: number
  full_name: string
  age: number
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
    is_premium: boolean
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
  has_premium: boolean | null
}

export interface SearchPlayersParams {
  filters: PlayerFinderFilters
  page?: number
  limit?: number
}

export interface SearchPlayersResponse {
  players: PlayerFinderPlayer[]
  pagination: {
    currentPage: number
    totalPages: number
    totalCount: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface SendMatchRequestData {
  receiver_id: number
  preferred_date: string
  preferred_time: string
  message?: string
  court_id?: number
}

export interface RespondToRequestData {
  response: 'accepted' | 'rejected'
  response_message?: string
}

export interface PlayerFinderState {
  players: PlayerFinderPlayer[]
  sentRequests: MatchRequest[]
  receivedRequests: MatchRequest[]
  filters: PlayerFinderFilters
  searchPerformed: boolean
  isLoading: boolean
  error: string | null
  pagination: {
    currentPage: number
    totalPages: number
    totalCount: number
    hasNext: boolean
    hasPrev: boolean
  }
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
    has_premium: null
  },
  searchPerformed: false,
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false
  }
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
    setPlayers: (state, action: PayloadAction<SearchPlayersResponse>) => {
      state.players = action.payload.players
      state.pagination = action.payload.pagination
      state.searchPerformed = true
    },
    setSentRequests: (state, action: PayloadAction<MatchRequest[]>) => {
      state.sentRequests = action.payload
    },
    setReceivedRequests: (state, action: PayloadAction<MatchRequest[]>) => {
      state.receivedRequests = action.payload
    },
    updateSentRequest: (state, action: PayloadAction<MatchRequest>) => {
      const index = state.sentRequests.findIndex(req => req.id === action.payload.id)
      if (index !== -1) {
        state.sentRequests[index] = action.payload
      }
    },
    updateReceivedRequest: (state, action: PayloadAction<MatchRequest>) => {
      const index = state.receivedRequests.findIndex(req => req.id === action.payload.id)
      if (index !== -1) {
        state.receivedRequests[index] = action.payload
      }
    },
    addSentRequest: (state, action: PayloadAction<MatchRequest>) => {
      state.sentRequests.unshift(action.payload)
    },
    removeSentRequest: (state, action: PayloadAction<number>) => {
      state.sentRequests = state.sentRequests.filter(req => req.id !== action.payload)
    },
    setFilters: (state, action: PayloadAction<Partial<PlayerFinderFilters>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = initialState.filters
    },
    clearSearch: (state) => {
      state.players = []
      state.searchPerformed = false
      state.pagination = initialState.pagination
    }
  }
})

export const {
  setLoading,
  setError,
  setPlayers,
  setSentRequests,
  setReceivedRequests,
  updateSentRequest,
  updateReceivedRequest,
  addSentRequest,
  removeSentRequest,
  setFilters,
  clearFilters,
  clearSearch
} = playerFinderSlice.actions

// Thunks
export const searchPlayers = (searchParams: SearchPlayersParams) => async (dispatch: AppDispatch) => {
  try {
    dispatch(startLoading('Searching players...'))
    const response = await api.post<SearchPlayersResponse>('/api/player-finder/search', {
      ...searchParams.filters,
      page: searchParams.page || 1,
      limit: searchParams.limit || 20
    })
    
    dispatch(setPlayers(response.data as SearchPlayersResponse))
    dispatch(stopLoading())
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to search players'
    dispatch(setError(errorMessage))
    dispatch(stopLoading())
  }
}

export const fetchSentRequests = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(startLoading('Loading sent requests...'))
    const response = await api.get<MatchRequest[]>('/api/player-finder/requests/sent')
    dispatch(setSentRequests(response.data as MatchRequest[]))
    dispatch(stopLoading())
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch sent requests'
    dispatch(setError(errorMessage))
    dispatch(stopLoading())
  }
}

export const fetchReceivedRequests = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(startLoading('Loading received requests...'))
    const response = await api.get<MatchRequest[]>('/api/player-finder/requests/received')
    dispatch(setReceivedRequests(response.data as MatchRequest[]))
    dispatch(stopLoading())
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch received requests'
    dispatch(setError(errorMessage))
    dispatch(stopLoading())
  }
}

export const sendMatchRequest = (requestData: SendMatchRequestData) => async (dispatch: AppDispatch) => {
  try {
    dispatch(startLoading('Sending match request...'))
    const response = await api.post<MatchRequest>('/api/player-finder/requests', requestData)
    dispatch(addSentRequest(response.data as MatchRequest))
    dispatch(stopLoading())
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to send match request'
    dispatch(setError(errorMessage))
    dispatch(stopLoading())
    throw error
  }
}

export const respondToMatchRequest = (requestId: number, responseData: RespondToRequestData) => async (dispatch: AppDispatch) => {
  try {
    dispatch(startLoading('Responding to match request...'))
    const response = await api.put<MatchRequest>(`/api/player-finder/requests/${requestId}`, responseData)
    dispatch(updateReceivedRequest(response.data as MatchRequest))
    dispatch(stopLoading())
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to respond to match request'
    dispatch(setError(errorMessage))
    dispatch(stopLoading())
    throw error
  }
}

export const cancelMatchRequest = (requestId: number) => async (dispatch: AppDispatch) => {
  try {
    dispatch(startLoading('Canceling match request...'))
    await api.put(`/api/player-finder/requests/${requestId}`, { action: 'cancel' })
    dispatch(removeSentRequest(requestId))
    dispatch(stopLoading())
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to cancel match request'
    dispatch(setError(errorMessage))
    dispatch(stopLoading())
    throw error
  }
}

export const updatePlayerSearchability = (isSearchable: boolean) => async (dispatch: AppDispatch) => {
  try {
    dispatch(startLoading('Updating searchability...'))
    await api.put('/api/player-finder/searchability', {
      is_searchable: isSearchable
    })
    dispatch(stopLoading())
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update searchability'
    dispatch(setError(errorMessage))
    dispatch(stopLoading())
    throw error
  }
}


export default playerFinderSlice.reducer