import React, { useState } from 'react'
import { CoachProfile } from '../../../store/slices/coachDashboardSlice'
import SimpleImageUpload from '../../common/SimpleImageUpload'
import api from '../../../services/api'
import {
  FiCamera,
  FiX,
  FiUser,
  FiAward,
  FiMapPin,
  FiDollarSign,
  FiCalendar
} from 'react-icons/fi'

interface CoachDashboardHeaderProps {
  profile: CoachProfile
}

const CoachDashboardHeader: React.FC<CoachDashboardHeaderProps> = ({ profile }) => {
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState(profile.profile_photo_url || '')

  const handlePhotoUpdate = async (newPhotoUrl: string) => {
    try {
      // Update the photo on the backend
      await api.put('/api/coach/profile/photo', { profile_photo_url: newPhotoUrl })

      // Update local state
      setCurrentPhotoUrl(newPhotoUrl)
      setShowImageUpload(false)

      // Optionally refresh dashboard data
      // dispatch(fetchCoachDashboard())
    } catch (error) {
      console.error('Failed to update profile photo:', error)
    }
  }

  return (
    <div className="mb-8">
      <div className="bg-gradient-to-br from-white to-indigo-50 border border-indigo-200 rounded-3xl shadow-2xl p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center mb-6 lg:mb-0">
            <div className="relative w-20 h-20 mr-6">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-full flex items-center justify-center shadow-lg">
                {currentPhotoUrl ? (
                  <img src={currentPhotoUrl} alt="Profile" className="w-20 h-20 rounded-full object-cover border-4 border-white" />
                ) : (
                  <FiUser className="text-3xl text-white" />
                )}
              </div>
              <button
                onClick={() => setShowImageUpload(true)}
                className="absolute -bottom-1 -right-1 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-full p-2 shadow-lg transition-all duration-200 hover:transform hover:scale-105"
                title="Update profile photo"
              >
                <FiCamera className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome, Coach {profile.full_name}</h1>
              <div className="flex flex-wrap items-center gap-4 mb-3">
                <div className="flex items-center bg-indigo-100 border border-indigo-200 rounded-2xl px-3 py-1">
                  <FiAward className="h-4 w-4 mr-2 text-indigo-600" />
                  <span className="text-sm font-bold text-indigo-900">Certified Coach</span>
                </div>
                {profile.nrtp_level && (
                  <div className="flex items-center bg-purple-100 border border-purple-200 rounded-2xl px-3 py-1">
                    <FiAward className="h-4 w-4 mr-2 text-purple-600" />
                    <span className="text-sm font-bold text-purple-900">NRTP Level {profile.nrtp_level}</span>
                  </div>
                )}
                {profile.state_name && (
                  <div className="flex items-center bg-blue-100 border border-blue-200 rounded-2xl px-3 py-1">
                    <FiMapPin className="h-4 w-4 mr-2 text-blue-600" />
                    <span className="text-sm font-bold text-blue-900">{profile.state_name}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center bg-green-100 border border-green-200 rounded-2xl px-4 py-2 inline-flex">
                <FiDollarSign className="h-5 w-5 mr-2 text-green-600" />
                <span className="text-lg font-bold text-green-900">${profile.hourly_rate}/hour</span>
              </div>
            </div>
          </div>

          <div className="text-left lg:text-right">
            {profile.affiliation_expires_at && (
              <div className="bg-orange-100 border border-orange-200 rounded-2xl px-4 py-3">
                <div className="flex items-center text-orange-800">
                  <FiCalendar className="h-4 w-4 mr-2" />
                  <div>
                    <p className="text-sm font-bold">Affiliation expires</p>
                    <p className="text-sm font-medium">{new Date(profile.affiliation_expires_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Upload Modal */}
      {showImageUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-60 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-200 rounded-3xl w-full max-w-2xl shadow-2xl">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-8 py-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">Update Profile Photo</h3>
                  <p className="text-indigo-100 font-medium mt-1">Upload your professional coaching photo</p>
                </div>
                <button
                  onClick={() => setShowImageUpload(false)}
                  className="p-2 text-white hover:text-gray-200 rounded-xl hover:bg-white hover:bg-opacity-20 transition-all duration-200"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-8">
              <SimpleImageUpload
                fieldName="profile_photo_url"
                fileType="image"
                value={currentPhotoUrl}
                onChange={handlePhotoUpdate}
                className="bg-white border border-gray-200 rounded-2xl"
                title="Profile Photo"
                enableCropping={true}
                aspectRatio={1}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CoachDashboardHeader