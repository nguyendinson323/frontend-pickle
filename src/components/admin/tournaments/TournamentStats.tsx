import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'

const TournamentStats: React.FC = () => {
  const { tournamentStats, loading } = useSelector((state: RootState) => state.adminTournaments)

  const stats = [
    {
      label: 'Total Tournaments',
      value: tournamentStats.totalTournaments,
      icon: '🏆',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      label: 'Active Tournaments',
      value: tournamentStats.activeTournaments,
      icon: '🟢',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      label: 'Upcoming',
      value: tournamentStats.upcomingTournaments,
      icon: '📅',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      label: 'Completed',
      value: tournamentStats.completedTournaments,
      icon: '✅',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      label: 'Cancelled',
      value: tournamentStats.cancelledTournaments,
      icon: '❌',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      label: 'Total Participants',
      value: tournamentStats.totalParticipants,
      icon: '👥',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200'
    },
    {
      label: 'Total Revenue',
      value: `$${tournamentStats.totalRevenue.toLocaleString()}`,
      icon: '💰',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      label: 'Avg Participants',
      value: tournamentStats.averageParticipants.toFixed(1),
      icon: '📊',
      color: 'text-gray-600',
      bgColor: '',
      borderColor: 'border-gray-200'
    },
    {
      label: 'Top Organizer',
      value: tournamentStats.topOrganizer || 'N/A',
      icon: '🥇',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      label: 'Pending Approvals',
      value: tournamentStats.pendingApprovals,
      icon: '⏳',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    }
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {[...Array(10)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className={`bg-white rounded-lg border ${stat.borderColor} p-6 ${stat.bgColor}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>
                {typeof stat.value === 'string' ? stat.value : stat.value.toLocaleString()}
              </p>
            </div>
            <div className="text-2xl">{stat.icon}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default TournamentStats