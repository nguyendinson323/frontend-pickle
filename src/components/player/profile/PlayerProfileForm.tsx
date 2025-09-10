import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState, AppDispatch } from '../../../store'
import { updatePlayerProfile, fetchDashboard } from '../../../store/slices/authSlice'
import { startLoading, stopLoading } from '../../../store/slices/loadingSlice'
import { Player, User, PlayerDashboard } from '../../../types/auth'
import api from '../../../services/api'

interface PlayerProfileFormProps {
  player: Player
  user: User
  onCancel: () => void
}

const PlayerProfileForm: React.FC<PlayerProfileFormProps> = ({ player, user, onCancel }) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const [states, setStates] = useState<{ id: number, name: string }[]>([])
  
  const [userData, setUserData] = useState({
    username: user.username,
    email: user.email,
    phone: user.phone || ''
  })

  const [playerData, setPlayerData] = useState({
    full_name: player.full_name,
    birth_date: player.birth_date,
    gender: player.gender,
    state_id: player.state?.id || 0,
    curp: player.curp || '',
    nrtp_level: player.nrtp_level || 0,
    profile_photo_url: player.profile_photo_url || '',
    nationality: player.nationality
  })

  // Fetch states on component mount
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await api.get('/api/player/states')
        setStates(response.data)
      } catch (error) {
        console.error('Failed to fetch states:', error)
      }
    }
    
    fetchStates()
  }, [])


  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData(prev => ({ ...prev, [name]: value }))
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      dispatch(startLoading('Updating profile...'))
      
      // Update user account information first
      if (userData.username !== user.username || userData.email !== user.email || userData.phone !== user.phone) {
        await api.put('/api/player/account', userData)
      }
      
      // Update player profile information
      await api.put('/api/player/profile', playerData)
      
      // Refresh dashboard data to get updated profile
      await dispatch(fetchDashboard('player'))
      
      // Close editing mode
      onCancel()
      
    } catch (error) {
      console.error('Failed to update profile:', error)
      // Could show error message to user here
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
                Username
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
                Email
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
                Full Name
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
                Birth Date
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
                max="10.0"
                id="nrtp_level"
                name="nrtp_level"
                value={playerData.nrtp_level}
                onChange={handlePlayerInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="profile_photo_url" className="block text-sm font-medium text-gray-700 mb-2">
                Profile Photo URL
              </label>
              <input
                type="url"
                id="profile_photo_url"
                name="profile_photo_url"
                value={playerData.profile_photo_url}
                onChange={handlePlayerInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover: focus:outline-none focus:ring-2 focus:ring-indigo-500"
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