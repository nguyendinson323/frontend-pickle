import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState, AppDispatch } from '../../store'
import {
  fetchCoachSessionsData,
  setFilters,
  setSelectedSession,
  updateCoachSessionStatus,
  addCoachAvailability,
  removeCoachAvailability
} from '../../store/slices/coachSessionsSlice'
import {
  CoachSessionsHeader,
  CoachSessionsList,
  CoachSessionsFilters,
  SessionDetailsModal,
  AvailabilityManager
} from '../../components/coach/sessions'
import {
  FiLoader,
  FiAlertCircle,
  FiUsers,
  FiCalendar,
  FiChevronRight,
  FiRefreshCw,
  FiTrendingUp,
  FiDollarSign,
  FiStar,
  FiCheckCircle
} from 'react-icons/fi'

interface CoachingSession {
  id: number
  coach_id: number
  player_id: number
  session_date: string
  start_time: string
  end_time: string
  court_id: number | null
  status: 'scheduled' | 'completed' | 'canceled'
  price: number
  payment_status: 'pending' | 'paid' | 'refunded'
  stripe_payment_id: string | null
  rating: number | null
  created_at: string
  updated_at: string
  player: {
    id: number
    full_name: string
    profile_photo_url: string | null
    nrtp_level: number
  }
  court: {
    id: number
    name: string
    address: string
  } | null
}

const CoachSessionsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { sessions, availability, stats, selectedSession, filters, isLoading, error } = useSelector((state: RootState) => state.coachSessions)

  const [activeTab, setActiveTab] = useState<'sessions' | 'availability'>('sessions')
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchCoachSessionsData())
  }, [dispatch])

  const handleFiltersChange = (newFilters: Partial<typeof filters>) => {
    dispatch(setFilters(newFilters))
  }

  const handleClearFilters = () => {
    dispatch(setFilters({
      status: 'all',
      date_from: '',
      date_to: '',
      player_search: ''
    }))
  }

  const handleViewDetails = (session: CoachingSession) => {
    dispatch(setSelectedSession(session))
    setIsDetailsModalOpen(true)
  }

  const handleCloseDetails = () => {
    setIsDetailsModalOpen(false)
    dispatch(setSelectedSession(null))
  }

  const handleStatusChange = (sessionId: number, status: string) => {
    dispatch(updateCoachSessionStatus(sessionId, status))
  }

  const handleAddAvailability = (availabilityData: Partial<any>) => {
    dispatch(addCoachAvailability(availabilityData))
  }

  const handleRemoveAvailability = (availabilityId: number) => {
    dispatch(removeCoachAvailability(availabilityId))
  }

  if (isLoading && sessions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-12">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-300 border-t-green-600 mx-auto mb-6">
              <FiLoader className="h-8 w-8 text-transparent" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Loading Sessions</h3>
            <p className="text-gray-600 font-medium text-lg">Please wait while we load your coaching sessions...</p>
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
                    Sessions
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
              <h1 className="text-3xl font-bold text-gray-900">Coaching Sessions</h1>
              <p className="text-gray-600 font-medium">
                Manage your sessions and availability schedule
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
                <h3 className="text-xl font-bold text-gray-900 mb-2">Session Error</h3>
                <p className="text-red-800 font-medium">{error}</p>
                <button
                  onClick={() => dispatch(fetchCoachSessionsData())}
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
          <CoachSessionsHeader
            totalSessions={stats.total_sessions}
            completedSessions={stats.completed_sessions}
            upcomingSessions={stats.upcoming_sessions}
            averageRating={stats.average_rating}
          />
        )}

        {/* Tab Navigation */}
        <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl overflow-hidden mb-8">
          <div className="border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <nav className="flex space-x-2 px-8 py-2" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('sessions')}
                className={`${
                  activeTab === 'sessions'
                    ? 'bg-gradient-to-r from-green-600 to-emerald-700 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white'
                } whitespace-nowrap py-3 px-6 rounded-2xl font-bold text-sm flex items-center transition-all duration-200 hover:transform hover:scale-105`}
              >
                <FiUsers className="w-5 h-5 mr-2" />
                My Sessions ({sessions.length})
              </button>
              <button
                onClick={() => setActiveTab('availability')}
                className={`${
                  activeTab === 'availability'
                    ? 'bg-gradient-to-r from-green-600 to-emerald-700 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white'
                } whitespace-nowrap py-3 px-6 rounded-2xl font-bold text-sm flex items-center transition-all duration-200 hover:transform hover:scale-105`}
              >
                <FiCalendar className="w-5 h-5 mr-2" />
                Availability ({availability.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'sessions' ? (
          <>
            {/* Filters */}
            <CoachSessionsFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />

            {/* Sessions List */}
            <CoachSessionsList
              sessions={sessions}
              filters={filters}
              onStatusChange={handleStatusChange}
              onViewDetails={handleViewDetails}
            />
          </>
        ) : (
          <>
            {/* Availability Manager */}
            <AvailabilityManager
              availability={availability}
              onAddAvailability={handleAddAvailability}
              onRemoveAvailability={handleRemoveAvailability}
            />
          </>
        )}

        {/* Session Details Modal */}
        <SessionDetailsModal
          session={selectedSession}
          isOpen={isDetailsModalOpen}
          onClose={handleCloseDetails}
          onStatusChange={handleStatusChange}
        />

        {/* Performance Summary */}
        {stats && activeTab === 'sessions' && (
          <div className="mt-8 bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center mr-4">
                <FiTrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Performance Summary</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FiCheckCircle className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stats.completion_rate}%
                </div>
                <div className="text-sm font-bold text-green-700">Completion Rate</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FiDollarSign className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  ${stats.total_earnings}
                </div>
                <div className="text-sm font-bold text-blue-700">Total Earnings</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-amber-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FiStar className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stats.average_rating.toFixed(1)}
                </div>
                <div className="text-sm font-bold text-yellow-700">Student Rating</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CoachSessionsPage