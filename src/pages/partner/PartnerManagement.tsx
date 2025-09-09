import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import {
  fetchPartnerManagementData,
  createCourt,
  updatePartnerCourt,
  deletePartnerCourt,
  createTournament,
  updatePartnerTournament,
  deletePartnerTournament,
  publishTournament,
  cancelTournament,
  setCourtFilter,
  setTournamentFilter,
  setSelectedCourt,
  setSelectedTournament
} from '../../store/slices/partnerManagementSlice'

import ManagementHeader from '../../components/partner/management/ManagementHeader'
import CourtsList from '../../components/partner/management/CourtsList'
import TournamentsList from '../../components/partner/management/TournamentsList'
import CourtModal from '../../components/partner/management/CourtModal'
import TournamentModal from '../../components/partner/management/TournamentModal'

const PartnerManagement: React.FC = () => {
  const dispatch = useDispatch()
  const {
    courts,
    tournaments,
    stats,
    loading,
    error,
    courtFilter,
    tournamentFilter,
    selectedCourt,
    selectedTournament
  } = useSelector((state: RootState) => state.partnerManagement)

  const [activeTab, setActiveTab] = useState<'courts' | 'tournaments'>('courts')
  const [showCourtModal, setShowCourtModal] = useState(false)
  const [showTournamentModal, setShowTournamentModal] = useState(false)

  useEffect(() => {
    dispatch(fetchPartnerManagementData() as any)
  }, [dispatch])

  const handleAddCourt = () => {
    dispatch(setSelectedCourt(null))
    setShowCourtModal(true)
  }

  const handleEditCourt = (court: any) => {
    dispatch(setSelectedCourt(court))
    setShowCourtModal(true)
  }

  const handleSaveCourt = async (courtData: any) => {
    try {
      if (selectedCourt) {
        await dispatch(updatePartnerCourt(selectedCourt.id, courtData) as any)
      } else {
        await dispatch(createCourt(courtData) as any)
      }
      setShowCourtModal(false)
      dispatch(setSelectedCourt(null))
    } catch (error) {
      console.error('Failed to save court:', error)
    }
  }

  const handleDeleteCourt = async (courtId: number) => {
    if (window.confirm('Are you sure you want to delete this court? This action cannot be undone.')) {
      try {
        await dispatch(deletePartnerCourt(courtId) as any)
      } catch (error) {
        console.error('Failed to delete court:', error)
      }
    }
  }

  const handleAddTournament = () => {
    dispatch(setSelectedTournament(null))
    setShowTournamentModal(true)
  }

  const handleEditTournament = (tournament: any) => {
    dispatch(setSelectedTournament(tournament))
    setShowTournamentModal(true)
  }

  const handleSaveTournament = async (tournamentData: any) => {
    try {
      if (selectedTournament) {
        await dispatch(updatePartnerTournament(selectedTournament.id, tournamentData) as any)
      } else {
        await dispatch(createTournament(tournamentData) as any)
      }
      setShowTournamentModal(false)
      dispatch(setSelectedTournament(null))
    } catch (error) {
      console.error('Failed to save tournament:', error)
    }
  }

  const handleDeleteTournament = async (tournamentId: number) => {
    if (window.confirm('Are you sure you want to delete this tournament? This action cannot be undone.')) {
      try {
        await dispatch(deletePartnerTournament(tournamentId) as any)
      } catch (error) {
        console.error('Failed to delete tournament:', error)
      }
    }
  }

  const handlePublishTournament = async (tournamentId: number) => {
    if (window.confirm('Are you sure you want to publish this tournament? It will become visible to players.')) {
      try {
        await dispatch(publishTournament(tournamentId) as any)
      } catch (error) {
        console.error('Failed to publish tournament:', error)
      }
    }
  }

  const handleCancelTournament = async (tournamentId: number) => {
    if (window.confirm('Are you sure you want to cancel this tournament? This action cannot be undone.')) {
      try {
        await dispatch(cancelTournament(tournamentId) as any)
      } catch (error) {
        console.error('Failed to cancel tournament:', error)
      }
    }
  }

  const handleCourtFilterChange = (filter: Partial<{ status: string; searchTerm: string }>) => {
    dispatch(setCourtFilter(filter))
  }

  const handleTournamentFilterChange = (filter: Partial<{ status: string; searchTerm: string }>) => {
    dispatch(setTournamentFilter(filter))
  }

  if (loading && courts.length === 0 && tournaments.length === 0) {
    return (
      <div className="min-h-screen  py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-16 bg-gray-200 rounded-lg"></div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error && courts.length === 0 && tournaments.length === 0) {
    return (
      <div className="min-h-screen  py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Management Data</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => dispatch(fetchPartnerManagementData() as any)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen  py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ManagementHeader
          stats={stats}
          onAddCourt={handleAddCourt}
          onAddTournament={handleAddTournament}
          loading={loading}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('courts')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'courts'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Courts
                {courts.length > 0 && (
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                    {courts.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('tournaments')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'tournaments'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
                Tournaments
                {tournaments.length > 0 && (
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                    {tournaments.length}
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'courts' && (
          <CourtsList
            courts={courts}
            filter={courtFilter}
            onFilterChange={handleCourtFilterChange}
            onEditCourt={handleEditCourt}
            onDeleteCourt={handleDeleteCourt}
            loading={loading}
          />
        )}

        {activeTab === 'tournaments' && (
          <TournamentsList
            tournaments={tournaments}
            filter={tournamentFilter}
            onFilterChange={handleTournamentFilterChange}
            onEditTournament={handleEditTournament}
            onDeleteTournament={handleDeleteTournament}
            onPublishTournament={handlePublishTournament}
            onCancelTournament={handleCancelTournament}
            loading={loading}
          />
        )}

        {/* Modals */}
        <CourtModal
          isOpen={showCourtModal}
          onClose={() => {
            setShowCourtModal(false)
            dispatch(setSelectedCourt(null))
          }}
          onSave={handleSaveCourt}
          court={selectedCourt}
          loading={loading}
        />

        <TournamentModal
          isOpen={showTournamentModal}
          onClose={() => {
            setShowTournamentModal(false)
            dispatch(setSelectedTournament(null))
          }}
          onSave={handleSaveTournament}
          tournament={selectedTournament}
          loading={loading}
        />
      </div>
    </div>
  )
}

export default PartnerManagement