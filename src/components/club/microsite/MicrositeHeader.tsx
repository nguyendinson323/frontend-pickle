import React from 'react'
import { MicrositeStats } from '../../../store/slices/clubMicrositeSlice'
import {
  FiEye,
  FiUpload,
  FiCheckCircle,
  FiGlobe,
  FiUsers,
  FiTrendingUp,
  FiRefreshCw,
  FiAlertTriangle,
  FiStar
} from 'react-icons/fi'

interface MicrositeHeaderProps {
  stats: MicrositeStats | null
  onPreviewSite: () => void
  onPublishSite: () => void
  clubName: string
}

const MicrositeHeader: React.FC<MicrositeHeaderProps> = ({ 
  stats, 
  onPreviewSite, 
  onPublishSite, 
  clubName 
}) => {
  return (
    <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-200 rounded-3xl shadow-2xl p-8 mb-8 overflow-hidden">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center">
            <FiGlobe className="h-8 w-8 mr-4 text-blue-600" />
            Club Microsite
          </h1>
          <p className="text-gray-600 text-lg font-medium">Manage your public club presence and engagement</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={onPreviewSite}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-6 py-3 rounded-2xl flex items-center font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105"
          >
            <FiEye className="w-5 h-5 mr-2" />
            Preview Site
          </button>
          <button
            onClick={onPublishSite}
            className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white px-6 py-3 rounded-2xl flex items-center font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105"
          >
            <FiUpload className="w-5 h-5 mr-2" />
            Publish Site
          </button>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <FiCheckCircle className="h-6 w-6 text-blue-600" />
              <div className="text-2xl font-bold text-blue-600">{stats.profile_completion}%</div>
            </div>
            <div className="text-sm font-bold text-gray-800 mb-2">Profile Complete</div>
            <div className="bg-white rounded-full h-3 shadow-inner">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${stats.profile_completion}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <FiGlobe className="h-6 w-6 text-green-600" />
              <div className="text-2xl font-bold text-green-600">
                {stats.public_visibility ? 'Live' : 'Draft'}
              </div>
            </div>
            <div className="text-sm font-bold text-gray-800 mb-2">Site Status</div>
            <div className="mt-2">
              <span className={`inline-flex px-3 py-2 text-xs font-bold rounded-2xl shadow-sm ${
                stats.public_visibility
                  ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200'
                  : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300'
              }`}>
                {stats.public_visibility ? 'Published' : 'Unpublished'}
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-violet-100 border border-purple-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <FiUsers className="h-6 w-6 text-purple-600" />
              <div className="text-2xl font-bold text-purple-600">{stats.recent_visitors}</div>
            </div>
            <div className="text-sm font-bold text-gray-800">Recent Visitors</div>
            <div className="text-xs text-gray-500 font-medium mt-1">Last 30 days</div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-100 border border-orange-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <FiTrendingUp className="h-6 w-6 text-orange-600" />
              <div className="text-2xl font-bold text-orange-600">{stats.social_engagement}%</div>
            </div>
            <div className="text-sm font-bold text-gray-800">Social Engagement</div>
            <div className="text-xs text-gray-500 font-medium mt-1">Interaction rate</div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-blue-100 border border-indigo-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <FiRefreshCw className="h-6 w-6 text-indigo-600" />
              <div className="text-2xl font-bold text-indigo-600">{stats.content_freshness}%</div>
            </div>
            <div className="text-sm font-bold text-gray-800">Content Freshness</div>
            <div className="text-xs text-gray-500 font-medium mt-1">Update score</div>
          </div>
        </div>
      )}

      {stats && stats.profile_completion < 80 && (
        <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl shadow-lg">
          <div className="flex items-start">
            <FiAlertTriangle className="flex-shrink-0 h-6 w-6 text-yellow-600 mr-4 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-yellow-800 mb-2 flex items-center">
                <FiStar className="h-5 w-5 mr-2" />
                Complete Your Profile
              </h3>
              <div className="text-sm text-yellow-700 font-medium">
                <p>
                  Complete your profile to improve visibility and attract more members.
                  Add missing information like club description, contact details, and photos.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MicrositeHeader