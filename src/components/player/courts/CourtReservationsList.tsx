import React from 'react'

interface CourtReservation {
  id: number
  court?: {
    name: string
    address: string
  }
  date: string
  start_time: string
  end_time: string
  amount: number
  status: 'confirmed' | 'pending' | 'canceled'
  payment_status: 'paid' | 'pending' | 'failed'
}

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
                      onClick={() => onCancelReservation(reservation.id)}
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
  )
}

export default CourtReservationsList