import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { TournamentAdmin } from '../../../types/admin'
import { generateTournamentReport } from '../../../store/slices/adminTournamentsSlice'
import {
  FiFileText,
  FiUsers,
  FiDollarSign,
  FiCalendar,
  FiMapPin,
  FiDownload,
  FiX,
  FiLoader,
  FiAlertCircle,
  FiInfo,
  FiCreditCard,
  FiAward,
  FiBarChart
} from 'react-icons/fi'

interface TournamentReportModalProps {
  tournament: TournamentAdmin
  onClose: () => void
}

const TournamentReportModal: React.FC<TournamentReportModalProps> = ({ tournament, onClose }) => {
  const dispatch = useDispatch()
  const [report, setReport] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true)
      setError(null)
      try {
        const reportData = await dispatch(generateTournamentReport(tournament.id) as any)
        setReport(reportData.payload || reportData)
      } catch (err) {
        setError('Failed to generate tournament report')
        console.error('Failed to generate report:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchReport()
  }, [dispatch, tournament.id])

  const handleDownloadReport = () => {
    if (!report) return

    const reportContent = `
Tournament Report: ${tournament.name}
Generated on: ${new Date().toLocaleString()}

=== BASIC INFORMATION ===
Tournament ID: ${tournament.id}
Name: ${tournament.name}
Status: ${tournament.status}
Organizer: ${tournament.organizer_name} (${tournament.organizer_type})
Location: ${tournament.location}
Start Date: ${new Date(tournament.start_date).toLocaleString()}
End Date: ${new Date(tournament.end_date).toLocaleString()}

=== PARTICIPATION ===
Current Participants: ${tournament.total_participants}
Maximum Participants: ${tournament.max_participants}
Registration Rate: ${((tournament.total_participants / (tournament.max_participants || 1)) * 100).toFixed(1)}%

=== FINANCIAL ===
Entry Fee: $${tournament.entry_fee}
Total Revenue: $${report.financial?.totalRevenue || (tournament.total_participants * tournament.entry_fee)}
Prize Pool: $${tournament.prize_pool || 0}

=== PARTICIPANT BREAKDOWN ===
${report.participantBreakdown ? Object.entries(report.participantBreakdown)
  .map(([status, count]) => `${status}: ${count}`)
  .join('\n') : 'No participant breakdown available'}

=== ADDITIONAL DETAILS ===
Ranking Tournament: ${tournament.is_ranking ? 'Yes' : 'No'}
Ranking Multiplier: ${tournament.ranking_multiplier || 'N/A'}
Created: ${new Date(tournament.created_at).toLocaleString()}
${tournament.status === 'canceled' ? 'Status: Canceled' : ''}
    `.trim()

    const blob = new Blob([reportContent], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `tournament-report-${tournament.id}-${new Date().toISOString().split('T')[0]}.txt`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
        <div className="relative top-8 mx-auto p-0 w-full max-w-4xl min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <div className="bg-white shadow-2xl rounded-3xl border border-gray-200 overflow-hidden w-full m-4 animate-modal-scale">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center text-white mr-4">
                  <FiFileText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Generating Report</h3>
                  <p className="text-blue-100 font-medium">Please wait while we compile your tournament data</p>
                </div>
              </div>
            </div>
            <div className="p-8 flex justify-center items-center h-64">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
                <div className="ml-6">
                  <div className="text-xl font-bold text-gray-900 mb-2">Generating report...</div>
                  <div className="text-gray-600 font-medium">This may take a few moments</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
        <div className="relative top-8 mx-auto p-0 w-full max-w-4xl min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <div className="bg-white shadow-2xl rounded-3xl border border-gray-200 overflow-hidden w-full m-4 animate-modal-scale">
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center text-white mr-4">
                  <FiAlertCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Error Generating Report</h3>
                  <p className="text-red-100 font-medium">Unable to compile tournament data</p>
                </div>
              </div>
            </div>
            <div className="p-8 text-center py-12">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-2xl bg-red-100 mb-6">
                <FiAlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Unable to Generate Report</h3>
              <p className="text-gray-600 font-medium mb-6 bg-gray-50 rounded-xl p-4 border border-gray-200">{error}</p>
              <button
                onClick={onClose}
                className="inline-flex items-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 border-2 border-transparent rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <FiX className="mr-2 h-5 w-5" />
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const participantBreakdown = report?.participantBreakdown || {}
  const financial = report?.financial || {
    totalRevenue: tournament.total_participants * tournament.entry_fee,
    paidParticipants: tournament.total_participants,
    pendingPayments: 0,
    refunded: 0
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div className="relative top-8 mx-auto p-0 w-full max-w-6xl min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="bg-white shadow-2xl rounded-3xl border border-gray-200 overflow-hidden w-full m-4 animate-modal-scale max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="bg-gradient-to-r from-green-600 to-blue-700 px-8 py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center text-white mr-4">
                  <FiFileText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Tournament Report</h3>
                  <p className="text-green-100 font-medium">Comprehensive analytics and insights</p>
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
            <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-100 border-2 border-blue-200 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white mr-3">
                  <FiInfo className="h-4 w-4" />
                </div>
                <h4 className="text-xl font-bold text-blue-900">{tournament.name}</h4>
              </div>
              <p className="text-blue-700 font-medium bg-white rounded-xl p-4 border border-blue-200">Generated on: {new Date().toLocaleString()}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Participation Stats */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-100 border-2 border-purple-200 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white mr-3">
                    <FiUsers className="h-4 w-4" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">Participation Overview</h4>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-purple-200">
                    <div className="flex items-center">
                      <FiUsers className="h-5 w-5 text-purple-500 mr-3" />
                      <span className="text-gray-700 font-bold">Current Participants:</span>
                    </div>
                    <span className="text-2xl font-bold text-purple-600">{tournament.total_participants}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-purple-200">
                    <div className="flex items-center">
                      <FiBarChart className="h-5 w-5 text-purple-500 mr-3" />
                      <span className="text-gray-700 font-bold">Maximum Capacity:</span>
                    </div>
                    <span className="text-2xl font-bold text-purple-600">{tournament.max_participants}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-purple-200">
                    <div className="flex items-center">
                      <FiAward className="h-5 w-5 text-purple-500 mr-3" />
                      <span className="text-gray-700 font-bold">Registration Rate:</span>
                    </div>
                    <span className="text-2xl font-bold text-purple-600">
                      {((tournament.total_participants / (tournament.max_participants || 1)) * 100).toFixed(1)}%
                    </span>
                  </div>

                  {Object.keys(participantBreakdown).length > 0 && (
                    <div className="pt-4">
                      <h5 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <FiInfo className="h-5 w-5 mr-2" />
                        Participant Status Breakdown:
                      </h5>
                      <div className="space-y-2">
                        {Object.entries(participantBreakdown).map(([status, count]) => (
                          <div key={status} className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-200">
                            <span className="text-gray-700 font-bold capitalize">{status.replace('_', ' ')}:</span>
                            <span className="text-lg font-bold text-purple-600">{count as number}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Financial Overview */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-100 border-2 border-green-200 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white mr-3">
                    <FiDollarSign className="h-4 w-4" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">Financial Overview</h4>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-green-200">
                    <div className="flex items-center">
                      <FiCreditCard className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700 font-bold">Entry Fee:</span>
                    </div>
                    <span className="text-2xl font-bold text-green-600">${tournament.entry_fee}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-green-200">
                    <div className="flex items-center">
                      <FiDollarSign className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700 font-bold">Total Revenue:</span>
                    </div>
                    <span className="text-2xl font-bold text-green-600">${financial.totalRevenue}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-green-200">
                    <div className="flex items-center">
                      <FiAward className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700 font-bold">Prize Pool:</span>
                    </div>
                    <span className="text-2xl font-bold text-green-600">${tournament.prize_pool || 0}</span>
                  </div>

                  <div className="pt-4">
                    <h5 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <FiInfo className="h-5 w-5 mr-2" />
                      Payment Breakdown:
                    </h5>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-200">
                        <span className="text-gray-700 font-bold">Paid Participants:</span>
                        <span className="text-lg font-bold text-green-600">{financial.paidParticipants}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-200">
                        <span className="text-gray-700 font-bold">Pending Payments:</span>
                        <span className="text-lg font-bold text-yellow-600">{financial.pendingPayments}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-200">
                        <span className="text-gray-700 font-bold">Refunded:</span>
                        <span className="text-lg font-bold text-red-600">{financial.refunded}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tournament Details */}
            <div className="bg-gradient-to-r from-orange-50 to-yellow-100 border-2 border-orange-200 rounded-2xl p-6 mb-8 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-lg flex items-center justify-center text-white mr-3">
                  <FiInfo className="h-4 w-4" />
                </div>
                <h4 className="text-xl font-bold text-gray-900">Tournament Details</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-xl border border-orange-200">
                    <div className="flex items-center mb-2">
                      <FiInfo className="h-4 w-4 text-orange-500 mr-2" />
                      <span className="text-sm font-bold text-gray-700">Status:</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900 capitalize">{tournament.status}</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-orange-200">
                    <div className="flex items-center mb-2">
                      <FiUsers className="h-4 w-4 text-orange-500 mr-2" />
                      <span className="text-sm font-bold text-gray-700">Organizer:</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{tournament.organizer_name} ({tournament.organizer_type})</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-orange-200">
                    <div className="flex items-center mb-2">
                      <FiMapPin className="h-4 w-4 text-orange-500 mr-2" />
                      <span className="text-sm font-bold text-gray-700">Location:</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{tournament.location}</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-orange-200">
                    <div className="flex items-center mb-2">
                      <FiAward className="h-4 w-4 text-orange-500 mr-2" />
                      <span className="text-sm font-bold text-gray-700">Format:</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{tournament.is_ranking ? 'Ranking Tournament' : 'Regular Tournament'}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-xl border border-orange-200">
                    <div className="flex items-center mb-2">
                      <FiCalendar className="h-4 w-4 text-orange-500 mr-2" />
                      <span className="text-sm font-bold text-gray-700">Start Date:</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{new Date(tournament.start_date).toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-orange-200">
                    <div className="flex items-center mb-2">
                      <FiCalendar className="h-4 w-4 text-orange-500 mr-2" />
                      <span className="text-sm font-bold text-gray-700">End Date:</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{new Date(tournament.end_date).toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-orange-200">
                    <div className="flex items-center mb-2">
                      <FiBarChart className="h-4 w-4 text-orange-500 mr-2" />
                      <span className="text-sm font-bold text-gray-700">Skill Level:</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{tournament.ranking_multiplier || 'N/A'}</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-orange-200">
                    <div className="flex items-center mb-2">
                      <FiCalendar className="h-4 w-4 text-orange-500 mr-2" />
                      <span className="text-sm font-bold text-gray-700">Created:</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{new Date(tournament.created_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-t border-gray-200">
              <button
                onClick={handleDownloadReport}
                className="inline-flex items-center px-8 py-4 text-lg font-bold text-blue-700 bg-white border-2 border-blue-300 rounded-xl hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiDownload className="mr-2 h-5 w-5" />
                Download Report
              </button>
              <button
                onClick={onClose}
                className="inline-flex items-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-green-600 to-blue-700 hover:from-green-700 hover:to-blue-800 border-2 border-transparent rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <FiX className="mr-2 h-5 w-5" />
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TournamentReportModal