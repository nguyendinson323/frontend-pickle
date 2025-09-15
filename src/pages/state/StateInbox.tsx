import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import {
  fetchStateInboxData,
  fetchStateRecipients,
  sendStateMessage,
  sendBulkAnnouncement,
  markStateMessageAsRead,
  deleteStateMessage,
  fetchMessageTemplates,
  createMessageTemplate,
  updateMessageTemplate,
  deleteMessageTemplate,
  setSelectedMessage,
  StateMessage,
  AnnouncementTemplate
} from '../../store/slices/stateInboxSlice'

import InboxHeader from '../../components/state/inbox/InboxHeader'
import InboxTabs from '../../components/state/inbox/InboxTabs'
import InboxTab from '../../components/state/inbox/InboxTab'
import SentMessagesTab from '../../components/state/inbox/SentMessagesTab'
import TemplatesTab from '../../components/state/inbox/TemplatesTab'
import ComposeMessageModal from '../../components/state/inbox/ComposeMessageModal'
import ComposeAnnouncementModal from '../../components/state/inbox/ComposeAnnouncementModal'
import CreateTemplateModal from '../../components/state/inbox/CreateTemplateModal'
import MessageViewModal from '../../components/state/inbox/MessageViewModal'

const StateInbox: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  
  const { messages, sentMessages, recipients, templates, stats, selectedMessage, loading, error } = useSelector((state: RootState) => state.stateInbox)
  const { user } = useSelector((state: RootState) => state.auth)

  const [activeTab, setActiveTab] = useState('inbox')
  const [showComposeModal, setShowComposeModal] = useState(false)
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [editTemplate, setEditTemplate] = useState<AnnouncementTemplate | null>(null)

  useEffect(() => {
    if (user && user.role === 'state') {
      fetchData()
    } else {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const fetchData = async () => {
    try {
      const inboxPromise = dispatch(fetchStateInboxData())
      const templatesPromise = dispatch(fetchMessageTemplates())
      await Promise.all([inboxPromise, templatesPromise])
    } catch (error) {
      console.error('Error fetching state inbox data:', error)
    }
  }

  const handleComposeMessage = async (messageData: {
    subject: string
    content: string
    message_type: string
    recipient_ids: number[]
    has_attachments?: boolean
  }) => {
    try {
      await dispatch(sendStateMessage(messageData))
      setShowComposeModal(false)
      // Refresh inbox data to show new message in sent items
      await fetchData()
    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    }
  }

  const handleSendAnnouncement = async (announcementData: {
    subject: string
    content: string
    target_groups: string[]
    recipient_ids?: number[]
  }) => {
    try {
      await dispatch(sendBulkAnnouncement(announcementData))
      setShowAnnouncementModal(false)
      // Refresh inbox data to show new announcement in sent items
      await fetchData()
    } catch (error) {
      console.error('Error sending announcement:', error)
      throw error
    }
  }

  const handleViewMessage = (message: StateMessage) => {
    dispatch(setSelectedMessage(message))
    setShowMessageModal(true)
  }

  const handleMarkAsRead = async (messageId: number) => {
    try {
      await dispatch(markStateMessageAsRead(messageId))
    } catch (error) {
      console.error('Error marking message as read:', error)
    }
  }

  const handleDeleteMessage = async (messageId: number) => {
    try {
      await dispatch(deleteStateMessage(messageId))
    } catch (error) {
      console.error('Error deleting message:', error)
    }
  }

  const handleLoadRecipients = async (type?: string) => {
    try {
      await dispatch(fetchStateRecipients(type))
    } catch (error) {
      console.error('Error loading recipients:', error)
    }
  }

  const handleCreateTemplate = async (templateData: {
    name: string
    subject: string
    content: string
    target_audience: string
  }) => {
    try {
      await dispatch(createMessageTemplate(templateData))
      setShowTemplateModal(false)
    } catch (error) {
      console.error('Error creating template:', error)
      throw error
    }
  }

  const handleUpdateTemplate = async (templateId: number, templateData: Partial<AnnouncementTemplate>) => {
    try {
      await dispatch(updateMessageTemplate(templateId, templateData))
      setEditTemplate(null)
    } catch (error) {
      console.error('Error updating template:', error)
      throw error
    }
  }

  const handleDeleteTemplate = async (templateId: number) => {
    try {
      await dispatch(deleteMessageTemplate(templateId))
    } catch (error) {
      console.error('Error deleting template:', error)
    }
  }

  const handleEditTemplate = (template: AnnouncementTemplate) => {
    setEditTemplate(template)
    setShowTemplateModal(true)
  }

  const handleUseTemplate = (_template: AnnouncementTemplate) => {
    // Set the selected template and open announcement modal
    setShowAnnouncementModal(true)
  }

  const handleReplyToMessage = (_message: StateMessage) => {
    // In a real implementation, you would pre-populate the compose modal
    // with the reply subject and recipient information
    // For now, just open the compose modal
    setShowComposeModal(true)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'inbox':
        return (
          <InboxTab
            messages={messages}
            onViewMessage={handleViewMessage}
            onMarkAsRead={handleMarkAsRead}
            onDeleteMessage={handleDeleteMessage}
          />
        )
      case 'sent':
        return (
          <SentMessagesTab
            messages={sentMessages}
            onViewMessage={handleViewMessage}
            onDeleteMessage={handleDeleteMessage}
          />
        )
      case 'templates':
        return (
          <TemplatesTab
            templates={templates}
            onCreateTemplate={() => {
              setEditTemplate(null)
              setShowTemplateModal(true)
            }}
            onEditTemplate={handleEditTemplate}
            onDeleteTemplate={handleDeleteTemplate}
            onUseTemplate={handleUseTemplate}
          />
        )
      default:
        return null
    }
  }

  if (loading && messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <InboxHeader
          stats={stats}
          onComposeMessage={() => setShowComposeModal(true)}
          onComposeAnnouncement={() => setShowAnnouncementModal(true)}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <InboxTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          messagesCount={messages.length}
          sentMessagesCount={sentMessages.length}
          templatesCount={templates.length}
        />

        <div className="bg-white rounded-lg shadow-md p-6">
          {renderTabContent()}
        </div>

        <ComposeMessageModal
          isOpen={showComposeModal}
          onClose={() => setShowComposeModal(false)}
          onSend={handleComposeMessage}
          recipients={recipients}
          onLoadRecipients={handleLoadRecipients}
          loading={loading}
        />

        <ComposeAnnouncementModal
          isOpen={showAnnouncementModal}
          onClose={() => setShowAnnouncementModal(false)}
          onSend={handleSendAnnouncement}
          recipients={recipients}
          templates={templates}
          onLoadRecipients={handleLoadRecipients}
          loading={loading}
        />

        <CreateTemplateModal
          isOpen={showTemplateModal}
          onClose={() => {
            setShowTemplateModal(false)
            setEditTemplate(null)
          }}
          onCreate={handleCreateTemplate}
          onUpdate={handleUpdateTemplate}
          editTemplate={editTemplate}
          loading={loading}
        />

        <MessageViewModal
          isOpen={showMessageModal}
          onClose={() => setShowMessageModal(false)}
          message={selectedMessage}
          onMarkAsRead={handleMarkAsRead}
          onDelete={handleDeleteMessage}
          onReply={handleReplyToMessage}
        />
      </div>
    </div>
  )
}

export default StateInbox