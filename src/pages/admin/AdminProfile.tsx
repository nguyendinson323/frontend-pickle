import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../../store'
import { AdminProfileView, AdminProfileForm } from '../../components/admin/profile'

const AdminProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.auth)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login')
    }
  }, [user, navigate])

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-600"></div>
      </div>
    )
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen  py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Navigation Breadcrumb */}
          <div className="mb-8">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-4">
                <li>
                  <button
                    onClick={() => navigate('/admin/dashboard')}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    Dashboard
                  </button>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-gray-300"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                    </svg>
                    <span className="ml-4 text-sm font-medium text-gray-500" aria-current="page">
                      Profile
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>

          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Administrator Profile</h1>
            <p className="mt-1 text-sm text-gray-600">
              View and manage your administrator account information
            </p>
          </div>

          {/* Profile Content */}
          {isEditing ? (
            <AdminProfileForm 
              user={user}
              onCancel={handleCancel}
            />
          ) : (
            <AdminProfileView 
              user={user}
              onEdit={handleEdit}
            />
          )}
        </div>
    </div>
  )
}

export default AdminProfilePage