import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import { fetchAdminDashboard, setActiveTab } from '../../store/slices/adminSlice'
import AdminOverview from '../../components/admin/dashboard/AdminOverview'
import UserManagement from '../../components/admin/dashboard/UserManagement'
import Messaging from '../../components/admin/dashboard/Messaging'
import CourtRegistry from '../../components/admin/dashboard/CourtRegistry'
import PaymentsMemberships from '../../components/admin/dashboard/PaymentsMemberships'
import MicrositeManagement from '../../components/admin/dashboard/MicrositeManagement'
import TournamentManagement from '../../components/admin/dashboard/TournamentManagement'
import RankingManagement from '../../components/admin/dashboard/RankingManagement'
import SupportSecurity from '../../components/admin/dashboard/SupportSecurity'

const AdminDashboard = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { statistics, loading, error, activeTab } = useSelector((state: RootState) => state.admin)
  const { user } = useSelector((state: RootState) => state.auth)

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', description: 'Overview and statistics' },
    { id: 'users', name: 'User Management', icon: '👥', description: 'Manage all users' },
    { id: 'messaging', name: 'Messaging', icon: '📢', description: 'Send announcements' },
    { id: 'courts', name: 'Court Registry', icon: '🏟️', description: 'Monitor all courts' },
    { id: 'payments', name: 'Payments & Memberships', icon: '💳', description: 'Financial overview' },
    { id: 'microsites', name: 'Microsite Management', icon: '🌐', description: 'Manage microsites' },
    { id: 'tournaments', name: 'Tournament Management', icon: '🏆', description: 'Manage tournaments' },
    { id: 'rankings', name: 'Ranking Management', icon: '📈', description: 'Manage rankings' },
    { id: 'support', name: 'Support & Security', icon: '🛡️', description: 'Admin controls' }
  ]

  useEffect(() => {
    dispatch(fetchAdminDashboard())
  }, [dispatch])

  const handleTabChange = (tabId: string) => {
    dispatch(setActiveTab(tabId))
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminOverview />
      case 'users':
        return <UserManagement />
      case 'messaging':
        return <Messaging />
      case 'courts':
        return <CourtRegistry />
      case 'payments':
        return <PaymentsMemberships />
      case 'microsites':
        return <MicrositeManagement />
      case 'tournaments':
        return <TournamentManagement />
      case 'rankings':
        return <RankingManagement />
      case 'support':
        return <SupportSecurity />
      default:
        return <AdminOverview />
    }
  }

  if (loading && !statistics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Error loading admin dashboard</div>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => dispatch(fetchAdminDashboard())}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Federation Administration Panel - Welcome, {user?.username}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                SUPERADMIN
              </div>
              {statistics && (
                <div className="text-sm text-gray-500">
                  Total Users: {statistics.totalUsers.total}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="text-2xl text-blue-600">👥</div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {statistics.totalUsers.total}
                  </div>
                  <div className="text-sm text-gray-600">Total Users</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="text-2xl text-green-600">⚡</div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {statistics.activeUsers.monthly}
                  </div>
                  <div className="text-sm text-gray-600">Monthly Active</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="text-2xl text-purple-600">🏆</div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {statistics.tournaments.active}
                  </div>
                  <div className="text-sm text-gray-600">Active Tournaments</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="text-2xl text-green-600">💰</div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    ${statistics.financials.monthlyRevenue.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Monthly Revenue</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow min-h-96">
          {renderTabContent()}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard