import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FiUsers, FiAlertCircle } from 'react-icons/fi'
import { RootState, AppDispatch } from '../../store'
import {
  fetchStateMemberData,
  updatePlayerStatus,
  updateCoachVerification,
  updateClubStatus,
  updatePartnerStatus,
  setFilters
} from '../../store/slices/stateMemberManagementSlice'

import MembersHeader from '../../components/state/members/MembersHeader'
import MembersStatsCard from '../../components/state/members/MembersStatsCard'
import PlayersList from '../../components/state/members/PlayersList'
import CoachesList from '../../components/state/members/CoachesList'
import ClubsList from '../../components/state/members/ClubsList'
import PartnersList from '../../components/state/members/PartnersList'

const StateMemberManagement: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)
  const {
    players,
    coaches,
    clubs,
    partners,
    stats,
    loading,
    error
  } = useSelector((state: RootState) => state.stateMemberManagement)

  const [activeTab, setActiveTab] = useState<'all' | 'players' | 'coaches' | 'clubs' | 'partners'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [skillLevelFilter, setSkillLevelFilter] = useState('')
  const [certificationFilter, setCertificationFilter] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    if (user?.role !== 'state') {
      navigate('/dashboard')
      return
    }

    // Initial data fetch
    dispatch(fetchStateMemberData())
  }, [dispatch, isAuthenticated, user, navigate])

  // Apply filters when they change
  useEffect(() => {
    const newFilters = {
      member_type: activeTab,
      status: statusFilter,
      search: searchTerm,
      skill_level: skillLevelFilter,
      certification_level: certificationFilter
    }

    dispatch(setFilters(newFilters))
    dispatch(fetchStateMemberData(newFilters))
  }, [dispatch, activeTab, statusFilter, searchTerm, skillLevelFilter, certificationFilter])

  const handlePlayerStatusUpdate = async (playerId: number, status: string) => {
    try {
      await dispatch(updatePlayerStatus(playerId, status))
    } catch (error) {
      console.error('Failed to update player status:', error)
    }
  }

  const handleCoachVerificationUpdate = async (coachId: number, verified: boolean) => {
    try {
      await dispatch(updateCoachVerification(coachId, verified))
    } catch (error) {
      console.error('Failed to update coach verification:', error)
    }
  }

  const handleClubStatusUpdate = async (clubId: number, status: boolean) => {
    try {
      await dispatch(updateClubStatus(clubId, status))
    } catch (error) {
      console.error('Failed to update club status:', error)
    }
  }

  const handlePartnerStatusUpdate = async (partnerId: number, status: boolean) => {
    try {
      await dispatch(updatePartnerStatus(partnerId, status))
    } catch (error) {
      console.error('Failed to update partner status:', error)
    }
  }

  const renderMemberList = () => {
    switch (activeTab) {
      case 'players':
        return (
          <PlayersList
            players={players}
            onUpdateStatus={handlePlayerStatusUpdate}
            loading={loading}
          />
        )
      case 'coaches':
        return (
          <CoachesList
            coaches={coaches}
            onUpdateVerification={handleCoachVerificationUpdate}
            loading={loading}
          />
        )
      case 'clubs':
        return (
          <ClubsList
            clubs={clubs}
            onUpdateStatus={handleClubStatusUpdate}
            loading={loading}
          />
        )
      case 'partners':
        return (
          <PartnersList
            partners={partners}
            onUpdateStatus={handlePartnerStatusUpdate}
            loading={loading}
          />
        )
      case 'all':
      default:
        return (
          <div className="space-y-8">
            {players.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <FiUsers className="w-6 h-6 mr-3 text-blue-600" />
                  Recent Players
                </h2>
                <PlayersList
                  players={players.slice(0, 5)}
                  onUpdateStatus={handlePlayerStatusUpdate}
                  loading={loading}
                />
              </div>
            )}
            
            {coaches.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <FiUsers className="w-6 h-6 mr-3 text-green-600" />
                  Recent Coaches
                </h2>
                <CoachesList
                  coaches={coaches.slice(0, 5)}
                  onUpdateVerification={handleCoachVerificationUpdate}
                  loading={loading}
                />
              </div>
            )}
            
            {clubs.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <FiUsers className="w-6 h-6 mr-3 text-purple-600" />
                  Recent Clubs
                </h2>
                <ClubsList
                  clubs={clubs.slice(0, 5)}
                  onUpdateStatus={handleClubStatusUpdate}
                  loading={loading}
                />
              </div>
            )}
            
            {partners.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <FiUsers className="w-6 h-6 mr-3 text-orange-600" />
                  Recent Partners
                </h2>
                <PartnersList
                  partners={partners.slice(0, 5)}
                  onUpdateStatus={handlePartnerStatusUpdate}
                  loading={loading}
                />
              </div>
            )}
          </div>
        )
    }
  }

  if (!isAuthenticated || user?.role !== 'state') {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MembersHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          skillLevelFilter={skillLevelFilter}
          setSkillLevelFilter={setSkillLevelFilter}
          certificationFilter={certificationFilter}
          setCertificationFilter={setCertificationFilter}
        />

        <MembersStatsCard stats={stats} />

        {error && (
          <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200/50 rounded-2xl p-6 mb-8 shadow-lg backdrop-blur-sm">
            <div className="flex items-center space-x-4">
              <div className="bg-red-500 p-2 rounded-xl shadow-lg">
                <FiAlertCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-red-900">Error</h3>
                <p className="text-sm text-red-800 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {renderMemberList()}
      </div>
    </div>
  )
}

export default StateMemberManagement