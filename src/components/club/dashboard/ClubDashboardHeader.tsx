import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { AppDispatch } from '../../../store'
import { updateClubLogoAPI } from '../../../store/slices/clubDashboardSlice'
import SimpleImageUpload from '../../common/SimpleImageUpload'
import {
  FiEdit2,
  FiDollarSign,
  FiMapPin,
  FiUser,
  FiGlobe,
  FiStar,
  FiCheckCircle,
  FiHome,
  FiSettings,
  FiCamera
} from 'react-icons/fi'

interface ClubProfile {
  id: number
  user_id: number
  name: string
  rfc: string | null
  manager_name: string
  manager_title: string
  state_id: number
  club_type: string
  website: string | null
  social_media: string | null
  logo_url: string | null
  has_courts: boolean
  premium_expires_at: string | null
  affiliation_expires_at: string | null
  created_at: string
  updated_at: string
  state: {
    id: number
    name: string
    short_code: string
  }
}

interface ClubDashboardHeaderProps {
  profile: ClubProfile
}

const ClubDashboardHeader: React.FC<ClubDashboardHeaderProps> = ({ profile }) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const [isEditingLogo, setIsEditingLogo] = useState(false)

  const handleLogoUpdate = async (logoUrl: string) => {
    try {
      await dispatch(updateClubLogoAPI(logoUrl))
      setIsEditingLogo(false)
    } catch (error) {
      console.error('Failed to update logo:', error)
      // The error will be handled by the Redux slice and shown in the UI
    }
  }

  const getStatusBadges = () => {
    const badges = []

    if (profile.premium_expires_at && new Date(profile.premium_expires_at) > new Date()) {
      badges.push(
        <div key="premium" className="inline-flex items-center px-3 py-1 text-sm font-bold rounded-2xl border-2 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200 shadow-sm mr-3">
          <FiStar className="h-4 w-4 mr-2" />
          Premium
        </div>
      )
    }

    if (profile.affiliation_expires_at && new Date(profile.affiliation_expires_at) > new Date()) {
      badges.push(
        <div key="affiliated" className="inline-flex items-center px-3 py-1 text-sm font-bold rounded-2xl border-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200 shadow-sm mr-3">
          <FiCheckCircle className="h-4 w-4 mr-2" />
          Affiliated
        </div>
      )
    }

    if (profile.has_courts) {
      badges.push(
        <div key="courts" className="inline-flex items-center px-3 py-1 text-sm font-bold rounded-2xl border-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-200 shadow-sm mr-3">
          <FiHome className="h-4 w-4 mr-2" />
          Courts Available
        </div>
      )
    }

    return badges
  }

  return (
    <div className="mb-10">
      <div className="bg-white shadow-2xl rounded-3xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mr-6 group cursor-pointer shadow-lg">
                  {profile.logo_url ? (
                    <img
                      src={profile.logo_url}
                      alt="Club Logo"
                      className="w-20 h-20 rounded-2xl object-cover"
                      onClick={() => setIsEditingLogo(true)}
                    />
                  ) : (
                    <div
                      className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white cursor-pointer"
                      onClick={() => setIsEditingLogo(true)}
                    >
                      <FiHome className="h-10 w-10" />
                    </div>
                  )}
                  <div
                    className="absolute inset-0 bg-black bg-opacity-50 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-200 cursor-pointer"
                    onClick={() => setIsEditingLogo(true)}
                  >
                    <FiCamera className="w-8 h-8 text-white" />
                  </div>
                </div>
                {isEditingLogo && (
                  <div className="absolute top-0 left-0 z-50">
                    <SimpleImageUpload
                      fieldName="logo_url"
                      fileType="image"
                      value={profile.logo_url || ''}
                      onChange={handleLogoUpdate}
                      title="Upload Club Logo"
                      enableCropping={true}
                      aspectRatio={1}
                    />
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-3">{profile.name}</h1>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center text-purple-100">
                    <FiSettings className="h-5 w-5 mr-2" />
                    <span className="font-medium">{profile.club_type} Club</span>
                  </div>
                  {profile.state?.name && (
                    <div className="flex items-center text-purple-100">
                      <FiMapPin className="h-5 w-5 mr-2" />
                      <span className="font-medium">{profile.state.name}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center text-purple-100">
                    <FiUser className="h-5 w-5 mr-2" />
                    <span className="font-medium">Manager: {profile.manager_name || 'Not specified'}</span>
                  </div>
                  {profile.website && (
                    <div className="flex items-center text-purple-100">
                      <FiGlobe className="h-5 w-5 mr-2" />
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className="font-medium hover:text-white transition-colors duration-200">
                        Website
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/club/profile')}
                className="inline-flex items-center px-6 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-bold rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
              >
                <FiEdit2 className="h-5 w-5 mr-2" />
                Edit Profile
              </button>
              <button
                onClick={() => navigate('/club/membership')}
                className="inline-flex items-center px-6 py-3 border-2 border-white border-opacity-50 text-white hover:border-opacity-100 hover:bg-white hover:bg-opacity-10 font-bold rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
              >
                <FiDollarSign className="h-5 w-5 mr-2" />
                Manage Subscription
              </button>
            </div>
          </div>
        </div>

        {/* Status Badges Section */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h3 className="text-lg font-bold text-gray-900 mr-4">Club Status</h3>
              <div className="flex items-center">
                {getStatusBadges()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClubDashboardHeader