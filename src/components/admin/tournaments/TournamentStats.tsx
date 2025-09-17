import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import {
  FiPlay,
  FiCalendar,
  FiCheckCircle,
  FiX,
  FiUsers,
  FiDollarSign,
  FiBarChart,
  FiAward,
  FiClock,
  FiTrendingUp,
  FiLoader
} from 'react-icons/fi'

const TournamentStats: React.FC = () => {
  const { tournamentStats, loading } = useSelector((state: RootState) => state.adminTournaments)

  const stats = [
    {
      label: 'Total Tournaments',
      value: tournamentStats.totalTournaments,
      icon: FiCalendar,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200'
    },
    {
      label: 'Active Tournaments',
      value: tournamentStats.activeTournaments,
      icon: FiPlay,
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-emerald-100',
      borderColor: 'border-green-200'
    },
    {
      label: 'Upcoming',
      value: tournamentStats.upcomingTournaments,
      icon: FiCalendar,
      gradient: 'from-yellow-500 to-orange-600',
      bgGradient: 'from-yellow-50 to-orange-100',
      borderColor: 'border-yellow-200'
    },
    {
      label: 'Completed',
      value: tournamentStats.completedTournaments,
      icon: FiCheckCircle,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-200'
    },
    {
      label: 'Cancelled',
      value: tournamentStats.cancelledTournaments,
      icon: FiX,
      gradient: 'from-red-500 to-red-600',
      bgGradient: 'from-red-50 to-red-100',
      borderColor: 'border-red-200'
    },
    {
      label: 'Total Participants',
      value: tournamentStats.totalParticipants,
      icon: FiUsers,
      gradient: 'from-indigo-500 to-indigo-600',
      bgGradient: 'from-indigo-50 to-indigo-100',
      borderColor: 'border-indigo-200'
    },
    {
      label: 'Total Revenue',
      value: `$${tournamentStats.totalRevenue.toLocaleString()}`,
      icon: FiDollarSign,
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-100',
      borderColor: 'border-green-200'
    },
    {
      label: 'Avg Participants',
      value: tournamentStats.averageParticipants.toFixed(1),
      icon: FiBarChart,
      gradient: 'from-gray-500 to-gray-600',
      bgGradient: 'from-gray-50 to-gray-100',
      borderColor: 'border-gray-200'
    },
    {
      label: 'Top Organizer',
      value: tournamentStats.topOrganizer || 'N/A',
      icon: FiAward,
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-orange-100',
      borderColor: 'border-orange-200'
    },
    {
      label: 'Pending Approvals',
      value: tournamentStats.pendingApprovals,
      icon: FiClock,
      gradient: 'from-amber-500 to-amber-600',
      bgGradient: 'from-amber-50 to-amber-100',
      borderColor: 'border-amber-200'
    }
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {[...Array(10)].map((_, index) => (
          <div key={index} className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
            <div className="animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded-xl w-3/4 mb-3"></div>
                  <div className="h-8 bg-gray-200 rounded-xl w-1/2"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center ml-4">
                  <FiLoader className="h-5 w-5 animate-spin text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon
        return (
          <div
            key={index}
            className={`bg-gradient-to-br ${stat.bgGradient} rounded-2xl border-2 ${stat.borderColor} p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {typeof stat.value === 'string' ? stat.value : stat.value.toLocaleString()}
                </p>
                <div className="mt-2 flex items-center">
                  <FiTrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs font-medium text-green-600">Live Data</span>
                </div>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center text-white shadow-lg ml-4`}>
                <IconComponent className="h-5 w-5" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default TournamentStats