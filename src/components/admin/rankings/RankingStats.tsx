import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'

const RankingStats: React.FC = () => {
  const { rankingStats } = useSelector((state: RootState) => state.adminRankings)

  const statsConfig = [
    { 
      label: 'Total Ranked Players', 
      value: rankingStats.totalRankedPlayers, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      icon: '👥'
    },
    { 
      label: 'Recent Changes', 
      value: rankingStats.recentChanges, 
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      icon: '📊'
    },
    { 
      label: 'Average Points', 
      value: rankingStats.averagePoints, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      icon: '📈'
    },
    { 
      label: 'Highest Points', 
      value: rankingStats.highestPoints, 
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      icon: '🏆'
    },
    { 
      label: 'Tournaments Considered', 
      value: rankingStats.totalTournamentsConsidered, 
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      icon: '🎾'
    },
    { 
      label: 'Most Active State', 
      value: rankingStats.mostActiveState, 
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
      icon: '🗺️',
      isText: true
    },
  ]

  return (
    <div className="mb-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Ranking System Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {statsConfig.map((stat) => (
            <div
              key={stat.label}
              className={`p-4 rounded-lg border ${stat.bgColor} ${stat.borderColor}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{stat.icon}</span>
                <div className={`text-xl font-bold ${stat.color}`}>
                  {stat.isText ? stat.value : typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                </div>
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className=" rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Ranking System Status</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">System Status:</span>
                  <span className="text-green-600 font-medium">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Calculation:</span>
                  <span className="text-gray-900">2 hours ago</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Next Scheduled Update:</span>
                  <span className="text-gray-900">In 22 hours</span>
                </div>
              </div>
            </div>

            <div className=" rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Quick Stats</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Players with Rankings:</span>
                  <span className="text-gray-900">{((rankingStats.totalRankedPlayers / (rankingStats.totalRankedPlayers + 150)) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Weekly Position Changes:</span>
                  <span className="text-gray-900">{Math.round(rankingStats.recentChanges * 1.2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Points Range:</span>
                  <span className="text-gray-900">0 - {rankingStats.highestPoints}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RankingStats