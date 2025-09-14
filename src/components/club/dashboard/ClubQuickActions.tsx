import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../store'
import { fetchClubDashboard } from '../../../store/slices/clubDashboardSlice'

interface QuickAction {
  title: string
  description: string
  icon: string
  href: string
}

const ClubQuickActions: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const quickActions: QuickAction[] = [
    { title: 'Manage Members', description: 'View and manage club members', icon: '👥', href: '/club/members' },
    { title: 'Court Management', description: 'Manage court schedules and bookings', icon: '🎾', href: '/club/courts' },
    { title: 'Organize Tournament', description: 'Create and manage tournaments', icon: '🏆', href: '/club/tournaments' },
    { title: 'Club Microsite', description: 'Manage your club\'s website', icon: '🌐', href: '/club/microsite' },
    { title: 'Club Profile', description: 'Update club information', icon: '🏢', href: '/club/profile' }
  ]

  const handleRefresh = () => {
    dispatch(fetchClubDashboard())
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Quick Actions</h3>
        <button
          onClick={handleRefresh}
          className="text-purple-600 hover:text-purple-700 p-2 rounded-lg hover:bg-purple-50 transition-colors"
          title="Refresh dashboard data"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActions.map((action) => (
          <button
            key={action.title}
            onClick={() => navigate(action.href)}
            className="text-left p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-3">{action.icon}</span>
              <h4 className="font-semibold text-gray-900">{action.title}</h4>
            </div>
            <p className="text-sm text-gray-600">{action.description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

export default ClubQuickActions