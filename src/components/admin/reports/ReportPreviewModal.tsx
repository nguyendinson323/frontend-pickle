import React from 'react'
import {
  FiX,
  FiEye,
  FiBarChart2,
  FiDatabase,
  FiInfo,
  FiFileText,
  FiFilter,
  FiColumns,
  FiMoreHorizontal,
  FiCheckCircle,
  FiAlertTriangle
} from 'react-icons/fi'

interface ReportPreviewModalProps {
  data: {
    preview: any[]
    totalRecords: number
    fields: string[]
  }
  reportType: string
  onClose: () => void
}

const ReportPreviewModal: React.FC<ReportPreviewModalProps> = ({ data, reportType, onClose }) => {
  const formatValue = (value: any) => {
    if (value === null || value === undefined) return '-'
    if (typeof value === 'boolean') return value ? 'Yes' : 'No'
    if (typeof value === 'object') return JSON.stringify(value)
    if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
      return new Date(value).toLocaleDateString()
    }
    return String(value)
  }

  const getFieldLabel = (field: string) => {
    return field
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-7xl bg-white shadow-2xl rounded-3xl border-2 border-gray-200 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center text-white mr-4">
                <FiEye className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Report Preview</h3>
                <p className="text-indigo-100 font-medium">Live data preview with sample records</p>
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

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Report Info */}
          <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl p-6 border-2 border-blue-200">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                <FiBarChart2 className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-blue-900 mb-2">{reportType}</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl p-4 border border-blue-200 shadow-md">
                    <div className="flex items-center mb-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white mr-2">
                        <FiDatabase className="h-3 w-3" />
                      </div>
                      <span className="text-sm font-bold text-gray-700">Sample Records</span>
                    </div>
                    <p className="text-lg font-bold text-blue-600">{data.preview.length}</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-blue-200 shadow-md">
                    <div className="flex items-center mb-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white mr-2">
                        <FiFileText className="h-3 w-3" />
                      </div>
                      <span className="text-sm font-bold text-gray-700">Total Records</span>
                    </div>
                    <p className="text-lg font-bold text-blue-600">{data.totalRecords.toLocaleString()}</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-blue-200 shadow-md">
                    <div className="flex items-center mb-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-white mr-2">
                        <FiColumns className="h-3 w-3" />
                      </div>
                      <span className="text-sm font-bold text-gray-700">Data Fields</span>
                    </div>
                    <p className="text-lg font-bold text-blue-600">{data.fields.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {data.preview.length > 0 ? (
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
              {/* Table Header */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white mr-3">
                    <FiDatabase className="h-4 w-4" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">Data Preview</h4>
                  {data.fields.length > 10 && (
                    <div className="ml-auto flex items-center px-3 py-1 bg-yellow-100 border border-yellow-300 rounded-xl">
                      <FiInfo className="h-4 w-4 text-yellow-600 mr-2" />
                      <span className="text-sm font-bold text-yellow-800">Showing first 10 columns</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      {data.fields.slice(0, 10).map((field) => (
                        <th
                          key={field}
                          className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider border-r border-gray-200 last:border-r-0"
                        >
                          <div className="flex items-center">
                            <FiFilter className="h-3 w-3 text-gray-500 mr-2" />
                            {getFieldLabel(field)}
                          </div>
                        </th>
                      ))}
                      {data.fields.length > 10 && (
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                          <div className="flex items-center">
                            <FiMoreHorizontal className="h-4 w-4 text-gray-500 mr-2" />
                            +{data.fields.length - 10} more
                          </div>
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.preview.map((row, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {data.fields.slice(0, 10).map((field) => (
                          <td key={field} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-100 last:border-r-0">
                            <div className="max-w-xs truncate font-medium" title={formatValue(row[field])}>
                              {formatValue(row[field])}
                            </div>
                          </td>
                        ))}
                        {data.fields.length > 10 && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <FiMoreHorizontal className="h-4 w-4 text-gray-400" />
                              <span className="ml-2 text-xs font-medium">Additional data</span>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-16 border-2 border-gray-200 text-center">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-300 to-gray-400 rounded-2xl flex items-center justify-center text-white mb-6">
                <FiAlertTriangle className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Data Available</h3>
              <p className="text-lg text-gray-600 font-medium">
                No records match your current filter criteria.
              </p>
            </div>
          )}

          {/* Additional Fields Notice */}
          {data.fields.length > 10 && (
            <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-100 rounded-2xl p-6 border-2 border-yellow-200">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center text-white flex-shrink-0 mt-1">
                  <FiColumns className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-yellow-900 mb-2">Additional Fields Available</h4>
                  <p className="text-yellow-700 font-medium mb-4 leading-relaxed">
                    This preview shows only the first 10 columns for readability. The complete report will include all {data.fields.length} fields.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {data.fields.slice(10).map((field) => (
                      <div
                        key={field}
                        className="bg-white rounded-xl px-3 py-2 border border-yellow-200 shadow-md transform hover:scale-105 transition-all duration-200"
                      >
                        <span className="text-sm font-bold text-yellow-800">
                          {getFieldLabel(field)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-100 rounded-2xl p-6 border-2 border-green-200">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white mr-3">
                <FiCheckCircle className="h-4 w-4" />
              </div>
              <h4 className="text-lg font-bold text-green-900">Preview Summary</h4>
            </div>
            <p className="text-green-700 font-medium leading-relaxed">
              Displaying {data.preview.length} sample records from a total of {data.totalRecords.toLocaleString()} records.
              The full report will contain all data with complete field information.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-t border-gray-200 flex justify-between items-center">
          <div className="flex items-center text-gray-600">
            <FiInfo className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">
              Preview limited to first {data.preview.length} records of {data.totalRecords.toLocaleString()} total
            </span>
          </div>
          <button
            onClick={onClose}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <FiX className="mr-2 h-4 w-4" />
            Close Preview
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReportPreviewModal