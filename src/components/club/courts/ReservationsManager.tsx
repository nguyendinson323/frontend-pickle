import React, { useState } from 'react'

interface CourtReservation {
  id: number
  court_id: number
  player_id: number
  date: string
  start_time: string
  end_time: string
  status: 'pending' | 'confirmed' | 'canceled'
  total_amount: number
  payment_status: 'pending' | 'paid' | 'refunded'
  stripe_payment_id: string | null
  created_at: string
  player: {
    id: number
    full_name: string
    profile_photo_url: string | null
    user: {
      email: string
      phone: string
    }
  }
  court: {
    id: number
    name: string
  }
}

interface ReservationsManagerProps {
  reservations: CourtReservation[]
  onUpdateStatus: (reservationId: number, status: string) => void
  selectedCourtId?: number
}

const ReservationsManager: React.FC<ReservationsManagerProps> = ({
  reservations,
  onUpdateStatus,
  selectedCourtId
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('all')

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'canceled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'refunded':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Filter reservations
  let filteredReservations = reservations

  if (selectedCourtId) {
    filteredReservations = filteredReservations.filter(res => res.court_id === selectedCourtId)
  }

  if (statusFilter !== 'all') {
    filteredReservations = filteredReservations.filter(res => res.status === statusFilter)
  }

  if (dateFilter === 'today') {
    const today = new Date().toISOString().split('T')[0]
    filteredReservations = filteredReservations.filter(res => res.date === today)
  } else if (dateFilter === 'upcoming') {
    const today = new Date().toISOString().split('T')[0]
    filteredReservations = filteredReservations.filter(res => res.date >= today)
  } else if (dateFilter === 'past') {
    const today = new Date().toISOString().split('T')[0]
    filteredReservations = filteredReservations.filter(res => res.date < today)
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Reservations ({filteredReservations.length})
          </h3>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="text-sm px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>
        </div>
      </div>

      {filteredReservations.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500">
            <div className="text-4xl mb-2">📅</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Reservations Found</h3>
            <p className="text-gray-600">
              No reservations match your current filters.
            </p>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {filteredReservations.map((reservation) => (
            <div key={reservation.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Player Photo */}
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    {reservation.player.profile_photo_url ? (
                      <img 
                        src={reservation.player.profile_photo_url} 
                        alt={reservation.player.full_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-semibold text-gray-600">
                        {reservation.player.full_name.charAt(0)}
                      </span>
                    )}
                  </div>

                  {/* Reservation Details */}
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <h4 className="text-lg font-medium text-gray-900">
                        {reservation.player.full_name}
                      </h4>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(reservation.status)}`}>
                        {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(reservation.payment_status)}`}>
                        {reservation.payment_status.charAt(0).toUpperCase() + reservation.payment_status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center space-x-4">
                        <span>
                          <span className="font-medium">Court:</span> {reservation.court.name}
                        </span>
                        <span>
                          <span className="font-medium">Date:</span> {formatDate(reservation.date)}
                        </span>
                        <span>
                          <span className="font-medium">Time:</span> {formatTime(reservation.start_time)} - {formatTime(reservation.end_time)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span>
                          <span className="font-medium">Email:</span> {reservation.player.user.email}
                        </span>
                        <span>
                          <span className="font-medium">Phone:</span> {reservation.player.user.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions and Amount */}
                <div className="text-right">
                  <div className="mb-2">
                    <div className="text-lg font-semibold text-gray-900">
                      ${reservation.total_amount.toFixed(2)}
                    </div>
                  </div>
                  
                  {reservation.status === 'pending' && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onUpdateStatus(reservation.id, 'confirmed')}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => onUpdateStatus(reservation.id, 'canceled')}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {reservation.status === 'confirmed' && (
                    <button
                      onClick={() => onUpdateStatus(reservation.id, 'canceled')}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
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

export default ReservationsManager