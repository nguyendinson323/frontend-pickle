import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import api from '../../services/api'
import { startLoading, stopLoading } from './loadingSlice'
import { AppDispatch } from '../index'

interface StateTournament {
  id: number
  name: string
  description: string | null
  tournament_type: string | null
  organizer_type: 'federation' | 'state' | 'club' | 'partner'
  organizer_id: number
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
  categories?: Array<{
    id: number
    name: string
    gender: 'Male' | 'Female' | 'Mixed'
    format: string
    registration_count?: number
  }>
  registration_count?: number
  revenue?: number
}

interface StateCourt {
  id: number
  name: string
  owner_type: 'club' | 'partner'
  owner_id: number
  address: string | null
  court_count: number
  surface_type: string | null
  indoor: boolean
  lights: boolean
  amenities: string | null
  description: string | null
  latitude: number | null
  longitude: number | null
  status: 'active' | 'maintenance' | 'inactive'
  created_at: string
  updated_at: string
  owner: {
    id: number
    name: string
    type: string
    contact_email?: string
    phone?: string
  }
  schedules?: Array<{
    id: number
    day_of_week: number
    open_time: string
    close_time: string
    is_closed: boolean
  }>
  reservations_count?: number
}

interface StateClub {
  id: number
  name: string
  manager_name: string | null
  manager_title: string | null
  club_type: string | null
  website: string | null
  social_media: string | null
  logo_url: string | null
  has_courts: boolean
  premium_expires_at: string | null
  affiliation_expires_at: string | null
  created_at: string
  updated_at: string
  user: {
    id: number
    email: string
    phone: string | null
  }
  members_count?: number
  courts_count?: number
  tournaments_count?: number
}

interface StatePartner {
  id: number
  business_name: string
  rfc: string | null
  contact_name: string | null
  contact_title: string | null
  partner_type: string | null
  website: string | null
  social_media: string | null
  logo_url: string | null
  has_courts: boolean
  premium_expires_at: string | null
  created_at: string
  updated_at: string
  user: {
    id: number
    email: string
    phone: string | null
  }
  courts_count?: number
  tournaments_count?: number
}

interface ManagementStats {
  total_tournaments: number
  active_tournaments: number
  total_courts: number
  active_courts: number
  total_clubs: number
  active_clubs: number
  total_partners: number
  active_partners: number
  court_utilization_rate: number
  tournament_revenue: number
}

interface StateManagementState {
  tournaments: StateTournament[]
  courts: StateCourt[]
  clubs: StateClub[]
  partners: StatePartner[]
  stats: ManagementStats | null
  selectedTournament: StateTournament | null
  selectedCourt: StateCourt | null
  selectedClub: StateClub | null
  loading: boolean
  error: string | null
}

const initialState: StateManagementState = {
  tournaments: [],
  courts: [],
  clubs: [],
  partners: [],
  stats: null,
  selectedTournament: null,
  selectedCourt: null,
  selectedClub: null,
  loading: false,
  error: null
}

const stateManagementSlice = createSlice({
  name: 'stateManagement',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setManagementData: (state, action: PayloadAction<{
      tournaments: StateTournament[]
      courts: StateCourt[]
      clubs: StateClub[]
      partners: StatePartner[]
      stats: ManagementStats
    }>) => {
      state.tournaments = action.payload.tournaments
      state.courts = action.payload.courts
      state.clubs = action.payload.clubs
      state.partners = action.payload.partners
      state.stats = action.payload.stats
    },
    setSelectedTournament: (state, action: PayloadAction<StateTournament | null>) => {
      state.selectedTournament = action.payload
    },
    setSelectedCourt: (state, action: PayloadAction<StateCourt | null>) => {
      state.selectedCourt = action.payload
    },
    setSelectedClub: (state, action: PayloadAction<StateClub | null>) => {
      state.selectedClub = action.payload
    },
    addTournament: (state, action: PayloadAction<StateTournament>) => {
      state.tournaments.unshift(action.payload)
    },
    updateTournament: (state, action: PayloadAction<StateTournament>) => {
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
    },
    updateCourtStatus: (state, action: PayloadAction<{ id: number; status: string }>) => {
      const index = state.courts.findIndex(court => court.id === action.payload.id)
      if (index !== -1) {
        state.courts[index].status = action.payload.status as 'active' | 'maintenance' | 'inactive'
      }
    }
  }
})

export const {
  setLoading,
  setError,
  setManagementData,
  setSelectedTournament,
  setSelectedCourt,
  setSelectedClub,
  addTournament,
  updateTournament,
  deleteTournament,
  updateTournamentStatus,
  updateCourtStatus
} = stateManagementSlice.actions

// API Functions
export const fetchStateManagementData = () => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading management data...'))
  
  try {
    dispatch(setError(null))
    
    const response = await api.get('/api/state/management')
    dispatch(setManagementData(response.data as {
      tournaments: StateTournament[]
      courts: StateCourt[]
      clubs: StateClub[]
      partners: StatePartner[]
      stats: ManagementStats
    }))
    dispatch(stopLoading())
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch management data'))
    dispatch(stopLoading())
    throw error
  }
}

export const createStateTournament = (tournamentData: {
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
}) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Creating tournament...'))
  
  try {
    dispatch(setError(null))
    
    const response = await api.post('/api/state/tournaments', tournamentData)
    dispatch(addTournament((response.data as { tournament: StateTournament }).tournament))
    
    dispatch(stopLoading())
    return response.data as { tournament: StateTournament }
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to create tournament'))
    dispatch(stopLoading())
    throw error
  }
}

export const updateStateTournament = (tournamentId: number, tournamentData: Partial<StateTournament>) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Updating tournament...'))
  
  try {
    dispatch(setError(null))
    
    const response = await api.put(`/api/state/tournaments/${tournamentId}`, tournamentData)
    dispatch(updateTournament((response.data as { tournament: StateTournament }).tournament))
    
    dispatch(stopLoading())
    return response.data as { tournament: StateTournament }
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to update tournament'))
    dispatch(stopLoading())
    throw error
  }
}

export const deleteStateTournament = (tournamentId: number) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Deleting tournament...'))
  
  try {
    dispatch(setError(null))
    
    await api.delete(`/api/state/tournaments/${tournamentId}`)
    dispatch(deleteTournament(tournamentId))
    dispatch(stopLoading())
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to delete tournament'))
    dispatch(stopLoading())
    throw error
  }
}

export const updateStateTournamentStatus = (tournamentId: number, status: string) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Updating tournament status...'))
  
  try {
    dispatch(setError(null))
    
    await api.put(`/api/state/tournaments/${tournamentId}/status`, { status })
    dispatch(updateTournamentStatus({ id: tournamentId, status }))
    dispatch(stopLoading())
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to update tournament status'))
    dispatch(stopLoading())
    throw error
  }
}

export const updateStateCourtStatus = (courtId: number, status: string, reason?: string) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Updating court status...'))
  
  try {
    dispatch(setError(null))
    
    await api.put(`/api/state/courts/${courtId}/status`, { status, reason })
    dispatch(updateCourtStatus({ id: courtId, status }))
    dispatch(stopLoading())
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to update court status'))
    dispatch(stopLoading())
    throw error
  }
}

export default stateManagementSlice.reducer

// Export types
export type {
  StateTournament,
  StateCourt,
  StateClub,
  StatePartner,
  ManagementStats
}