import React, { useMemo, useCallback, useState } from 'react'
import { StateTournament } from '../../../store/slices/stateManagementSlice'

interface TournamentsTabProps {
  tournaments: StateTournament[]
  onViewTournament: (tournament: StateTournament) => void
  onEditTournament: (tournament: StateTournament) => void
  onDeleteTournament: (tournamentId: number) => void
  onUpdateStatus: (tournamentId: number, status: string) => void
}

const TournamentsTab: React.FC<TournamentsTabProps> = React.memo(({
  tournaments,
  onViewTournament,
  onEditTournament,
  onDeleteTournament,
  onUpdateStatus
}) => {
  const [changingStatus, setChangingStatus] = useState<number | null>(null)

  // Memoized utility functions to prevent re-creation on each render
  const formatDate = useCallback((dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch (error) {
      console.error('Invalid date string:', dateString)
      return 'Invalid Date'
    }
  }, [])

  const getStatusColor = useCallback((status: string) => {
    switch (status?.toLowerCase()) {
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
  }, [])

  const getOrganizerColor = useCallback((organizerType: string) => {
    switch (organizerType?.toLowerCase()) {
      case 'state':
        return 'bg-purple-100 text-purple-800'
      case 'club':
        return 'bg-blue-100 text-blue-800'
      case 'partner':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }, [])

  const getStatusOptions = useCallback((currentStatus: string) => {
    const statuses = ['upcoming', 'ongoing', 'completed', 'canceled']
    return statuses.filter(status => status !== currentStatus?.toLowerCase())
  }, [])

  // Handle status change with proper state management
  const handleStatusChange = useCallback(async (tournamentId: number, newStatus: string) => {
    setChangingStatus(tournamentId)
    try {
      await onUpdateStatus(tournamentId, newStatus)
    } catch (error) {
      console.error('Failed to update tournament status:', error)
    } finally {
      setChangingStatus(null)
    }
  }, [onUpdateStatus])

  // Safe access to tournament properties
  const formatCurrency = useCallback((amount: number | null | undefined) => {
    return amount ? `$${amount.toLocaleString()}` : '$0'
  }, [])

  // Memoize tournaments list to prevent unnecessary re-renders
  const validTournaments = useMemo(() => {
    return Array.isArray(tournaments) ? tournaments.filter(t => t && t.id) : []
  }, [tournaments])

  return (
    <div className="space-y-4">
      {tournaments.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tournaments</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your first state tournament.</p>
        </div>
      ) : (
        validTournaments.map((tournament) => (
          <div key={tournament.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {tournament.name || 'Unnamed Tournament'}
                  </h3>
                  {tournament.status && (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(tournament.status)}`}>
                      {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                    </span>
                  )}
                  {tournament.organizer_type && (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getOrganizerColor(tournament.organizer_type)}`}>
                      {tournament.organizer_type.charAt(0).toUpperCase() + tournament.organizer_type.slice(1)} Tournament
                    </span>
                  )}
                </div>
                {tournament.tournament_type && (
                  <p className="text-sm text-gray-600">{tournament.tournament_type} Tournament</p>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value) {
                        handleStatusChange(tournament.id, e.target.value)
                        // Reset select value
                        e.target.selectedIndex = 0
                      }
                    }}
                    disabled={changingStatus === tournament.id}
                    className={`text-xs border-gray-300 rounded text-gray-600 bg-white cursor-pointer ${
                      changingStatus === tournament.id ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <option value="">
                      {changingStatus === tournament.id ? 'Updating...' : 'Change Status'}
                    </option>
                    {getStatusOptions(tournament.status).map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {tournament.banner_url && (
              <div className="mb-4">
                <img
                  src={tournament.banner_url}
                  alt={`${tournament.name} banner`}
                  className="w-full h-32 object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            )}

            {tournament.description && (
              <p className="text-gray-600 mb-4">{tournament.description}</p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <div className="text-sm text-gray-500">Tournament Dates</div>
                <div className="font-medium">
                  {tournament.start_date && tournament.end_date
                    ? `${formatDate(tournament.start_date)} - ${formatDate(tournament.end_date)}`
                    : 'Dates not set'
                  }
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Registration</div>
                <div className="font-medium">
                  {tournament.registration_start && tournament.registration_end
                    ? `${formatDate(tournament.registration_start)} - ${formatDate(tournament.registration_end)}`
                    : 'Registration not set'
                  }
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Participants</div>
                <div className="font-medium">{tournament.registration_count || 0}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Revenue</div>
                <div className="font-medium">{formatCurrency(tournament.revenue)}</div>
              </div>
            </div>

            {tournament.venue_name && (
              <div className="mb-4">
                <div className="text-sm text-gray-500">Venue</div>
                <div className="font-medium">{tournament.venue_name}</div>
                {tournament.venue_address && (
                  <div className="text-sm text-gray-600">{tournament.venue_address}</div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {tournament.entry_fee && (
                  <div>
                    <span className="text-sm text-gray-500">Entry Fee: </span>
                    <span className="font-medium">{formatCurrency(tournament.entry_fee)}</span>
                  </div>
                )}
                {tournament.categories && Array.isArray(tournament.categories) && tournament.categories.length > 0 && (
                  <div>
                    <span className="text-sm text-gray-500">Categories: </span>
                    <span className="font-medium">{tournament.categories.length}</span>
                  </div>
                )}
                {tournament.is_ranking && tournament.ranking_multiplier && (
                  <div>
                    <span className="text-sm text-gray-500">Ranking: </span>
                    <span className="font-medium">×{tournament.ranking_multiplier}</span>
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => onViewTournament(tournament)}
                  className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                >
                  View Details
                </button>
                {/* Only show edit/delete for state-organized tournaments */}
                {tournament.organizer_type === 'state' && (
                  <>
                    <button
                      onClick={() => onEditTournament(tournament)}
                      className="text-green-600 hover:text-green-900 text-sm font-medium inline-flex items-center"
                      title="Edit Tournament"
                      disabled={changingStatus === tournament.id}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        const confirmDelete = window.confirm(
                          `Are you sure you want to delete "${tournament.name}"? This action cannot be undone.`
                        )
                        if (confirmDelete) {
                          onDeleteTournament(tournament.id)
                        }
                      }}
                      className="text-red-600 hover:text-red-900 text-sm font-medium inline-flex items-center"
                      title="Delete Tournament"
                      disabled={changingStatus === tournament.id}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
})

export default TournamentsTab