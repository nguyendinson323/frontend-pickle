import React from 'react'
import {
  FiSearch,
  FiUsers,
  FiCalendar
} from 'react-icons/fi'

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
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg border border-gray-200 mx-4 mb-8">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <nav className="flex space-x-2 py-6" aria-label="Tabs">
          <button
            onClick={() => onTabChange('search')}
            className={`inline-flex items-center px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-300 hover:transform hover:scale-105 ${
              activeTab === 'search'
                ? 'bg-gradient-to-r from-purple-600 to-blue-700 text-white shadow-xl'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 shadow-sm'
            }`}
          >
            <FiSearch className="w-5 h-5 mr-3" />
            Find Sessions
          </button>
          <button
            onClick={() => onTabChange('coaches')}
            className={`inline-flex items-center px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-300 hover:transform hover:scale-105 ${
              activeTab === 'coaches'
                ? 'bg-gradient-to-r from-green-600 to-emerald-700 text-white shadow-xl'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 shadow-sm'
            }`}
          >
            <FiUsers className="w-5 h-5 mr-3" />
            Coaches
            <span className="ml-2 px-3 py-1 bg-white bg-opacity-20 rounded-full text-xs font-bold">
              {coachesCount}
            </span>
          </button>
          <button
            onClick={() => onTabChange('my-bookings')}
            className={`inline-flex items-center px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-300 hover:transform hover:scale-105 ${
              activeTab === 'my-bookings'
                ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-xl'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 shadow-sm'
            }`}
          >
            <FiCalendar className="w-5 h-5 mr-3" />
            My Bookings
            <span className="ml-2 px-3 py-1 bg-white bg-opacity-20 rounded-full text-xs font-bold">
              {bookingsCount}
            </span>
          </button>
        </nav>
      </div>
    </div>
  )
}

export default CoachingSessionsTabs