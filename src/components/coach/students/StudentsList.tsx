import React from 'react'

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
      return { text: 'Active', className: 'bg-green-100 text-green-800' }
    } else {
      return { text: 'Inactive', className: 'bg-gray-100 text-gray-800' }
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
      <div className="bg-white shadow-sm rounded-lg p-8 text-center">
        <div className="text-gray-500">
          <div className="text-4xl mb-4">👨‍🎓</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Students Found</h3>
          <p className="text-gray-600">
            {filters.search || filters.level_min || filters.level_max || filters.state || filters.activity !== 'all'
              ? 'Try adjusting your filters to see more students.'
              : 'Students who book sessions with you will appear here.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          Students ({filteredStudents.length})
        </h3>
      </div>

      <div className="divide-y divide-gray-200">
        {filteredStudents.map((student) => {
          const activity = getActivityBadge(student)
          return (
            <div key={student.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Student Photo */}
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    {student.profile_photo_url ? (
                      <img 
                        src={student.profile_photo_url} 
                        alt={student.full_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-semibold text-gray-600">
                        {student.full_name.charAt(0)}
                      </span>
                    )}
                  </div>

                  {/* Student Details */}
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <h4 className="text-lg font-medium text-gray-900">
                        {student.full_name}
                      </h4>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${activity.className}`}>
                        {activity.text}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center space-x-4">
                        <span>
                          <span className="font-medium">Level:</span> {student.nrtp_level}
                        </span>
                        <span>
                          <span className="font-medium">Sessions:</span> {student.sessions.total_sessions}
                        </span>
                        <span>
                          <span className="font-medium">Location:</span> {student.state_name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        {student.sessions.last_session_date && (
                          <span>
                            <span className="font-medium">Last Session:</span> {formatDate(student.sessions.last_session_date)}
                          </span>
                        )}
                        {student.sessions.average_rating > 0 && (
                          <span className="text-yellow-600">
                            <span className="font-medium">Rating:</span> {student.sessions.average_rating.toFixed(1)} ★
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Student Stats and Actions */}
                <div className="text-right">
                  <div className="mb-2">
                    <div className="text-lg font-semibold text-gray-900">
                      ${student.sessions.total_spent.toFixed(0)}
                    </div>
                    <div className="text-sm text-gray-500">Total Spent</div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="text-center px-2">
                      <div className="text-sm font-medium text-green-600">
                        {student.sessions.completed_sessions}
                      </div>
                      <div className="text-xs text-gray-500">Completed</div>
                    </div>
                    
                    <div className="text-center px-2">
                      <div className="text-sm font-medium text-blue-600">
                        {student.sessions.upcoming_sessions}
                      </div>
                      <div className="text-xs text-gray-500">Upcoming</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 mt-3">
                    <button
                      onClick={() => onViewDetails(student)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
                    >
                      Details
                    </button>
                    
                    <select
                      value={student.nrtp_level}
                      onChange={(e) => onUpdateLevel(student.id, parseFloat(e.target.value))}
                      className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
          )
        })}
      </div>
    </div>
  )
}

export default StudentsList