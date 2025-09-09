import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
  const { sessions, availability, stats, selectedSession, filters } = useSelector((state: RootState) => state.coachSessions)
  const { isLoading } = useSelector((state: RootState) => state.loading)
  
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your coaching sessions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <div className="bg-white shadow-sm rounded-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('sessions')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'sessions'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Sessions ({sessions.length})
              </button>
              <button
                onClick={() => setActiveTab('availability')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'availability'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Availability Schedule ({availability.length})
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

        {/* Stats Summary */}
        {stats && activeTab === 'sessions' && (
          <div className="mt-6 bg-white shadow-sm rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.completion_rate}%
                </div>
                <div className="text-sm text-gray-600">Completion Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">
                  ${stats.total_earnings}
                </div>
                <div className="text-sm text-gray-600">Total Earnings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.average_rating.toFixed(1)} ★
                </div>
                <div className="text-sm text-gray-600">Student Rating</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CoachSessionsPage