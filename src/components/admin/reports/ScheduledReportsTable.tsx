import React from 'react'

const ScheduledReportsTable: React.FC = () => {
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
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">Scheduled Reports</h3>
        <p className="mt-1 text-sm text-gray-500">
          Scheduled reporting is not currently implemented in the system.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Reports are generated and downloaded immediately when requested.
        </p>
      </div>
    </div>
  )
}

export default ScheduledReportsTable