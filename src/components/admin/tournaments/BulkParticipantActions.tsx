import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import { bulkUpdateParticipants } from '../../../store/slices/adminTournamentsSlice'

const BulkParticipantActions: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { selectedParticipants, loading } = useSelector((state: RootState) => state.adminTournaments)
  const [action, setAction] = useState('')
  const [status, setStatus] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

  const actions = [
    { value: 'status', label: 'Update Status' },
    { value: 'check_in', label: 'Check In' },
    { value: 'check_out', label: 'Check Out' },
    { value: 'disqualify', label: 'Disqualify' },
    { value: 'withdraw', label: 'Withdraw' },
    { value: 'assign_seeds', label: 'Assign Seeds' },
    { value: 'send_notification', label: 'Send Notification' }
  ]

  const statusOptions = [
    { value: 'registered', label: 'Registered' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'checked_in', label: 'Checked In' },
    { value: 'disqualified', label: 'Disqualified' },
    { value: 'withdrew', label: 'Withdrew' }
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
    <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Bulk Actions ({selectedParticipants.length} selected)
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Action
          </label>
          <select
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">Select action</option>
            {actions.map((actionOption) => (
              <option key={actionOption.value} value={actionOption.value}>
                {actionOption.label}
              </option>
            ))}
          </select>
        </div>

        {action === 'status' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">Select status</option>
              {statusOptions.map((statusOption) => (
                <option key={statusOption.value} value={statusOption.value}>
                  {statusOption.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-end">
          <button
            onClick={() => setShowConfirm(true)}
            disabled={!action || loading || (action === 'status' && !status)}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Execute'}
          </button>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Confirm Bulk Action</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to <strong>{getActionLabel().toLowerCase()}</strong> for{' '}
                  <strong>{selectedParticipants.length}</strong> selected participants?
                  {action === 'status' && status && (
                    <span> Status will be changed to <strong>{statusOptions.find(s => s.value === status)?.label}</strong>.</span>
                  )}
                </p>
                <p className="text-sm text-gray-500 mt-2">This action cannot be undone.</p>
              </div>
              <div className="flex justify-center space-x-3 mt-4">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover: focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExecute}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Confirm'}
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