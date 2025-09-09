import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import {
  fetchStateMicrositeData,
  updateStateMicrositeInfo,
  createStateMicrositeNews,
  updateStateMicrositeNews,
  deleteStateMicrositeNews,
  StateMicrositeInfo,
  StateMicrositeNews
} from '../../store/slices/stateMicrositeSlice'

import MicrositeHeader from '../../components/state/microsite/MicrositeHeader'
import UpcomingEventsSection from '../../components/state/microsite/UpcomingEventsSection'
import ClubsDirectorySection from '../../components/state/microsite/ClubsDirectorySection'
import NewsSection from '../../components/state/microsite/NewsSection'
import EditMicrositeModal from '../../components/state/microsite/EditMicrositeModal'
import CreateNewsModal from '../../components/state/microsite/CreateNewsModal'

const StateMicrosite: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
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
      await dispatch(fetchStateMicrositeData(publicStateId) as any)
    } catch (error) {
      console.error('Error fetching state microsite data:', error)
    }
  }

  const handleUpdateMicrosite = async (micrositeData: Partial<StateMicrositeInfo>) => {
    try {
      await dispatch(updateStateMicrositeInfo(micrositeData) as any)
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
      await dispatch(createStateMicrositeNews(newsData) as any)
    } catch (error) {
      console.error('Error creating news:', error)
      throw error
    }
  }

  const handleUpdateNews = async (newsId: number, newsData: Partial<StateMicrositeNews>) => {
    try {
      await dispatch(updateStateMicrositeNews(newsId, newsData) as any)
      setEditNews(null)
    } catch (error) {
      console.error('Error updating news:', error)
      throw error
    }
  }

  const handleDeleteNews = async (newsId: number) => {
    try {
      await dispatch(deleteStateMicrositeNews(newsId) as any)
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error && !micrositeInfo) {
    return (
      <div className="min-h-screen  py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    )
  }

  if (!micrositeInfo) {
    return (
      <div className="min-h-screen  py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h3 className="mt-2 text-sm font-medium text-gray-900">Microsite not found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {isPublicView 
                ? 'This state microsite is not available or has been made private.'
                : 'Unable to load your microsite data.'
              }
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Check if microsite is public for public views
  if (isPublicView && !micrositeInfo.is_public) {
    return (
      <div className="min-h-screen  py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Private Microsite</h3>
            <p className="mt-1 text-sm text-gray-500">
              This state microsite is currently private and not available for public viewing.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen  py-8">
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
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="space-y-8 mt-8">
          {/* Custom Content Section */}
          {micrositeInfo.custom_content && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="prose prose-blue max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
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