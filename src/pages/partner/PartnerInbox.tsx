import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import {
  fetchPartnerInboxData,
  markPartnerMessageAsRead,
  deletePartnerMessage,
  setSelectedMessage,
  PartnerMessage
} from '../../store/slices/partnerInboxSlice'
import {
  FiHome,
  FiChevronRight,
  FiAlertCircle,
  FiInbox
} from 'react-icons/fi'

import InboxHeader from '../../components/partner/inbox/InboxHeader'
import InboxStatsCard from '../../components/partner/inbox/InboxStatsCard'
import MessagesList from '../../components/partner/inbox/MessagesList'
import MessageViewModal from '../../components/partner/inbox/MessageViewModal'

const PartnerInbox: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)
  const {
    messages,
    stats,
    selectedMessage,
    error
  } = useSelector((state: RootState) => state.partnerInbox)
  
  const { isLoading: loading } = useSelector((state: RootState) => state.loading)

  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterSender, setFilterSender] = useState('')
  const [filterRead, setFilterRead] = useState('')
  const [showMessageModal, setShowMessageModal] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    if (user?.role !== 'partner') {
      navigate('/dashboard')
      return
    }

    dispatch(fetchPartnerInboxData())
  }, [dispatch, isAuthenticated, user, navigate])

  useEffect(() => {
    const filters = {
      message_type: filterType,
      sender_role: filterSender,
      is_read: filterRead,
      search: searchTerm
    }

    const debounceTimer = setTimeout(() => {
      dispatch(fetchPartnerInboxData(filters))
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [dispatch, searchTerm, filterType, filterSender, filterRead])

  const handleMessageClick = async (message: PartnerMessage) => {
    dispatch(setSelectedMessage(message))
    setShowMessageModal(true)
    
    if (!message.recipient?.is_read) {
      try {
        await dispatch(markPartnerMessageAsRead(message.id) as any)
      } catch (error) {
        console.error('Failed to mark message as read:', error)
      }
    }
  }

  const handleMarkAsRead = async (messageId: number) => {
    try {
      await dispatch(markPartnerMessageAsRead(messageId) as any)
    } catch (error) {
      console.error('Failed to mark message as read:', error)
    }
  }

  const handleDeleteMessage = async (messageId: number) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await dispatch(deletePartnerMessage(messageId) as any)
        setShowMessageModal(false)
      } catch (error) {
        console.error('Failed to delete message:', error)
      }
    }
  }

  const handleCloseModal = () => {
    setShowMessageModal(false)
    dispatch(setSelectedMessage(null))
  }

  if (!isAuthenticated || user?.role !== 'partner') {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <button
                  onClick={() => navigate('/')}
                  className="text-gray-500 hover:text-gray-700 font-medium transition-colors duration-200 flex items-center"
                >
                  <FiHome className="w-4 h-4 mr-1" />
                  Home
                </button>
              </li>
              <li>
                <div className="flex items-center">
                  <FiChevronRight className="flex-shrink-0 h-5 w-5 text-gray-400 mx-2" />
                  <button
                    onClick={() => navigate('/partner/dashboard')}
                    className="text-gray-500 hover:text-gray-700 font-medium transition-colors duration-200"
                  >
                    Dashboard
                  </button>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <FiChevronRight className="flex-shrink-0 h-5 w-5 text-gray-400 mx-2" />
                  <span className="text-sm font-bold text-blue-600 flex items-center" aria-current="page">
                    <FiInbox className="w-4 h-4 mr-1" />
                    Inbox
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <InboxHeader
          totalMessages={stats?.total_messages || 0}
          unreadMessages={stats?.unread_messages || 0}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterType={filterType}
          setFilterType={setFilterType}
          filterSender={filterSender}
          setFilterSender={setFilterSender}
          filterRead={filterRead}
          setFilterRead={setFilterRead}
        />

        <InboxStatsCard stats={stats} />

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 shadow-2xl rounded-3xl p-8">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-pink-700 rounded-2xl flex items-center justify-center mr-4">
                <FiAlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Inbox Error</h3>
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        <MessagesList
          messages={messages}
          onMessageClick={handleMessageClick}
          onMarkAsRead={handleMarkAsRead}
          onDelete={handleDeleteMessage}
          loading={loading}
        />
      </div>

      <MessageViewModal
        message={selectedMessage}
        isOpen={showMessageModal}
        onClose={handleCloseModal}
        onDelete={handleDeleteMessage}
      />
    </div>
  )
}

export default PartnerInbox