import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState, AppDispatch } from '../../store'
import { PlayerDashboard } from '../../types'
import { fetchDashboard } from '../../store/slices/authSlice'
import { PlayerProfileView, PlayerProfileForm } from '../../components/player/profile'
import {
  FiUser,
  FiHome,
  FiChevronRight,
  FiLoader,
  FiAlertCircle
} from 'react-icons/fi'

const PlayerProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { user, dashboard } = useSelector((state: RootState) => state.auth)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (!user || user.role !== 'player') {
      navigate('/login')
      return
    }

    // Fetch fresh dashboard data which includes profile data
    const loadProfile = async () => {
      try {
        await dispatch(fetchDashboard('player'))
        console.log('✅ Profile data loaded successfully')
      } catch (error) {
        console.error('❌ Failed to load profile:', error)
      }
    }

    // Always fetch fresh data to ensure profile is up-to-date
    loadProfile()
  }, [user, navigate, dispatch])

  if (!user || user.role !== 'player' || !dashboard) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FiLoader className="w-10 h-10 text-white animate-spin" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Loading Profile</h3>
          <p className="text-gray-600 font-medium">Please wait while we load your information...</p>
        </div>
      </div>
    )
  }

  const playerData = dashboard as PlayerDashboard
  const profile = playerData.profile

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <nav className="flex" aria-label="Breadcrumb">
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-4">
              <ol className="flex items-center space-x-4">
                <li>
                  <button
                    onClick={() => navigate('/player/dashboard')}
                    className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
                  >
                    <FiHome className="w-4 h-4 mr-2" />
                    Dashboard
                  </button>
                </li>
                <li>
                  <div className="flex items-center">
                    <FiChevronRight className="flex-shrink-0 h-5 w-5 text-gray-400 mx-2" />
                    <div className="flex items-center text-gray-700 font-medium">
                      <FiUser className="w-4 h-4 mr-2" />
                      Profile
                    </div>
                  </div>
                </li>
              </ol>
            </div>
          </nav>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-white to-indigo-50 rounded-3xl shadow-xl border-2 border-indigo-100 p-8">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mr-6 shadow-lg">
                <FiUser className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Player Profile</h1>
                <p className="text-lg text-indigo-700 font-medium">
                  View and manage your player information
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        {isEditing ? (
          <PlayerProfileForm 
            player={profile}
            user={user}
            onCancel={handleCancel}
          />
        ) : (
          <PlayerProfileView 
            player={profile}
            user={user}
            onEdit={handleEdit}
          />
        )}
      </div>
    </div>
  )
}

export default PlayerProfilePage