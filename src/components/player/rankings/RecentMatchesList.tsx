import React from 'react'
import { MatchResult } from '../../../store/slices/playerRankingsSlice'
import {
  FiActivity,
  FiUser,
  FiCalendar,
  FiClock,
  FiTarget,
  FiAward,
  FiTrendingUp,
  FiInbox
} from 'react-icons/fi'

interface RecentMatchesListProps {
  recentMatches: MatchResult[]
  formatDate: (dateString: string) => string
}

const RecentMatchesList: React.FC<RecentMatchesListProps> = ({
  recentMatches,
  formatDate
}) => {
  if (recentMatches.length === 0) {
    return (
      <div>
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
            <FiActivity className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Recent Matches</h3>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 p-16 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FiInbox className="w-10 h-10 text-white" />
          </div>
          <h4 className="text-2xl font-bold text-gray-900 mb-4">No Match History</h4>
          <p className="text-gray-600 font-medium text-lg">Your recent matches will appear here</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
          <FiActivity className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Recent Matches</h3>
      </div>

      <div className="space-y-6">
        {recentMatches.map(match => (
          <div key={match.id} className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 p-8 hover:transform hover:scale-105 transition-all duration-300">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shadow-lg ${
                    match.result === 'win' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-pink-600'
                  }`}>
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className={`font-bold text-lg px-3 py-1 rounded-full ${
                    match.result === 'win' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
                  }`}>
                    {match.result.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-500 font-medium">vs</span>
                  <div className="flex items-center">
                    <FiUser className="w-4 h-4 text-gray-600 mr-2" />
                    <span className="font-bold text-gray-900">
                      {match.opponent.full_name}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                  <div className="bg-blue-50 p-3 rounded-2xl border-2 border-blue-100 flex items-center">
                    <FiCalendar className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-sm font-bold text-blue-700">{formatDate(match.match_date)}</span>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-2xl border-2 border-purple-100 flex items-center">
                    <FiTarget className="w-4 h-4 text-purple-600 mr-2" />
                    <span className="text-sm font-bold text-purple-700">{match.match_format}</span>
                  </div>
                  <div className="bg-green-50 p-3 rounded-2xl border-2 border-green-100 flex items-center">
                    <FiTrendingUp className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm font-bold text-green-700">{match.final_score}</span>
                  </div>
                  {match.duration_minutes && (
                    <div className="bg-orange-50 p-3 rounded-2xl border-2 border-orange-100 flex items-center">
                      <FiClock className="w-4 h-4 text-orange-600 mr-2" />
                      <span className="text-sm font-bold text-orange-700">{Math.floor(match.duration_minutes / 60)}h {match.duration_minutes % 60}m</span>
                    </div>
                  )}
                  <div className="bg-indigo-50 p-3 rounded-2xl border-2 border-indigo-100 flex items-center capitalize">
                    <FiAward className="w-4 h-4 text-indigo-600 mr-2" />
                    <span className="text-sm font-bold text-indigo-700">{match.match_type}</span>
                  </div>
                </div>

                {match.tournament && (
                  <div className="mt-4 bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-2xl border-2 border-yellow-200">
                    <div className="flex items-center">
                      <FiAward className="w-5 h-5 text-yellow-600 mr-2" />
                      <span className="text-sm font-bold text-yellow-800">
                        {match.tournament.name} ({match.tournament.level})
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="lg:text-right">
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-2xl border-2 border-green-200 text-center lg:text-right">
                  <div className="text-2xl font-bold text-green-700 flex items-center justify-center lg:justify-end">
                    <FiTrendingUp className="w-6 h-6 mr-2" />
                    +{match.points_earned} pts
                  </div>
                  <div className="text-sm text-green-600 font-bold mt-1">
                    Rating: {match.performance_rating}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentMatchesList