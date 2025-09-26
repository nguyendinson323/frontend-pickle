import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import {
  fetchStateManagementData,
  createStateTournament,
  updateStateTournament,
  deleteStateTournament,
  updateStateTournamentStatus,
  updateStateCourtStatus,
  StateTournament,
  StateCourt,
  StateClub,
  StatePartner
} from '../../store/slices/stateManagementSlice'
import { FiSettings } from 'react-icons/fi'

import ManagementHeader from '../../components/state/management/ManagementHeader'
import ManagementTabs from '../../components/state/management/ManagementTabs'
import TournamentsTab from '../../components/state/management/TournamentsTab'
import CourtsTab from '../../components/state/management/CourtsTab'
import ClubsTab from '../../components/state/management/ClubsTab'
import PartnersTab from '../../components/state/management/PartnersTab'
import CreateTournamentModal from '../../components/state/management/CreateTournamentModal'
import TournamentDetailModal from '../../components/state/management/TournamentDetailModal'
import EditTournamentModal from '../../components/state/management/EditTournamentModal'
import CourtDetailModal from '../../components/state/management/CourtDetailModal'
import ClubDetailModal from '../../components/state/management/ClubDetailModal'
import PartnerDetailModal from '../../components/state/management/PartnerDetailModal'

const StateManagement: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  
  const { tournaments, courts, clubs, partners, stats, loading, error } = useSelector((state: RootState) => state.stateManagement)
  const { user } = useSelector((state: RootState) => state.auth)

  const [activeTab, setActiveTab] = useState('tournaments')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showTournamentDetail, setShowTournamentDetail] = useState(false)
  const [showEditTournament, setShowEditTournament] = useState(false)
  const [showCourtDetail, setShowCourtDetail] = useState(false)
  const [showClubDetail, setShowClubDetail] = useState(false)
  const [showPartnerDetail, setShowPartnerDetail] = useState(false)
  const [selectedTournament, setSelectedTournament] = useState<StateTournament | null>(null)
  const [selectedCourt, setSelectedCourt] = useState<StateCourt | null>(null)
  const [selectedClub, setSelectedClub] = useState<StateClub | null>(null)
  const [selectedPartner, setSelectedPartner] = useState<StatePartner | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Memoized fetchData function to prevent unnecessary re-renders
  const fetchData = useCallback(async () => {
    if (!user || user.role !== 'state') return

    try {
      setIsRefreshing(true)
      await dispatch(fetchStateManagementData())
    } catch (error) {
      console.error('Error fetching state management data:', error)
    } finally {
      setIsRefreshing(false)
    }
  }, [dispatch, user])

  useEffect(() => {
    if (user && user.role === 'state') {
      fetchData()
    } else if (user && user.role !== 'state') {
      navigate('/dashboard')
    }
  }, [user, navigate, fetchData])


  // Type-safe tournament creation handler
  const handleCreateTournament = useCallback(async (tournamentData: {
    name: string
    description?: string
    tournament_type?: string
    venue_name?: string
    venue_address?: string
    start_date: string
    end_date: string
    registration_start: string
    registration_end: string
    entry_fee?: number
    max_participants?: number
    is_ranking?: boolean
    ranking_multiplier?: number
    categories: Array<{
      name: string
      min_age?: number
      max_age?: number
      gender: 'Male' | 'Female' | 'Mixed'
      min_skill_level?: number
      max_skill_level?: number
      format: string
      max_participants?: number
    }>
  }) => {
    try {
      await dispatch(createStateTournament(tournamentData))
      setShowCreateModal(false)
      // Refresh data to show newly created tournament
      await fetchData()
    } catch (error) {
      console.error('Error creating tournament:', error)
      throw error
    }
  }, [dispatch, fetchData])

  // Memoized tournament handlers
  const handleViewTournament = useCallback((tournament: StateTournament) => {
    setSelectedTournament(tournament)
    setShowTournamentDetail(true)
  }, [])

  const handleEditTournament = useCallback((tournament: StateTournament) => {
    setSelectedTournament(tournament)
    setShowEditTournament(true)
  }, [])

  const handleUpdateTournament = useCallback(async (tournamentId: number, tournamentData: Partial<StateTournament>) => {
    try {
      await dispatch(updateStateTournament(tournamentId, tournamentData))
      setShowEditTournament(false)
      setSelectedTournament(null)
      // Refresh data to show updated tournament
      await fetchData()
    } catch (error) {
      console.error('Error updating tournament:', error)
      throw error
    }
  }, [dispatch, fetchData])

  const handleDeleteTournament = useCallback(async (tournamentId: number) => {
    const confirmMessage = 'Are you sure you want to delete this tournament? This action cannot be undone.'
    if (window.confirm(confirmMessage)) {
      try {
        await dispatch(deleteStateTournament(tournamentId))
        // Refresh data to remove deleted tournament from UI
        await fetchData()
      } catch (error) {
        console.error('Error deleting tournament:', error)
        // Show user-friendly error message
        alert('Failed to delete tournament. Please try again.')
      }
    }
  }, [dispatch, fetchData])

  const handleUpdateTournamentStatus = useCallback(async (tournamentId: number, status: string) => {
    try {
      await dispatch(updateStateTournamentStatus(tournamentId, status))
      // Refresh data to show updated status
      await fetchData()
    } catch (error) {
      console.error('Error updating tournament status:', error)
      alert('Failed to update tournament status. Please try again.')
    }
  }, [dispatch, fetchData])

  const handleViewCourt = useCallback((court: StateCourt) => {
    setSelectedCourt(court)
    setShowCourtDetail(true)
  }, [])

  const handleUpdateCourtStatus = useCallback(async (courtId: number, status: string) => {
    try {
      await dispatch(updateStateCourtStatus(courtId, status))
      // Refresh data to show updated court status
      await fetchData()
    } catch (error) {
      console.error('Error updating court status:', error)
      alert('Failed to update court status. Please try again.')
    }
  }, [dispatch, fetchData])

  const handleViewClub = useCallback((club: StateClub) => {
    setSelectedClub(club)
    setShowClubDetail(true)
  }, [])

  const handleViewPartner = useCallback((partner: StatePartner) => {
    setSelectedPartner(partner)
    setShowPartnerDetail(true)
  }, [])

  // Memoized tab content to prevent unnecessary re-renders
  const renderTabContent = useMemo(() => {
    if (loading || isRefreshing) {
      return (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 mx-auto"></div>
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent absolute inset-0"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FiSettings className="w-6 h-6 text-blue-600 animate-pulse" />
              </div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Loading management data...</p>
          </div>
        </div>
      )
    }

    switch (activeTab) {
      case 'tournaments':
        return (
          <TournamentsTab
            tournaments={tournaments || []}
            onViewTournament={handleViewTournament}
            onEditTournament={handleEditTournament}
            onDeleteTournament={handleDeleteTournament}
            onUpdateStatus={handleUpdateTournamentStatus}
          />
        )
      case 'courts':
        return (
          <CourtsTab
            courts={courts || []}
            onViewCourt={handleViewCourt}
            onUpdateCourtStatus={handleUpdateCourtStatus}
          />
        )
      case 'clubs':
        return (
          <ClubsTab
            clubs={clubs || []}
            onViewClub={handleViewClub}
          />
        )
      case 'partners':
        return (
          <PartnersTab
            partners={partners || []}
            onViewPartner={handleViewPartner}
          />
        )
      default:
        return (
          <div className="text-center py-8 text-gray-500">
            Invalid tab selected
          </div>
        )
    }
  }, [activeTab, tournaments, courts, clubs, partners, loading, isRefreshing, handleViewTournament, handleEditTournament, handleDeleteTournament, handleUpdateTournamentStatus, handleViewCourt, handleUpdateCourtStatus, handleViewClub, handleViewPartner])

  // Show loading state only on initial load or when user is not authenticated
  if ((loading || isRefreshing) && (!tournaments || tournaments.length === 0) && !error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-32 w-32 border-4 border-blue-100"></div>
                <div className="animate-spin rounded-full h-32 w-32 border-4 border-blue-600 border-t-transparent absolute inset-0"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <FiSettings className="w-12 h-12 text-blue-600 animate-pulse" />
                </div>
              </div>
              <p className="mt-6 text-gray-700 text-lg font-semibold">Loading state management data...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Redirect if user is not authorized
  if (user && user.role !== 'state') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-rose-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-lg backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM10 18a8 8 0 100-16 8 8 0 000 16z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="font-semibold">Access denied. You must be a state committee member to view this page.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ManagementHeader
          stats={stats}
          onCreateTournament={() => setShowCreateModal(true)}
        />

        {error && (
          <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-lg backdrop-blur-sm mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-semibold">{error}</span>
            </div>
          </div>
        )}

        <ManagementTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tournamentsCount={tournaments.length}
          courtsCount={courts.length}
          clubsCount={clubs.length}
          partnersCount={partners.length}
        />

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
          {renderTabContent}
        </div>

        <CreateTournamentModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateTournament}
          loading={loading}
        />

        <TournamentDetailModal
          isOpen={showTournamentDetail}
          onClose={() => {
            setShowTournamentDetail(false)
            setSelectedTournament(null)
          }}
          tournament={selectedTournament}
        />

        <EditTournamentModal
          isOpen={showEditTournament}
          onClose={() => {
            setShowEditTournament(false)
            setSelectedTournament(null)
          }}
          tournament={selectedTournament}
          onUpdate={handleUpdateTournament}
          loading={loading}
        />

        <CourtDetailModal
          isOpen={showCourtDetail}
          onClose={() => {
            setShowCourtDetail(false)
            setSelectedCourt(null)
          }}
          court={selectedCourt}
        />

        <ClubDetailModal
          isOpen={showClubDetail}
          onClose={() => {
            setShowClubDetail(false)
            setSelectedClub(null)
          }}
          club={selectedClub}
        />

        <PartnerDetailModal
          isOpen={showPartnerDetail}
          onClose={() => {
            setShowPartnerDetail(false)
            setSelectedPartner(null)
          }}
          partner={selectedPartner}
        />
      </div>
    </div>
  )
}

export default StateManagement