import React from 'react'

interface CoachingSessionsTabsProps {
  activeTab: 'search' | 'coaches' | 'my-bookings'
  onTabChange: (tab: 'search' | 'coaches' | 'my-bookings') => void
  coachesCount: number
  bookingsCount: number
}

const CoachingSessionsTabs: React.FC<CoachingSessionsTabsProps> = ({
  activeTab,
  onTabChange,
  coachesCount,
  bookingsCount
}) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => onTabChange('search')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'search'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Find Sessions
          </button>
          <button
            onClick={() => onTabChange('coaches')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'coaches'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Coaches ({coachesCount})
          </button>
          <button
            onClick={() => onTabChange('my-bookings')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'my-bookings'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Bookings ({bookingsCount})
          </button>
        </nav>
      </div>
    </div>
  )
}

export default CoachingSessionsTabs