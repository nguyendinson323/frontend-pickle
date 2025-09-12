import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '../index'
import api from '../../services/api'

interface CoachingSession {
  id: number
  coach_id: number
  player_id: number
  session_date: string
  start_time: string
  end_time: string
  court_id: number | null
  status: 'scheduled' | 'completed' | 'canceled'
  price: number
  payment_status: 'pending' | 'paid' | 'refunded'
  stripe_payment_id: string | null
  rating: number | null
  created_at: string
  updated_at: string
  player: {
    id: number
    full_name: string
    profile_photo_url: string | null
    nrtp_level: number
  }
  court: {
    id: number
    name: string
    address: string
  } | null
}

interface CoachAvailability {
  id: number
  coach_id: number
  day_of_week: number
  start_time: string
  end_time: string
  is_recurring: boolean
  specific_date: string | null
  created_at: string
}

interface SessionStats {
  total_sessions: number
  completed_sessions: number
  upcoming_sessions: number
  canceled_sessions: number
  average_rating: number
  total_earnings: number
  completion_rate: number
}

interface CoachSessionsState {
  sessions: CoachingSession[]
  availability: CoachAvailability[]
  stats: SessionStats | null
  selectedSession: CoachingSession | null
  filters: {
    status: string
    date_from: string
    date_to: string
    player_search: string
  }
  isLoading: boolean
  error: string | null
}

const initialState: CoachSessionsState = {
  sessions: [],
  availability: [],
  stats: null,
  selectedSession: null,
  filters: {
    status: 'all',
    date_from: '',
    date_to: '',
    player_search: ''
  },
  isLoading: false,
  error: null
}

const coachSessionsSlice = createSlice({
  name: 'coachSessions',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setCoachSessions: (state, action: PayloadAction<CoachingSession[]>) => {
      state.sessions = action.payload
    },
    setCoachAvailability: (state, action: PayloadAction<CoachAvailability[]>) => {
      state.availability = action.payload
    },
    setSessionStats: (state, action: PayloadAction<SessionStats>) => {
      state.stats = action.payload
    },
    setSelectedSession: (state, action: PayloadAction<CoachingSession | null>) => {
      state.selectedSession = action.payload
    },
    setFilters: (state, action: PayloadAction<Partial<CoachSessionsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    updateSessionStatus: (state, action: PayloadAction<{ sessionId: number; status: string }>) => {
      const session = state.sessions.find(s => s.id === action.payload.sessionId)
      if (session) {
        session.status = action.payload.status as 'scheduled' | 'completed' | 'canceled'
        session.updated_at = new Date().toISOString()
      }
    },
    addAvailabilitySlot: (state, action: PayloadAction<CoachAvailability>) => {
      state.availability.push(action.payload)
    },
    removeAvailabilitySlot: (state, action: PayloadAction<number>) => {
      state.availability = state.availability.filter(slot => slot.id !== action.payload)
    },
    clearCoachSessionsData: (state) => {
      state.sessions = []
      state.availability = []
      state.stats = null
      state.selectedSession = null
      state.error = null
    }
  }
})

export const {
  setLoading,
  setError,
  setCoachSessions,
  setCoachAvailability,
  setSessionStats,
  setSelectedSession,
  setFilters,
  updateSessionStatus,
  addAvailabilitySlot,
  removeAvailabilitySlot,
  clearCoachSessionsData
} = coachSessionsSlice.actions

// Define response interface
interface CoachSessionsResponse {
  sessions: CoachingSession[]
  availability: CoachAvailability[]
  stats: SessionStats
}

// API Functions
export const fetchCoachSessionsData = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    const response = await api.get<CoachSessionsResponse>('/api/coach/sessions')
    dispatch(setCoachSessions(response.data.sessions))
    dispatch(setCoachAvailability(response.data.availability))
    dispatch(setSessionStats(response.data.stats))
    dispatch(setLoading(false))
  } catch (error) {
    dispatch(setError('Failed to load sessions data'))
    dispatch(setLoading(false))
    throw error
  }
}

export const updateCoachSessionStatus = (sessionId: number, status: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    const response = await api.put(`/api/coach/sessions/${sessionId}/status`, { status })
    dispatch(updateSessionStatus({ sessionId, status }))
    if ((response.data as any).stats) {
      dispatch(setSessionStats((response.data as { stats: SessionStats }).stats))
    }
    dispatch(setLoading(false))
  } catch (error) {
    dispatch(setError('Failed to update session status'))
    dispatch(setLoading(false))
    console.error('Error updating session status:', error)
  }
}

export const addCoachAvailability = (availabilityData: Partial<CoachAvailability>) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    const response = await api.post<CoachAvailability>('/api/coach/availability', availabilityData)
    dispatch(addAvailabilitySlot(response.data as CoachAvailability))
    dispatch(setLoading(false))
  } catch (error) {
    dispatch(setError('Failed to add availability slot'))
    dispatch(setLoading(false))
    console.error('Error adding availability:', error)
  }
}

export const removeCoachAvailability = (availabilityId: number) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    await api.delete(`/api/coach/availability/${availabilityId}`)
    dispatch(removeAvailabilitySlot(availabilityId))
    dispatch(setLoading(false))
  } catch (error) {
    dispatch(setError('Failed to remove availability slot'))
    dispatch(setLoading(false))
    console.error('Error removing availability:', error)
  }
}

export default coachSessionsSlice.reducer