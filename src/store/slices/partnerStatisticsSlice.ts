import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import api from '../../services/api'
import { startLoading, stopLoading } from './loadingSlice'
import { AppDispatch } from '../index'

interface RevenueData {
  month: string
  court_revenue: number
  tournament_revenue: number
  total_revenue: number
}

interface BookingMetrics {
  total_reservations: number
  completed_reservations: number
  canceled_reservations: number
  average_booking_value: number
  peak_booking_hours: {
    hour: number
    count: number
  }[]
  popular_courts: {
    court_id: number
    court_name: string
    reservation_count: number
  }[]
}

interface TournamentMetrics {
  total_tournaments: number
  completed_tournaments: number
  active_tournaments: number
  total_participants: number
  average_participants_per_tournament: number
  tournament_revenue: number
}

interface CustomerMetrics {
  total_customers: number
  returning_customers: number
  new_customers_this_month: number
  customer_retention_rate: number
  top_customers: {
    user_id: number
    customer_name: string
    total_spent: number
    total_reservations: number
  }[]
}

interface PerformanceMetrics {
  court_utilization_rate: number
  average_session_duration: number
  cancellation_rate: number
  revenue_per_court: number
  monthly_growth_rate: number
}

interface PartnerStatisticsState {
  revenueData: RevenueData[]
  bookingMetrics: BookingMetrics | null
  tournamentMetrics: TournamentMetrics | null
  customerMetrics: CustomerMetrics | null
  performanceMetrics: PerformanceMetrics | null
  error: string | null
  dateRange: {
    startDate: string
    endDate: string
  }
}

const initialState: PartnerStatisticsState = {
  revenueData: [],
  bookingMetrics: null,
  tournamentMetrics: null,
  customerMetrics: null,
  performanceMetrics: null,
  error: null,
  dateRange: {
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0], // Start of year
    endDate: new Date().toISOString().split('T')[0] // Today
  }
}

const partnerStatisticsSlice = createSlice({
  name: 'partnerStatistics',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setStatisticsData: (state, action: PayloadAction<{
      revenueData: RevenueData[]
      bookingMetrics: BookingMetrics
      tournamentMetrics: TournamentMetrics
      customerMetrics: CustomerMetrics
      performanceMetrics: PerformanceMetrics
    }>) => {
      state.revenueData = action.payload.revenueData
      state.bookingMetrics = action.payload.bookingMetrics
      state.tournamentMetrics = action.payload.tournamentMetrics
      state.customerMetrics = action.payload.customerMetrics
      state.performanceMetrics = action.payload.performanceMetrics
    },
    setDateRange: (state, action: PayloadAction<{ startDate: string; endDate: string }>) => {
      state.dateRange = action.payload
    }
  }
})

export const {
  setError,
  setStatisticsData,
  setDateRange
} = partnerStatisticsSlice.actions

// API Functions
export const fetchPartnerStatistics = (dateRange?: { startDate: string; endDate: string }) => async (dispatch: AppDispatch, getState: any) => {
  dispatch(startLoading('Loading statistics...'))
  
  try {
    dispatch(setError(null))
    
    const state = getState()
    const currentDateRange = dateRange || state.partnerStatistics.dateRange
    
    if (dateRange) {
      dispatch(setDateRange(dateRange))
    }
    
    const response = await api.get('/api/partner/statistics', {
      params: currentDateRange
    })
    
    dispatch(setStatisticsData(response.data as {
      revenueData: RevenueData[];
      bookingMetrics: BookingMetrics;
      tournamentMetrics: TournamentMetrics;
      customerMetrics: CustomerMetrics;
      performanceMetrics: PerformanceMetrics;
    }))
    dispatch(stopLoading())
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch statistics'))
    dispatch(stopLoading())
    throw error
  }
}

export const exportStatisticsReport = (dateRange: { startDate: string; endDate: string }, format: 'csv' | 'pdf') => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Exporting statistics report...'))
  
  try {
    dispatch(setError(null))
    
    const response = await api.get('/api/partner/statistics/export', {
      params: { ...dateRange, format },
      responseType: 'blob'
    })
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data as BlobPart]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `partner-statistics-${dateRange.startDate}-${dateRange.endDate}.${format}`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
    
    dispatch(stopLoading())
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to export statistics'))
    dispatch(stopLoading())
    throw error
  }
}

export default partnerStatisticsSlice.reducer

// Export types
export type {
  RevenueData,
  BookingMetrics,
  TournamentMetrics,
  CustomerMetrics,
  PerformanceMetrics
}