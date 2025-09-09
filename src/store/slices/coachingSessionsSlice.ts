import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '../index'
import { startLoading, stopLoading } from './loadingSlice'
import api from '../../services/api'

export interface AvailabilitySlot {
  start_time: string
  end_time: string
  is_available: boolean
}

export interface WeeklySchedule {
  monday: AvailabilitySlot[]
  tuesday: AvailabilitySlot[]
  wednesday: AvailabilitySlot[]
  thursday: AvailabilitySlot[]
  friday: AvailabilitySlot[]
  saturday: AvailabilitySlot[]
  sunday: AvailabilitySlot[]
}

export interface Coach {
  id: number
  full_name: string
  email: string
  specialization: string | null
  experience_years: number | null
  hourly_rate: number | null
  bio: string | null
  profile_image: string | null
  certifications: string[]
  rating: number
  total_reviews: number
  availability_schedule: WeeklySchedule | null
  club: {
    id: number
    name: string
  } | null
}

export interface CoachingSession {
  id: number
  coach_id: number
  player_id: number
  session_type: 'individual' | 'group' | 'clinic'
  title: string
  description: string | null
  scheduled_date: string
  start_time: string
  end_time: string
  duration_minutes: number
  location: string | null
  session_format: 'in_person' | 'virtual'
  skill_focus: string[]
  max_participants: number
  current_participants: number
  price_per_person: number
  status: 'scheduled' | 'in_progress' | 'completed' | 'canceled'
  payment_status: 'pending' | 'paid' | 'refunded'
  created_at: string
  updated_at: string
  coach: Coach
  participants?: {
    id: number
    full_name: string
    skill_level: string
  }[]
  session_notes?: string | null
  feedback_rating?: number | null
  feedback_comment?: string | null
}

export interface SessionBooking {
  id: number
  session_id: number
  player_id: number
  booking_date: string
  payment_status: 'pending' | 'paid' | 'refunded'
  payment_amount: number
  stripe_payment_id: string | null
  status: 'confirmed' | 'canceled'
  created_at: string
  session: CoachingSession
}

export interface SessionFilters {
  session_type: string | null
  skill_level: string | null
  price_range: {
    min: number | null
    max: number | null
  }
  date_range: {
    start: string | null
    end: string | null
  }
  location: string | null
  session_format: string | null
  specialization: string | null
  rating_min: number | null
}

export interface CoachingSessionsState {
  availableSessions: CoachingSession[]
  myBookings: SessionBooking[]
  selectedSession: CoachingSession | null
  coaches: Coach[]
  selectedCoach: Coach | null
  filters: SessionFilters
  isLoading: boolean
  error: string | null
  searchPerformed: boolean
  bookingModal: {
    isOpen: boolean
    sessionId: number | null
    selectedSession: CoachingSession | null
  }
  reviewModal: {
    isOpen: boolean
    sessionId: number | null
    rating: number
    comment: string
  }
  availabilityModal: {
    isOpen: boolean
    coachId: number | null
    selectedDate: string | null
  }
}

const initialState: CoachingSessionsState = {
  availableSessions: [],
  myBookings: [],
  selectedSession: null,
  coaches: [],
  selectedCoach: null,
  filters: {
    session_type: null,
    skill_level: null,
    price_range: {
      min: null,
      max: null
    },
    date_range: {
      start: null,
      end: null
    },
    location: null,
    session_format: null,
    specialization: null,
    rating_min: null
  },
  isLoading: false,
  error: null,
  searchPerformed: false,
  bookingModal: {
    isOpen: false,
    sessionId: null,
    selectedSession: null
  },
  reviewModal: {
    isOpen: false,
    sessionId: null,
    rating: 5,
    comment: ''
  },
  availabilityModal: {
    isOpen: false,
    coachId: null,
    selectedDate: null
  }
}

const coachingSessionsSlice = createSlice({
  name: 'coachingSessions',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setAvailableSessions: (state, action: PayloadAction<CoachingSession[]>) => {
      state.availableSessions = action.payload
      state.searchPerformed = true
    },
    setMyBookings: (state, action: PayloadAction<SessionBooking[]>) => {
      state.myBookings = action.payload
    },
    setSelectedSession: (state, action: PayloadAction<CoachingSession | null>) => {
      state.selectedSession = action.payload
    },
    setCoaches: (state, action: PayloadAction<Coach[]>) => {
      state.coaches = action.payload
    },
    setSelectedCoach: (state, action: PayloadAction<Coach | null>) => {
      state.selectedCoach = action.payload
    },
    setFilters: (state, action: PayloadAction<Partial<SessionFilters>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    addBooking: (state, action: PayloadAction<SessionBooking>) => {
      state.myBookings.unshift(action.payload)
      
      // Update session participant count
      const session = state.availableSessions.find(s => s.id === action.payload.session_id)
      if (session) {
        session.current_participants += 1
      }
    },
    updateBooking: (state, action: PayloadAction<SessionBooking>) => {
      const index = state.myBookings.findIndex(booking => booking.id === action.payload.id)
      if (index !== -1) {
        state.myBookings[index] = action.payload
        
        // Update session participant count if booking was canceled
        if (action.payload.status === 'canceled') {
          const session = state.availableSessions.find(s => s.id === action.payload.session_id)
          if (session && session.current_participants > 0) {
            session.current_participants -= 1
          }
        }
      }
    },
    openBookingModal: (state, action: PayloadAction<{
      sessionId: number
      session: CoachingSession
    }>) => {
      state.bookingModal = {
        isOpen: true,
        sessionId: action.payload.sessionId,
        selectedSession: action.payload.session
      }
    },
    closeBookingModal: (state) => {
      state.bookingModal = {
        isOpen: false,
        sessionId: null,
        selectedSession: null
      }
    },
    openReviewModal: (state, action: PayloadAction<{
      sessionId: number
    }>) => {
      state.reviewModal = {
        isOpen: true,
        sessionId: action.payload.sessionId,
        rating: 5,
        comment: ''
      }
    },
    closeReviewModal: (state) => {
      state.reviewModal = {
        isOpen: false,
        sessionId: null,
        rating: 5,
        comment: ''
      }
    },
    updateReviewModal: (state, action: PayloadAction<{
      rating?: number
      comment?: string
    }>) => {
      if (action.payload.rating !== undefined) {
        state.reviewModal.rating = action.payload.rating
      }
      if (action.payload.comment !== undefined) {
        state.reviewModal.comment = action.payload.comment
      }
    },
    openAvailabilityModal: (state, action: PayloadAction<{
      coachId: number
      date: string
    }>) => {
      state.availabilityModal = {
        isOpen: true,
        coachId: action.payload.coachId,
        selectedDate: action.payload.date
      }
    },
    closeAvailabilityModal: (state) => {
      state.availabilityModal = {
        isOpen: false,
        coachId: null,
        selectedDate: null
      }
    },
    clearCoachingSessions: (state) => {
      state.availableSessions = []
      state.myBookings = []
      state.selectedSession = null
      state.coaches = []
      state.selectedCoach = null
      state.error = null
      state.searchPerformed = false
      state.bookingModal = {
        isOpen: false,
        sessionId: null,
        selectedSession: null
      }
      state.reviewModal = {
        isOpen: false,
        sessionId: null,
        rating: 5,
        comment: ''
      }
      state.availabilityModal = {
        isOpen: false,
        coachId: null,
        selectedDate: null
      }
    }
  }
})

