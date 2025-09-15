import React from 'react'
import { useNavigate } from 'react-router-dom'

interface Tournament {
  name: string
  location: string
  date: string
  categories: string
  registrations: number
}

interface StateUpcomingTournamentsProps {
  upcomingTournaments: Tournament[]
}

const StateUpcomingTournaments: React.FC<StateUpcomingTournamentsProps> = ({ upcomingTournaments }) => {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Upcoming State Tournaments</h3>
      {upcomingTournaments.length > 0 ? (
        <div className="space-y-4">
          {upcomingTournaments.slice(0, 3).map((tournament, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => navigate('/state/management')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{tournament.name}</p>
                  <p className="text-sm text-gray-600">{tournament.location}</p>
                  <p className="text-xs text-gray-500">{tournament.date} • {tournament.categories}</p>
                </div>
                <div className="text-right">
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {tournament.registrations} players
                  </span>
                  <div className="mt-1">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => navigate('/state/management')}
            className="text-red-600 hover:text-red-500 text-sm font-medium"
          >
            View all tournaments →
          </button>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🏆</div>
          <p className="text-gray-600 mb-4">No upcoming tournaments</p>
          <button
            onClick={() => navigate('/state/management')}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            Create Tournament
          </button>
        </div>
      )}
    </div>
  )
}

export default StateUpcomingTournaments