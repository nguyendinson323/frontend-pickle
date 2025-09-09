import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import {
  fetchStateManagementData,
  createStateTournament,
  deleteStateTournament,
  updateStateTournamentStatus,
  updateStateCourtStatus,
  setSelectedTournament,
  setSelectedCourt,
  setSelectedClub,
  StateTournament,
  StateCourt,
  StateClub,
  StatePartner
} from '../../store/slices/stateManagementSlice'

import ManagementHeader from '../../components/state/management/ManagementHeader'
import ManagementTabs from '../../components/state/management/ManagementTabs'
import TournamentsTab from '../../components/state/management/TournamentsTab'
import CourtsTab from '../../components/state/management/CourtsTab'
import ClubsTab from '../../components/state/management/ClubsTab'
import PartnersTab from '../../components/state/management/PartnersTab'
import CreateTournamentModal from '../../components/state/management/CreateTournamentModal'

const StateManagement: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { tournaments, courts, clubs, partners, stats, loading, error } = useSelector((state: RootState) => state.stateManagement)
  const { user } = useSelector((state: RootState) => state.auth)

  const [activeTab, setActiveTab] = useState('tournaments')
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    if (user && user.role === 'state') {
      fetchData()
    } else {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const fetchData = async () => {
    try {
      await dispatch(fetchStateManagementData() as any)
    } catch (error) {
      console.error('Error fetching state management data:', error)
    }
  }

  const handleCreateTournament = async (tournamentData: {
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
      await dispatch(createStateTournament(tournamentData) as any)
    } catch (error) {
      console.error('Error creating tournament:', error)
      throw error
    }
  }

  const handleViewTournament = (tournament: StateTournament) => {
    dispatch(setSelectedTournament(tournament))
    console.log('View tournament details:', tournament)
    // This would typically open a detailed view modal or navigate to a details page
  }

  const handleEditTournament = (tournament: StateTournament) => {
    dispatch(setSelectedTournament(tournament))
    console.log('Edit tournament functionality to be implemented:', tournament)
    // This would open an edit modal similar to create modal
  }

  const handleDeleteTournament = async (tournamentId: number) => {
    if (window.confirm('Are you sure you want to delete this tournament? This action cannot be undone.')) {
      try {
        await dispatch(deleteStateTournament(tournamentId) as any)
      } catch (error) {
        console.error('Error deleting tournament:', error)
      }
    }
  }

  const handleUpdateTournamentStatus = async (tournamentId: number, status: string) => {
    try {
      await dispatch(updateStateTournamentStatus(tournamentId, status) as any)
    } catch (error) {
      console.error('Error updating tournament status:', error)
    }
  }

  const handleViewCourt = (court: StateCourt) => {
    dispatch(setSelectedCourt(court))
    console.log('View court details:', court)
    // This would typically open a detailed view modal or navigate to a details page
  }

  const handleUpdateCourtStatus = async (courtId: number, status: string) => {
    try {
      await dispatch(updateStateCourtStatus(courtId, status) as any)
    } catch (error) {
      console.error('Error updating court status:', error)
    }
  }

  const handleViewClub = (club: StateClub) => {
    dispatch(setSelectedClub(club))
    console.log('View club details:', club)
    // This would typically open a detailed view modal or navigate to a details page
  }

  const handleViewPartner = (partner: StatePartner) => {
    console.log('View partner details:', partner)
    // This would typically open a detailed view modal or navigate to a details page
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'tournaments':
        return (
          <TournamentsTab
            tournaments={tournaments}
            onViewTournament={handleViewTournament}
            onEditTournament={handleEditTournament}
            onDeleteTournament={handleDeleteTournament}
            onUpdateStatus={handleUpdateTournamentStatus}
          />
        )
      case 'courts':
        return (
          <CourtsTab
            courts={courts}
            onViewCourt={handleViewCourt}
            onUpdateCourtStatus={handleUpdateCourtStatus}
          />
        )
      case 'clubs':
        return (
          <ClubsTab
            clubs={clubs}
            onViewClub={handleViewClub}
          />
        )
      case 'partners':
        return (
          <PartnersTab
            partners={partners}
            onViewPartner={handleViewPartner}
          />
        )
      default:
        return null
    }
  }

  if (loading && tournaments.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen  py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ManagementHeader
          stats={stats}
          onCreateTournament={() => setShowCreateModal(true)}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
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

        <div className="bg-white rounded-lg shadow-md p-6">
          {renderTabContent()}
        </div>

        <CreateTournamentModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateTournament}
          loading={loading}
        />
      </div>
    </div>
  )
}

export default StateManagement