import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import { TournamentAdmin } from '../../../types/admin'
import { exportTournaments } from '../../../store/slices/adminTournamentsSlice'
import TournamentStatusModal from './TournamentStatusModal'
import TournamentReportModal from './TournamentReportModal'
import TournamentNotificationModal from './TournamentNotificationModal'
import {
  FiEye,
  FiSettings,
  FiFileText,
  FiBell,
  FiDownload,
  FiCalendar,
  FiUsers,
  FiMapPin,
  FiDollarSign,
  FiLoader,
  FiAlertCircle
} from 'react-icons/fi'

interface TournamentsTableProps {
  onTournamentSelect: (tournament: TournamentAdmin) => void
}

const TournamentsTable: React.FC<TournamentsTableProps> = ({ onTournamentSelect }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { tournaments, tournamentFilter, loading } = useSelector((state: RootState) => state.adminTournaments)
  const [selectedTournament, setSelectedTournament] = useState<TournamentAdmin | null>(null)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [showNotificationModal, setShowNotificationModal] = useState(false)

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      upcoming: { gradient: 'from-blue-500 to-blue-600', bg: 'from-blue-50 to-blue-100', border: 'border-blue-200', label: 'Upcoming' },
      ongoing: { gradient: 'from-green-500 to-green-600', bg: 'from-green-50 to-green-100', border: 'border-green-200', label: 'Ongoing' },
      completed: { gradient: 'from-gray-500 to-gray-600', bg: 'from-gray-50 to-gray-100', border: 'border-gray-200', label: 'Completed' },
      canceled: { gradient: 'from-red-500 to-red-600', bg: 'from-red-50 to-red-100', border: 'border-red-200', label: 'Canceled' }
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.upcoming
    return (
      <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-xl bg-gradient-to-r ${config.bg} border ${config.border} text-gray-900 shadow-md`}>
        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${config.gradient} mr-2`}></div>
        {config.label}
      </span>
    )
  }

  const getOrganizerTypeBadge = (type: string) => {
    const typeConfig = {
      club: { gradient: 'from-purple-500 to-purple-600', bg: 'from-purple-50 to-purple-100', border: 'border-purple-200', label: 'Club' },
      partner: { gradient: 'from-indigo-500 to-indigo-600', bg: 'from-indigo-50 to-indigo-100', border: 'border-indigo-200', label: 'Partner' },
      state: { gradient: 'from-orange-500 to-orange-600', bg: 'from-orange-50 to-orange-100', border: 'border-orange-200', label: 'State' }
    }
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.club
    return (
      <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-xl bg-gradient-to-r ${config.bg} border ${config.border} text-gray-900 shadow-md`}>
        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${config.gradient} mr-2`}></div>
        {config.label}
      </span>
    )
  }

  const handleExport = async (format: 'csv' | 'excel' | 'pdf') => {
    dispatch(exportTournaments(tournamentFilter, format))
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
              <div key={i} className="grid grid-cols-7 gap-6 p-4 bg-gray-50 rounded-2xl animate-pulse">
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

  return (
    <div className="bg-white shadow-lg rounded-2xl border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white mr-4">
              <FiCalendar className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                Tournaments ({tournaments.length})
              </h3>
              <p className="text-gray-600 font-medium">Manage and monitor all tournaments</p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiDownload className="h-4 w-4 text-gray-400" />
            </div>
            <select
              onChange={(e) => handleExport(e.target.value as 'csv' | 'excel' | 'pdf')}
              className="pl-10 pr-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue=""
            >
              <option value="" disabled>Export Data</option>
              <option value="csv">Export as CSV</option>
              <option value="excel">Export as Excel</option>
              <option value="pdf">Export as PDF</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider border-b-2 border-gray-200">
                <div className="flex items-center">
                  <FiCalendar className="h-4 w-4 mr-2" />
                  Tournament
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider border-b-2 border-gray-200">
                <div className="flex items-center">
                  <FiUsers className="h-4 w-4 mr-2" />
                  Organizer
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider border-b-2 border-gray-200">
                <div className="flex items-center">
                  <FiCalendar className="h-4 w-4 mr-2" />
                  Dates
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider border-b-2 border-gray-200">
                <div className="flex items-center">
                  <FiUsers className="h-4 w-4 mr-2" />
                  Participants
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider border-b-2 border-gray-200">
                <div className="flex items-center">
                  <FiDollarSign className="h-4 w-4 mr-2" />
                  Entry Fee
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider border-b-2 border-gray-200">
                Status
              </th>
              <th className="px-6 py-4 text-right text-sm font-bold text-gray-900 uppercase tracking-wider border-b-2 border-gray-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tournaments.map((tournament, index) => (
              <tr
                key={tournament.id}
                className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="px-6 py-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white mr-4 flex-shrink-0">
                      <FiCalendar className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900">{tournament.name}</div>
                      <div className="flex items-center text-gray-600 mt-1">
                        <FiMapPin className="h-4 w-4 mr-1" />
                        <span className="font-medium">{tournament.location}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <div className="text-lg font-bold text-gray-900 mb-2">{tournament.organizer_name}</div>
                  {getOrganizerTypeBadge(tournament.organizer_type)}
                </td>
                <td className="px-6 py-6">
                  <div className="space-y-1">
                    <div className="flex items-center text-gray-700">
                      <span className="font-bold text-sm">Start:</span>
                      <span className="ml-2 font-medium">{new Date(tournament.start_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <span className="font-bold text-sm">End:</span>
                      <span className="ml-2 font-medium">{new Date(tournament.end_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <div className="flex items-center">
                    <FiUsers className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-lg font-bold text-gray-900">
                      {tournament.total_participants} / {tournament.max_participants || '∞'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <div className="flex items-center">
                    <FiDollarSign className="h-5 w-5 text-green-500 mr-1" />
                    <span className="text-lg font-bold text-gray-900">${tournament.entry_fee}</span>
                  </div>
                </td>
                <td className="px-6 py-6">
                  {getStatusBadge(tournament.status)}
                </td>
                <td className="px-6 py-6">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onTournamentSelect(tournament)}
                      className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 font-bold shadow-md hover:shadow-lg transform hover:scale-105"
                      title="View Details"
                    >
                      <FiEye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleStatusChange(tournament)}
                      className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-bold shadow-md hover:shadow-lg transform hover:scale-105"
                      title="Change Status"
                    >
                      <FiSettings className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleGenerateReport(tournament)}
                      className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-bold shadow-md hover:shadow-lg transform hover:scale-105"
                      title="Generate Report"
                    >
                      <FiFileText className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleSendNotification(tournament)}
                      className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 font-bold shadow-md hover:shadow-lg transform hover:scale-105"
                      title="Send Notification"
                    >
                      <FiBell className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {tournaments.length === 0 && (
          <div className="text-center py-16 bg-gradient-to-r from-gray-50 to-gray-100 m-8 rounded-2xl border-2 border-gray-200">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-300 to-gray-400 rounded-2xl flex items-center justify-center text-white mb-6">
              <FiAlertCircle className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Tournaments Found</h3>
            <p className="text-lg text-gray-600 font-medium">
              Try adjusting your search criteria or filters to find tournaments.
            </p>
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