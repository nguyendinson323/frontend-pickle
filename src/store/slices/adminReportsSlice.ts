import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

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
    averageGenerationTime: 0
  },
  availableReportTypes: [
    {
      value: 'users',
      label: 'User Activity Report',
      description: 'Comprehensive user data with activity metrics and engagement statistics',
      fields: ['user_info', 'activity_metrics', 'engagement_data', 'membership_details']
    },
    {
      value: 'tournaments',
      label: 'Tournament Analytics Report',
      description: 'Tournament performance data including participation and revenue metrics',
      fields: ['tournament_details', 'participation_stats', 'revenue_data', 'organizer_performance']
    },
    {
      value: 'courts',
      label: 'Courts Utilization Report',
      description: 'Court usage statistics and revenue analysis across all facilities',
      fields: ['court_details', 'utilization_metrics', 'reservation_data', 'revenue_analysis']
    },
    {
      value: 'payments',
      label: 'Financial Summary Report',
      description: 'Complete financial overview including payments, subscriptions, and revenue trends',
      fields: ['payment_transactions', 'subscription_data', 'revenue_breakdown', 'refund_analysis']
    },
    {
      value: 'rankings',
      label: 'Player Rankings Report',
      description: 'Player ranking data with progression tracking and tournament performance',
      fields: ['ranking_positions', 'point_changes', 'tournament_results', 'progression_trends']
    },
    {
      value: 'microsites',
      label: 'Microsites Performance Report',
      description: 'Microsite analytics including traffic data and content performance metrics',
      fields: ['site_performance', 'traffic_analytics', 'content_scores', 'owner_engagement']
    },
    {
      value: 'system_activity',
      label: 'System Activity Report',
      description: 'Administrative actions and system usage patterns across the platform',
      fields: ['admin_actions', 'system_metrics', 'error_logs', 'performance_data']
    },
    {
      value: 'custom',
      label: 'Custom Data Export',
      description: 'Build custom reports with specific data fields and filtering criteria',
      fields: ['custom_fields', 'advanced_filters', 'data_relationships', 'export_options']
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
    updateReportStatus: (state, action: PayloadAction<{ reportId: string; status: string; downloadUrl?: string; fileSize?: number; recordCount?: number }>) => {
      const reportIndex = state.reports.findIndex(r => r.id === action.payload.reportId)
      if (reportIndex !== -1) {
        state.reports[reportIndex].status = action.payload.status as any
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
export const fetchReports = () => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))

    const response = await axios.get('/api/admin/reports')

    dispatch(setReports(response.data.reports))
    dispatch(setReportStats(response.data.stats))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch reports'))
  } finally {
    dispatch(setLoading(false))
  }
}

export const generateReport = (reportConfig: {
  type: string
  name: string
  filters: any
  fields: string[]
  format: string
}) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const response = await axios.post('/api/admin/reports/generate', reportConfig)

    dispatch(addReport(response.data.report))
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to generate report'))
    throw error
  }
}

export const downloadReport = (reportId: string) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const response = await axios.get(`/api/admin/reports/${reportId}/download`, {
      responseType: 'blob'
    })

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    
    const contentDisposition = response.headers['content-disposition']
    const filename = contentDisposition 
      ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
      : `report-${reportId}.${response.headers['content-type']?.includes('csv') ? 'csv' : 'xlsx'}`
    
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)

    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to download report'))
    throw error
  }
}

export const deleteReport = (reportId: string) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    await axios.delete(`/api/admin/reports/${reportId}`)

    dispatch(removeReport(reportId))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to delete report'))
    throw error
  }
}

export const getReportStatus = (reportId: string) => async (dispatch: any) => {
  try {
    const response = await axios.get(`/api/admin/reports/${reportId}/status`)

    dispatch(updateReportStatus({
      reportId,
      status: response.data.status,
      downloadUrl: response.data.downloadUrl,
      fileSize: response.data.fileSize,
      recordCount: response.data.recordCount
    }))

    return response.data
  } catch (error: any) {
    console.error('Failed to fetch report status:', error)
    throw error
  }
}

export const scheduleReport = (reportConfig: {
  type: string
  name: string
  filters: any
  fields: string[]
  format: string
  schedule: {
    frequency: 'daily' | 'weekly' | 'monthly'
    dayOfWeek?: number
    dayOfMonth?: number
    time: string
  }
  recipients: string[]
}) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const response = await axios.post('/api/admin/reports/schedule', reportConfig)

    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to schedule report'))
    throw error
  }
}

export const getScheduledReports = () => async (dispatch: any) => {
  try {
    const response = await axios.get('/api/admin/reports/scheduled')

    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch scheduled reports'))
    throw error
  }
}

export const getReportPreview = (reportConfig: {
  type: string
  filters: any
  fields: string[]
  limit: number
}) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const response = await axios.post('/api/admin/reports/preview', reportConfig)

    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to generate report preview'))
    throw error
  }
}

export default adminReportsSlice.reducer