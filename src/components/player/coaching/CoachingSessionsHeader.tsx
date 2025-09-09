import React from 'react'

interface CoachingSessionsHeaderProps {
  title?: string
  description?: string
}

const CoachingSessionsHeader: React.FC<CoachingSessionsHeaderProps> = ({
  title = "Coaching Sessions",
  description = "Find and book professional coaching sessions"
}) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-600">{description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoachingSessionsHeader