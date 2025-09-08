import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  TournamentsState,
  Tournament,
  TournamentRegistration,
  TournamentMatch,
  TournamentCategory,
  PaginatedResponse
} from '../../types'

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

export default tournamentsSlice.reducer