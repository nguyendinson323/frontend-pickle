import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState, AppDispatch } from '../../store'
import { fetchPartnerDashboard } from '../../store/slices/partnerDashboardSlice'
import { PartnerProfileView, PartnerProfileForm } from '../../components/partner/profile'

const PartnerProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)
  const { dashboardData, isLoading, error } = useSelector((state: RootState) => state.partnerDashboard)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    if (user?.role !== 'partner') {
      navigate('/dashboard')
      return
    }

    if (!dashboardData) {
      dispatch(fetchPartnerDashboard())
    }
  }, [dispatch, isAuthenticated, user, navigate, dashboardData])

  if (!isAuthenticated || user?.role !== 'partner') {
    return null
  }

  if (isLoading || !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const profile = dashboardData.profile

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
                    onClick={() => navigate('/partner/dashboard')}
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
            <h1 className="text-3xl font-bold text-gray-900">Partner Profile</h1>
            <p className="mt-1 text-sm text-gray-600">
              View and manage your partner information
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Profile Content */}
          {isEditing ? (
            <PartnerProfileForm 
              partner={profile}
              user={user}
              onCancel={handleCancel}
            />
          ) : (
            <PartnerProfileView 
              partner={profile}
              user={user}
              onEdit={handleEdit}
            />
          )}
        </div>
    </div>
  )
}

export default PartnerProfilePage