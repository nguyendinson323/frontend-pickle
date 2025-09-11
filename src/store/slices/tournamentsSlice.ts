import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  TournamentsState,
  Tournament,
  TournamentRegistration,
  TournamentMatch,
  TournamentCategory,
  PaginatedResponse
} from '../../types'
import { AppDispatch } from '../index'
import { startLoading, stopLoading } from './loadingSlice'
import api from '../../services/api'

const initialState: TournamentsState = {
  tournaments: [],
  currentTournament: null,
  registrations: [],
  matches: [],
  categories: [],
  isLoading: false,
  totalCount: 0
}

const tournamentsSlice = createSlice({
  name: 'tournaments',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setTournaments: (state, action: PayloadAction<PaginatedResponse<Tournament>>) => {
      state.tournaments = action.payload.rows
      state.totalCount = action.payload.count
    },
    addTournament: (state, action: PayloadAction<Tournament>) => {
      state.tournaments.unshift(action.payload)
      state.totalCount += 1
    },
    updateTournament: (state, action: PayloadAction<Tournament>) => {
      const index = state.tournaments.findIndex(t => t.id === action.payload.id)
      if (index !== -1) {
        state.tournaments[index] = action.payload
      }
      if (state.currentTournament && state.currentTournament.id === action.payload.id) {
        state.currentTournament = action.payload
      }
    },
    setCurrentTournament: (state, action: PayloadAction<{
      tournament: Tournament
      totalRegistrations: number
    }>) => {
      state.currentTournament = {
        ...action.payload.tournament,
        totalRegistrations: action.payload.totalRegistrations
      }
    },
    clearCurrentTournament: (state) => {
      state.currentTournament = null
      state.registrations = []
      state.matches = []
      state.categories = []
    },
    setTournamentRegistrations: (state, action: PayloadAction<TournamentRegistration[]>) => {
      state.registrations = action.payload
    },
    addTournamentRegistration: (state, action: PayloadAction<TournamentRegistration>) => {
      state.registrations.push(action.payload)
    },
    removeTournamentRegistration: (state, action: PayloadAction<number>) => {
      state.registrations = state.registrations.filter(r => r.id !== action.payload)
    },
    updateTournamentRegistration: (state, action: PayloadAction<TournamentRegistration>) => {
      const index = state.registrations.findIndex(r => r.id === action.payload.id)
      if (index !== -1) {
        state.registrations[index] = action.payload
      }
    },
    setTournamentMatches: (state, action: PayloadAction<TournamentMatch[]>) => {
      state.matches = action.payload
    },
    addTournamentMatch: (state, action: PayloadAction<TournamentMatch>) => {
      state.matches.push(action.payload)
    },
    updateTournamentMatch: (state, action: PayloadAction<TournamentMatch>) => {
      const index = state.matches.findIndex(m => m.id === action.payload.id)
      if (index !== -1) {
        state.matches[index] = action.payload
      }
    },
    setTournamentCategories: (state, action: PayloadAction<TournamentCategory[]>) => {
      state.categories = action.payload
    },
    addTournamentCategory: (state, action: PayloadAction<TournamentCategory>) => {
      state.categories.push(action.payload)
    },
    clearTournaments: (state) => {
      state.tournaments = []
      state.totalCount = 0
    }
  }
})

export const {
  setLoading,
  setTournaments,
  addTournament,
  updateTournament,
  setCurrentTournament,
  clearCurrentTournament,
  setTournamentRegistrations,
  addTournamentRegistration,
  removeTournamentRegistration,
  updateTournamentRegistration,
  setTournamentMatches,
  addTournamentMatch,
  updateTournamentMatch,
  setTournamentCategories,
  addTournamentCategory,
  clearTournaments
} = tournamentsSlice.actions

// Async thunks for API integration

export const fetchTournaments = (filters?: {
  status?: string
  tournament_type?: string
  state_id?: number
  organizer_type?: string
  search?: string
  page?: number
  limit?: number
}) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading tournaments...'))
  
  try {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString())
        }
      })
    }
    
    const url = `/api/tournaments${params.toString() ? `?${params.toString()}` : ''}`
    const response = await api.get(url)
    dispatch(setTournaments(response.data as PaginatedResponse<Tournament>))
  } catch (error) {
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

export const fetchTournamentDetails = (tournamentId: number) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading tournament details...'))
  
  try {
    const [tournamentResponse, registrationsResponse, matchesResponse] = await Promise.all([
      api.get(`/api/tournaments/${tournamentId}`),
      api.get(`/api/tournaments/${tournamentId}/registrations`),
      api.get(`/api/tournaments/${tournamentId}/matches`)
    ])
    
    const tournamentData = tournamentResponse.data as Tournament & { totalRegistrations: number }
    const registrations = registrationsResponse.data as TournamentRegistration[]
    const matches = matchesResponse.data as TournamentMatch[]
    
    dispatch(setCurrentTournament({
      tournament: tournamentData,
      totalRegistrations: tournamentData.totalRegistrations
    }))
    dispatch(setTournamentRegistrations(registrations))
    dispatch(setTournamentMatches(matches))
  } catch (error) {
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

export const generateTournamentBrackets = (tournamentId: number, categoryId: number) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Generating brackets...'))
  
  try {
    const response = await api.post(`/api/tournaments/${tournamentId}/categories/${categoryId}/generate-brackets`)
    
    dispatch(setTournamentMatches(response.data as TournamentMatch[]))
    return response.data
  } catch (error) {
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

export const registerForTournament = (tournamentId: number, categoryId: number, partnerPlayerId?: number) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Registering for tournament...'))
  
  try {
    const response = await api.post(`/api/tournaments/${tournamentId}/register`, {
      categoryId,
      partnerPlayerId
    })
    
    dispatch(addTournamentRegistration(response.data as TournamentRegistration))
    return response.data
  } catch (error) {
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

export const updateMatchResult = (matchId: number, updates: {
  score: string
  winner_side: 1 | 2
  status: 'completed'
}) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Updating match result...'))
  
  try {
    const response = await api.put(`/api/tournaments/matches/${matchId}`, updates)
    dispatch(updateTournamentMatch(response.data as TournamentMatch))
    return response.data
  } catch (error) {
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

export const createTournamentCategory = (tournamentId: number, categoryData: {
  name: string
  min_age?: number
  max_age?: number
  gender?: 'Male' | 'Female' | 'Mixed'
  min_skill_level?: number
  max_skill_level?: number
  format?: string
  max_participants?: number
}) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Creating tournament category...'))
  
  try {
    const response = await api.post(`/api/tournaments/${tournamentId}/categories`, categoryData)
    dispatch(addTournamentCategory(response.data as TournamentCategory))
    return response.data
  } catch (error) {
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

export default tournamentsSlice.reducer