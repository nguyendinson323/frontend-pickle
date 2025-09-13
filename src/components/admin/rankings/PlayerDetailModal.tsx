import React from 'react'

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

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Modal Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {selectedPlayer.player_name}
              </h3>
              <p className="text-sm text-gray-600">@{selectedPlayer.username}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Player Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">#{selectedPlayer.current_position}</div>
              <div className="text-sm text-blue-800">Current Rank</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{selectedPlayer.current_points}</div>
              <div className="text-sm text-green-800">Points</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{selectedPlayer.tournaments_played}</div>
              <div className="text-sm text-purple-800">Tournaments</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{selectedPlayer.nrtp_level}</div>
              <div className="text-sm text-orange-800">NRTP Level</div>
            </div>
          </div>

          {/* Player Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Player Information</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">State:</span>
                  <span className="font-medium">{selectedPlayer.state_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{selectedPlayer.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Period:</span>
                  <span className="font-medium">{selectedPlayer.period}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-medium">
                    {new Date(selectedPlayer.last_updated).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Ranking Changes</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Previous Rank:</span>
                  <span className="font-medium">
                    {selectedPlayer.previous_position ? `#${selectedPlayer.previous_position}` : 'New Player'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Position Change:</span>
                  <span className={`font-medium flex items-center ${
                    selectedPlayer.trend === 'up' ? 'text-green-600' :
                    selectedPlayer.trend === 'down' ? 'text-red-600' :
                    selectedPlayer.trend === 'new' ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    {selectedPlayer.trend === 'up' && '⬆️ '}
                    {selectedPlayer.trend === 'down' && '⬇️ '}
                    {selectedPlayer.trend === 'new' && '🆕 '}
                    {selectedPlayer.trend === 'stable' && '➡️ '}
                    {selectedPlayer.change > 0 ? `+${selectedPlayer.change}` : selectedPlayer.change}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trend:</span>
                  <span className="font-medium capitalize">{selectedPlayer.trend}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Player History */}
          <div className="border-t pt-6">
            <h4 className="font-semibold text-gray-900 mb-4">Points History</h4>
            {loadingHistory ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                <span className="ml-2 text-gray-600">Loading history...</span>
              </div>
            ) : playerHistory.length > 0 ? (
              <div className="max-h-64 overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Points</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tournament</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {playerHistory.map((entry, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {new Date(entry.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          <span className={`font-medium ${
                            entry.points > 0 ? 'text-green-600' : entry.points < 0 ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {entry.points > 0 ? '+' : ''}{entry.points}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">{entry.tournament_name}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{entry.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No ranking history found for this player.
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerDetailModal