import React, { useState } from 'react'
import { ClubTournament, TournamentRegistration, TournamentMatch } from '../../../store/slices/clubTournamentsSlice'
import {
  FiX,
  FiAward,
  FiUsers,
  FiEye,
  FiPlay,
  FiInfo,
  FiTrendingUp
} from 'react-icons/fi'

interface TournamentDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  tournament: ClubTournament
  registrations: TournamentRegistration[]
  matches: TournamentMatch[]
  onGenerateMatches: (tournamentId: number) => void
  onUpdateMatchResult: (matchId: number, matchData: { score: string; winner_side: number; status: string }) => void
  loading: boolean
}

const TournamentDetailsModal: React.FC<TournamentDetailsModalProps> = ({
  isOpen,
  onClose,
  tournament,
  registrations,
  matches,
  onGenerateMatches,
  onUpdateMatchResult,
  loading
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'registrations' | 'matches' | 'results'>('overview')
  const [matchResults, setMatchResults] = useState<{[key: number]: {score: string; winner_side: number}}>({})

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'canceled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'refunded':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const handleMatchResultChange = (matchId: number, field: 'score' | 'winner_side', value: string | number) => {
    setMatchResults(prev => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [field]: value
      }
    }))
  }

  const handleUpdateMatch = (matchId: number) => {
    const result = matchResults[matchId]
    if (result && result.score && result.winner_side) {
      onUpdateMatchResult(matchId, {
        score: result.score,
        winner_side: result.winner_side,
        status: 'completed'
      })
    }
  }

  const exportToCSV = (data: any[], filename: string) => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + Object.keys(data[0]).join(",") + "\n"
      + data.map(row => Object.values(row).join(",")).join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleExportRegistrations = () => {
    if (registrations.length === 0) return

    const exportData = registrations.map(reg => ({
      Player: reg.player.full_name,
      Partner: reg.partner_player?.full_name || 'N/A',
      Category: reg.category.name,
      RegistrationDate: formatDate(reg.registration_date),
      PaymentStatus: reg.payment_status,
      AmountPaid: reg.amount_paid,
      Status: reg.status
    }))

    exportToCSV(exportData, `${tournament.name}_registrations.csv`)
  }

  const handleExportResults = () => {
    if (matches.length === 0) return

    const exportData = matches.filter(match => match.status === 'completed').map(match => ({
      Category: match.category.name,
      Round: match.round,
      MatchNumber: match.match_number,
      Player1: match.player1.full_name,
      Player2: match.player2?.full_name || '',
      Player3: match.player3.full_name,
      Player4: match.player4?.full_name || '',
      Score: match.score || '',
      WinnerSide: match.winner_side || '',
      Date: match.match_date ? formatDate(match.match_date) : '',
      Time: match.match_time || ''
    }))

    exportToCSV(exportData, `${tournament.name}_results.csv`)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 overflow-y-auto h-full w-full z-50 flex items-start justify-center p-4">
      <div className="relative w-full max-w-7xl bg-gradient-to-br from-white to-blue-50 border border-blue-200 rounded-3xl shadow-2xl my-8">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-8 py-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-3xl font-bold flex items-center">
                <FiAward className="h-8 w-8 mr-4 text-yellow-300" />
                {tournament.name}
              </h3>
              <p className="text-purple-100 font-medium mt-2 flex items-center">
                <FiInfo className="h-4 w-4 mr-2" />
                Tournament Details & Management
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-3 text-white hover:text-gray-200 rounded-2xl hover:bg-white hover:bg-opacity-20 transition-all duration-200"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="p-8">

          {/* Tab Navigation */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-2xl p-2 mb-8">
            <nav className="flex space-x-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-200 ${
                  activeTab === 'overview'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white hover:bg-opacity-70'
                }`}
              >
                <FiEye className="h-4 w-4 mr-2" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab('registrations')}
                className={`flex items-center px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-200 ${
                  activeTab === 'registrations'
                    ? 'bg-gradient-to-r from-green-600 to-emerald-700 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white hover:bg-opacity-70'
                }`}
              >
                <FiUsers className="h-4 w-4 mr-2" />
                Registrations ({registrations.length})
              </button>
              <button
                onClick={() => setActiveTab('matches')}
                className={`flex items-center px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-200 ${
                  activeTab === 'matches'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-700 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white hover:bg-opacity-70'
                }`}
              >
                <FiPlay className="h-4 w-4 mr-2" />
                Matches ({matches.length})
              </button>
              <button
                onClick={() => setActiveTab('results')}
                className={`flex items-center px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-200 ${
                  activeTab === 'results'
                    ? 'bg-gradient-to-r from-yellow-600 to-orange-700 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white hover:bg-opacity-70'
                }`}
              >
                <FiTrendingUp className="h-4 w-4 mr-2" />
                Results
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="max-h-96 overflow-y-auto">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Tournament Information</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">Status: </span>
                      <span className="font-medium capitalize">{tournament.status}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Type: </span>
                      <span className="font-medium">{tournament.tournament_type}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Tournament Dates: </span>
                      <span className="font-medium">
                        {formatDate(tournament.start_date)} - {formatDate(tournament.end_date)}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Registration: </span>
                      <span className="font-medium">
                        {formatDate(tournament.registration_start)} - {formatDate(tournament.registration_end)}
                      </span>
                    </div>
                    {tournament.entry_fee && (
                      <div>
                        <span className="text-sm text-gray-500">Entry Fee: </span>
                        <span className="font-medium">${tournament.entry_fee}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-sm text-gray-500">Participants: </span>
                      <span className="font-medium">{tournament.registration_count || 0}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Revenue: </span>
                      <span className="font-medium">${tournament.revenue || 0}</span>
                    </div>
                  </div>

                  {tournament.categories && tournament.categories.length > 0 && (
                    <div className="mt-6">
                      <h5 className="text-md font-medium text-gray-900 mb-3">Categories</h5>
                      <div className="space-y-2">
                        {tournament.categories.map((category, index) => (
                          <div key={index} className="bg-blue-50 rounded-md p-3">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{category.name}</span>
                              <span className="text-sm text-gray-600">
                                {category.registration_count || 0} registered
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {category.gender} • {category.format}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => setActiveTab('registrations')}
                        className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700 font-medium"
                      >
                        View Registrations ({registrations.length})
                      </button>
                      <button
                        onClick={() => onGenerateMatches(tournament.id)}
                        disabled={registrations.length < 2 || loading}
                        className="w-full text-left px-4 py-2 bg-green-50 hover:bg-green-100 rounded-lg text-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Generate Matches
                      </button>
                      <button
                        onClick={() => setActiveTab('matches')}
                        className="w-full text-left px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-700 font-medium"
                      >
                        View Matches ({matches.length})
                      </button>
                      <button
                        onClick={handleExportResults}
                        disabled={matches.filter(m => m.status === 'completed').length === 0}
                        className="w-full text-left px-4 py-2 bg-yellow-50 hover:bg-yellow-100 rounded-lg text-yellow-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Export Results
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'registrations' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-medium text-gray-900">Tournament Registrations</h4>
                  <button
                    onClick={handleExportRegistrations}
                    disabled={registrations.length === 0}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Export CSV
                  </button>
                </div>
                {registrations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No registrations yet
                  </div>
                ) : (
                  <div className="space-y-3">
                    {registrations.map((registration) => (
                      <div key={registration.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-gray-900">
                              {registration.player.full_name}
                              {registration.partner_player && (
                                <> & {registration.partner_player.full_name}</>
                              )}
                            </div>
                            <div className="text-sm text-gray-600">
                              Category: {registration.category.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              Registered: {formatDate(registration.registration_date)}
                            </div>
                            <div className="text-sm text-gray-600">
                              Amount: ${registration.amount_paid}
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(registration.status)}`}>
                              {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                            </span>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(registration.payment_status)}`}>
                              {registration.payment_status.charAt(0).toUpperCase() + registration.payment_status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'matches' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-medium text-gray-900">Tournament Matches</h4>
                  <button
                    onClick={() => onGenerateMatches(tournament.id)}
                    disabled={registrations.length < 2 || loading}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {matches.length > 0 ? 'Regenerate Matches' : 'Generate Matches'}
                  </button>
                </div>
                {matches.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No matches generated yet. Generate matches to create the tournament bracket.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {matches.map((match) => (
                      <div key={match.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-2">
                              <div className="font-medium text-gray-900">
                                {match.category.name} - Round {match.round}, Match {match.match_number}
                              </div>
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(match.status)}`}>
                                {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-sm font-medium text-blue-600">Team 1</div>
                                <div>{match.player1.full_name}</div>
                                {match.player2 && <div>{match.player2.full_name}</div>}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-red-600">Team 2</div>
                                <div>{match.player3.full_name}</div>
                                {match.player4 && <div>{match.player4.full_name}</div>}
                              </div>
                            </div>
                            {match.match_date && match.match_time && (
                              <div className="text-sm text-gray-600 mt-2">
                                Scheduled: {formatDate(match.match_date)} at {match.match_time}
                              </div>
                            )}
                            {match.score && (
                              <div className="text-sm font-medium text-gray-900 mt-2">
                                Score: {match.score}
                              </div>
                            )}
                          </div>

                          {match.status === 'scheduled' && (
                            <div className="ml-4 space-y-2">
                              <input
                                type="text"
                                placeholder="Score (e.g., 21-19, 21-15)"
                                value={matchResults[match.id]?.score || ''}
                                onChange={(e) => handleMatchResultChange(match.id, 'score', e.target.value)}
                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                              />
                              <select
                                value={matchResults[match.id]?.winner_side || ''}
                                onChange={(e) => handleMatchResultChange(match.id, 'winner_side', parseInt(e.target.value))}
                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                              >
                                <option value="">Select Winner</option>
                                <option value="1">Team 1</option>
                                <option value="2">Team 2</option>
                              </select>
                              <button
                                onClick={() => handleUpdateMatch(match.id)}
                                disabled={!matchResults[match.id]?.score || !matchResults[match.id]?.winner_side}
                                className="w-full px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Update Result
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'results' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-medium text-gray-900">Tournament Results</h4>
                  <button
                    onClick={handleExportResults}
                    disabled={matches.filter(m => m.status === 'completed').length === 0}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Export Results CSV
                  </button>
                </div>
                {matches.filter(m => m.status === 'completed').length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No completed matches yet
                  </div>
                ) : (
                  <div className="space-y-3">
                    {matches.filter(match => match.status === 'completed').map((match) => (
                      <div key={match.id} className="border border-gray-200 rounded-lg p-4 bg-green-50">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium text-gray-900">
                              {match.category.name} - Round {match.round}, Match {match.match_number}
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                              <div className={match.winner_side === 1 ? 'font-bold text-green-600' : ''}>
                                <div className="text-sm">Team 1</div>
                                <div>{match.player1.full_name}</div>
                                {match.player2 && <div>{match.player2.full_name}</div>}
                              </div>
                              <div className={match.winner_side === 2 ? 'font-bold text-green-600' : ''}>
                                <div className="text-sm">Team 2</div>
                                <div>{match.player3.full_name}</div>
                                {match.player4 && <div>{match.player4.full_name}</div>}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">
                              {match.score}
                            </div>
                            {match.winner_side === 1 && (
                              <div className="text-sm text-green-600">Team 1 Wins</div>
                            )}
                            {match.winner_side === 2 && (
                              <div className="text-sm text-green-600">Team 2 Wins</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TournamentDetailsModal