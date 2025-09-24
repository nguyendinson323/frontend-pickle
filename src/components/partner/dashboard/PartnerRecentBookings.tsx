import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiCalendar,
  FiActivity,
  FiClock,
  FiDollarSign,
  FiCheckCircle,
  FiArrowRight
} from 'react-icons/fi'

interface Booking {
  id: number
  player_name: string
  court_number: number
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
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl p-8">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mr-3">
          <FiCalendar className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Recent Bookings</h3>
      </div>
      {recentBookings.length > 0 ? (
        <div className="space-y-4">
          {recentBookings.slice(0, 4).map((booking, index) => (
            <div key={booking.id || index} className="p-6 bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-2xl hover:shadow-lg transition-all duration-200 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center">
                    <FiActivity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">{booking.player_name}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <FiActivity className="w-4 h-4" />
                      <span>Court {booking.court_number}</span>
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      <FiClock className="w-4 h-4" />
                      <span>{booking.date} • {booking.time}</span>
                    </div>
                  </div>
                </div>
                <div className="text-center sm:text-right">
                  <div className="flex items-center justify-center sm:justify-end mb-2">
                    <FiDollarSign className="w-5 h-5 text-green-600 mr-1" />
                    <span className="text-2xl font-bold text-green-600">${booking.amount}</span>
                  </div>
                  <span className="inline-flex items-center bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 text-green-800 text-sm font-bold px-3 py-1 rounded-2xl">
                    <FiCheckCircle className="w-4 h-4 mr-1" />
                    {booking.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => navigate('/partner/management')}
            className="text-orange-600 hover:text-orange-700 text-sm font-bold flex items-center transition-colors duration-200"
          >
            View all bookings
            <FiArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <FiCalendar className="w-10 h-10 text-gray-400" />
          </div>
          <h4 className="text-2xl font-bold text-gray-900 mb-3">No Recent Bookings</h4>
          <p className="text-gray-600 font-medium text-lg mb-6">Court bookings will appear here when they're made.</p>
          <button
            onClick={() => navigate('/partner/management')}
            className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105 flex items-center mx-auto"
          >
            <FiActivity className="w-5 h-5 mr-2" />
            Manage Courts
          </button>
        </div>
      )}
    </div>
  )
}

export default PartnerRecentBookings