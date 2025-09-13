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
    <div className="min-h-screen ">
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="text-gray-400 mb-4">
                <span className="text-4xl">🔐</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Login Required</h3>
              <p className="text-gray-500 mb-4">
                Please log in to view and manage your court reservations.
              </p>
              <a
                href="/login"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Log In
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