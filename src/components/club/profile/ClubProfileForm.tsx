import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState, AppDispatch } from '../../../store'
import { updateClubProfile } from '../../../store/slices/authSlice'
import { Club, User, ClubDashboard } from '../../../types/auth'

interface ClubProfileFormProps {
  club: Club
  user: User
  onCancel: () => void
}

const ClubProfileForm: React.FC<ClubProfileFormProps> = ({ club, user, onCancel }) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  
  const [userData, setUserData] = useState({
    username: user.username,
    email: user.email,
    phone: user.phone || ''
  })

  const [clubData, setClubData] = useState({
    name: club.name,
    rfc: club.rfc || '',
    manager_name: club.manager_name || '',
    manager_title: club.manager_title || '',
    club_type: club.club_type || '',
    website: club.website || '',
    social_media: club.social_media || '',
    logo_url: club.logo_url || '',
    has_courts: club.has_courts
  })

  const mexicanStates = [
    'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas', 'Chihuahua',
    'Coahuila', 'Colima', 'Durango', 'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco', 'México',
    'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla', 'Querétaro',
    'Quintana Roo', 'San Luis Potosí', 'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala',
    'Veracruz', 'Yucatán', 'Zacatecas', 'Ciudad de México'
  ]

  const clubTypes = [
    { value: 'recreational', label: 'Recreational Club' },
    { value: 'competitive', label: 'Competitive Club' },
    { value: 'training', label: 'Training Club' },
    { value: 'social', label: 'Social Club' }
  ]

  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData(prev => ({ ...prev, [name]: value }))
  }

  const handleClubInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setClubData(prev => ({ ...prev, [name]: checked }))
    } else {
      setClubData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const updateData = {
      ...clubData,
      user_data: userData
    }

    dispatch(updateClubProfile(updateData))
    navigate('/club/profile')
  }

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="bg-purple-600 text-white p-6">
        <h2 className="text-xl font-semibold mb-2">Edit Profile</h2>
        <p className="text-purple-100">Update your club information</p>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Club Profile Info Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Club Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Club Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={clubData.name}
                onChange={handleClubInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label htmlFor="club_type" className="block text-sm font-medium text-gray-700 mb-2">
                Club Type
              </label>
              <select
                id="club_type"
                name="club_type"
                value={clubData.club_type}
                onChange={handleClubInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select club type</option>
                {clubTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="rfc" className="block text-sm font-medium text-gray-700 mb-2">
                RFC
              </label>
              <input
                type="text"
                id="rfc"
                name="rfc"
                value={clubData.rfc}
                onChange={handleClubInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label htmlFor="manager_name" className="block text-sm font-medium text-gray-700 mb-2">
                Manager Name
              </label>
              <input
                type="text"
                id="manager_name"
                name="manager_name"
                value={clubData.manager_name}
                onChange={handleClubInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label htmlFor="manager_title" className="block text-sm font-medium text-gray-700 mb-2">
                Manager Title
              </label>
              <input
                type="text"
                id="manager_title"
                name="manager_title"
                value={clubData.manager_title}
                onChange={handleClubInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={clubData.website}
                onChange={handleClubInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label htmlFor="social_media" className="block text-sm font-medium text-gray-700 mb-2">
                Social Media
              </label>
              <input
                type="text"
                id="social_media"
                name="social_media"
                value={clubData.social_media}
                onChange={handleClubInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label htmlFor="logo_url" className="block text-sm font-medium text-gray-700 mb-2">
                Logo URL
              </label>
              <input
                type="url"
                id="logo_url"
                name="logo_url"
                value={clubData.logo_url}
                onChange={handleClubInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="md:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="has_courts"
                  name="has_courts"
                  checked={clubData.has_courts}
                  onChange={handleClubInputChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="has_courts" className="ml-2 block text-sm text-gray-900">
                  Club has courts available
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover: focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}

export default ClubProfileForm