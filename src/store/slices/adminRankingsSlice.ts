import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import api from '../../services/api'
import { startLoading, stopLoading } from './loadingSlice'
import { AppDispatch } from '../index'
import { RankingChange } from '../../types/admin'

interface PlayerRanking {
  id: number
  player_id: number
  player_name: string
  username: string
  current_position: number
  previous_position: number
  current_points: number
  previous_points: number
  change: number
  state_id: number
  state_name: string
  tournaments_played: number
  last_updated: string
  trend: 'up' | 'down' | 'stable' | 'new'
  nrtp_level: string
  category: string
  period: string
}

interface RankingFilter {
  state: string
  searchTerm: string
  minPosition: string
  maxPosition: string
  changeType: string
  dateFrom: string
  dateTo: string
  category: string
  period: string
  page: string
  limit: string
}

interface AdminRankingsState {
  playerRankings: PlayerRanking[]
  rankingChanges: RankingChange[]
  selectedPlayer: PlayerRanking | null
  rankingFilter: RankingFilter
  rankingStats: {
    totalRankedPlayers: number
    recentChanges: number
    averagePoints: number
    highestPoints: number
    mostActiveState: string
    totalTournamentsConsidered: number
    activePeriod: {
      id: number
      name: string
      start_date: string
      end_date: string
    } | null
  }
  pagination: {
    currentPage: number
    totalPages: number
    totalCount: number
  }
  periods: Array<{
    id: number
    name: string
    start_date: string
    end_date: string
    is_active: boolean
  }>
  categories: Array<{
    id: number
    name: string
    gender: string
    min_age: number | null
    max_age: number | null
  }>
  error: string | null
  recalculatingRankings: boolean
}

const initialState: AdminRankingsState = {
  playerRankings: [],
  rankingChanges: [],
  selectedPlayer: null,
  rankingFilter: {
    state: '',
    searchTerm: '',
    minPosition: '',
    maxPosition: '',
    changeType: '',
    dateFrom: '',
    dateTo: '',
    category: '',
    period: '',
    page: '1',
    limit: '50'
  },
  rankingStats: {
    totalRankedPlayers: 0,
    recentChanges: 0,
    averagePoints: 0,
    highestPoints: 0,
    mostActiveState: '',
    totalTournamentsConsidered: 0,
    activePeriod: null
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0
  },
  periods: [],
  categories: [],
  error: null,
  recalculatingRankings: false
}

const adminRankingsSlice = createSlice({
  name: 'adminRankings',
  initialState,
  reducers: {
    setRecalculatingRankings: (state, action: PayloadAction<boolean>) => {
      state.recalculatingRankings = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setPlayerRankings: (state, action: PayloadAction<PlayerRanking[]>) => {
      state.playerRankings = action.payload
    },
    setRankingChanges: (state, action: PayloadAction<RankingChange[]>) => {
      state.rankingChanges = action.payload
    },
    setSelectedPlayer: (state, action: PayloadAction<PlayerRanking | null>) => {
      state.selectedPlayer = action.payload
    },
    setRankingFilter: (state, action: PayloadAction<Partial<RankingFilter>>) => {
      state.rankingFilter = { ...state.rankingFilter, ...action.payload }
    },
    setRankingStats: (state, action: PayloadAction<typeof initialState.rankingStats>) => {
      state.rankingStats = action.payload
    },
    setPagination: (state, action: PayloadAction<typeof initialState.pagination>) => {
      state.pagination = action.payload
    },
    setPeriods: (state, action: PayloadAction<typeof initialState.periods>) => {
      state.periods = action.payload
    },
    setCategories: (state, action: PayloadAction<typeof initialState.categories>) => {
      state.categories = action.payload
    },
    updatePlayerRanking: (state, action: PayloadAction<{ playerId: number; newPosition: number; newPoints: number }>) => {
      const playerIndex = state.playerRankings.findIndex(p => p.player_id === action.payload.playerId)
      if (playerIndex !== -1) {
        const player = state.playerRankings[playerIndex]
        player.previous_position = player.current_position
        player.previous_points = player.current_points
        player.current_position = action.payload.newPosition
        player.current_points = action.payload.newPoints
        player.change = action.payload.newPosition - player.previous_position
        player.trend = player.change > 0 ? 'up' : player.change < 0 ? 'down' : 'stable'
        player.last_updated = new Date().toISOString()
      }
    },
    addRankingChange: (state, action: PayloadAction<RankingChange>) => {
      state.rankingChanges.unshift(action.payload)
    }
  }
})

export const {
  setRecalculatingRankings,
  setError,
  setPlayerRankings,
  setRankingChanges,
  setSelectedPlayer,
  setRankingFilter,
  setRankingStats,
  setPagination,
  setPeriods,
  setCategories,
  updatePlayerRanking,
  addRankingChange
} = adminRankingsSlice.actions

// API Functions
export const fetchPlayerRankings = (filters?: Partial<RankingFilter>) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading player rankings...'))
  
  try {
    dispatch(setError(null))

    const queryParams = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value)
      })
    }

    const response = await api.get(`/api/admin/rankings/players?${queryParams.toString()}`)
    const responseData = response.data as { 
      rankings: PlayerRanking[], 
      totalCount: number,
      currentPage: number,
      totalPages: number
    }

    dispatch(setPlayerRankings(responseData.rankings))
    dispatch(setPagination({
      currentPage: responseData.currentPage,
      totalPages: responseData.totalPages,
      totalCount: responseData.totalCount
    }))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(setError('Failed to fetch player rankings'))
    dispatch(stopLoading())
    throw error
  }
}

export const fetchRankingChanges = (filters?: Partial<RankingFilter>) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading ranking changes...'))
  
  try {
    dispatch(setError(null))

    const queryParams = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value)
      })
    }

    const response = await api.get(`/api/admin/rankings/changes?${queryParams.toString()}`)
    const responseData = response.data as { changes: RankingChange[] }

    dispatch(setRankingChanges(responseData.changes))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(setError('Failed to fetch ranking changes'))
    dispatch(stopLoading())
    throw error
  }
}

export const manualRankingAdjustment = (playerId: number, points?: number, newRank?: number, reason?: string) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Adjusting player ranking...'))
  
  try {
    dispatch(setError(null))

    const response = await api.post('/api/admin/rankings/adjust', {
      playerId,
      points,
      newRank,
      reason
    })

    if (newRank && points) {
      dispatch(updatePlayerRanking({ playerId, newPosition: newRank, newPoints: points }))
    }
    dispatch(stopLoading())
    
    return response.data
  } catch (error) {
    dispatch(setError('Failed to adjust player ranking'))
    dispatch(stopLoading())
    throw error
  }
}

export const recalculateRankings = () => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Recalculating rankings...'))
  
  try {
    dispatch(setError(null))

    const response = await api.post('/api/admin/rankings/recalculate')

    // Refresh rankings after recalculation
    dispatch(fetchPlayerRankings())
    dispatch(fetchRankingChanges())
    dispatch(stopLoading())
    
    return response.data
  } catch (error) {
    dispatch(setError('Failed to recalculate rankings'))
    dispatch(stopLoading())
    throw error
  }
}

export const freezeRankings = (freeze: boolean, reason?: string) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Updating ranking freeze status...'))
  
  try {
    dispatch(setError(null))

    const response = await api.post('/api/admin/rankings/freeze', {
      freeze,
      reason
    })

    dispatch(stopLoading())
    return response.data
  } catch (error) {
    dispatch(setError('Failed to update ranking freeze status'))
    dispatch(stopLoading())
    throw error
  }
}

export const exportRankings = (filters: Partial<RankingFilter>, format: 'csv' | 'excel' | 'pdf') => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Exporting rankings...'))
  
  try {
    dispatch(setError(null))

    const queryParams = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value)
    })
    queryParams.append('format', format)

    const response = await api.get(`/api/admin/rankings/export?${queryParams.toString()}`, {
      responseType: 'blob'
    })

    const url = window.URL.createObjectURL(new Blob([response.data as BlobPart]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `rankings-export-${new Date().toISOString().split('T')[0]}.${format}`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)

    dispatch(stopLoading())
    return response.data
  } catch (error) {
    dispatch(setError('Failed to export rankings'))
    dispatch(stopLoading())
    throw error
  }
}

export const fetchRankingStats = () => async (dispatch: AppDispatch) => {
  try {
    const response = await api.get('/api/admin/rankings/stats')
    const responseData = response.data as typeof initialState.rankingStats
    dispatch(setRankingStats(responseData))
  } catch (error) {
    dispatch(setError('Failed to fetch ranking statistics'))
    throw error
  }
}

export const fetchRankingPeriods = () => async (dispatch: AppDispatch) => {
  try {
    const response = await api.get('/api/admin/rankings/periods')
    const responseData = response.data as { periods: typeof initialState.periods }
    dispatch(setPeriods(responseData.periods))
  } catch (error) {
    dispatch(setError('Failed to fetch ranking periods'))
    throw error
  }
}

export const fetchRankingCategories = () => async (dispatch: AppDispatch) => {
  try {
    const response = await api.get('/api/admin/rankings/categories')
    const responseData = response.data as { categories: typeof initialState.categories }
    dispatch(setCategories(responseData.categories))
  } catch (error) {
    dispatch(setError('Failed to fetch ranking categories'))
    throw error
  }
}

export const getPlayerRankingHistory = (playerId: number) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading player ranking history...'))
  
  try {
    dispatch(setError(null))

    const response = await api.get(`/api/admin/rankings/player/${playerId}/history`)

    dispatch(stopLoading())
    return response.data
  } catch (error) {
    dispatch(setError('Failed to fetch player ranking history'))
    dispatch(stopLoading())
    throw error
  }
}

export default adminRankingsSlice.reducer