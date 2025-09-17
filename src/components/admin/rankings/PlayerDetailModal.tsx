import React from 'react'
import {
  FiUser,
  FiTarget,
  FiMapPin,
  FiCalendar,
  FiTrendingUp,
  FiTrendingDown,
  FiMinus,
  FiStar,
  FiX,
  FiLoader,
  FiClock,
  FiTag,
  FiActivity,
  FiFileText,
  FiAward
} from 'react-icons/fi'

interface PlayerRanking {
  id: number
  player_id: number
  player_name: string
  username: string
  current_position: number
  previous_position: number
  current_points: number
  previous_points: number
  change: number
  state_id: number
  state_name: string
  tournaments_played: number
  last_updated: string
  trend: 'up' | 'down' | 'stable' | 'new'
  nrtp_level: string
  category: string
  period: string
}

interface PlayerHistory {
  id: number
  points: number
  reason: string
  tournament_name: string
  date: string
}

interface PlayerDetailModalProps {
  isOpen: boolean
  onClose: () => void
  selectedPlayer: PlayerRanking | null
  playerHistory: PlayerHistory[]
  loadingHistory: boolean
}

const PlayerDetailModal: React.FC<PlayerDetailModalProps> = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerHistory,
  loadingHistory
}) => {
  if (!isOpen || !selectedPlayer) {
    return null
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return FiTrendingUp
      case 'down': return FiTrendingDown
      case 'stable': return FiMinus
      case 'new': return FiStar
      default: return FiMinus
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600'
      case 'down': return 'text-red-600'
      case 'stable': return 'text-gray-600'
      case 'new': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-5xl bg-white shadow-2xl rounded-3xl border border-gray-100 max-h-[95vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-6 rounded-t-3xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                <FiUser className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-3xl font-bold">
                  {selectedPlayer.player_name}
                </h3>
                <p className="text-indigo-100 font-medium">@{selectedPlayer.username}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-12 h-12 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl flex items-center justify-center transition-all duration-200 transform hover:scale-105"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-8 space-y-8">

          {/* Player Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center border-2 border-blue-200 shadow-lg transform hover:scale-105 transition-all duration-200">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white mx-auto mb-3 shadow-lg">
                <FiAward className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">#{selectedPlayer.current_position}</div>
              <div className="text-sm font-bold text-blue-800">Current Rank</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 text-center border-2 border-green-200 shadow-lg transform hover:scale-105 transition-all duration-200">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white mx-auto mb-3 shadow-lg">
                <FiTarget className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">{selectedPlayer.current_points}</div>
              <div className="text-sm font-bold text-green-800">Points</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 text-center border-2 border-purple-200 shadow-lg transform hover:scale-105 transition-all duration-200">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white mx-auto mb-3 shadow-lg">
                <FiActivity className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-2">{selectedPlayer.tournaments_played}</div>
              <div className="text-sm font-bold text-purple-800">Tournaments</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 text-center border-2 border-orange-200 shadow-lg transform hover:scale-105 transition-all duration-200">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white mx-auto mb-3 shadow-lg">
                <FiAward className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold text-orange-600 mb-2">{selectedPlayer.nrtp_level}</div>
              <div className="text-sm font-bold text-orange-800">NRTP Level</div>
            </div>
          </div>

          {/* Player Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl p-6 border-2 border-blue-200 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white mr-3">
                  <FiUser className="h-5 w-5" />
                </div>
                <h4 className="text-xl font-bold text-gray-900">Player Information</h4>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-md border border-blue-200">
                  <div className="flex items-center space-x-2">
                    <FiMapPin className="h-4 w-4 text-blue-600" />
                    <span className="font-bold text-gray-900">State:</span>
                  </div>
                  <span className="font-bold text-blue-600">{selectedPlayer.state_name}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-md border border-blue-200">
                  <div className="flex items-center space-x-2">
                    <FiTag className="h-4 w-4 text-blue-600" />
                    <span className="font-bold text-gray-900">Category:</span>
                  </div>
                  <span className="font-bold text-blue-600">{selectedPlayer.category}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-md border border-blue-200">
                  <div className="flex items-center space-x-2">
                    <FiClock className="h-4 w-4 text-blue-600" />
                    <span className="font-bold text-gray-900">Period:</span>
                  </div>
                  <span className="font-bold text-blue-600">{selectedPlayer.period}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-md border border-blue-200">
                  <div className="flex items-center space-x-2">
                    <FiCalendar className="h-4 w-4 text-blue-600" />
                    <span className="font-bold text-gray-900">Last Updated:</span>
                  </div>
                  <span className="font-bold text-blue-600">
                    {new Date(selectedPlayer.last_updated).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-100 rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white mr-3">
                  <FiActivity className="h-5 w-5" />
                </div>
                <h4 className="text-xl font-bold text-gray-900">Ranking Changes</h4>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-md border border-purple-200">
                  <div className="flex items-center space-x-2">
                    <FiAward className="h-4 w-4 text-purple-600" />
                    <span className="font-bold text-gray-900">Previous Rank:</span>
                  </div>
                  <span className="font-bold text-purple-600">
                    {selectedPlayer.previous_position ? `#${selectedPlayer.previous_position}` : 'New Player'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-md border border-purple-200">
                  <div className="flex items-center space-x-2">
                    <FiTarget className="h-4 w-4 text-purple-600" />
                    <span className="font-bold text-gray-900">Position Change:</span>
                  </div>
                  <div className={`flex items-center space-x-1 font-bold ${getTrendColor(selectedPlayer.trend)}`}>
                    {(() => {
                      const TrendIcon = getTrendIcon(selectedPlayer.trend)
                      return <TrendIcon className="h-4 w-4" />
                    })()}
                    <span>
                      {selectedPlayer.change > 0 ? `+${selectedPlayer.change}` : selectedPlayer.change}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-md border border-purple-200">
                  <div className="flex items-center space-x-2">
                    <FiActivity className="h-4 w-4 text-purple-600" />
                    <span className="font-bold text-gray-900">Trend:</span>
                  </div>
                  <span className={`font-bold capitalize ${getTrendColor(selectedPlayer.trend)}`}>
                    {selectedPlayer.trend}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Player History */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center text-white mr-3">
                <FiFileText className="h-5 w-5" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">Points History</h4>
            </div>
            {loadingHistory ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <FiLoader className="animate-spin h-8 w-8 text-indigo-600 mx-auto mb-3" />
                  <span className="text-lg font-bold text-gray-600">Loading history...</span>
                </div>
              </div>
            ) : playerHistory.length > 0 ? (
              <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200 max-h-80 overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">Points</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">Tournament</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">Reason</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {playerHistory.map((entry, index) => (
                      <tr key={index} className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <FiCalendar className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-bold text-gray-900">
                              {new Date(entry.date).toLocaleDateString()}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <FiTarget className="h-4 w-4 text-gray-500" />
                            <span className={`text-sm font-bold ${
                              entry.points > 0 ? 'text-green-600' : entry.points < 0 ? 'text-red-600' : 'text-gray-600'
                            }`}>
                              {entry.points > 0 ? '+' : ''}{entry.points}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-2">
                            <FiAward className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-bold text-gray-900">{entry.tournament_name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-2">
                            <FiFileText className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-600">{entry.reason}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
                  <FiFileText className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No History Found</h3>
                <p className="text-lg text-gray-600 font-medium">
                  No ranking history found for this player.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-t-2 border-gray-200 rounded-b-3xl">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <FiX className="mr-2 h-4 w-4" />
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerDetailModal