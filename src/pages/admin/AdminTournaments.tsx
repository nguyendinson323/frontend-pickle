import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState, AppDispatch } from '../../store'
import { TournamentAdmin } from '../../types/admin'
import {
  fetchTournaments,
  fetchTournamentParticipants
} from '../../store/slices/adminTournamentsSlice'
import {
  TournamentsTable,
  TournamentStats,
  TournamentFilters,
  ParticipantsTable,
  TournamentDetail,
  BulkParticipantActions
} from '../../components/admin/tournaments'
import {
  FiUsers,
  FiArrowLeft,
  FiAlertCircle,
  FiLoader,
  FiCalendar
} from 'react-icons/fi'

const AdminTournaments: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.auth)
  const { tournamentFilter, error } = useSelector((state: RootState) => state.adminTournaments)
  
  const [activeTab, setActiveTab] = useState<'tournaments' | 'participants'>('tournaments')
  const [selectedTournamentForDetail, setSelectedTournamentForDetail] = useState<TournamentAdmin | null>(null)

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login')
      return
    }

    // Fetch initial data
    dispatch(fetchTournaments(tournamentFilter))
    dispatch(fetchTournamentParticipants())
  }, [dispatch, user, navigate])

  useEffect(() => {
    // Refresh data when filters change
    if (activeTab === 'tournaments') {
      dispatch(fetchTournaments(tournamentFilter))
    }
  }, [dispatch, tournamentFilter, activeTab])

  const handleTournamentSelect = (tournament: TournamentAdmin) => {
    setSelectedTournamentForDetail(tournament)
  }

  const handleTournamentDetailClose = () => {
    setSelectedTournamentForDetail(null)
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg">
            <FiLoader className="h-8 w-8 animate-spin" />
          </div>
          <p className="text-lg font-bold text-gray-700">Loading Tournament Management...</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'tournaments', label: 'Tournaments Overview', icon: FiCalendar },
    { id: 'participants', label: 'Tournament Participants', icon: FiUsers }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="bg-white shadow-lg rounded-2xl border border-gray-200 p-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mr-6 shadow-lg">
                  <FiCalendar className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">Tournaments Management</h1>
                  <p className="mt-3 text-lg text-gray-600 font-medium">
                    Monitor and manage all tournaments across the federation
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FiArrowLeft className="mr-2 h-5 w-5" />
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-start">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white mr-4 flex-shrink-0">
                <FiAlertCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-900 mb-2">Error Occurred</h3>
                <div className="text-lg text-red-700 font-medium">
                  {error}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tournament Statistics */}
        <TournamentStats />

        {/* Navigation Tabs */}
        <div className="bg-white shadow-lg rounded-2xl border border-gray-200 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <nav className="flex space-x-2" aria-label="Tabs">
              {tabs.map((tab) => {
                const IconComponent = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'tournaments' | 'participants')}
                    className={`relative inline-flex items-center px-6 py-3 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-md'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                      activeTab === tab.id
                        ? 'bg-white bg-opacity-20'
                        : 'bg-gray-200'
                    }`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'tournaments' && (
            <>
              <TournamentFilters />
              <TournamentsTable onTournamentSelect={handleTournamentSelect} />
            </>
          )}

          {activeTab === 'participants' && (
            <>
              <BulkParticipantActions />
              <ParticipantsTable />
            </>
          )}
        </div>

        {/* Tournament Detail Modal */}
        {selectedTournamentForDetail && (
          <TournamentDetail
            tournament={selectedTournamentForDetail}
            onClose={handleTournamentDetailClose}
          />
        )}
      </div>
    </div>
  )
}

export default AdminTournaments