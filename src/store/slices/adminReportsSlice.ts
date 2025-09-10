import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import api from '../../services/api'
import { startLoading, stopLoading } from './loadingSlice'
import { AppDispatch } from '../index'

interface ReportFilter {
  reportType: string
  dateFrom: string
  dateTo: string
  userType: string
  state: string
  status: string
  includeInactive: boolean
  groupBy: string
  format: string
}

interface ReportData {
  id: string
  name: string
  type: string
  generatedAt: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  downloadUrl: string | null
  fileSize: number
  recordCount: number
}

interface AdminReportsState {
  reports: ReportData[]
  reportFilter: ReportFilter
  reportStats: {
    totalReports: number
    pendingReports: number
    completedReports: number
    failedReports: number
    totalFileSize: number
    totalRecords: number
    mostPopularType: string
    averageGenerationTime: number
    systemMetrics: {
      totalUsers: number
      activeUsers: number
      totalTournaments: number
      activeTournaments: number
      completedTournaments: number
      totalCourts: number
      activeCourts: number
      totalPayments: number
      totalRevenue: number
      totalRankedPlayers: number
      totalMicrosites: number
      activeMicrosites: number
    }
  }
  availableReportTypes: {
    value: string
    label: string
    description: string
    fields: string[]
  }[]
  loading: boolean
  error: string | null
}

const initialState: AdminReportsState = {
  reports: [],
  reportFilter: {
    reportType: '',
    dateFrom: '',
    dateTo: '',
    userType: '',
    state: '',
    status: '',
    includeInactive: false,
    groupBy: '',
    format: 'csv'
  },
  reportStats: {
    totalReports: 0,
    pendingReports: 0,
    completedReports: 0,
    failedReports: 0,
    totalFileSize: 0,
    totalRecords: 0,
    mostPopularType: '',
    averageGenerationTime: 0,
    systemMetrics: {
      totalUsers: 0,
      activeUsers: 0,
      totalTournaments: 0,
      activeTournaments: 0,
      completedTournaments: 0,
      totalCourts: 0,
      activeCourts: 0,
      totalPayments: 0,
      totalRevenue: 0,
      totalRankedPlayers: 0,
      totalMicrosites: 0,
      activeMicrosites: 0
    }
  },
  availableReportTypes: [
    {
      value: 'users',
      label: 'User Activity Report',
      description: 'Comprehensive user data with activity metrics and engagement statistics',
      fields: ['id', 'email', 'first_name', 'last_name', 'user_type', 'created_at', 'updated_at', 'state', 'is_active', 'phone', 'registration_date']
    },
    {
      value: 'tournaments',
      label: 'Tournament Analytics Report', 
      description: 'Tournament performance data including participation and revenue metrics',
      fields: ['id', 'name', 'start_date', 'end_date', 'location', 'status', 'entry_fee', 'prize_pool', 'max_participants', 'organizer_id', 'state', 'description']
    },
    {
      value: 'courts',
      label: 'Courts Utilization Report',
      description: 'Court usage statistics and revenue analysis across all facilities',
      fields: ['id', 'name', 'location', 'court_type', 'surface_type', 'hourly_rate', 'is_active', 'owner_id', 'description', 'availability_hours']
    },
    {
      value: 'payments',
      label: 'Financial Summary Report',
      description: 'Complete financial overview including payments, subscriptions, and revenue trends',
      fields: ['id', 'amount', 'payment_method', 'status', 'transaction_id', 'payment_date', 'payer_id', 'payee_id', 'description', 'reference_type']
    },
    {
      value: 'rankings',
      label: 'Player Rankings Report',
      description: 'Player ranking data with progression tracking and tournament performance',
      fields: ['player_id', 'category_id', 'ranking_position', 'points', 'wins', 'losses', 'matches_played', 'last_updated', 'period_id', 'state']
    },
    {
      value: 'microsites',
      label: 'Microsites Performance Report',
      description: 'Microsite analytics including traffic data and content performance metrics',
      fields: ['id', 'subdomain', 'title', 'description', 'owner_id', 'is_active', 'created_at', 'updated_at', 'theme', 'custom_domain']
    },
    {
      value: 'system_activity',
      label: 'System Activity Report',
      description: 'Administrative actions and system usage patterns across the platform',
      fields: ['user_logins', 'tournament_registrations', 'court_bookings', 'payment_activity', 'ranking_updates', 'microsite_activity']
    }
  ],
  loading: false,
  error: null
}

