import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import { 
  searchCourts,
  getCourtAvailability,
  fetchUserReservations,
  makeCourtReservation,
  cancelCourtReservation,
  setFilters,
  setSelectedDate,
  setSelectedCourt,
  setUserLocation,
  setLocationPermission,
  openReservationModal
} from '../../store/slices/courtReservationSlice'
import { AppDispatch } from '../../store'
import { showErrorToast } from '../../store/slices/toastSlice'
import {
  CourtReservationsHeader,
  CourtReservationsTabs,
  CourtReservationsFilters,
  CourtReservationsResults,
  CourtReservationsList,
  CourtReservationModal
} from '../../components/player/courts'

const CourtReservations: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [activeTab, setActiveTab] = useState<'search' | 'my-reservations'>('search')
  
  const {
    courts,
    selectedCourt,
    userReservations,
    filters,
    isLoading,
    searchPerformed,
    selectedDate,
    availableTimeSlots,
    reservationModal,
    userLocation
  } = useSelector((state: RootState) => state.courtReservation)

  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserReservations())
    }
  }, [dispatch, isAuthenticated])

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
    if (!isAuthenticated) {
      dispatch(showErrorToast('Please log in to make a reservation'))
      return
    }

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
    if (!isAuthenticated) {
      dispatch(showErrorToast('Please log in to cancel reservations'))
      return
    }
    dispatch(cancelCourtReservation(reservationId))
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-blue-50">
      <CourtReservationsHeader />
      
      <CourtReservationsTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        reservationCount={userReservations.length}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'search' && (
          <div>
            <CourtReservationsFilters
              filters={filters}
              userLocation={userLocation}
              onFilterChange={(key, value) => dispatch(setFilters({ [key]: value }))}
              onGetLocation={handleGetLocation}
              onSearch={handleSearch}
              isLoading={isLoading}
            />

            <CourtReservationsResults
              searchPerformed={searchPerformed}
              courts={courts}
              selectedCourt={selectedCourt}
              selectedDate={selectedDate}
              availableTimeSlots={availableTimeSlots}
              onCourtSelect={handleCourtSelect}
              onDateChange={handleDateChange}
              onTimeSlotSelect={handleTimeSlotSelect}
              isAuthenticated={isAuthenticated}
            />
          </div>
        )}

        {activeTab === 'my-reservations' && (
          !isAuthenticated ? (
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-200 p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-4xl">🔐</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h3>
              <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                Please log in to view and manage your court reservations and book new courts.
              </p>
              <a
                href="/login"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-bold rounded-2xl hover:from-green-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:transform hover:scale-105"
              >
                Log In to Access Reservations
              </a>
            </div>
          ) : (
            <CourtReservationsList
              userReservations={userReservations}
              onCancelReservation={handleCancelReservation}
            />
          )
        )}
      </div>

      <CourtReservationModal
        reservationModal={reservationModal}
        selectedCourt={selectedCourt}
        onMakeReservation={handleMakeReservation}
        isLoading={isLoading}
      />
    </div>
  )
}

export default CourtReservations