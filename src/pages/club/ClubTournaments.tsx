import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import {
  fetchClubTournamentsData,
  createTournament,
  deleteTournamentInfo,
  updateTournamentStatusInfo,
  setSelectedTournament,
  fetchTournamentRegistrations,
  fetchTournamentMatches,
  type ClubTournament
} from '../../store/slices/clubTournamentsSlice'

import TournamentsHeader from '../../components/club/tournaments/TournamentsHeader'
import TournamentsList from '../../components/club/tournaments/TournamentsList'
import CreateTournamentModal from '../../components/club/tournaments/CreateTournamentModal'

const ClubTournaments: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  
  const { tournaments, stats, loading, error } = useSelector((state: RootState) => state.clubTournaments)
  const { user } = useSelector((state: RootState) => state.auth)

  const [showCreateModal, setShowCreateModal] = useState(false)
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
    console.log('Edit tournament functionality to be implemented', tournament)
    // This would open an edit modal similar to create modal
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
        <TournamentsHeader
          stats={stats}
          onCreateTournament={() => setShowCreateModal(true)}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
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

        {/* Tournament Details Modal would go here */}
        {showDetailsModal && selectedTournament && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-8 mx-auto p-5 border w-full max-w-6xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Tournament Details: {selectedTournament.name}
                  </h3>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false)
                      setSelectedTournamentState(null)
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Tournament Information</h4>
                    <div className=" rounded-lg p-4 space-y-3">
                      <div>
                        <span className="text-sm text-gray-500">Status: </span>
                        <span className="font-medium capitalize">{selectedTournament.status}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Type: </span>
                        <span className="font-medium">{selectedTournament.tournament_type}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Tournament Dates: </span>
                        <span className="font-medium">
                          {new Date(selectedTournament.start_date).toLocaleDateString()} - {new Date(selectedTournament.end_date).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Registration: </span>
                        <span className="font-medium">
                          {new Date(selectedTournament.registration_start).toLocaleDateString()} - {new Date(selectedTournament.registration_end).toLocaleDateString()}
                        </span>
                      </div>
                      {selectedTournament.entry_fee && (
                        <div>
                          <span className="text-sm text-gray-500">Entry Fee: </span>
                          <span className="font-medium">${selectedTournament.entry_fee}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-sm text-gray-500">Participants: </span>
                        <span className="font-medium">{selectedTournament.registration_count || 0}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Revenue: </span>
                        <span className="font-medium">${selectedTournament.revenue || 0}</span>
                      </div>
                    </div>

                    {selectedTournament.categories && selectedTournament.categories.length > 0 && (
                      <div className="mt-6">
                        <h5 className="text-md font-medium text-gray-900 mb-3">Categories</h5>
                        <div className="space-y-2">
                          {selectedTournament.categories.map((category, index: number) => (
                            <div key={index} className="bg-blue-50 rounded-md p-3">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">{category.name}</span>
                                <span className="text-sm text-gray-600">
                                  {category.registration_count || 0} registered
                                </span>
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                {category.gender} • {category.format}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="mb-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h4>
                      <div className="space-y-2">
                        <button className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700 font-medium">
                          View Registrations
                        </button>
                        <button className="w-full text-left px-4 py-2 bg-green-50 hover:bg-green-100 rounded-lg text-green-700 font-medium">
                          Generate Matches
                        </button>
                        <button className="w-full text-left px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-700 font-medium">
                          View Matches
                        </button>
                        <button className="w-full text-left px-4 py-2 bg-yellow-50 hover:bg-yellow-100 rounded-lg text-yellow-700 font-medium">
                          Export Results
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h4>
                      <div className=" rounded-lg p-4">
                        <p className="text-sm text-gray-500 text-center">
                          Activity tracking to be implemented
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ClubTournaments