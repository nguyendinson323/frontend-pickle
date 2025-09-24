import React from 'react'
import {
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiStar,
  FiDollarSign,
  FiTrendingUp
} from 'react-icons/fi'

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
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl p-8 mb-8">
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mr-4">
          <FiTrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Students</h1>
          <p className="text-gray-600 font-medium">
            Track your students' progress and performance
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Total Students */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiUsers className="w-8 h-8 text-white" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{totalStudents}</div>
          <div className="text-sm font-bold text-blue-700">Total Students</div>
        </div>

        {/* Active Students */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiUserCheck className="w-8 h-8 text-white" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{activeStudents}</div>
          <div className="text-sm font-bold text-green-700">Active Students</div>
          <div className="text-xs text-green-600 font-medium mt-1">(Upcoming sessions)</div>
        </div>

        {/* Inactive Students */}
        <div className="bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiUserX className="w-8 h-8 text-white" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{inactiveStudents}</div>
          <div className="text-sm font-bold text-gray-700">Inactive Students</div>
        </div>

        {/* Average Rating */}
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-amber-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiStar className="w-8 h-8 text-white" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{averageRating.toFixed(1)}</div>
          <div className="text-sm font-bold text-yellow-700">Average Rating</div>
        </div>

        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiDollarSign className="w-8 h-8 text-white" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">${totalRevenue.toFixed(0)}</div>
          <div className="text-sm font-bold text-purple-700">Total Revenue</div>
        </div>
      </div>
    </div>
  )
}

export default StudentsHeader