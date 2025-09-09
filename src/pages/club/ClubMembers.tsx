import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import {
  fetchClubMembersData,
  updateMemberActiveStatus,
  removeMemberFromClub,
  extendMembershipExpiry,
  inviteNewMember,
  bulkUpdateMembers,
  setSelectedMember,
  ClubMember
} from '../../store/slices/clubMembersSlice'

import MembersHeader from '../../components/club/members/MembersHeader'
import MembersList from '../../components/club/members/MembersList'
import InviteMemberModal from '../../components/club/members/InviteMemberModal'
import BulkActionsModal from '../../components/club/members/BulkActionsModal'
import ExtendMembershipModal from '../../components/club/members/ExtendMembershipModal'

const ClubMembers: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { members, stats, loading, error } = useSelector((state: RootState) => state.clubMembers)
  const { user } = useSelector((state: RootState) => state.auth)

  const [selectedMembers, setSelectedMembers] = useState<number[]>([])
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [showExtendModal, setShowExtendModal] = useState(false)
  const [memberToExtend, setMemberToExtend] = useState<ClubMember | null>(null)

  useEffect(() => {
    if (user && user.role === 'club') {
      fetchData()
    } else {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const fetchData = async () => {
    try {
      await dispatch(fetchClubMembersData() as any)
    } catch (error) {
      console.error('Error fetching members data:', error)
    }
  }

  const handleMemberSelect = (memberId: number) => {
    setSelectedMembers(prev => 
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    )
  }

  const handleSelectAll = () => {
    if (selectedMembers.length === members.length) {
      setSelectedMembers([])
    } else {
      setSelectedMembers(members.map(member => member.id))
    }
  }

  const handleEditMember = (member: ClubMember) => {
    dispatch(setSelectedMember(member))
    console.log('Edit member functionality to be implemented')
  }

  const handleToggleStatus = async (memberId: number, currentStatus: boolean) => {
    try {
      await dispatch(updateMemberActiveStatus(memberId, !currentStatus) as any)
    } catch (error) {
      console.error('Error updating member status:', error)
    }
  }

  const handleRemoveMember = async (memberId: number) => {
    if (window.confirm('Are you sure you want to remove this member from the club?')) {
      try {
        await dispatch(removeMemberFromClub(memberId) as any)
        setSelectedMembers(prev => prev.filter(id => id !== memberId))
      } catch (error) {
        console.error('Error removing member:', error)
      }
    }
  }

  const handleExtendMembership = (member: ClubMember) => {
    setMemberToExtend(member)
    setShowExtendModal(true)
  }

  const handleExtendMembershipSubmit = async (memberId: number, expiryDate: string) => {
    try {
      await dispatch(extendMembershipExpiry(memberId, expiryDate) as any)
    } catch (error) {
      console.error('Error extending membership:', error)
    }
  }

  const handleInviteMember = async (inviteData: {
    email: string
    full_name: string
    phone?: string
    message?: string
  }) => {
    try {
      const result = await dispatch(inviteNewMember(inviteData) as any)
      
      if (result.type === 'direct_add') {
        await fetchData()
      }
      
      return result
    } catch (error) {
      console.error('Error inviting member:', error)
      throw error
    }
  }

  const handleBulkAction = async (action: 'activate' | 'deactivate' | 'extend_membership', expiryDate?: string) => {
    try {
      await dispatch(bulkUpdateMembers(selectedMembers, { action, expiry_date: expiryDate }) as any)
      setSelectedMembers([])
    } catch (error) {
      console.error('Error performing bulk action:', error)
      throw error
    }
  }

  if (loading && members.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen  py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MembersHeader
          stats={stats}
          onInviteMember={() => setShowInviteModal(true)}
          onBulkActions={() => setShowBulkModal(true)}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {selectedMembers.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-6">
            {selectedMembers.length} member{selectedMembers.length !== 1 ? 's' : ''} selected
          </div>
        )}

        <MembersList
          members={members}
          selectedMembers={selectedMembers}
          onMemberSelect={handleMemberSelect}
          onSelectAll={handleSelectAll}
          onEditMember={handleEditMember}
          onToggleStatus={handleToggleStatus}
          onRemoveMember={handleRemoveMember}
          onExtendMembership={handleExtendMembership}
        />

        <InviteMemberModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          onInvite={handleInviteMember}
          loading={loading}
        />

        <BulkActionsModal
          isOpen={showBulkModal}
          onClose={() => setShowBulkModal(false)}
          selectedCount={selectedMembers.length}
          onBulkAction={handleBulkAction}
          loading={loading}
        />

        <ExtendMembershipModal
          isOpen={showExtendModal}
          onClose={() => {
            setShowExtendModal(false)
            setMemberToExtend(null)
          }}
          member={memberToExtend}
          onExtend={handleExtendMembershipSubmit}
          loading={loading}
        />
      </div>
    </div>
  )
}

export default ClubMembers