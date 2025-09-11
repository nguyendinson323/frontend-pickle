import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import { 
  manualRankingAdjustment,
  getPlayerRankingHistory
} from '../../../store/slices/adminRankingsSlice'

interface RankingsTableProps {
  onPlayerSelect: (playerId: number) => void
}

const RankingsTable: React.FC<RankingsTableProps> = ({ onPlayerSelect }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { playerRankings } = useSelector((state: RootState) => state.adminRankings)
  const { isLoading: loading } = useSelector((state: RootState) => state.loading)
  
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null)
  const [adjustmentForm, setAdjustmentForm] = useState({
    newPosition: '',
    newPoints: '',
    reason: ''
  })

  const handleAdjustRanking = (player: any) => {
    setSelectedPlayer(player)
    setAdjustmentForm({
      newPosition: player.current_position.toString(),
      newPoints: player.current_points.toString(),
      reason: ''
    })
    setShowAdjustmentModal(true)
  }

  const handleSaveAdjustment = async () => {
    if (!selectedPlayer || !adjustmentForm.newPosition || !adjustmentForm.newPoints || !adjustmentForm.reason) {
      alert('All fields are required')
      return
    }

    try {
      await dispatch(manualRankingAdjustment(
        selectedPlayer.player_id,
        parseInt(adjustmentForm.newPoints),
        parseInt(adjustmentForm.newPosition),
        adjustmentForm.reason
      ))
      
      setShowAdjustmentModal(false)
      setSelectedPlayer(null)
      alert('Ranking adjusted successfully')
    } catch (error) {
      console.error('Failed to adjust ranking:', error)
    }
  }

  const handleViewHistory = async (playerId: number) => {
    try {
      await dispatch(getPlayerRankingHistory(playerId))
      onPlayerSelect(playerId)
    } catch (error) {
      console.error('Failed to fetch player history:', error)
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈'
      case 'down': return '📉'
      case 'stable': return '➡️'
      case 'new': return '🆕'
      default: return '➡️'
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

  const getChangeDisplay = (change: number) => {
    if (change > 0) return `+${change}`
    if (change < 0) return change.toString()
    return '0'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Player Rankings</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Player
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Points
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Change
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  State
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tournaments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {playerRankings.map((player) => (
                <tr key={player.player_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-lg font-bold text-gray-900">
                        #{player.current_position}
                      </div>
                      {player.current_position !== player.previous_position && (
                        <div className="ml-2 text-xs text-gray-500">
                          (was #{player.previous_position})
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {player.player_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="font-semibold">{player.current_points} pts</div>
                      {player.current_points !== player.previous_points && (
                        <div className="text-xs text-gray-500">
                          (was {player.previous_points} pts)
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center text-sm ${getTrendColor(player.trend)}`}>
                      <span className="mr-1">{getTrendIcon(player.trend)}</span>
                      <span className="font-medium">
                        {getChangeDisplay(player.change)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {player.state_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {player.tournaments_played}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(player.last_updated).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleViewHistory(player.player_id)}
                      className="text-indigo-600 hover:text-indigo-900 transition-colors"
                    >
                      History
                    </button>
                    <button
                      onClick={() => handleAdjustRanking(player)}
                      className="text-orange-600 hover:text-orange-900 transition-colors"
                    >
                      Adjust
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {playerRankings.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">No player rankings found.</p>
          </div>
        )}
      </div>

      {/* Adjustment Modal */}
      {showAdjustmentModal && selectedPlayer && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Adjust Ranking for {selectedPlayer.player_name}
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Position
                    </label>
                    <div className="text-sm text-gray-600 p-2 bg-gray-100 rounded">
                      #{selectedPlayer.current_position}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Points
                    </label>
                    <div className="text-sm text-gray-600 p-2 bg-gray-100 rounded">
                      {selectedPlayer.current_points} pts
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="newPosition" className="block text-sm font-medium text-gray-700 mb-1">
                      New Position
                    </label>
                    <input
                      type="number"
                      id="newPosition"
                      value={adjustmentForm.newPosition}
                      onChange={(e) => setAdjustmentForm({ ...adjustmentForm, newPosition: e.target.value })}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      min="1"
                    />
                  </div>
                  <div>
                    <label htmlFor="newPoints" className="block text-sm font-medium text-gray-700 mb-1">
                      New Points
                    </label>
                    <input
                      type="number"
                      id="newPoints"
                      value={adjustmentForm.newPoints}
                      onChange={(e) => setAdjustmentForm({ ...adjustmentForm, newPoints: e.target.value })}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for Adjustment
                  </label>
                  <textarea
                    id="reason"
                    value={adjustmentForm.reason}
                    onChange={(e) => setAdjustmentForm({ ...adjustmentForm, reason: e.target.value })}
                    rows={3}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder="Explain why this adjustment is being made..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setShowAdjustmentModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAdjustment}
                  className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
                >
                  Adjust Ranking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default RankingsTable