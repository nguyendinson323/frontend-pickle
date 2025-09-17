import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import {
  updateReservationStatusAction,
  addSelectedReservation,
  removeSelectedReservation
} from '../../../store/slices/adminCourtsSlice'
import {
  FiCalendar,
  FiUser,
  FiMapPin,
  FiClock,
  FiCheck,
  FiX,
  FiDollarSign,
  FiCreditCard,
  FiLoader,
  FiFilter,
  FiUsers,
  FiActivity,
  FiSettings
} from 'react-icons/fi'

const ReservationsTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { reservations, selectedReservations, loading } = useSelector((state: RootState) => state.adminCourts)

  const handleStatusChange = async (reservationId: number, status: 'pending' | 'confirmed' | 'canceled' | 'completed' | 'active' | 'cancelled' | 'no_show') => {
    try {
      await dispatch(updateReservationStatusAction(reservationId, status))
    } catch (error) {
      console.error('Failed to update reservation status:', error)
    }
  }

  const handleCheckboxChange = (reservationId: number, checked: boolean) => {
    if (checked) {
      dispatch(addSelectedReservation(reservationId))
    } else {
      dispatch(removeSelectedReservation(reservationId))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'cancelled':
      case 'canceled': return 'bg-red-100 text-red-800'
      case 'no_show': return 'bg-gray-100 text-gray-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600'
      case 'pending': return 'text-yellow-600'
      case 'refunded': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'player': return 'bg-blue-100 text-blue-800'
      case 'coach': return 'bg-purple-100 text-purple-800'
      case 'club': return 'bg-indigo-100 text-indigo-800'
      case 'partner': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  }

  if (loading) {
    return (
      <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <FiCalendar className="mr-2 h-5 w-5" />
            Court Reservations
          </h3>
        </div>
        <div className="flex items-center justify-center p-16">
          <div className="text-center">
            <FiLoader className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Loading reservations data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <FiCalendar className="mr-2 h-5 w-5" />
            Court Reservations
          </h3>
          <div className="flex items-center text-sm text-gray-600">
            <FiFilter className="mr-1 h-4 w-4" />
            {reservations.length} reservations found
          </div>
        </div>
      </div>

      {reservations.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCalendar className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reservations found</h3>
          <p className="text-gray-500">No court reservations are currently available.</p>
          <p className="text-sm text-gray-400 mt-1">Reservations will appear here once courts are booked.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    className="rounded-lg border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 h-4 w-4"
                    onChange={(_e) => {
                      // Toggle all reservations selection logic could be added here
                    }}
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FiUser className="mr-2 h-4 w-4" />
                    User
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FiMapPin className="mr-2 h-4 w-4" />
                    Court
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FiClock className="mr-2 h-4 w-4" />
                    Date & Time
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FiActivity className="mr-2 h-4 w-4" />
                    Status
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FiDollarSign className="mr-2 h-4 w-4" />
                    Payment
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reservations.map((reservation) => {
                const startDateTime = formatDateTime(reservation.start_time)
                const endDateTime = formatDateTime(reservation.end_time)
                
                return (
                  <tr
                    key={reservation.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedReservations.includes(reservation.id)}
                        onChange={(e) => handleCheckboxChange(reservation.id, e.target.checked)}
                        className="rounded-lg border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 h-4 w-4"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-sm">
                          {reservation.player_name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-bold text-gray-900">{reservation.player_name}</div>
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(reservation.user_type)}`}>
                            <FiUsers className="mr-1 h-3 w-3" />
                            {reservation.user_type.charAt(0).toUpperCase() + reservation.user_type.slice(1)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiMapPin className="mr-2 h-4 w-4 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{reservation.court_name}</div>
                          <div className="text-xs text-gray-500">Court #{reservation.court_id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <FiClock className="mr-2 h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{startDateTime.date}</div>
                          <div className="text-xs text-gray-500">
                            {startDateTime.time} - {endDateTime.time}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={reservation.status}
                        onChange={(e) => handleStatusChange(reservation.id, e.target.value as 'pending' | 'confirmed' | 'canceled' | 'completed' | 'active' | 'cancelled' | 'no_show')}
                        className={`text-xs font-semibold rounded-full px-3 py-2 border-none focus:ring-2 focus:ring-indigo-200 transition-all duration-200 cursor-pointer hover:scale-105 ${getStatusColor(reservation.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="canceled">Canceled</option>
                        <option value="no_show">No Show</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiDollarSign className="mr-2 h-4 w-4 text-gray-400" />
                        <div>
                          <div className="text-sm font-bold text-gray-900">
                            ${reservation.amount}
                          </div>
                          <div className={`flex items-center text-xs font-medium ${getPaymentStatusColor(reservation.payment_status)}`}>
                            <FiCreditCard className="mr-1 h-3 w-3" />
                            {reservation.payment_status.charAt(0).toUpperCase() + reservation.payment_status.slice(1)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-2">
                        {(reservation.status === 'active' || reservation.status === 'confirmed') && (
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleStatusChange(reservation.id, 'completed')}
                              className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-lg hover:bg-green-200 transition-all duration-200 hover:scale-105"
                            >
                              <FiCheck className="mr-1 h-3 w-3" />
                              Complete
                            </button>
                            <button
                              onClick={() => handleStatusChange(reservation.id, 'cancelled')}
                              className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-lg hover:bg-red-200 transition-all duration-200 hover:scale-105"
                            >
                              <FiX className="mr-1 h-3 w-3" />
                              Cancel
                            </button>
                          </div>
                        )}
                        {(reservation.status === 'cancelled' || reservation.status === 'canceled') && reservation.payment_status === 'paid' && (
                          <div className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-lg">
                            <FiCreditCard className="mr-1 h-3 w-3" />
                            Refund Processed
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ReservationsTable