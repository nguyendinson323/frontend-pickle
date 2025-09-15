import React, { useState, useEffect } from 'react'
import { MessageRecipient, AnnouncementTemplate } from '../../../store/slices/stateInboxSlice'

interface ComposeAnnouncementModalProps {
  isOpen: boolean
  onClose: () => void
  onSend: (announcementData: {
    subject: string
    content: string
    target_groups: string[]
    recipient_ids?: number[]
  }) => Promise<void>
  recipients: MessageRecipient[]
  templates: AnnouncementTemplate[]
  onLoadRecipients: (type?: string) => void
  loading: boolean
}

const ComposeAnnouncementModal: React.FC<ComposeAnnouncementModalProps> = ({
  isOpen,
  onClose,
  onSend,
  recipients,
  templates,
  onLoadRecipients,
  loading
}) => {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    target_groups: [] as string[],
    selected_template: ''
  })

  const [previewRecipients, setPreviewRecipients] = useState<MessageRecipient[]>([])

  useEffect(() => {
    if (isOpen) {
      onLoadRecipients()
    }
  }, [isOpen, onLoadRecipients])

  useEffect(() => {
    if (formData.target_groups.length > 0) {
      const filtered = recipients.filter(recipient => 
        formData.target_groups.includes(recipient.type)
      )
      setPreviewRecipients(filtered)
    } else {
      setPreviewRecipients([])
    }
  }, [recipients, formData.target_groups])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.target_groups.length === 0) {
      alert('Please select at least one target group')
      return
    }

    try {
      await onSend({
        subject: formData.subject,
        content: formData.message,
        target_groups: formData.target_groups
      })
      
      // Reset form
      setFormData({
        subject: '',
        message: '',
        target_groups: [],
        selected_template: ''
      })
      onClose()
    } catch (error) {
      console.error('Error sending announcement:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleTargetGroupChange = (group: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        target_groups: [...formData.target_groups, group]
      })
    } else {
      setFormData({
        ...formData,
        target_groups: formData.target_groups.filter(g => g !== group)
      })
    }
  }

  const handleTemplateSelect = (templateId: string) => {
    if (!templateId) {
      setFormData({
        ...formData,
        subject: '',
        message: '',
        selected_template: ''
      })
      return
    }

    const template = templates.find(t => t.id.toString() === templateId)
    if (template) {
      setFormData({
        ...formData,
        subject: template.subject,
        message: template.content,
        selected_template: templateId
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-8 mx-auto p-5 border w-full max-w-3xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Send Announcement</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Template Selection */}
            {templates.length > 0 && (
              <div>
                <label htmlFor="selected_template" className="block text-sm font-medium text-gray-700">
                  Use Template (Optional)
                </label>
                <select
                  id="selected_template"
                  name="selected_template"
                  value={formData.selected_template}
                  onChange={(e) => {
                    handleInputChange(e)
                    handleTemplateSelect(e.target.value)
                  }}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose a template...</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Target Groups */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Target Groups *
              </label>
              <div className="space-y-2">
                {[
                  { id: 'players', label: 'Players', count: recipients.filter(r => r.type === 'player').length },
                  { id: 'clubs', label: 'Clubs', count: recipients.filter(r => r.type === 'club').length },
                  { id: 'partners', label: 'Partners', count: recipients.filter(r => r.type === 'partner').length },
                  { id: 'coaches', label: 'Coaches', count: recipients.filter(r => r.type === 'coach').length }
                ].map((group) => (
                  <div key={group.id} className="flex items-center">
                    <input
                      id={group.id}
                      type="checkbox"
                      checked={formData.target_groups.includes(group.id)}
                      onChange={(e) => handleTargetGroupChange(group.id, e.target.checked)}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={group.id} className="text-sm text-gray-700">
                      {group.label} ({group.count} recipients)
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Recipient Preview */}
            {previewRecipients.length > 0 && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 font-medium mb-2">
                  This announcement will be sent to {previewRecipients.length} recipients
                </p>
                <div className="max-h-32 overflow-y-auto">
                  <div className="text-xs text-blue-700 space-y-1">
                    {previewRecipients.slice(0, 10).map((recipient) => (
                      <div key={recipient.id}>
                        {recipient.name} ({recipient.email}) - {recipient.type}
                      </div>
                    ))}
                    {previewRecipients.length > 10 && (
                      <div className="text-blue-600 font-medium">
                        ...and {previewRecipients.length - 10} more recipients
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                Subject *
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter announcement subject"
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={6}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your announcement message"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.subject || !formData.message || formData.target_groups.length === 0}
                className="px-4 py-2 bg-green-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Announcement'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ComposeAnnouncementModal