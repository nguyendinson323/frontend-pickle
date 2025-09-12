import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import {
  fetchClubMicrositeData,
  updateClubMicrositeData,
  uploadClubLogo,
  uploadBannerImage,
  updateMicrositeCustomization,
  fetchMicrositeAnalytics,
  publishMicrosite,
  setPreviewMode
} from '../../store/slices/clubMicrositeSlice'

import MicrositeHeader from '../../components/club/microsite/MicrositeHeader'
import MicrositeEditor from '../../components/club/microsite/MicrositeEditor'
import MicrositePreview from '../../components/club/microsite/MicrositePreview'
import MicrositeCustomization from '../../components/club/microsite/MicrositeCustomization'
import MicrositeAnalytics from '../../components/club/microsite/MicrositeAnalytics'

const ClubMicrosite: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  
  const { micrositeData, stats, customization, analytics, loading, error, previewMode } = useSelector((state: RootState) => state.clubMicrosite)
  const { user } = useSelector((state: RootState) => state.auth)

  const [activeTab, setActiveTab] = useState<'editor' | 'customization' | 'analytics'>('editor')
  const [publishResult, setPublishResult] = useState<{
    microsite_url?: string
    message?: string
    published_at?: string
  } | null>(null)

  useEffect(() => {
    if (user && user.role === 'club') {
      fetchData()
    } else {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const fetchData = async () => {
    try {
      await dispatch(fetchClubMicrositeData())
    } catch (error) {
      console.error('Error fetching microsite data:', error)
    }
  }

  const handleSaveMicrositeData = async (data: {
    name?: string
    manager_name?: string
    manager_title?: string
    club_type?: string
    website?: string
    social_media?: string
    logo_url?: string
  }) => {
    try {
      await dispatch(updateClubMicrositeData(data))
    } catch (error) {
      console.error('Error saving microsite data:', error)
      throw error
    }
  }

  const handleUploadLogo = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('logo', file)
      await dispatch(uploadClubLogo(formData))
    } catch (error) {
      console.error('Error uploading logo:', error)
      throw error
    }
  }

  const handleUploadBanner = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('banner', file)
      await dispatch(uploadBannerImage(formData))
    } catch (error) {
      console.error('Error uploading banner:', error)
      throw error
    }
  }

  const handleSaveCustomization = async (customizationData: {
    primary_color?: string
    secondary_color?: string
    description?: string
  }) => {
    try {
      await dispatch(updateMicrositeCustomization(customizationData))
    } catch (error) {
      console.error('Error saving customization:', error)
      throw error
    }
  }

  const handleRefreshAnalytics = async () => {
    try {
      await dispatch(fetchMicrositeAnalytics())
    } catch (error) {
      console.error('Error fetching analytics:', error)
    }
  }

  const handlePreviewSite = () => {
    dispatch(setPreviewMode(true))
  }

  const handleClosePreview = () => {
    dispatch(setPreviewMode(false))
  }

  const handlePublishSite = async () => {
    if (!micrositeData) {
      alert('Please complete your club profile before publishing.')
      return
    }

    // Check if required fields are completed
    const requiredFields = ['name', 'manager_name', 'club_type']
    const missingFields = requiredFields.filter(field => 
      !micrositeData[field as keyof typeof micrositeData] || 
      (micrositeData[field as keyof typeof micrositeData] as string)?.trim() === ''
    )

    if (missingFields.length > 0) {
      alert(`Please complete the following fields before publishing: ${missingFields.join(', ')}`)
      return
    }

    if (window.confirm('Are you ready to publish your microsite? It will become publicly visible.')) {
      try {
        const result = await dispatch(publishMicrosite())
        setPublishResult(result)
        
        // Show success message and optionally redirect
        setTimeout(() => {
          setPublishResult(null)
        }, 10000) // Hide after 10 seconds
      } catch (error) {
        console.error('Error publishing microsite:', error)
      }
    }
  }

  if (loading && !micrositeData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MicrositeHeader
          stats={stats}
          onPreviewSite={handlePreviewSite}
          onPublishSite={handlePublishSite}
          clubName={micrositeData?.name || 'Your Club'}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {publishResult && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <svg className="flex-shrink-0 h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Microsite Published Successfully!
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>{publishResult.message}</p>
                  {publishResult.microsite_url && (
                    <p className="mt-1">
                      <strong>Your microsite URL:</strong>{' '}
                      <a
                        href={publishResult.microsite_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-green-600"
                      >
                        {publishResult.microsite_url}
                      </a>
                    </p>
                  )}
                  {publishResult.published_at && (
                    <p className="text-xs text-green-600 mt-1">
                      Published on {new Date(publishResult.published_at).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'editor', name: 'Basic Info', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
                { id: 'customization', name: 'Customization', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4m-6-6a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2zm6-10V3a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h4a2 2 0 002-2z' },
                { id: 'analytics', name: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
                  } whitespace-nowrap flex items-center py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                  </svg>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Section */}
          <div className="lg:col-span-2">
            {activeTab === 'editor' && (
              <MicrositeEditor
                micrositeData={micrositeData}
                onSave={handleSaveMicrositeData}
                onUploadLogo={handleUploadLogo}
                loading={loading}
              />
            )}

            {activeTab === 'customization' && (
              <MicrositeCustomization
                customization={customization}
                onSaveCustomization={handleSaveCustomization}
                onUploadBanner={handleUploadBanner}
                loading={loading}
              />
            )}

            {activeTab === 'analytics' && (
              <MicrositeAnalytics
                analytics={analytics}
                onRefreshAnalytics={handleRefreshAnalytics}
                loading={loading}
              />
            )}
          </div>

          {/* Dynamic Sidebar */}
          <div className="space-y-6">
            {/* Contextual Tips */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {activeTab === 'editor' && 'Profile Tips'}
                {activeTab === 'customization' && 'Design Tips'}
                {activeTab === 'analytics' && 'Performance Tips'}
              </h3>
              
              {activeTab === 'editor' && (
                <div className="space-y-4">
                  <div className="flex items-start">
                    <svg className="flex-shrink-0 h-5 w-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Complete All Fields</p>
                      <p className="text-sm text-gray-600">Fill out all fields to improve visibility and attract more members.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <svg className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Upload a Logo</p>
                      <p className="text-sm text-gray-600">A professional logo helps build trust and brand recognition.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <svg className="flex-shrink-0 h-5 w-5 text-purple-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Add Online Links</p>
                      <p className="text-sm text-gray-600">Include your website and social media for better online presence.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'customization' && (
                <div className="space-y-4">
                  <div className="flex items-start">
                    <svg className="flex-shrink-0 h-5 w-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4m-6-6a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2zm6-10V3a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h4a2 2 0 002-2z" />
                    </svg>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Choose Brand Colors</p>
                      <p className="text-sm text-gray-600">Select colors that reflect your club's personality and branding.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <svg className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Add Banner Image</p>
                      <p className="text-sm text-gray-600">A high-quality banner creates a professional first impression.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <svg className="flex-shrink-0 h-5 w-5 text-purple-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Write Description</p>
                      <p className="text-sm text-gray-600">Tell visitors what makes your club special and unique.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="space-y-4">
                  <div className="flex items-start">
                    <svg className="flex-shrink-0 h-5 w-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Track Engagement</p>
                      <p className="text-sm text-gray-600">Monitor visitor behavior to optimize your content strategy.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <svg className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Improve Scores</p>
                      <p className="text-sm text-gray-600">Higher content and SEO scores lead to better visibility.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <svg className="flex-shrink-0 h-5 w-5 text-purple-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Share Your URL</p>
                      <p className="text-sm text-gray-600">Promote your microsite to drive more traffic and engagement.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {micrositeData && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Profile Completion</span>
                    <span className="text-sm font-medium">{stats?.profile_completion || 0}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Courts</span>
                    <span className="text-sm font-medium">{micrositeData.courts_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Members</span>
                    <span className="text-sm font-medium">{micrositeData.members_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Tournaments</span>
                    <span className="text-sm font-medium">{micrositeData.tournaments_count}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <MicrositePreview
          micrositeData={micrositeData}
          isPreviewMode={previewMode}
          onClosePreview={handleClosePreview}
        />
      </div>
    </div>
  )
}

export default ClubMicrosite