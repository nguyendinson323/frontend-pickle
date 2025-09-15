import React from 'react'
import { StateTournament } from '../../../store/slices/stateManagementSlice'

interface TournamentDetailModalProps {
  isOpen: boolean
  onClose: () => void
  tournament: StateTournament | null
}

const TournamentDetailModal: React.FC<TournamentDetailModalProps> = ({
  isOpen,
  onClose,
  tournament
}) => {
  if (!isOpen || !tournament) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800'
      case 'ongoing':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      case 'canceled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-8 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Tournament Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{tournament.name}</h2>
                {tournament.tournament_type && (
                  <p className="text-gray-600">{tournament.tournament_type} Tournament</p>
                )}
              </div>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(tournament.status)}`}>
                {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
              </span>
            </div>

            {/* Tournament Banner */}
            {tournament.banner_url && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Tournament Banner</h4>
                <img
                  src={tournament.banner_url}
                  alt={`${tournament.name} banner`}
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Description */}
            {tournament.description && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-gray-600">{tournament.description}</p>
              </div>
            )}

            {/* Tournament Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Tournament Information</h4>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-500">Organizer</div>
                    <div className="font-medium">{tournament.organizer_type.charAt(0).toUpperCase() + tournament.organizer_type.slice(1)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Tournament Dates</div>
                    <div className="font-medium">{formatDate(tournament.start_date)} - {formatDate(tournament.end_date)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Registration Period</div>
                    <div className="font-medium">{formatDate(tournament.registration_start)} - {formatDate(tournament.registration_end)}</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Tournament Details</h4>
                <div className="space-y-3">
                  {tournament.entry_fee && (
                    <div>
                      <div className="text-sm text-gray-500">Entry Fee</div>
                      <div className="font-medium">${tournament.entry_fee}</div>
                    </div>
                  )}
                  {tournament.max_participants && (
                    <div>
                      <div className="text-sm text-gray-500">Max Participants</div>
                      <div className="font-medium">{tournament.max_participants}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-sm text-gray-500">Current Registrations</div>
                    <div className="font-medium">{tournament.registration_count || 0}</div>
                  </div>
                  {tournament.is_ranking && (
                    <div>
                      <div className="text-sm text-gray-500">Ranking Multiplier</div>
                      <div className="font-medium">×{tournament.ranking_multiplier}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Venue Information */}
            {tournament.venue_name && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Venue Information</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="font-medium">{tournament.venue_name}</div>
                  {tournament.venue_address && (
                    <div className="text-sm text-gray-600 mt-1">{tournament.venue_address}</div>
                  )}
                </div>
              </div>
            )}

            {/* Categories */}
            {tournament.categories && tournament.categories.length > 0 && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Tournament Categories</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tournament.categories.map((category, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="font-medium">{category.name}</div>
                      <div className="text-sm text-gray-600">
                        Gender: {category.gender} • Format: {category.format}
                      </div>
                      {category.registration_count !== undefined && (
                        <div className="text-sm text-gray-500 mt-1">
                          Registrations: {category.registration_count}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Financial Information */}
            {tournament.revenue !== undefined && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Financial Information</h4>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">Total Revenue</div>
                  <div className="text-2xl font-bold text-green-600">${tournament.revenue}</div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TournamentDetailModal