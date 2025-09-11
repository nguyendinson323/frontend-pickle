import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
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
                <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Players</h2>
                <PlayersList
                  players={players.slice(0, 5)}
                  onUpdateStatus={handlePlayerStatusUpdate}
                  loading={loading}
                />
              </div>
            )}
            
            {coaches.length > 0 && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Coaches</h2>
                <CoachesList
                  coaches={coaches.slice(0, 5)}
                  onUpdateVerification={handleCoachVerificationUpdate}
                  loading={loading}
                />
              </div>
            )}
            
            {clubs.length > 0 && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Clubs</h2>
                <ClubsList
                  clubs={clubs.slice(0, 5)}
                  onUpdateStatus={handleClubStatusUpdate}
                  loading={loading}
                />
              </div>
            )}
            
            {partners.length > 0 && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Partners</h2>
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
    <div className="min-h-screen  py-8">
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
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
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