import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import api from '../../services/api'
import { startLoading, stopLoading } from './loadingSlice'
import { AppDispatch } from '../index'
import { MicrositeAdmin } from '../../types/admin'

interface MicrositeFilter {
  type: string
  status: string
  owner: string
  searchTerm: string
  dateFrom: string
  dateTo: string
  visibilityStatus: string
  contentStatus: string
}

interface AdminMicrositesState {
  microsites: MicrositeAdmin[]
  selectedMicrosite: MicrositeAdmin | null
  micrositeFilter: MicrositeFilter
  micrositeStats: {
    totalMicrosites: number
    activeMicrosites: number
    inactiveMicrosites: number
    pendingApprovalMicrosites: number
    clubMicrosites: number
    partnerMicrosites: number
    stateMicrosites: number
    averageContentScore: number
    totalPageViews: number
    averageMonthlyVisitors: number
  }
  loading: boolean
  error: string | null
}

const initialState: AdminMicrositesState = {
  microsites: [],
  selectedMicrosite: null,
  micrositeFilter: {
    type: '',
    status: '',
    owner: '',
    searchTerm: '',
    dateFrom: '',
    dateTo: '',
    visibilityStatus: '',
    contentStatus: ''
  },
  micrositeStats: {
    totalMicrosites: 0,
    activeMicrosites: 0,
    inactiveMicrosites: 0,
    pendingApprovalMicrosites: 0,
    clubMicrosites: 0,
    partnerMicrosites: 0,
    stateMicrosites: 0,
    averageContentScore: 0,
    totalPageViews: 0,
    averageMonthlyVisitors: 0
  },
  loading: false,
  error: null
}

const adminMicrositesSlice = createSlice({
  name: 'adminMicrosites',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setMicrosites: (state, action: PayloadAction<MicrositeAdmin[]>) => {
      state.microsites = action.payload
    },
    setSelectedMicrosite: (state, action: PayloadAction<MicrositeAdmin | null>) => {
      state.selectedMicrosite = action.payload
    },
    setMicrositeFilter: (state, action: PayloadAction<Partial<MicrositeFilter>>) => {
      state.micrositeFilter = { ...state.micrositeFilter, ...action.payload }
    },
    setMicrositeStats: (state, action: PayloadAction<typeof initialState.micrositeStats>) => {
      state.micrositeStats = action.payload
    },
    updateMicrositeStatus: (state, action: PayloadAction<{ micrositeId: number; status: 'active' | 'inactive' | 'suspended' | 'pending' | 'approved' | 'rejected' }>) => {
      const micrositeIndex = state.microsites.findIndex(m => m.id === action.payload.micrositeId)
      if (micrositeIndex !== -1 && state.microsites[micrositeIndex]) {
        state.microsites[micrositeIndex].status = action.payload.status
        state.microsites[micrositeIndex].updated_at = new Date().toISOString()
      }
    }
  }
})

export const {
  setLoading,
  setError,
  setMicrosites,
  setSelectedMicrosite,
  setMicrositeFilter,
  setMicrositeStats,
  updateMicrositeStatus
} = adminMicrositesSlice.actions

// API Functions
export const fetchMicrosites = (filters?: Partial<MicrositeFilter>) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading microsites...'))
  
  try {
    dispatch(setError(null))

    const queryParams = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value)
      })
    }

    const response = await api.get(`/api/admin/microsites?${queryParams.toString()}`)
    const responseData = response.data as { microsites: MicrositeAdmin[], stats: typeof initialState.micrositeStats }

    dispatch(setMicrosites(responseData.microsites))
    dispatch(setMicrositeStats(responseData.stats))
    dispatch(stopLoading())
  } catch (error: any) {
    dispatch(setError(error?.response?.data?.message || 'Failed to fetch microsites'))
    dispatch(stopLoading())
    console.error('Error fetching microsites:', error)
  }
}

export const getMicrositeDetails = (micrositeId: number) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading microsite details...'))
  
  try {
    dispatch(setError(null))

    const response = await api.get(`/api/admin/microsites/${micrositeId}`)

    dispatch(setSelectedMicrosite(response.data as MicrositeAdmin))
    dispatch(stopLoading())
  } catch (error: any) {
    dispatch(setError(error?.response?.data?.message || 'Failed to fetch microsite details'))
    dispatch(stopLoading())
    console.error('Error fetching microsite details:', error)
  }
}

export const updateMicrositeStatusAction = (micrositeId: number, status: 'active' | 'inactive' | 'suspended' | 'pending' | 'approved' | 'rejected', reason?: string) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Updating microsite status...'))
  
  try {
    dispatch(setError(null))

    const response = await api.put(`/api/admin/microsites/${micrositeId}/status`, { status, reason })

    dispatch(updateMicrositeStatus({ micrositeId, status }))
    dispatch(stopLoading())
    return response.data
  } catch (error) {
    dispatch(setError('Failed to update microsite status'))
    dispatch(stopLoading())
    throw error
  }
}

export const approveMicrosite = (micrositeId: number) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Approving microsite...'))

  try {
    dispatch(setError(null))

    const response = await api.post(`/api/admin/microsites/${micrositeId}/approve`)

    dispatch(updateMicrositeStatus({ micrositeId, status: 'approved' }))
    dispatch(stopLoading())
    return response.data
  } catch (error) {
    dispatch(setError('Failed to approve microsite'))
    dispatch(stopLoading())
    throw error
  }
}

export const rejectMicrosite = (micrositeId: number, reason: string) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Rejecting microsite...'))

  try {
    dispatch(setError(null))

    const response = await api.post(`/api/admin/microsites/${micrositeId}/reject`, { reason })

    dispatch(updateMicrositeStatus({ micrositeId, status: 'rejected' }))
    dispatch(stopLoading())
    return response.data
  } catch (error) {
    dispatch(setError('Failed to reject microsite'))
    dispatch(stopLoading())
    throw error
  }
}

export const suspendMicrosite = (micrositeId: number, reason: string) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Suspending microsite...'))
  
  try {
    dispatch(setError(null))

    const response = await api.post(`/api/admin/microsites/${micrositeId}/suspend`, { reason })

    dispatch(updateMicrositeStatus({ micrositeId, status: 'suspended' }))
    dispatch(stopLoading())
    return response.data
  } catch (error) {
    dispatch(setError('Failed to suspend microsite'))
    dispatch(stopLoading())
    throw error
  }
}

export const exportMicrosites = (filters: Partial<MicrositeFilter>, format: 'csv' | 'excel' | 'pdf') => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Exporting microsites...'))

  try {
    dispatch(setError(null))

    const queryParams = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value)
      })
    }
    queryParams.append('format', format)

    const response = await api.get(`/api/admin/microsites/export?${queryParams.toString()}`, {
      responseType: 'blob'
    })

    const blob = response.data as Blob
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `microsites-export-${new Date().toISOString().split('T')[0]}.${format}`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)

    dispatch(stopLoading())
    return response.data
  } catch (error: any) {
    dispatch(setError(error?.response?.data?.message || 'Failed to export microsites'))
    dispatch(stopLoading())
    console.error('Error exporting microsites:', error)
  }
}

export const generateMicrositeReport = (micrositeId: number) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Generating microsite report...'))
  
  try {
    dispatch(setError(null))

    const response = await api.get(`/api/admin/microsites/${micrositeId}/report`)

    dispatch(stopLoading())
    return response.data
  } catch (error) {
    dispatch(setError('Failed to generate microsite report'))
    dispatch(stopLoading())
    throw error
  }
}

export const sendMicrositeNotification = (micrositeId: number, subject: string, message: string, recipients: string[]) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Sending microsite notification...'))
  
  try {
    dispatch(setError(null))

    const response = await api.post(`/api/admin/microsites/${micrositeId}/notify`, {
      subject,
      message,
      recipients
    })

    dispatch(stopLoading())
    return response.data
  } catch (error) {
    dispatch(setError('Failed to send microsite notification'))
    dispatch(stopLoading())
    throw error
  }
}

export const getMicrositeAnalytics = (micrositeId: number, period: string) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading microsite analytics...'))
  
  try {
    dispatch(setError(null))

    const response = await api.get(`/api/admin/microsites/${micrositeId}/analytics?period=${period}`)

    dispatch(stopLoading())
    return response.data
  } catch (error) {
    dispatch(setError('Failed to fetch microsite analytics'))
    dispatch(stopLoading())
    throw error
  }
}

export const performContentAudit = (micrositeId: number) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Performing content audit...'))
  
  try {
    dispatch(setError(null))

    const response = await api.post(`/api/admin/microsites/${micrositeId}/audit`)

    dispatch(stopLoading())
    return response.data
  } catch (error) {
    dispatch(setError('Failed to perform content audit'))
    dispatch(stopLoading())
    throw error
  }
}

export default adminMicrositesSlice.reducer