const adminReportsSlice = createSlice({
  name: 'adminReports',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setReports: (state, action: PayloadAction<ReportData[]>) => {
      state.reports = action.payload
    },
    setReportFilter: (state, action: PayloadAction<Partial<ReportFilter>>) => {
      state.reportFilter = { ...state.reportFilter, ...action.payload }
    },
    setReportStats: (state, action: PayloadAction<typeof initialState.reportStats>) => {
      state.reportStats = action.payload
    },
    addReport: (state, action: PayloadAction<ReportData>) => {
      state.reports.unshift(action.payload)
    },
    updateReportStatus: (state, action: PayloadAction<{ reportId: string; status: 'pending' | 'processing' | 'completed' | 'failed'; downloadUrl?: string; fileSize?: number; recordCount?: number }>) => {
      const reportIndex = state.reports.findIndex(r => r.id === action.payload.reportId)
      if (reportIndex !== -1) {
        state.reports[reportIndex].status = action.payload.status
        if (action.payload.downloadUrl) {
          state.reports[reportIndex].downloadUrl = action.payload.downloadUrl
        }
        if (action.payload.fileSize) {
          state.reports[reportIndex].fileSize = action.payload.fileSize
        }
        if (action.payload.recordCount) {
          state.reports[reportIndex].recordCount = action.payload.recordCount
        }
      }
    },
    removeReport: (state, action: PayloadAction<string>) => {
      state.reports = state.reports.filter(r => r.id !== action.payload)
    }
  }
})

export const {
  setLoading,
  setError,
  setReports,
  setReportFilter,
  setReportStats,
  addReport,
  updateReportStatus,
  removeReport
} = adminReportsSlice.actions

// API Functions
export const fetchReports = () => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading reports...'))
  
  try {
    dispatch(setError(null))

    const response = await api.get('/api/admin/reports')
    const responseData = response.data as { reports: ReportData[], stats: typeof initialState.reportStats }

    dispatch(setReports(responseData.reports))
    dispatch(setReportStats(responseData.stats))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(setError('Failed to fetch reports'))
    dispatch(stopLoading())
    throw error
  }
}

export const generateReport = (reportConfig: {
  type: string
  name: string
  filters: any
  fields: string[]
  format: string
}) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Generating report...'))
  
  try {
    dispatch(setError(null))

    const response = await api.post('/api/admin/reports/generate', reportConfig, {
      responseType: 'blob'
    })

    // Create download link for the file
    const url = window.URL.createObjectURL(new Blob([response.data as BlobPart]))
    const link = document.createElement('a')
    link.href = url
    
    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `${reportConfig.type}-report-${timestamp}.${reportConfig.format}`
    
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)

    dispatch(stopLoading())
    return { success: true }
  } catch (error) {
    dispatch(setError('Failed to generate report'))
    dispatch(stopLoading())
    throw error
  }
}






export const getReportPreview = (reportConfig: {
  type: string
  filters: any
  fields: string[]
  limit: number
}) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Generating report preview...'))
  
  try {
    dispatch(setError(null))

    const response = await api.post('/api/admin/reports/preview', reportConfig)

    dispatch(stopLoading())
    return response.data
  } catch (error) {
    dispatch(setError('Failed to generate report preview'))
    dispatch(stopLoading())
    throw error
  }
}

export default adminReportsSlice.reducer