import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import RankingTable from '../../components/ranking/RankingTable'
import RankingFilters from '../../components/ranking/RankingFilters'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'

const Ranking: React.FC = () => {
  const { data: appData, loading, error } = useSelector((state: RootState) => state.appData)

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  if (!appData?.playerRankings) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Rankings Found</h2>
          <p className="text-gray-600">Player rankings will be available once tournaments are completed.</p>
        </div>
      </div>
    )
  }

  const playerRankings = appData.playerRankings
  const rankingPeriods = appData.rankingPeriods || []
  const rankingCategories = appData.rankingCategories || []

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">National Ranking</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Official player rankings for the Mexican Pickleball Federation. Rankings are updated based on tournament performance and points earned.
          </p>
        </div>

        <div className="mb-8">
          <RankingFilters 
            periods={rankingPeriods}
            categories={rankingCategories}
          />
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <RankingTable rankings={playerRankings} />
        </div>

        {playerRankings.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No rankings match your filters</h3>
            <p className="text-gray-500">Try adjusting your search criteria or check back after tournament completions.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Ranking