import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Tournament } from '../../../types/common'

interface TournamentsRecentProps {
  tournaments: Tournament[]
}

const TournamentsRecent: React.FC<TournamentsRecentProps> = ({ tournaments }) => {
  const navigate = useNavigate()

  if (tournaments.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Recent Tournaments
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Check out results from recently completed tournaments
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tournaments.map((tournament) => (
            <div
              key={tournament.id}
              className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
            >
              {tournament.banner_url && (
                <div className="h-48 bg-gradient-to-r from-gray-500 to-gray-600 relative">
                  <img
                    src={tournament.banner_url}
                    alt={tournament.name}
                    className="w-full h-full object-cover opacity-75"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      Completed
                    </span>
                  </div>
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                    {tournament.tournament_type}
                  </span>
                  <span className="text-sm text-gray-500">
                    {tournament.state?.name}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                  {tournament.name}
                </h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(tournament.end_date).toLocaleDateString()}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    {tournament.registrationsCount} participants
                  </div>
                </div>
                
                <button
                  onClick={() => navigate(`/tournaments/${tournament.id}`)}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  View Results
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TournamentsRecent