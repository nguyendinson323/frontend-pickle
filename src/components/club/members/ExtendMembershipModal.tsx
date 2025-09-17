import React, { useState, useEffect } from 'react'
import { ClubMember } from '../../../store/slices/clubMembersSlice'
import {
  FiClock,
  FiX,
  FiUser,
  FiMail,
  FiCalendar,
  FiCheck,
  FiRefreshCw
} from 'react-icons/fi'

interface ExtendMembershipModalProps {
  isOpen: boolean
  onClose: () => void
  member: ClubMember | null
  onExtend: (memberId: number, expiryDate: string) => Promise<void>
  loading: boolean
}

const ExtendMembershipModal: React.FC<ExtendMembershipModalProps> = ({
  isOpen,
  onClose,
  member,
  onExtend,
  loading
}) => {
  const [expiryDate, setExpiryDate] = useState('')

  useEffect(() => {
    if (member && isOpen) {
      const currentExpiry = member.affiliation_expires_at
      if (currentExpiry) {
        const expiry = new Date(currentExpiry)
        expiry.setFullYear(expiry.getFullYear() + 1)
        setExpiryDate(expiry.toISOString().split('T')[0])
      } else {
        const nextYear = new Date()
        nextYear.setFullYear(nextYear.getFullYear() + 1)
        setExpiryDate(nextYear.toISOString().split('T')[0])
      }
    }
  }, [member, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!member) return

    try {
      await onExtend(member.id, expiryDate)
      onClose()
    } catch (error) {
      console.error('Error extending membership:', error)
    }
  }

  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No expiry date set'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (!isOpen || !member) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white shadow-2xl rounded-3xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 to-indigo-100 p-6 border-b-2 border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white mr-4">
                <FiClock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Extend Membership</h3>
                <p className="text-purple-700 font-medium">Update member's expiry date</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white hover:bg-opacity-50 rounded-xl transition-all duration-200"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-purple-50 border-2 border-gray-200 rounded-2xl">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {member.profile_photo_url ? (
                  <img
                    className="h-14 w-14 rounded-2xl object-cover shadow-lg border-2 border-gray-200"
                    src={member.profile_photo_url}
                    alt={member.full_name}
                  />
                ) : (
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                    <span className="text-sm font-bold text-white">
                      {member.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="ml-4">
                <div className="flex items-center text-lg font-bold text-gray-900 mb-1">
                  <FiUser className="h-4 w-4 mr-2" />
                  {member.full_name}
                </div>
                <div className="flex items-center text-sm font-medium text-gray-500">
                  <FiMail className="h-4 w-4 mr-2" />
                  {member.user.email}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl">
            <div className="flex items-center text-sm font-bold text-blue-800">
              <FiCalendar className="h-4 w-4 mr-2" />
              Current Membership Status:
            </div>
            <div className="text-blue-900 font-medium mt-1">{formatDate(member.affiliation_expires_at)}</div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-bold text-gray-700 mb-2">
                <div className="flex items-center">
                  <FiCalendar className="h-4 w-4 mr-2" />
                  New Expiry Date *
                </div>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  id="expiryDate"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  min={getMinDate()}
                  required
                  className="block w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-2xl leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 shadow-sm hover:border-gray-300"
                />
              </div>
              <p className="mt-2 text-sm font-medium text-gray-500 flex items-center">
                <FiClock className="h-4 w-4 mr-1" />
                Select the new expiry date for this member's affiliation
              </p>
            </div>

            {expiryDate && (
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl shadow-sm">
                <div className="flex items-center text-sm font-bold text-green-800 mb-1">
                  <FiCheck className="h-4 w-4 mr-2" />
                  New Expiry Date:
                </div>
                <div className="text-green-900 font-medium">{formatDate(expiryDate)}</div>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border-2 border-gray-300 rounded-2xl shadow-sm text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 hover:shadow-md"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !expiryDate}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 border border-transparent rounded-2xl shadow-lg text-sm font-bold text-white hover:from-purple-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <FiRefreshCw className="h-4 w-4 mr-2" />
                    Extend Membership
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ExtendMembershipModal