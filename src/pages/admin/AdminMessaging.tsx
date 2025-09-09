import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../../store'
import { 
  fetchTemplates,
  fetchSentMessages
} from '../../store/slices/adminMessagingSlice'
import {
  MessageTemplates,
  BroadcastComposer,
  SentMessages,
  MessageStats,
  MessageFilters
} from '../../components/admin/messaging'

const AdminMessaging: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.auth)
  const { messageFilter, error } = useSelector((state: RootState) => state.adminMessaging)
  
  const [activeTab, setActiveTab] = useState<'compose' | 'templates' | 'sent'>('compose')

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login')
      return
    }

    // Fetch initial data
    dispatch(fetchTemplates() as any)
    dispatch(fetchSentMessages(messageFilter) as any)
  }, [dispatch, user, navigate])

  useEffect(() => {
    // Refresh sent messages when filters change
    if (activeTab === 'sent') {
      dispatch(fetchSentMessages(messageFilter) as any)
    }
  }, [dispatch, messageFilter, activeTab])

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  const tabs = [
    { id: 'compose', label: 'Compose Message', icon: '✏️' },
    { id: 'templates', label: 'Templates', icon: '📝' },
    { id: 'sent', label: 'Sent Messages', icon: '📤' }
  ]

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Messaging Center</h1>
              <p className="mt-2 text-gray-600">
                Send broadcast messages and manage communication templates
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

        {/* Message Statistics */}
        <MessageStats />

        {/* Navigation Tabs */}
        <div className="bg-white shadow-sm rounded-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'compose' | 'templates' | 'sent')}
                  className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'compose' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <BroadcastComposer />
              </div>
              <div>
                <MessageTemplates />
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <MessageTemplates />
          )}

          {activeTab === 'sent' && (
            <>
              <MessageFilters />
              <SentMessages />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminMessaging