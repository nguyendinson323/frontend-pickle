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
import {
  FiEdit,
  FiSliders,
  FiBarChart2,
  FiAlertTriangle,
  FiCheckCircle,
  FiInfo,
  FiHeart,
  FiExternalLink,
  FiZap,
  FiShare2,
  FiUsers,
  FiAward,
  FiMap,
  FiTarget
} from 'react-icons/fi'

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


  const handleSaveCustomization = async (customizationData: {
    primary_color?: string
    secondary_color?: string
    description?: string
    banner_url?: string
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-300 border-t-blue-600 mx-auto mb-6"></div>
          <p className="text-gray-600 font-medium text-lg">Loading your microsite...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MicrositeHeader
          stats={stats}
          onPreviewSite={handlePreviewSite}
          onPublishSite={handlePublishSite}
          clubName={micrositeData?.name || 'Your Club'}
        />

        {error && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6 mb-8 shadow-lg">
            <div className="flex items-center">
              <FiAlertTriangle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-red-800 mb-1">Error</h3>
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {publishResult && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 mb-8 shadow-lg">
            <div className="flex items-start">
              <FiCheckCircle className="flex-shrink-0 h-6 w-6 text-green-500 mr-4 mt-1" />
              <div className="flex-grow">
                <h3 className="text-lg font-bold text-green-800 mb-2">
                  Microsite Published Successfully!
                </h3>
                <div className="space-y-2 text-sm text-green-700">
                  <p className="font-medium">{publishResult.message}</p>
                  {publishResult.microsite_url && (
                    <div className="bg-white border border-green-200 rounded-xl p-3 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-green-800">Your microsite URL:</span>
                        <p className="text-green-600 font-medium break-all">{publishResult.microsite_url}</p>
                      </div>
                      <a
                        href={publishResult.microsite_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-3 flex items-center text-green-600 hover:text-green-700 transition-colors"
                      >
                        <FiExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  )}
                  {publishResult.published_at && (
                    <p className="text-xs text-green-600 font-medium">
                      Published on {new Date(publishResult.published_at).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white shadow-2xl rounded-3xl border border-gray-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-100 p-6 border-b-2 border-blue-200">
            <nav className="flex space-x-8">
              {[
                { id: 'editor', name: 'Basic Info', icon: FiEdit, color: 'text-blue-600' },
                { id: 'customization', name: 'Customization', icon: FiSliders, color: 'text-purple-600' },
                { id: 'analytics', name: 'Analytics', icon: FiBarChart2, color: 'text-green-600' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-6 border-b-4 font-bold text-sm capitalize rounded-t-2xl transition-all duration-200 flex items-center ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600 bg-white shadow-lg transform -translate-y-1'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-white hover:bg-opacity-50'
                  }`}
                >
                  <tab.icon className={`w-5 h-5 mr-2 ${activeTab === tab.id ? tab.color : ''}`} />
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
                loading={loading}
              />
            )}

            {activeTab === 'customization' && (
              <MicrositeCustomization
                customization={customization}
                onSaveCustomization={handleSaveCustomization}
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
          <div className="space-y-8">
            {/* Contextual Tips */}
            <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-3xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                {activeTab === 'editor' && (
                  <>
                    <FiInfo className="h-6 w-6 mr-3 text-blue-600" />
                    Profile Tips
                  </>
                )}
                {activeTab === 'customization' && (
                  <>
                    <FiSliders className="h-6 w-6 mr-3 text-purple-600" />
                    Design Tips
                  </>
                )}
                {activeTab === 'analytics' && (
                  <>
                    <FiBarChart2 className="h-6 w-6 mr-3 text-green-600" />
                    Performance Tips
                  </>
                )}
              </h3>

              {activeTab === 'editor' && (
                <div className="space-y-6">
                  <div className="bg-white border border-blue-200 rounded-2xl p-4 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start">
                      <FiInfo className="flex-shrink-0 h-5 w-5 text-blue-500 mt-1 mr-3" />
                      <div>
                        <p className="text-sm font-bold text-gray-900 mb-1">Complete All Fields</p>
                        <p className="text-sm text-gray-600">Fill out all fields to improve visibility and attract more members.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-green-200 rounded-2xl p-4 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start">
                      <FiHeart className="flex-shrink-0 h-5 w-5 text-green-500 mt-1 mr-3" />
                      <div>
                        <p className="text-sm font-bold text-gray-900 mb-1">Upload a Logo</p>
                        <p className="text-sm text-gray-600">A professional logo helps build trust and brand recognition.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-purple-200 rounded-2xl p-4 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start">
                      <FiExternalLink className="flex-shrink-0 h-5 w-5 text-purple-500 mt-1 mr-3" />
                      <div>
                        <p className="text-sm font-bold text-gray-900 mb-1">Add Online Links</p>
                        <p className="text-sm text-gray-600">Include your website and social media for better online presence.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'customization' && (
                <div className="space-y-6">
                  <div className="bg-white border border-blue-200 rounded-2xl p-4 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start">
                      <FiSliders className="flex-shrink-0 h-5 w-5 text-blue-500 mt-1 mr-3" />
                      <div>
                        <p className="text-sm font-bold text-gray-900 mb-1">Choose Brand Colors</p>
                        <p className="text-sm text-gray-600">Select colors that reflect your club's personality and branding.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-green-200 rounded-2xl p-4 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start">
                      <FiMap className="flex-shrink-0 h-5 w-5 text-green-500 mt-1 mr-3" />
                      <div>
                        <p className="text-sm font-bold text-gray-900 mb-1">Add Banner Image</p>
                        <p className="text-sm text-gray-600">A high-quality banner creates a professional first impression.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-purple-200 rounded-2xl p-4 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start">
                      <FiEdit className="flex-shrink-0 h-5 w-5 text-purple-500 mt-1 mr-3" />
                      <div>
                        <p className="text-sm font-bold text-gray-900 mb-1">Write Description</p>
                        <p className="text-sm text-gray-600">Tell visitors what makes your club special and unique.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <div className="bg-white border border-blue-200 rounded-2xl p-4 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start">
                      <FiBarChart2 className="flex-shrink-0 h-5 w-5 text-blue-500 mt-1 mr-3" />
                      <div>
                        <p className="text-sm font-bold text-gray-900 mb-1">Track Engagement</p>
                        <p className="text-sm text-gray-600">Monitor visitor behavior to optimize your content strategy.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-green-200 rounded-2xl p-4 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start">
                      <FiZap className="flex-shrink-0 h-5 w-5 text-green-500 mt-1 mr-3" />
                      <div>
                        <p className="text-sm font-bold text-gray-900 mb-1">Improve Scores</p>
                        <p className="text-sm text-gray-600">Higher content and SEO scores lead to better visibility.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-purple-200 rounded-2xl p-4 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start">
                      <FiShare2 className="flex-shrink-0 h-5 w-5 text-purple-500 mt-1 mr-3" />
                      <div>
                        <p className="text-sm font-bold text-gray-900 mb-1">Share Your URL</p>
                        <p className="text-sm text-gray-600">Promote your microsite to drive more traffic and engagement.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {micrositeData && (
              <div className="bg-gradient-to-br from-white to-indigo-50 border border-indigo-200 rounded-3xl shadow-xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <FiTarget className="h-6 w-6 mr-3 text-indigo-600" />
                  Quick Stats
                </h3>
                <div className="space-y-4">
                  <div className="bg-white border border-blue-200 rounded-2xl p-4 flex justify-between items-center hover:shadow-md transition-all duration-200">
                    <div className="flex items-center">
                      <FiCheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                    </div>
                    <span className="text-sm font-bold text-blue-600">{stats?.profile_completion || 0}%</span>
                  </div>
                  <div className="bg-white border border-green-200 rounded-2xl p-4 flex justify-between items-center hover:shadow-md transition-all duration-200">
                    <div className="flex items-center">
                      <FiMap className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Courts</span>
                    </div>
                    <span className="text-sm font-bold text-green-600">{micrositeData.courts_count}</span>
                  </div>
                  <div className="bg-white border border-purple-200 rounded-2xl p-4 flex justify-between items-center hover:shadow-md transition-all duration-200">
                    <div className="flex items-center">
                      <FiUsers className="h-4 w-4 text-purple-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Members</span>
                    </div>
                    <span className="text-sm font-bold text-purple-600">{micrositeData.members_count}</span>
                  </div>
                  <div className="bg-white border border-yellow-200 rounded-2xl p-4 flex justify-between items-center hover:shadow-md transition-all duration-200">
                    <div className="flex items-center">
                      <FiAward className="h-4 w-4 text-yellow-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Tournaments</span>
                    </div>
                    <span className="text-sm font-bold text-yellow-600">{micrositeData.tournaments_count}</span>
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