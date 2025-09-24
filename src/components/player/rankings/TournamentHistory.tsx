import React from 'react'
import { TournamentPerformance } from '../../../store/slices/playerRankingsSlice'
import {
  FiAward,
  FiCalendar,
  FiUsers,
  FiTarget,
  FiTrendingUp,
  FiDollarSign,
  FiInbox
} from 'react-icons/fi'

interface TournamentHistoryProps {
  tournamentHistory: TournamentPerformance[]
  formatDate: (dateString: string) => string
}

const TournamentHistory: React.FC<TournamentHistoryProps> = ({
  tournamentHistory,
  formatDate
}) => {
  if (tournamentHistory.length === 0) {
    return (
      <div>
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
            <FiAward className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Tournament History</h3>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 p-16 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FiInbox className="w-10 h-10 text-white" />
          </div>
          <h4 className="text-2xl font-bold text-gray-900 mb-4">No Tournament History</h4>
          <p className="text-gray-600 font-medium text-lg">Your tournament results will appear here</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
          <FiAward className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Tournament History</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {tournamentHistory.map(tournament => (
          <div key={tournament.tournament_id} className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 p-8 hover:transform hover:scale-105 transition-all duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
              <div>
                <div className="flex items-center mb-2">
                  <FiAward className="w-5 h-5 text-yellow-600 mr-2" />
                  <h4 className="text-lg font-bold text-gray-900">
                    {tournament.tournament_name}
                  </h4>
                </div>
                <div className="flex items-center text-gray-600 mb-1">
                  <FiTarget className="w-4 h-4 mr-1" />
                  <p className="text-sm font-medium">{tournament.tournament_level}</p>
                </div>
                <div className="flex items-center text-gray-500">
                  <FiCalendar className="w-4 h-4 mr-1" />
                  <p className="text-sm font-medium">{formatDate(tournament.tournament_date)}</p>
                </div>
              </div>
              <div className={`px-4 py-2 text-sm font-bold rounded-2xl shadow-lg ${
                tournament.final_position === 'Winner'
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white'
                  : tournament.final_position === 'Runner-up'
                  ? 'bg-gradient-to-r from-gray-400 to-gray-600 text-white'
                  : tournament.final_position.includes('Semifinalist')
                  ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white'
                  : 'bg-gradient-to-r from-blue-400 to-indigo-600 text-white'
              }`}>
                {tournament.final_position}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-200 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <FiAward className="w-6 h-6 text-white" />
                </div>
                <p className="text-3xl font-bold text-green-700 mb-1">{tournament.matches_won}</p>
                <p className="text-sm font-bold text-green-600">Wins</p>
              </div>
              <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-2xl border-2 border-red-200 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <FiTarget className="w-6 h-6 text-white" />
                </div>
                <p className="text-3xl font-bold text-red-700 mb-1">{tournament.matches_lost}</p>
                <p className="text-sm font-bold text-red-600">Losses</p>
              </div>
            </div>
            
            <div className="border-t-2 border-gray-100 pt-6">
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border-2 border-blue-100">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <FiTrendingUp className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="text-sm font-bold text-blue-700">Points Earned:</span>
                    </div>
                    <span className="font-bold text-blue-900 text-lg">+{tournament.points_earned}</span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-2xl border-2 border-purple-100">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <FiUsers className="w-4 h-4 text-purple-600 mr-2" />
                      <span className="text-sm font-bold text-purple-700">Tournament Size:</span>
                    </div>
                    <span className="font-bold text-purple-900">{tournament.tournament_size} players</span>
                  </div>
                </div>
                {tournament.prize_money && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-2xl border-2 border-green-100">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <FiDollarSign className="w-4 h-4 text-green-600 mr-2" />
                        <span className="text-sm font-bold text-green-700">Prize Money:</span>
                      </div>
                      <span className="text-green-700 font-bold text-lg">${tournament.prize_money}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TournamentHistory