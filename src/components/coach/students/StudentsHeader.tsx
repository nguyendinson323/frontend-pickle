import React from 'react'

interface StudentsHeaderProps {
  totalStudents: number
  activeStudents: number
  inactiveStudents: number
  averageRating: number
  totalRevenue: number
}

const StudentsHeader: React.FC<StudentsHeaderProps> = ({
  totalStudents,
  activeStudents,
  inactiveStudents,
  averageRating,
  totalRevenue
}) => {
  return (
    <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">My Students</h1>
        <div className="text-sm text-gray-500">
          Track your students' progress and performance
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{totalStudents}</div>
          <div className="text-sm text-gray-600">Total Students</div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{activeStudents}</div>
          <div className="text-sm text-gray-600">Active</div>
          <div className="text-xs text-gray-500">(Upcoming sessions)</div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-gray-600">{inactiveStudents}</div>
          <div className="text-sm text-gray-600">Inactive</div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{averageRating.toFixed(1)}</div>
          <div className="text-sm text-gray-600">Avg Rating</div>
          <div className="text-xs text-gray-500">
            {'★'.repeat(Math.floor(averageRating))}
            {averageRating > 0 && averageRating % 1 !== 0 && '☆'}
          </div>
        </div>
        
        <div className="bg-indigo-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-indigo-600">${totalRevenue.toFixed(0)}</div>
          <div className="text-sm text-gray-600">Total Revenue</div>
        </div>
      </div>
    </div>
  )
}

export default StudentsHeader