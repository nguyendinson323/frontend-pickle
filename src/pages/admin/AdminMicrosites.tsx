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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Microsites Management</h1>
              <p className="mt-2 text-gray-600">
                Supervise and manage all club, partner, and state microsites
              </p>
            </div>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover: transition-colors"
            >
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
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