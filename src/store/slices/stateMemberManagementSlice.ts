import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import api from '../../services/api'
import { startLoading, stopLoading } from './loadingSlice'
import { AppDispatch, RootState } from '../index'

interface StatePlayer {
  id: number
  user_id: number
  state_id: number
  skill_level: string
  date_of_birth: string
  gender: string
  phone_number: string | null
  emergency_contact: string | null
  medical_conditions: string | null
  membership_status: 'active' | 'inactive' | 'suspended'
  registration_date: string
  last_activity: string | null
  total_tournaments: number
  current_ranking: number | null
  user: {
    id: number
    username: string
    email: string
    first_name: string
    last_name: string
  }
}

interface StateCoach {
  id: number
  user_id: number
  state_id: number
  certification_level: string
  specialization: string[] 
  hourly_rate: number | null
  bio: string | null
  experience_years: number | null
  phone_number: string | null
  availability_schedule: string | null
  is_verified: boolean
  verification_date: string | null
  total_students: number
  average_rating: number | null
  user: {
    id: number
    username: string
    email: string
    first_name: string
    last_name: string
  }
}

interface StateClub {
  id: number
  name: string
  description: string | null
  address: string | null
  contact_email: string | null
  contact_phone: string | null
  website_url: string | null
  state_id: number
  total_courts: number
  membership_fee: number | null
  amenities: string | null
  operating_hours: string | null
  is_active: boolean
  registration_date: string
  total_members: number
  upcoming_tournaments: number
}

interface StatePartner {
  id: number
  name: string
  type: 'sponsor' | 'vendor' | 'facility' | 'other'
  description: string | null
  contact_email: string | null
  contact_phone: string | null
  website_url: string | null
  state_id: number
  partnership_type: string | null
  contract_start_date: string | null
  contract_end_date: string | null
  is_active: boolean
  contribution_amount: number | null
  services_provided: string | null
}

interface MemberStats {
  total_players: number
  active_players: number
  suspended_players: number
  total_coaches: number
  verified_coaches: number
  total_clubs: number
  active_clubs: number
  total_partners: number
  active_partners: number
  players_by_skill: {
    [key: string]: number
  }
  coaches_by_certification: {
    [key: string]: number
  }
  recent_registrations: number
}

interface StateMemberManagementState {
  players: StatePlayer[]
  coaches: StateCoach[]
  clubs: StateClub[]
  partners: StatePartner[]
  stats: MemberStats | null
  selectedPlayer: StatePlayer | null
  selectedCoach: StateCoach | null
  selectedClub: StateClub | null
  selectedPartner: StatePartner | null
  loading: boolean
  error: string | null
  filters: {
    member_type: 'all' | 'players' | 'coaches' | 'clubs' | 'partners'
    status: string
    search: string
    skill_level: string
    certification_level: string
  }
}

const initialState: StateMemberManagementState = {
  players: [],
  coaches: [],
  clubs: [],
  partners: [],
  stats: null,
  selectedPlayer: null,
  selectedCoach: null,
  selectedClub: null,
  selectedPartner: null,
  loading: false,
  error: null,
  filters: {
    member_type: 'all',
    status: '',
    search: '',
    skill_level: '',
    certification_level: ''
  }
}

const stateMemberManagementSlice = createSlice({
  name: 'stateMemberManagement',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setMemberData: (state, action: PayloadAction<{
      players: StatePlayer[]
      coaches: StateCoach[]
      clubs: StateClub[]
      partners: StatePartner[]
      stats: MemberStats
    }>) => {
      state.players = action.payload.players
      state.coaches = action.payload.coaches
      state.clubs = action.payload.clubs
      state.partners = action.payload.partners
      state.stats = action.payload.stats
    },
    setSelectedPlayer: (state, action: PayloadAction<StatePlayer | null>) => {
      state.selectedPlayer = action.payload
    },
    setSelectedCoach: (state, action: PayloadAction<StateCoach | null>) => {
      state.selectedCoach = action.payload
    },
    setSelectedClub: (state, action: PayloadAction<StateClub | null>) => {
      state.selectedClub = action.payload
    },
    setSelectedPartner: (state, action: PayloadAction<StatePartner | null>) => {
      state.selectedPartner = action.payload
    },
    setFilters: (state, action: PayloadAction<Partial<StateMemberManagementState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    updatePlayer: (state, action: PayloadAction<StatePlayer>) => {
      const index = state.players.findIndex(player => player.id === action.payload.id)
      if (index !== -1) {
        state.players[index] = action.payload
      }
    },
    updateCoach: (state, action: PayloadAction<StateCoach>) => {
      const index = state.coaches.findIndex(coach => coach.id === action.payload.id)
      if (index !== -1) {
        state.coaches[index] = action.payload
      }
    },
    updateClub: (state, action: PayloadAction<StateClub>) => {
      const index = state.clubs.findIndex(club => club.id === action.payload.id)
      if (index !== -1) {
        state.clubs[index] = action.payload
      }
    },
    updatePartner: (state, action: PayloadAction<StatePartner>) => {
      const index = state.partners.findIndex(partner => partner.id === action.payload.id)
      if (index !== -1) {
        state.partners[index] = action.payload
      }
    }
  }
})

