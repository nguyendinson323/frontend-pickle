import React from 'react'
import { CourtReservation } from '../../../store/slices/courtReservationSlice'

interface CourtReservationsListProps {
  userReservations: CourtReservation[]
  onCancelReservation: (reservationId: number) => void
}

const CourtReservationsList: React.FC<CourtReservationsListProps> = ({
  userReservations,
  onCancelReservation
}) => {
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const isPastReservation = (reservation: CourtReservation) => {
    const reservationDateTime = new Date(`${reservation.date}T${reservation.end_time}`)
    return reservationDateTime < new Date()
  }

  const canCancelReservation = (reservation: CourtReservation) => {
    return reservation.status !== 'canceled' && !isPastReservation(reservation)
  }

  return (
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
              className={`bg-white rounded-lg shadow-sm border p-6 ${
                isPastReservation(reservation)
                  ? 'border-gray-200 bg-gray-50'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">
                    {reservation.court?.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {reservation.court?.address}
                  </p>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center text-sm text-gray-700">
                      <span className="mr-2">📅</span>
                      <span>{new Date(reservation.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <span className="mr-2">⏰</span>
                      <span>{formatTime(reservation.start_time)} - {formatTime(reservation.end_time)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <span className="mr-2">💰</span>
                      <span className="font-medium">${reservation.amount}</span>
                    </div>
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
                  
                  {isPastReservation(reservation) && (
                    <span className="inline-block mt-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                      Past Reservation
                    </span>
                  )}

                  {canCancelReservation(reservation) && (
                    <button
                      onClick={() => onCancelReservation(reservation.id)}
                      className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
                    >
                      Cancel Reservation
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CourtReservationsList