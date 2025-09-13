import React from 'react'
import { useNavigate } from 'react-router-dom'
import { User } from '../../../types/auth'
import { ADMIN_AVATAR_URL } from '../../../constants/admin'

interface AdminDashboardHeaderProps {
  user: User
}

const AdminDashboardHeader: React.FC<AdminDashboardHeaderProps> = ({ user }) => {
  const navigate = useNavigate()

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <img
              src={ADMIN_AVATAR_URL}
              alt="Admin Profile"
              className="w-16 h-16 rounded-full object-cover border-4 border-gray-200"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user.username}. Manage the entire federation platform.</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate('/admin/profile')}
            className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition-colors duration-200"
          >
            View Profile
          </button>
          <button
            onClick={() => navigate('/admin/settings')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
          >
            Settings
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardHeader