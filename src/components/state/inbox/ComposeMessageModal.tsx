import React, { useState, useEffect } from 'react'
import { MessageRecipient } from '../../../store/slices/stateInboxSlice'

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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-8 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Compose Message</h3>
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
            {/* Recipient Type */}
            <div>
              <label htmlFor="recipient_type" className="block text-sm font-medium text-gray-700">
                Recipient Type
              </label>
              <select
                id="recipient_type"
                name="recipient_type"
                value={formData.recipient_type}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="player">Player</option>
                <option value="club">Club</option>
                <option value="partner">Partner</option>
                <option value="coach">Coach</option>
              </select>
            </div>

            {/* Recipient Selection */}
            <div>
              <label htmlFor="selected_recipient_id" className="block text-sm font-medium text-gray-700">
                Select Recipient *
              </label>
              <select
                id="selected_recipient_id"
                name="selected_recipient_id"
                value={formData.selected_recipient_id}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choose a recipient...</option>
                {filteredRecipients.map((recipient) => (
                  <option key={recipient.id} value={recipient.id}>
                    {recipient.name} ({recipient.email})
                  </option>
                ))}
              </select>
              {filteredRecipients.length === 0 && (
                <p className="mt-1 text-sm text-gray-500">No {formData.recipient_type}s found in your state</p>
              )}
            </div>

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
                placeholder="Enter message subject"
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
                placeholder="Enter your message"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.subject || !formData.message || !formData.selected_recipient_id}
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ComposeMessageModal