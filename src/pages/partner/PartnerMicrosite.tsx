import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import {
  fetchPartnerMicrositeData,
  updatePartnerMicrositeInfo,
  PartnerMicrositeInfo
} from '../../store/slices/partnerMicrositeSlice'

import MicrositeHeader from '../../components/partner/microsite/MicrositeHeader'
import CourtsSection from '../../components/partner/microsite/CourtsSection'
import TournamentsSection from '../../components/partner/microsite/TournamentsSection'

const PartnerMicrosite: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { partnerId } = useParams<{ partnerId?: string }>()
  
  const { user } = useSelector((state: RootState) => state.auth)
  const {
    micrositeInfo,
    courts,
    tournaments,
    stats,
    loading,
    error,
    isPublicView
  } = useSelector((state: RootState) => state.partnerMicrosite)

  const [showEditModal, setShowEditModal] = useState(false)

  // Determine if this is public view (with partnerId) or owner view
  const isOwner = !partnerId && user?.role === 'partner'

  useEffect(() => {
    if (partnerId) {
      // Public view - fetch by partner ID
      dispatch(fetchPartnerMicrositeData(partnerId) as any)
    } else if (user) {
      if (user.role === 'partner') {
        // Authenticated partner - fetch their own data
        dispatch(fetchPartnerMicrositeData() as any)
      } else {
        // Non-partner user trying to access without partner ID
        navigate('/dashboard')
      }
    }
  }, [dispatch, partnerId, user, navigate])

  const handleEditMicrosite = async (data: Partial<PartnerMicrositeInfo>) => {
    try {
      await dispatch(updatePartnerMicrositeInfo(data) as any)
      setShowEditModal(false)
    } catch (error) {
      console.error('Failed to update microsite:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
            <div className="h-32 bg-gray-200 rounded-lg mb-6"></div>
            <div className="h-48 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Microsite</h3>
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MicrositeHeader
          micrositeInfo={micrositeInfo}
          stats={stats}
          isOwner={isOwner}
          onEdit={() => setShowEditModal(true)}
        />

        {courts.length > 0 && (
          <CourtsSection
            courts={courts}
            isOwner={isOwner}
          />
        )}

        {tournaments.length > 0 && (
          <TournamentsSection
            tournaments={tournaments}
            isOwner={isOwner}
          />
        )}

        {!micrositeInfo?.is_active && isOwner && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Microsite Inactive
                </h3>
                <p className="mt-2 text-sm text-yellow-700">
                  Your microsite is currently inactive and not visible to the public. 
                  Contact support to activate your microsite.
                </p>
              </div>
            </div>
          </div>
        )}

        {courts.length === 0 && tournaments.length === 0 && isOwner && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-blue-900 mb-2">
              Get Started with Your Microsite
            </h3>
            <p className="text-blue-700 mb-4 max-w-md mx-auto">
              Add courts and create tournaments to showcase on your microsite. 
              This will help players find and book your facilities.
            </p>
            <button
              onClick={() => navigate('/partner/management')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Management
            </button>
          </div>
        )}

        {/* Edit Modal - simplified for now */}
        {showEditModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center pb-3">
                <h3 className="text-lg font-bold text-gray-900">Edit Microsite</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-4">
                <p className="text-gray-600">
                  Microsite editing functionality will be implemented here.
                </p>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PartnerMicrosite