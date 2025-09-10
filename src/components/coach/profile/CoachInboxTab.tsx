import React, { useState, useEffect } from 'react'
import { User } from '../../../types/auth'
import api from '../../../services/api'

interface Message {
  id: number
  sender_id: number
  subject: string
  content: string
  message_type: string
  sent_at: string
  has_attachments: boolean
  is_read: boolean
  read_at: string | null
  sender_name?: string
}

interface CoachInboxTabProps {
  user: User
}

const CoachInboxTab: React.FC<CoachInboxTabProps> = ({ user }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([])
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMessages()
  }, [])

  useEffect(() => {
    applyFilter()
  }, [messages, activeFilter])

  const fetchMessages = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/api/messages')
      setMessages(response.data.messages || [])
      setError(null)
    } catch (err: any) {
      console.error('Failed to fetch messages:', err)
      setError('Failed to load messages')
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilter = () => {
    let filtered = messages
    
    switch (activeFilter) {
      case 'unread':
        filtered = messages.filter(m => !m.is_read)
        break
      case 'announcements':
        filtered = messages.filter(m => m.message_type.toLowerCase().includes('announcement'))
        break
      case 'system':
        filtered = messages.filter(m => m.message_type.toLowerCase().includes('system'))
        break
      default:
        filtered = messages
    }
    
    setFilteredMessages(filtered)
  }

  const markAsRead = async (messageId: number) => {
    try {
      await api.put(`/api/messages/${messageId}/read`)
      setMessages(prev => prev.map(m => 
        m.id === messageId ? { ...m, is_read: true, read_at: new Date().toISOString() } : m
      ))
    } catch (err) {
      console.error('Failed to mark message as read:', err)
    }
  }

  const markAllAsRead = async () => {
    try {
      await api.put('/api/messages/mark-all-read')
      setMessages(prev => prev.map(m => ({ ...m, is_read: true, read_at: new Date().toISOString() })))
    } catch (err) {
      console.error('Failed to mark all messages as read:', err)
    }
  }

  const getMessageIcon = (messageType: string) => {
    const type = messageType.toLowerCase()
    if (type.includes('announcement')) return '📢'
    if (type.includes('payment')) return '💰'
    if (type.includes('student')) return '👥'
    if (type.includes('system')) return '⚙️'
    if (type.includes('warning') || type.includes('reminder')) return '⚠️'
    return '📮'
  }

  const getMessageColor = (messageType: string) => {
    const type = messageType.toLowerCase()
    if (type.includes('announcement')) return 'bg-blue-100'
    if (type.includes('payment')) return 'bg-green-100'
    if (type.includes('student')) return 'bg-purple-100'
    if (type.includes('system')) return 'bg-gray-100'
    if (type.includes('warning') || type.includes('reminder')) return 'bg-yellow-100'
    return 'bg-gray-100'
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} days ago`
    
    return date.toLocaleDateString()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Inbox & Notifications</h3>
        <button 
          onClick={markAllAsRead}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Mark All as Read
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button 
            onClick={() => setActiveFilter('all')}
            className={`py-2 px-1 font-medium text-sm border-b-2 ${
              activeFilter === 'all'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            All Messages ({messages.length})
          </button>
          <button 
            onClick={() => setActiveFilter('unread')}
            className={`py-2 px-1 font-medium text-sm border-b-2 ${
              activeFilter === 'unread'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Unread ({messages.filter(m => !m.is_read).length})
          </button>
          <button 
            onClick={() => setActiveFilter('announcements')}
            className={`py-2 px-1 font-medium text-sm border-b-2 ${
              activeFilter === 'announcements'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Announcements
          </button>
          <button 
            onClick={() => setActiveFilter('system')}
            className={`py-2 px-1 font-medium text-sm border-b-2 ${
              activeFilter === 'system'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            System
          </button>
        </nav>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600 text-sm">{error}</p>
            <button 
              onClick={fetchMessages}
              className="mt-2 text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        {filteredMessages.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📮</span>
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Messages</h4>
            <p className="text-gray-600">
              {activeFilter === 'all' 
                ? 'You have no messages yet.'
                : `No ${activeFilter} messages found.`
              }
            </p>
          </div>
        )}

        {filteredMessages.map((message) => (
          <div 
            key={message.id} 
            className={`bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${
              !message.is_read ? 'ring-2 ring-blue-100' : ''
            }`}
            onClick={() => !message.is_read && markAsRead(message.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 ${getMessageColor(message.message_type)} rounded-full flex items-center justify-center`}>
                  <span>{getMessageIcon(message.message_type)}</span>
                </div>
                <div className="flex-1">
                  <h4 className={`font-medium ${!message.is_read ? 'text-gray-900' : 'text-gray-700'}`}>
                    {message.subject}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {message.content}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {message.sender_name || 'System'} • {formatTimeAgo(message.sent_at)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {!message.is_read && (
                  <span className="w-2 h-2 bg-blue-500 rounded-full" title="Unread"></span>
                )}
                <button className="text-gray-400 hover:text-gray-600" title="More options">
                  <span className="sr-only">More options</span>⋯
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      {filteredMessages.length > 0 && (
        <div className="text-center">
          <button 
            onClick={fetchMessages}
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Refresh Messages
          </button>
        </div>
      )}

      {/* Notification Settings */}
      <div className="bg-gray-50 rounded-lg p-6 mt-8">
        <h4 className="font-semibold text-gray-900 mb-4">Notification Preferences</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Email notifications</span>
            <input type="checkbox" className="toggle" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Student booking notifications</span>
            <input type="checkbox" className="toggle" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Payment notifications</span>
            <input type="checkbox" className="toggle" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Federation announcements</span>
            <input type="checkbox" className="toggle" defaultChecked />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoachInboxTab