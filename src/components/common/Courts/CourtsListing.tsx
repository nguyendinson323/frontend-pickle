import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Court } from '../../../types'
import { LoadingSpinner } from '../../common'
import { CourtReservationModal } from './CourtReservationModal'

interface CourtsListingProps {
  courts: Court[]
  isLoading: boolean
  totalCount: number
}

const CourtsListing: React.FC<CourtsListingProps> = ({ courts, isLoading, totalCount }) => {
  const navigate = useNavigate()
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null)
  const [showReservationModal, setShowReservationModal] = useState(false)

  const handleReserveCourt = (court: Court) => {
    setSelectedCourt(court)
    setShowReservationModal(true)
  }

  const handleCloseModal = () => {
    setSelectedCourt(null)
    setShowReservationModal(false)
  }

  const formatAddress = (address: string | null, state?: { name: string }) => {
    if (!address) return state?.name || 'Location not specified'
    return state?.name ? `${address}, ${state.name}` : address
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800'
      case 'inactive':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <LoadingSpinner size="lg" message="Loading courts..." />
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Available Courts
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Reserve courts at top-rated facilities across Mexico
            </p>
            {totalCount > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Showing {courts.length} of {totalCount} courts
              </p>
            )}
          </div>

          {courts.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courts found</h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your filters or check back later for new court listings.
              </p>
              <button
                onClick={() => navigate('/register')}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Join Federation to Add Courts
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courts.map((court) => (
                <div
                  key={court.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center relative">
                    <div className="text-white text-center">
                      <div className="text-4xl mb-2">🏓</div>
                      <div className="text-sm font-medium">{court.court_count} Court{court.court_count > 1 ? 's' : ''}</div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(court.status)}`}>
                        {court.status.charAt(0).toUpperCase() + court.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {court.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {formatAddress(court.address, court.state)}
                        </p>
                      </div>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {court.owner_type === 'club' ? 'Club' : 'Partner'}
                      </span>
                    </div>
                    
                    {court.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {court.description}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {court.surface_type && (
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {court.surface_type}
                        </span>
                      )}
                      {court.indoor && (
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                          Indoor
                        </span>
                      )}
                      {court.lights && (
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
                          Lights
                        </span>
                      )}
                    </div>
                    
                    {court.amenities && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-1">Amenities:</p>
                        <p className="text-sm text-gray-600 line-clamp-1">{court.amenities}</p>
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/courts/${court.id}`)}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        View Details
                      </button>
                      {court.status === 'active' && (
                        <button
                          onClick={() => handleReserveCourt(court)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200"
                        >
                          Reserve
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedCourt && (
        <CourtReservationModal
          isOpen={showReservationModal}
          onClose={handleCloseModal}
          court={selectedCourt}
        />
      )}
    </>
  )
}

export default CourtsListing