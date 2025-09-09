import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

interface ClubMember {
  id: number
  full_name: string
  profile_photo_url: string | null
  nrtp_level: number
  ranking_position: number | null
  affiliation_expires_at: string | null
  nationality: string
  created_at: string
  updated_at: string
  user: {
    id: number
    username: string
    email: string
    phone: string
    is_active: boolean
  }
  state: {
    id: number
    name: string
  } | null
}

interface MembershipStats {
  total_members: number
  active_members: number
  expired_members: number
  average_level: number
  membership_revenue: number
  new_members_this_month: number
}

interface ClubMembersState {
  members: ClubMember[]
  stats: MembershipStats | null
  selectedMember: ClubMember | null
  loading: boolean
  error: string | null
}

const initialState: ClubMembersState = {
  members: [],
  stats: null,
  selectedMember: null,
  loading: false,
  error: null
}

const clubMembersSlice = createSlice({
  name: 'clubMembers',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setMembersData: (state, action: PayloadAction<{
      members: ClubMember[]
      stats: MembershipStats
    }>) => {
      state.members = action.payload.members
      state.stats = action.payload.stats
    },
    setSelectedMember: (state, action: PayloadAction<ClubMember | null>) => {
      state.selectedMember = action.payload
    },
    updateMemberStatus: (state, action: PayloadAction<{ id: number; is_active: boolean }>) => {
      const index = state.members.findIndex(member => member.id === action.payload.id)
      if (index !== -1) {
        state.members[index].user.is_active = action.payload.is_active
      }
    },
    removeMember: (state, action: PayloadAction<number>) => {
      state.members = state.members.filter(member => member.id !== action.payload)
    },
    updateMemberInfo: (state, action: PayloadAction<ClubMember>) => {
      const index = state.members.findIndex(member => member.id === action.payload.id)
      if (index !== -1) {
        state.members[index] = action.payload
      }
    }
  }
})

export const {
  setLoading,
  setError,
  setMembersData,
  setSelectedMember,
  updateMemberStatus,
  removeMember,
  updateMemberInfo
} = clubMembersSlice.actions

// API Functions
export const fetchClubMembersData = () => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    const response = await axios.get('/api/club/members')
    dispatch(setMembersData(response.data))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch members data'))
  } finally {
    dispatch(setLoading(false))
  }
}

export const updateMemberActiveStatus = (memberId: number, isActive: boolean) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    await axios.put(`/api/club/members/${memberId}/status`, { is_active: isActive })
    dispatch(updateMemberStatus({ id: memberId, is_active: isActive }))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to update member status'))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export const removeMemberFromClub = (memberId: number) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    await axios.delete(`/api/club/members/${memberId}`)
    dispatch(removeMember(memberId))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to remove member'))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export const extendMembershipExpiry = (memberId: number, expiryDate: string) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    const response = await axios.put(`/api/club/members/${memberId}/extend`, { 
      affiliation_expires_at: expiryDate 
    })
    dispatch(updateMemberInfo(response.data.member))
    
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to extend membership'))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export const inviteNewMember = (inviteData: {
  email: string
  full_name: string
  phone?: string
  message?: string
}) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    const response = await axios.post('/api/club/members/invite', inviteData)
    
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to send invitation'))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export const bulkUpdateMembers = (memberIds: number[], updateData: {
  action: 'activate' | 'deactivate' | 'extend_membership'
  expiry_date?: string
}) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    const response = await axios.put('/api/club/members/bulk-update', {
      member_ids: memberIds,
      ...updateData
    })
    
    // Refresh data after bulk update
    dispatch(fetchClubMembersData())
    
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to update members'))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export default clubMembersSlice.reducer