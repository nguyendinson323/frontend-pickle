import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import {
  manualRankingAdjustment,
  getPlayerRankingHistory
} from '../../../store/slices/adminRankingsSlice'
import {
  FiAward,
  FiLoader,
  FiUser,
  FiTarget,
  FiTrendingUp,
  FiTrendingDown,
  FiMinus,
  FiStar,
  FiMapPin,
  FiCalendar,
  FiEye,
  FiSettings,
  FiX,
  FiSave,
  FiEdit3
} from 'react-icons/fi'

interface RankingsTableProps {
  onPlayerSelect: (playerId: number) => void
  selectedPlayerId?: number | null
}

const RankingsTable: React.FC<RankingsTableProps> = ({ onPlayerSelect, selectedPlayerId }) => {
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
      case 'up': return FiTrendingUp
      case 'down': return FiTrendingDown
      case 'stable': return FiMinus
      case 'new': return FiStar
      default: return FiMinus
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600 bg-gradient-to-r from-green-100 to-green-200 border-green-300'
      case 'down': return 'text-red-600 bg-gradient-to-r from-red-100 to-red-200 border-red-300'
      case 'stable': return 'text-gray-600 bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300'
      case 'new': return 'text-blue-600 bg-gradient-to-r from-blue-100 to-blue-200 border-blue-300'
      default: return 'text-gray-600 bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300'
    }
  }

  const getChangeDisplay = (change: number) => {
    if (change > 0) return `+${change}`
    if (change < 0) return change.toString()
    return '0'
  }

  if (loading) {
    return (
      <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <FiAward className="mr-2 h-5 w-5" />
            Player Rankings
          </h3>
        </div>
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <FiLoader className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-700">Loading player rankings...</p>
            <p className="text-sm text-gray-500 mt-2">Please wait while we fetch the latest data</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white mr-3">
              <FiAward className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Player Rankings</h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Player
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Points
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Change
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                  State
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Tournaments
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {playerRankings.map((player, index) => (
                <tr
                  key={`player-${player.player_id}-${player.current_position}-${index}`}
                  className={`hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200 ${
                    selectedPlayerId === player.player_id
                      ? 'bg-gradient-to-r from-indigo-50 to-purple-100 border-l-4 border-indigo-500 shadow-lg'
                      : ''
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-lg ${
                        player.current_position <= 3
                          ? player.current_position === 1 ? 'bg-gradient-to-br from-yellow-500 to-yellow-600'
                          : player.current_position === 2 ? 'bg-gradient-to-br from-gray-400 to-gray-500'
                          : 'bg-gradient-to-br from-orange-500 to-orange-600'
                          : 'bg-gradient-to-br from-blue-500 to-blue-600'
                      }`}>
                        #{player.current_position}
                      </div>
                      <div>
                        <div className="text-xl font-bold text-gray-900">
                          Rank #{player.current_position}
                        </div>
                        {player.current_position !== player.previous_position && (
                          <div className="text-sm text-gray-500 font-medium">
                            (was #{player.previous_position})
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <button
                      onClick={() => handleViewHistory(player.player_id)}
                      className="text-left hover:bg-gray-50 rounded-xl p-3 transition-all duration-200 transform hover:scale-105 w-full"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                          <FiUser className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-indigo-600 hover:text-indigo-800">
                            {player.player_name}
                          </div>
                          <div className="text-sm text-gray-500 font-medium">
                            Click to view details
                          </div>
                        </div>
                      </div>
                    </button>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white">
                        <FiTarget className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900">{player.current_points} pts</div>
                        {player.current_points !== player.previous_points && (
                          <div className="text-sm text-gray-500 font-medium">
                            (was {player.previous_points} pts)
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    {(() => {
                      const TrendIcon = getTrendIcon(player.trend)
                      return (
                        <div className={`inline-flex items-center px-3 py-2 rounded-xl text-sm font-bold shadow-lg border-2 ${getTrendColor(player.trend)}`}>
                          <TrendIcon className="mr-2 h-4 w-4" />
                          <span>
                            {getChangeDisplay(player.change)}
                          </span>
                        </div>
                      )
                    })()}
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center text-white">
                        <FiMapPin className="h-4 w-4" />
                      </div>
                      <span className="text-lg font-bold text-gray-900">{player.state_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-white">
                        <FiAward className="h-4 w-4" />
                      </div>
                      <span className="text-lg font-bold text-gray-900">{player.tournaments_played}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center text-white">
                        <FiCalendar className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {new Date(player.last_updated).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleViewHistory(player.player_id)}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <FiEye className="mr-1 h-4 w-4" />
                        History
                      </button>
                      <button
                        onClick={() => handleAdjustRanking(player)}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-600 hover:to-red-700 transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <FiSettings className="mr-1 h-4 w-4" />
                        Adjust
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {playerRankings.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg">
              <FiAward className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No player rankings found</h3>
            <p className="text-lg text-gray-600 font-medium">
              No player rankings match your current filter criteria.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Try adjusting your filters or check back later for updated rankings.
            </p>
          </div>
        )}
      </div>

      {/* Adjustment Modal */}
      {showAdjustmentModal && selectedPlayer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white shadow-2xl rounded-3xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-6 rounded-t-3xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <FiEdit3 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Adjust Ranking</h3>
                    <p className="text-orange-100 font-medium">for {selectedPlayer.player_name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAdjustmentModal(false)}
                  className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl flex items-center justify-center transition-all duration-200 transform hover:scale-105"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-8">
              
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl p-6 border-2 border-blue-200 shadow-lg">
                  <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <FiAward className="mr-2 h-5 w-5" />
                    Current Rankings
                  </h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl p-4 shadow-md border border-blue-200">
                      <label className="block text-sm font-bold text-blue-600 mb-2">
                        Current Position
                      </label>
                      <div className="text-2xl font-bold text-gray-900">
                        #{selectedPlayer.current_position}
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-md border border-blue-200">
                      <label className="block text-sm font-bold text-blue-600 mb-2">
                        Current Points
                      </label>
                      <div className="text-2xl font-bold text-gray-900">
                        {selectedPlayer.current_points} pts
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-2xl p-6 border-2 border-green-200 shadow-lg">
                  <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <FiTarget className="mr-2 h-5 w-5" />
                    New Rankings
                  </h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="relative">
                      <label htmlFor="newPosition" className="block text-sm font-bold text-green-600 mb-3">
                        New Position
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiAward className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="number"
                          id="newPosition"
                          value={adjustmentForm.newPosition}
                          onChange={(e) => setAdjustmentForm({ ...adjustmentForm, newPosition: e.target.value })}
                          className="w-full pl-10 border-2 border-gray-300 rounded-2xl shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:ring-opacity-50 transition-all duration-200 px-4 py-3 text-lg font-bold bg-white hover:border-gray-400"
                          min="1"
                        />
                      </div>
                    </div>
                    <div className="relative">
                      <label htmlFor="newPoints" className="block text-sm font-bold text-green-600 mb-3">
                        New Points
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiTarget className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="number"
                          id="newPoints"
                          value={adjustmentForm.newPoints}
                          onChange={(e) => setAdjustmentForm({ ...adjustmentForm, newPoints: e.target.value })}
                          className="w-full pl-10 border-2 border-gray-300 rounded-2xl shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:ring-opacity-50 transition-all duration-200 px-4 py-3 text-lg font-bold bg-white hover:border-gray-400"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-100 rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
                  <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <FiEdit3 className="mr-2 h-5 w-5" />
                    Reason for Adjustment
                  </h4>
                  <textarea
                    id="reason"
                    value={adjustmentForm.reason}
                    onChange={(e) => setAdjustmentForm({ ...adjustmentForm, reason: e.target.value })}
                    rows={4}
                    className="w-full border-2 border-gray-300 rounded-2xl shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200 px-4 py-3 text-lg font-medium bg-white hover:border-gray-400 resize-none"
                    placeholder="Explain why this adjustment is being made..."
                  />
                </div>
              </div>

            </div>

            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-t-2 border-gray-200 rounded-b-3xl">
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => setShowAdjustmentModal(false)}
                  className="inline-flex items-center justify-center px-8 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <FiX className="mr-2 h-4 w-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSaveAdjustment}
                  className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <FiSave className="mr-2 h-4 w-4" />
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