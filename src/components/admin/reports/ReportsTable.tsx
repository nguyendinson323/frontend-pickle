import React from 'react'

const ReportsTable: React.FC = () => {










  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
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
        <h3 className="mt-2 text-lg font-medium text-gray-900">Report History</h3>
        <p className="mt-1 text-sm text-gray-500">
          Reports are generated and downloaded directly. No history is stored in the system.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Use the "Generate Reports" tab to create and download reports immediately.
        </p>
      </div>
    </div>
  )
}

export default ReportsTable