import React from 'react'
import { MicrositeStats } from '../../../store/slices/clubMicrositeSlice'

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
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Club Microsite</h1>
          <p className="text-gray-600 mt-1">Manage your public club presence</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onPreviewSite}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Preview Site
          </button>
          <button
            onClick={onPublishSite}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Publish Site
          </button>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.profile_completion}%</div>
            <div className="text-sm text-gray-600">Profile Complete</div>
            <div className="mt-2">
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${stats.profile_completion}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {stats.public_visibility ? 'Live' : 'Draft'}
            </div>
            <div className="text-sm text-gray-600">Site Status</div>
            <div className="mt-2">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                stats.public_visibility 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {stats.public_visibility ? 'Published' : 'Unpublished'}
              </span>
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{stats.recent_visitors}</div>
            <div className="text-sm text-gray-600">Recent Visitors</div>
            <div className="text-xs text-gray-500 mt-1">Last 30 days</div>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{stats.social_engagement}%</div>
            <div className="text-sm text-gray-600">Social Engagement</div>
            <div className="text-xs text-gray-500 mt-1">Interaction rate</div>
          </div>
          
          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-indigo-600">{stats.content_freshness}%</div>
            <div className="text-sm text-gray-600">Content Freshness</div>
            <div className="text-xs text-gray-500 mt-1">Update score</div>
          </div>
        </div>
      )}

      {stats && stats.profile_completion < 80 && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex">
            <svg className="flex-shrink-0 h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Complete Your Profile
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
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