import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../store'
import { 
  addSelectedParticipant,
  removeSelectedParticipant,
  setSelectedParticipants,
  updateParticipantStatusAction
} from '../../../store/slices/adminTournamentsSlice'
import ParticipantStatusModal from './ParticipantStatusModal'

const ParticipantsTable: React.FC = () => {
  const dispatch = useDispatch()
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
      registered: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Registered' },
      confirmed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Confirmed' },
      checked_in: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Checked In' },
      disqualified: { bg: 'bg-red-100', text: 'text-red-800', label: 'Disqualified' },
      withdrew: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Withdrew' }
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.registered
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    )
  }

  const getPaymentBadge = (status: string) => {
    const statusConfig = {
      paid: { bg: 'bg-green-100', text: 'text-green-800', label: 'Paid' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      refunded: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Refunded' }
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    )
  }

  const getUserTypeBadge = (type: string) => {
    const typeConfig = {
      player: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Player' },
      coach: { bg: 'bg-green-100', text: 'text-green-800', label: 'Coach' }
    }
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.player
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
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
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="grid grid-cols-8 gap-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
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
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          Tournament Participants ({participants.length})
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isIndeterminate
                  }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Participant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registration Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Seed
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {participants.map((participant) => (
              <tr key={participant.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedParticipants.includes(participant.id)}
                    onChange={(e) => handleSelectParticipant(participant.id, e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{participant.user_name}</div>
                  <div className="text-sm text-gray-500">ID: {participant.user_id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getUserTypeBadge(participant.user_type)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(participant.registration_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(participant.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>{getPaymentBadge(participant.payment_status)}</div>
                  <div className="text-sm text-gray-500">${participant.amount_paid}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {participant.seed || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleStatusChange(participant)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Update Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {participants.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No participants found</h3>
            <p className="mt-1 text-sm text-gray-500">No participants registered for this tournament yet.</p>
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