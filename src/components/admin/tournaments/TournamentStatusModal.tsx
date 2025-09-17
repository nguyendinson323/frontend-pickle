import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../store'
import { TournamentAdmin } from '../../../types/admin'
import {
  updateTournamentStatusAction,
  approveTournament,
  rejectTournament,
  cancelTournament
} from '../../../store/slices/adminTournamentsSlice'
import {
  FiSettings,
  FiCheckCircle,
  FiXCircle,
  FiX,
  FiAlertTriangle,
  FiLoader,
  FiEdit
} from 'react-icons/fi'

interface TournamentStatusModalProps {
  tournament: TournamentAdmin
  onClose: () => void
}

const TournamentStatusModal: React.FC<TournamentStatusModalProps> = ({ tournament, onClose }) => {
  const dispatch = useDispatch<AppDispatch>()
  const [action, setAction] = useState<'update' | 'approve' | 'reject' | 'cancel'>('update')
  const [newStatus, setNewStatus] = useState(tournament.status)
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ]

  const handleSubmit = async () => {
    if (!action) return

    setLoading(true)
    try {
      switch (action) {
        case 'update':
          await dispatch(updateTournamentStatusAction(tournament.id, newStatus, reason))
          break
        case 'approve':
          await dispatch(approveTournament(tournament.id))
          break
        case 'reject':
          if (!reason.trim()) {
            alert('Rejection reason is required')
            setLoading(false)
            return
          }
          await dispatch(rejectTournament(tournament.id, reason))
          break
        case 'cancel':
          if (!reason.trim()) {
            alert('Cancellation reason is required')
            setLoading(false)
            return
          }
          await dispatch(cancelTournament(tournament.id, reason))
          break
      }
      onClose()
    } catch (error) {
      console.error('Failed to update tournament status:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActionTitle = () => {
    switch (action) {
      case 'approve': return 'Approve Tournament'
      case 'reject': return 'Reject Tournament'
      case 'cancel': return 'Cancel Tournament'
      default: return 'Update Tournament Status'
    }
  }

  const getActionButton = () => {
    switch (action) {
      case 'approve': return { text: 'Approve', class: 'bg-green-600 hover:bg-green-700' }
      case 'reject': return { text: 'Reject', class: 'bg-red-600 hover:bg-red-700' }
      case 'cancel': return { text: 'Cancel', class: 'bg-red-600 hover:bg-red-700' }
      default: return { text: 'Update', class: 'bg-indigo-600 hover:bg-indigo-700' }
    }
  }

  const actionButton = getActionButton()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div className="relative top-8 mx-auto p-0 w-full max-w-2xl min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="bg-white shadow-2xl rounded-3xl border border-gray-200 overflow-hidden w-full m-4 animate-modal-scale">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-8 py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center text-white mr-4">
                  <FiSettings className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{getActionTitle()}</h3>
                  <p className="text-indigo-100 font-medium">Tournament: {tournament.name}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl flex items-center justify-center text-white transition-all duration-200 hover:scale-105"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-8">

            <div className="space-y-6">
              {/* Action Selection */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white mr-3">
                    <FiEdit className="h-4 w-4" />
                  </div>
                  <label className="text-lg font-bold text-gray-900">
                    Action Type
                  </label>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-indigo-300 cursor-pointer transition-all duration-200 hover:shadow-lg">
                    <input
                      type="radio"
                      name="action"
                      value="update"
                      checked={action === 'update'}
                      onChange={(e) => setAction(e.target.value as any)}
                      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-2 border-gray-300"
                    />
                    <div className="ml-4 flex items-center">
                      <FiSettings className="h-5 w-5 text-indigo-500 mr-2" />
                      <span className="text-lg font-bold text-gray-900">Update Status</span>
                    </div>
                  </label>

                  {tournament.status === 'upcoming' && (
                    <>
                      <label className="flex items-center p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-green-300 cursor-pointer transition-all duration-200 hover:shadow-lg">
                        <input
                          type="radio"
                          name="action"
                          value="approve"
                          checked={action === 'approve'}
                          onChange={(e) => setAction(e.target.value as any)}
                          className="h-5 w-5 text-green-600 focus:ring-green-500 border-2 border-gray-300"
                        />
                        <div className="ml-4 flex items-center">
                          <FiCheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-lg font-bold text-gray-900">Approve Tournament</span>
                        </div>
                      </label>

                      <label className="flex items-center p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-red-300 cursor-pointer transition-all duration-200 hover:shadow-lg">
                        <input
                          type="radio"
                          name="action"
                          value="reject"
                          checked={action === 'reject'}
                          onChange={(e) => setAction(e.target.value as any)}
                          className="h-5 w-5 text-red-600 focus:ring-red-500 border-2 border-gray-300"
                        />
                        <div className="ml-4 flex items-center">
                          <FiXCircle className="h-5 w-5 text-red-500 mr-2" />
                          <span className="text-lg font-bold text-gray-900">Reject Tournament</span>
                        </div>
                      </label>
                    </>
                  )}

                  {['approved', 'active'].includes(tournament.status) && (
                    <label className="flex items-center p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-red-300 cursor-pointer transition-all duration-200 hover:shadow-lg">
                      <input
                        type="radio"
                        name="action"
                        value="cancel"
                        checked={action === 'cancel'}
                        onChange={(e) => setAction(e.target.value as any)}
                        className="h-5 w-5 text-red-600 focus:ring-red-500 border-2 border-gray-300"
                      />
                      <div className="ml-4 flex items-center">
                        <FiX className="h-5 w-5 text-red-500 mr-2" />
                        <span className="text-lg font-bold text-gray-900">Cancel Tournament</span>
                      </div>
                    </label>
                  )}
                </div>
              </div>

              {/* Status Selection (only for update action) */}
              {action === 'update' && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl p-6 border border-blue-200">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center text-white mr-3">
                      <FiSettings className="h-4 w-4" />
                    </div>
                    <label className="text-lg font-bold text-gray-900">
                      New Status
                    </label>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiSettings className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as 'upcoming' | 'ongoing' | 'completed' | 'canceled')}
                      className="w-full pl-12 rounded-2xl border-2 border-gray-300 px-4 py-4 text-lg font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 bg-white hover:border-gray-400"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Reason (required for reject/cancel, optional for update) */}
              {(action === 'reject' || action === 'cancel' || action === 'update') && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-100 rounded-2xl p-6 border border-yellow-200">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center text-white mr-3">
                      <FiEdit className="h-4 w-4" />
                    </div>
                    <label className="text-lg font-bold text-gray-900">
                      {action === 'reject' ? 'Rejection Reason *' :
                       action === 'cancel' ? 'Cancellation Reason *' : 'Reason (Optional)'}
                    </label>
                  </div>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={4}
                    placeholder={
                      action === 'reject' ? 'Please provide a reason for rejecting this tournament...' :
                      action === 'cancel' ? 'Please provide a reason for cancelling this tournament...' :
                      'Optional reason for status change...'
                    }
                    className="w-full rounded-2xl border-2 border-gray-300 px-4 py-4 text-lg font-medium focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 focus:ring-opacity-50 transition-all duration-200 bg-white hover:border-gray-400 resize-none"
                  />
                </div>
              )}

              {/* Warning for destructive actions */}
              {(action === 'reject' || action === 'cancel') && (
                <div className="bg-gradient-to-r from-red-50 to-orange-100 border-2 border-red-200 rounded-2xl p-6 shadow-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white mr-4">
                        <FiAlertTriangle className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-xl font-bold text-red-800 mb-3 flex items-center">
                        <FiAlertTriangle className="h-5 w-5 mr-2" />
                        Warning
                      </h3>
                      <div className="text-lg font-medium text-red-700 bg-white rounded-xl p-4 border border-red-200">
                        {action === 'reject' && 'Rejecting this tournament will notify the organizer and participants. This action cannot be undone.'}
                        {action === 'cancel' && 'Cancelling this tournament will affect all participants and may trigger refund processes.'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4 mt-8 bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-t border-gray-200">
              <button
                onClick={onClose}
                disabled={loading}
                className="inline-flex items-center px-8 py-4 text-lg font-bold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <FiX className="mr-2 h-5 w-5" />
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || (action === 'reject' && !reason.trim()) || (action === 'cancel' && !reason.trim())}
                className={`inline-flex items-center px-8 py-4 text-lg font-bold text-white border-2 border-transparent rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  action === 'approve' ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:ring-green-500' :
                  action === 'reject' || action === 'cancel' ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:ring-red-500' :
                  'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 focus:ring-indigo-500'
                }`}
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin mr-2 h-5 w-5" />
                    Processing...
                  </>
                ) : (
                  <>
                    {action === 'approve' && <FiCheckCircle className="mr-2 h-5 w-5" />}
                    {(action === 'reject' || action === 'cancel') && <FiXCircle className="mr-2 h-5 w-5" />}
                    {action === 'update' && <FiSettings className="mr-2 h-5 w-5" />}
                    {actionButton.text}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TournamentStatusModal