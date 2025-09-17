import React from 'react'
import { ClubMember } from '../../../store/slices/clubMembersSlice'
import {
  FiEdit2,
  FiUserCheck,
  FiUserX,
  FiClock,
  FiTrash2,
  FiUser,
  FiChevronLeft,
  FiChevronRight,
  FiMail,
  FiPhone,
  FiCalendar,
  FiActivity
} from 'react-icons/fi'

interface MembersListProps {
  members: ClubMember[]
  selectedMembers: number[]
  onMemberSelect: (memberId: number) => void
  onSelectAll: () => void
  onEditMember: (member: ClubMember) => void
  onToggleStatus: (memberId: number, currentStatus: boolean) => void
  onRemoveMember: (memberId: number) => void
  onExtendMembership: (member: ClubMember) => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  totalMembers: number
  membersPerPage: number
}

const MembersList: React.FC<MembersListProps> = ({
  members,
  selectedMembers,
  onMemberSelect,
  onSelectAll,
  onEditMember,
  onToggleStatus,
  onRemoveMember,
  onExtendMembership,
  currentPage,
  totalPages,
  onPageChange,
  totalMembers,
  membersPerPage
}) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  const getMembershipStatus = (expiryDate: string | null) => {
    if (!expiryDate) return { status: 'No Expiry', color: 'bg-blue-100 text-blue-800' }
    
    const expiry = new Date(expiryDate)
    const now = new Date()
    
    if (expiry < now) {
      return { status: 'Expired', color: 'bg-red-100 text-red-800' }
    } else if ((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24) <= 30) {
      return { status: 'Expiring Soon', color: 'bg-yellow-100 text-yellow-800' }
    }
    return { status: 'Active', color: 'bg-green-100 text-green-800' }
  }

  const startIndex = (currentPage - 1) * membersPerPage + 1
  const endIndex = Math.min(currentPage * membersPerPage, totalMembers)

  const renderPagination = () => {
    if (totalPages <= 1) return null

    const pages = []
    const showEllipsis = totalPages > 7
    
    if (showEllipsis) {
      // Always show first page
      pages.push(1)
      
      if (currentPage > 4) {
        pages.push('...')
      }
      
      // Show pages around current page
      const start = Math.max(2, currentPage - 2)
      const end = Math.min(totalPages - 1, currentPage + 2)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      if (currentPage < totalPages - 3) {
        pages.push('...')
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    } else {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    }

    return (
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-t-2 border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="inline-flex items-center px-4 py-2 border-2 border-gray-300 text-sm font-bold rounded-2xl text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transition-all duration-200"
          >
            <FiChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="inline-flex items-center px-4 py-2 border-2 border-gray-300 text-sm font-bold rounded-2xl text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transition-all duration-200"
          >
            Next
            <FiChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div className="bg-white px-4 py-2 rounded-2xl border-2 border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-700">
              Showing <span className="font-bold text-blue-600">{startIndex}</span> to{' '}
              <span className="font-bold text-blue-600">{endIndex}</span> of{' '}
              <span className="font-bold text-blue-600">{totalMembers}</span> results
            </p>
          </div>
          <div>
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 border-2 border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
              >
                <FiChevronLeft className="h-4 w-4" />
              </button>
              {pages.map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === 'number' ? onPageChange(page) : undefined}
                  disabled={page === '...'}
                  className={`px-4 py-2 border-2 text-sm font-bold rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md ${
                    page === currentPage
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 border-blue-500 text-white'
                      : page === '...'
                      ? 'border-gray-300 bg-white text-gray-500 cursor-default'
                      : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 border-2 border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
              >
                <FiChevronRight className="h-4 w-4" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-2xl rounded-3xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={selectedMembers.length === members.length && members.length > 0}
                  onChange={onSelectAll}
                  className="rounded-lg border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 w-4 h-4"
                />
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center">
                  <FiUser className="h-4 w-4 mr-2" />
                  Member
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center">
                  <FiMail className="h-4 w-4 mr-2" />
                  Contact
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center">
                  <FiActivity className="h-4 w-4 mr-2" />
                  NRTP Level
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center">
                  <FiCalendar className="h-4 w-4 mr-2" />
                  Membership
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {members.map((member, index) => {
              const membershipStatus = getMembershipStatus(member.affiliation_expires_at)
              return (
                <tr key={member.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200" style={{ animationDelay: `${index * 50}ms` }}>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(member.id)}
                      onChange={() => onMemberSelect(member.id)}
                      className="rounded-lg border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 w-4 h-4"
                    />
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        {member.profile_photo_url ? (
                          <img
                            className="h-12 w-12 rounded-2xl object-cover shadow-lg border-2 border-gray-200"
                            src={member.profile_photo_url}
                            alt={member.full_name}
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                            <span className="text-sm font-bold text-white">
                              {member.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-gray-900">{member.full_name}</div>
                        <div className="text-sm font-medium text-gray-500">@{member.user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <FiMail className="h-4 w-4 mr-2 text-gray-400" />
                        {member.user.email}
                      </div>
                      {member.user.phone && (
                        <div className="flex items-center text-sm text-gray-500">
                          <FiPhone className="h-4 w-4 mr-2 text-gray-400" />
                          {member.user.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-purple-100 to-indigo-100 border border-purple-200 rounded-xl">
                      <span className="text-sm font-bold text-purple-900">{member.nrtp_level}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-xl border-2 ${
                      member.user.is_active
                        ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200'
                        : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200'
                    }`}>
                      {member.user.is_active ? (
                        <>
                          <FiUserCheck className="h-3 w-3 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <FiUserX className="h-3 w-3 mr-1" />
                          Inactive
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="space-y-2">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-xl border-2 ${
                        membershipStatus.status === 'Active' ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200' :
                        membershipStatus.status === 'Expired' ? 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200' :
                        membershipStatus.status === 'Expiring Soon' ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200' :
                        'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200'
                      }`}>
                        {membershipStatus.status}
                      </span>
                      {member.affiliation_expires_at && (
                        <div className="text-xs text-gray-500 flex items-center">
                          <FiCalendar className="h-3 w-3 mr-1" />
                          Expires: {formatDate(member.affiliation_expires_at)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-700">
                      {formatDate(member.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onEditMember(member)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                        title="Edit Member"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onToggleStatus(member.id, member.user.is_active)}
                        className={`p-2 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md ${
                          member.user.is_active
                            ? 'text-red-600 hover:text-red-800 hover:bg-red-50'
                            : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                        }`}
                        title={member.user.is_active ? 'Deactivate Member' : 'Activate Member'}
                      >
                        {member.user.is_active ? (
                          <FiUserX className="w-4 h-4" />
                        ) : (
                          <FiUserCheck className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={() => onExtendMembership(member)}
                        className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                        title="Extend Membership"
                      >
                        <FiClock className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onRemoveMember(member.id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                        title="Remove Member"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {renderPagination()}
    </div>
  )
}

export default MembersList