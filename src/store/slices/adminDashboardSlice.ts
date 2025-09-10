import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '../index'
import { startLoading, stopLoading } from './loadingSlice'
import api from '../../services/api'

export interface SystemStatus {
  database: 'online' | 'offline' | 'maintenance'
  email: 'online' | 'offline' | 'maintenance'  
  storage: 'online' | 'offline' | 'maintenance'
  payments: 'online' | 'offline' | 'maintenance'
}

export interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalPayments: number
  monthlyRevenue: number
  totalTournaments: number
  activeTournaments: number
  totalCourts: number
  activeCourts: number
  totalMessages: number
  unreadMessages: number
}

export interface PendingApproval {
  id: number
  type: 'user' | 'court' | 'tournament' | 'microsite'
  title: string
  description: string
  submittedBy: string
  submittedAt: string
  status: 'pending' | 'approved' | 'rejected'
}

export interface RecentActivity {
  id: number
  type: 'user_registration' | 'payment' | 'tournament_created' | 'court_registered' | 'message_sent'
  title: string
  description: string
  user: {
    id: number
    name: string
    role: string
  }
  timestamp: string
}

export interface AdminDashboardData {
  stats: AdminStats
  systemStatus: SystemStatus
  pendingApprovals: PendingApproval[]
  recentActivity: RecentActivity[]
}

export interface AdminDashboardState {
  dashboardData: AdminDashboardData | null
  isLoading: boolean
  error: string | null
}

const initialState: AdminDashboardState = {
  dashboardData: null,
  isLoading: false,
  error: null
}

const adminDashboardSlice = createSlice({
  name: 'adminDashboard',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setDashboardData: (state, action: PayloadAction<AdminDashboardData>) => {
      state.dashboardData = action.payload
    },
    updateApprovalStatus: (state, action: PayloadAction<{ id: number; status: 'approved' | 'rejected' }>) => {
      if (state.dashboardData) {
        const approval = state.dashboardData.pendingApprovals.find(a => a.id === action.payload.id)
        if (approval) {
          approval.status = action.payload.status
        }
      }
    },
    clearDashboard: (state) => {
      state.dashboardData = null
      state.error = null
    }
  }
})

export const {
  setLoading,
  setError,
  setDashboardData,
  updateApprovalStatus,
  clearDashboard
} = adminDashboardSlice.actions

// Fetch admin dashboard data
export const fetchAdminDashboard = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(startLoading('Loading dashboard...'))
    const response = await api.get<AdminDashboardData>('/api/admin/dashboard')
    dispatch(setDashboardData(response.data))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(setError('Failed to load dashboard data'))
    dispatch(stopLoading())
    throw error
  }
}

// Approve/reject pending items
export const updateApproval = (id: number, status: 'approved' | 'rejected', reason?: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(startLoading('Updating approval...'))
    await api.put(`/api/admin/approvals/${id}`, { status, reason })
    dispatch(updateApprovalStatus({ id, status }))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(setError('Failed to update approval'))
    dispatch(stopLoading())
    throw error
  }
}

export default adminDashboardSlice.reducer