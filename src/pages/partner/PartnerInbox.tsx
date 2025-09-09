import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import {
  fetchPartnerInboxData,
  markPartnerMessageAsRead,
  deletePartnerMessage,
  setSelectedMessage,
  PartnerMessage
} from '../../store/slices/partnerInboxSlice'

import InboxHeader from '../../components/partner/inbox/InboxHeader'
import InboxStatsCard from '../../components/partner/inbox/InboxStatsCard'
import MessagesList from '../../components/partner/inbox/MessagesList'
import MessageViewModal from '../../components/partner/inbox/MessageViewModal'

const PartnerInbox: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)
  const {
    messages,
    stats,
    selectedMessage,
    loading,
    error
  } = useSelector((state: RootState) => state.partnerInbox)

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

    dispatch(fetchPartnerInboxData() as any)
  }, [dispatch, isAuthenticated, user, navigate])

  useEffect(() => {
    const filters = {
      message_type: filterType,
      sender_role: filterSender,
      is_read: filterRead,
      search: searchTerm
    }

    const debounceTimer = setTimeout(() => {
      dispatch(fetchPartnerInboxData(filters) as any)
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
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