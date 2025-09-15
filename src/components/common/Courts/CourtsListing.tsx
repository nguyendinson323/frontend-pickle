import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'
import { FiMapPin, FiUsers, FiWifi, FiSun } from 'react-icons/fi'
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
      <section className="py-20 bg-white opacity-0 animate-fade-in-up">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <LoadingSpinner size="lg" message="Loading courts..." />
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white opacity-0 animate-fade-in-up">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 opacity-0 animate-fade-in-up [animation-delay:0.2s]">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Available Courts
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
              Reserve courts at top-rated facilities across Mexico
            </p>
            {totalCount > 0 && (
              <p className="text-sm text-gray-500 opacity-0 animate-fade-in-up [animation-delay:0.3s]">
                Showing {courts.length} of {totalCount} courts
              </p>
            )}
          </div>

          {courts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl shadow-lg opacity-0 animate-fade-in-up [animation-delay:0.4s]">
              <div className="w-24 h-24 text-gray-400 mx-auto mb-6 text-6xl animate-bounce">
                🏓
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">No courts found</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Try adjusting your filters or check back later for new court listings.
              </p>
              <button
                onClick={() => navigate('/register')}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Join Federation to Add Courts
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courts.map((court, index) => {
                const gradients = [
                  'from-green-400 to-emerald-600',
                  'from-blue-400 to-cyan-600',
                  'from-purple-400 to-pink-600',
                  'from-orange-400 to-red-600',
                  'from-teal-400 to-green-600',
                  'from-indigo-400 to-purple-600'
                ]

                return (
                  <div
                    key={court.id}
                    className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100 hover:-translate-y-2 hover:scale-105 opacity-0 animate-fade-in-up"
                    style={{animationDelay: `${0.5 + (index * 0.1)}s`}}
                  >
                    <div className={clsx(
                      'h-48 bg-gradient-to-br flex items-center justify-center relative',
                      gradients[index % gradients.length]
                    )}>
                      <div className="text-white text-center">
                        <div className="text-5xl mb-3 hover:scale-125 hover:rotate-12 transition-all duration-300">
                          🏓
                        </div>
                        <div className="text-lg font-semibold">
                          {court.court_count} Court{court.court_count > 1 ? 's' : ''}
                        </div>
                      </div>
                      <div className="absolute top-4 right-4">
                        <span className={clsx(
                          'px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm',
                          getStatusColor(court.status)
                        )}>
                          {court.status.charAt(0).toUpperCase() + court.status.slice(1)}
                        </span>
                      </div>
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
                          {court.owner_type === 'club' ? 'Club' : 'Partner'}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">
                          {court.name}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FiMapPin className="w-4 h-4" />
                          <p className="text-sm">
                            {formatAddress(court.address, court.state)}
                          </p>
                        </div>
                      </div>

                      {court.description && (
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                          {court.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {court.surface_type && (
                          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                            {court.surface_type}
                          </span>
                        )}
                        {court.indoor && (
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                            <FiUsers className="w-3 h-3" />
                            Indoor
                          </span>
                        )}
                        {court.lights && (
                          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                            <FiSun className="w-3 h-3" />
                            Lights
                          </span>
                        )}
                      </div>

                      {court.amenities && (
                        <div className="border-t pt-4">
                          <div className="flex items-center gap-2 mb-2">
                            <FiWifi className="w-4 h-4 text-gray-500" />
                            <p className="text-xs text-gray-500 font-medium">Amenities:</p>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-1">{court.amenities}</p>
                        </div>
                      )}

                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => navigate(`/courts/${court.id}`)}
                          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                        >
                          View Details
                        </button>
                        {court.status === 'active' && (
                          <button
                            onClick={() => handleReserveCourt(court)}
                            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
                          >
                            Reserve
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
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