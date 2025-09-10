import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '../index'
import { startLoading, stopLoading } from './loadingSlice'
import api from '../../services/api'

export interface ClubMember {
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

export interface MembershipStats {
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

// Define response interfaces
interface ClubMembersResponse {
  members: ClubMember[]
  stats: MembershipStats
}

interface MemberResponse {
  member: ClubMember
}

interface InviteResponse {
  message: string
  invitation_id: number
}

interface BulkUpdateResponse {
  message: string
  updated_count: number
}

// API Functions
export const fetchClubMembersData = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(startLoading('Loading members data...'))
    const response = await api.get<ClubMembersResponse>('/api/club/members')
    dispatch(setMembersData(response.data))
    dispatch(stopLoading())
  } catch (error: unknown) {
    dispatch(setError((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to fetch members data'))
    dispatch(stopLoading())
  }
}

export const updateMemberActiveStatus = (memberId: number, isActive: boolean) => async (dispatch: AppDispatch) => {
  try {
    dispatch(startLoading('Updating member status...'))
    await api.put(`/api/club/members/${memberId}/status`, { is_active: isActive })
    dispatch(updateMemberStatus({ id: memberId, is_active: isActive }))
    dispatch(stopLoading())
  } catch (error: unknown) {
    dispatch(setError((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to update member status'))
    dispatch(stopLoading())
    throw error
  }
}

export const removeMemberFromClub = (memberId: number) => async (dispatch: AppDispatch) => {
  try {
    dispatch(startLoading('Removing member...'))
    await api.delete(`/api/club/members/${memberId}`)
    dispatch(removeMember(memberId))
    dispatch(stopLoading())
  } catch (error: unknown) {
    dispatch(setError((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to remove member'))
    dispatch(stopLoading())
    throw error
  }
}

export const extendMembershipExpiry = (memberId: number, expiryDate: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(startLoading('Extending membership...'))
    const response = await api.put<MemberResponse>(`/api/club/members/${memberId}/extend`, { 
      affiliation_expires_at: expiryDate 
    })
    dispatch(updateMemberInfo(response.data.member))
    dispatch(stopLoading())
    
    return response.data
  } catch (error: unknown) {
    dispatch(setError((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to extend membership'))
    dispatch(stopLoading())
    throw error
  }
}

export const inviteNewMember = (inviteData: {
  email: string
  full_name: string
  phone?: string
  message?: string
}) => async (dispatch: AppDispatch) => {
  try {
    dispatch(startLoading('Sending invitation...'))
    const response = await api.post<InviteResponse>('/api/club/members/invite', inviteData)
    dispatch(stopLoading())
    
    return response.data
  } catch (error: unknown) {
    dispatch(setError((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to send invitation'))
    dispatch(stopLoading())
    throw error
  }
}

export const updateMemberData = (memberId: number, updateData: {
  full_name: string
  nrtp_level: number
  affiliation_expires_at: string | null
}) => async (dispatch: AppDispatch) => {
  try {
    dispatch(startLoading('Updating member information...'))
    const response = await api.put<MemberResponse>(`/api/club/members/${memberId}`, updateData)
    dispatch(updateMemberInfo(response.data.member))
    dispatch(stopLoading())
    
    return response.data
  } catch (error: unknown) {
    dispatch(setError((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to update member information'))
    dispatch(stopLoading())
    throw error
  }
}

export const bulkUpdateMembers = (memberIds: number[], updateData: {
  action: 'activate' | 'deactivate' | 'extend_membership'
  expiry_date?: string
}) => async (dispatch: AppDispatch) => {
  try {
    dispatch(startLoading('Updating members...'))
    const response = await api.put<BulkUpdateResponse>('/api/club/members/bulk-update', {
      member_ids: memberIds,
      ...updateData
    })
    
    // Refresh data after bulk update
    dispatch(fetchClubMembersData())
    dispatch(stopLoading())
    
    return response.data
  } catch (error: unknown) {
    dispatch(setError((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to update members'))
    dispatch(stopLoading())
    throw error
  }
}

export default clubMembersSlice.reducer