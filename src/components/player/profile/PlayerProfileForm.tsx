import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../store'
import { fetchDashboard, updateUser, updateProfileImage } from '../../../store/slices/authSlice'
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

  // Debug logging to check if user data is being passed correctly
  useEffect(() => {
    console.log('🔍 PlayerProfileForm - User data received:', {
      username: user.username,
      email: user.email,
      phone: user.phone,
      is_searchable: user.is_searchable
    })
  }, [user])

  // Update form state when user/player props change (in case data loads asynchronously)
  useEffect(() => {
    setUserData({
      username: user.username || '',
      email: user.email || '',
      phone: user.phone || '',
      is_searchable: user.is_searchable || false
    })
  }, [user])

  useEffect(() => {
    setPlayerData({
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
  }, [player])

  // Fetch states on component mount
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await api.get<{ id: number, name: string }[]>('/api/player/states')
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

  const handleProfilePhotoChange = (url: string) => {
    setPlayerData(prev => ({ ...prev, profile_photo_url: url }))
  }

  // Document upload handler (keep for now but not used in simplified avatar workflow)
  const handleDocumentChange = (url: string) => {
    setPlayerData(prev => ({ ...prev, id_document_url: url }))
  }

  // Immediate upload handlers for Redux state updates
  const handleProfilePhotoUpload = (url: string) => {
    // Update form data immediately
    setPlayerData(prev => ({ ...prev, profile_photo_url: url }))
    // Update Redux state for immediate visual updates
    dispatch(updateProfileImage({ imageType: 'profile_photo_url', imageUrl: url }))
  }

  const handleDocumentUpload = (url: string) => {
    // Update form data immediately
    setPlayerData(prev => ({ ...prev, id_document_url: url }))
    // Update Redux state for immediate visual updates
    dispatch(updateProfileImage({ imageType: 'id_document_url', imageUrl: url }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!userData.username.trim()) {
      alert('Username is required')
      return
    }
    
    if (!userData.email.trim()) {
      alert('Email is required')
      return
    }
    
    if (!playerData.full_name.trim()) {
      alert('Full name is required')
      return
    }
    
    if (!playerData.birth_date) {
      alert('Birth date is required')
      return
    }
    
    if (playerData.nrtp_level < 1.0 || playerData.nrtp_level > 5.0) {
      alert('NRTP level must be between 1.0 and 5.0')
      return
    }
    
    try {
      dispatch(startLoading('Updating profile...'))
      
      // Prepare clean data for submission
      const cleanPlayerData = {
        ...playerData,
        state_id: playerData.state_id === 0 ? null : playerData.state_id,
        profile_photo_url: playerData.profile_photo_url.trim() || null,
        id_document_url: playerData.id_document_url.trim() || null
      }
      
      // Update user account information first
      if (userData.username !== user.username ||
          userData.email !== user.email ||
          userData.phone !== user.phone ||
          userData.is_searchable !== user.is_searchable) {
        const accountResponse = await api.put('/api/player/account', userData) as any
        // Update user data in Redux immediately after successful account update
        dispatch(updateUser(accountResponse.data))
      }
      
      // Update player profile information
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

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
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
                uploadType="player-photo-auth"
                value={playerData.profile_photo_url}
                onChange={handleProfilePhotoChange}
                onUploadComplete={handleProfilePhotoUpload}
                title="Profile Photo"
                className="bg-gray-50 border border-gray-200"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>}
              />
            </div>
            <div className="md:col-span-2">
              <SimpleImageUpload
                uploadType="player-document-auth"
                value={playerData.id_document_url}
                onChange={handleDocumentChange}
                onUploadComplete={handleDocumentUpload}
                title="ID Document"
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
          <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy Settings</h3>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  id="is_searchable"
                  name="is_searchable"
                  checked={userData.is_searchable}
                  onChange={handleUserInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="is_searchable" className="font-medium text-gray-900">
                  Can Be Found in Player Searches
                </label>
                <p className="text-gray-600">
                  When enabled, other players will be able to find you in search results and send you match requests. 
                  When disabled, you will be hidden from all player searches and cannot receive match requests.
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  Note: This setting does not affect your visibility in tournament results or rankings.
                </p>
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
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}

export default PlayerProfileForm