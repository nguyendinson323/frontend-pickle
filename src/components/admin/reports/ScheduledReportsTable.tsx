import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../store'
import { getScheduledReports, scheduleReport } from '../../../store/slices/adminReportsSlice'

const ScheduledReportsTable: React.FC = () => {
  const dispatch = useDispatch()
  const { availableReportTypes } = useSelector((state: RootState) => state.adminReports)
  const [scheduledReports, setScheduledReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showScheduleModal, setShowScheduleModal] = useState(false)

  const [scheduleConfig, setScheduleConfig] = useState({
    type: '',
    name: '',
    format: 'csv',
    frequency: 'weekly' as 'daily' | 'weekly' | 'monthly',
    dayOfWeek: 1,
    dayOfMonth: 1,
    time: '09:00',
    recipients: [''],
    filters: {
      dateFrom: '',
      dateTo: '',
      userType: '',
      status: '',
      includeInactive: false
    }
  })

  useEffect(() => {
    fetchScheduledReports()
  }, [dispatch])

  const fetchScheduledReports = async () => {
    setLoading(true)
    try {
      const result = await dispatch(getScheduledReports() as any)
      setScheduledReports(result.payload || result || [])
    } catch (error) {
      console.error('Failed to fetch scheduled reports:', error)
      setScheduledReports([])
    } finally {
      setLoading(false)
    }
  }

  const handleScheduleSubmit = async () => {
    try {
      const config = {
        ...scheduleConfig,
        fields: availableReportTypes.find(t => t.value === scheduleConfig.type)?.fields || [],
        schedule: {
          frequency: scheduleConfig.frequency,
          ...(scheduleConfig.frequency === 'weekly' && { dayOfWeek: scheduleConfig.dayOfWeek }),
          ...(scheduleConfig.frequency === 'monthly' && { dayOfMonth: scheduleConfig.dayOfMonth }),
          time: scheduleConfig.time
        },
        recipients: scheduleConfig.recipients.filter(email => email.trim())
      }

      await dispatch(scheduleReport(config) as any)
      setShowScheduleModal(false)
      fetchScheduledReports()
      
      // Reset form
      setScheduleConfig({
        type: '',
        name: '',
        format: 'csv',
        frequency: 'weekly',
        dayOfWeek: 1,
        dayOfMonth: 1,
        time: '09:00',
        recipients: [''],
        filters: {
          dateFrom: '',
          dateTo: '',
          userType: '',
          status: '',
          includeInactive: false
        }
      })
    } catch (error) {
      console.error('Failed to schedule report:', error)
      alert('Failed to schedule report')
    }
  }

  const getFrequencyLabel = (frequency: string, dayOfWeek?: number, dayOfMonth?: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    
    switch (frequency) {
      case 'daily':
        return 'Daily'
      case 'weekly':
        return `Weekly (${days[dayOfWeek || 0]})`
      case 'monthly':
        return `Monthly (${dayOfMonth || 1}${getDaySuffix(dayOfMonth || 1)})`
      default:
        return frequency
    }
  }

  const getDaySuffix = (day: number) => {
    if (day >= 11 && day <= 13) return 'th'
    switch (day % 10) {
      case 1: return 'st'
      case 2: return 'nd'
      case 3: return 'rd'
      default: return 'th'
    }
  }

  const handleRecipientChange = (index: number, value: string) => {
    const newRecipients = [...scheduleConfig.recipients]
    newRecipients[index] = value
    setScheduleConfig(prev => ({ ...prev, recipients: newRecipients }))
  }

  const addRecipient = () => {
    setScheduleConfig(prev => ({ ...prev, recipients: [...prev.recipients, ''] }))
  }

  const removeRecipient = (index: number) => {
    setScheduleConfig(prev => ({ 
      ...prev, 
      recipients: prev.recipients.filter((_, i) => i !== index) 
    }))
  }

  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="grid grid-cols-5 gap-4">
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
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              Scheduled Reports ({scheduledReports.length})
            </h3>
            <button
              onClick={() => setShowScheduleModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Schedule New Report
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Schedule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recipients
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Run
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {scheduledReports.map((report, index) => (
                <tr key={report.id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {report.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    {report.type?.replace('_', ' ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      {getFrequencyLabel(report.frequency, report.dayOfWeek, report.dayOfMonth)}
                    </div>
                    <div className="text-xs text-gray-400">at {report.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.recipients?.length || 0} recipients
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.lastRun ? new Date(report.lastRun).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-red-600 hover:text-red-900">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {scheduledReports.length === 0 && (
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No scheduled reports</h3>
              <p className="mt-1 text-sm text-gray-500">Set up automated report generation and delivery.</p>
            </div>
          )}
        </div>
      </div>

      {/* Schedule Report Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Schedule Report</h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Report Type *
                  </label>
                  <select
                    value={scheduleConfig.type}
                    onChange={(e) => setScheduleConfig(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">Select type</option>
                    {availableReportTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Report Name *
                  </label>
                  <input
                    type="text"
                    value={scheduleConfig.name}
                    onChange={(e) => setScheduleConfig(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter report name"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frequency *
                  </label>
                  <select
                    value={scheduleConfig.frequency}
                    onChange={(e) => setScheduleConfig(prev => ({ ...prev, frequency: e.target.value as any }))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                {scheduleConfig.frequency === 'weekly' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Day of Week
                    </label>
                    <select
                      value={scheduleConfig.dayOfWeek}
                      onChange={(e) => setScheduleConfig(prev => ({ ...prev, dayOfWeek: parseInt(e.target.value) }))}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value={0}>Sunday</option>
                      <option value={1}>Monday</option>
                      <option value={2}>Tuesday</option>
                      <option value={3}>Wednesday</option>
                      <option value={4}>Thursday</option>
                      <option value={5}>Friday</option>
                      <option value={6}>Saturday</option>
                    </select>
                  </div>
                )}

                {scheduleConfig.frequency === 'monthly' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Day of Month
                    </label>
                    <select
                      value={scheduleConfig.dayOfMonth}
                      onChange={(e) => setScheduleConfig(prev => ({ ...prev, dayOfMonth: parseInt(e.target.value) }))}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      {[...Array(28)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}{getDaySuffix(i + 1)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={scheduleConfig.time}
                    onChange={(e) => setScheduleConfig(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Recipients *
                </label>
                {scheduleConfig.recipients.map((recipient, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="email"
                      value={recipient}
                      onChange={(e) => handleRecipientChange(index, e.target.value)}
                      placeholder="Enter email address"
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    {scheduleConfig.recipients.length > 1 && (
                      <button
                        onClick={() => removeRecipient(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addRecipient}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  + Add another recipient
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleSubmit}
                disabled={!scheduleConfig.type || !scheduleConfig.name || scheduleConfig.recipients.filter(r => r.trim()).length === 0}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                Schedule Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ScheduledReportsTable