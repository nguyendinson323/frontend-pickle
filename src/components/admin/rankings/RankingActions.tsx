import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import { 
  recalculateRankings,
  freezeRankings
} from '../../../store/slices/adminRankingsSlice'

const RankingActions: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { recalculatingRankings } = useSelector((state: RootState) => state.adminRankings)
  
  const [showRecalculateModal, setShowRecalculateModal] = useState(false)
  const [showFreezeModal, setShowFreezeModal] = useState(false)
  const [selectedStateId, setSelectedStateId] = useState('')
  const [freezeReason, setFreezeReason] = useState('')
  const [isCurrentlyFrozen, setIsCurrentlyFrozen] = useState(false) // Mock state

  const handleRecalculate = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to recalculate all rankings? This process may take several minutes.'
    )

    if (confirmed) {
      try {
        await dispatch(recalculateRankings())
        setShowRecalculateModal(false)
        setSelectedStateId('')
        alert('Rankings recalculated successfully!')
      } catch (error) {
        console.error('Failed to recalculate rankings:', error)
      }
    }
  }

  const handleFreeze = async (freeze: boolean) => {
    const action = freeze ? 'freeze' : 'unfreeze'
    const confirmed = window.confirm(`Are you sure you want to ${action} the ranking system?`)

    if (confirmed) {
      try {
        await dispatch(freezeRankings(freeze, freezeReason))
        setIsCurrentlyFrozen(freeze)
        setShowFreezeModal(false)
        setFreezeReason('')
        alert(`Ranking system ${freeze ? 'frozen' : 'unfrozen'} successfully!`)
      } catch (error) {
        console.error(`Failed to ${action} rankings:`, error)
      }
    }
  }

  return (
    <>
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Ranking System Management</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Recalculate Rankings */}
          <button
            onClick={() => setShowRecalculateModal(true)}
            disabled={recalculatingRankings}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-colors text-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="text-2xl mb-2">🔄</div>
            <div className="text-sm font-medium text-gray-900">
              {recalculatingRankings ? 'Recalculating...' : 'Recalculate Rankings'}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Update rankings based on latest tournament results
            </div>
          </button>

          {/* Freeze/Unfreeze Rankings */}
          <button
            onClick={() => setShowFreezeModal(true)}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-colors text-center"
          >
            <div className="text-2xl mb-2">{isCurrentlyFrozen ? '🔓' : '🔒'}</div>
            <div className="text-sm font-medium text-gray-900">
              {isCurrentlyFrozen ? 'Unfreeze Rankings' : 'Freeze Rankings'}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {isCurrentlyFrozen ? 'Allow automatic ranking updates' : 'Prevent automatic ranking changes'}
            </div>
          </button>

          {/* Ranking Analytics */}
          <button
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors text-center"
            onClick={() => alert('Analytics feature coming soon!')}
          >
            <div className="text-2xl mb-2">📊</div>
            <div className="text-sm font-medium text-gray-900">
              View Analytics
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Detailed ranking trends and statistics
            </div>
          </button>

          {/* System Settings */}
          <button
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition-colors text-center"
            onClick={() => alert('Settings feature coming soon!')}
          >
            <div className="text-2xl mb-2">⚙️</div>
            <div className="text-sm font-medium text-gray-900">
              System Settings
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Configure ranking calculation parameters
            </div>
          </button>
        </div>

        {/* System Status */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${isCurrentlyFrozen ? 'bg-orange-500' : 'bg-green-500'}`}></div>
                <span className="text-sm text-gray-700">
                  Ranking System: {isCurrentlyFrozen ? 'Frozen' : 'Active'}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Last Update: 2 hours ago
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Next Scheduled Update: {isCurrentlyFrozen ? 'Paused' : 'In 22 hours'}
            </div>
          </div>
        </div>
      </div>

      {/* Recalculate Modal */}
      {showRecalculateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recalculate Rankings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recalculation Scope
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="scope"
                        value=""
                        checked={selectedStateId === ''}
                        onChange={(e) => setSelectedStateId(e.target.value)}
                        className="mr-2"
                      />
                      All States (Full Recalculation)
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="scope"
                        value="1"
                        checked={selectedStateId === '1'}
                        onChange={(e) => setSelectedStateId(e.target.value)}
                        className="mr-2"
                      />
                      California Only
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="scope"
                        value="2"
                        checked={selectedStateId === '2'}
                        onChange={(e) => setSelectedStateId(e.target.value)}
                        className="mr-2"
                      />
                      Florida Only
                    </label>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.944-.833-2.714 0L3.1 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Warning</h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        This process may take several minutes and will update player rankings based on all tournament results since the last calculation.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setShowRecalculateModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRecalculate}
                  disabled={recalculatingRankings}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {recalculatingRankings ? 'Recalculating...' : 'Start Recalculation'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Freeze Modal */}
      {showFreezeModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {isCurrentlyFrozen ? 'Unfreeze Rankings' : 'Freeze Rankings'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="freezeReason" className="block text-sm font-medium text-gray-700 mb-1">
                    Reason {isCurrentlyFrozen ? '(Optional)' : '(Required)'}
                  </label>
                  <textarea
                    id="freezeReason"
                    value={freezeReason}
                    onChange={(e) => setFreezeReason(e.target.value)}
                    rows={3}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder={
                      isCurrentlyFrozen 
                        ? "Reason for unfreezing rankings..." 
                        : "Reason for freezing rankings (e.g., system maintenance, tournament disputes)..."
                    }
                  />
                </div>

                <div className={`border rounded-lg p-3 ${isCurrentlyFrozen ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'}`}>
                  <div className="text-sm">
                    {isCurrentlyFrozen ? (
                      <div>
                        <strong>Unfreezing will:</strong>
                        <ul className="list-disc list-inside mt-1 text-blue-700">
                          <li>Resume automatic ranking updates</li>
                          <li>Allow tournament results to affect rankings</li>
                          <li>Enable scheduled recalculations</li>
                        </ul>
                      </div>
                    ) : (
                      <div>
                        <strong>Freezing will:</strong>
                        <ul className="list-disc list-inside mt-1 text-orange-700">
                          <li>Stop all automatic ranking updates</li>
                          <li>Prevent tournament results from affecting rankings</li>
                          <li>Pause scheduled recalculations</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setShowFreezeModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleFreeze(!isCurrentlyFrozen)}
                  disabled={!isCurrentlyFrozen && !freezeReason.trim()}
                  className={`px-4 py-2 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    isCurrentlyFrozen 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-orange-600 hover:bg-orange-700'
                  }`}
                >
                  {isCurrentlyFrozen ? 'Unfreeze Rankings' : 'Freeze Rankings'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default RankingActions