import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import api from '../../services/api'
import { startLoading, stopLoading } from './loadingSlice'
import { AppDispatch } from '../index'

interface TournamentAnalytics {
  total_tournaments: number
  tournaments_by_status: {
    upcoming: number
    ongoing: number
    completed: number
    canceled: number
  }
  tournaments_by_type: {
    [key: string]: number
  }
  participation_metrics: {
    total_registrations: number
    average_per_tournament: number
    completion_rate: number
  }
  revenue_metrics: {
    total_revenue: number
    average_entry_fee: number
    revenue_by_month: Array<{
      month: string
      revenue: number
      tournaments: number
    }>
  }
}

interface PlayerAnalytics {
  total_players: number
  growth_metrics: {
    new_registrations_this_month: number
    new_registrations_last_month: number
    growth_rate: number
    registrations_by_month: Array<{
      month: string
      new_players: number
      total_active: number
    }>
  }
  demographics: {
    age_distribution: {
      [key: string]: number
    }
    gender_distribution: {
      male: number
      female: number
      other: number
    }
    skill_level_distribution: {
      [key: string]: number
    }
  }
  activity_metrics: {
    active_players: number
    tournament_participants: number
    average_tournaments_per_player: number
  }
}

interface CourtAnalytics {
  total_courts: number
  utilization_metrics: {
    average_utilization_rate: number
    peak_hours: Array<{
      hour: number
      utilization_rate: number
    }>
    utilization_by_day: Array<{
      day: string
      utilization_rate: number
      bookings: number
    }>
  }
  revenue_metrics: {
    total_court_revenue: number
    average_revenue_per_court: number
    revenue_by_club: Array<{
      club_name: string
      total_revenue: number
      court_count: number
    }>
  }
}

interface ClubAnalytics {
  total_clubs: number
  membership_metrics: {
    total_members: number
    average_members_per_club: number
    membership_growth_rate: number
    membership_by_month: Array<{
      month: string
      total_members: number
      new_members: number
    }>
  }
  activity_metrics: {
    tournaments_hosted: number
    average_tournaments_per_club: number
    top_performing_clubs: Array<{
      club_name: string
      members: number
      tournaments_hosted: number
      total_courts: number
    }>
  }
}

interface PartnerAnalytics {
  total_partners: number
  engagement_metrics: {
    active_partnerships: number
    tournament_sponsorships: number
    total_sponsorship_value: number
    average_sponsorship_value: number
  }
  partnership_types: {
    [key: string]: number
  }
  top_partners: Array<{
    partner_name: string
    sponsorship_count: number
    total_value: number
    partnership_type: string
  }>
}

interface FinancialAnalytics {
  revenue_summary: {
    total_revenue: number
    tournament_revenue: number
    membership_revenue: number
    court_booking_revenue: number
    sponsorship_revenue: number
  }
  expense_summary: {
    total_expenses: number
    operational_expenses: number
    marketing_expenses: number
    facility_expenses: number
    event_expenses: number
  }
  profitability: {
    net_profit: number
    profit_margin: number
    roi: number
  }
  monthly_trends: Array<{
    month: string
    revenue: number
    expenses: number
    profit: number
  }>
}

interface ComparativeAnalytics {
  year_over_year: {
    players_growth: number
    tournaments_growth: number
    revenue_growth: number
    clubs_growth: number
  }
  benchmarking: {
    state_ranking: {
      players: number
      tournaments: number
      courts: number
      revenue: number
    }
    national_averages: {
      players_per_state: number
      tournaments_per_state: number
      courts_per_state: number
      revenue_per_state: number
    }
  }
}

interface StateStatisticsState {
  tournamentAnalytics: TournamentAnalytics | null
  playerAnalytics: PlayerAnalytics | null
  courtAnalytics: CourtAnalytics | null
  clubAnalytics: ClubAnalytics | null
  partnerAnalytics: PartnerAnalytics | null
  financialAnalytics: FinancialAnalytics | null
  comparativeAnalytics: ComparativeAnalytics | null
  dateRange: {
    start_date: string
    end_date: string
  }
  loading: boolean
  error: string | null
}

