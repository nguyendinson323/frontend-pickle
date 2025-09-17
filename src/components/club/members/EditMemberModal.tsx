import React, { useState, useEffect } from 'react'
import { ClubMember } from '../../../store/slices/clubMembersSlice'
import SimpleImageUpload from '../../common/SimpleImageUpload'
import {
  FiEdit2,
  FiX,
  FiUser,
  FiMail,
  FiImage,
  FiActivity,
  FiCalendar,
  FiSave
} from 'react-icons/fi'

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
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white shadow-2xl rounded-3xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-100 p-6 border-b-2 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white mr-4">
                <FiEdit2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Edit Member</h3>
                <p className="text-blue-700 font-medium">Update member information</p>
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
          <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 border-2 border-gray-200 rounded-2xl">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {member.profile_photo_url ? (
                  <img
                    className="h-14 w-14 rounded-2xl object-cover shadow-lg border-2 border-gray-200"
                    src={member.profile_photo_url}
                    alt={member.full_name}
                  />
                ) : (
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                    <span className="text-sm font-bold text-white">
                      {member.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="ml-4">
                <div className="flex items-center text-lg font-bold text-gray-900 mb-1">
                  <FiUser className="h-4 w-4 mr-2" />
                  @{member.user.username}
                </div>
                <div className="flex items-center text-sm font-medium text-gray-500">
                  <FiMail className="h-4 w-4 mr-2" />
                  {member.user.email}
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <div className="flex items-center">
                  <FiImage className="h-4 w-4 mr-2" />
                  Profile Photo
                </div>
              </label>
              <SimpleImageUpload
                fieldName="profile_photo"
                fileType="image"
                title="Upload Profile Photo"
                value={formData.profile_photo_url}
                onChange={handleProfilePhotoChange}
              />
            </div>

            <div>
              <label htmlFor="full_name" className="block text-sm font-bold text-gray-700 mb-2">
                <div className="flex items-center">
                  <FiUser className="h-4 w-4 mr-2" />
                  Full Name *
                </div>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-2xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:border-gray-300"
                  placeholder="Enter full name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="nrtp_level" className="block text-sm font-bold text-gray-700 mb-2">
                <div className="flex items-center">
                  <FiActivity className="h-4 w-4 mr-2" />
                  NRTP Level *
                </div>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiActivity className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="nrtp_level"
                  name="nrtp_level"
                  value={formData.nrtp_level}
                  onChange={handleInputChange}
                  required
                  className="block w-full pl-10 pr-8 py-3 border-2 border-gray-200 rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:border-gray-300 appearance-none cursor-pointer"
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
            </div>

            <div>
              <label htmlFor="affiliation_expires_at" className="block text-sm font-bold text-gray-700 mb-2">
                <div className="flex items-center">
                  <FiCalendar className="h-4 w-4 mr-2" />
                  Membership Expiry Date
                </div>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  id="affiliation_expires_at"
                  name="affiliation_expires_at"
                  value={formData.affiliation_expires_at}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-2xl leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:border-gray-300"
                />
              </div>
              <p className="mt-2 text-sm font-medium text-gray-500 flex items-center">
                <FiCalendar className="h-4 w-4 mr-1" />
                Leave empty for no expiry date
              </p>
            </div>

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
                disabled={loading || !formData.full_name}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 border border-transparent rounded-2xl shadow-lg text-sm font-bold text-white hover:from-blue-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <FiSave className="h-4 w-4 mr-2" />
                    Update Member
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

export default EditMemberModal