import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState, AppDispatch } from '../../store'
import { MicrositeAdmin } from '../../types/admin'
import { fetchMicrosites } from '../../store/slices/adminMicrositesSlice'
import {
  MicrositesTable,
  MicrositeStats,
  MicrositeFilters,
  MicrositeDetail
} from '../../components/admin/microsites'
import {
  FiGlobe,
  FiArrowLeft,
  FiAlertCircle,
  FiLoader
} from 'react-icons/fi'

const AdminMicrosites: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.auth)
  const { micrositeFilter, error } = useSelector((state: RootState) => state.adminMicrosites)
  
  const [selectedMicrositeForDetail, setSelectedMicrositeForDetail] = useState<MicrositeAdmin | null>(null)

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login')
      return
    }

    // Fetch initial data
    dispatch(fetchMicrosites(micrositeFilter))
  }, [dispatch, user, navigate])

  useEffect(() => {
    // Refresh data when filters change
    dispatch(fetchMicrosites(micrositeFilter))
  }, [dispatch, micrositeFilter])

  const handleMicrositeSelect = (microsite: MicrositeAdmin) => {
    setSelectedMicrositeForDetail(microsite)
  }

  const handleMicrositeDetailClose = () => {
    setSelectedMicrositeForDetail(null)
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="animate-spin h-16 w-16 text-indigo-600 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-700">Loading microsites management...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we set up your admin panel</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg mr-6">
                <FiGlobe className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Microsites Management</h1>
                <p className="mt-2 text-lg text-gray-600">
                  Supervise and manage all club, partner, and state microsites
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 rounded-xl shadow-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <FiArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <FiAlertCircle className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-bold text-red-800">Error Occurred</h3>
                <div className="mt-2 text-red-700 font-medium">
                  {error}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Microsite Statistics */}
        <MicrositeStats />

        {/* Content */}
        <div className="space-y-6">
          <MicrositeFilters />
          <MicrositesTable onMicrositeSelect={handleMicrositeSelect} />
        </div>

        {/* Microsite Detail Modal */}
        {selectedMicrositeForDetail && (
          <MicrositeDetail
            microsite={selectedMicrositeForDetail}
            onClose={handleMicrositeDetailClose}
          />
        )}
      </div>
    </div>
  )
}

export default AdminMicrosites