import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import {
  addSelectedParticipant,
  removeSelectedParticipant,
  setSelectedParticipants
} from '../../../store/slices/adminTournamentsSlice'
import ParticipantStatusModal from './ParticipantStatusModal'
import {
  FiUsers,
  FiUser,
  FiCalendar,
  FiCheckCircle,
  FiCreditCard,
  FiTarget,
  FiSettings,
  FiLoader,
  FiUserCheck,
  FiAlertCircle
} from 'react-icons/fi'

const ParticipantsTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { participants, selectedParticipants, loading } = useSelector((state: RootState) => state.adminTournaments)
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null)
  const [showStatusModal, setShowStatusModal] = useState(false)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      dispatch(setSelectedParticipants(participants.map(p => p.id)))
    } else {
      dispatch(setSelectedParticipants([]))
    }
  }

  const handleSelectParticipant = (participantId: number, checked: boolean) => {
    if (checked) {
      dispatch(addSelectedParticipant(participantId))
    } else {
      dispatch(removeSelectedParticipant(participantId))
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      registered: { gradient: 'from-blue-500 to-blue-600', bg: 'from-blue-50 to-blue-100', border: 'border-blue-200', label: 'Registered' },
      confirmed: { gradient: 'from-green-500 to-green-600', bg: 'from-green-50 to-green-100', border: 'border-green-200', label: 'Confirmed' },
      checked_in: { gradient: 'from-purple-500 to-purple-600', bg: 'from-purple-50 to-purple-100', border: 'border-purple-200', label: 'Checked In' },
      disqualified: { gradient: 'from-red-500 to-red-600', bg: 'from-red-50 to-red-100', border: 'border-red-200', label: 'Disqualified' },
      withdrew: { gradient: 'from-gray-500 to-gray-600', bg: 'from-gray-50 to-gray-100', border: 'border-gray-200', label: 'Withdrew' }
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.registered
    return (
      <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-xl bg-gradient-to-r ${config.bg} border ${config.border} text-gray-900 shadow-md`}>
        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${config.gradient} mr-2`}></div>
        {config.label}
      </span>
    )
  }

  const getPaymentBadge = (status: string) => {
    const statusConfig = {
      paid: { gradient: 'from-green-500 to-green-600', bg: 'from-green-50 to-green-100', border: 'border-green-200', label: 'Paid' },
      pending: { gradient: 'from-yellow-500 to-yellow-600', bg: 'from-yellow-50 to-yellow-100', border: 'border-yellow-200', label: 'Pending' },
      refunded: { gradient: 'from-gray-500 to-gray-600', bg: 'from-gray-50 to-gray-100', border: 'border-gray-200', label: 'Refunded' }
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return (
      <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-xl bg-gradient-to-r ${config.bg} border ${config.border} text-gray-900 shadow-md`}>
        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${config.gradient} mr-2`}></div>
        {config.label}
      </span>
    )
  }

  const getUserTypeBadge = (type: string) => {
    const typeConfig = {
      player: { gradient: 'from-blue-500 to-blue-600', bg: 'from-blue-50 to-blue-100', border: 'border-blue-200', label: 'Player' },
      coach: { gradient: 'from-green-500 to-green-600', bg: 'from-green-50 to-green-100', border: 'border-green-200', label: 'Coach' }
    }
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.player
    return (
      <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-xl bg-gradient-to-r ${config.bg} border ${config.border} text-gray-900 shadow-md`}>
        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${config.gradient} mr-2`}></div>
        {config.label}
      </span>
    )
  }

  const handleStatusChange = (participant: any) => {
    setSelectedParticipant(participant)
    setShowStatusModal(true)
  }

  if (loading) {
    return (
      <div className="bg-white shadow-lg rounded-2xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white mr-4">
              <FiLoader className="h-6 w-6 animate-spin" />
            </div>
            <div>
              <div className="h-6 bg-gray-300 rounded-xl w-48 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded-xl w-32 animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="p-8">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="grid grid-cols-8 gap-6 p-4 bg-gray-50 rounded-2xl animate-pulse">
                <div className="h-4 bg-gray-300 rounded-xl"></div>
                <div className="h-4 bg-gray-300 rounded-xl"></div>
                <div className="h-4 bg-gray-300 rounded-xl"></div>
                <div className="h-4 bg-gray-300 rounded-xl"></div>
                <div className="h-4 bg-gray-300 rounded-xl"></div>
                <div className="h-4 bg-gray-300 rounded-xl"></div>
                <div className="h-4 bg-gray-300 rounded-xl"></div>
                <div className="h-4 bg-gray-300 rounded-xl"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const isAllSelected = participants.length > 0 && selectedParticipants.length === participants.length
  const isIndeterminate = selectedParticipants.length > 0 && selectedParticipants.length < participants.length

  return (
    <div className="bg-white shadow-lg rounded-2xl border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white mr-4">
            <FiUsers className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              Tournament Participants ({participants.length})
            </h3>
            <p className="text-gray-600 font-medium">Manage participant registration and status</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left border-b-2 border-gray-200">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = isIndeterminate
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 border-2 border-gray-300 rounded-lg"
                  />
                  <span className="ml-2 text-sm font-bold text-gray-700">Select All</span>
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider border-b-2 border-gray-200">
                <div className="flex items-center">
                  <FiUser className="h-4 w-4 mr-2" />
                  Participant
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider border-b-2 border-gray-200">
                <div className="flex items-center">
                  <FiUserCheck className="h-4 w-4 mr-2" />
                  Type
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider border-b-2 border-gray-200">
                <div className="flex items-center">
                  <FiCalendar className="h-4 w-4 mr-2" />
                  Registration Date
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider border-b-2 border-gray-200">
                <div className="flex items-center">
                  <FiCheckCircle className="h-4 w-4 mr-2" />
                  Status
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider border-b-2 border-gray-200">
                <div className="flex items-center">
                  <FiCreditCard className="h-4 w-4 mr-2" />
                  Payment
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider border-b-2 border-gray-200">
                <div className="flex items-center">
                  <FiTarget className="h-4 w-4 mr-2" />
                  Seed
                </div>
              </th>
              <th className="px-6 py-4 text-right text-sm font-bold text-gray-900 uppercase tracking-wider border-b-2 border-gray-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {participants.map((participant, index) => (
              <tr
                key={participant.id}
                className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="px-6 py-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedParticipants.includes(participant.id)}
                      onChange={(e) => handleSelectParticipant(participant.id, e.target.checked)}
                      className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 border-2 border-gray-300 rounded-lg"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-600">
                      #{index + 1}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white mr-4 flex-shrink-0">
                      <FiUser className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900">{participant.user_name}</div>
                      <div className="text-gray-600 font-medium">ID: {participant.user_id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                  {getUserTypeBadge(participant.user_type)}
                </td>
                <td className="px-6 py-6">
                  <div className="flex items-center text-gray-700">
                    <FiCalendar className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-medium">{new Date(participant.registration_date).toLocaleDateString()}</span>
                  </div>
                </td>
                <td className="px-6 py-6">
                  {getStatusBadge(participant.status)}
                </td>
                <td className="px-6 py-6">
                  <div className="space-y-2">
                    {getPaymentBadge(participant.payment_status)}
                    <div className="flex items-center text-green-700">
                      <FiCreditCard className="h-4 w-4 mr-1" />
                      <span className="font-bold">${participant.amount_paid}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <div className="flex items-center">
                    <FiTarget className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-lg font-bold text-gray-900">
                      {participant.seed || '-'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <button
                    onClick={() => handleStatusChange(participant)}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <FiSettings className="mr-2 h-4 w-4" />
                    Update Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {participants.length === 0 && (
          <div className="text-center py-16 bg-gradient-to-r from-gray-50 to-gray-100 m-8 rounded-2xl border-2 border-gray-200">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-300 to-gray-400 rounded-2xl flex items-center justify-center text-white mb-6">
              <FiAlertCircle className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Participants Found</h3>
            <p className="text-lg text-gray-600 font-medium">
              No participants have registered for tournaments yet.
            </p>
          </div>
        )}
      </div>

      {selectedParticipant && showStatusModal && (
        <ParticipantStatusModal
          participant={selectedParticipant}
          onClose={() => setShowStatusModal(false)}
        />
      )}
    </div>
  )
}

export default ParticipantsTable