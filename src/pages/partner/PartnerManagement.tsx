import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
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
import {
  FiAlertCircle,
  FiRefreshCw,
  FiHome,
  FiAward
} from 'react-icons/fi'

import ManagementHeader from '../../components/partner/management/ManagementHeader'
import CourtsList from '../../components/partner/management/CourtsList'
import TournamentsList from '../../components/partner/management/TournamentsList'
import CourtModal from '../../components/partner/management/CourtModal'
import TournamentModal from '../../components/partner/management/TournamentModal'

const PartnerManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    courts,
    tournaments,
    stats,
    error,
    courtFilter,
    tournamentFilter,
    selectedCourt,
    selectedTournament
  } = useSelector((state: RootState) => state.partnerManagement)
  
  const { isLoading: loading } = useSelector((state: RootState) => state.loading)

  const [activeTab, setActiveTab] = useState<'courts' | 'tournaments'>('courts')
  const [showCourtModal, setShowCourtModal] = useState(false)
  const [showTournamentModal, setShowTournamentModal] = useState(false)

  useEffect(() => {
    dispatch(fetchPartnerManagementData())
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
        await dispatch(updatePartnerCourt(selectedCourt.id, courtData))
      } else {
        await dispatch(createCourt(courtData))
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl p-8">
            <div className="animate-pulse space-y-6">
              <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-3xl"></div>
              <div className="h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl"></div>
              <div className="h-96 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error && courts.length === 0 && tournaments.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 shadow-2xl rounded-3xl p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-pink-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FiAlertCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-red-900 mb-4">Error Loading Management Data</h3>
            <p className="text-red-800 font-medium mb-8">{error}</p>
            <button
              onClick={() => dispatch(fetchPartnerManagementData())}
              className="inline-flex items-center px-6 py-3 text-sm font-bold text-red-700 bg-gradient-to-r from-red-100 to-red-200 border border-red-300 rounded-2xl hover:from-red-200 hover:to-red-300 transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105"
            >
              <FiRefreshCw className="w-4 h-4 mr-2" />
              Retry Loading
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ManagementHeader
          stats={stats}
          onAddCourt={handleAddCourt}
          onAddTournament={handleAddTournament}
          loading={loading}
        />

        {error && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 shadow-lg rounded-2xl p-6 mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-pink-700 rounded-2xl flex items-center justify-center mr-4">
                <FiAlertCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-red-900 mb-1">Management Error</h3>
                <span className="text-red-800 font-medium">{error}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl mb-6 overflow-hidden">
          <div className="border-b border-gray-100">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('courts')}
                className={`py-6 px-8 text-sm font-bold border-b-4 transition-all duration-300 flex items-center ${
                  activeTab === 'courts'
                    ? 'border-blue-500 text-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50'
                }`}
              >
                <FiHome className="w-5 h-5 mr-2" />
                Courts
                {courts.length > 0 && (
                  <span className="ml-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 py-1 px-3 rounded-full text-xs font-bold border border-blue-300">
                    {courts.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('tournaments')}
                className={`py-6 px-8 text-sm font-bold border-b-4 transition-all duration-300 flex items-center ${
                  activeTab === 'tournaments'
                    ? 'border-purple-500 text-purple-600 bg-gradient-to-r from-purple-50 to-indigo-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-purple-50'
                }`}
              >
                <FiAward className="w-5 h-5 mr-2" />
                Tournaments
                {tournaments.length > 0 && (
                  <span className="ml-2 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 py-1 px-3 rounded-full text-xs font-bold border border-purple-300">
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