import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'

const CourtManagement: React.FC = () => {
  const { courts, reservations, loading } = useSelector((state: RootState) => state.club)

  if (loading) {
    return <div className="p-4">Loading court data...</div>
  }

  const activeCourts = courts.filter(c => c.status === 'active')
  const todayReservations = reservations.filter(r => {
    const today = new Date().toDateString()
    return new Date(r.reservation_date).toDateString() === today
  })

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Court Management</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
          Add Court
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Active Courts</h3>
          <p className="text-3xl font-bold text-blue-600">{activeCourts.length}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Today's Reservations</h3>
          <p className="text-3xl font-bold text-green-600">{todayReservations.length}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Monthly Revenue</h3>
          <p className="text-3xl font-bold text-purple-600">
            ${reservations.reduce((sum, r) => sum + (r.total_cost || 0), 0).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Courts</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {courts.map((court) => (
              <div key={court.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{court.name}</h4>
                    <p className="text-sm text-gray-500">
                      Type: {court.court_type} • Surface: {court.surface_type}
                    </p>
                    <p className="text-sm text-gray-500">
                      Hourly Rate: ${court.hourly_rate || 0}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      court.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : court.status === 'maintenance'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {court.status}
                    </span>
                    <button className="text-indigo-600 hover:text-indigo-900 text-sm">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Reservations</h3>
          </div>
          
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {reservations.slice(0, 10).map((reservation) => (
              <div key={reservation.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {reservation.player_name}
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

export default CourtManagement