import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
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
import {
  FiLoader,
  FiAlertCircle,
  FiUsers,
  FiChevronRight,
  FiRefreshCw,
  FiTrendingUp,
  FiDollarSign,
  FiStar,
  FiPercent
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

const CoachStudentsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { students, stats, isLoading, error } = useSelector((state: RootState) => state.coachStudents)
  
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-12">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-300 border-t-green-600 mx-auto mb-6">
              <FiLoader className="h-8 w-8 text-transparent" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Loading Students</h3>
            <p className="text-gray-600 font-medium text-lg">Please wait while we load your students...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <button
                  onClick={() => navigate('/coach/dashboard')}
                  className="text-gray-500 hover:text-gray-700 font-medium transition-colors duration-200 flex items-center"
                >
                  Dashboard
                </button>
              </li>
              <li>
                <div className="flex items-center">
                  <FiChevronRight className="flex-shrink-0 h-5 w-5 text-gray-400 mx-2" />
                  <span className="text-sm font-bold text-indigo-600" aria-current="page">
                    Students
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl flex items-center justify-center mr-4">
              <FiUsers className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Students</h1>
              <p className="text-gray-600 font-medium">
                Track your students' progress and performance
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 shadow-2xl rounded-3xl p-8">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-pink-700 rounded-2xl flex items-center justify-center mr-4">
                <FiAlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Students Error</h3>
                <p className="text-red-800 font-medium">{error}</p>
                <button
                  onClick={() => dispatch(fetchCoachStudentsData())}
                  className="mt-3 bg-gradient-to-r from-red-600 to-pink-700 hover:from-red-700 hover:to-pink-800 text-white font-bold py-2 px-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105 flex items-center"
                >
                  <FiRefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

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

        {/* Teaching Summary */}
        {stats && students.length > 0 && (
          <div className="mt-8 bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center mr-4">
                <FiTrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Teaching Summary</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FiUsers className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stats.average_sessions_per_student}
                </div>
                <div className="text-sm font-bold text-blue-700">Avg Sessions per Student</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FiPercent className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {Math.round((stats.active_students / stats.total_students) * 100)}%
                </div>
                <div className="text-sm font-bold text-green-700">Student Retention Rate</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-50 border border-purple-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FiDollarSign className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  ${stats.total_revenue.toFixed(0)}
                </div>
                <div className="text-sm font-bold text-purple-700">Total Revenue</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-amber-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FiStar className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stats.average_rating.toFixed(1)}
                </div>
                <div className="text-sm font-bold text-yellow-700">Average Rating</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CoachStudentsPage