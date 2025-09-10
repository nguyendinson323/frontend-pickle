import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState, AppDispatch } from '../../store'
import { fetchStateDashboard } from '../../store/slices/stateDashboardSlice'
import { StateProfileView, StateProfileForm } from '../../components/state/profile'

const StateProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const { dashboardData, isLoading, error } = useSelector((state: RootState) => state.stateDashboard)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (!user || user.role !== 'state') {
      navigate('/login')
      return
    }
    
    if (!dashboardData) {
      dispatch(fetchStateDashboard())
    }
  }, [user, navigate, dispatch, dashboardData])

  if (!user || user.role !== 'state') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (isLoading || !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg font-medium">{error}</div>
          <button 
            onClick={() => dispatch(fetchStateDashboard())} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Retry
          </button>
        </div>
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
                    onClick={() => navigate('/state/dashboard')}
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
            <h1 className="text-3xl font-bold text-gray-900">State Committee Profile</h1>
            <p className="mt-1 text-sm text-gray-600">
              View and manage your state committee information
            </p>
          </div>

          {/* Profile Content */}
          {isEditing ? (
            <StateProfileForm 
              stateCommittee={profile}
              user={user}
              onCancel={handleCancel}
            />
          ) : (
            <StateProfileView 
              stateCommittee={profile}
              user={user}
              onEdit={handleEdit}
            />
          )}
        </div>
    </div>
  )
}

export default StateProfilePage