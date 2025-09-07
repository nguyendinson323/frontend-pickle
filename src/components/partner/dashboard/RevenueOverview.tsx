import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'

const RevenueOverview: React.FC = () => {
  const { stats, courts, reservations, loading } = useSelector((state: RootState) => state.partner)

  if (loading) {
    return <div className="p-4">Loading revenue data...</div>
  }

  const monthlyRevenue = stats?.monthlyRevenue || 0
  const todayReservations = stats?.todayReservations || 0
  const totalBookings = stats?.totalBookings || 0

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Revenue Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Monthly Revenue</h3>
          <p className="text-3xl font-bold text-green-600">
            ${monthlyRevenue.toLocaleString()}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Today's Reservations</h3>
          <p className="text-3xl font-bold text-blue-600">{todayReservations}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Bookings</h3>
          <p className="text-3xl font-bold text-purple-600">{totalBookings}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Active Courts</h3>
          <p className="text-3xl font-bold text-orange-600">{stats?.totalCourts || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Revenue by Court</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {courts.map((court) => {
              const courtRevenue = reservations
                .filter(r => r.court_id === court.id)
                .reduce((sum, r) => sum + (r.total_cost || 0), 0)
              
              return (
                <div key={court.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{court.name}</h4>
                      <p className="text-sm text-gray-500">
                        Rate: ${court.hourly_rate || 0}/hour
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ${courtRevenue.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">This month</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Bookings</h3>
          </div>
          
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {reservations.slice(0, 10).map((reservation) => (
              <div key={reservation.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {reservation.player_name || 'Guest'}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {reservation.court_name} • {new Date(reservation.reservation_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {reservation.start_time} - {reservation.end_time}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      ${reservation.total_cost || 0}
                    </p>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      reservation.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800'
                        : reservation.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {reservation.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RevenueOverview