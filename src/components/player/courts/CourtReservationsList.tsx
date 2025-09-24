import React from 'react'
import { CourtReservation } from '../../../store/slices/courtReservationSlice'
import {
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiMapPin,
  FiCheckCircle,
  FiAlertCircle,
  FiXCircle,
  FiX,
  FiList
} from 'react-icons/fi'

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
      <div className="bg-gradient-to-r from-purple-600 to-pink-700 rounded-2xl p-6 mb-8 text-white">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mr-4">
            <FiList className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-1">My Reservations</h3>
            <p className="text-purple-100">Manage your court bookings</p>
          </div>
        </div>
      </div>

      {userReservations.length === 0 ? (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FiCalendar className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">No Reservations Yet</h3>
          <p className="text-gray-600 text-lg">You don't have any reservations yet.</p>
          <p className="text-sm text-gray-500 mt-4">Start by searching for courts and booking your first session!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {userReservations.map(reservation => (
            <div
              key={reservation.id}
              className={`rounded-3xl shadow-lg border-2 transition-all duration-300 p-8 ${
                isPastReservation(reservation)
                  ? 'border-gray-300 bg-gradient-to-br from-gray-100 to-gray-200 opacity-75'
                  : 'border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:shadow-xl hover:transform hover:scale-105'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1 mb-6 lg:mb-0">
                  <div className="flex items-start mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4 flex-shrink-0">
                      <FiMapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-gray-900 mb-2">
                        {reservation.court?.name}
                      </h4>
                      <p className="text-gray-600 flex items-center">
                        <FiMapPin className="w-4 h-4 mr-2" />
                        {reservation.court?.address}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                      <div className="flex items-center text-blue-800">
                        <FiCalendar className="w-5 h-5 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-blue-700">Date</p>
                          <p className="text-base font-bold">
                            {new Date(reservation.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-2xl p-4 border border-green-200">
                      <div className="flex items-center text-green-800">
                        <FiClock className="w-5 h-5 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-green-700">Time</p>
                          <p className="text-base font-bold">
                            {formatTime(reservation.start_time)} - {formatTime(reservation.end_time)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 rounded-2xl p-4 border border-purple-200">
                      <div className="flex items-center text-purple-800">
                        <FiDollarSign className="w-5 h-5 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-purple-700">Amount</p>
                          <p className="text-base font-bold">${reservation.amount}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-4">
                  <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                    <div className={`inline-flex items-center px-4 py-2 rounded-2xl text-sm font-bold ${
                      reservation.status === 'confirmed'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                        : reservation.status === 'pending'
                        ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white'
                        : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                    }`}>
                      {reservation.status === 'confirmed' && <FiCheckCircle className="w-4 h-4 mr-2" />}
                      {reservation.status === 'pending' && <FiAlertCircle className="w-4 h-4 mr-2" />}
                      {reservation.status === 'canceled' && <FiXCircle className="w-4 h-4 mr-2" />}
                      {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                    </div>

                    <div className={`inline-flex items-center px-4 py-2 rounded-2xl text-sm font-bold ${
                      reservation.payment_status === 'paid'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                        : reservation.payment_status === 'pending'
                        ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white'
                        : 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
                    }`}>
                      <FiDollarSign className="w-4 h-4 mr-2" />
                      {reservation.payment_status.charAt(0).toUpperCase() + reservation.payment_status.slice(1)}
                    </div>
                  </div>

                  {isPastReservation(reservation) && (
                    <div className="bg-gray-200 text-gray-700 px-4 py-2 rounded-2xl text-sm font-medium">
                      Past Reservation
                    </div>
                  )}

                  {canCancelReservation(reservation) && (
                    <button
                      onClick={() => onCancelReservation(reservation.id)}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-2xl hover:from-red-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:transform hover:scale-105"
                    >
                      <FiX className="w-5 h-5 mr-2" />
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