export const {
  setLoading,
  setError,
  setMemberData,
  setSelectedPlayer,
  setSelectedCoach,
  setSelectedClub,
  setSelectedPartner,
  setFilters,
  updatePlayer,
  updateCoach,
  updateClub,
  updatePartner
} = stateMemberManagementSlice.actions

// API Functions
export const fetchStateMemberData = (filters?: Partial<StateMemberManagementState['filters']>) => async (dispatch: AppDispatch, getState: () => RootState) => {
  dispatch(startLoading('Loading member data...'))
  
  try {
    dispatch(setError(null))
    
    const state = getState()
    const currentFilters = { ...state.stateMemberManagement.filters, ...filters }
    
    if (filters) {
      dispatch(setFilters(filters))
    }
    
    const response = await api.get('/api/state/members', {
      params: currentFilters
    })
    
    dispatch(setMemberData(response.data as {
      players: StatePlayer[]
      coaches: StateCoach[]
      clubs: StateClub[]
      partners: StatePartner[]
      stats: MemberStats
    }))
    dispatch(stopLoading())
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch member data'
    dispatch(setError(errorMessage))
    dispatch(stopLoading())
    throw error
  }
}

export const updatePlayerStatus = (playerId: number, status: string) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Updating player status...'))
  
  try {
    dispatch(setError(null))
    
    const response = await api.put(`/api/state/players/${playerId}/status`, { status })
    dispatch(updatePlayer((response.data as { player: StatePlayer }).player))
    
    dispatch(stopLoading())
    return response.data as { player: StatePlayer }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update player status'
    dispatch(setError(errorMessage))
    dispatch(stopLoading())
    throw error
  }
}

export const updateCoachVerification = (coachId: number, verified: boolean) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Updating coach verification...'))
  
  try {
    dispatch(setError(null))
    
    const response = await api.put(`/api/state/coaches/${coachId}/verify`, { verified })
    dispatch(updateCoach((response.data as { coach: StateCoach }).coach))
    
    dispatch(stopLoading())
    return response.data as { coach: StateCoach }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update coach verification'
    dispatch(setError(errorMessage))
    dispatch(stopLoading())
    throw error
  }
}

export const updateClubStatus = (clubId: number, status: boolean) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Updating club status...'))
  
  try {
    dispatch(setError(null))
    
    const response = await api.put(`/api/state/clubs/${clubId}/status`, { is_active: status })
    dispatch(updateClub((response.data as { club: StateClub }).club))
    
    dispatch(stopLoading())
    return response.data as { club: StateClub }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update club status'
    dispatch(setError(errorMessage))
    dispatch(stopLoading())
    throw error
  }
}

export const updatePartnerStatus = (partnerId: number, status: boolean) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Updating partner status...'))
  
  try {
    dispatch(setError(null))
    
    const response = await api.put(`/api/state/partners/${partnerId}/status`, { is_active: status })
    dispatch(updatePartner((response.data as { partner: StatePartner }).partner))
    
    dispatch(stopLoading())
    return response.data as { partner: StatePartner }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update partner status'
    dispatch(setError(errorMessage))
    dispatch(stopLoading())
    throw error
  }
}

export default stateMemberManagementSlice.reducer

// Export types
export type {
  StatePlayer,
  StateCoach,
  StateClub,
  StatePartner,
  MemberStats
}