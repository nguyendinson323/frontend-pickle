import React from 'react'

interface CourtReservationsTabsProps {
  activeTab: 'search' | 'my-reservations'
  setActiveTab: (tab: 'search' | 'my-reservations') => void
  reservationCount: number
}

const CourtReservationsTabs: React.FC<CourtReservationsTabsProps> = ({
  activeTab,
  setActiveTab,
  reservationCount
}) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('search')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'search'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Find Courts
          </button>
          <button
            onClick={() => setActiveTab('my-reservations')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'my-reservations'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Reservations ({reservationCount})
          </button>
        </nav>
      </div>
    </div>
  )
}

export default CourtReservationsTabs