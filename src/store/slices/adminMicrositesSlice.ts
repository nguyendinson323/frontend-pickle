import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
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
    updateMicrositeStatus: (state, action: PayloadAction<{ micrositeId: number; status: string }>) => {
      const micrositeIndex = state.microsites.findIndex(m => m.id === action.payload.micrositeId)
      if (micrositeIndex !== -1) {
        state.microsites[micrositeIndex].status = action.payload.status
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
export const fetchMicrosites = (filters?: Partial<MicrositeFilter>) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))

    const queryParams = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value)
      })
    }

    const response = await axios.get(`/api/admin/microsites?${queryParams.toString()}`)

    dispatch(setMicrosites(response.data.microsites))
    dispatch(setMicrositeStats(response.data.stats))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch microsites'))
  } finally {
    dispatch(setLoading(false))
  }
}

export const getMicrositeDetails = (micrositeId: number) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))

    const response = await axios.get(`/api/admin/microsites/${micrositeId}`)

    dispatch(setSelectedMicrosite(response.data))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch microsite details'))
  } finally {
    dispatch(setLoading(false))
  }
}

export const updateMicrositeStatusAction = (micrositeId: number, status: string, reason?: string) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const response = await axios.put(`/api/admin/microsites/${micrositeId}/status`, { status, reason })

    dispatch(updateMicrositeStatus({ micrositeId, status }))
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to update microsite status'))
    throw error
  }
}

export const approveMicrosite = (micrositeId: number) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const response = await axios.post(`/api/admin/microsites/${micrositeId}/approve`)

    dispatch(fetchMicrosites())
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to approve microsite'))
    throw error
  }
}

export const rejectMicrosite = (micrositeId: number, reason: string) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const response = await axios.post(`/api/admin/microsites/${micrositeId}/reject`, { reason })

    dispatch(fetchMicrosites())
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to reject microsite'))
    throw error
  }
}

export const suspendMicrosite = (micrositeId: number, reason: string) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const response = await axios.post(`/api/admin/microsites/${micrositeId}/suspend`, { reason })

    dispatch(updateMicrositeStatus({ micrositeId, status: 'suspended' }))
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to suspend microsite'))
    throw error
  }
}

export const exportMicrosites = (filters: Partial<MicrositeFilter>, format: 'csv' | 'excel' | 'pdf') => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const queryParams = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value)
    })
    queryParams.append('format', format)

    const response = await axios.get(`/api/admin/microsites/export?${queryParams.toString()}`, {
      responseType: 'blob'
    })

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `microsites-export-${new Date().toISOString().split('T')[0]}.${format}`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)

    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to export microsites'))
    throw error
  }
}

export const generateMicrositeReport = (micrositeId: number) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const response = await axios.get(`/api/admin/microsites/${micrositeId}/report`)

    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to generate microsite report'))
    throw error
  }
}

export const sendMicrositeNotification = (micrositeId: number, subject: string, message: string, recipients: string[]) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const response = await axios.post(`/api/admin/microsites/${micrositeId}/notify`, {
      subject,
      message,
      recipients
    })

    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to send microsite notification'))
    throw error
  }
}

export const getMicrositeAnalytics = (micrositeId: number, period: string) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const response = await axios.get(`/api/admin/microsites/${micrositeId}/analytics?period=${period}`)

    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch microsite analytics'))
    throw error
  }
}

export const performContentAudit = (micrositeId: number) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const response = await axios.post(`/api/admin/microsites/${micrositeId}/audit`)

    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to perform content audit'))
    throw error
  }
}

export default adminMicrositesSlice.reducer