import React, { useState } from 'react'
import CourtCalendarView from './CourtCalendarView'
import {
  FiCalendar,
  FiList,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
  FiDollarSign,
  FiCheck,
  FiX,
  FiFilter,
  FiEye,
  FiCheckCircle,
  FiXCircle
} from 'react-icons/fi'

interface CourtReservation {
  id: number
  court_id: number
  player_id: number
  date: string
  start_time: string
  end_time: string
  status: 'pending' | 'confirmed' | 'canceled'
  amount: number
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
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')

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

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'confirmed':
        return {
          className: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200',
          icon: FiCheckCircle
        }
      case 'pending':
        return {
          className: 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200',
          icon: FiClock
        }
      case 'canceled':
        return {
          className: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-200',
          icon: FiXCircle
        }
      default:
        return {
          className: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-200',
          icon: FiClock
        }
    }
  }

  const getPaymentStatusInfo = (status: string) => {
    switch (status) {
      case 'paid':
        return {
          className: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200',
          icon: FiCheckCircle
        }
      case 'pending':
        return {
          className: 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200',
          icon: FiClock
        }
      case 'refunded':
        return {
          className: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-200',
          icon: FiXCircle
        }
      default:
        return {
          className: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-200',
          icon: FiClock
        }
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
    <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-purple-50 to-indigo-100 px-8 py-6 border-b-2 border-purple-200">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white mr-4">
              <FiCalendar className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Reservations Management</h3>
              <p className="text-purple-700 font-medium">{filteredReservations.length} reservation{filteredReservations.length !== 1 ? 's' : ''} found</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setViewMode('list')}
              className={`inline-flex items-center px-4 py-2 text-sm font-bold rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                viewMode === 'list'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-700 text-white'
                  : 'bg-white text-purple-700 border-2 border-purple-200 hover:border-purple-300'
              }`}
            >
              <FiList className="h-4 w-4 mr-2" />
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`inline-flex items-center px-4 py-2 text-sm font-bold rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                viewMode === 'calendar'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-700 text-white'
                  : 'bg-white text-purple-700 border-2 border-purple-200 hover:border-purple-300'
              }`}
            >
              <FiCalendar className="h-4 w-4 mr-2" />
              Calendar View
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 border-2 border-purple-200 shadow-lg">
          <div className="flex items-center mb-3">
            <FiFilter className="h-5 w-5 text-purple-600 mr-2" />
            <h4 className="text-lg font-bold text-gray-900">Filter Reservations</h4>
          </div>
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                <FiCheckCircle className="h-4 w-4 mr-1" />
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-sm px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium transition-all duration-200"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>

            <div>
              <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                <FiCalendar className="h-4 w-4 mr-1" />
                Date Range
              </label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="text-sm px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium transition-all duration-200"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        <CourtCalendarView
          reservations={reservations}
          selectedCourtId={selectedCourtId}
        />
      ) : filteredReservations.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <FiCalendar className="h-12 w-12 text-gray-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">No Reservations Found</h3>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            No reservations match your current filters. Try adjusting the filters or check back later.
          </p>
        </div>
      ) : (
        <div className="divide-y-2 divide-gray-100">
          {filteredReservations.map((reservation, index) => {
            const statusInfo = getStatusInfo(reservation.status)
            const paymentInfo = getPaymentStatusInfo(reservation.payment_status)
            const StatusIcon = statusInfo.icon
            const PaymentIcon = paymentInfo.icon

            return (
              <div key={reservation.id} className="p-8 hover:bg-gradient-to-r hover:from-gray-50 hover:to-purple-50 transition-all duration-200 animate-table-row" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    {/* Player Photo */}
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg">
                      {reservation.player.profile_photo_url ? (
                        <img
                          src={reservation.player.profile_photo_url}
                          alt={reservation.player.full_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xl font-bold text-white">
                          {reservation.player.full_name.charAt(0)}
                        </span>
                      )}
                    </div>

                    {/* Reservation Details */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <h4 className="text-xl font-bold text-gray-900">
                          {reservation.player.full_name}
                        </h4>
                        <div className={`inline-flex items-center px-3 py-1 text-sm font-bold rounded-2xl border-2 ${statusInfo.className} shadow-sm`}>
                          <StatusIcon className="h-4 w-4 mr-2" />
                          {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                        </div>
                        <div className={`inline-flex items-center px-3 py-1 text-sm font-bold rounded-2xl border-2 ${paymentInfo.className} shadow-sm`}>
                          <PaymentIcon className="h-4 w-4 mr-2" />
                          {reservation.payment_status.charAt(0).toUpperCase() + reservation.payment_status.slice(1)}
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="flex items-center p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                            <FiMapPin className="h-5 w-5 text-purple-500 mr-3 flex-shrink-0" />
                            <div>
                              <span className="text-sm font-bold text-gray-700">Court:</span>
                              <p className="text-sm font-medium text-gray-900">{reservation.court.name}</p>
                            </div>
                          </div>
                          <div className="flex items-center p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                            <FiCalendar className="h-5 w-5 text-purple-500 mr-3 flex-shrink-0" />
                            <div>
                              <span className="text-sm font-bold text-gray-700">Date:</span>
                              <p className="text-sm font-medium text-gray-900">{formatDate(reservation.date)}</p>
                            </div>
                          </div>
                          <div className="flex items-center p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                            <FiClock className="h-5 w-5 text-purple-500 mr-3 flex-shrink-0" />
                            <div>
                              <span className="text-sm font-bold text-gray-700">Time:</span>
                              <p className="text-sm font-medium text-gray-900">{formatTime(reservation.start_time)} - {formatTime(reservation.end_time)}</p>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="flex items-center p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                            <FiMail className="h-5 w-5 text-purple-500 mr-3 flex-shrink-0" />
                            <div>
                              <span className="text-sm font-bold text-gray-700">Email:</span>
                              <p className="text-sm font-medium text-gray-900">{reservation.player.user.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                            <FiPhone className="h-5 w-5 text-purple-500 mr-3 flex-shrink-0" />
                            <div>
                              <span className="text-sm font-bold text-gray-700">Phone:</span>
                              <p className="text-sm font-medium text-gray-900">{reservation.player.user.phone}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                </div>

                  {/* Actions and Amount */}
                  <div className="flex flex-col items-end space-y-4 ml-6">
                    <div className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-100 rounded-2xl border-2 border-green-200 shadow-lg">
                      <FiDollarSign className="h-6 w-6 text-green-600 mr-2" />
                      <div className="text-right">
                        <p className="text-sm font-bold text-green-700">Amount</p>
                        <p className="text-2xl font-bold text-green-900">
                          ${reservation.amount.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {reservation.status === 'pending' && (
                      <div className="flex space-x-3">
                        <button
                          onClick={() => onUpdateStatus(reservation.id, 'confirmed')}
                          className="inline-flex items-center px-4 py-2 text-sm font-bold text-green-700 bg-gradient-to-r from-green-100 to-green-200 border-2 border-green-200 rounded-xl hover:from-green-200 hover:to-green-300 hover:border-green-300 shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <FiCheck className="h-4 w-4 mr-2" />
                          Confirm
                        </button>
                        <button
                          onClick={() => onUpdateStatus(reservation.id, 'canceled')}
                          className="inline-flex items-center px-4 py-2 text-sm font-bold text-red-700 bg-gradient-to-r from-red-100 to-red-200 border-2 border-red-200 rounded-xl hover:from-red-200 hover:to-red-300 hover:border-red-300 shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <FiX className="h-4 w-4 mr-2" />
                          Cancel
                        </button>
                      </div>
                    )}

                    {reservation.status === 'confirmed' && (
                      <button
                        onClick={() => onUpdateStatus(reservation.id, 'canceled')}
                        className="inline-flex items-center px-4 py-2 text-sm font-bold text-red-700 bg-gradient-to-r from-red-100 to-red-200 border-2 border-red-200 rounded-xl hover:from-red-200 hover:to-red-300 hover:border-red-300 shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <FiX className="h-4 w-4 mr-2" />
                        Cancel
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
  )
}

export default ReservationsManager