import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { TournamentAdmin } from '../../../types/admin'
import { generateTournamentReport } from '../../../store/slices/adminTournamentsSlice'

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
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-lg text-gray-600">Generating report...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
          <div className="text-center py-12">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Generating Report</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
            >
              Close
            </button>
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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Tournament Report</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-6 p-4  rounded-lg">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">{tournament.name}</h4>
          <p className="text-sm text-gray-600">Generated on: {new Date().toLocaleString()}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Participation Stats */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Participation Overview</h4>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Current Participants:</span>
                <span className="font-semibold">{tournament.total_participants}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Maximum Capacity:</span>
                <span className="font-semibold">{tournament.max_participants}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Registration Rate:</span>
                <span className="font-semibold">
                  {((tournament.total_participants / (tournament.max_participants || 1)) * 100).toFixed(1)}%
                </span>
              </div>
              
              {Object.keys(participantBreakdown).length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <h5 className="font-medium text-gray-900 mb-2">Participant Status Breakdown:</h5>
                  {Object.entries(participantBreakdown).map(([status, count]) => (
                    <div key={status} className="flex justify-between text-sm">
                      <span className="text-gray-600 capitalize">{status.replace('_', ' ')}:</span>
                      <span className="font-medium">{count as number}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Financial Overview */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Financial Overview</h4>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Entry Fee:</span>
                <span className="font-semibold">${tournament.entry_fee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Revenue:</span>
                <span className="font-semibold text-green-600">${financial.totalRevenue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Prize Pool:</span>
                <span className="font-semibold">${tournament.prize_pool || 0}</span>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Paid Participants:</span>
                  <span className="font-medium">{financial.paidParticipants}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pending Payments:</span>
                  <span className="font-medium">{financial.pendingPayments}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Refunded:</span>
                  <span className="font-medium">{financial.refunded}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tournament Details */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Tournament Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <p className="text-gray-900 capitalize">{tournament.status}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Organizer:</span>
                <p className="text-gray-900">{tournament.organizer_name} ({tournament.organizer_type})</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Location:</span>
                <p className="text-gray-900">{tournament.location}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Format:</span>
                <p className="text-gray-900">{tournament.is_ranking ? 'Ranking Tournament' : 'Regular Tournament'}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-700">Start Date:</span>
                <p className="text-gray-900">{new Date(tournament.start_date).toLocaleString()}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">End Date:</span>
                <p className="text-gray-900">{new Date(tournament.end_date).toLocaleString()}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Skill Level:</span>
                <p className="text-gray-900">{tournament.ranking_multiplier || 'N/A'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Created:</span>
                <p className="text-gray-900">{new Date(tournament.created_at).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={handleDownloadReport}
            className="px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-300 rounded-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Download Report
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default TournamentReportModal