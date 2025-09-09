import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { CourtInfo } from '../../types/admin'

interface CourtReservation {
  id: number
  court_id: number
  user_id: number
  user_name: string
  user_type: string
  start_time: string
  end_time: string
  status: 'active' | 'completed' | 'cancelled' | 'no_show'
  amount_paid: number
  payment_status: 'paid' | 'pending' | 'refunded'
  created_at: string
}

interface CourtFilter {
  location: string
  owner: string
  status: string
  surface: string
  lighting: string
  indoor: string
  searchTerm: string
  minRate: string
  maxRate: string
}

interface AdminCourtsState {
  courts: CourtInfo[]
  reservations: CourtReservation[]
  selectedCourt: CourtInfo | null
  courtFilter: CourtFilter
  courtStats: {
    totalCourts: number
    activeCourts: number
    availableCourts: number
    occupiedCourts: number
    maintenanceCourts: number
    totalReservations: number
    totalRevenue: number
    averageUtilization: number
    topPerformingCourt: string
    pendingApprovals: number
  }
  loading: boolean
  error: string | null
  selectedReservations: number[]
}

const initialState: AdminCourtsState = {
  courts: [],
  reservations: [],
  selectedCourt: null,
  courtFilter: {
    location: '',
    owner: '',
    status: '',
    surface: '',
    lighting: '',
    indoor: '',
    searchTerm: '',
    minRate: '',
    maxRate: ''
  },
  courtStats: {
    totalCourts: 0,
    activeCourts: 0,
    availableCourts: 0,
    occupiedCourts: 0,
    maintenanceCourts: 0,
    totalReservations: 0,
    totalRevenue: 0,
    averageUtilization: 0,
    topPerformingCourt: '',
    pendingApprovals: 0
  },
  loading: false,
  error: null,
  selectedReservations: []
}

const adminCourtsSlice = createSlice({
  name: 'adminCourts',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setCourts: (state, action: PayloadAction<CourtInfo[]>) => {
      state.courts = action.payload
    },
    setReservations: (state, action: PayloadAction<CourtReservation[]>) => {
      state.reservations = action.payload
    },
    setSelectedCourt: (state, action: PayloadAction<CourtInfo | null>) => {
      state.selectedCourt = action.payload
    },
    setCourtFilter: (state, action: PayloadAction<Partial<CourtFilter>>) => {
      state.courtFilter = { ...state.courtFilter, ...action.payload }
    },
    setCourtStats: (state, action: PayloadAction<typeof initialState.courtStats>) => {
      state.courtStats = action.payload
    },
    setSelectedReservations: (state, action: PayloadAction<number[]>) => {
      state.selectedReservations = action.payload
    },
    addSelectedReservation: (state, action: PayloadAction<number>) => {
      if (!state.selectedReservations.includes(action.payload)) {
        state.selectedReservations.push(action.payload)
      }
    },
    removeSelectedReservation: (state, action: PayloadAction<number>) => {
      state.selectedReservations = state.selectedReservations.filter(id => id !== action.payload)
    },
    clearSelectedReservations: (state) => {
      state.selectedReservations = []
    },
    updateCourtStatus: (state, action: PayloadAction<{ courtId: number; status: 'available' | 'occupied' | 'maintenance' }>) => {
      const courtIndex = state.courts.findIndex(court => court.id === action.payload.courtId)
      if (courtIndex !== -1) {
        state.courts[courtIndex].status = action.payload.status
      }
    },
    updateReservationStatus: (state, action: PayloadAction<{ reservationId: number; status: 'active' | 'completed' | 'cancelled' | 'no_show' }>) => {
      const reservationIndex = state.reservations.findIndex(res => res.id === action.payload.reservationId)
      if (reservationIndex !== -1) {
        state.reservations[reservationIndex].status = action.payload.status
      }
    }
  }
})

export const {
  setLoading,
  setError,
  setCourts,
  setReservations,
  setSelectedCourt,
  setCourtFilter,
  setCourtStats,
  setSelectedReservations,
  addSelectedReservation,
  removeSelectedReservation,
  clearSelectedReservations,
  updateCourtStatus,
  updateReservationStatus
} = adminCourtsSlice.actions

// API Functions
export const fetchCourts = (filters?: Partial<CourtFilter>) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))

    const queryParams = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value)
      })
    }

    const response = await axios.get(`/api/admin/courts?${queryParams.toString()}`)

    dispatch(setCourts(response.data.courts))
    dispatch(setCourtStats(response.data.stats))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch courts'))
  } finally {
    dispatch(setLoading(false))
  }
}

export const fetchReservations = (filters?: any) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))

    const queryParams = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value as string)
      })
    }

    const response = await axios.get(`/api/admin/courts/reservations?${queryParams.toString()}`)

    dispatch(setReservations(response.data))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch reservations'))
  } finally {
    dispatch(setLoading(false))
  }
}

export const getCourtDetails = (courtId: number) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))

    const response = await axios.get(`/api/admin/courts/${courtId}`)

    dispatch(setSelectedCourt(response.data))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch court details'))
  } finally {
    dispatch(setLoading(false))
  }
}

export const updateCourtStatusAction = (courtId: number, status: 'available' | 'occupied' | 'maintenance', reason?: string) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const response = await axios.put(`/api/admin/courts/${courtId}/status`, { status, reason })

    dispatch(updateCourtStatus({ courtId, status }))
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to update court status'))
    throw error
  }
}

export const approveCourt = (courtId: number) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const response = await axios.post(`/api/admin/courts/${courtId}/approve`)

    // Refresh courts list
    dispatch(fetchCourts())
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to approve court'))
    throw error
  }
}

export const rejectCourt = (courtId: number, reason: string) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const response = await axios.post(`/api/admin/courts/${courtId}/reject`, { reason })

    // Refresh courts list
    dispatch(fetchCourts())
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to reject court'))
    throw error
  }
}

export const updateReservationStatusAction = (reservationId: number, status: 'active' | 'completed' | 'cancelled' | 'no_show', reason?: string) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const response = await axios.put(`/api/admin/courts/reservations/${reservationId}/status`, { status, reason })

    dispatch(updateReservationStatus({ reservationId, status }))
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to update reservation status'))
    throw error
  }
}

export const bulkUpdateReservations = (reservationIds: number[], action: string, data?: any) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))

    const response = await axios.post('/api/admin/courts/reservations/bulk-update', {
      reservationIds,
      action,
      data
    })

    // Refresh reservations list
    dispatch(fetchReservations())
    dispatch(clearSelectedReservations())

    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to update reservations'))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export const exportCourts = (filters: Partial<CourtFilter>, format: 'csv' | 'excel' | 'pdf') => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const queryParams = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value)
    })
    queryParams.append('format', format)

    const response = await axios.get(`/api/admin/courts/export?${queryParams.toString()}`, {
      responseType: 'blob'
    })

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `courts-export-${new Date().toISOString().split('T')[0]}.${format}`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)

    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to export courts'))
    throw error
  }
}

export const getCourtUtilizationReport = (courtId?: number) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const url = courtId ? `/api/admin/courts/${courtId}/utilization` : '/api/admin/courts/utilization'
    const response = await axios.get(url)

    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to get utilization report'))
    throw error
  }
}

export default adminCourtsSlice.reducer