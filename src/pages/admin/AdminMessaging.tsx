import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState, AppDispatch } from '../../store'
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
import {
  FiEdit3,
  FiFileText,
  FiSend,
  FiArrowLeft,
  FiAlertCircle,
  FiLoader,
  FiMessageSquare
} from 'react-icons/fi'

const AdminMessaging: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
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
    dispatch(fetchTemplates())
    dispatch(fetchSentMessages(messageFilter))
  }, [dispatch, user, navigate])

  useEffect(() => {
    // Refresh sent messages when filters change
    if (activeTab === 'sent') {
      dispatch(fetchSentMessages(messageFilter))
    }
  }, [dispatch, messageFilter, activeTab])

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <FiLoader className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading messaging center...</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'compose', label: 'Compose Message', icon: FiEdit3 },
    { id: 'templates', label: 'Templates', icon: FiFileText },
    { id: 'sent', label: 'Sent Messages', icon: FiSend }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg mr-6">
                <FiMessageSquare className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Messaging Center</h1>
                <p className="mt-2 text-lg text-gray-600">
                  Send broadcast messages and manage communication templates
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 rounded-xl shadow-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <FiArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <FiAlertCircle className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-bold text-red-800">Error Occurred</h3>
                <div className="mt-2 text-red-700 font-medium">
                  {error}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Message Statistics */}
        <MessageStats />

        {/* Navigation Tabs */}
        <div className="bg-white shadow-lg rounded-2xl mb-8 border border-gray-200">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-2xl p-2">
            <nav className="flex space-x-2" aria-label="Tabs">
              {tabs.map((tab) => {
                const IconComponent = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'compose' | 'templates' | 'sent')}
                    className={`flex items-center px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 transform hover:scale-105 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-white hover:shadow-md'
                    }`}
                  >
                    <IconComponent className="mr-2 h-4 w-4" />
                    {tab.label}
                  </button>
                )
              })}
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