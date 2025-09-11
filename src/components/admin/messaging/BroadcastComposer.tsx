import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import { 
  setBroadcastForm,
  sendBroadcastMessage,
  getMessagePreview,
  resetBroadcastForm
} from '../../../store/slices/adminMessagingSlice'

const BroadcastComposer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { broadcastForm, selectedTemplate, sendingMessage } = useSelector((state: RootState) => state.adminMessaging)
  
  const [showPreview, setShowPreview] = useState(false)
  const [previewData, setPreviewData] = useState<any>(null)

  const recipientOptions = [
    { value: 'all', label: 'All Users', description: 'Send to all active users' },
    { value: 'players', label: 'Players', description: 'All registered players' },
    { value: 'coaches', label: 'Coaches', description: 'All registered coaches' },
    { value: 'clubs', label: 'Clubs', description: 'All registered clubs' },
    { value: 'partners', label: 'Partners', description: 'All business partners' },
    { value: 'states', label: 'State Committees', description: 'All state representatives' }
  ]

  const handleFormChange = (field: string, value: any) => {
    dispatch(setBroadcastForm({ [field]: value }))
  }

  const handleRecipientChange = (recipient: string, checked: boolean) => {
    const updatedRecipients = checked
      ? [...broadcastForm.recipients, recipient]
      : broadcastForm.recipients.filter(r => r !== recipient)
    
    dispatch(setBroadcastForm({ recipients: updatedRecipients }))
  }

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      dispatch(setBroadcastForm({
        subject: selectedTemplate.subject,
        body: selectedTemplate.body
      }))
    }
  }

  const handlePreview = async () => {
    if (broadcastForm.recipients.length === 0 || !broadcastForm.subject || !broadcastForm.body) {
      alert('Please fill in all required fields before previewing')
      return
    }

    try {
      const preview = await dispatch(getMessagePreview(broadcastForm)) as any
      setPreviewData(preview.payload || preview)
      setShowPreview(true)
    } catch (error) {
      console.error('Failed to get preview:', error)
    }
  }

  const handleSend = async () => {
    if (broadcastForm.recipients.length === 0) {
      alert('Please select at least one recipient group')
      return
    }

    if (!broadcastForm.subject || !broadcastForm.body) {
      alert('Subject and message body are required')
      return
    }

    const confirmed = window.confirm(
      `Are you sure you want to send this message to ${broadcastForm.recipients.join(', ')}?`
    )

    if (confirmed) {
      try {
        await dispatch(sendBroadcastMessage(broadcastForm))
        alert('Message sent successfully!')
      } catch (error) {
        console.error('Failed to send message:', error)
      }
    }
  }

  const handleClear = () => {
    const confirmed = window.confirm('Are you sure you want to clear the form?')
    if (confirmed) {
      dispatch(resetBroadcastForm())
    }
  }

  return (
    <div className="bg-white shadow-sm rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Compose Broadcast Message</h3>
          {selectedTemplate && (
            <button
              onClick={handleUseTemplate}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Use Selected Template
            </button>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Recipients Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Recipients <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recipientOptions.map((option) => (
              <div key={option.value} className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    id={option.value}
                    checked={broadcastForm.recipients.includes(option.value)}
                    onChange={(e) => handleRecipientChange(option.value, e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor={option.value} className="text-sm font-medium text-gray-700">
                    {option.label}
                  </label>
                  <p className="text-xs text-gray-500">{option.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            Subject <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="subject"
            value={broadcastForm.subject}
            onChange={(e) => handleFormChange('subject', e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="Enter message subject"
          />
        </div>

        {/* Message Body */}
        <div>
          <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="body"
            value={broadcastForm.body}
            onChange={(e) => handleFormChange('body', e.target.value)}
            rows={8}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="Enter your message here..."
          />
        </div>

        {/* Delivery Methods */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Delivery Methods</label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sendEmail"
                checked={broadcastForm.sendEmail}
                onChange={(e) => handleFormChange('sendEmail', e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <label htmlFor="sendEmail" className="ml-2 text-sm text-gray-700">
                Send via Email
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sendSMS"
                checked={broadcastForm.sendSMS}
                onChange={(e) => handleFormChange('sendSMS', e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <label htmlFor="sendSMS" className="ml-2 text-sm text-gray-700">
                Send via SMS
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sendInApp"
                checked={broadcastForm.sendInApp}
                onChange={(e) => handleFormChange('sendInApp', e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <label htmlFor="sendInApp" className="ml-2 text-sm text-gray-700">
                Send as In-App Notification
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <button
            onClick={handleClear}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-100 transition-colors"
          >
            Clear Form
          </button>
          <button
            onClick={handlePreview}
            className="px-4 py-2 border border-indigo-300 rounded-md text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors"
          >
            Preview
          </button>
          <button
            onClick={handleSend}
            disabled={sendingMessage || broadcastForm.recipients.length === 0}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {sendingMessage ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && previewData && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Message Preview</h3>
              
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Delivery Summary</h4>
                  <p className="text-blue-700">
                    This message will be sent to <strong>{previewData.totalRecipients}</strong> recipients
                  </p>
                  <div className="mt-2 text-sm text-blue-600">
                    {previewData.recipientBreakdown && Object.entries(previewData.recipientBreakdown).map(([type, count]) => (
                      <div key={type}>
                        {type}: {count as number} recipients
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-blue-600 mt-2">
                    Estimated delivery time: {previewData.estimatedDeliveryTime}
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Message Content</h4>
                  <div className="mb-2">
                    <strong>Subject:</strong> {previewData.subject}
                  </div>
                  <div>
                    <strong>Body:</strong>
                    <div className="mt-1 p-3 bg-gray-50 rounded text-sm">
                      {previewData.body}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowPreview(false)
                    handleSend()
                  }}
                  disabled={sendingMessage}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {sendingMessage ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BroadcastComposer