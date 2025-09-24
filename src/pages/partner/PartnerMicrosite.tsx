import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import {
  fetchPartnerMicrositeData,
  updatePartnerMicrositeInfo,
  PartnerMicrositeInfo
} from '../../store/slices/partnerMicrositeSlice'
import {
  FiLoader,
  FiAlertCircle,
  FiArrowLeft,
  FiAlertTriangle,
  FiInfo,
  FiSettings
} from 'react-icons/fi'

import MicrositeHeader from '../../components/partner/microsite/MicrositeHeader'
import CourtsSection from '../../components/partner/microsite/CourtsSection'
import TournamentsSection from '../../components/partner/microsite/TournamentsSection'
import PagesSection from '../../components/partner/microsite/PagesSection'
import MicrositeEditModal from '../../components/partner/microsite/MicrositeEditModal'

const PartnerMicrosite: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { partnerId } = useParams<{ partnerId?: string }>()
  
  const { user } = useSelector((state: RootState) => state.auth)
  const {
    micrositeInfo,
    courts,
    tournaments,
    pages,
    stats,
    error
  } = useSelector((state: RootState) => state.partnerMicrosite)
  
  const { isLoading: loading } = useSelector((state: RootState) => state.loading)

  const [showEditModal, setShowEditModal] = useState(false)

  // Determine if this is public view (with partnerId) or owner view
  const isOwner = !partnerId && user?.role === 'partner'

  useEffect(() => {
    if (partnerId) {
      // Public view - fetch by partner ID
      dispatch(fetchPartnerMicrositeData(partnerId))
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
      await dispatch(updatePartnerMicrositeInfo(data))
      setShowEditModal(false)
    } catch (error) {
      console.error('Failed to update microsite:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex justify-center items-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-700 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-pulse shadow-lg">
            <FiLoader className="w-10 h-10 text-white animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Microsite</h2>
          <p className="text-gray-600 font-medium">Please wait while we fetch the partner information...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 shadow-2xl rounded-3xl p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-pink-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FiAlertCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-red-900 mb-4">Error Loading Microsite</h3>
            <p className="text-red-800 font-medium mb-8">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-pink-700 text-white rounded-2xl hover:from-red-700 hover:to-pink-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:transform hover:scale-105 font-bold"
            >
              <FiArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
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

        <PagesSection
          pages={pages}
          isOwner={isOwner}
        />

        {!micrositeInfo?.is_active && isOwner && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 shadow-lg rounded-2xl p-6 mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-600 to-orange-700 rounded-2xl flex items-center justify-center mr-4">
                <FiAlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-yellow-900 mb-1">
                  Microsite Inactive
                </h3>
                <p className="text-yellow-800 font-medium">
                  Your microsite is currently inactive and not visible to the public. Contact support to activate your microsite.
                </p>
              </div>
            </div>
          </div>
        )}

        {courts.length === 0 && tournaments.length === 0 && isOwner && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 shadow-2xl rounded-3xl p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FiInfo className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-blue-900 mb-4">
              Get Started with Your Microsite
            </h3>
            <p className="text-blue-800 font-medium mb-8 max-w-md mx-auto">
              Add courts and create tournaments to showcase on your microsite. This will help players find and book your facilities.
            </p>
            <button
              onClick={() => navigate('/partner/management')}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:transform hover:scale-105 font-bold"
            >
              <FiSettings className="w-5 h-5 mr-2" />
              Go to Management
            </button>
          </div>
        )}

        <MicrositeEditModal
          micrositeInfo={micrositeInfo}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleEditMicrosite}
        />
      </div>
    </div>
  )
}

export default PartnerMicrosite