import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../../store'
import { AdminDashboard } from '../../types'
import {
  AdminDashboardHeader,
  AdminStatsGrid,
  AdminQuickActions,
  AdminRecentActivity,
  AdminSystemStatus,
  AdminPendingApprovals
} from '../../components/admin/AdminDashboard'

const AdminDashboardPage: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, dashboard } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login')
    }
  }, [user, navigate])

  if (!user || user.role !== 'admin' || !dashboard) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  const adminData = dashboard as AdminDashboard

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <AdminDashboardHeader user={user} />

        <AdminStatsGrid stats={adminData.stats} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <AdminQuickActions />
          <AdminRecentActivity />
        </div>

        <AdminSystemStatus systemStatus={adminData.systemStatus} />

        <AdminPendingApprovals />
      </div>
    </div>
  )
}

export default AdminDashboardPage