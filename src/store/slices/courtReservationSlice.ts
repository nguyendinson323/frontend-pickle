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

export interface CourtSchedule {
  id: number
  court_id: number
  day_of_week: number
  open_time: string
  close_time: string
  is_closed: boolean
}

export interface Court {
  id: number
  name: string
  owner_type: 'club' | 'partner'
  owner_id: number
  address: string | null
  state_id: number
  court_count: number
  surface_type: string | null
  indoor: boolean
  lights: boolean
  amenities: string | null
  description: string | null
  latitude: number | null
  longitude: number | null
  status: 'active' | 'maintenance' | 'inactive'
  created_at: string
  updated_at: string
  state: {
    id: number
    name: string
    short_code: string
  } | null
  owner: {
    id: number
    name: string
    type: string
  } | null
  schedules: CourtSchedule[]
  hourlyRate?: number
  distance?: number
  availableTimeSlots?: TimeSlot[]
}

export interface TimeSlot {
  start_time: string
  end_time: string
  available: boolean
  price: number
  reservation_id?: number
}

export interface CourtReservation {
  id: number
  court_id: number
  player_id: number
  date: string
  start_time: string
  end_time: string
  status: 'pending' | 'confirmed' | 'canceled'
  payment_status: 'pending' | 'paid' | 'refunded'
  amount: number
  stripe_payment_id: string | null
  created_at: string
  updated_at: string
  court: Court | null
  player?: {
    id: number
    full_name: string
  } | null
}

export interface CourtFilters {
  state_id: number | null
  surface_type: string | null
  indoor: boolean | null
  lights: boolean | null
  max_hourly_rate: number | null
  owner_type: string | null
  available_date: string | null
  available_time_start: string | null
  available_time_end: string | null
  distance_km: number | null
  location_lat: number | null
  location_lng: number | null
}

export interface CourtReservationState {
  courts: Court[]
  selectedCourt: Court | null
  userReservations: CourtReservation[]
  filters: CourtFilters
  isLoading: boolean
  error: string | null
  searchPerformed: boolean
  selectedDate: string
  availableTimeSlots: TimeSlot[]
  reservationModal: {
    isOpen: boolean
    courtId: number | null
    selectedDate: string | null
    selectedSlot: TimeSlot | null
  }
  userLocation: {
    lat: number
    lng: number
  } | null
  locationPermission: 'granted' | 'denied' | 'prompt' | null
}

const initialState: CourtReservationState = {
  courts: [],
  selectedCourt: null,
  userReservations: [],
  filters: {
    state_id: null,
    surface_type: null,
    indoor: null,
    lights: null,
    max_hourly_rate: null,
    owner_type: null,
    available_date: null,
    available_time_start: null,
    available_time_end: null,
    distance_km: 25,
    location_lat: null,
    location_lng: null
  },
  isLoading: false,
  error: null,
  searchPerformed: false,
  selectedDate: new Date().toISOString().split('T')[0],
  availableTimeSlots: [],
  reservationModal: {
    isOpen: false,
    courtId: null,
    selectedDate: null,
    selectedSlot: null
  },
  userLocation: null,
  locationPermission: null
}

