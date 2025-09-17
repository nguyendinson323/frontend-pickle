import React from 'react'
import {
  FiMapPin,
  FiCalendar,
  FiDollarSign,
  FiTrendingUp,
  FiTool,
  FiBarChart
} from 'react-icons/fi'

interface CourtsHeaderProps {
  totalCourts: number
  totalReservations: number
  monthlyRevenue: number
  occupancyRate: number
  upcomingMaintenance: number
}

const CourtsHeader: React.FC<CourtsHeaderProps> = ({
  totalCourts,
  totalReservations,
  monthlyRevenue,
  occupancyRate,
  upcomingMaintenance
}) => {
  return (
    <div className="bg-white shadow-2xl rounded-3xl p-8 mb-8 border border-gray-100">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-2xl flex items-center justify-center mr-6">
            <FiBarChart className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Court Management</h1>
            <p className="text-lg text-gray-600 font-medium">Manage your courts, schedules, and reservations with comprehensive analytics</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <FiMapPin className="h-6 w-6 text-white" />
            </div>
            <FiTrendingUp className="h-5 w-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-blue-900 mb-2">{totalCourts}</div>
          <div className="text-sm font-bold text-blue-700">Total Courts</div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-100 border-2 border-green-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <FiCalendar className="h-6 w-6 text-white" />
            </div>
            <FiTrendingUp className="h-5 w-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-green-900 mb-2">{totalReservations}</div>
          <div className="text-sm font-bold text-green-700">Total Reservations</div>
          <div className="text-xs font-medium text-green-600 mt-1">(Last 30 days)</div>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-2 border-indigo-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <FiDollarSign className="h-6 w-6 text-white" />
            </div>
            <FiTrendingUp className="h-5 w-5 text-indigo-400" />
          </div>
          <div className="text-3xl font-bold text-indigo-900 mb-2">${monthlyRevenue.toFixed(2)}</div>
          <div className="text-sm font-bold text-indigo-700">Monthly Revenue</div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <FiTrendingUp className="h-6 w-6 text-white" />
            </div>
            <FiTrendingUp className="h-5 w-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-purple-900 mb-2">{occupancyRate}%</div>
          <div className="text-sm font-bold text-purple-700">Occupancy Rate</div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-orange-100 border-2 border-yellow-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <FiTool className="h-6 w-6 text-white" />
            </div>
            <FiTrendingUp className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="text-3xl font-bold text-yellow-900 mb-2">{upcomingMaintenance}</div>
          <div className="text-sm font-bold text-yellow-700">Upcoming Maintenance</div>
        </div>
      </div>
    </div>
  )
}

export default CourtsHeader