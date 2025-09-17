import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import {
  recalculateRankings,
  freezeRankings
} from '../../../store/slices/adminRankingsSlice'
import {
  FiRefreshCw,
  FiLock,
  FiUnlock,
  FiBarChart2,
  FiSettings,
  FiActivity,
  FiClock,
  FiAlertTriangle,
  FiPlay,
  FiPause,
  FiX,
  FiSave,
  FiCheckCircle,
  FiRadio,
  FiLoader
} from 'react-icons/fi'

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
      <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white mr-3">
              <FiSettings className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Ranking System Management</h3>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Recalculate Rankings */}
            <button
              onClick={() => setShowRecalculateModal(true)}
              disabled={recalculatingRankings}
              className="relative bg-gradient-to-br from-indigo-50 to-indigo-100 border-2 border-indigo-200 rounded-2xl p-6 text-center hover:from-indigo-100 hover:to-indigo-200 hover:border-indigo-300 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:transform-none"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
                {recalculatingRankings ? (
                  <FiLoader className="h-8 w-8 animate-spin" />
                ) : (
                  <FiRefreshCw className="h-8 w-8" />
                )}
              </div>
              <div className="text-lg font-bold text-gray-900 mb-2">
                {recalculatingRankings ? 'Recalculating...' : 'Recalculate Rankings'}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Update rankings based on latest tournament results
              </div>
            </button>

            {/* Freeze/Unfreeze Rankings */}
            <button
              onClick={() => setShowFreezeModal(true)}
              className="relative bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-2xl p-6 text-center hover:from-orange-100 hover:to-orange-200 hover:border-orange-300 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
                {isCurrentlyFrozen ? (
                  <FiUnlock className="h-8 w-8" />
                ) : (
                  <FiLock className="h-8 w-8" />
                )}
              </div>
              <div className="text-lg font-bold text-gray-900 mb-2">
                {isCurrentlyFrozen ? 'Unfreeze Rankings' : 'Freeze Rankings'}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {isCurrentlyFrozen ? 'Allow automatic ranking updates' : 'Prevent automatic ranking changes'}
              </div>
            </button>

            {/* Ranking Analytics */}
            <button
              className="relative bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-2xl p-6 text-center hover:from-purple-100 hover:to-purple-200 hover:border-purple-300 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              onClick={() => alert('Analytics feature coming soon!')}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
                <FiBarChart2 className="h-8 w-8" />
              </div>
              <div className="text-lg font-bold text-gray-900 mb-2">
                View Analytics
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Detailed ranking trends and statistics
              </div>
            </button>

            {/* System Settings */}
            <button
              className="relative bg-gradient-to-br from-teal-50 to-teal-100 border-2 border-teal-200 rounded-2xl p-6 text-center hover:from-teal-100 hover:to-teal-200 hover:border-teal-300 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              onClick={() => alert('Settings feature coming soon!')}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
                <FiSettings className="h-8 w-8" />
              </div>
              <div className="text-lg font-bold text-gray-900 mb-2">
                System Settings
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Configure ranking calculation parameters
              </div>
            </button>
          </div>

          {/* System Status */}
          <div className="mt-8 pt-8 border-t-2 border-gray-200">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center text-white mr-3">
                  <FiActivity className="h-4 w-4" />
                </div>
                <h4 className="text-xl font-bold text-gray-900">System Status</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${isCurrentlyFrozen ? 'bg-orange-500' : 'bg-green-500'} shadow-lg`}></div>
                      <span className="text-sm font-bold text-gray-900">
                        Ranking System
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isCurrentlyFrozen ? (
                        <FiPause className="h-4 w-4 text-orange-600" />
                      ) : (
                        <FiPlay className="h-4 w-4 text-green-600" />
                      )}
                      <span className={`px-3 py-1 rounded-xl font-bold text-sm border-2 ${
                        isCurrentlyFrozen
                          ? 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-300'
                          : 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300'
                      }`}>
                        {isCurrentlyFrozen ? 'Frozen' : 'Active'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FiClock className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-bold text-gray-900">
                        Last Update
                      </span>
                    </div>
                    <span className="text-sm font-bold text-blue-600">
                      2 hours ago
                    </span>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FiCheckCircle className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-bold text-gray-900">
                        Next Update
                      </span>
                    </div>
                    <span className="text-sm font-bold text-purple-600">
                      {isCurrentlyFrozen ? 'Paused' : 'In 22 hours'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recalculate Modal */}
      {showRecalculateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white shadow-2xl rounded-3xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-6 rounded-t-3xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <FiRefreshCw className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Recalculate Rankings</h3>
                    <p className="text-indigo-100 font-medium">Update player rankings system-wide</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowRecalculateModal(false)}
                  className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl flex items-center justify-center transition-all duration-200 transform hover:scale-105"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-8 space-y-8">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl p-6 border-2 border-blue-200 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white mr-3">
                    <FiSettings className="h-4 w-4" />
                  </div>
                  <label className="text-lg font-bold text-gray-900">
                    Recalculation Scope
                  </label>
                </div>
                <div className="space-y-4">
                  <label className="flex items-center p-4 bg-white rounded-xl shadow-md border border-blue-200 hover:bg-blue-50 transition-all duration-200 cursor-pointer">
                    <div className="relative">
                      <input
                        type="radio"
                        name="scope"
                        value=""
                        checked={selectedStateId === ''}
                        onChange={(e) => setSelectedStateId(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedStateId === '' ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                      }`}>
                        {selectedStateId === '' && (
                          <FiRadio className="h-3 w-3 text-white" />
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-lg font-bold text-gray-900">All States (Full Recalculation)</div>
                      <div className="text-sm text-gray-600 font-medium">Recalculate all player rankings nationwide</div>
                    </div>
                  </label>
                  <label className="flex items-center p-4 bg-white rounded-xl shadow-md border border-blue-200 hover:bg-blue-50 transition-all duration-200 cursor-pointer">
                    <div className="relative">
                      <input
                        type="radio"
                        name="scope"
                        value="1"
                        checked={selectedStateId === '1'}
                        onChange={(e) => setSelectedStateId(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedStateId === '1' ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                      }`}>
                        {selectedStateId === '1' && (
                          <FiRadio className="h-3 w-3 text-white" />
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-lg font-bold text-gray-900">California Only</div>
                      <div className="text-sm text-gray-600 font-medium">Recalculate California player rankings only</div>
                    </div>
                  </label>
                  <label className="flex items-center p-4 bg-white rounded-xl shadow-md border border-blue-200 hover:bg-blue-50 transition-all duration-200 cursor-pointer">
                    <div className="relative">
                      <input
                        type="radio"
                        name="scope"
                        value="2"
                        checked={selectedStateId === '2'}
                        onChange={(e) => setSelectedStateId(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedStateId === '2' ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                      }`}>
                        {selectedStateId === '2' && (
                          <FiRadio className="h-3 w-3 text-white" />
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-lg font-bold text-gray-900">Florida Only</div>
                      <div className="text-sm text-gray-600 font-medium">Recalculate Florida player rankings only</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-orange-100 rounded-2xl p-6 border-2 border-yellow-200 shadow-lg">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                    <FiAlertTriangle className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-yellow-800 mb-3">
                      Warning
                    </h3>
                    <div className="bg-white rounded-xl p-4 shadow-md border border-yellow-200">
                      <p className="text-yellow-700 font-medium leading-relaxed">
                        This process may take several minutes and will update player rankings based on all tournament results since the last calculation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-t-2 border-gray-200 rounded-b-3xl">
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => setShowRecalculateModal(false)}
                  className="inline-flex items-center justify-center px-8 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <FiX className="mr-2 h-4 w-4" />
                  Cancel
                </button>
                <button
                  onClick={handleRecalculate}
                  disabled={recalculatingRankings}
                  className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                >
                  {recalculatingRankings ? (
                    <>
                      <FiLoader className="animate-spin mr-2 h-4 w-4" />
                      Recalculating...
                    </>
                  ) : (
                    <>
                      <FiRefreshCw className="mr-2 h-4 w-4" />
                      Start Recalculation
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Freeze Modal */}
      {showFreezeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white shadow-2xl rounded-3xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className={`text-white px-8 py-6 rounded-t-3xl ${
              isCurrentlyFrozen
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600'
                : 'bg-gradient-to-r from-orange-600 to-red-600'
            }`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    {isCurrentlyFrozen ? (
                      <FiUnlock className="h-6 w-6" />
                    ) : (
                      <FiLock className="h-6 w-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">
                      {isCurrentlyFrozen ? 'Unfreeze Rankings' : 'Freeze Rankings'}
                    </h3>
                    <p className={`font-medium ${
                      isCurrentlyFrozen ? 'text-blue-100' : 'text-orange-100'
                    }`}>
                      {isCurrentlyFrozen ? 'Resume automatic ranking updates' : 'Pause ranking system operations'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowFreezeModal(false)}
                  className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl flex items-center justify-center transition-all duration-200 transform hover:scale-105"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-8 space-y-8">
              <div className={`rounded-2xl p-6 border-2 shadow-lg ${
                isCurrentlyFrozen
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-100 border-blue-200'
                  : 'bg-gradient-to-r from-orange-50 to-red-100 border-orange-200'
              }`}>
                <div className="flex items-center mb-4">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white mr-3 ${
                    isCurrentlyFrozen
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                      : 'bg-gradient-to-br from-orange-500 to-orange-600'
                  }`}>
                    <FiSettings className="h-4 w-4" />
                  </div>
                  <label htmlFor="freezeReason" className="text-lg font-bold text-gray-900">
                    Reason {isCurrentlyFrozen ? '(Optional)' : '(Required)'}
                  </label>
                </div>
                <textarea
                  id="freezeReason"
                  value={freezeReason}
                  onChange={(e) => setFreezeReason(e.target.value)}
                  rows={4}
                  className="w-full border-2 border-gray-300 rounded-2xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 px-4 py-3 text-lg font-medium bg-white hover:border-gray-400 resize-none"
                  placeholder={
                    isCurrentlyFrozen
                      ? "Reason for unfreezing rankings..."
                      : "Reason for freezing rankings (e.g., system maintenance, tournament disputes)..."
                  }
                />
              </div>

              <div className={`rounded-2xl p-6 border-2 shadow-lg ${
                isCurrentlyFrozen
                  ? 'bg-gradient-to-r from-green-50 to-emerald-100 border-green-200'
                  : 'bg-gradient-to-r from-yellow-50 to-orange-100 border-yellow-200'
              }`}>
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0 ${
                    isCurrentlyFrozen
                      ? 'bg-gradient-to-br from-green-500 to-green-600'
                      : 'bg-gradient-to-br from-yellow-500 to-yellow-600'
                  }`}>
                    <FiAlertTriangle className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-xl font-bold mb-3 ${
                      isCurrentlyFrozen ? 'text-green-800' : 'text-yellow-800'
                    }`}>
                      {isCurrentlyFrozen ? 'Unfreezing will:' : 'Freezing will:'}
                    </h3>
                    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
                      <ul className={`list-disc list-inside space-y-2 font-medium ${
                        isCurrentlyFrozen ? 'text-green-700' : 'text-yellow-700'
                      }`}>
                        {isCurrentlyFrozen ? (
                          <>
                            <li>Resume automatic ranking updates</li>
                            <li>Allow tournament results to affect rankings</li>
                            <li>Enable scheduled recalculations</li>
                          </>
                        ) : (
                          <>
                            <li>Stop all automatic ranking updates</li>
                            <li>Prevent tournament results from affecting rankings</li>
                            <li>Pause scheduled recalculations</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-t-2 border-gray-200 rounded-b-3xl">
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => setShowFreezeModal(false)}
                  className="inline-flex items-center justify-center px-8 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <FiX className="mr-2 h-4 w-4" />
                  Cancel
                </button>
                <button
                  onClick={() => handleFreeze(!isCurrentlyFrozen)}
                  disabled={!isCurrentlyFrozen && !freezeReason.trim()}
                  className={`inline-flex items-center justify-center px-8 py-3 text-white rounded-xl transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                    isCurrentlyFrozen
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                      : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700'
                  }`}
                >
                  {isCurrentlyFrozen ? (
                    <>
                      <FiUnlock className="mr-2 h-4 w-4" />
                      Unfreeze Rankings
                    </>
                  ) : (
                    <>
                      <FiLock className="mr-2 h-4 w-4" />
                      Freeze Rankings
                    </>
                  )}
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