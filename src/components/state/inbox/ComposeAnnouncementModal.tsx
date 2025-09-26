import React, { useState, useEffect } from 'react'
import { MessageRecipient, AnnouncementTemplate } from '../../../store/slices/stateInboxSlice'
import { FiX, FiSend, FiUsers, FiFileText, FiCheckSquare } from 'react-icons/fi'

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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div className="relative top-8 mx-auto p-8 border border-white/20 w-full max-w-4xl shadow-2xl rounded-3xl bg-white/90 backdrop-blur-lg">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl shadow-lg">
                <FiSend className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-emerald-900 bg-clip-text text-transparent">Send Announcement</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-xl transition-all duration-200"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Template Selection */}
            {templates.length > 0 && (
              <div>
                <label htmlFor="selected_template" className="block text-lg font-bold text-gray-800 mb-3 flex items-center space-x-2">
                  <FiFileText className="w-5 h-5 text-purple-600" />
                  <span>Use Template (Optional)</span>
                </label>
                <select
                  id="selected_template"
                  name="selected_template"
                  value={formData.selected_template}
                  onChange={(e) => {
                    handleInputChange(e)
                    handleTemplateSelect(e.target.value)
                  }}
                  className="block w-full px-4 py-4 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/80 backdrop-blur-sm text-lg font-medium transition-all duration-200 hover:border-purple-300"
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
              <label className="block text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <FiUsers className="w-5 h-5 text-green-600" />
                <span>Target Groups</span>
                <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'players', label: 'Players', count: recipients.filter(r => r.type === 'player').length, color: 'blue' },
                  { id: 'clubs', label: 'Clubs', count: recipients.filter(r => r.type === 'club').length, color: 'orange' },
                  { id: 'partners', label: 'Partners', count: recipients.filter(r => r.type === 'partner').length, color: 'green' },
                  { id: 'coaches', label: 'Coaches', count: recipients.filter(r => r.type === 'coach').length, color: 'purple' }
                ].map((group) => (
                  <div key={group.id} className={`flex items-center p-4 border-2 rounded-xl transition-all duration-200 hover:shadow-lg ${
                    formData.target_groups.includes(group.id)
                      ? `bg-${group.color}-50 border-${group.color}-300`
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      id={group.id}
                      type="checkbox"
                      checked={formData.target_groups.includes(group.id)}
                      onChange={(e) => handleTargetGroupChange(group.id, e.target.checked)}
                      className="mr-4 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <label htmlFor={group.id} className="text-lg font-semibold text-gray-800 cursor-pointer">
                        {group.label}
                      </label>
                      <p className="text-sm text-gray-600">({group.count} recipients)</p>
                    </div>
                    {formData.target_groups.includes(group.id) && (
                      <FiCheckSquare className={`w-5 h-5 text-${group.color}-600`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Recipient Preview */}
            {previewRecipients.length > 0 && (
              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200/50 shadow-lg">
                <div className="flex items-center space-x-3 mb-4">
                  <FiUsers className="w-6 h-6 text-blue-600" />
                  <p className="text-lg font-bold text-blue-900">
                    This announcement will be sent to {previewRecipients.length} recipients
                  </p>
                </div>
                <div className="max-h-40 overflow-y-auto bg-white/50 rounded-xl p-4">
                  <div className="space-y-2">
                    {previewRecipients.slice(0, 10).map((recipient) => (
                      <div key={recipient.id} className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm">
                        <span className="font-medium text-gray-900">{recipient.name}</span>
                        <span className="text-sm text-gray-600">({recipient.email})</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          recipient.type === 'player' ? 'bg-blue-100 text-blue-800' :
                          recipient.type === 'club' ? 'bg-orange-100 text-orange-800' :
                          recipient.type === 'partner' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {recipient.type}
                        </span>
                      </div>
                    ))}
                    {previewRecipients.length > 10 && (
                      <div className="text-center p-3 bg-blue-100 rounded-lg">
                        <span className="text-blue-800 font-bold">
                          ...and {previewRecipients.length - 10} more recipients
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-lg font-bold text-gray-800 mb-3 flex items-center space-x-2">
                <span>Subject</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="block w-full px-4 py-4 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80 backdrop-blur-sm text-lg font-medium transition-all duration-200 hover:border-green-300"
                placeholder="Enter announcement subject"
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-lg font-bold text-gray-800 mb-3 flex items-center space-x-2">
                <span>Message</span>
                <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={8}
                className="block w-full px-4 py-4 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80 backdrop-blur-sm text-lg font-medium transition-all duration-200 hover:border-green-300 resize-none"
                placeholder="Enter your announcement message"
              />
            </div>

            <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200/50">
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-4 border-2 border-gray-300 rounded-xl shadow-sm text-lg font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 hover:scale-105"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.subject || !formData.message || formData.target_groups.length === 0}
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-700 border border-transparent rounded-xl shadow-lg text-lg font-semibold text-white hover:from-green-700 hover:to-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 disabled:hover:scale-100 flex items-center space-x-2"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Sending...</span>
                  </div>
                ) : (
                  <>
                    <FiSend className="w-5 h-5" />
                    <span>Send Announcement</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ComposeAnnouncementModal