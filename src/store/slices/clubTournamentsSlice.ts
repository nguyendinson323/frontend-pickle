import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

interface TournamentCategory {
  id: number
  name: string
  min_age: number | null
  max_age: number | null
  gender: 'Male' | 'Female' | 'Mixed'
  min_skill_level: number | null
  max_skill_level: number | null
  format: string
  max_participants: number | null
  registration_count?: number
}

interface TournamentRegistration {
  id: number
  player: {
    id: number
    full_name: string
    profile_photo_url: string | null
    nrtp_level: number
  }
  partner_player: {
    id: number
    full_name: string
    profile_photo_url: string | null
    nrtp_level: number
  } | null
  category: {
    id: number
    name: string
  }
  registration_date: string
  payment_status: 'pending' | 'paid' | 'refunded'
  amount_paid: number
  status: 'registered' | 'confirmed' | 'waitlisted' | 'withdrawn'
}

interface TournamentMatch {
  id: number
  round: number
  match_number: number
  court_id: number | null
  match_date: string | null
  match_time: string | null
  player1: {
    id: number
    full_name: string
  }
  player2: {
    id: number
    full_name: string
  } | null
  player3: {
    id: number
    full_name: string
  }
  player4: {
    id: number
    full_name: string
  } | null
  score: string | null
  winner_side: number | null
  status: 'scheduled' | 'in_progress' | 'completed' | 'walkover' | 'canceled'
  category: {
    id: number
    name: string
  }
}

interface ClubTournament {
  id: number
  name: string
  description: string | null
  tournament_type: string | null
  venue_name: string | null
  venue_address: string | null
  start_date: string
  end_date: string
  registration_start: string
  registration_end: string
  entry_fee: number | null
  max_participants: number | null
  status: 'upcoming' | 'ongoing' | 'completed' | 'canceled'
  banner_url: string | null
  is_ranking: boolean
  ranking_multiplier: number
  created_at: string
  updated_at: string
  categories?: TournamentCategory[]
  registrations?: TournamentRegistration[]
  registration_count?: number
  revenue?: number
}

interface TournamentStats {
  total_tournaments: number
  active_tournaments: number
  completed_tournaments: number
  total_participants: number
  total_revenue: number
  upcoming_tournaments: number
}

interface ClubTournamentsState {
  tournaments: ClubTournament[]
  stats: TournamentStats | null
  selectedTournament: ClubTournament | null
  selectedTournamentRegistrations: TournamentRegistration[]
  selectedTournamentMatches: TournamentMatch[]
  loading: boolean
  error: string | null
}

const initialState: ClubTournamentsState = {
  tournaments: [],
  stats: null,
  selectedTournament: null,
  selectedTournamentRegistrations: [],
  selectedTournamentMatches: [],
  loading: false,
  error: null
}

const clubTournamentsSlice = createSlice({
  name: 'clubTournaments',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setTournamentsData: (state, action: PayloadAction<{
      tournaments: ClubTournament[]
      stats: TournamentStats
    }>) => {
      state.tournaments = action.payload.tournaments
      state.stats = action.payload.stats
    },
    setSelectedTournament: (state, action: PayloadAction<ClubTournament | null>) => {
      state.selectedTournament = action.payload
    },
    setTournamentRegistrations: (state, action: PayloadAction<TournamentRegistration[]>) => {
      state.selectedTournamentRegistrations = action.payload
    },
    setTournamentMatches: (state, action: PayloadAction<TournamentMatch[]>) => {
      state.selectedTournamentMatches = action.payload
    },
    addTournament: (state, action: PayloadAction<ClubTournament>) => {
      state.tournaments.unshift(action.payload)
    },
    updateTournament: (state, action: PayloadAction<ClubTournament>) => {
      const index = state.tournaments.findIndex(tournament => tournament.id === action.payload.id)
      if (index !== -1) {
        state.tournaments[index] = action.payload
      }
    },
    deleteTournament: (state, action: PayloadAction<number>) => {
      state.tournaments = state.tournaments.filter(tournament => tournament.id !== action.payload)
    },
    updateTournamentStatus: (state, action: PayloadAction<{ id: number; status: string }>) => {
      const index = state.tournaments.findIndex(tournament => tournament.id === action.payload.id)
      if (index !== -1) {
        state.tournaments[index].status = action.payload.status as 'upcoming' | 'ongoing' | 'completed' | 'canceled'
      }
    }
  }
})

export const {
  setLoading,
  setError,
  setTournamentsData,
  setSelectedTournament,
  setTournamentRegistrations,
  setTournamentMatches,
  addTournament,
  updateTournament,
  deleteTournament,
  updateTournamentStatus
} = clubTournamentsSlice.actions

// API Functions
export const fetchClubTournamentsData = () => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    const response = await axios.get('/api/club/tournaments')
    dispatch(setTournamentsData(response.data))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch tournaments data'))
  } finally {
    dispatch(setLoading(false))
  }
}

export const createTournament = (tournamentData: {
  name: string
  description?: string
  tournament_type?: string
  venue_name?: string
  venue_address?: string
  start_date: string
  end_date: string
  registration_start: string
  registration_end: string
  entry_fee?: number
  max_participants?: number
  is_ranking?: boolean
  ranking_multiplier?: number
  categories: Array<{
    name: string
    min_age?: number
    max_age?: number
    gender: 'Male' | 'Female' | 'Mixed'
    min_skill_level?: number
    max_skill_level?: number
    format: string
    max_participants?: number
  }>
}) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    const response = await axios.post('/api/club/tournaments', tournamentData)
    dispatch(addTournament(response.data.tournament))
    
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to create tournament'))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export const updateTournamentInfo = (tournamentId: number, tournamentData: Partial<ClubTournament>) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    const response = await axios.put(`/api/club/tournaments/${tournamentId}`, tournamentData)
    dispatch(updateTournament(response.data.tournament))
    
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to update tournament'))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export const deleteTournamentInfo = (tournamentId: number) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    await axios.delete(`/api/club/tournaments/${tournamentId}`)
    dispatch(deleteTournament(tournamentId))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to delete tournament'))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export const updateTournamentStatusInfo = (tournamentId: number, status: string) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    await axios.put(`/api/club/tournaments/${tournamentId}/status`, { status })
    dispatch(updateTournamentStatus({ id: tournamentId, status }))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to update tournament status'))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export const fetchTournamentRegistrations = (tournamentId: number) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    const response = await axios.get(`/api/club/tournaments/${tournamentId}/registrations`)
    dispatch(setTournamentRegistrations(response.data.registrations))
    
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch registrations'))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export const generateTournamentMatches = (tournamentId: number) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    const response = await axios.post(`/api/club/tournaments/${tournamentId}/matches/generate`)
    dispatch(setTournamentMatches(response.data.matches))
    
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to generate matches'))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export const fetchTournamentMatches = (tournamentId: number) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    const response = await axios.get(`/api/club/tournaments/${tournamentId}/matches`)
    dispatch(setTournamentMatches(response.data.matches))
    
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch matches'))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export const updateMatchResult = (matchId: number, matchData: {
  score: string
  winner_side: number
  status: string
}) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    await axios.put(`/api/club/tournaments/matches/${matchId}`, matchData)
    
    return { success: true }
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to update match result'))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export default clubTournamentsSlice.reducer