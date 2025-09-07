import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import CourtCard from '../../components/courts/CourtCard'
import CourtFilters from '../../components/courts/CourtFilters'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'

const Courts: React.FC = () => {
  const { data: appData, loading, error } = useSelector((state: RootState) => state.appData)

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  if (!appData?.courts) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Courts Found</h2>
          <p className="text-gray-600">Please check back later for court listings.</p>
        </div>
      </div>
    )
  }

  const courts = appData.courts

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Courts Directory</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find the perfect pickleball courts across Mexico. Search by location, amenities, and availability.
          </p>
        </div>

        <div className="mb-8">
          <CourtFilters />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courts.map((court) => (
            <CourtCard key={court.id} court={court} />
          ))}
        </div>

        {courts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courts match your filters</h3>
            <p className="text-gray-500">Try adjusting your search criteria or check back later for new court listings.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Courts