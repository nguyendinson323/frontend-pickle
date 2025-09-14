import React, { useState, useEffect } from 'react'
import { ClubMember } from '../../../store/slices/clubMembersSlice'
import CentralizedImageUpload from '../../common/CentralizedImageUpload'

interface EditMemberModalProps {
  isOpen: boolean
  onClose: () => void
  member: ClubMember | null
  onUpdate: (memberId: number, updateData: {
    full_name: string
    nrtp_level: number
    affiliation_expires_at: string | null
    profile_photo_url?: string
  }) => Promise<void>
  loading: boolean
}

const EditMemberModal: React.FC<EditMemberModalProps> = ({
  isOpen,
  onClose,
  member,
  onUpdate,
  loading
}) => {
  const [formData, setFormData] = useState({
    full_name: '',
    nrtp_level: 1.0,
    affiliation_expires_at: '',
    profile_photo_url: ''
  })

  useEffect(() => {
    if (member && isOpen) {
      setFormData({
        full_name: member.full_name,
        nrtp_level: member.nrtp_level,
        affiliation_expires_at: member.affiliation_expires_at ? member.affiliation_expires_at.split('T')[0] : '',
        profile_photo_url: member.profile_photo_url || ''
      })
    }
  }, [member, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!member) return

    try {
      await onUpdate(member.id, {
        full_name: formData.full_name,
        nrtp_level: formData.nrtp_level,
        affiliation_expires_at: formData.affiliation_expires_at || null,
        profile_photo_url: formData.profile_photo_url || undefined
      })
      onClose()
    } catch (error) {
      console.error('Error updating member:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'nrtp_level' ? parseFloat(value) : value
    }))
  }

  const handleProfilePhotoChange = (url: string) => {
    setFormData(prev => ({
      ...prev,
      profile_photo_url: url
    }))
  }

  if (!isOpen || !member) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Edit Member</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
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
                <div className="text-sm font-medium text-gray-900">@{member.user.username}</div>
                <div className="text-sm text-gray-500">{member.user.email}</div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Photo
              </label>
              <CentralizedImageUpload
                uploadType="player-photo"
                value={formData.profile_photo_url}
                onChange={handleProfilePhotoChange}
                color="blue"
              />
            </div>

            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="nrtp_level" className="block text-sm font-medium text-gray-700">
                NRTP Level *
              </label>
              <select
                id="nrtp_level"
                name="nrtp_level"
                value={formData.nrtp_level}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={1.0}>1.0</option>
                <option value={1.5}>1.5</option>
                <option value={2.0}>2.0</option>
                <option value={2.5}>2.5</option>
                <option value={3.0}>3.0</option>
                <option value={3.5}>3.5</option>
                <option value={4.0}>4.0</option>
                <option value={4.5}>4.5</option>
                <option value={5.0}>5.0</option>
              </select>
            </div>

            <div>
              <label htmlFor="affiliation_expires_at" className="block text-sm font-medium text-gray-700">
                Membership Expiry Date
              </label>
              <input
                type="date"
                id="affiliation_expires_at"
                name="affiliation_expires_at"
                value={formData.affiliation_expires_at}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Leave empty for no expiry date
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.full_name}
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update Member'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditMemberModal