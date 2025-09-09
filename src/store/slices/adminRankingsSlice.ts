import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { RankingChange } from '../../types/admin'

interface PlayerRanking {
  id: number
  player_id: number
  player_name: string
  current_position: number
  previous_position: number
  current_points: number
  previous_points: number
  change: number
  state_id: number
  state_name: string
  tournaments_played: number
  last_updated: string
  trend: 'up' | 'down' | 'stable'
}

interface RankingFilter {
  state: string
  searchTerm: string
  minPosition: string
  maxPosition: string
  changeType: string
  dateFrom: string
  dateTo: string
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
  }
  loading: boolean
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
    dateTo: ''
  },
  rankingStats: {
    totalRankedPlayers: 0,
    recentChanges: 0,
    averagePoints: 0,
    highestPoints: 0,
    mostActiveState: '',
    totalTournamentsConsidered: 0
  },
  loading: false,
  error: null,
  recalculatingRankings: false
}

const adminRankingsSlice = createSlice({
  name: 'adminRankings',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
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
  setLoading,
  setRecalculatingRankings,
  setError,
  setPlayerRankings,
  setRankingChanges,
  setSelectedPlayer,
  setRankingFilter,
  setRankingStats,
  updatePlayerRanking,
  addRankingChange
} = adminRankingsSlice.actions

// API Functions
export const fetchPlayerRankings = (filters?: Partial<RankingFilter>) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))

    const queryParams = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value)
      })
    }

    const response = await axios.get(`/api/admin/rankings/players?${queryParams.toString()}`)

    dispatch(setPlayerRankings(response.data.rankings))
    dispatch(setRankingStats(response.data.stats))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch player rankings'))
  } finally {
    dispatch(setLoading(false))
  }
}

export const fetchRankingChanges = (filters?: Partial<RankingFilter>) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))

    const queryParams = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value)
      })
    }

    const response = await axios.get(`/api/admin/rankings/changes?${queryParams.toString()}`)

    dispatch(setRankingChanges(response.data))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch ranking changes'))
  } finally {
    dispatch(setLoading(false))
  }
}

export const manualRankingAdjustment = (playerId: number, newPosition: number, newPoints: number, reason: string) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const response = await axios.post('/api/admin/rankings/adjust', {
      playerId,
      newPosition,
      newPoints,
      reason
    })

    dispatch(updatePlayerRanking({ playerId, newPosition, newPoints }))
    dispatch(addRankingChange(response.data.change))
    
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to adjust player ranking'))
    throw error
  }
}

export const recalculateRankings = (stateId?: number) => async (dispatch: any) => {
  try {
    dispatch(setRecalculatingRankings(true))
    dispatch(setError(null))

    const payload = stateId ? { stateId } : {}
    const response = await axios.post('/api/admin/rankings/recalculate', payload)

    // Refresh rankings after recalculation
    dispatch(fetchPlayerRankings())
    dispatch(fetchRankingChanges())
    
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to recalculate rankings'))
    throw error
  } finally {
    dispatch(setRecalculatingRankings(false))
  }
}

export const freezeRankings = (freeze: boolean, reason?: string) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const response = await axios.post('/api/admin/rankings/freeze', {
      freeze,
      reason
    })

    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to update ranking freeze status'))
    throw error
  }
}

export const exportRankings = (filters: Partial<RankingFilter>, format: 'csv' | 'excel' | 'pdf') => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const queryParams = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value)
    })
    queryParams.append('format', format)

    const response = await axios.get(`/api/admin/rankings/export?${queryParams.toString()}`, {
      responseType: 'blob'
    })

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `rankings-export-${new Date().toISOString().split('T')[0]}.${format}`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)

    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to export rankings'))
    throw error
  }
}

export const getPlayerRankingHistory = (playerId: number) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const response = await axios.get(`/api/admin/rankings/player/${playerId}/history`)

    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch player ranking history'))
    throw error
  }
}

export default adminRankingsSlice.reducer