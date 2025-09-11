import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import { generateReport, getReportPreview } from '../../../store/slices/adminReportsSlice'
import ReportPreviewModal from './ReportPreviewModal'

const ReportGenerator: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { availableReportTypes } = useSelector((state: RootState) => state.adminReports)
  const { isLoading: loading } = useSelector((state: RootState) => state.loading)
  
  const [reportConfig, setReportConfig] = useState({
    type: '',
    name: '',
    format: 'csv',
    filters: {
      dateFrom: '',
      dateTo: '',
      userType: '',
      state: '',
      status: '',
      includeInactive: false
    },
    fields: [] as string[]
  })
  
  const [showPreview, setShowPreview] = useState(false)
  const [previewData, setPreviewData] = useState<any>(null)
  const [generating, setGenerating] = useState(false)

  const selectedReportType = availableReportTypes.find(type => type.value === reportConfig.type)

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith('filters.')) {
      const filterField = field.split('.')[1]
      setReportConfig(prev => ({
        ...prev,
        filters: { ...prev.filters, [filterField]: value }
      }))
    } else {
      setReportConfig(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleFieldToggle = (field: string, checked: boolean) => {
    setReportConfig(prev => ({
      ...prev,
      fields: checked 
        ? [...prev.fields, field]
        : prev.fields.filter(f => f !== field)
    }))
  }

  const handlePreview = async () => {
    if (!reportConfig.type) {
      alert('Please select a report type')
      return
    }

    try {
      const preview = await dispatch(getReportPreview({
        type: reportConfig.type,
        filters: reportConfig.filters,
        fields: reportConfig.fields,
        limit: 10
      }))
      
      const previewResponse = preview as any
      setPreviewData(previewResponse.payload || previewResponse)
      setShowPreview(true)
    } catch (error) {
      console.error('Failed to generate preview:', error)
      alert('Failed to generate preview')
    }
  }

  const handleGenerate = async () => {
    if (!reportConfig.type || !reportConfig.name.trim()) {
      alert('Please provide report type and name')
      return
    }

    setGenerating(true)
    try {
      await dispatch(generateReport({
        type: reportConfig.type,
        name: reportConfig.name,
        filters: reportConfig.filters,
        fields: reportConfig.fields.length > 0 ? reportConfig.fields : selectedReportType?.fields || [],
        format: reportConfig.format
      }))
      
      // Reset form
      setReportConfig({
        type: '',
        name: '',
        format: 'csv',
        filters: {
          dateFrom: '',
          dateTo: '',
          userType: '',
          state: '',
          status: '',
          includeInactive: false
        },
        fields: []
      })
      
      alert('Report downloaded successfully!')
    } catch (error) {
      console.error('Failed to generate report:', error)
      alert('Failed to generate report')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Generate New Report</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Basic Configuration */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type *
            </label>
            <select
              value={reportConfig.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">Select report type</option>
              {availableReportTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {selectedReportType && (
              <p className="text-xs text-gray-500 mt-1">{selectedReportType.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Name *
            </label>
            <input
              type="text"
              value={reportConfig.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter a descriptive name for this report"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Export Format
            </label>
            <select
              value={reportConfig.format}
              onChange={(e) => handleInputChange('format', e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="csv">CSV (Comma Separated)</option>
              <option value="json">JSON (JavaScript Object)</option>
            </select>
          </div>

          {/* Filters */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Filters</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Date From
                  </label>
                  <input
                    type="date"
                    value={reportConfig.filters.dateFrom}
                    onChange={(e) => handleInputChange('filters.dateFrom', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Date To
                  </label>
                  <input
                    type="date"
                    value={reportConfig.filters.dateTo}
                    onChange={(e) => handleInputChange('filters.dateTo', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {reportConfig.type === 'users' && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    User Type
                  </label>
                  <select
                    value={reportConfig.filters.userType}
                    onChange={(e) => handleInputChange('filters.userType', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">All Types</option>
                    <option value="player">Player</option>
                    <option value="coach">Coach</option>
                    <option value="club">Club</option>
                    <option value="partner">Partner</option>
                    <option value="state">State Committee</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Status Filter
                </label>
                <select
                  value={reportConfig.filters.status}
                  onChange={(e) => handleInputChange('filters.status', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeInactive"
                  checked={reportConfig.filters.includeInactive}
                  onChange={(e) => handleInputChange('filters.includeInactive', e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="includeInactive" className="ml-2 text-sm text-gray-700">
                  Include inactive records
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Field Selection */}
        <div className="space-y-6">
          {selectedReportType && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Available Data Fields
              </h4>
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4 max-h-80 overflow-y-auto">
                <p className="text-xs text-gray-600 mb-3">
                  Select specific fields to include in your report, or leave empty to include all fields.
                </p>
                <div className="space-y-2">
                  {selectedReportType.fields.map((field) => (
                    <label key={field} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={reportConfig.fields.includes(field)}
                        onChange={(e) => handleFieldToggle(field, e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Preview Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Report Summary</h4>
            <div className="text-xs text-blue-800 space-y-1">
              <div>Type: {selectedReportType?.label || 'Not selected'}</div>
              <div>Format: {reportConfig.format.toUpperCase()}</div>
              <div>Fields: {reportConfig.fields.length > 0 ? reportConfig.fields.length : 'All available'}</div>
              {reportConfig.filters.dateFrom && (
                <div>Date Range: {reportConfig.filters.dateFrom} to {reportConfig.filters.dateTo || 'now'}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-8">
        <button
          onClick={handlePreview}
          disabled={!reportConfig.type || loading}
          className="px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-300 rounded-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          Preview Data
        </button>
        <button
          onClick={handleGenerate}
          disabled={!reportConfig.type || !reportConfig.name.trim() || generating}
          className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {generating ? 'Generating...' : 'Generate Report'}
        </button>
      </div>

      {showPreview && previewData && (
        <ReportPreviewModal
          data={previewData}
          reportType={selectedReportType?.label || reportConfig.type}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  )
}

export default ReportGenerator