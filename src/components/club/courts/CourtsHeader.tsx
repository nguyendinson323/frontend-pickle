import React from 'react'

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
    <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Court Management</h1>
        <div className="text-sm text-gray-500">
          Manage your courts, schedules, and reservations
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{totalCourts}</div>
          <div className="text-sm text-gray-600">Total Courts</div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{totalReservations}</div>
          <div className="text-sm text-gray-600">Total Reservations</div>
          <div className="text-xs text-gray-500">(Last 30 days)</div>
        </div>
        
        <div className="bg-indigo-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-indigo-600">${monthlyRevenue.toFixed(2)}</div>
          <div className="text-sm text-gray-600">Monthly Revenue</div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{occupancyRate}%</div>
          <div className="text-sm text-gray-600">Occupancy Rate</div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{upcomingMaintenance}</div>
          <div className="text-sm text-gray-600">Upcoming Maintenance</div>
        </div>
      </div>
    </div>
  )
}

export default CourtsHeader