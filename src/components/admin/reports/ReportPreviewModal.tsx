import React from 'react'

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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-6xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Report Preview</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900">{reportType}</h4>
          <p className="text-sm text-blue-700">
            Showing {data.preview.length} of {data.totalRecords.toLocaleString()} total records
          </p>
          <p className="text-sm text-blue-700">
            Available fields: {data.fields.length}
          </p>
        </div>

        {data.preview.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {data.fields.slice(0, 10).map((field) => (
                    <th 
                      key={field}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {getFieldLabel(field)}
                    </th>
                  ))}
                  {data.fields.length > 10 && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ...{data.fields.length - 10} more
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.preview.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {data.fields.slice(0, 10).map((field) => (
                      <td key={field} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="max-w-xs truncate" title={formatValue(row[field])}>
                          {formatValue(row[field])}
                        </div>
                      </td>
                    ))}
                    {data.fields.length > 10 && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ...
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">No data available</h3>
            <p className="mt-1 text-sm text-gray-500">
              No records match your current filter criteria.
            </p>
          </div>
        )}

        {data.fields.length > 10 && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="text-sm font-medium text-yellow-800">Additional Fields Available</h4>
            <p className="text-sm text-yellow-700 mt-1">
              This preview shows only the first 10 columns. The full report will include all {data.fields.length} fields:
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {data.fields.slice(10).map((field) => (
                <span 
                  key={field}
                  className="inline-flex px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded"
                >
                  {getFieldLabel(field)}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Preview limited to first {data.preview.length} records of {data.totalRecords.toLocaleString()} total
          </div>
          <button
            onClick={onClose}
            className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReportPreviewModal