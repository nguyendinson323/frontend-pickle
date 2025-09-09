import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

interface Court {
  id: number
  name: string
  owner_type: string
  owner_id: number
  address: string
  state_id: number
  court_count: number
  surface_type: string
  indoor: boolean
  lights: boolean
  amenities: string
  description: string
  hourly_rate: number
  created_at: string
  updated_at: string
}

interface CourtSchedule {
  id: number
  court_id: number
  day_of_week: number
  open_time: string
  close_time: string
  is_closed: boolean
  created_at: string
}

interface CourtReservation {
  id: number
  court_id: number
  player_id: number
  date: string
  start_time: string
  end_time: string
  status: 'pending' | 'confirmed' | 'canceled'
  total_amount: number
  payment_status: 'pending' | 'paid' | 'refunded'
  stripe_payment_id: string | null
  created_at: string
  player: {
    id: number
    full_name: string
    profile_photo_url: string | null
    user: {
      email: string
      phone: string
    }
  }
  court: {
    id: number
    name: string
  }
}

interface CourtMaintenance {
  id: number
  court_id: number
  maintenance_type: string
  description: string
  start_date: string
  end_date: string
  status: 'scheduled' | 'in_progress' | 'completed'
  cost: number
  notes: string
  created_at: string
  court: {
    id: number
    name: string
  }
}

interface ClubCourtsState {
  courts: Court[]
  courtSchedules: CourtSchedule[]
  reservations: CourtReservation[]
  maintenance: CourtMaintenance[]
  stats: {
    total_courts: number
    total_reservations: number
    monthly_revenue: number
    occupancy_rate: number
    upcoming_maintenance: number
  } | null
  selectedCourt: Court | null
  loading: boolean
  error: string | null
}

const initialState: ClubCourtsState = {
  courts: [],
  courtSchedules: [],
  reservations: [],
  maintenance: [],
  stats: null,
  selectedCourt: null,
  loading: false,
  error: null
}

const clubCourtsSlice = createSlice({
  name: 'clubCourts',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setCourtsData: (state, action: PayloadAction<{
      courts: Court[]
      courtSchedules: CourtSchedule[]
      reservations: CourtReservation[]
      maintenance: CourtMaintenance[]
      stats: ClubCourtsState['stats']
    }>) => {
      state.courts = action.payload.courts
      state.courtSchedules = action.payload.courtSchedules
      state.reservations = action.payload.reservations
      state.maintenance = action.payload.maintenance
      state.stats = action.payload.stats
    },
    setSelectedCourt: (state, action: PayloadAction<Court | null>) => {
      state.selectedCourt = action.payload
    },
    addCourt: (state, action: PayloadAction<Court>) => {
      state.courts.push(action.payload)
    },
    updateCourt: (state, action: PayloadAction<Court>) => {
      const index = state.courts.findIndex(court => court.id === action.payload.id)
      if (index !== -1) {
        state.courts[index] = action.payload
      }
    },
    deleteCourt: (state, action: PayloadAction<number>) => {
      state.courts = state.courts.filter(court => court.id !== action.payload)
    },
    addCourtSchedule: (state, action: PayloadAction<CourtSchedule>) => {
      state.courtSchedules.push(action.payload)
    },
    updateCourtSchedule: (state, action: PayloadAction<CourtSchedule>) => {
      const index = state.courtSchedules.findIndex(schedule => schedule.id === action.payload.id)
      if (index !== -1) {
        state.courtSchedules[index] = action.payload
      }
    },
    updateReservationStatus: (state, action: PayloadAction<{ id: number; status: string }>) => {
      const index = state.reservations.findIndex(reservation => reservation.id === action.payload.id)
      if (index !== -1) {
        state.reservations[index].status = action.payload.status as 'pending' | 'confirmed' | 'canceled'
      }
    },
    addMaintenance: (state, action: PayloadAction<CourtMaintenance>) => {
      state.maintenance.push(action.payload)
    },
    updateMaintenance: (state, action: PayloadAction<CourtMaintenance>) => {
      const index = state.maintenance.findIndex(item => item.id === action.payload.id)
      if (index !== -1) {
        state.maintenance[index] = action.payload
      }
    }
  }
})

export const {
  setLoading,
  setError,
  setCourtsData,
  setSelectedCourt,
  addCourt,
  updateCourt,
  deleteCourt,
  addCourtSchedule,
  updateCourtSchedule,
  updateReservationStatus,
  addMaintenance,
  updateMaintenance
} = clubCourtsSlice.actions

// API Functions
export const fetchClubCourtsData = () => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    const response = await axios.get('/api/club/courts')
    dispatch(setCourtsData(response.data))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch courts data'))
  } finally {
    dispatch(setLoading(false))
  }
}

export const createCourt = (courtData: {
  name: string
  address: string
  court_count: number
  surface_type: string
  indoor: boolean
  lights: boolean
  amenities: string
  description: string
  hourly_rate: number
}) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    const response = await axios.post('/api/club/courts', courtData)
    dispatch(addCourt(response.data.court))
    
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to create court'))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export const updateCourtInfo = (courtId: number, courtData: Partial<Court>) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    const response = await axios.put(`/api/club/courts/${courtId}`, courtData)
    dispatch(updateCourt(response.data.court))
    
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to update court'))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export const deleteCourtInfo = (courtId: number) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    await axios.delete(`/api/club/courts/${courtId}`)
    dispatch(deleteCourt(courtId))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to delete court'))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export const updateCourtScheduleInfo = (scheduleId: number, scheduleData: {
  day_of_week: number
  open_time: string
  close_time: string
  is_closed: boolean
}) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    const response = await axios.put(`/api/club/courts/schedules/${scheduleId}`, scheduleData)
    dispatch(updateCourtSchedule(response.data.schedule))
    
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to update schedule'))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export const updateReservationStatusInfo = (reservationId: number, status: string) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    await axios.put(`/api/club/courts/reservations/${reservationId}/status`, { status })
    dispatch(updateReservationStatus({ id: reservationId, status }))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to update reservation status'))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export const createCourtMaintenance = (maintenanceData: {
  court_id: number
  maintenance_type: string
  description: string
  start_date: string
  end_date: string
  cost: number
  notes: string
}) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    const response = await axios.post('/api/club/courts/maintenance', maintenanceData)
    dispatch(addMaintenance(response.data.maintenance))
    
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to create maintenance record'))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export const updateMaintenanceInfo = (maintenanceId: number, maintenanceData: Partial<CourtMaintenance>) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    const response = await axios.put(`/api/club/courts/maintenance/${maintenanceId}`, maintenanceData)
    dispatch(updateMaintenance(response.data.maintenance))
    
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to update maintenance'))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export default clubCourtsSlice.reducer