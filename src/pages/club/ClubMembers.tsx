import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import {
  fetchClubMembersData,
  updateMemberActiveStatus,
  removeMemberFromClub,
  extendMembershipExpiry,
  inviteNewMember,
  bulkUpdateMembers,
  updateMemberData,
  ClubMember
} from '../../store/slices/clubMembersSlice'

import MembersHeader from '../../components/club/members/MembersHeader'
import MembersList from '../../components/club/members/MembersList'
import InviteMemberModal from '../../components/club/members/InviteMemberModal'
import BulkActionsModal from '../../components/club/members/BulkActionsModal'
import ExtendMembershipModal from '../../components/club/members/ExtendMembershipModal'
import EditMemberModal from '../../components/club/members/EditMemberModal'

const ClubMembers: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  
  const { members, stats, loading, error } = useSelector((state: RootState) => state.clubMembers)
  const { user } = useSelector((state: RootState) => state.auth)

  const [selectedMembers, setSelectedMembers] = useState<number[]>([])
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [showExtendModal, setShowExtendModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [memberToExtend, setMemberToExtend] = useState<ClubMember | null>(null)
  const [memberToEdit, setMemberToEdit] = useState<ClubMember | null>(null)
  
  // Filter and pagination state
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'expired'>('all')
  const [membershipFilter, setMembershipFilter] = useState<'all' | 'active' | 'expired' | 'expiring_soon'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [membersPerPage] = useState(10)

  useEffect(() => {
    if (user && user.role === 'club') {
      fetchData()
    } else {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const fetchData = async () => {
    try {
      await dispatch(fetchClubMembersData())
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

  // Filter and pagination logic
  const filteredMembers = members.filter(member => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (!member.full_name.toLowerCase().includes(query) &&
          !member.user.email.toLowerCase().includes(query) &&
          !member.user.username.toLowerCase().includes(query)) {
        return false
      }
    }

    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'active' && !member.user.is_active) return false
      if (statusFilter === 'inactive' && member.user.is_active) return false
    }

    // Membership filter
    if (membershipFilter !== 'all') {
      const now = new Date()
      const expiryDate = member.affiliation_expires_at ? new Date(member.affiliation_expires_at) : null
      
      if (membershipFilter === 'active') {
        if (!expiryDate || expiryDate < now) return false
      } else if (membershipFilter === 'expired') {
        if (!expiryDate || expiryDate >= now) return false
      } else if (membershipFilter === 'expiring_soon') {
        if (!expiryDate) return false
        const thirtyDaysFromNow = new Date()
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
        if (expiryDate < now || expiryDate > thirtyDaysFromNow) return false
      }
    }

    return true
  })

  // Pagination
  const totalMembers = filteredMembers.length
  const totalPages = Math.ceil(totalMembers / membersPerPage)
  const startIndex = (currentPage - 1) * membersPerPage
  const paginatedMembers = filteredMembers.slice(startIndex, startIndex + membersPerPage)

  const handleSelectAll = () => {
    if (selectedMembers.length === paginatedMembers.length) {
      setSelectedMembers([])
    } else {
      setSelectedMembers(paginatedMembers.map(member => member.id))
    }
  }

  const handleEditMember = (member: ClubMember) => {
    setMemberToEdit(member)
    setShowEditModal(true)
  }

  const handleToggleStatus = async (memberId: number, currentStatus: boolean) => {
    try {
      await dispatch(updateMemberActiveStatus(memberId, !currentStatus))
    } catch (error) {
      console.error('Error updating member status:', error)
    }
  }

  const handleRemoveMember = async (memberId: number) => {
    if (window.confirm('Are you sure you want to remove this member from the club?')) {
      try {
        await dispatch(removeMemberFromClub(memberId))
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
      await dispatch(extendMembershipExpiry(memberId, expiryDate))
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
      const result = await dispatch(inviteNewMember(inviteData))
      
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
      await dispatch(bulkUpdateMembers(selectedMembers, { action, expiry_date: expiryDate }))
      setSelectedMembers([])
    } catch (error) {
      console.error('Error performing bulk action:', error)
      throw error
    }
  }

  const handleUpdateMember = async (memberId: number, updateData: {
    full_name: string
    nrtp_level: number
    affiliation_expires_at: string | null
    profile_photo_url?: string
  }) => {
    try {
      await dispatch(updateMemberData(memberId, updateData))
    } catch (error) {
      console.error('Error updating member:', error)
      throw error
    }
  }

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter, membershipFilter])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setSelectedMembers([]) // Clear selected members when changing page
  }

  if (loading && members.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MembersHeader
          stats={stats}
          onInviteMember={() => setShowInviteModal(true)}
          onBulkActions={() => setShowBulkModal(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          membershipFilter={membershipFilter}
          onMembershipFilterChange={setMembershipFilter}
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
          members={paginatedMembers}
          selectedMembers={selectedMembers}
          onMemberSelect={handleMemberSelect}
          onSelectAll={handleSelectAll}
          onEditMember={handleEditMember}
          onToggleStatus={handleToggleStatus}
          onRemoveMember={handleRemoveMember}
          onExtendMembership={handleExtendMembership}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalMembers={totalMembers}
          membersPerPage={membersPerPage}
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

        <EditMemberModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setMemberToEdit(null)
          }}
          member={memberToEdit}
          onUpdate={handleUpdateMember}
          loading={loading}
        />
      </div>
    </div>
  )
}

export default ClubMembers