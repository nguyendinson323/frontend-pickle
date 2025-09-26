import React, { useState, useEffect } from 'react'
import { MessageRecipient } from '../../../store/slices/stateInboxSlice'
import { FiX, FiMail, FiSend, FiUser } from 'react-icons/fi'

interface ComposeMessageModalProps {
  isOpen: boolean
  onClose: () => void
  onSend: (messageData: {
    subject: string
    content: string
    message_type: string
    recipient_ids: number[]
    has_attachments?: boolean
  }) => Promise<void>
  recipients: MessageRecipient[]
  onLoadRecipients: (type?: string) => void
  loading: boolean
}

const ComposeMessageModal: React.FC<ComposeMessageModalProps> = ({
  isOpen,
  onClose,
  onSend,
  recipients,
  onLoadRecipients,
  loading
}) => {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    recipient_type: 'player',
    selected_recipient_id: ''
  })

  const [filteredRecipients, setFilteredRecipients] = useState<MessageRecipient[]>([])

  useEffect(() => {
    if (isOpen) {
      onLoadRecipients(formData.recipient_type)
    }
  }, [isOpen, formData.recipient_type, onLoadRecipients])

  useEffect(() => {
    const filtered = recipients.filter(recipient => recipient.type === formData.recipient_type)
    setFilteredRecipients(filtered)
  }, [recipients, formData.recipient_type])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.selected_recipient_id) {
      alert('Please select a recipient')
      return
    }

    try {
      await onSend({
        subject: formData.subject,
        content: formData.message,
        message_type: 'direct',
        recipient_ids: [parseInt(formData.selected_recipient_id)],
        has_attachments: false
      })
      
      // Reset form
      setFormData({
        subject: '',
        message: '',
        recipient_type: 'player',
        selected_recipient_id: ''
      })
      onClose()
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div className="relative top-8 mx-auto p-8 border border-white/20 w-full max-w-3xl shadow-2xl rounded-3xl bg-white/90 backdrop-blur-lg">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl shadow-lg">
                <FiMail className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">Compose Message</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-xl transition-all duration-200"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Recipient Type */}
            <div>
              <label htmlFor="recipient_type" className="block text-lg font-bold text-gray-800 mb-3 flex items-center space-x-2">
                <FiUser className="w-5 h-5 text-blue-600" />
                <span>Recipient Type</span>
              </label>
              <select
                id="recipient_type"
                name="recipient_type"
                value={formData.recipient_type}
                onChange={handleInputChange}
                className="block w-full px-4 py-4 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm text-lg font-medium transition-all duration-200 hover:border-blue-300"
              >
                <option value="player">Player</option>
                <option value="club">Club</option>
                <option value="partner">Partner</option>
                <option value="coach">Coach</option>
              </select>
            </div>

            {/* Recipient Selection */}
            <div>
              <label htmlFor="selected_recipient_id" className="block text-lg font-bold text-gray-800 mb-3 flex items-center space-x-2">
                <span>Select Recipient</span>
                <span className="text-red-500">*</span>
              </label>
              <select
                id="selected_recipient_id"
                name="selected_recipient_id"
                value={formData.selected_recipient_id}
                onChange={handleInputChange}
                required
                className="block w-full px-4 py-4 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm text-lg font-medium transition-all duration-200 hover:border-blue-300"
              >
                <option value="">Choose a recipient...</option>
                {filteredRecipients.map((recipient) => (
                  <option key={recipient.id} value={recipient.id}>
                    {recipient.name} ({recipient.email})
                  </option>
                ))}
              </select>
              {filteredRecipients.length === 0 && (
                <p className="mt-3 text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-200 font-medium">No {formData.recipient_type}s found in your state</p>
              )}
            </div>

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
                className="block w-full px-4 py-4 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm text-lg font-medium transition-all duration-200 hover:border-blue-300"
                placeholder="Enter message subject"
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
                className="block w-full px-4 py-4 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm text-lg font-medium transition-all duration-200 hover:border-blue-300 resize-none"
                placeholder="Enter your message"
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
                disabled={loading || !formData.subject || !formData.message || !formData.selected_recipient_id}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 border border-transparent rounded-xl shadow-lg text-lg font-semibold text-white hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 disabled:hover:scale-100 flex items-center space-x-2"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Sending...</span>
                  </div>
                ) : (
                  <>
                    <FiSend className="w-5 h-5" />
                    <span>Send Message</span>
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

export default ComposeMessageModal