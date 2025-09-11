import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState, AppDispatch } from '../../store'
import { fetchAdminDashboard } from '../../store/slices/adminDashboardSlice'
import {
  AdminDashboardHeader,
  AdminStatsGrid,
  AdminQuickActions,
  AdminRecentActivity,
  AdminSystemStatus,
  AdminPendingApprovals
} from '../../components/admin/dashboard'

const AdminDashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.auth)
  const { dashboardData, isLoading, error } = useSelector((state: RootState) => state.adminDashboard)

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login')
      return
    }
    
    if (!dashboardData) {
      dispatch(fetchAdminDashboard())
    }
  }, [user, navigate, dispatch, dashboardData])

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (isLoading || !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg font-medium">{error}</div>
          <button 
            onClick={() => dispatch(fetchAdminDashboard())} 
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <AdminDashboardHeader user={user} />

        <AdminStatsGrid stats={dashboardData.stats} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <AdminQuickActions />
          <AdminRecentActivity recentActivity={dashboardData.recentActivity} />
        </div>

        <AdminSystemStatus systemStatus={dashboardData.systemStatus} />

        <AdminPendingApprovals pendingApprovals={dashboardData.pendingApprovals} />
      </div>
    </div>
  )
}

export default AdminDashboardPage