export const {
  setLoading,
  setError,
  setAvailableSessions,
  setMyBookings,
  setSelectedSession,
  setCoaches,
  setSelectedCoach,
  setFilters,
  addBooking,
  updateBooking,
  openBookingModal,
  closeBookingModal,
  openReviewModal,
  closeReviewModal,
  updateReviewModal,
  openAvailabilityModal,
  closeAvailabilityModal,
  clearCoachingSessions
} = coachingSessionsSlice.actions

// Search coaching sessions based on filters
export const searchCoachingSessions = (filters: Partial<SessionFilters>) => async (dispatch: AppDispatch) => {
  try {
    dispatch(startLoading('Searching sessions...'))
    const response = await api.post<CoachingSession[]>('/api/coaching-sessions/search', filters)
    dispatch(setAvailableSessions(response.data as CoachingSession[]))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(setError('Failed to search sessions'))
    dispatch(stopLoading())
    throw error
  }
}

// Get available coaches
export const fetchAvailableCoaches = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(startLoading('Loading coaches...'))
    const response = await api.get<Coach[]>('/api/coaching-sessions/coaches')
    dispatch(setCoaches(response.data as Coach[]))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(setError('Failed to load coaches'))
    dispatch(stopLoading())
    throw error
  }
}

// Get coach details and availability
export const fetchCoachDetails = (coachId: number) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading coach details...'))
  
  try {
    const response = await api.get<Coach>(`/api/coaching-sessions/coaches/${coachId}`)
    dispatch(setSelectedCoach(response.data))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(setError('Failed to load coach details'))
    dispatch(stopLoading())
    throw error
  }
}

// Get player's coaching session bookings
export const fetchMyBookings = () => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading your bookings...'))
  
  try {
    const response = await api.get<SessionBooking[]>('/api/coaching-sessions/my-bookings')
    dispatch(setMyBookings(response.data))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(setError('Failed to load bookings'))
    dispatch(stopLoading())
    throw error
  }
}

// Book a coaching session
export const bookCoachingSession = (sessionData: {
  session_id: number
  payment_method: string
}) => async (dispatch: AppDispatch) => {
  try {
    dispatch(startLoading('Booking session...'))
    const response = await api.post<SessionBooking>('/api/coaching-sessions/book', sessionData)
    dispatch(addBooking(response.data as SessionBooking))
    dispatch(closeBookingModal())
    dispatch(stopLoading())
    return response.data
  } catch (error) {
    dispatch(setError('Failed to book session'))
    dispatch(stopLoading())
    throw error
  }
}

// Cancel a session booking
export const cancelSessionBooking = (bookingId: number) => async (dispatch: AppDispatch) => {
  try {
    dispatch(startLoading('Canceling booking...'))
    const response = await api.put<SessionBooking>(`/api/coaching-sessions/bookings/${bookingId}/cancel`)
    dispatch(updateBooking(response.data as SessionBooking))
    dispatch(stopLoading())
    return response.data
  } catch (error) {
    dispatch(setError('Failed to cancel booking'))
    dispatch(stopLoading())
    throw error
  }
}

// Submit session review and feedback
export const submitSessionReview = (sessionId: number, reviewData: {
  rating: number
  comment: string
}) => async (dispatch: AppDispatch) => {
  try {
    dispatch(startLoading('Submitting review...'))
    const response = await api.post(`/api/coaching-sessions/${sessionId}/review`, reviewData)
    dispatch(closeReviewModal())
    // Refresh bookings to show updated review status
    dispatch(fetchMyBookings())
    dispatch(stopLoading())
    return response.data
  } catch (error) {
    dispatch(setError('Failed to submit review'))
    dispatch(stopLoading())
    throw error
  }
}

// Get session details
export const fetchSessionDetails = (sessionId: number) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading session details...'))
  
  try {
    const response = await api.get<CoachingSession>(`/api/coaching-sessions/${sessionId}`)
    dispatch(setSelectedSession(response.data))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(setError('Failed to load session details'))
    dispatch(stopLoading())
    throw error
  }
}

export default coachingSessionsSlice.reducer