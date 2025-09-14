import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import api from '../../services/api'
import { startLoading, stopLoading } from './loadingSlice'

export interface PlayerFinderPlayer {
  id: number
  user_id: number
  full_name: string
  age: number
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
  requester?: {
    id: number
    full_name: string
    user?: { username: string }
    state?: { id: number; name: string; short_code: string }
    club?: { id: number; name: string; logo_url: string }
  }
  receiver?: {
    id: number
    full_name: string
    user?: { username: string }
    state?: { id: number; name: string; short_code: string }
    club?: { id: number; name: string; logo_url: string }
  }
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
  },
  extraReducers: (builder) => {
    builder
      // searchPlayers
      .addCase(searchPlayers.fulfilled, (state, action) => {
        state.players = action.payload.players
        state.pagination = action.payload.pagination
        state.searchPerformed = true
      })
      .addCase(searchPlayers.rejected, (state, action) => {
        state.error = action.payload as string
      })
      // fetchSentRequests
      .addCase(fetchSentRequests.fulfilled, (state, action) => {
        state.sentRequests = action.payload
      })
      .addCase(fetchSentRequests.rejected, (state, action) => {
        state.error = action.payload as string
      })
      // fetchReceivedRequests
      .addCase(fetchReceivedRequests.fulfilled, (state, action) => {
        state.receivedRequests = action.payload
      })
      .addCase(fetchReceivedRequests.rejected, (state, action) => {
        state.error = action.payload as string
      })
      // sendMatchRequest
      .addCase(sendMatchRequest.fulfilled, (state, action) => {
        state.sentRequests.unshift(action.payload)
      })
      .addCase(sendMatchRequest.rejected, (state, action) => {
        state.error = action.payload as string
      })
      // respondToMatchRequest
      .addCase(respondToMatchRequest.fulfilled, (state, action) => {
        const index = state.receivedRequests.findIndex(req => req.id === action.payload.id)
        if (index !== -1) {
          state.receivedRequests[index] = action.payload
        }
      })
      .addCase(respondToMatchRequest.rejected, (state, action) => {
        state.error = action.payload as string
      })
      // cancelMatchRequest
      .addCase(cancelMatchRequest.fulfilled, (state, action) => {
        state.sentRequests = state.sentRequests.filter(req => req.id !== action.payload)
      })
      .addCase(cancelMatchRequest.rejected, (state, action) => {
        state.error = action.payload as string
      })
      // updatePlayerSearchability
      .addCase(updatePlayerSearchability.fulfilled, () => {
        // Success handled by auth slice or page refresh
      })
      .addCase(updatePlayerSearchability.rejected, (state, action) => {
        state.error = action.payload as string
      })
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

// Async Thunks
export const searchPlayers = createAsyncThunk(
  'playerFinder/searchPlayers',
  async (searchParams: SearchPlayersParams, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoading('Searching players...'))
      const response = await api.post<SearchPlayersResponse>('/api/player-finder/search', {
        ...searchParams.filters,
        page: searchParams.page || 1,
        limit: searchParams.limit || 20
      })
      return response.data as SearchPlayersResponse
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to search players'
      return rejectWithValue(errorMessage)
    } finally {
      dispatch(stopLoading())
    }
  }
)

export const fetchSentRequests = createAsyncThunk(
  'playerFinder/fetchSentRequests',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoading('Loading sent requests...'))
      const response = await api.get<MatchRequest[]>('/api/player-finder/requests/sent')
      return response.data as MatchRequest[]
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch sent requests'
      return rejectWithValue(errorMessage)
    } finally {
      dispatch(stopLoading())
    }
  }
)

export const fetchReceivedRequests = createAsyncThunk(
  'playerFinder/fetchReceivedRequests',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoading('Loading received requests...'))
      const response = await api.get<MatchRequest[]>('/api/player-finder/requests/received')
      return response.data as MatchRequest[]
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch received requests'
      return rejectWithValue(errorMessage)
    } finally {
      dispatch(stopLoading())
    }
  }
)

export const sendMatchRequest = createAsyncThunk(
  'playerFinder/sendMatchRequest',
  async (requestData: SendMatchRequestData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoading('Sending match request...'))
      const response = await api.post<MatchRequest>('/api/player-finder/requests', requestData)
      return response.data as MatchRequest
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send match request'
      return rejectWithValue(errorMessage)
    } finally {
      dispatch(stopLoading())
    }
  }
)

export const respondToMatchRequest = createAsyncThunk(
  'playerFinder/respondToMatchRequest',
  async ({ requestId, responseData }: { requestId: number; responseData: RespondToRequestData }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoading('Responding to match request...'))
      const response = await api.put<MatchRequest>(`/api/player-finder/requests/${requestId}`, responseData)
      return response.data as MatchRequest
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to respond to match request'
      return rejectWithValue(errorMessage)
    } finally {
      dispatch(stopLoading())
    }
  }
)

export const cancelMatchRequest = createAsyncThunk(
  'playerFinder/cancelMatchRequest',
  async (requestId: number, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoading('Canceling match request...'))
      await api.put(`/api/player-finder/requests/${requestId}`, { action: 'cancel' })
      return requestId
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to cancel match request'
      return rejectWithValue(errorMessage)
    } finally {
      dispatch(stopLoading())
    }
  }
)

export const updatePlayerSearchability = createAsyncThunk(
  'playerFinder/updatePlayerSearchability',
  async (isSearchable: boolean, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoading('Updating searchability...'))
      await api.put('/api/player-finder/searchability', {
        is_searchable: isSearchable
      })

      // Update user data in auth slice immediately
      const { updateUser } = await import('./authSlice')
      dispatch(updateUser({ is_searchable: isSearchable }))

      return isSearchable
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update searchability'
      return rejectWithValue(errorMessage)
    } finally {
      dispatch(stopLoading())
    }
  }
)


export default playerFinderSlice.reducer