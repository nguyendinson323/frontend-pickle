import React from 'react'
import { useNavigate } from 'react-router-dom'

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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Court Activity</h3>
      <div className="space-y-4">
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-green-800">Today's Bookings</p>
              <p className="text-2xl font-bold text-green-900">{todaysBookings}</p>
            </div>
            <div className="text-3xl text-green-600">🎾</div>
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-blue-800">Weekly Usage</p>
              <p className="text-2xl font-bold text-blue-900">{weeklyUsage}%</p>
            </div>
            <div className="text-3xl text-blue-600">📊</div>
          </div>
        </div>

        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-yellow-800">Peak Hours</p>
              <p className="text-sm font-semibold text-yellow-900">6PM - 8PM</p>
            </div>
            <div className="text-3xl text-yellow-600">⏰</div>
          </div>
        </div>

        <button
          onClick={() => navigate('/club/courts')}
          className="text-purple-600 hover:text-purple-500 text-sm font-medium"
        >
          Manage court schedules →
        </button>
      </div>
    </div>
  )
}

export default ClubCourtActivity