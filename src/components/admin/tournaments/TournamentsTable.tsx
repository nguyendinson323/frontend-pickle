import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../store'
import { TournamentAdmin } from '../../../types/admin'
import { exportTournaments } from '../../../store/slices/adminTournamentsSlice'
import TournamentStatusModal from './TournamentStatusModal'
import TournamentReportModal from './TournamentReportModal'
import TournamentNotificationModal from './TournamentNotificationModal'

interface TournamentsTableProps {
  onTournamentSelect: (tournament: TournamentAdmin) => void
}

const TournamentsTable: React.FC<TournamentsTableProps> = ({ onTournamentSelect }) => {
  const dispatch = useDispatch()
  const { tournaments, tournamentFilter, loading } = useSelector((state: RootState) => state.adminTournaments)
  const [selectedTournament, setSelectedTournament] = useState<TournamentAdmin | null>(null)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [showNotificationModal, setShowNotificationModal] = useState(false)

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
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    )
  }

  const getOrganizerTypeBadge = (type: string) => {
    const typeConfig = {
      club: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Club' },
      partner: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'Partner' },
      state: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'State' }
    }
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.club
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    )
  }

  const handleExport = async (format: 'csv' | 'excel' | 'pdf') => {
    dispatch(exportTournaments(tournamentFilter, format) as any)
  }

  const handleStatusChange = (tournament: TournamentAdmin) => {
    setSelectedTournament(tournament)
    setShowStatusModal(true)
  }

  const handleGenerateReport = (tournament: TournamentAdmin) => {
    setSelectedTournament(tournament)
    setShowReportModal(true)
  }

  const handleSendNotification = (tournament: TournamentAdmin) => {
    setSelectedTournament(tournament)
    setShowNotificationModal(true)
  }

  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="grid grid-cols-7 gap-4">
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

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Tournaments ({tournaments.length})
          </h3>
          <div className="flex space-x-3">
            <div className="relative inline-block text-left">
              <select
                onChange={(e) => handleExport(e.target.value as 'csv' | 'excel' | 'pdf')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                defaultValue=""
              >
                <option value="" disabled>Export</option>
                <option value="csv">Export as CSV</option>
                <option value="excel">Export as Excel</option>
                <option value="pdf">Export as PDF</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tournament
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Organizer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dates
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Participants
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Entry Fee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tournaments.map((tournament) => (
              <tr key={tournament.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{tournament.name}</div>
                    <div className="text-sm text-gray-500">{tournament.location}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{tournament.organizer_name}</div>
                  {getOrganizerTypeBadge(tournament.organizer_type)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>Start: {new Date(tournament.start_date).toLocaleDateString()}</div>
                  <div>End: {new Date(tournament.end_date).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tournament.current_participants} / {tournament.max_participants}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${tournament.entry_fee}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(tournament.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onTournamentSelect(tournament)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleStatusChange(tournament)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Status
                    </button>
                    <button
                      onClick={() => handleGenerateReport(tournament)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Report
                    </button>
                    <button
                      onClick={() => handleSendNotification(tournament)}
                      className="text-purple-600 hover:text-purple-900"
                    >
                      Notify
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {tournaments.length === 0 && (
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tournaments found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria.</p>
          </div>
        )}
      </div>

      {selectedTournament && showStatusModal && (
        <TournamentStatusModal
          tournament={selectedTournament}
          onClose={() => setShowStatusModal(false)}
        />
      )}

      {selectedTournament && showReportModal && (
        <TournamentReportModal
          tournament={selectedTournament}
          onClose={() => setShowReportModal(false)}
        />
      )}

      {selectedTournament && showNotificationModal && (
        <TournamentNotificationModal
          tournament={selectedTournament}
          onClose={() => setShowNotificationModal(false)}
        />
      )}
    </div>
  )
}

export default TournamentsTable