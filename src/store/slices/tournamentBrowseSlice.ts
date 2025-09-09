import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '../index'
import { startLoading, stopLoading } from './loadingSlice'
import api from '../../services/api'

export interface TournamentCategory {
  id: number
  tournament_id: number
  name: string
  min_age: number | null
  max_age: number | null
  gender: 'Male' | 'Female' | 'Mixed' | null
  min_skill_level: number | null
  max_skill_level: number | null
  format: string | null
  max_participants: number | null
  created_at: string
  participantsCount?: number
  availableSpots?: number
}

export interface Tournament {
  id: number
  name: string
  description: string | null
  tournament_type: string | null
  organizer_type: 'federation' | 'state' | 'club' | 'partner' | null
  organizer_id: number
  state_id: number
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
  state: {
    id: number
    name: string
    short_code: string
  } | null
  organizer?: {
    id: number
    name: string
    type: string
  } | null
  categories: TournamentCategory[]
  totalParticipants?: number
  availableSpots?: number
  isRegistered?: boolean
  userRegistrations?: TournamentRegistration[]
}

export interface TournamentRegistration {
  id: number
  tournament_id: number
  category_id: number
  player_id: number
  partner_player_id: number | null
  registration_date: string
  payment_status: 'pending' | 'paid' | 'refunded'
  amount_paid: number | null
  stripe_payment_id: string | null
  status: 'registered' | 'confirmed' | 'waitlisted' | 'withdrawn'
  created_at: string
  updated_at: string
  tournament?: Tournament
  category?: TournamentCategory
  partner?: {
    id: number
    full_name: string
    nrtp_level: number
  } | null
}

export interface TournamentFilters {
  state_id: number | null
  status: string | null
  tournament_type: string | null
  organizer_type: string | null
  start_date_from: string | null
  start_date_to: string | null
  entry_fee_max: number | null
  is_ranking: boolean | null
  has_available_spots: boolean | null
}

export interface TournamentBrowseState {
  tournaments: Tournament[]
  selectedTournament: Tournament | null
  userRegistrations: TournamentRegistration[]
  filters: TournamentFilters
  isLoading: boolean
  error: string | null
  searchPerformed: boolean
  registrationModal: {
    isOpen: boolean
    tournamentId: number | null
    selectedCategory: TournamentCategory | null
    partnerRequired: boolean
    selectedPartner: number | null
  }
}

const initialState: TournamentBrowseState = {
  tournaments: [],
  selectedTournament: null,
  userRegistrations: [],
  filters: {
    state_id: null,
    status: 'upcoming',
    tournament_type: null,
    organizer_type: null,
    start_date_from: null,
    start_date_to: null,
    entry_fee_max: null,
    is_ranking: null,
    has_available_spots: null
  },
  isLoading: false,
  error: null,
  searchPerformed: false,
  registrationModal: {
    isOpen: false,
    tournamentId: null,
    selectedCategory: null,
    partnerRequired: false,
    selectedPartner: null
  }
}

