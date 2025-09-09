import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '../index'
import { startLoading, stopLoading } from './loadingSlice'
import api from '../../services/api'

export interface PlayerStats {
  player_id: number
  total_matches: number
  wins: number
  losses: number
  win_percentage: number
  current_streak: number
  longest_win_streak: number
  longest_loss_streak: number
  total_tournaments: number
  tournament_wins: number
  finals_appearances: number
  semifinal_appearances: number
  points_scored: number
  points_against: number
  point_differential: number
  average_points_per_match: number
  games_won: number
  games_lost: number
  sets_won: number
  sets_lost: number
  aces: number
  double_faults: number
  unforced_errors: number
  winners: number
  break_points_won: number
  break_points_faced: number
  service_points_won: number
  service_points_played: number
  return_points_won: number
  return_points_played: number
  net_points_won: number
  net_points_played: number
  updated_at: string
}

export interface PlayerRanking {
  player_id: number
  ranking_position: number
  previous_position: number | null
  points: number
  previous_points: number
  ranking_type: 'overall' | 'state' | 'club' | 'age_group'
  category: string | null
  region: string | null
  last_updated: string
  player: {
    id: number
    full_name: string
    profile_image: string | null
    skill_level: string | null
    club: {
      id: number
      name: string
    } | null
    state: {
      id: number
      name: string
      short_code: string
    } | null
  }
  rank_change: 'up' | 'down' | 'same' | 'new'
  rank_change_amount: number
  matches_played_period: number
  recent_performance: {
    last_30_days: {
      matches: number
      wins: number
      tournaments: number
      points_earned: number
    }
  }
}

export interface MatchResult {
  id: number
  player1_id: number
  player2_id: number
  winner_id: number | null
  match_type: 'tournament' | 'friendly' | 'league'
  match_format: 'singles' | 'doubles'
  match_date: string
  sets: {
    set_number: number
    player1_score: number
    player2_score: number
  }[]
  final_score: string
  duration_minutes: number | null
  tournament: {
    id: number
    name: string
    level: string
  } | null
  opponent: {
    id: number
    full_name: string
    profile_image: string | null
    skill_level: string | null
  }
  result: 'win' | 'loss'
  points_earned: number
  performance_rating: number
}

export interface TournamentPerformance {
  tournament_id: number
  tournament_name: string
  tournament_level: string
  tournament_date: string
  final_position: string
  matches_won: number
  matches_lost: number
  sets_won: number
  sets_lost: number
  points_earned: number
  prize_money: number | null
  performance_rating: number
  tournament_size: number
  category: string
}

export interface PerformanceMetrics {
  current_form: {
    last_10_matches: {
      wins: number
      losses: number
      win_percentage: number
    }
    last_30_days: {
      matches: number
      wins: number
      tournaments: number
      ranking_change: number
    }
    current_streak: {
      type: 'win' | 'loss'
      count: number
    }
  }
  skill_breakdown: {
    serve_rating: number
    return_rating: number
    net_play_rating: number
    groundstroke_rating: number
    consistency_rating: number
    power_rating: number
    placement_rating: number
    mental_rating: number
  }
  comparative_stats: {
    vs_higher_ranked: {
      matches: number
      wins: number
      win_percentage: number
    }
    vs_lower_ranked: {
      matches: number
      wins: number
      win_percentage: number
    }
    vs_same_level: {
      matches: number
      wins: number
      win_percentage: number
    }
  }
}

export interface PlayerRankingsState {
  playerStats: PlayerStats | null
  playerRankings: PlayerRanking[]
  recentMatches: MatchResult[]
  tournamentHistory: TournamentPerformance[]
  performanceMetrics: PerformanceMetrics | null
  leaderboards: {
    overall: PlayerRanking[]
    state: PlayerRanking[]
    club: PlayerRanking[]
    age_group: PlayerRanking[]
  }
  selectedRankingType: 'overall' | 'state' | 'club' | 'age_group'
  selectedTimeframe: '30d' | '3m' | '6m' | '1y' | 'all'
  isLoading: boolean
  error: string | null
  filters: {
    match_type: string | null
    opponent_skill_level: string | null
    tournament_level: string | null
    date_range: {
      start: string | null
      end: string | null
    }
  }
  statsPeriod: {
    start_date: string
    end_date: string
    label: string
  }
  comparisonMode: boolean
  comparisonPlayer: PlayerRanking | null
}

const initialState: PlayerRankingsState = {
  playerStats: null,
  playerRankings: [],
  recentMatches: [],
  tournamentHistory: [],
  performanceMetrics: null,
  leaderboards: {
    overall: [],
    state: [],
    club: [],
    age_group: []
  },
  selectedRankingType: 'overall',
  selectedTimeframe: '30d',
  isLoading: false,
  error: null,
  filters: {
    match_type: null,
    opponent_skill_level: null,
    tournament_level: null,
    date_range: {
      start: null,
      end: null
    }
  },
  statsPeriod: {
    start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
    label: 'Last 30 Days'
  },
  comparisonMode: false,
  comparisonPlayer: null
}

const playerRankingsSlice = createSlice({
  name: 'playerRankings',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setPlayerStats: (state, action: PayloadAction<PlayerStats>) => {
      state.playerStats = action.payload
    },
    setPlayerRankings: (state, action: PayloadAction<PlayerRanking[]>) => {
      state.playerRankings = action.payload
    },
    setRecentMatches: (state, action: PayloadAction<MatchResult[]>) => {
      state.recentMatches = action.payload
    },
    setTournamentHistory: (state, action: PayloadAction<TournamentPerformance[]>) => {
      state.tournamentHistory = action.payload
    },
    setPerformanceMetrics: (state, action: PayloadAction<PerformanceMetrics>) => {
      state.performanceMetrics = action.payload
    },
    setLeaderboards: (state, action: PayloadAction<{
      type: 'overall' | 'state' | 'club' | 'age_group'
      data: PlayerRanking[]
    }>) => {
      state.leaderboards[action.payload.type] = action.payload.data
    },
    setSelectedRankingType: (state, action: PayloadAction<'overall' | 'state' | 'club' | 'age_group'>) => {
      state.selectedRankingType = action.payload
    },
    setSelectedTimeframe: (state, action: PayloadAction<'30d' | '3m' | '6m' | '1y' | 'all'>) => {
      state.selectedTimeframe = action.payload
      
      // Update stats period based on timeframe
      const now = new Date()
      let startDate: Date
      let label: string
      
      switch (action.payload) {
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          label = 'Last 30 Days'
          break
        case '3m':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
          label = 'Last 3 Months'
          break
        case '6m':
          startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000)
          label = 'Last 6 Months'
          break
        case '1y':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
          label = 'Last Year'
          break
        default:
          startDate = new Date('2020-01-01')
          label = 'All Time'
      }
      
      state.statsPeriod = {
        start_date: startDate.toISOString().split('T')[0],
        end_date: now.toISOString().split('T')[0],
        label
      }
    },
    setFilters: (state, action: PayloadAction<Partial<typeof initialState.filters>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    setComparisonMode: (state, action: PayloadAction<boolean>) => {
      state.comparisonMode = action.payload
      if (!action.payload) {
        state.comparisonPlayer = null
      }
    },
    setComparisonPlayer: (state, action: PayloadAction<PlayerRanking | null>) => {
      state.comparisonPlayer = action.payload
    },
    clearPlayerRankings: (state) => {
      state.playerStats = null
      state.playerRankings = []
      state.recentMatches = []
      state.tournamentHistory = []
      state.performanceMetrics = null
      state.error = null
      state.comparisonMode = false
      state.comparisonPlayer = null
    }
  }
})

export const {
  setLoading,
  setError,
  setPlayerStats,
  setPlayerRankings,
  setRecentMatches,
  setTournamentHistory,
  setPerformanceMetrics,
  setLeaderboards,
  setSelectedRankingType,
  setSelectedTimeframe,
  setFilters,
  setComparisonMode,
  setComparisonPlayer,
  clearPlayerRankings
} = playerRankingsSlice.actions

// Get player's comprehensive statistics
export const fetchPlayerStats = (timeframe?: string) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading player statistics...'))
  
  try {
    const params = timeframe ? `?timeframe=${timeframe}` : ''
    const response = await api.get(`/api/player-rankings/stats${params}`)
    dispatch(setPlayerStats(response.data as PlayerStats))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(setError('Failed to load player statistics'))
    dispatch(stopLoading())
    throw error
  }
}

// Get player's current rankings across different categories
export const fetchPlayerRankings = () => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading rankings...'))
  
  try {
    const response = await api.get('/api/player-rankings')
    dispatch(setPlayerRankings(response.data as PlayerRanking[]))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(setError('Failed to load rankings'))
    dispatch(stopLoading())
    throw error
  }
}

// Get recent match results
export const fetchRecentMatches = (limit: number = 10) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading recent matches...'))
  
  try {
    const response = await api.get<MatchResult[]>(`/api/player-rankings/recent-matches?limit=${limit}`)
    dispatch(setRecentMatches(response.data as MatchResult[]))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(setError('Failed to load recent matches'))
    dispatch(stopLoading())
    throw error
  }
}

// Get tournament performance history
export const fetchTournamentHistory = (timeframe?: string) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading tournament history...'))
  
  try {
    const response = await api.get<TournamentPerformance[]>(`/api/player-rankings/tournaments?timeframe=${timeframe || '1y'}`)
    dispatch(setTournamentHistory(response.data as TournamentPerformance[]))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(setError('Failed to load tournament history'))
    dispatch(stopLoading())
    throw error
  }
}

// Get detailed performance metrics
export const fetchPerformanceMetrics = (timeframe?: string) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading performance metrics...'))
  
  try {
    const response = await api.get<PerformanceMetrics>(`/api/player-rankings/performance?timeframe=${timeframe || '30d'}`)
    dispatch(setPerformanceMetrics(response.data as PerformanceMetrics))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(setError('Failed to load performance metrics'))
    dispatch(stopLoading())
    throw error
  }
}

// Get leaderboards for different ranking types
export const fetchLeaderboard = (rankingType: 'overall' | 'state' | 'club' | 'age_group', limit: number = 50) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading leaderboard...'))
  
  try {
    const response = await api.get<PlayerRanking[]>(`/api/player-rankings/leaderboard/${rankingType}?limit=${limit}`)
    dispatch(setLeaderboards({
      type: rankingType,
      data: response.data
    }))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(setError('Failed to load leaderboard'))
    dispatch(stopLoading())
    throw error
  }
}

// Search players for comparison
export const searchPlayersForComparison = (query: string) => async (dispatch: AppDispatch) => {
  try {
    const response = await api.get<PlayerRanking[]>(`/api/player-rankings/search?q=${encodeURIComponent(query)}`)
    return response.data
  } catch (error) {
    throw error
  }
}

// Get detailed comparison between two players
export const getPlayerComparison = (player1Id: number, player2Id: number, timeframe?: string) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading comparison data...'))
  
  try {
    const response = await api.get(`/api/player-rankings/compare/${player1Id}/${player2Id}?timeframe=${timeframe || '1y'}`)
    dispatch(stopLoading())
    return response.data
  } catch (error) {
    dispatch(setError('Failed to load comparison data'))
    dispatch(stopLoading())
    throw error
  }
}

export default playerRankingsSlice.reducer