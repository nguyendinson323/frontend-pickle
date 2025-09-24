import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../../store'
import { fetchDashboard, updateUser } from '../../../store/slices/authSlice'
import { startLoading, stopLoading } from '../../../store/slices/loadingSlice'
import { Player, User } from '../../../types/auth'
import api from '../../../services/api'
import SimpleImageUpload from '../../common/SimpleImageUpload'
import {
  FiEdit3,
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiMapPin,
  FiFileText,
  FiImage,
  FiSettings,
  FiShield,
  FiSave,
  FiX,
  FiAlertCircle,
  FiCheckCircle,
  FiLock,
  FiUnlock,
  FiInfo
} from 'react-icons/fi'

interface PlayerProfileFormProps {
  player: Player
  user: User
  onCancel: () => void
}

const PlayerProfileForm: React.FC<PlayerProfileFormProps> = ({ player, user, onCancel }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { dashboard } = useSelector((state: RootState) => state.auth)
  const [states, setStates] = useState<{ id: number, name: string }[]>([])

  const [userData, setUserData] = useState({
    username: user.username || '',
    email: user.email || '',
    phone: user.phone || '',
    is_searchable: user.is_searchable || false
  })

  const [playerData, setPlayerData] = useState({
    full_name: player.full_name || '',
    birth_date: player.birth_date || '',
    gender: player.gender || '',
    state_id: player.state?.id || 0,
    curp: player.curp || '',
    nrtp_level: player.nrtp_level || 0,
    profile_photo_url: player.profile_photo_url || '',
    id_document_url: player.id_document_url || '',
    nationality: player.nationality || ''
  })

  // Update form state when user/player props change (in case data loads asynchronously)
  useEffect(() => {
    setUserData({
      username: user.username || '',
      email: user.email || '',
      phone: user.phone || '',
      is_searchable: user.is_searchable || false
    })
  }, [user])

  // Fetch states on component mount
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await api.get<{ id: number, name: string }[]>('/api/common/states')
        setStates(response.data || [])
      } catch (error) {
        console.error('Failed to fetch states:', error)
        setStates([])
      }
    }
    
    fetchStates()
  }, [])


  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setUserData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }))
  }

  const handlePlayerInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === 'nrtp_level') {
      setPlayerData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }))
    } else if (name === 'state_id') {
      setPlayerData(prev => ({ ...prev, [name]: parseInt(value) || 0 }))
    } else {
      setPlayerData(prev => ({ ...prev, [name]: value }))
    }
  }


  // File upload handlers - only update form data, not Redux
  const handleProfilePhotoUpload = (url: string) => {
    // Only update form data - Redux will be updated when Save Changes is clicked
    setPlayerData(prev => ({ ...prev, profile_photo_url: url }))
  }

  const handleDocumentUpload = (url: string) => {
    // Only update form data - Redux will be updated when Save Changes is clicked
    setPlayerData(prev => ({ ...prev, id_document_url: url }))
  }

  const handleSaveChanges = async () => {
    
    // Validation with better error messages
    const errors: string[] = []

    if (!userData.username.trim()) {
      errors.push('Username is required')
    }

    if (!userData.email.trim()) {
      errors.push('Email is required')
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      errors.push('Please enter a valid email address')
    }

    if (!playerData.full_name.trim()) {
      errors.push('Full name is required')
    }

    if (!playerData.birth_date) {
      errors.push('Birth date is required')
    } else {
      const age = new Date().getFullYear() - new Date(playerData.birth_date).getFullYear()
      if (age < 16) {
        errors.push('Players must be at least 16 years old')
      }
      if (age > 100) {
        errors.push('Please enter a valid birth date')
      }
    }

    if (playerData.nrtp_level < 1.0 || playerData.nrtp_level > 5.0) {
      errors.push('NRTP level must be between 1.0 and 5.0')
    }

    if (errors.length > 0) {
      alert(`Please fix the following errors:\n\n• ${errors.join('\n• ')}`)
      return
    }
    
    try {
      dispatch(startLoading('Updating profile...'))
      
      // Use form data directly - the upload handlers have already updated playerData with latest URLs

      // Prepare clean data for submission using form data (already updated by upload handlers)
      const cleanPlayerData = {
        ...playerData,
        state_id: playerData.state_id === 0 ? null : playerData.state_id,
        profile_photo_url: playerData.profile_photo_url?.trim() || null,
        id_document_url: playerData.id_document_url?.trim() || null
      }

      
      // Update user account information only if user data changed
      if (userData.username !== user.username ||
          userData.email !== user.email ||
          userData.phone !== user.phone ||
          userData.is_searchable !== user.is_searchable) {
        const accountResponse = await api.put('/api/player/account', userData) as any
        // Update user data in Redux immediately after successful account update
        dispatch(updateUser(accountResponse.data))
      }

      // Update player profile information (including uploaded file URLs)
      await api.put('/api/player/profile', cleanPlayerData)
      
      // Refresh dashboard data to get updated profile
      await dispatch(fetchDashboard('player'))
      
      // Close editing mode
      onCancel()
      
    } catch (error: any) {
      console.error('Failed to update profile:', error)
      const errorMessage = error.response?.data?.message || 'Failed to update profile'
      alert(errorMessage)
    } finally {
      dispatch(stopLoading())
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-100">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white p-8">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-6 shadow-lg">
            <FiEdit3 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-2">Edit Profile</h2>
            <p className="text-indigo-100 text-lg font-medium">Update your player information</p>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8 bg-gradient-to-br from-white to-gray-50">
        {/* User Account Info Section */}
        <div className="bg-white rounded-3xl shadow-xl border-2 border-blue-100 p-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
              <FiUser className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Account Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="username" className="block text-sm font-bold text-blue-700 mb-3 flex items-center">
                <FiUser className="w-4 h-4 mr-2" />
                Username <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={userData.username}
                onChange={handleUserInputChange}
                className="w-full px-4 py-3 border-2 border-blue-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium bg-blue-50 transition-all duration-300"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-green-700 mb-3 flex items-center">
                <FiMail className="w-4 h-4 mr-2" />
                Email <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={userData.email}
                onChange={handleUserInputChange}
                className="w-full px-4 py-3 border-2 border-green-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium bg-green-50 transition-all duration-300"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-bold text-purple-700 mb-3 flex items-center">
                <FiPhone className="w-4 h-4 mr-2" />
                Phone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={userData.phone}
                onChange={handleUserInputChange}
                className="w-full px-4 py-3 border-2 border-purple-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium bg-purple-50 transition-all duration-300"
              />
            </div>
          </div>
        </div>

        {/* Player Profile Info Section */}
        <div className="bg-white rounded-3xl shadow-xl border-2 border-indigo-100 p-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
              <FiShield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Player Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={playerData.full_name}
                onChange={handlePlayerInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700 mb-2">
                Birth Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="birth_date"
                name="birth_date"
                value={playerData.birth_date}
                onChange={handlePlayerInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={playerData.gender}
                onChange={handlePlayerInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="state_id" className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <select
                id="state_id"
                name="state_id"
                value={playerData.state_id}
                onChange={handlePlayerInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={0}>Select a state...</option>
                {states.map(state => (
                  <option key={state.id} value={state.id}>{state.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-2">
                Nationality
              </label>
              <input
                type="text"
                id="nationality"
                name="nationality"
                value={playerData.nationality}
                onChange={handlePlayerInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="curp" className="block text-sm font-medium text-gray-700 mb-2">
                CURP
              </label>
              <input
                type="text"
                id="curp"
                name="curp"
                value={playerData.curp}
                onChange={handlePlayerInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="nrtp_level" className="block text-sm font-medium text-gray-700 mb-2">
                NRTP Level
              </label>
              <input
                type="number"
                step="0.1"
                min="1.0"
                max="5.0"
                id="nrtp_level"
                name="nrtp_level"
                value={playerData.nrtp_level}
                onChange={handlePlayerInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="md:col-span-2">
              <SimpleImageUpload
                fieldName="profile_photo_url"
                fileType="image"
                value={playerData.profile_photo_url}
                onChange={handleProfilePhotoUpload}
                title="Profile Photo"
                enableCropping={true}
                aspectRatio={1}
                className="bg-gray-50 border border-gray-200"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>}
              />
            </div>
            <div className="md:col-span-2">
              <SimpleImageUpload
                fieldName="id_document_url"
                fileType="document"
                value={playerData.id_document_url}
                onChange={handleDocumentUpload}
                title="ID Document"
                enableCropping={false}
                className="bg-gray-50 border border-gray-200"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>}
              />
            </div>
          </div>
        </div>

        {/* Privacy Settings Section */}
        <div className="bg-white rounded-3xl shadow-xl border-2 border-yellow-100 p-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
              {userData.is_searchable ? <FiUnlock className="w-6 h-6 text-white" /> : <FiLock className="w-6 h-6 text-white" />}
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Privacy & Searchability</h3>
          </div>
          <div className={`bg-gradient-to-br border-2 rounded-3xl p-8 ${
            userData.is_searchable
              ? 'from-green-50 to-emerald-50 border-green-200'
              : 'from-yellow-50 to-orange-50 border-yellow-200'
          }`}>
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
                  userData.is_searchable ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-yellow-500 to-orange-600'
                }`}>
                  {userData.is_searchable ? <FiUnlock className="w-8 h-8 text-white" /> : <FiLock className="w-8 h-8 text-white" />}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  <label htmlFor="is_searchable" className="text-xl font-bold text-gray-900">
                    Player Search Visibility
                  </label>
                  <div className="flex items-center space-x-4">
                    <span className={`text-lg font-bold px-4 py-2 rounded-full shadow-lg ${
                      userData.is_searchable
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                        : 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white'
                    }`}>
                      {userData.is_searchable ? 'Visible' : 'Hidden'}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="is_searchable"
                        name="is_searchable"
                        checked={userData.is_searchable}
                        onChange={handleUserInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-emerald-600 shadow-lg"></div>
                    </label>
                  </div>
                </div>

                <div className={`p-6 rounded-2xl border-2 transition-all shadow-lg ${
                  userData.is_searchable
                    ? 'bg-gradient-to-br from-green-100 to-emerald-100 border-green-300'
                    : 'bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-300'
                }`}>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      {userData.is_searchable ? (
                        <FiCheckCircle className="w-6 h-6 text-green-700" />
                      ) : (
                        <FiAlertCircle className="w-6 h-6 text-yellow-700" />
                      )}
                    </div>
                    <div>
                      {userData.is_searchable ? (
                        <div>
                          <p className="font-bold text-green-800 mb-2 text-lg">You are visible to other players</p>
                          <p className="text-green-700 font-medium">
                            Other players can find you in search results and send match requests. This helps you connect with players in your area.
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-bold text-yellow-800 mb-2 text-lg">You are hidden from searches</p>
                          <p className="text-yellow-700 font-medium">
                            You will not appear in player searches and cannot receive match requests from other players.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl shadow-lg">
                  <div className="flex items-start space-x-3">
                    <FiInfo className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-blue-800 font-bold mb-1">Important Note</p>
                      <p className="text-sm text-blue-700 font-medium">
                        This setting only affects player finder searches. Your visibility in tournament results, rankings, and official federation records is not affected.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 p-8">
          <div className="flex justify-end space-x-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:transform hover:scale-105 flex items-center"
            >
              <FiX className="w-5 h-5 mr-2" />
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveChanges}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:transform hover:scale-105 flex items-center"
            >
              <FiSave className="w-5 h-5 mr-2" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerProfileForm