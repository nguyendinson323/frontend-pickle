import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../../store'
import { fetchDashboard, updateUser } from '../../../store/slices/authSlice'
import { startLoading, stopLoading } from '../../../store/slices/loadingSlice'
import { Player, User } from '../../../types/auth'
import api from '../../../services/api'
import SimpleImageUpload from '../../common/SimpleImageUpload'

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
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="bg-indigo-600 text-white p-6">
        <h2 className="text-xl font-semibold mb-2">Edit Profile</h2>
        <p className="text-indigo-100">Update your player information</p>
      </div>

      <div className="p-8 space-y-8">
        {/* User Account Info Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={userData.username}
                onChange={handleUserInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={userData.email}
                onChange={handleUserInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={userData.phone}
                onChange={handleUserInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Player Profile Info Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Player Information</h3>
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
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy & Searchability</h3>
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                  userData.is_searchable ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {userData.is_searchable ? '👁️' : '🔒'}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <label htmlFor="is_searchable" className="text-lg font-semibold text-gray-900">
                    Player Search Visibility
                  </label>
                  <div className="flex items-center">
                    <span className={`text-sm font-medium mr-3 ${
                      userData.is_searchable ? 'text-green-700' : 'text-gray-700'
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
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border-2 transition-all ${
                  userData.is_searchable
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : 'bg-gray-50 border-gray-200 text-gray-800'
                }`}>
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0 mt-0.5">
                      {userData.is_searchable ? (
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      {userData.is_searchable ? (
                        <div>
                          <p className="font-medium text-sm mb-1">You are visible to other players</p>
                          <p className="text-sm">
                            Other players can find you in search results and send match requests. This helps you connect with players in your area.
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-medium text-sm mb-1">You are hidden from searches</p>
                          <p className="text-sm">
                            You will not appear in player searches and cannot receive match requests from other players.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs text-blue-800">
                      <strong>Note:</strong> This setting only affects player finder searches. Your visibility in tournament results, rankings, and official federation records is not affected.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveChanges}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default PlayerProfileForm