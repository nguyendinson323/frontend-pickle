import React from 'react'
import {
  FiUser,
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiMapPin,
  FiCalendar,
  FiDollarSign,
  FiStar,
  FiEye,
  FiSliders,
  FiFileText
} from 'react-icons/fi'

interface Student {
  id: number
  full_name: string
  profile_photo_url: string | null
  nrtp_level: number
  email: string
  phone: string
  state_id: number
  state_name: string
  created_at: string
  sessions: {
    total_sessions: number
    completed_sessions: number
    upcoming_sessions: number
    last_session_date: string | null
    average_rating: number
    total_spent: number
  }
  progress: {
    initial_level: number
    current_level: number
    improvement: number
    sessions_to_improve: number
  }
}

interface StudentsListProps {
  students: Student[]
  filters: {
    search: string
    level_min: string
    level_max: string
    state: string
    activity: string
  }
  onViewDetails: (student: Student) => void
  onUpdateLevel: (studentId: number, newLevel: number) => void
}

const StudentsList: React.FC<StudentsListProps> = ({
  students,
  filters,
  onViewDetails,
  onUpdateLevel
}) => {
  // Filter students based on current filters
  const filteredStudents = students.filter(student => {
    // Search filter
    if (filters.search && 
        !student.full_name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !student.email.toLowerCase().includes(filters.search.toLowerCase())) {
      return false
    }

    // Level range filter
    if (filters.level_min && student.nrtp_level < parseFloat(filters.level_min)) {
      return false
    }
    if (filters.level_max && student.nrtp_level > parseFloat(filters.level_max)) {
      return false
    }

    // State filter
    if (filters.state && student.state_name !== filters.state) {
      return false
    }

    // Activity filter
    if (filters.activity !== 'all') {
      if (filters.activity === 'active' && student.sessions.upcoming_sessions === 0) {
        return false
      }
      if (filters.activity === 'inactive' && student.sessions.upcoming_sessions > 0) {
        return false
      }
    }

    return true
  })

  const getActivityBadge = (student: Student) => {
    if (student.sessions.upcoming_sessions > 0) {
      return { text: 'Active', className: 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-200 text-green-800' }
    } else {
      return { text: 'Inactive', className: 'bg-gradient-to-r from-gray-100 to-gray-200 border-gray-200 text-gray-800' }
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (filteredStudents.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl p-12 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <FiUsers className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">No Students Found</h3>
        <p className="text-gray-600 font-medium text-lg">
          {filters.search || filters.level_min || filters.level_max || filters.state || filters.activity !== 'all'
            ? 'Try adjusting your filters to see more students.'
            : 'Students who book sessions with you will appear here.'}
        </p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl overflow-hidden">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b-2 border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mr-3">
            <FiFileText className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            Students ({filteredStudents.length})
          </h3>
        </div>
      </div>

      <div className="divide-y-2 divide-gray-200">
        {filteredStudents.map((student) => {
          const activity = getActivityBadge(student)
          return (
            <div key={student.id} className="p-8 hover:bg-gray-50 transition-all duration-200">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                <div className="flex items-center space-x-6">
                  {/* Student Photo */}
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center overflow-hidden shadow-lg">
                    {student.profile_photo_url ? (
                      <img
                        src={student.profile_photo_url}
                        alt={student.full_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FiUser className="text-2xl text-gray-600" />
                    )}
                  </div>

                  {/* Student Details */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-3">
                      <h4 className="text-xl font-bold text-gray-900 mb-2 sm:mb-0">
                        {student.full_name}
                      </h4>
                      <span className={`inline-flex px-3 py-1 text-sm font-bold rounded-2xl border shadow-md ${activity.className} w-fit`}>
                        {activity.text === 'Active' ? (
                          <FiUserCheck className="w-4 h-4 mr-1" />
                        ) : (
                          <FiUserX className="w-4 h-4 mr-1" />
                        )}
                        {activity.text}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      <div className="flex items-center text-sm font-medium text-gray-700">
                        <FiSliders className="w-4 h-4 mr-2 text-purple-600" />
                        Level: {student.nrtp_level}
                      </div>
                      <div className="flex items-center text-sm font-medium text-gray-700">
                        <FiUsers className="w-4 h-4 mr-2 text-blue-600" />
                        Sessions: {student.sessions.total_sessions}
                      </div>
                      <div className="flex items-center text-sm font-medium text-gray-700">
                        <FiMapPin className="w-4 h-4 mr-2 text-orange-600" />
                        {student.state_name}
                      </div>
                      {student.sessions.last_session_date && (
                        <div className="flex items-center text-sm font-medium text-gray-700">
                          <FiCalendar className="w-4 h-4 mr-2 text-green-600" />
                          Last: {formatDate(student.sessions.last_session_date)}
                        </div>
                      )}
                      {student.sessions.average_rating > 0 && (
                        <div className="flex items-center text-sm font-medium text-yellow-600">
                          <FiStar className="w-4 h-4 mr-2" />
                          Rating: {student.sessions.average_rating.toFixed(1)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Student Stats and Actions */}
                <div className="flex flex-col lg:items-end space-y-4">
                  {/* Revenue */}
                  <div className="text-center lg:text-right">
                    <div className="flex items-center justify-center lg:justify-end mb-2">
                      <FiDollarSign className="w-5 h-5 text-green-600 mr-1" />
                      <span className="text-2xl font-bold text-green-600">
                        ${student.sessions.total_spent.toFixed(0)}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-500">Total Spent</div>
                  </div>

                  {/* Session Stats */}
                  <div className="flex justify-center lg:justify-end space-x-4">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl px-4 py-2 text-center">
                      <div className="text-lg font-bold text-green-600">
                        {student.sessions.completed_sessions}
                      </div>
                      <div className="text-xs font-bold text-green-700">Completed</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl px-4 py-2 text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {student.sessions.upcoming_sessions}
                      </div>
                      <div className="text-xs font-bold text-blue-700">Upcoming</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
                    <button
                      onClick={() => onViewDetails(student)}
                      className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-2 px-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105 flex items-center justify-center w-full sm:w-auto"
                    >
                      <FiEye className="w-4 h-4 mr-2" />
                      Details
                    </button>

                    <div className="flex items-center space-x-2">
                      <FiSliders className="w-4 h-4 text-gray-600" />
                      <select
                        value={student.nrtp_level}
                        onChange={(e) => onUpdateLevel(student.id, parseFloat(e.target.value))}
                        className="px-3 py-2 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium text-gray-900 bg-gray-50 hover:bg-white transition-all duration-200"
                        title="Update NRTP Level"
                      >
                        <option value={1.0}>1.0</option>
                        <option value={1.5}>1.5</option>
                        <option value={2.0}>2.0</option>
                        <option value={2.5}>2.5</option>
                        <option value={3.0}>3.0</option>
                        <option value={3.5}>3.5</option>
                        <option value={4.0}>4.0</option>
                        <option value={4.5}>4.5</option>
                        <option value={5.0}>5.0</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default StudentsList