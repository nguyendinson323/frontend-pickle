import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

interface Court {
  id: number
  name: string
  address: string
  city: string
  state: string
  zip_code: string
  court_count: number
  surface_type: 'hard' | 'clay' | 'grass' | 'indoor' | 'outdoor'
  indoor: boolean
  lights: boolean
  description: string | null
  hourly_rate: number
  status: 'active' | 'maintenance' | 'inactive'
  amenities: string[]
  operating_hours: {
    day: string
    open_time: string
    close_time: string
    is_closed: boolean
  }[]
  images: string[]
  created_at: string
  updated_at: string
}

interface Tournament {
  id: number
  name: string
  description: string | null
  tournament_type: 'singles' | 'doubles' | 'mixed' | 'junior' | 'senior'
  skill_level: 'beginner' | 'intermediate' | 'advanced' | 'open'
  start_date: string
  end_date: string
  registration_start: string
  registration_end: string
  max_participants: number | null
  current_participants: number
  entry_fee: number | null
  prize_pool: number | null
  venue_name: string | null
  venue_address: string | null
  status: 'draft' | 'published' | 'registration_open' | 'registration_closed' | 'ongoing' | 'completed' | 'cancelled'
  rules: string | null
  contact_info: string | null
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
  loading: boolean
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
  loading: false,
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
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
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
  setLoading,
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
export const fetchPartnerManagementData = () => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))

    const response = await axios.get('/api/partner/management')
    
    dispatch(setCourts(response.data.courts))
    dispatch(setTournaments(response.data.tournaments))
    dispatch(setStats(response.data.stats))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch management data'))
  } finally {
    dispatch(setLoading(false))
  }
}

export const createCourt = (courtData: Partial<Court>) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const response = await axios.post('/api/partner/courts', courtData)
    
    dispatch(addCourt(response.data))
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to create court'))
    throw error
  }
}

export const updatePartnerCourt = (courtId: number, courtData: Partial<Court>) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const response = await axios.put(`/api/partner/courts/${courtId}`, courtData)
    
    dispatch(updateCourt(response.data))
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to update court'))
    throw error
  }
}

export const deletePartnerCourt = (courtId: number) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    await axios.delete(`/api/partner/courts/${courtId}`)
    
    dispatch(removeCourt(courtId))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to delete court'))
    throw error
  }
}

export const createTournament = (tournamentData: Partial<Tournament>) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const response = await axios.post('/api/partner/tournaments', tournamentData)
    
    dispatch(addTournament(response.data))
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to create tournament'))
    throw error
  }
}

export const updatePartnerTournament = (tournamentId: number, tournamentData: Partial<Tournament>) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const response = await axios.put(`/api/partner/tournaments/${tournamentId}`, tournamentData)
    
    dispatch(updateTournament(response.data))
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to update tournament'))
    throw error
  }
}

export const deletePartnerTournament = (tournamentId: number) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    await axios.delete(`/api/partner/tournaments/${tournamentId}`)
    
    dispatch(removeTournament(tournamentId))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to delete tournament'))
    throw error
  }
}

export const publishTournament = (tournamentId: number) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const response = await axios.post(`/api/partner/tournaments/${tournamentId}/publish`)
    
    dispatch(updateTournament(response.data))
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to publish tournament'))
    throw error
  }
}

export const cancelTournament = (tournamentId: number) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const response = await axios.post(`/api/partner/tournaments/${tournamentId}/cancel`)
    
    dispatch(updateTournament(response.data))
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to cancel tournament'))
    throw error
  }
}

export default partnerManagementSlice.reducer

export type {
  Court,
  Tournament,
  ManagementStats
}