import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../../store'
import { ClubDashboard } from '../../types/auth'
import ClubProfileView from '../../components/club/profile/ClubProfileView'
import ClubProfileForm from '../../components/club/profile/ClubProfileForm'
import {
  FiHome,
  FiChevronRight,
  FiUser,
  FiEdit3
} from 'react-icons/fi'

const ClubProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const { user, dashboard } = useSelector((state: RootState) => state.auth)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (!user || user.role !== 'club') {
      navigate('/login')
    }
  }, [user, navigate])

  if (!user || user.role !== 'club' || !dashboard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-300 border-t-purple-600 mx-auto mb-6"></div>
          <p className="text-gray-600 font-medium text-lg">Loading your profile...</p>
        </div>
      </div>
    )
  }

  const clubData = dashboard as ClubDashboard
  const profile = clubData.profile

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Navigation Breadcrumb */}
          <div className="mb-8">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-4">
                <li>
                  <button
                    onClick={() => navigate('/club/dashboard')}
                    className="flex items-center text-gray-500 hover:text-purple-600 font-medium transition-colors duration-200"
                  >
                    <FiHome className="h-4 w-4 mr-2" />
                    Dashboard
                  </button>
                </li>
                <li>
                  <div className="flex items-center">
                    <FiChevronRight className="flex-shrink-0 h-4 w-4 text-gray-400 mx-3" />
                    <span className="text-sm font-bold text-purple-600 flex items-center" aria-current="page">
                      <FiUser className="h-4 w-4 mr-2" />
                      Profile
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>

          {/* Page Title */}
          <div className="mb-10">
            <div className="bg-gradient-to-r from-white to-purple-50 border border-purple-200 rounded-3xl shadow-2xl p-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-3 flex items-center">
                <FiUser className="h-8 w-8 mr-4 text-purple-600" />
                Club Profile
              </h1>
              <p className="text-lg text-gray-600 font-medium">
                View and manage your club information and settings
              </p>
              {!isEditing && (
                <button
                  onClick={handleEdit}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-2xl hover:from-purple-700 hover:to-indigo-800 font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105"
                >
                  <FiEdit3 className="w-4 h-4 mr-2" />
                  Quick Edit
                </button>
              )}
            </div>
          </div>

          {/* Profile Content */}
          {isEditing ? (
            <ClubProfileForm 
              club={profile}
              user={user}
              onCancel={handleCancel}
            />
          ) : (
            <ClubProfileView 
              club={profile}
              user={user}
              onEdit={handleEdit}
            />
          )}
        </div>
    </div>
  )
}

export default ClubProfilePage