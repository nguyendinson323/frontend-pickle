import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import TournamentCard from '../../components/tournaments/TournamentCard'
import TournamentFilters from '../../components/tournaments/TournamentFilters'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'

const Tournaments: React.FC = () => {
  const { data: appData, loading, error } = useSelector((state: RootState) => state.appData)

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  if (!appData?.tournaments) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Tournaments Found</h2>
          <p className="text-gray-600">Please check back later for upcoming tournaments.</p>
        </div>
      </div>
    )
  }

  const tournaments = appData.tournaments

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tournaments</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover and participate in pickleball tournaments across Mexico. From local competitions to national championships.
          </p>
        </div>

        <div className="mb-8">
          <TournamentFilters />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tournaments.map((tournament) => (
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))}
        </div>

        {tournaments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tournaments match your filters</h3>
            <p className="text-gray-500">Try adjusting your search criteria or check back later for new tournaments.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Tournaments