import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { TournamentAdmin } from '../../types/admin'

interface TournamentParticipant {
  id: number
  tournament_id: number
  user_id: number
  user_name: string
  user_type: string
  registration_date: string
  status: 'registered' | 'confirmed' | 'checked_in' | 'disqualified' | 'withdrew'
  seed: number | null
  payment_status: 'paid' | 'pending' | 'refunded'
  amount_paid: number
}

interface TournamentFilter {
  status: string
  organizer: string
  location: string
  dateFrom: string
  dateTo: string
  searchTerm: string
  entryFeeMin: string
  entryFeeMax: string
  participantsMin: string
  participantsMax: string
}

interface AdminTournamentsState {
  tournaments: TournamentAdmin[]
  participants: TournamentParticipant[]
  selectedTournament: TournamentAdmin | null
  tournamentFilter: TournamentFilter
  tournamentStats: {
    totalTournaments: number
    activeTournaments: number
    upcomingTournaments: number
    completedTournaments: number
    cancelledTournaments: number
    totalParticipants: number
    totalRevenue: number
    averageParticipants: number
    topOrganizer: string
    pendingApprovals: number
  }
  loading: boolean
  error: string | null
  selectedParticipants: number[]
}

const initialState: AdminTournamentsState = {
  tournaments: [],
  participants: [],
  selectedTournament: null,
  tournamentFilter: {
    status: '',
    organizer: '',
    location: '',
    dateFrom: '',
    dateTo: '',
    searchTerm: '',
    entryFeeMin: '',
    entryFeeMax: '',
    participantsMin: '',
    participantsMax: ''
  },
  tournamentStats: {
    totalTournaments: 0,
    activeTournaments: 0,
    upcomingTournaments: 0,
    completedTournaments: 0,
    cancelledTournaments: 0,
    totalParticipants: 0,
    totalRevenue: 0,
    averageParticipants: 0,
    topOrganizer: '',
    pendingApprovals: 0
  },
  loading: false,
  error: null,
  selectedParticipants: []
}

const adminTournamentsSlice = createSlice({
  name: 'adminTournaments',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setTournaments: (state, action: PayloadAction<TournamentAdmin[]>) => {
      state.tournaments = action.payload
    },
    setParticipants: (state, action: PayloadAction<TournamentParticipant[]>) => {
      state.participants = action.payload
    },
    setSelectedTournament: (state, action: PayloadAction<TournamentAdmin | null>) => {
      state.selectedTournament = action.payload
    },
    setTournamentFilter: (state, action: PayloadAction<Partial<TournamentFilter>>) => {
      state.tournamentFilter = { ...state.tournamentFilter, ...action.payload }
    },
    setTournamentStats: (state, action: PayloadAction<typeof initialState.tournamentStats>) => {
      state.tournamentStats = action.payload
    },
    setSelectedParticipants: (state, action: PayloadAction<number[]>) => {
      state.selectedParticipants = action.payload
    },
    addSelectedParticipant: (state, action: PayloadAction<number>) => {
      if (!state.selectedParticipants.includes(action.payload)) {
        state.selectedParticipants.push(action.payload)
      }
    },
    removeSelectedParticipant: (state, action: PayloadAction<number>) => {
      state.selectedParticipants = state.selectedParticipants.filter(id => id !== action.payload)
    },
    clearSelectedParticipants: (state) => {
      state.selectedParticipants = []
    },
    updateTournamentStatus: (state, action: PayloadAction<{ tournamentId: number; status: string }>) => {
      const tournamentIndex = state.tournaments.findIndex(t => t.id === action.payload.tournamentId)
      if (tournamentIndex !== -1) {
        state.tournaments[tournamentIndex].status = action.payload.status
      }
    },
    updateParticipantStatus: (state, action: PayloadAction<{ participantId: number; status: string }>) => {
      const participantIndex = state.participants.findIndex(p => p.id === action.payload.participantId)
      if (participantIndex !== -1) {
        state.participants[participantIndex].status = action.payload.status
      }
    }
  }
})

export const {
  setLoading,
  setError,
  setTournaments,
  setParticipants,
  setSelectedTournament,
  setTournamentFilter,
  setTournamentStats,
  setSelectedParticipants,
  addSelectedParticipant,
  removeSelectedParticipant,
  clearSelectedParticipants,
  updateTournamentStatus,
  updateParticipantStatus
} = adminTournamentsSlice.actions

// API Functions
export const fetchTournaments = (filters?: Partial<TournamentFilter>) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))

    const queryParams = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value)
      })
    }

    const response = await axios.get(`/api/admin/tournaments?${queryParams.toString()}`)

    dispatch(setTournaments(response.data.tournaments))
    dispatch(setTournamentStats(response.data.stats))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch tournaments'))
  } finally {
    dispatch(setLoading(false))
  }
}

export const fetchTournamentParticipants = (tournamentId?: number) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))

    const url = tournamentId ? `/api/admin/tournaments/${tournamentId}/participants` : '/api/admin/tournaments/participants'
    const response = await axios.get(url)

    dispatch(setParticipants(response.data))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch tournament participants'))
  } finally {
    dispatch(setLoading(false))
  }
}

export const getTournamentDetails = (tournamentId: number) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))

    const response = await axios.get(`/api/admin/tournaments/${tournamentId}`)

    dispatch(setSelectedTournament(response.data))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch tournament details'))
  } finally {
    dispatch(setLoading(false))
  }
}

export const updateTournamentStatusAction = (tournamentId: number, status: string, reason?: string) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const response = await axios.put(`/api/admin/tournaments/${tournamentId}/status`, { status, reason })

    dispatch(updateTournamentStatus({ tournamentId, status }))
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to update tournament status'))
    throw error
  }
}

export const approveTournament = (tournamentId: number) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const response = await axios.post(`/api/admin/tournaments/${tournamentId}/approve`)

    // Refresh tournaments list
    dispatch(fetchTournaments())
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to approve tournament'))
    throw error
  }
}

export const rejectTournament = (tournamentId: number, reason: string) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const response = await axios.post(`/api/admin/tournaments/${tournamentId}/reject`, { reason })

    // Refresh tournaments list
    dispatch(fetchTournaments())
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to reject tournament'))
    throw error
  }
}

export const cancelTournament = (tournamentId: number, reason: string) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const response = await axios.post(`/api/admin/tournaments/${tournamentId}/cancel`, { reason })

    dispatch(updateTournamentStatus({ tournamentId, status: 'cancelled' }))
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to cancel tournament'))
    throw error
  }
}

export const updateParticipantStatusAction = (participantId: number, status: string, reason?: string) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const response = await axios.put(`/api/admin/tournaments/participants/${participantId}/status`, { status, reason })

    dispatch(updateParticipantStatus({ participantId, status }))
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to update participant status'))
    throw error
  }
}

export const bulkUpdateParticipants = (participantIds: number[], action: string, data?: any) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))

    const response = await axios.post('/api/admin/tournaments/participants/bulk-update', {
      participantIds,
      action,
      data
    })

    // Refresh participants list
    dispatch(fetchTournamentParticipants())
    dispatch(clearSelectedParticipants())

    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to update participants'))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export const exportTournaments = (filters: Partial<TournamentFilter>, format: 'csv' | 'excel' | 'pdf') => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const queryParams = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value)
    })
    queryParams.append('format', format)

    const response = await axios.get(`/api/admin/tournaments/export?${queryParams.toString()}`, {
      responseType: 'blob'
    })

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `tournaments-export-${new Date().toISOString().split('T')[0]}.${format}`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)

    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to export tournaments'))
    throw error
  }
}

export const generateTournamentReport = (tournamentId: number) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const response = await axios.get(`/api/admin/tournaments/${tournamentId}/report`)

    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to generate tournament report'))
    throw error
  }
}

export const sendTournamentNotification = (tournamentId: number, subject: string, message: string, recipients: string[]) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const response = await axios.post(`/api/admin/tournaments/${tournamentId}/notify`, {
      subject,
      message,
      recipients
    })

    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to send tournament notification'))
    throw error
  }
}

export default adminTournamentsSlice.reducer