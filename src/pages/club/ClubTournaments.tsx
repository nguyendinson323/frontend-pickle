import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import {
  fetchClubTournamentsData,
  createTournament,
  updateTournamentInfo,
  deleteTournamentInfo,
  updateTournamentStatusInfo,
  setSelectedTournament,
  fetchTournamentRegistrations,
  fetchTournamentMatches,
  generateTournamentMatches,
  updateMatchResult,
  type ClubTournament
} from '../../store/slices/clubTournamentsSlice'
import {
  FiAlertCircle,
  FiLoader
} from 'react-icons/fi'

import TournamentsHeader from '../../components/club/tournaments/TournamentsHeader'
import TournamentsList from '../../components/club/tournaments/TournamentsList'
import CreateTournamentModal from '../../components/club/tournaments/CreateTournamentModal'
import EditTournamentModal from '../../components/club/tournaments/EditTournamentModal'
import TournamentDetailsModal from '../../components/club/tournaments/TournamentDetailsModal'

const ClubTournaments: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  
  const { tournaments, stats, selectedTournamentRegistrations, selectedTournamentMatches, loading, error } = useSelector((state: RootState) => state.clubTournaments)
  const { user } = useSelector((state: RootState) => state.auth)

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedTournament, setSelectedTournamentState] = useState<ClubTournament | null>(null)

  useEffect(() => {
    if (user && user.role === 'club') {
      fetchData()
    } else {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const fetchData = async () => {
    try {
      await dispatch(fetchClubTournamentsData())
    } catch (error) {
      console.error('Error fetching tournaments data:', error)
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
      await dispatch(createTournament(tournamentData))
    } catch (error) {
      console.error('Error creating tournament:', error)
      throw error
    }
  }

  const handleViewDetails = (tournament: ClubTournament) => {
    setSelectedTournamentState(tournament)
    dispatch(setSelectedTournament(tournament))
    setShowDetailsModal(true)
    
    // Fetch additional data for the tournament
    dispatch(fetchTournamentRegistrations(tournament.id))
    dispatch(fetchTournamentMatches(tournament.id))
  }

  const handleEditTournament = (tournament: ClubTournament) => {
    setSelectedTournamentState(tournament)
    setShowEditModal(true)
  }

  const handleUpdateTournament = async (tournamentId: number, tournamentData: {
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
    banner_url?: string
  }) => {
    try {
      await dispatch(updateTournamentInfo(tournamentId, tournamentData))
      setShowEditModal(false)
      setSelectedTournamentState(null)
    } catch (error) {
      console.error('Error updating tournament:', error)
    }
  }

  const handleDeleteTournament = async (tournamentId: number) => {
    if (window.confirm('Are you sure you want to delete this tournament? This action cannot be undone.')) {
      try {
        await dispatch(deleteTournamentInfo(tournamentId))
      } catch (error) {
        console.error('Error deleting tournament:', error)
      }
    }
  }

  const handleUpdateStatus = async (tournamentId: number, status: string) => {
    try {
      await dispatch(updateTournamentStatusInfo(tournamentId, status))
    } catch (error) {
      console.error('Error updating tournament status:', error)
    }
  }

  const handleGenerateMatches = async (tournamentId: number) => {
    try {
      await dispatch(generateTournamentMatches(tournamentId))
    } catch (error) {
      console.error('Error generating matches:', error)
    }
  }

  const handleUpdateMatchResult = async (matchId: number, matchData: { score: string; winner_side: number; status: string }) => {
    try {
      await dispatch(updateMatchResult(matchId, matchData))
    } catch (error) {
      console.error('Error updating match result:', error)
    }
  }

  if (loading && tournaments.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-300 border-t-purple-600 mx-auto mb-6">
            <FiLoader className="h-8 w-8 text-transparent" />
          </div>
          <p className="text-gray-600 font-medium text-lg">Loading tournaments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TournamentsHeader
          stats={stats}
          onCreateTournament={() => setShowCreateModal(true)}
        />

        {error && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 text-red-800 px-6 py-4 rounded-2xl mb-8 shadow-lg flex items-center">
            <FiAlertCircle className="h-6 w-6 mr-3 text-red-500" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <TournamentsList
          tournaments={tournaments}
          onViewDetails={handleViewDetails}
          onEditTournament={handleEditTournament}
          onDeleteTournament={handleDeleteTournament}
          onUpdateStatus={handleUpdateStatus}
        />

        <CreateTournamentModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateTournament}
          loading={loading}
        />

        {/* Edit Tournament Modal */}
        {showEditModal && selectedTournament && (
          <EditTournamentModal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false)
              setSelectedTournamentState(null)
            }}
            onUpdate={handleUpdateTournament}
            tournament={selectedTournament}
            loading={loading}
          />
        )}

        {/* Tournament Details Modal */}
        {showDetailsModal && selectedTournament && (
          <TournamentDetailsModal
            isOpen={showDetailsModal}
            onClose={() => {
              setShowDetailsModal(false)
              setSelectedTournamentState(null)
            }}
            tournament={selectedTournament}
            registrations={selectedTournamentRegistrations}
            matches={selectedTournamentMatches}
            onGenerateMatches={handleGenerateMatches}
            onUpdateMatchResult={handleUpdateMatchResult}
            loading={loading}
          />
        )}
      </div>
    </div>
  )
}

export default ClubTournaments