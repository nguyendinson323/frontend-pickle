import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import {
  fetchStateMicrositeData,
  updateStateMicrositeInfo,
  createStateMicrositeNews,
  updateStateMicrositeNews,
  deleteStateMicrositeNews,
  StateMicrositeInfo,
  StateMicrositeNews
} from '../../store/slices/stateMicrositeSlice'
import { FiGlobe, FiLock, FiAlertCircle, FiRefreshCw, FiEdit } from 'react-icons/fi'

import MicrositeHeader from '../../components/state/microsite/MicrositeHeader'
import UpcomingEventsSection from '../../components/state/microsite/UpcomingEventsSection'
import ClubsDirectorySection from '../../components/state/microsite/ClubsDirectorySection'
import NewsSection from '../../components/state/microsite/NewsSection'
import EditMicrositeModal from '../../components/state/microsite/EditMicrositeModal'
import CreateNewsModal from '../../components/state/microsite/CreateNewsModal'

const StateMicrosite: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { stateId } = useParams<{ stateId?: string }>()
  
  const { micrositeInfo, stats, upcomingEvents, clubs, news, loading, error } = useSelector((state: RootState) => state.stateMicrosite)
  const { user } = useSelector((state: RootState) => state.auth)

  const [showEditModal, setShowEditModal] = useState(false)
  const [showNewsModal, setShowNewsModal] = useState(false)
  const [editNews, setEditNews] = useState<StateMicrositeNews | null>(null)

  // Determine if this is public view (with stateId) or owner view (authenticated state user)
  const isPublicView = !!stateId
  const isOwner = !isPublicView && !!user && user.role === 'state'

  useEffect(() => {
    if (isPublicView) {
      // Public view - fetch by state ID
      fetchData(stateId)
    } else if (user) {
      if (user.role === 'state') {
        // Authenticated state user - fetch their own data
        fetchData()
      } else {
        // Non-state user trying to access without state ID
        navigate('/dashboard')
      }
    }
  }, [user, stateId, navigate])

  const fetchData = async (publicStateId?: string) => {
    try {
      await dispatch(fetchStateMicrositeData(publicStateId))
    } catch (error) {
      console.error('Error fetching state microsite data:', error)
    }
  }

  const handleUpdateMicrosite = async (micrositeData: Partial<StateMicrositeInfo>) => {
    try {
      await dispatch(updateStateMicrositeInfo(micrositeData))
    } catch (error) {
      console.error('Error updating microsite:', error)
      throw error
    }
  }

  const handleCreateNews = async (newsData: {
    title: string
    content: string
    is_featured?: boolean
    image_url?: string
  }) => {
    try {
      await dispatch(createStateMicrositeNews(newsData))
    } catch (error) {
      console.error('Error creating news:', error)
      throw error
    }
  }

  const handleUpdateNews = async (newsId: number, newsData: Partial<StateMicrositeNews>) => {
    try {
      await dispatch(updateStateMicrositeNews(newsId, newsData))
      setEditNews(null)
    } catch (error) {
      console.error('Error updating news:', error)
      throw error
    }
  }

  const handleDeleteNews = async (newsId: number) => {
    try {
      await dispatch(deleteStateMicrositeNews(newsId))
    } catch (error) {
      console.error('Error deleting news:', error)
    }
  }

  const handleEditNews = (news: StateMicrositeNews) => {
    setEditNews(news)
    setShowNewsModal(true)
  }

  const handleCloseNewsModal = () => {
    setShowNewsModal(false)
    setEditNews(null)
  }

  if (loading && !micrositeInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 shadow-lg"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-400/20 to-purple-400/20 animate-pulse"></div>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900 mb-1">Loading State Microsite</p>
            <p className="text-sm text-gray-600">Please wait while we fetch the microsite data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error && !micrositeInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50/30 via-white to-orange-50/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-3xl shadow-xl p-8 backdrop-blur-sm">
            <div className="flex items-center space-x-4">
              <div className="bg-red-500 p-3 rounded-2xl shadow-lg">
                <FiAlertCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-800 mb-2">Error Loading Microsite</h3>
                <p className="text-red-700">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl font-semibold transition-colors duration-200 flex items-center space-x-2"
                >
                  <FiRefreshCw className="w-4 h-4" />
                  <span>Reload Page</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!micrositeInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50/30 via-white to-blue-50/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-8 rounded-full mx-auto w-24 h-24 flex items-center justify-center shadow-lg mb-6">
              <FiGlobe className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Microsite not found</h3>
            <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
              {isPublicView
                ? 'This state microsite is not available or has been made private.'
                : 'Unable to load your microsite data.'
              }
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Check if microsite is public for public views
  if (isPublicView && !micrositeInfo.is_public) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50/30 via-white to-indigo-50/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-gray-100 to-indigo-200 p-8 rounded-full mx-auto w-24 h-24 flex items-center justify-center shadow-lg mb-6">
              <FiLock className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Private Microsite</h3>
            <p className="text-gray-600 max-w-md mx-auto leading-relaxed mb-8">
              This state microsite is currently private and not available for public viewing.
            </p>
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6 max-w-sm mx-auto">
              <div className="flex items-center space-x-3 mb-3">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <FiLock className="w-5 h-5 text-indigo-600" />
                </div>
                <p className="font-semibold text-indigo-900">Access Restricted</p>
              </div>
              <p className="text-sm text-indigo-700">
                Only authorized users can view this content.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <MicrositeHeader
          micrositeInfo={micrositeInfo}
          stats={stats}
          isOwner={isOwner}
          onEdit={() => setShowEditModal(true)}
        />

        {/* Error Display */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-4 mb-6 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="bg-red-500 p-2 rounded-full">
                <FiAlertCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-red-800">Error</p>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-8 mt-8">
          {/* Custom Content Section */}
          {micrositeInfo.custom_content && (
            <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-3xl shadow-xl border border-gray-200/50 p-8 backdrop-blur-sm">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-blue-500 p-3 rounded-2xl shadow-lg">
                  <FiEdit className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Additional Information</h2>
              </div>
              <div className="prose prose-blue max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed bg-white/60 rounded-2xl p-6 backdrop-blur-sm">
                  {micrositeInfo.custom_content}
                </div>
              </div>
            </div>
          )}

          {/* Upcoming Events Section */}
          <UpcomingEventsSection events={upcomingEvents} />

          {/* Clubs Directory Section */}
          <ClubsDirectorySection clubs={clubs} />

          {/* News Section */}
          <NewsSection
            news={news}
            isOwner={isOwner}
            onCreateNews={() => {
              setEditNews(null)
              setShowNewsModal(true)
            }}
            onEditNews={handleEditNews}
            onDeleteNews={handleDeleteNews}
          />
        </div>

        {/* Modals - Only show for owners */}
        {isOwner && (
          <>
            <EditMicrositeModal
              isOpen={showEditModal}
              onClose={() => setShowEditModal(false)}
              onUpdate={handleUpdateMicrosite}
              micrositeInfo={micrositeInfo}
              loading={loading}
            />

            <CreateNewsModal
              isOpen={showNewsModal}
              onClose={handleCloseNewsModal}
              onCreate={handleCreateNews}
              onUpdate={handleUpdateNews}
              editNews={editNews}
              loading={loading}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default StateMicrosite