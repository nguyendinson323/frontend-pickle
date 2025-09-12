import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import api from '../../services/api'
import { startLoading, stopLoading } from './loadingSlice'
import { AppDispatch, RootState } from '../index'

interface StatePlayer {
  id: number
  user_id: number
  full_name: string
  birth_date: string
  gender: 'Male' | 'Female' | 'Other' | null
  state_id: number
  curp: string | null
  nrtp_level: number | null
  profile_photo_url: string | null
  id_document_url: string
  nationality: string
  club_id: number | null
  ranking_position: number | null
  affiliation_expires_at: string | null
  membership_status: 'active' | 'inactive'
  age: number
  created_at: string
  updated_at: string
  user: {
    id: number
    username: string
    email: string
    phone: string | null
  }
  state: {
    name: string
  }
}

interface StateCoach {
  id: number
  user_id: number
  full_name: string
  birth_date: string
  gender: 'Male' | 'Female' | 'Other' | null
  state_id: number
  curp: string | null
  nrtp_level: number | null
  profile_photo_url: string | null
  id_document_url: string
  hourly_rate: number | null
  affiliation_expires_at: string | null
  membership_status: 'active' | 'inactive'
  age: number
  created_at: string
  updated_at: string
  user: {
    id: number
    username: string
    email: string
    phone: string | null
  }
  state: {
    name: string
  }
}

interface StateClub {
  id: number
  user_id: number
  name: string
  rfc: string | null
  manager_name: string | null
  manager_title: string | null
  state_id: number
  club_type: string | null
  website: string | null
  social_media: string | null
  logo_url: string | null
  has_courts: boolean
  premium_expires_at: string | null
  affiliation_expires_at: string | null
  membership_status: 'active' | 'inactive'
  created_at: string
  updated_at: string
  user: {
    id: number
    username: string
    email: string
    phone: string | null
  }
  state: {
    name: string
  }
}

interface StatePartner {
  id: number
  user_id: number
  business_name: string
  rfc: string | null
  contact_name: string | null
  contact_title: string | null
  partner_type: string | null
  state_id: number
  website: string | null
  social_media: string | null
  logo_url: string | null
  has_courts: boolean
  premium_expires_at: string | null
  membership_status: 'active' | 'inactive'
  created_at: string
  updated_at: string
  user: {
    id: number
    username: string
    email: string
    phone: string | null
  }
  state: {
    name: string
  }
}

interface MemberStats {
  total_players: number
  active_players: number
  inactive_players: number
  total_coaches: number
  active_coaches: number
  total_clubs: number
  active_clubs: number
  total_partners: number
  active_partners: number
  players_by_skill: {
    [key: string]: number
  }
  coaches_by_level: {
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