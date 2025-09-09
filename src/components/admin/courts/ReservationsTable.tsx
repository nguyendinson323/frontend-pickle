import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../store'
import { 
  updateReservationStatusAction,
  addSelectedReservation,
  removeSelectedReservation
} from '../../../store/slices/adminCourtsSlice'

const ReservationsTable: React.FC = () => {
  const dispatch = useDispatch()
  const { reservations, selectedReservations, loading } = useSelector((state: RootState) => state.adminCourts)

  const handleStatusChange = async (reservationId: number, status: 'active' | 'completed' | 'cancelled' | 'no_show') => {
    try {
      await dispatch(updateReservationStatusAction(reservationId, status) as any)
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
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'no_show': return 'bg-gray-100 text-gray-800'
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
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Court Reservations</h3>
      </div>

      {reservations.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No reservations found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    onChange={(e) => {
                      // Toggle all reservations selection logic could be added here
                    }}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Court
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reservations.map((reservation) => {
                const startDateTime = formatDateTime(reservation.start_time)
                const endDateTime = formatDateTime(reservation.end_time)
                
                return (
                  <tr key={reservation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedReservations.includes(reservation.id)}
                        onChange={(e) => handleCheckboxChange(reservation.id, e.target.checked)}
                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{reservation.user_name}</div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(reservation.user_type)}`}>
                        {reservation.user_type.charAt(0).toUpperCase() + reservation.user_type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">Court #{reservation.court_id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{startDateTime.date}</div>
                      <div className="text-sm text-gray-500">
                        {startDateTime.time} - {endDateTime.time}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={reservation.status}
                        onChange={(e) => handleStatusChange(reservation.id, e.target.value as 'active' | 'completed' | 'cancelled' | 'no_show')}
                        className={`text-xs font-semibold rounded-full px-2 py-1 border-none focus:ring-2 focus:ring-indigo-200 ${getStatusColor(reservation.status)}`}
                      >
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="no_show">No Show</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${reservation.amount_paid}
                      </div>
                      <div className={`text-xs font-medium ${getPaymentStatusColor(reservation.payment_status)}`}>
                        {reservation.payment_status.charAt(0).toUpperCase() + reservation.payment_status.slice(1)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {reservation.status === 'active' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(reservation.id, 'completed')}
                            className="text-green-600 hover:text-green-900 transition-colors"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => handleStatusChange(reservation.id, 'cancelled')}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {reservation.status === 'cancelled' && reservation.payment_status === 'paid' && (
                        <span className="text-blue-600">Refund Processed</span>
                      )}
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