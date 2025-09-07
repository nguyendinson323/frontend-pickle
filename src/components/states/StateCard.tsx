import React from 'react'
import { useNavigate } from 'react-router-dom'
import { StateStatistics } from '../../types/common'

interface StateCardProps {
  state: StateStatistics
}

const StateCard: React.FC<StateCardProps> = ({ state }) => {
  const navigate = useNavigate()

  const handleViewState = () => {
    navigate(`/states/${state.id}`)
  }

  const totalActivity = state.playersCount + state.coachesCount + state.clubsCount + state.partnersCount + state.tournamentsCount + state.courtsCount

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={handleViewState}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              {state.name}
            </h3>
            {state.short_code && (
              <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                {state.short_code}
              </span>
            )}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {totalActivity}
            </div>
            <div className="text-xs text-gray-500">Total Activity</div>
          </div>
        </div>

        <div className="space-y-3">
          {/* Players */}
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Players</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">
              {state.playersCount.toLocaleString()}
            </span>
          </div>

          {/* Coaches */}
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>Coaches</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">
              {state.coachesCount.toLocaleString()}
            </span>
          </div>

          {/* Clubs */}
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>Clubs</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">
              {state.clubsCount.toLocaleString()}
            </span>
          </div>

          {/* Partners */}
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Partners</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">
              {state.partnersCount.toLocaleString()}
            </span>
          </div>

          {/* Tournaments */}
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <span>Tournaments</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">
              {state.tournamentsCount.toLocaleString()}
            </span>
          </div>

          {/* Courts */}
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>Courts</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">
              {state.courtsCount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* State Committee */}
        {state.stateCommittee && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <span className="text-green-600 font-medium">State Committee Active</span>
            </div>
            <div className="mt-1 text-sm text-gray-700">
              {state.stateCommittee.name}
            </div>
            {state.stateCommittee.president_name && (
              <div className="text-xs text-gray-500">
                President: {state.stateCommittee.president_name}
              </div>
            )}
          </div>
        )}

        <div className="mt-6">
          <button 
            onClick={handleViewState}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  )
}

export default StateCard