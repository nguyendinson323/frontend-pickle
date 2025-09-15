import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import api from '../../services/api'
import { startLoading, stopLoading } from './loadingSlice'
import { AppDispatch } from '../index'

interface Court {
  id: number
  name: string
  address: string
  court_count: number
  surface_type: string | null
  indoor: boolean
  lights: boolean
  description: string | null
  status: 'active' | 'maintenance' | 'inactive'
  amenities: string[]
  created_at: string
  updated_at: string
}

interface Tournament {
  id: number
  name: string
  description: string | null
  tournament_type: string | null
  start_date: string
  end_date: string
  registration_start: string
  registration_end: string
  max_participants: number | null
  entry_fee: number | null
  venue_name: string | null
  venue_address: string | null
  status: 'upcoming' | 'ongoing' | 'completed' | 'canceled'
  created_at: string
  updated_at: string
}

interface ManagementStats {
  total_courts: number
  active_courts: number
  maintenance_courts: number
  total_tournaments: number
  active_tournaments: number
  upcoming_tournaments: number
  total_revenue_this_month: number
  total_bookings_this_month: number
}

interface PartnerManagementState {
  courts: Court[]
  tournaments: Tournament[]
  stats: ManagementStats | null
  error: string | null
  courtFilter: {
    status: string
    searchTerm: string
  }
  tournamentFilter: {
    status: string
    searchTerm: string
  }
  selectedCourt: Court | null
  selectedTournament: Tournament | null
}

const initialState: PartnerManagementState = {
  courts: [],
  tournaments: [],
  stats: null,
  error: null,
  courtFilter: {
    status: '',
    searchTerm: ''
  },
  tournamentFilter: {
    status: '',
    searchTerm: ''
  },
  selectedCourt: null,
  selectedTournament: null
}

const partnerManagementSlice = createSlice({
  name: 'partnerManagement',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setCourts: (state, action: PayloadAction<Court[]>) => {
      state.courts = action.payload
    },
    setTournaments: (state, action: PayloadAction<Tournament[]>) => {
      state.tournaments = action.payload
    },
    setStats: (state, action: PayloadAction<ManagementStats>) => {
      state.stats = action.payload
    },
    setCourtFilter: (state, action: PayloadAction<Partial<typeof initialState.courtFilter>>) => {
      state.courtFilter = { ...state.courtFilter, ...action.payload }
    },
    setTournamentFilter: (state, action: PayloadAction<Partial<typeof initialState.tournamentFilter>>) => {
      state.tournamentFilter = { ...state.tournamentFilter, ...action.payload }
    },
    setSelectedCourt: (state, action: PayloadAction<Court | null>) => {
      state.selectedCourt = action.payload
    },
    setSelectedTournament: (state, action: PayloadAction<Tournament | null>) => {
      state.selectedTournament = action.payload
    },
    addCourt: (state, action: PayloadAction<Court>) => {
      state.courts.unshift(action.payload)
    },
    updateCourt: (state, action: PayloadAction<Court>) => {
      const index = state.courts.findIndex(court => court.id === action.payload.id)
      if (index !== -1) {
        state.courts[index] = action.payload
      }
    },
    removeCourt: (state, action: PayloadAction<number>) => {
      state.courts = state.courts.filter(court => court.id !== action.payload)
    },
    addTournament: (state, action: PayloadAction<Tournament>) => {
      state.tournaments.unshift(action.payload)
    },
    updateTournament: (state, action: PayloadAction<Tournament>) => {
      const index = state.tournaments.findIndex(tournament => tournament.id === action.payload.id)
      if (index !== -1) {
        state.tournaments[index] = action.payload
      }
    },
    removeTournament: (state, action: PayloadAction<number>) => {
      state.tournaments = state.tournaments.filter(tournament => tournament.id !== action.payload)
    }
  }
})

export const {
  setError,
  setCourts,
  setTournaments,
  setStats,
  setCourtFilter,
  setTournamentFilter,
  setSelectedCourt,
  setSelectedTournament,
  addCourt,
  updateCourt,
  removeCourt,
  addTournament,
  updateTournament,
  removeTournament
} = partnerManagementSlice.actions

// API Functions
export const fetchPartnerManagementData = () => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading management data...'))
  
  try {
    dispatch(setError(null))

    const response = await api.get('/api/partner/management')
    const responseData = response.data as { courts: Court[], tournaments: Tournament[], stats: ManagementStats }
    
    dispatch(setCourts(responseData.courts))
    dispatch(setTournaments(responseData.tournaments))
    dispatch(setStats(responseData.stats))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch management data'))
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

export const createCourt = (courtData: Partial<Court>) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Creating court...'))
  
  try {
    dispatch(setError(null))

    const response = await api.post('/api/partner/courts', courtData)
    
    dispatch(addCourt(response.data as Court))
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to create court'))
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

export const updatePartnerCourt = (courtId: number, courtData: Partial<Court>) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Updating court...'))
  
  try {
    dispatch(setError(null))

    const response = await api.put(`/api/partner/courts/${courtId}`, courtData)
    
    dispatch(updateCourt(response.data as Court))
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to update court'))
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

export const deletePartnerCourt = (courtId: number) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Deleting court...'))
  
  try {
    dispatch(setError(null))

    await api.delete(`/api/partner/courts/${courtId}`)
    
    dispatch(removeCourt(courtId))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to delete court'))
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

export const createTournament = (tournamentData: Partial<Tournament>) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Creating tournament...'))
  
  try {
    dispatch(setError(null))

    const response = await api.post('/api/partner/tournaments', tournamentData)
    
    dispatch(addTournament(response.data as Tournament))
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to create tournament'))
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

export const updatePartnerTournament = (tournamentId: number, tournamentData: Partial<Tournament>) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Updating tournament...'))
  
  try {
    dispatch(setError(null))

    const response = await api.put(`/api/partner/tournaments/${tournamentId}`, tournamentData)
    
    dispatch(updateTournament(response.data as Tournament))
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to update tournament'))
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

export const deletePartnerTournament = (tournamentId: number) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Deleting tournament...'))
  
  try {
    dispatch(setError(null))

    await api.delete(`/api/partner/tournaments/${tournamentId}`)
    
    dispatch(removeTournament(tournamentId))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to delete tournament'))
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

export const publishTournament = (tournamentId: number) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Publishing tournament...'))
  
  try {
    dispatch(setError(null))

    const response = await api.post(`/api/partner/tournaments/${tournamentId}/publish`)
    
    dispatch(updateTournament(response.data as Tournament))
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to publish tournament'))
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

export const cancelTournament = (tournamentId: number) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Canceling tournament...'))
  
  try {
    dispatch(setError(null))

    const response = await api.post(`/api/partner/tournaments/${tournamentId}/cancel`)
    
    dispatch(updateTournament(response.data as Tournament))
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to cancel tournament'))
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

export default partnerManagementSlice.reducer

export type {
  Court,
  Tournament,
  ManagementStats
}