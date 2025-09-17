import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { updateParticipantStatusAction } from '../../../store/slices/adminTournamentsSlice'
import {
  FiUser,
  FiSettings,
  FiCheckCircle,
  FiXCircle,
  FiX,
  FiAlertTriangle,
  FiLoader,
  FiInfo,
  FiCalendar,
  FiCreditCard,
  FiTarget,
  FiEdit
} from 'react-icons/fi'

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
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div className="relative top-8 mx-auto p-0 w-full max-w-3xl min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="bg-white shadow-2xl rounded-3xl border border-gray-200 overflow-hidden w-full m-4 animate-modal-scale">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center text-white mr-4">
                  <FiUser className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Update Participant Status</h3>
                  <p className="text-blue-100 font-medium">Participant: {participant.user_name}</p>
                  <p className="text-blue-100 font-medium">Current Status:
                    <span className="ml-1 font-bold">{statusOptions.find(s => s.value === participant.status)?.label}</span>
                  </p>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Status Selection */}
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white mr-3">
                      <FiSettings className="h-4 w-4" />
                    </div>
                    <label className="text-lg font-bold text-gray-900">
                      New Status
                    </label>
                  </div>
                  <div className="space-y-3">
                    {statusOptions.map((option) => (
                      <label key={option.value} className="flex items-start p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-300 cursor-pointer transition-all duration-200 hover:shadow-lg">
                        <input
                          type="radio"
                          name="status"
                          value={option.value}
                          checked={newStatus === option.value}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-2 border-gray-300 mt-0.5"
                        />
                        <div className="ml-4">
                          <div className="text-lg font-bold text-gray-900 flex items-center">
                            {option.value === 'registered' && <FiUser className="h-4 w-4 mr-2 text-blue-500" />}
                            {option.value === 'confirmed' && <FiCheckCircle className="h-4 w-4 mr-2 text-green-500" />}
                            {option.value === 'checked_in' && <FiCheckCircle className="h-4 w-4 mr-2 text-indigo-500" />}
                            {option.value === 'disqualified' && <FiXCircle className="h-4 w-4 mr-2 text-red-500" />}
                            {option.value === 'withdrew' && <FiX className="h-4 w-4 mr-2 text-gray-500" />}
                            {option.label}
                          </div>
                          <div className="text-sm text-gray-600 font-medium">{option.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Status Description */}
                {selectedStatus && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-100 border-2 border-blue-200 rounded-2xl p-6">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white mr-3">
                        <FiInfo className="h-4 w-4" />
                      </div>
                      <h4 className="text-lg font-bold text-blue-800">Status: {selectedStatus.label}</h4>
                    </div>
                    <p className="text-blue-700 font-medium bg-white rounded-xl p-4 border border-blue-200">{selectedStatus.description}</p>
                  </div>
                )}
              </div>

              {/* Right Column - Reason and Info */}
              <div className="space-y-6">
                {/* Reason Input */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-100 rounded-2xl p-6 border border-yellow-200">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center text-white mr-3">
                      <FiEdit className="h-4 w-4" />
                    </div>
                    <label className="text-lg font-bold text-gray-900">
                      {isDestructiveChange ? 'Reason for Status Change *' : 'Reason (Optional)'}
                    </label>
                  </div>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={4}
                    placeholder={
                      isDestructiveChange
                        ? 'Please provide a reason for this status change...'
                        : 'Optional reason for status change...'
                    }
                    className="w-full rounded-2xl border-2 border-gray-300 px-4 py-4 text-lg font-medium focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 focus:ring-opacity-50 transition-all duration-200 bg-white hover:border-gray-400 resize-none"
                  />
                  {isDestructiveChange && (
                    <p className="text-sm text-red-600 mt-3 font-bold bg-white rounded-xl p-3 border border-red-200">Required for disqualification or withdrawal</p>
                  )}
                </div>

                {/* Warning for destructive actions */}
                {isDestructiveChange && (
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
                          {newStatus === 'disqualified' && 'Disqualifying this participant will remove them from the tournament and may trigger a refund process.'}
                          {newStatus === 'withdrew' && 'Marking as withdrawn will remove them from the tournament and may trigger a refund process.'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Participant Info */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-100 rounded-2xl p-6 border border-purple-200">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white mr-3">
                      <FiUser className="h-4 w-4" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">Participant Details</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-white rounded-xl border border-gray-200">
                      <FiCalendar className="h-5 w-5 text-purple-500 mr-3" />
                      <div>
                        <span className="text-sm font-bold text-gray-700">Registration Date:</span>
                        <span className="ml-2 text-sm font-medium text-gray-900">{new Date(participant.registration_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-white rounded-xl border border-gray-200">
                      <FiCreditCard className="h-5 w-5 text-purple-500 mr-3" />
                      <div>
                        <span className="text-sm font-bold text-gray-700">Payment Status:</span>
                        <span className="ml-2 text-sm font-medium text-gray-900">{participant.payment_status}</span>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-white rounded-xl border border-gray-200">
                      <FiCreditCard className="h-5 w-5 text-purple-500 mr-3" />
                      <div>
                        <span className="text-sm font-bold text-gray-700">Amount Paid:</span>
                        <span className="ml-2 text-sm font-medium text-gray-900">${participant.amount_paid}</span>
                      </div>
                    </div>
                    {participant.seed && (
                      <div className="flex items-center p-3 bg-white rounded-xl border border-gray-200">
                        <FiTarget className="h-5 w-5 text-purple-500 mr-3" />
                        <div>
                          <span className="text-sm font-bold text-gray-700">Seed:</span>
                          <span className="ml-2 text-sm font-medium text-gray-900">{participant.seed}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
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
                disabled={loading || (isDestructiveChange && !reason.trim())}
                className={`inline-flex items-center px-8 py-4 text-lg font-bold text-white border-2 border-transparent rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isDestructiveChange ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:ring-red-500' : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 focus:ring-indigo-500'
                }`}
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin mr-2 h-5 w-5" />
                    Updating...
                  </>
                ) : (
                  <>
                    <FiCheckCircle className="mr-2 h-5 w-5" />
                    Update Status
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

export default ParticipantStatusModal