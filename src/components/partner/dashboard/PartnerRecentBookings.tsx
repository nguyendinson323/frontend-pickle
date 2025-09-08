import React from 'react'
import { useNavigate } from 'react-router-dom'

interface Booking {
  playerName: string
  courtNumber: number
  date: string
  time: string
  amount: number
  status: string
}

interface PartnerRecentBookingsProps {
  recentBookings: Booking[]
}

const PartnerRecentBookings: React.FC<PartnerRecentBookingsProps> = ({ recentBookings }) => {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Bookings</h3>
      {recentBookings.length > 0 ? (
        <div className="space-y-4">
          {recentBookings.slice(0, 4).map((booking, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{booking.playerName}</p>
                <p className="text-sm text-gray-600">Court {booking.courtNumber}</p>
                <p className="text-xs text-gray-500">{booking.date} • {booking.time}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-600">${booking.amount}</p>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {booking.status}
                </span>
              </div>
            </div>
          ))}
          <button
            onClick={() => navigate('/partner/bookings')}
            className="text-orange-600 hover:text-orange-500 text-sm font-medium"
          >
            View all bookings →
          </button>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📅</div>
          <p className="text-gray-600 mb-4">No recent bookings</p>
          <button
            onClick={() => navigate('/partner/courts')}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            Manage Courts
          </button>
        </div>
      )}
    </div>
  )
}

export default PartnerRecentBookings