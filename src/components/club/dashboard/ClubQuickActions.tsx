import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../store'
import { fetchClubDashboard } from '../../../store/slices/clubDashboardSlice'
import {
  FiUsers,
  FiMapPin,
  FiAward,
  FiGlobe,
  FiSettings,
  FiRefreshCw,
  FiZap,
  FiArrowRight
} from 'react-icons/fi'

interface QuickAction {
  title: string
  description: string
  icon: React.ElementType
  href: string
  gradient: string
  bgGradient: string
  borderColor: string
}

const ClubQuickActions: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const quickActions: QuickAction[] = [
    {
      title: 'Manage Members',
      description: 'View and manage club members',
      icon: FiUsers,
      href: '/club/members',
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-200'
    },
    {
      title: 'Court Management',
      description: 'Manage court schedules and bookings',
      icon: FiMapPin,
      href: '/club/courts',
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-100',
      borderColor: 'border-green-200'
    },
    {
      title: 'Organize Tournament',
      description: 'Create and manage tournaments',
      icon: FiAward,
      href: '/club/tournaments',
      gradient: 'from-yellow-500 to-orange-600',
      bgGradient: 'from-yellow-50 to-orange-100',
      borderColor: 'border-yellow-200'
    },
    {
      title: 'Club Microsite',
      description: 'Manage your club\'s website',
      icon: FiGlobe,
      href: '/club/microsite',
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-100',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Club Profile',
      description: 'Update club information',
      icon: FiSettings,
      href: '/club/profile',
      gradient: 'from-indigo-500 to-purple-600',
      bgGradient: 'from-indigo-50 to-purple-100',
      borderColor: 'border-indigo-200'
    }
  ]

  const handleRefresh = () => {
    dispatch(fetchClubDashboard())
  }

  return (
    <div className="bg-white shadow-2xl rounded-3xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-50 to-indigo-100 p-8 border-b-2 border-purple-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white mr-4">
              <FiZap className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Quick Actions</h3>
              <p className="text-purple-700 font-medium">Manage your club efficiently</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center p-3 bg-white bg-opacity-50 hover:bg-opacity-75 text-purple-700 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            title="Refresh dashboard data"
          >
            <FiRefreshCw className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon
            return (
              <button
                key={action.title}
                onClick={() => navigate(action.href)}
                className={`group text-left p-6 border-2 ${action.borderColor} bg-gradient-to-r ${action.bgGradient} rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 animate-table-row`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${action.gradient} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <FiArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transform group-hover:translate-x-1 transition-all duration-200" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{action.title}</h4>
                <p className="text-sm font-medium text-gray-600">{action.description}</p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ClubQuickActions