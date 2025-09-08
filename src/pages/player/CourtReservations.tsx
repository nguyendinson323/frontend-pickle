import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import { 
  searchCourts,
  getCourtAvailability,
  getCourtDetails,
  fetchUserReservations,
  makeCourtReservation,
  cancelCourtReservation,
  setFilters,
  setSelectedDate,
  setSelectedCourt,
  setUserLocation,
  setLocationPermission,
  openReservationModal,
  closeReservationModal
} from '../../store/slices/courtReservationSlice'
import { AppDispatch } from '../../store'

const CourtReservations: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [activeTab, setActiveTab] = useState<'search' | 'my-reservations'>('search')
  
  const {
    courts,
    selectedCourt,
    userReservations,
    filters,
    isLoading,
    error,
    searchPerformed,
    selectedDate,
    availableTimeSlots,
    reservationModal,
    userLocation,
    locationPermission
  } = useSelector((state: RootState) => state.courtReservation)

  useEffect(() => {
    dispatch(fetchUserReservations())
  }, [dispatch])

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      dispatch(setLocationPermission('prompt'))
      navigator.geolocation.getCurrentPosition(
        (position) => {
          dispatch(setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }))
          dispatch(setLocationPermission('granted'))
        },
        (error) => {
          console.error('Location error:', error)
          dispatch(setLocationPermission('denied'))
        }
      )
    } else {
      dispatch(setLocationPermission('denied'))
    }
  }

  const handleSearch = () => {
    dispatch(searchCourts(filters))
  }

  const handleCourtSelect = (courtId: number) => {
    const court = courts.find(c => c.id === courtId)
    if (court) {
      dispatch(setSelectedCourt(court))
      dispatch(getCourtAvailability(courtId, selectedDate))
    }
  }

  const handleDateChange = (date: string) => {
    dispatch(setSelectedDate(date))
    if (selectedCourt) {
      dispatch(getCourtAvailability(selectedCourt.id, date))
    }
  }

  const handleTimeSlotSelect = (courtId: number, timeSlot: any) => {
    if (timeSlot.available) {
      dispatch(openReservationModal({
        courtId,
        date: selectedDate,
        timeSlot
      }))
    }
  }

  const handleMakeReservation = () => {
    if (reservationModal.courtId && reservationModal.selectedDate && reservationModal.selectedSlot) {
      const reservationData = {
        court_id: reservationModal.courtId,
        date: reservationModal.selectedDate,
        start_time: reservationModal.selectedSlot.start_time,
        end_time: reservationModal.selectedSlot.end_time
      }
      
      dispatch(makeCourtReservation(reservationData))
    }
  }

  const handleCancelReservation = (reservationId: number) => {
    dispatch(cancelCourtReservation(reservationId))
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Court Reservations</h1>
              <p className="text-gray-600">Find and book pickleball courts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('search')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'search'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Find Courts
            </button>
            <button
              onClick={() => setActiveTab('my-reservations')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'my-reservations'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Reservations ({userReservations.length})
            </button>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'search' && (
          <div>
            {/* Search Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Search Filters</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Surface Type
                  </label>
                  <select
                    value={filters.surface_type || ''}
                    onChange={(e) => dispatch(setFilters({ surface_type: e.target.value || null }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Any</option>
                    <option value="hard">Hard Court</option>
                    <option value="clay">Clay</option>
                    <option value="grass">Grass</option>
                    <option value="synthetic">Synthetic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Court Type
                  </label>
                  <select
                    value={filters.indoor === null ? '' : filters.indoor.toString()}
                    onChange={(e) => dispatch(setFilters({ 
                      indoor: e.target.value === '' ? null : e.target.value === 'true' 
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Any</option>
                    <option value="false">Outdoor</option>
                    <option value="true">Indoor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lights Available
                  </label>
                  <select
                    value={filters.lights === null ? '' : filters.lights.toString()}
                    onChange={(e) => dispatch(setFilters({ 
                      lights: e.target.value === '' ? null : e.target.value === 'true' 
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Any</option>
                    <option value="false">No Lights</option>
                    <option value="true">Has Lights</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Distance
                  </label>
                  <select
                    value={filters.distance_km || 25}
                    onChange={(e) => dispatch(setFilters({ distance_km: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value={5}>5 km</option>
                    <option value={10}>10 km</option>
                    <option value={25}>25 km</option>
                    <option value={50}>50 km</option>
                    <option value={100}>100 km</option>
                  </select>
                </div>
              </div>

              {/* Location and Search Buttons */}
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center space-x-4">
                  {!userLocation && (
                    <button
                      onClick={handleGetLocation}
                      className="inline-flex items-center px-4 py-2 border border-green-600 text-green-600 text-sm font-medium rounded-md hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      📍 Use My Location
                    </button>
                  )}
                  
                  {userLocation && (
                    <span className="text-sm text-green-600 font-medium">
                      📍 Location enabled
                    </span>
                  )}
                </div>

                <button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="inline-flex items-center px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {isLoading ? 'Searching...' : 'Search Courts'}
                </button>
              </div>
            </div>

            {/* Search Results */}
            {searchPerformed && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Courts List */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Courts Found ({courts.length})
                  </h3>
                  
                  {courts.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                      <p className="text-gray-500">No courts found matching your criteria.</p>
                    </div>
                  ) : (
                    courts.map(court => (
                      <div
                        key={court.id}
                        className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:border-green-500 transition-colors ${
                          selectedCourt?.id === court.id ? 'border-green-500 bg-green-50' : ''
                        }`}
                        onClick={() => handleCourtSelect(court.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">{court.name}</h4>
                            <p className="text-sm text-gray-600">{court.address}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <span>{court.surface_type || 'Mixed'}</span>
                              <span>{court.indoor ? 'Indoor' : 'Outdoor'}</span>
                              {court.lights && <span>🔆 Lit</span>}
                            </div>
                          </div>
                          <div className="text-right">
                            {court.hourlyRate && (
                              <p className="text-lg font-semibold text-green-600">
                                ${court.hourlyRate}/hr
                              </p>
                            )}
                            {court.distance && (
                              <p className="text-sm text-gray-500">{court.distance} km away</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Court Details and Booking */}
                <div>
                  {selectedCourt ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Book {selectedCourt.name}
                      </h3>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Date
                        </label>
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => handleDateChange(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Available Times</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {availableTimeSlots.map((slot, index) => (
                            <button
                              key={index}
                              onClick={() => handleTimeSlotSelect(selectedCourt.id, slot)}
                              disabled={!slot.available}
                              className={`p-3 text-sm rounded-md border transition-colors ${
                                slot.available
                                  ? 'border-green-300 bg-green-50 text-green-700 hover:bg-green-100'
                                  : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              <div>{formatTime(slot.start_time)} - {formatTime(slot.end_time)}</div>
                              <div className="text-xs">${slot.price}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                      <p className="text-gray-500">Select a court to view availability and book</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'my-reservations' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">My Reservations</h3>
            
            {userReservations.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <p className="text-gray-500">You don't have any reservations yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userReservations.map(reservation => (
                  <div
                    key={reservation.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">
                          {reservation.court?.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {reservation.court?.address}
                        </p>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-gray-700">
                            📅 {new Date(reservation.date).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-700">
                            ⏰ {formatTime(reservation.start_time)} - {formatTime(reservation.end_time)}
                          </p>
                          <p className="text-sm text-gray-700">
                            💰 ${reservation.amount}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            reservation.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800'
                              : reservation.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            reservation.payment_status === 'paid' 
                              ? 'bg-green-100 text-green-800'
                              : reservation.payment_status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {reservation.payment_status.charAt(0).toUpperCase() + reservation.payment_status.slice(1)}
                          </span>
                        </div>
                        
                        {reservation.status !== 'canceled' && (
                          <button
                            onClick={() => handleCancelReservation(reservation.id)}
                            className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reservation Modal */}
      {reservationModal.isOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Confirm Reservation
              </h3>
              
              {reservationModal.selectedSlot && (
                <div className="text-left bg-gray-50 p-4 rounded-md mb-4">
                  <p className="text-sm text-gray-600 mb-1">Court: {selectedCourt?.name}</p>
                  <p className="text-sm text-gray-600 mb-1">
                    Date: {new Date(reservationModal.selectedDate!).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    Time: {formatTime(reservationModal.selectedSlot.start_time)} - {formatTime(reservationModal.selectedSlot.end_time)}
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    Price: ${reservationModal.selectedSlot.price}
                  </p>
                </div>
              )}
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => dispatch(closeReservationModal())}
                  className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMakeReservation}
                  disabled={isLoading}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none disabled:opacity-50"
                >
                  {isLoading ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CourtReservations