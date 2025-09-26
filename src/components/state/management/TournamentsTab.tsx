import React, { useMemo, useCallback, useState } from 'react'
import { StateTournament } from '../../../store/slices/stateManagementSlice'
import { FiAward, FiEye, FiEdit3, FiTrash2, FiCalendar, FiMapPin, FiUsers, FiDollarSign } from 'react-icons/fi'

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
        <div className="text-center py-16">
          <div className="bg-gradient-to-br from-blue-100 to-indigo-200 p-8 rounded-full mx-auto w-24 h-24 flex items-center justify-center shadow-lg">
            <FiAward className="w-12 h-12 text-blue-600" />
          </div>
          <h3 className="mt-6 text-xl font-bold text-gray-900">No tournaments</h3>
          <p className="mt-3 text-gray-600 max-w-sm mx-auto leading-relaxed">Get started by creating your first state tournament to engage your community.</p>
        </div>
      ) : (
        validTournaments.map((tournament) => (
          <div key={tournament.id} className="border border-gray-200/50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm transform hover:scale-[1.02] shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-3">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {tournament.name || 'Unnamed Tournament'}
                  </h3>
                  {tournament.status && (
                    <span className={`inline-flex px-3 py-2 text-sm font-bold rounded-xl shadow-sm ${getStatusColor(tournament.status)}`}>
                      {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                    </span>
                  )}
                  {tournament.organizer_type && (
                    <span className={`inline-flex px-3 py-2 text-sm font-bold rounded-xl shadow-sm ${getOrganizerColor(tournament.organizer_type)}`}>
                      {tournament.organizer_type.charAt(0).toUpperCase() + tournament.organizer_type.slice(1)} Tournament
                    </span>
                  )}
                </div>
                {tournament.tournament_type && (
                  <p className="text-gray-600 font-medium">{tournament.tournament_type} Tournament</p>
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
              <div className="mb-6">
                <img
                  src={tournament.banner_url}
                  alt={`${tournament.name} banner`}
                  className="w-full h-40 object-cover rounded-xl shadow-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            )}

            {tournament.description && (
              <p className="text-gray-700 mb-6 leading-relaxed">{tournament.description}</p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-blue-50 p-4 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <FiCalendar className="w-4 h-4 text-blue-600" />
                  <div className="text-sm text-blue-700 font-semibold">Tournament Dates</div>
                </div>
                <div className="font-bold text-gray-900">
                  {tournament.start_date && tournament.end_date
                    ? `${formatDate(tournament.start_date)} - ${formatDate(tournament.end_date)}`
                    : 'Dates not set'
                  }
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <FiCalendar className="w-4 h-4 text-green-600" />
                  <div className="text-sm text-green-700 font-semibold">Registration</div>
                </div>
                <div className="font-bold text-gray-900">
                  {tournament.registration_start && tournament.registration_end
                    ? `${formatDate(tournament.registration_start)} - ${formatDate(tournament.registration_end)}`
                    : 'Registration not set'
                  }
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <FiUsers className="w-4 h-4 text-purple-600" />
                  <div className="text-sm text-purple-700 font-semibold">Participants</div>
                </div>
                <div className="font-bold text-gray-900">{tournament.registration_count || 0}</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <FiDollarSign className="w-4 h-4 text-orange-600" />
                  <div className="text-sm text-orange-700 font-semibold">Revenue</div>
                </div>
                <div className="font-bold text-gray-900">{formatCurrency(tournament.revenue)}</div>
              </div>
            </div>

            {tournament.venue_name && (
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <FiMapPin className="w-4 h-4 text-gray-600" />
                  <div className="text-sm text-gray-600 font-semibold">Venue</div>
                </div>
                <div className="font-bold text-gray-900">{tournament.venue_name}</div>
                {tournament.venue_address && (
                  <div className="text-gray-700 mt-1">{tournament.venue_address}</div>
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

              <div className="flex space-x-3">
                <button
                  onClick={() => onViewTournament(tournament)}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-200 hover:scale-105"
                >
                  <FiEye className="w-4 h-4" />
                  <span>View Details</span>
                </button>
                {/* Only show edit/delete for state-organized tournaments */}
                {tournament.organizer_type === 'state' && (
                  <>
                    <button
                      onClick={() => onEditTournament(tournament)}
                      className="bg-green-100 hover:bg-green-200 text-green-700 p-2 rounded-xl transition-all duration-200 hover:scale-110 shadow-sm"
                      title="Edit Tournament"
                      disabled={changingStatus === tournament.id}
                    >
                      <FiEdit3 className="w-4 h-4" />
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
                      className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-xl transition-all duration-200 hover:scale-110 shadow-sm"
                      title="Delete Tournament"
                      disabled={changingStatus === tournament.id}
                    >
                      <FiTrash2 className="w-4 h-4" />
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