const courtReservationSlice = createSlice({
  name: 'courtReservation',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setCourts: (state, action: PayloadAction<Court[]>) => {
      state.courts = action.payload
      state.searchPerformed = true
    },
    setSelectedCourt: (state, action: PayloadAction<Court | null>) => {
      state.selectedCourt = action.payload
    },
    setUserReservations: (state, action: PayloadAction<CourtReservation[]>) => {
      state.userReservations = action.payload
    },
    setFilters: (state, action: PayloadAction<Partial<CourtFilters>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload
    },
    setAvailableTimeSlots: (state, action: PayloadAction<TimeSlot[]>) => {
      state.availableTimeSlots = action.payload
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
    openReservationModal: (state, action: PayloadAction<{
      courtId: number
      date: string
      timeSlot: TimeSlot
    }>) => {
      state.reservationModal = {
        isOpen: true,
        courtId: action.payload.courtId,
        selectedDate: action.payload.date,
        selectedSlot: action.payload.timeSlot
      }
    },
    closeReservationModal: (state) => {
      state.reservationModal = {
        isOpen: false,
        courtId: null,
        selectedDate: null,
        selectedSlot: null
      }
    },
    addReservation: (state, action: PayloadAction<CourtReservation>) => {
      state.userReservations.unshift(action.payload)
      
      // Update available time slots if viewing the same court
      if (state.selectedCourt && state.selectedCourt.id === action.payload.court_id) {
        state.availableTimeSlots = state.availableTimeSlots.map(slot => {
          if (slot.start_time === action.payload.start_time && 
              slot.end_time === action.payload.end_time) {
            return { ...slot, available: false, reservation_id: action.payload.id }
          }
          return slot
        })
      }
    },
    updateReservation: (state, action: PayloadAction<CourtReservation>) => {
      const index = state.userReservations.findIndex(res => res.id === action.payload.id)
      if (index !== -1) {
        state.userReservations[index] = action.payload
      }
      
      // Update available time slots if reservation was canceled
      if (action.payload.status === 'canceled' && 
          state.selectedCourt && 
          state.selectedCourt.id === action.payload.court_id) {
        state.availableTimeSlots = state.availableTimeSlots.map(slot => {
          if (slot.reservation_id === action.payload.id) {
            return { ...slot, available: true, reservation_id: undefined }
          }
          return slot
        })
      }
    },
    clearCourtReservation: (state) => {
      state.courts = []
      state.selectedCourt = null
      state.userReservations = []
      state.error = null
      state.searchPerformed = false
      state.availableTimeSlots = []
      state.reservationModal = {
        isOpen: false,
        courtId: null,
        selectedDate: null,
        selectedSlot: null
      }
    }
  }
})

export const {
  setLoading,
  setError,
  setCourts,
  setSelectedCourt,
  setUserReservations,
  setFilters,
  setSelectedDate,
  setAvailableTimeSlots,
  setUserLocation,
  setLocationPermission,
  openReservationModal,
  closeReservationModal,
  addReservation,
  updateReservation,
  clearCourtReservation
} = courtReservationSlice.actions

// Search courts based on filters
export const searchCourts = (filters: Partial<CourtFilters>) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Searching courts...'))
  
  try {
    const response = await apiClient.post<Court[]>('/api/court-reservations/search', filters)
    dispatch(setCourts(response.data))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(setError('Failed to search courts'))
    dispatch(stopLoading())
    throw error
  }
}

// Get court availability for a specific date
export const getCourtAvailability = (courtId: number, date: string) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading availability...'))
  
  try {
    const response = await apiClient.get<TimeSlot[]>(`/api/court-reservations/courts/${courtId}/availability?date=${date}`)
    dispatch(setAvailableTimeSlots(response.data))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(setError('Failed to load availability'))
    dispatch(stopLoading())
    throw error
  }
}

// Get court details
export const getCourtDetails = (courtId: number) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading court details...'))
  
  try {
    const response = await apiClient.get<Court>(`/api/court-reservations/courts/${courtId}`)
    dispatch(setSelectedCourt(response.data))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(setError('Failed to load court details'))
    dispatch(stopLoading())
    throw error
  }
}

// Get user's court reservations
export const fetchUserReservations = () => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading your reservations...'))
  
  try {
    const response = await apiClient.get<CourtReservation[]>('/api/court-reservations/reservations')
    dispatch(setUserReservations(response.data))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(setError('Failed to load reservations'))
    dispatch(stopLoading())
    throw error
  }
}

// Make a court reservation
export const makeCourtReservation = (reservationData: {
  court_id: number
  date: string
  start_time: string
  end_time: string
}) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Making reservation...'))
  
  try {
    const response = await apiClient.post<CourtReservation>('/api/court-reservations/reserve', reservationData)
    dispatch(addReservation(response.data))
    dispatch(closeReservationModal())
    dispatch(stopLoading())
    return response.data
  } catch (error) {
    dispatch(setError('Failed to make reservation'))
    dispatch(stopLoading())
    throw error
  }
}

// Cancel a court reservation
export const cancelCourtReservation = (reservationId: number) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Canceling reservation...'))
  
  try {
    const response = await apiClient.put<CourtReservation>(`/api/court-reservations/reservations/${reservationId}/cancel`)
    dispatch(updateReservation(response.data))
    dispatch(stopLoading())
    return response.data
  } catch (error) {
    dispatch(setError('Failed to cancel reservation'))
    dispatch(stopLoading())
    throw error
  }
}

export default courtReservationSlice.reducer