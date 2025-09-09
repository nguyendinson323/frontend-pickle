import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../store'
import { 
  fetchReports, 
  downloadReport, 
  deleteReport, 
  getReportStatus 
} from '../../../store/slices/adminReportsSlice'

const ReportsTable: React.FC = () => {
  const dispatch = useDispatch()
  const { reports, loading } = useSelector((state: RootState) => state.adminReports)
  const [refreshingStatus, setRefreshingStatus] = useState<string[]>([])

  useEffect(() => {
    dispatch(fetchReports() as any)
  }, [dispatch])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending', icon: '⏳' },
      processing: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Processing', icon: '⚙️' },
      completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed', icon: '✅' },
      failed: { bg: 'bg-red-100', text: 'text-red-800', label: 'Failed', icon: '❌' }
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        <span className="mr-1">{config.icon}</span>
        {config.label}
      </span>
    )
  }

  const getFormatBadge = (format: string) => {
    const formatConfig = {
      csv: { bg: 'bg-green-100', text: 'text-green-800', label: 'CSV' },
      json: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'JSON' },
      xlsx: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Excel' },
      pdf: { bg: 'bg-red-100', text: 'text-red-800', label: 'PDF' }
    }
    const config = formatConfig[format as keyof typeof formatConfig] || formatConfig.csv
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    )
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleDownload = async (reportId: string) => {
    try {
      await dispatch(downloadReport(reportId) as any)
    } catch (error) {
      console.error('Failed to download report:', error)
      alert('Failed to download report')
    }
  }

  const handleDelete = async (reportId: string, reportName: string) => {
    if (!confirm(`Are you sure you want to delete the report "${reportName}"? This action cannot be undone.`)) {
      return
    }

    try {
      await dispatch(deleteReport(reportId) as any)
    } catch (error) {
      console.error('Failed to delete report:', error)
      alert('Failed to delete report')
    }
  }

  const handleRefreshStatus = async (reportId: string) => {
    if (refreshingStatus.includes(reportId)) return

    setRefreshingStatus(prev => [...prev, reportId])
    try {
      await dispatch(getReportStatus(reportId) as any)
    } catch (error) {
      console.error('Failed to refresh status:', error)
    } finally {
      setRefreshingStatus(prev => prev.filter(id => id !== reportId))
    }
  }

  const getTypeIcon = (type: string) => {
    const typeIcons = {
      users: '👥',
      tournaments: '🏆',
      courts: '🎾',
      payments: '💰',
      rankings: '🏅',
      microsites: '🌐',
      system_activity: '⚙️',
      custom: '🔧'
    }
    return typeIcons[type as keyof typeof typeIcons] || '📊'
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
            Recent Reports ({reports.length})
          </h3>
          <button
            onClick={() => dispatch(fetchReports() as any)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover: focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Report Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Format
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size / Records
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Generated
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map((report) => (
              <tr key={report.id} className="hover:">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{report.name}</div>
                    <div className="text-sm text-gray-500">ID: {report.id.slice(0, 8)}...</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="mr-2 text-lg">{getTypeIcon(report.type)}</span>
                    <span className="text-sm text-gray-900 capitalize">
                      {report.type.replace('_', ' ')}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(report.status)}
                    {(report.status === 'pending' || report.status === 'processing') && (
                      <button
                        onClick={() => handleRefreshStatus(report.id)}
                        disabled={refreshingStatus.includes(report.id)}
                        className="text-gray-400 hover:text-gray-600 disabled:animate-spin"
                        title="Refresh status"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getFormatBadge(report.type.includes('json') ? 'json' : 'csv')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {report.status === 'completed' ? (
                    <div>
                      <div>{formatFileSize(report.fileSize)}</div>
                      <div>{report.recordCount.toLocaleString()} records</div>
                    </div>
                  ) : (
                    <div className="text-gray-400">-</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(report.generatedAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    {report.status === 'completed' && report.downloadUrl && (
                      <button
                        onClick={() => handleDownload(report.id)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Download report"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>
                    )}
                    {report.status === 'failed' && (
                      <button
                        onClick={() => handleRefreshStatus(report.id)}
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Retry"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(report.id, report.name)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete report"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {reports.length === 0 && (
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">No reports generated</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by generating your first report above.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReportsTable