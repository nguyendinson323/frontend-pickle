import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import { bulkUpdateParticipants } from '../../../store/slices/adminTournamentsSlice'
import {
  FiUsers,
  FiSettings,
  FiCheckCircle,
  FiXCircle,
  FiUserX,
  FiLogOut,
  FiTarget,
  FiBell,
  FiAlertTriangle,
  FiPlay,
  FiX,
  FiLoader
} from 'react-icons/fi'

const BulkParticipantActions: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { selectedParticipants, loading } = useSelector((state: RootState) => state.adminTournaments)
  const [action, setAction] = useState('')
  const [status, setStatus] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

  const actions = [
    { value: 'status', label: 'Update Status', icon: FiSettings },
    { value: 'check_in', label: 'Check In', icon: FiCheckCircle },
    { value: 'check_out', label: 'Check Out', icon: FiXCircle },
    { value: 'disqualify', label: 'Disqualify', icon: FiUserX },
    { value: 'withdraw', label: 'Withdraw', icon: FiLogOut },
    { value: 'assign_seeds', label: 'Assign Seeds', icon: FiTarget },
    { value: 'send_notification', label: 'Send Notification', icon: FiBell }
  ]

  const statusOptions = [
    { value: 'registered', label: 'Registered', color: 'text-blue-600' },
    { value: 'confirmed', label: 'Confirmed', color: 'text-green-600' },
    { value: 'checked_in', label: 'Checked In', color: 'text-indigo-600' },
    { value: 'disqualified', label: 'Disqualified', color: 'text-red-600' },
    { value: 'withdrew', label: 'Withdrew', color: 'text-gray-600' }
  ]

  const handleExecute = async () => {
    if (!action || selectedParticipants.length === 0) return

    try {
      const data = action === 'status' ? { status } : undefined
      await dispatch(bulkUpdateParticipants(selectedParticipants, action, data))
      setShowConfirm(false)
      setAction('')
      setStatus('')
    } catch (error) {
      console.error('Failed to execute bulk action:', error)
    }
  }

  const getActionLabel = () => {
    const actionObj = actions.find(a => a.value === action)
    return actionObj ? actionObj.label : ''
  }

  if (selectedParticipants.length === 0) {
    return null
  }

  return (
    <div className="bg-white shadow-lg rounded-2xl border border-gray-200 p-8 mb-8">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white mr-4">
          <FiUsers className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">
            Bulk Actions ({selectedParticipants.length} selected)
          </h3>
          <p className="text-gray-600 font-medium">Perform actions on multiple participants simultaneously</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-lg font-bold text-gray-900 mb-3">
            Select Action
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSettings className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-full pl-10 rounded-2xl border-2 border-gray-300 px-4 py-3 text-lg font-medium focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:ring-opacity-50 transition-all duration-200 bg-white hover:border-gray-400"
            >
              <option value="">Choose an action</option>
              {actions.map((actionOption) => (
                <option key={actionOption.value} value={actionOption.value}>
                  {actionOption.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {action === 'status' && (
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-3">
              New Status
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCheckCircle className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full pl-10 rounded-2xl border-2 border-gray-300 px-4 py-3 text-lg font-medium focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:ring-opacity-50 transition-all duration-200 bg-white hover:border-gray-400"
              >
                <option value="">Select new status</option>
                {statusOptions.map((statusOption) => (
                  <option key={statusOption.value} value={statusOption.value}>
                    {statusOption.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="flex items-end">
          <button
            onClick={() => setShowConfirm(true)}
            disabled={!action || loading || (action === 'status' && !status)}
            className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin mr-2 h-5 w-5" />
                Processing...
              </>
            ) : (
              <>
                <FiPlay className="mr-2 h-5 w-5" />
                Execute Action
              </>
            )}
          </button>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white shadow-2xl rounded-3xl border-2 border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center text-white mr-3">
                    <FiAlertTriangle className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Confirm Bulk Action</h3>
                </div>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg flex items-center justify-center text-white transition-all duration-200"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-100 to-orange-200 rounded-2xl flex items-center justify-center mb-4">
                  <FiAlertTriangle className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="bg-gradient-to-r from-yellow-50 to-orange-100 rounded-2xl p-4 border-2 border-yellow-200">
                  <p className="text-lg text-gray-900 font-medium">
                    Are you sure you want to <strong className="text-orange-700">{getActionLabel().toLowerCase()}</strong> for{' '}
                    <strong className="text-orange-700">{selectedParticipants.length}</strong> selected participants?
                  </p>
                  {action === 'status' && status && (
                    <p className="text-gray-700 font-medium mt-2">
                      Status will be changed to <strong className="text-orange-700">{statusOptions.find(s => s.value === status)?.label}</strong>
                    </p>
                  )}
                  <p className="text-red-600 font-bold text-sm mt-3 flex items-center justify-center">
                    <FiAlertTriangle className="h-4 w-4 mr-1" />
                    This action cannot be undone
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <FiX className="mr-2 h-4 w-4" />
                  Cancel
                </button>
                <button
                  onClick={handleExecute}
                  disabled={loading}
                  className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                >
                  {loading ? (
                    <>
                      <FiLoader className="animate-spin mr-2 h-4 w-4" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiCheckCircle className="mr-2 h-4 w-4" />
                      Confirm
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BulkParticipantActions