import React from 'react'
import { useDispatch } from 'react-redux'
import { TournamentAdmin } from '../../../types/admin'
import { fetchTournamentParticipants } from '../../../store/slices/adminTournamentsSlice'

interface TournamentDetailProps {
  tournament: TournamentAdmin
  onClose: () => void
}

const TournamentDetail: React.FC<TournamentDetailProps> = ({ tournament, onClose }) => {
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(fetchTournamentParticipants(tournament.id) as any)
  }, [dispatch, tournament.id])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
      active: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Active' },
      completed: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Completed' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' }
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return (
      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    )
  }

  const getOrganizerTypeBadge = (type: string) => {
    const typeConfig = {
      club: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Club' },
      partner: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'Partner' },
      state: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'State Committee' }
    }
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.club
    return (
      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    )
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Tournament Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Basic Info */}
          <div className="space-y-6">
            <div className=" rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tournament Name</label>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{tournament.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <div className="mt-1">
                    {getStatusBadge(tournament.status)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1 text-gray-900">{tournament.description || 'No description provided'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                    <p className="mt-1 text-gray-900">{new Date(tournament.start_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">End Date</label>
                    <p className="mt-1 text-gray-900">{new Date(tournament.end_date).toLocaleDateString()}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <p className="mt-1 text-gray-900">{tournament.location}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Venue</label>
                  <p className="mt-1 text-gray-900">{tournament.venue || 'Not specified'}</p>
                </div>
              </div>
            </div>

            {/* Organizer Info */}
            <div className=" rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Organizer Information</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Organizer</label>
                  <p className="mt-1 text-gray-900">{tournament.organizer_name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <div className="mt-1">
                    {getOrganizerTypeBadge(tournament.organizer_type)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Organizer ID</label>
                  <p className="mt-1 text-gray-900">{tournament.organizer_id}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Tournament Stats */}
          <div className="space-y-6">
            <div className=" rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Tournament Statistics</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{tournament.current_participants}</div>
                  <div className="text-sm text-gray-600">Current Participants</div>
                </div>
                
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{tournament.max_participants}</div>
                  <div className="text-sm text-gray-600">Max Participants</div>
                </div>
                
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">${tournament.entry_fee}</div>
                  <div className="text-sm text-gray-600">Entry Fee</div>
                </div>
                
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">${tournament.prize_pool || 0}</div>
                  <div className="text-sm text-gray-600">Prize Pool</div>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className=" rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Registration Deadline</label>
                  <p className="mt-1 text-gray-900">
                    {tournament.registration_deadline ? 
                      new Date(tournament.registration_deadline).toLocaleDateString() : 
                      'Not specified'
                    }
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Tournament Format</label>
                  <p className="mt-1 text-gray-900">{tournament.tournament_format || 'Not specified'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Skill Level</label>
                  <p className="mt-1 text-gray-900">{tournament.skill_level || 'All levels'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Created Date</label>
                  <p className="mt-1 text-gray-900">{new Date(tournament.created_at).toLocaleDateString()}</p>
                </div>

                {tournament.rejection_reason && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rejection Reason</label>
                    <p className="mt-1 text-red-600">{tournament.rejection_reason}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover: focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default TournamentDetail