const tournamentBrowseSlice = createSlice({
  name: 'tournamentBrowse',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setTournaments: (state, action: PayloadAction<Tournament[]>) => {
      state.tournaments = action.payload
      state.searchPerformed = true
    },
    setSelectedTournament: (state, action: PayloadAction<Tournament | null>) => {
      state.selectedTournament = action.payload
    },
    setUserRegistrations: (state, action: PayloadAction<TournamentRegistration[]>) => {
      state.userRegistrations = action.payload
    },
    setFilters: (state, action: PayloadAction<Partial<TournamentFilters>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    openRegistrationModal: (state, action: PayloadAction<{
      tournamentId: number
      category: TournamentCategory
      partnerRequired: boolean
    }>) => {
      state.registrationModal = {
        isOpen: true,
        tournamentId: action.payload.tournamentId,
        selectedCategory: action.payload.category,
        partnerRequired: action.payload.partnerRequired,
        selectedPartner: null
      }
    },
    closeRegistrationModal: (state) => {
      state.registrationModal = {
        isOpen: false,
        tournamentId: null,
        selectedCategory: null,
        partnerRequired: false,
        selectedPartner: null
      }
    },
    setSelectedPartner: (state, action: PayloadAction<number | null>) => {
      state.registrationModal.selectedPartner = action.payload
    },
    addTournamentRegistration: (state, action: PayloadAction<TournamentRegistration>) => {
      state.userRegistrations.unshift(action.payload)
      
      // Update tournament registration status
      const tournament = state.tournaments.find(t => t.id === action.payload.tournament_id)
      if (tournament) {
        tournament.isRegistered = true
        if (!tournament.userRegistrations) tournament.userRegistrations = []
        tournament.userRegistrations.push(action.payload)
      }
    },
    updateTournamentRegistration: (state, action: PayloadAction<TournamentRegistration>) => {
      const index = state.userRegistrations.findIndex(reg => reg.id === action.payload.id)
      if (index !== -1) {
        state.userRegistrations[index] = action.payload
      }
      
      // Update tournament registration
      const tournament = state.tournaments.find(t => t.id === action.payload.tournament_id)
      if (tournament && tournament.userRegistrations) {
        const regIndex = tournament.userRegistrations.findIndex(reg => reg.id === action.payload.id)
        if (regIndex !== -1) {
          tournament.userRegistrations[regIndex] = action.payload
        }
      }
    },
    clearTournamentBrowse: (state) => {
      state.tournaments = []
      state.selectedTournament = null
      state.userRegistrations = []
      state.error = null
      state.searchPerformed = false
      state.registrationModal = {
        isOpen: false,
        tournamentId: null,
        selectedCategory: null,
        partnerRequired: false,
        selectedPartner: null
      }
    }
  }
})

export const {
  setLoading,
  setError,
  setTournaments,
  setSelectedTournament,
  setUserRegistrations,
  setFilters,
  openRegistrationModal,
  closeRegistrationModal,
  setSelectedPartner,
  addTournamentRegistration,
  updateTournamentRegistration,
  clearTournamentBrowse
} = tournamentBrowseSlice.actions

// Search tournaments based on filters
export const searchTournaments = (filters: Partial<TournamentFilters>) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Searching tournaments...'))
  
  try {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params.append(key, String(value))
      }
    })
    const response = await api.get(`/api/tournament-browse?${params.toString()}`)
    dispatch(setTournaments(response.data as Tournament[]))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(setError('Failed to search tournaments'))
    dispatch(stopLoading())
    throw error
  }
}

// Get tournament details by ID
export const getTournamentDetails = (tournamentId: number) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading tournament details...'))
  
  try {
    const response = await api.get(`/api/tournament-browse/${tournamentId}`)
    dispatch(setSelectedTournament(response.data as Tournament))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(setError('Failed to load tournament details'))
    dispatch(stopLoading())
    throw error
  }
}

// Get user's tournament registrations
export const fetchUserRegistrations = () => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading your registrations...'))
  
  try {
    const response = await api.get<TournamentRegistration[]>('/api/tournament-browse/registrations')
    dispatch(setUserRegistrations(response.data))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(setError('Failed to load registrations'))
    dispatch(stopLoading())
    throw error
  }
}

// Register for a tournament
export const registerForTournament = (registrationData: {
  tournament_id: number
  category_id: number
  partner_player_id?: number
}) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Registering for tournament...'))
  
  try {
    const response = await api.post(`/api/tournament-browse/${registrationData.tournament_id}/register`, {
      categoryId: registrationData.category_id,
      partnerPlayerId: registrationData.partner_player_id
    })
    dispatch(addTournamentRegistration(response.data as TournamentRegistration))
    dispatch(closeRegistrationModal())
    dispatch(stopLoading())
    return response.data
  } catch (error) {
    dispatch(setError('Failed to register for tournament'))
    dispatch(stopLoading())
    throw error
  }
}

// Withdraw from tournament
export const withdrawFromTournament = (registrationId: number) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Withdrawing from tournament...'))
  
  try {
    const response = await api.put(`/api/tournament-browse/registrations/${registrationId}/withdraw`)
    dispatch(updateTournamentRegistration(response.data as TournamentRegistration))
    dispatch(stopLoading())
    return response.data
  } catch (error) {
    dispatch(setError('Failed to withdraw from tournament'))
    dispatch(stopLoading())
    throw error
  }
}

export default tournamentBrowseSlice.reducer