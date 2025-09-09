import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { updateParticipantStatusAction } from '../../../store/slices/adminTournamentsSlice'

interface ParticipantStatusModalProps {
  participant: any
  onClose: () => void
}

const ParticipantStatusModal: React.FC<ParticipantStatusModalProps> = ({ participant, onClose }) => {
  const dispatch = useDispatch()
  const [newStatus, setNewStatus] = useState(participant.status)
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  const statusOptions = [
    { value: 'registered', label: 'Registered', description: 'Initial registration status' },
    { value: 'confirmed', label: 'Confirmed', description: 'Registration confirmed by participant' },
    { value: 'checked_in', label: 'Checked In', description: 'Participant has checked in at venue' },
    { value: 'disqualified', label: 'Disqualified', description: 'Participant has been disqualified' },
    { value: 'withdrew', label: 'Withdrew', description: 'Participant has withdrawn from tournament' }
  ]

  const handleSubmit = async () => {
    if (newStatus === participant.status && !reason.trim()) {
      onClose()
      return
    }

    setLoading(true)
    try {
      await dispatch(updateParticipantStatusAction(participant.id, newStatus, reason) as any)
      onClose()
    } catch (error) {
      console.error('Failed to update participant status:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectedStatus = statusOptions.find(option => option.value === newStatus)
  const isStatusChange = newStatus !== participant.status
  const isDestructiveChange = ['disqualified', 'withdrew'].includes(newStatus) && !['disqualified', 'withdrew'].includes(participant.status)

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900">Update Participant Status</h3>
          <p className="text-sm text-gray-500 mt-1">Participant: {participant.user_name}</p>
          <p className="text-sm text-gray-500">Current Status: 
            <span className="ml-1 font-medium">{statusOptions.find(s => s.value === participant.status)?.label}</span>
          </p>
        </div>

        <div className="space-y-6">
          {/* Status Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Status
            </label>
            <div className="space-y-3">
              {statusOptions.map((option) => (
                <label key={option.value} className="flex items-start">
                  <input
                    type="radio"
                    name="status"
                    value={option.value}
                    checked={newStatus === option.value}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 mt-0.5"
                  />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-700">{option.label}</div>
                    <div className="text-xs text-gray-500">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Status Description */}
          {selectedStatus && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h4 className="text-sm font-medium text-blue-800">Status: {selectedStatus.label}</h4>
              <p className="text-sm text-blue-700 mt-1">{selectedStatus.description}</p>
            </div>
          )}

          {/* Reason Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isDestructiveChange ? 'Reason for Status Change *' : 'Reason (Optional)'}
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder={
                isDestructiveChange 
                  ? 'Please provide a reason for this status change...'
                  : 'Optional reason for status change...'
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {isDestructiveChange && (
              <p className="text-xs text-red-600 mt-1">Required for disqualification or withdrawal</p>
            )}
          </div>

          {/* Warning for destructive actions */}
          {isDestructiveChange && (
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
                    {newStatus === 'disqualified' && 'Disqualifying this participant will remove them from the tournament and may trigger a refund process.'}
                    {newStatus === 'withdrew' && 'Marking as withdrawn will remove them from the tournament and may trigger a refund process.'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Participant Info */}
          <div className=" rounded-md p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Participant Details</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <div>Registration Date: {new Date(participant.registration_date).toLocaleDateString()}</div>
              <div>Payment Status: {participant.payment_status}</div>
              <div>Amount Paid: ${participant.amount_paid}</div>
              {participant.seed && <div>Seed: {participant.seed}</div>}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-8">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover: focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || (isDestructiveChange && !reason.trim())}
            className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 ${
              isDestructiveChange ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? 'Updating...' : 'Update Status'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ParticipantStatusModal