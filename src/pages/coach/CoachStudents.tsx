import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import { 
  fetchCoachStudentsData, 
  updateStudentLevel
} from '../../store/slices/coachStudentsSlice'
import { 
  StudentsHeader,
  StudentsFilters,
  StudentsList,
  StudentDetailsModal
} from '../../components/coach/students'

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

const CoachStudentsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { students, stats } = useSelector((state: RootState) => state.coachStudents)
  const { isLoading } = useSelector((state: RootState) => state.loading)
  
  const [filters, setFilters] = useState({
    search: '',
    level_min: '',
    level_max: '',
    state: '',
    activity: 'all'
  })
  
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

  useEffect(() => {
    dispatch(fetchCoachStudentsData())
  }, [dispatch])

  const handleFiltersChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const handleClearFilters = () => {
    setFilters({
      search: '',
      level_min: '',
      level_max: '',
      state: '',
      activity: 'all'
    })
  }

  const handleViewDetails = (student: Student) => {
    setSelectedStudent(student)
  }

  const handleCloseDetails = () => {
    setSelectedStudent(null)
  }

  const handleUpdateLevel = (studentId: number, newLevel: number) => {
    dispatch(updateStudentLevel(studentId, newLevel))
  }

  if (isLoading && students.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your students...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {stats && (
          <StudentsHeader
            totalStudents={stats.total_students}
            activeStudents={stats.active_students}
            inactiveStudents={stats.inactive_students}
            averageRating={stats.average_rating}
            totalRevenue={stats.total_revenue}
          />
        )}

        {/* Filters */}
        <StudentsFilters
          filters={filters}
          students={students}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
        />

        {/* Students List */}
        <StudentsList
          students={students}
          filters={filters}
          onViewDetails={handleViewDetails}
          onUpdateLevel={handleUpdateLevel}
        />

        {/* Student Details Modal */}
        {selectedStudent && (
          <StudentDetailsModal
            student={selectedStudent}
            onClose={handleCloseDetails}
            onUpdateLevel={handleUpdateLevel}
          />
        )}

        {/* Summary Statistics */}
        {stats && students.length > 0 && (
          <div className="mt-6 bg-white shadow-sm rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Teaching Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.average_sessions_per_student}
                </div>
                <div className="text-sm text-gray-600">Avg Sessions per Student</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round((stats.active_students / stats.total_students) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Student Retention Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">
                  ${stats.total_revenue.toFixed(0)}
                </div>
                <div className="text-sm text-gray-600">Total Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.average_rating.toFixed(1)} ★
                </div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CoachStudentsPage