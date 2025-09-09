import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { TournamentAdmin } from '../../../types/admin'
import { 
  updateTournamentStatusAction,
  approveTournament,
  rejectTournament,
  cancelTournament
} from '../../../store/slices/adminTournamentsSlice'

interface TournamentStatusModalProps {
  tournament: TournamentAdmin
  onClose: () => void
}

const TournamentStatusModal: React.FC<TournamentStatusModalProps> = ({ tournament, onClose }) => {
  const dispatch = useDispatch()
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
          await dispatch(updateTournamentStatusAction(tournament.id, newStatus, reason) as any)
          break
        case 'approve':
          await dispatch(approveTournament(tournament.id) as any)
          break
        case 'reject':
          if (!reason.trim()) {
            alert('Rejection reason is required')
            setLoading(false)
            return
          }
          await dispatch(rejectTournament(tournament.id, reason) as any)
          break
        case 'cancel':
          if (!reason.trim()) {
            alert('Cancellation reason is required')
            setLoading(false)
            return
          }
          await dispatch(cancelTournament(tournament.id, reason) as any)
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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900">{getActionTitle()}</h3>
          <p className="text-sm text-gray-500 mt-1">Tournament: {tournament.name}</p>
        </div>

        <div className="space-y-6">
          {/* Action Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Action Type
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="action"
                  value="update"
                  checked={action === 'update'}
                  onChange={(e) => setAction(e.target.value as any)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Update Status</span>
              </label>
              
              {tournament.status === 'pending' && (
                <>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="action"
                      value="approve"
                      checked={action === 'approve'}
                      onChange={(e) => setAction(e.target.value as any)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Approve Tournament</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="action"
                      value="reject"
                      checked={action === 'reject'}
                      onChange={(e) => setAction(e.target.value as any)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Reject Tournament</span>
                  </label>
                </>
              )}
              
              {['approved', 'active'].includes(tournament.status) && (
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="action"
                    value="cancel"
                    checked={action === 'cancel'}
                    onChange={(e) => setAction(e.target.value as any)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Cancel Tournament</span>
                </label>
              )}
            </div>
          </div>

          {/* Status Selection (only for update action) */}
          {action === 'update' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Reason (required for reject/cancel, optional for update) */}
          {(action === 'reject' || action === 'cancel' || action === 'update') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {action === 'reject' ? 'Rejection Reason *' : 
                 action === 'cancel' ? 'Cancellation Reason *' : 'Reason (Optional)'}
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder={
                  action === 'reject' ? 'Please provide a reason for rejecting this tournament...' :
                  action === 'cancel' ? 'Please provide a reason for cancelling this tournament...' :
                  'Optional reason for status change...'
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          )}

          {/* Warning for destructive actions */}
          {(action === 'reject' || action === 'cancel') && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Warning</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    {action === 'reject' && 'Rejecting this tournament will notify the organizer and participants. This action cannot be undone.'}
                    {action === 'cancel' && 'Cancelling this tournament will affect all participants and may trigger refund processes.'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 mt-8">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || (action === 'reject' && !reason.trim()) || (action === 'cancel' && !reason.trim())}
            className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 ${actionButton.class}`}
          >
            {loading ? 'Processing...' : actionButton.text}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TournamentStatusModal