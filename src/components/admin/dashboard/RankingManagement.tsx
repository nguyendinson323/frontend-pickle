import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'

interface RankingAdjustment {
  player_id: number
  old_rank: number
  new_rank: number
  reason: string
  category_id: number
}

const RankingManagement: React.FC = () => {
  const { rankings, rankingCategories, rankingPeriods, loading } = useSelector((state: RootState) => state.admin)
  const [activeTab, setActiveTab] = useState<'overview' | 'adjustments' | 'categories' | 'periods'>('overview')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedPeriod, setSelectedPeriod] = useState<string>('')
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false)
  const [adjustmentForm, setAdjustmentForm] = useState<RankingAdjustment>({
    player_id: 0,
    old_rank: 0,
    new_rank: 0,
    reason: '',
    category_id: 0
  })

  if (loading) {
    return <div className="p-4">Loading ranking data...</div>
  }

  const filteredRankings = (rankings || []).filter(ranking => {
    if (selectedCategory && ranking.category_id !== parseInt(selectedCategory)) return false
    if (selectedPeriod && ranking.period_id !== parseInt(selectedPeriod)) return false
    return true
  })

  const rankingStats = {
    totalPlayers: (rankings || []).length,
    rankedPlayers: (rankings || []).filter(r => r.current_rank !== null).length,
    unrankedPlayers: (rankings || []).filter(r => r.current_rank === null).length,
    movementUp: (rankings || []).filter(r => r.previous_rank && r.current_rank && r.current_rank < r.previous_rank).length,
    movementDown: (rankings || []).filter(r => r.previous_rank && r.current_rank && r.current_rank > r.previous_rank).length,
    noMovement: (rankings || []).filter(r => r.previous_rank === r.current_rank).length
  }

  const handleRankingAdjustment = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement ranking adjustment
    console.log('Adjusting ranking:', adjustmentForm)
    setShowAdjustmentModal(false)
    setAdjustmentForm({
      player_id: 0,
      old_rank: 0,
      new_rank: 0,
      reason: '',
      category_id: 0
    })
  }

  const handleRecalculateRankings = () => {
    // TODO: Implement ranking recalculation
    console.log('Recalculating rankings...')
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Ranking Management</h2>
          <p className="text-gray-600">Manage player rankings and control the ranking system</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleRecalculateRankings}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <span>🔄</span>
            <span>Recalculate</span>
          </button>
          <button 
            onClick={() => setShowAdjustmentModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <span>⚖️</span>
            <span>Adjust Ranking</span>
          </button>
        </div>
      </div>

      {/* Ranking Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-2xl text-blue-600">👥</div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{rankingStats.totalPlayers}</div>
              <div className="text-sm text-gray-600">Total Players</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-2xl text-green-600">🏆</div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-green-900">{rankingStats.rankedPlayers}</div>
              <div className="text-sm text-green-700">Ranked</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-2xl text-gray-600">❓</div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{rankingStats.unrankedPlayers}</div>
              <div className="text-sm text-gray-700">Unranked</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-2xl text-green-600">⬆️</div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-green-900">{rankingStats.movementUp}</div>
              <div className="text-sm text-green-700">Moved Up</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-2xl text-red-600">⬇️</div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-red-900">{rankingStats.movementDown}</div>
              <div className="text-sm text-red-700">Moved Down</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-2xl text-yellow-600">➡️</div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-yellow-900">{rankingStats.noMovement}</div>
              <div className="text-sm text-yellow-700">No Change</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Rankings Overview', icon: '📊' },
              { id: 'adjustments', name: 'Manual Adjustments', icon: '⚖️' },
              { id: 'categories', name: 'Categories', icon: '🏷️' },
              { id: 'periods', name: 'Periods', icon: '📅' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Filters */}
        <div className="p-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {(rankingCategories || []).map(category => (
                  <option key={category.id} value={category.id.toString()}>
                    {category.name} ({category.gender}, {category.age_group})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Periods</option>
                {(rankingPeriods || []).map(period => (
                  <option key={period.id} value={period.id.toString()}>
                    {period.name} ({new Date(period.start_date).toLocaleDateString()} - {new Date(period.end_date).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSelectedCategory('')
                  setSelectedPeriod('')
                }}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
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
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Points
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tournaments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Movement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRankings && filteredRankings.length > 0 ? filteredRankings
                .sort((a, b) => (a.current_rank || 999999) - (b.current_rank || 999999))
                .map((ranking) => (
                <tr key={ranking.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-lg font-bold text-gray-900">
                      #{ranking.current_rank || 'NR'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {ranking.player?.full_name || 'Unknown Player'}
                    </div>
                    <div className="text-sm text-gray-500">
                      NRTP: {ranking.player?.nrtp_level || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {ranking.category?.name || 'Unknown Category'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {ranking.category?.gender || 'N/A'}, {ranking.category?.age_group || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{ranking.points}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{ranking.tournaments_played}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {ranking.previous_rank && ranking.current_rank ? (
                      <div className="flex items-center">
                        {ranking.current_rank < ranking.previous_rank ? (
                          <span className="text-green-600 flex items-center">
                            ⬆️ +{ranking.previous_rank - ranking.current_rank}
                          </span>
                        ) : ranking.current_rank > ranking.previous_rank ? (
                          <span className="text-red-600 flex items-center">
                            ⬇️ -{ranking.current_rank - ranking.previous_rank}
                          </span>
                        ) : (
                          <span className="text-gray-500">➡️ No change</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-500">New</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                      View History
                    </button>
                    <button 
                      onClick={() => {
                        setAdjustmentForm({
                          ...adjustmentForm,
                          player_id: ranking.player_id,
                          old_rank: ranking.current_rank || 0,
                          category_id: ranking.category_id
                        })
                        setShowAdjustmentModal(true)
                      }}
                      className="text-yellow-600 hover:text-yellow-900"
                    >
                      Adjust
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No rankings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Adjustment Modal */}
      {showAdjustmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Manual Ranking Adjustment</h3>
                <button
                  onClick={() => setShowAdjustmentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>

              <form onSubmit={handleRankingAdjustment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Rank
                  </label>
                  <input
                    type="number"
                    value={adjustmentForm.old_rank}
                    readOnly
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Rank
                  </label>
                  <input
                    type="number"
                    value={adjustmentForm.new_rank}
                    onChange={(e) => setAdjustmentForm({...adjustmentForm, new_rank: parseInt(e.target.value)})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter new rank..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for Adjustment
                  </label>
                  <textarea
                    value={adjustmentForm.reason}
                    onChange={(e) => setAdjustmentForm({...adjustmentForm, reason: e.target.value})}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Explain the reason for this adjustment..."
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowAdjustmentModal(false)}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Apply Adjustment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RankingManagement