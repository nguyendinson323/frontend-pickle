import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import StateCard from '../../components/states/StateCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'

const States: React.FC = () => {
  const { data: appData, loading, error } = useSelector((state: RootState) => state.appData)

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  if (!appData?.statesStatistics) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No States Found</h2>
          <p className="text-gray-600">State information will be available soon.</p>
        </div>
      </div>
    )
  }

  const statesStatistics = appData.statesStatistics

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">States</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore pickleball activity across all Mexican states. Discover player counts, tournaments, courts, and local committees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {statesStatistics.map((state) => (
            <StateCard key={state.id} state={state} />
          ))}
        </div>

        {statesStatistics.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No states available</h3>
            <p className="text-gray-500">State information will be updated soon.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default States