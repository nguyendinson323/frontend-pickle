import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import { fetchCourt } from '../../store/thunks/courtsThunks'
import { clearCurrentCourt } from '../../store/slices/courtsSlice'
import { LoadingSpinner } from '../../components/common'
import { CourtReservationModal } from '../../components/common/Courts/CourtReservationModal'

const CourtDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  
  const { currentCourt, isLoading } = useSelector((state: RootState) => state.courts)
  const { user } = useSelector((state: RootState) => state.auth)
  
  const [showReservationModal, setShowReservationModal] = useState(false)

  useEffect(() => {
    if (id) {
      const courtId = parseInt(id)
      if (!isNaN(courtId)) {
        dispatch(fetchCourt(courtId))
      }
    }

    return () => {
      // Clear current court when leaving the page
      dispatch(clearCurrentCourt())
    }
  }, [dispatch, id])

  useEffect(() => {
    if (currentCourt) {
      document.title = `${currentCourt.name} - Courts - Mexican Pickleball Federation`
    } else {
      document.title = 'Court Details - Mexican Pickleball Federation'
    }
  }, [currentCourt])

  const handleReserve = () => {
    if (!user) {
      navigate('/login')
      return
    }
    setShowReservationModal(true)
  }

  const handleCloseModal = () => {
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

  const getDayName = (dayNumber: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return days[dayNumber]
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" message="Loading court details..." />
      </div>
    )
  }

  if (!currentCourt) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Court not found</h3>
          <p className="text-gray-500 mb-6">The court you're looking for doesn't exist or may have been removed.</p>
          <button
            onClick={() => navigate('/courts')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            Back to Courts
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative h-64 bg-gradient-to-r from-green-600 to-green-700">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="flex items-center justify-between">
                <div>
                  <button
                    onClick={() => navigate('/courts')}
                    className="text-white hover:text-gray-200 mb-4 flex items-center text-sm font-medium transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Courts
                  </button>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {currentCourt.name}
                  </h1>
                  <p className="text-lg text-gray-200">
                    {formatAddress(currentCourt.address, currentCourt.state)}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentCourt.status)}`}>
                    {currentCourt.status.charAt(0).toUpperCase() + currentCourt.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Court Information */}
              <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Court Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Courts Available</h3>
                    <div className="flex items-center text-2xl font-bold text-gray-900">
                      <span className="text-4xl mr-3">🏓</span>
                      {currentCourt.court_count} Court{currentCourt.court_count > 1 ? 's' : ''}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Owner Type</h3>
                    <div className="text-lg font-semibold text-gray-900">
                      {currentCourt.owner_type === 'club' ? 'Club' : 'Partner'}
                    </div>
                  </div>

                  {currentCourt.surface_type && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Surface Type</h3>
                      <div className="text-lg font-semibold text-gray-900">{currentCourt.surface_type}</div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentCourt.indoor && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                          Indoor
                        </span>
                      )}
                      {currentCourt.lights && (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-medium">
                          Lights Available
                        </span>
                      )}
                      {!currentCourt.indoor && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                          Outdoor
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {currentCourt.description && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Description</h3>
                    <p className="text-gray-700 leading-relaxed">{currentCourt.description}</p>
                  </div>
                )}

                {currentCourt.amenities && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Amenities</h3>
                    <p className="text-gray-700 leading-relaxed">{currentCourt.amenities}</p>
                  </div>
                )}
              </div>

              {/* Operating Schedule */}
              {currentCourt.schedules && currentCourt.schedules.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Operating Schedule</h2>
                  <div className="space-y-3">
                    {currentCourt.schedules.map((schedule) => (
                      <div key={schedule.id} className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div className="font-medium text-gray-900">
                          {getDayName(schedule.day_of_week)}
                        </div>
                        <div className="text-gray-600">
                          {schedule.is_closed ? (
                            <span className="text-red-600 font-medium">Closed</span>
                          ) : (
                            `${schedule.open_time} - ${schedule.close_time}`
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-8 sticky top-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Reserve Court</h2>
                
                {currentCourt.status === 'active' ? (
                  <div>
                    <p className="text-gray-600 mb-6">
                      Book your game at this facility and enjoy quality courts with great amenities.
                    </p>
                    
                    <button
                      onClick={handleReserve}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200"
                    >
                      Reserve Court
                    </button>
                    
                    {!user && (
                      <p className="text-sm text-gray-500 mt-3 text-center">
                        You need to be logged in to make reservations
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                      <div className="flex">
                        <svg className="w-5 h-5 text-yellow-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.982 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <div>
                          <h3 className="text-sm font-medium text-yellow-800 mb-1">
                            {currentCourt.status === 'maintenance' ? 'Under Maintenance' : 'Currently Inactive'}
                          </h3>
                          <p className="text-sm text-yellow-700">
                            {currentCourt.status === 'maintenance' 
                              ? 'This court is currently under maintenance and not available for reservations.'
                              : 'This court is currently inactive and not accepting reservations.'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact Information */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Contact the court owner or federation support for assistance with reservations.
                  </p>
                  <button
                    onClick={() => navigate('/contact')}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                  >
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reservation Modal */}
      {currentCourt && (
        <CourtReservationModal
          isOpen={showReservationModal}
          onClose={handleCloseModal}
          court={currentCourt}
        />
      )}
    </>
  )
}

export default CourtDetailPage