const initialState: StateStatisticsState = {
  tournamentAnalytics: null,
  playerAnalytics: null,
  courtAnalytics: null,
  clubAnalytics: null,
  partnerAnalytics: null,
  financialAnalytics: null,
  comparativeAnalytics: null,
  dateRange: {
    start_date: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0], // Start of current year
    end_date: new Date().toISOString().split('T')[0] // Today
  },
  loading: false,
  error: null
}

const stateStatisticsSlice = createSlice({
  name: 'stateStatistics',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setDateRange: (state, action: PayloadAction<{ start_date: string, end_date: string }>) => {
      state.dateRange = action.payload
    },
    setStatisticsData: (state, action: PayloadAction<{
      tournamentAnalytics: TournamentAnalytics
      playerAnalytics: PlayerAnalytics
      courtAnalytics: CourtAnalytics
      clubAnalytics: ClubAnalytics
      partnerAnalytics: PartnerAnalytics
      financialAnalytics: FinancialAnalytics
      comparativeAnalytics: ComparativeAnalytics
    }>) => {
      state.tournamentAnalytics = action.payload.tournamentAnalytics
      state.playerAnalytics = action.payload.playerAnalytics
      state.courtAnalytics = action.payload.courtAnalytics
      state.clubAnalytics = action.payload.clubAnalytics
      state.partnerAnalytics = action.payload.partnerAnalytics
      state.financialAnalytics = action.payload.financialAnalytics
      state.comparativeAnalytics = action.payload.comparativeAnalytics
    }
  }
})

export const {
  setLoading,
  setError,
  setDateRange,
  setStatisticsData
} = stateStatisticsSlice.actions

// API Functions
export const fetchStateStatisticsData = (dateRange?: { start_date: string, end_date: string }) => async (dispatch: AppDispatch, getState: any) => {
  dispatch(startLoading('Loading statistics data...'))
  
  try {
    dispatch(setError(null))
    
    const state = getState()
    const currentDateRange = dateRange || state.stateStatistics.dateRange
    
    // Update date range if provided
    if (dateRange) {
      dispatch(setDateRange(dateRange))
    }
    
    const response = await api.get('/api/state/statistics', {
      params: {
        start_date: currentDateRange.start_date,
        end_date: currentDateRange.end_date
      }
    })
    
    dispatch(setStatisticsData(response.data as {
      tournamentAnalytics: TournamentAnalytics
      playerAnalytics: PlayerAnalytics
      courtAnalytics: CourtAnalytics
      clubAnalytics: ClubAnalytics
      partnerAnalytics: PartnerAnalytics
      financialAnalytics: FinancialAnalytics
      comparativeAnalytics: ComparativeAnalytics
    }))
    dispatch(stopLoading())
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch statistics data'))
    dispatch(stopLoading())
    throw error
  }
}

export const exportStatisticsReport = (dateRange: { start_date: string, end_date: string }, format: 'pdf' | 'excel') => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Exporting statistics report...'))
  
  try {
    dispatch(setError(null))
    
    const response = await api.get('/api/state/statistics/export', {
      params: {
        start_date: dateRange.start_date,
        end_date: dateRange.end_date,
        format
      },
      responseType: 'blob'
    })
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data as BlobPart]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `state-statistics-${dateRange.start_date}-to-${dateRange.end_date}.${format === 'pdf' ? 'pdf' : 'xlsx'}`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
    
    dispatch(stopLoading())
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to export statistics report'))
    dispatch(stopLoading())
    throw error
  }
}

export default stateStatisticsSlice.reducer

// Export types
export type {
  TournamentAnalytics,
  PlayerAnalytics,
  CourtAnalytics,
  ClubAnalytics,
  PartnerAnalytics,
  FinancialAnalytics,
  ComparativeAnalytics
}