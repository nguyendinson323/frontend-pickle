import React, { useState, useEffect } from 'react'
import { ClubMember } from '../../../store/slices/clubMembersSlice'

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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Extend Membership</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-4 p-4  rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {member.profile_photo_url ? (
                  <img
                    className="h-10 w-10 rounded-full object-cover"
                    src={member.profile_photo_url}
                    alt={member.full_name}
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      {member.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900">{member.full_name}</div>
                <div className="text-sm text-gray-500">{member.user.email}</div>
              </div>
            </div>
          </div>

          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-800">
              <div className="font-medium">Current Membership Status:</div>
              <div>{formatDate(member.affiliation_expires_at)}</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                New Expiry Date *
              </label>
              <input
                type="date"
                id="expiryDate"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                min={getMinDate()}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Select the new expiry date for this member's affiliation
              </p>
            </div>

            {expiryDate && (
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-sm text-green-800">
                  <div className="font-medium">New Expiry Date:</div>
                  <div>{formatDate(expiryDate)}</div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !expiryDate}
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Extend Membership'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ExtendMembershipModal