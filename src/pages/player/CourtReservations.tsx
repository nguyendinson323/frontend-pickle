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
            />
          </div>
        )}

        {activeTab === 'my-reservations' && (
          <CourtReservationsList
            userReservations={userReservations}
            onCancelReservation={handleCancelReservation}
          />
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