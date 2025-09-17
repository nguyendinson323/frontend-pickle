import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import { generateReport, getReportPreview } from '../../../store/slices/adminReportsSlice'
import ReportPreviewModal from './ReportPreviewModal'
import {
  FiFileText,
  FiSettings,
  FiCalendar,
  FiFilter,
  FiCheckSquare,
  FiSquare,
  FiEye,
  FiDownload,
  FiLoader,
  FiBarChart2,
  FiSave,
  FiDatabase
} from 'react-icons/fi'

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
    <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden mb-8">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white mr-4">
            <FiFileText className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Generate New Report</h3>
            <p className="text-gray-600 font-medium">Configure and generate custom data reports</p>
          </div>
        </div>
      </div>

      <div className="p-8">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Basic Configuration */}
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl p-6 border-2 border-blue-200 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white mr-3">
                <FiSettings className="h-4 w-4" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">Basic Configuration</h4>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-lg font-bold text-gray-900 mb-3">
                  Report Type *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiBarChart2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={reportConfig.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full pl-10 rounded-2xl border-2 border-gray-300 px-4 py-3 text-lg font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 bg-white hover:border-gray-400"
                  >
                    <option value="">Select report type</option>
                    {availableReportTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedReportType && (
                  <div className="mt-3 p-3 bg-white rounded-xl border border-blue-200">
                    <p className="text-sm text-blue-700 font-medium">{selectedReportType.description}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-lg font-bold text-gray-900 mb-3">
                  Report Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSave className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={reportConfig.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter a descriptive name for this report"
                    className="w-full pl-10 rounded-2xl border-2 border-gray-300 px-4 py-3 text-lg font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 bg-white hover:border-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-lg font-bold text-gray-900 mb-3">
                  Export Format
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiDownload className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={reportConfig.format}
                    onChange={(e) => handleInputChange('format', e.target.value)}
                    className="w-full pl-10 rounded-2xl border-2 border-gray-300 px-4 py-3 text-lg font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 bg-white hover:border-gray-400"
                  >
                    <option value="csv">CSV (Comma Separated)</option>
                    <option value="json">JSON (JavaScript Object)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-2xl p-6 border-2 border-green-200 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white mr-3">
                <FiFilter className="h-4 w-4" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">Filters</h4>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-lg font-bold text-gray-900 mb-3">
                    Date From
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiCalendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      value={reportConfig.filters.dateFrom}
                      onChange={(e) => handleInputChange('filters.dateFrom', e.target.value)}
                      className="w-full pl-10 rounded-2xl border-2 border-gray-300 px-4 py-3 text-lg font-medium focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:ring-opacity-50 transition-all duration-200 bg-white hover:border-gray-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-lg font-bold text-gray-900 mb-3">
                    Date To
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiCalendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      value={reportConfig.filters.dateTo}
                      onChange={(e) => handleInputChange('filters.dateTo', e.target.value)}
                      className="w-full pl-10 rounded-2xl border-2 border-gray-300 px-4 py-3 text-lg font-medium focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:ring-opacity-50 transition-all duration-200 bg-white hover:border-gray-400"
                    />
                  </div>
                </div>
              </div>

              {reportConfig.type === 'users' && (
                <div>
                  <label className="block text-lg font-bold text-gray-900 mb-3">
                    User Type
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiSettings className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      value={reportConfig.filters.userType}
                      onChange={(e) => handleInputChange('filters.userType', e.target.value)}
                      className="w-full pl-10 rounded-2xl border-2 border-gray-300 px-4 py-3 text-lg font-medium focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:ring-opacity-50 transition-all duration-200 bg-white hover:border-gray-400"
                    >
                      <option value="">All Types</option>
                      <option value="player">Player</option>
                      <option value="coach">Coach</option>
                      <option value="club">Club</option>
                      <option value="partner">Partner</option>
                      <option value="state">State Committee</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-lg font-bold text-gray-900 mb-3">
                  Status Filter
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiFilter className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={reportConfig.filters.status}
                    onChange={(e) => handleInputChange('filters.status', e.target.value)}
                    className="w-full pl-10 rounded-2xl border-2 border-gray-300 px-4 py-3 text-lg font-medium focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:ring-opacity-50 transition-all duration-200 bg-white hover:border-gray-400"
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-green-200 shadow-md">
                <div className="flex items-center">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="includeInactive"
                      checked={reportConfig.filters.includeInactive}
                      onChange={(e) => handleInputChange('filters.includeInactive', e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                      reportConfig.filters.includeInactive
                        ? 'bg-green-600 border-green-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}>
                      {reportConfig.filters.includeInactive && (
                        <FiCheckSquare className="h-4 w-4 text-white" />
                      )}
                    </div>
                  </div>
                  <label htmlFor="includeInactive" className="ml-3 text-lg font-bold text-gray-900 cursor-pointer">
                    Include inactive records
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Field Selection */}
        <div className="space-y-8">
          {selectedReportType && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-100 rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white mr-3">
                  <FiDatabase className="h-4 w-4" />
                </div>
                <h4 className="text-xl font-bold text-gray-900">
                  Available Data Fields
                </h4>
              </div>
              <div className="bg-white border-2 border-purple-200 rounded-2xl p-6 max-h-80 overflow-y-auto shadow-md">
                <p className="text-sm text-purple-700 font-medium mb-4 p-3 bg-purple-50 rounded-xl border border-purple-200">
                  Select specific fields to include in your report, or leave empty to include all fields.
                </p>
                <div className="space-y-3">
                  {selectedReportType.fields.map((field) => (
                    <label key={field} className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={reportConfig.fields.includes(field)}
                          onChange={(e) => handleFieldToggle(field, e.target.checked)}
                          className="sr-only"
                        />
                        <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                          reportConfig.fields.includes(field)
                            ? 'bg-purple-600 border-purple-600'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}>
                          {reportConfig.fields.includes(field) && (
                            <FiCheckSquare className="h-4 w-4 text-white" />
                          )}
                        </div>
                      </div>
                      <span className="ml-3 text-lg font-bold text-gray-900">
                        {field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Preview Summary */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-100 rounded-2xl p-6 border-2 border-yellow-200 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center text-white mr-3">
                <FiBarChart2 className="h-4 w-4" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">Report Summary</h4>
            </div>
            <div className="space-y-3">
              <div className="bg-white rounded-xl p-3 border border-yellow-200 shadow-md">
                <span className="text-sm font-bold text-gray-700">Type: </span>
                <span className="text-lg font-bold text-yellow-700">{selectedReportType?.label || 'Not selected'}</span>
              </div>
              <div className="bg-white rounded-xl p-3 border border-yellow-200 shadow-md">
                <span className="text-sm font-bold text-gray-700">Format: </span>
                <span className="text-lg font-bold text-yellow-700">{reportConfig.format.toUpperCase()}</span>
              </div>
              <div className="bg-white rounded-xl p-3 border border-yellow-200 shadow-md">
                <span className="text-sm font-bold text-gray-700">Fields: </span>
                <span className="text-lg font-bold text-yellow-700">{reportConfig.fields.length > 0 ? reportConfig.fields.length : 'All available'}</span>
              </div>
              {reportConfig.filters.dateFrom && (
                <div className="bg-white rounded-xl p-3 border border-yellow-200 shadow-md">
                  <span className="text-sm font-bold text-gray-700">Date Range: </span>
                  <span className="text-lg font-bold text-yellow-700">{reportConfig.filters.dateFrom} to {reportConfig.filters.dateTo || 'now'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 mt-8">
        <button
          onClick={handlePreview}
          disabled={!reportConfig.type || loading}
          className="inline-flex items-center justify-center px-8 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-xl hover:bg-indigo-50 transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
        >
          <FiEye className="mr-2 h-5 w-5" />
          Preview Data
        </button>
        <button
          onClick={handleGenerate}
          disabled={!reportConfig.type || !reportConfig.name.trim() || generating}
          className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
        >
          {generating ? (
            <>
              <FiLoader className="animate-spin mr-2 h-5 w-5" />
              Generating...
            </>
          ) : (
            <>
              <FiDownload className="mr-2 h-5 w-5" />
              Generate Report
            </>
          )}
        </button>
      </div>
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