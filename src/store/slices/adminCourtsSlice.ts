import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import api from '../../services/api'
import { startLoading, stopLoading } from './loadingSlice'
import { AppDispatch } from '../index'
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
  error: null,
  selectedReservations: []
}

const adminCourtsSlice = createSlice({
  name: 'adminCourts',
  initialState,
  reducers: {
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
export const fetchCourts = (filters?: Partial<CourtFilter>) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading courts...'))
  
  try {
    dispatch(setError(null))

    const queryParams = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value)
      })
    }

    const response = await api.get(`/api/admin/courts?${queryParams.toString()}`)
    const responseData = response.data as { courts: CourtInfo[], stats: typeof initialState.courtStats }

    dispatch(setCourts(responseData.courts))
    dispatch(setCourtStats(responseData.stats))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(setError('Failed to fetch courts'))
    dispatch(stopLoading())
    throw error
  }
}

export const fetchReservations = (filters?: Record<string, string | number>) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading reservations...'))
  
  try {
    dispatch(setError(null))

    const queryParams = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value as string)
      })
    }

    const response = await api.get(`/api/admin/courts/reservations?${queryParams.toString()}`)

    dispatch(setReservations(response.data as CourtReservation[]))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(setError('Failed to fetch reservations'))
    dispatch(stopLoading())
    throw error
  }
}

export const getCourtDetails = (courtId: number) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading court details...'))
  
  try {
    dispatch(setError(null))

    const response = await api.get(`/api/admin/courts/${courtId}`)

    dispatch(setSelectedCourt(response.data as CourtInfo))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(setError('Failed to fetch court details'))
    dispatch(stopLoading())
    throw error
  }
}

export const updateCourtStatusAction = (courtId: number, status: 'available' | 'occupied' | 'maintenance', reason?: string) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Updating court status...'))
  
  try {
    dispatch(setError(null))

    const response = await api.put(`/api/admin/courts/${courtId}/status`, { status, reason })

    dispatch(updateCourtStatus({ courtId, status }))
    dispatch(stopLoading())
    return response.data
  } catch (error) {
    dispatch(setError('Failed to update court status'))
    dispatch(stopLoading())
    throw error
  }
}

export const approveCourt = (courtId: number) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Approving court...'))
  
  try {
    dispatch(setError(null))

    const response = await api.post(`/api/admin/courts/${courtId}/approve`)

    dispatch(stopLoading())
    // Refresh courts list after stopping loading to avoid conflicts
    dispatch(fetchCourts())
    return response.data
  } catch (error) {
    dispatch(setError('Failed to approve court'))
    dispatch(stopLoading())
    throw error
  }
}

export const rejectCourt = (courtId: number, reason: string) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Rejecting court...'))
  
  try {
    dispatch(setError(null))

    const response = await api.post(`/api/admin/courts/${courtId}/reject`, { reason })

    dispatch(stopLoading())
    // Refresh courts list after stopping loading to avoid conflicts
    dispatch(fetchCourts())
    return response.data
  } catch (error) {
    dispatch(setError('Failed to reject court'))
    dispatch(stopLoading())
    throw error
  }
}

export const updateReservationStatusAction = (reservationId: number, status: 'active' | 'completed' | 'cancelled' | 'no_show', reason?: string) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Updating reservation status...'))
  
  try {
    dispatch(setError(null))

    const response = await api.put(`/api/admin/courts/reservations/${reservationId}/status`, { status, reason })

    dispatch(updateReservationStatus({ reservationId, status }))
    dispatch(stopLoading())
    return response.data
  } catch (error) {
    dispatch(setError('Failed to update reservation status'))
    dispatch(stopLoading())
    throw error
  }
}

export const bulkUpdateReservations = (reservationIds: number[], action: string, data?: Record<string, unknown>) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Updating reservations...'))
  
  try {
    dispatch(setError(null))

    const response = await api.post('/api/admin/courts/reservations/bulk-update', {
      reservationIds,
      action,
      data
    })

    dispatch(clearSelectedReservations())
    dispatch(stopLoading())
    // Refresh reservations list after stopping loading to avoid conflicts
    dispatch(fetchReservations())

    return response.data
  } catch (error) {
    dispatch(setError('Failed to update reservations'))
    dispatch(stopLoading())
    throw error
  }
}

export const exportCourts = (filters: Partial<CourtFilter>, format: 'csv' | 'excel' | 'pdf') => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Exporting courts...'))
  
  try {
    dispatch(setError(null))

    const queryParams = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value)
    })
    queryParams.append('format', format)

    const response = await api.get(`/api/admin/courts/export?${queryParams.toString()}`, {
      responseType: 'blob'
    })

    const url = window.URL.createObjectURL(new Blob([response.data as BlobPart]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `courts-export-${new Date().toISOString().split('T')[0]}.${format}`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)

    dispatch(stopLoading())
    return response.data
  } catch (error) {
    dispatch(setError('Failed to export courts'))
    dispatch(stopLoading())
    throw error
  }
}

export const getCourtUtilizationReport = (courtId?: number) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading utilization report...'))
  
  try {
    dispatch(setError(null))

    const url = courtId ? `/api/admin/courts/${courtId}/utilization` : '/api/admin/courts/utilization'
    const response = await api.get(url)

    dispatch(stopLoading())
    return response.data
  } catch (error) {
    dispatch(setError('Failed to get utilization report'))
    dispatch(stopLoading())
    throw error
  }
}

export default adminCourtsSlice.reducer