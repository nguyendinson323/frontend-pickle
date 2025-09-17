import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiMapPin,
  FiCalendar,
  FiBarChart,
  FiClock,
  FiArrowRight,
  FiActivity,
  FiTrendingUp
} from 'react-icons/fi'

interface ClubCourtActivityProps {
  todaysBookings?: number
  weeklyUsage?: number
}

const ClubCourtActivity: React.FC<ClubCourtActivityProps> = ({ 
  todaysBookings = 0, 
  weeklyUsage = 0 
}) => {
  const navigate = useNavigate()

  return (
    <div className="bg-white shadow-2xl rounded-3xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-100 p-8 border-b-2 border-indigo-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white mr-4">
              <FiActivity className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Court Activity</h3>
              <p className="text-indigo-700 font-medium">Real-time usage statistics</p>
            </div>
          </div>
          <FiTrendingUp className="h-6 w-6 text-indigo-600" />
        </div>
      </div>

      <div className="p-8">
        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-100 border-2 border-green-200 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white mr-4">
                  <FiCalendar className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-lg font-bold text-green-900 mb-1">Today's Bookings</p>
                  <p className="text-3xl font-bold text-green-900">{todaysBookings}</p>
                </div>
              </div>
              <FiTrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>

          <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-100 border-2 border-blue-200 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white mr-4">
                  <FiBarChart className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-lg font-bold text-blue-900 mb-1">Weekly Usage</p>
                  <p className="text-3xl font-bold text-blue-900">{weeklyUsage}%</p>
                </div>
              </div>
              <FiTrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>

          <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-100 border-2 border-yellow-200 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center text-white mr-4">
                  <FiClock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-lg font-bold text-yellow-900 mb-1">Peak Hours</p>
                  <p className="text-lg font-bold text-yellow-900">6PM - 8PM</p>
                </div>
              </div>
              <FiTrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={() => navigate('/club/courts')}
              className="inline-flex items-center w-full justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-bold rounded-2xl hover:from-indigo-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FiMapPin className="h-5 w-5 mr-2" />
              Manage Court Schedules
              <FiArrowRight className="h-5 w-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClubCourtActivity