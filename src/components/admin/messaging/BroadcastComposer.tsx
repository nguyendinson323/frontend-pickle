import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import {
  setBroadcastForm,
  sendBroadcastMessage,
  getMessagePreview,
  resetBroadcastForm
} from '../../../store/slices/adminMessagingSlice'
import {
  FiEdit3,
  FiUsers,
  FiUser,
  FiAward,
  FiMapPin,
  FiMail,
  FiSmartphone,
  FiBell,
  FiSend,
  FiEye,
  FiTrash2,
  FiX,
  FiLoader,
  FiCheck,
  FiMessageSquare,
  FiFileText,
  FiClock
} from 'react-icons/fi'

const BroadcastComposer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { broadcastForm, selectedTemplate, sendingMessage } = useSelector((state: RootState) => state.adminMessaging)
  
  const [showPreview, setShowPreview] = useState(false)
  const [previewData, setPreviewData] = useState<any>(null)

  const recipientOptions = [
    { value: 'all', label: 'All Users', description: 'Send to all active users', icon: FiUsers, color: 'from-blue-500 to-blue-600', bgColor: 'from-blue-50 to-blue-100' },
    { value: 'players', label: 'Players', description: 'All registered players', icon: FiUser, color: 'from-green-500 to-green-600', bgColor: 'from-green-50 to-green-100' },
    { value: 'coaches', label: 'Coaches', description: 'All registered coaches', icon: FiAward, color: 'from-purple-500 to-purple-600', bgColor: 'from-purple-50 to-purple-100' },
    { value: 'clubs', label: 'Clubs', description: 'All registered clubs', icon: FiUsers, color: 'from-indigo-500 to-indigo-600', bgColor: 'from-indigo-50 to-indigo-100' },
    { value: 'partners', label: 'Partners', description: 'All business partners', icon: FiAward, color: 'from-orange-500 to-orange-600', bgColor: 'from-orange-50 to-orange-100' },
    { value: 'states', label: 'State Committees', description: 'All state representatives', icon: FiMapPin, color: 'from-red-500 to-red-600', bgColor: 'from-red-50 to-red-100' }
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
    <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white mr-3">
              <FiEdit3 className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Compose Broadcast Message</h3>
          </div>
          {selectedTemplate && (
            <button
              onClick={handleUseTemplate}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-medium rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <FiFileText className="mr-2 h-4 w-4" />
              Use Selected Template
            </button>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Recipients Selection */}
        <div>
          <label className="block text-lg font-bold text-gray-900 mb-4 flex items-center">
            <FiUsers className="mr-2 h-5 w-5" />
            Recipients <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recipientOptions.map((option) => {
              const IconComponent = option.icon
              const isSelected = broadcastForm.recipients.includes(option.value)
              return (
                <div
                  key={option.value}
                  className={`relative p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer hover:shadow-lg ${
                    isSelected
                      ? `bg-gradient-to-br ${option.bgColor} border-opacity-50 shadow-lg transform scale-105`
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleRecipientChange(option.value, !isSelected)}
                >
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        id={option.value}
                        checked={isSelected}
                        onChange={(e) => handleRecipientChange(option.value, e.target.checked)}
                        className="rounded-lg border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 h-4 w-4"
                      />
                    </div>
                    <div className={`w-10 h-10 bg-gradient-to-br ${option.color} rounded-xl flex items-center justify-center text-white ml-3 mr-3`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <label htmlFor={option.value} className="text-sm font-bold text-gray-800 cursor-pointer">
                        {option.label}
                      </label>
                      <p className="text-xs text-gray-600 mt-1">{option.description}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <FiCheck className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-lg font-bold text-gray-900 mb-3 flex items-center">
            <FiMessageSquare className="mr-2 h-5 w-5" />
            Subject <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              id="subject"
              value={broadcastForm.subject}
              onChange={(e) => handleFormChange('subject', e.target.value)}
              className="w-full border-2 border-gray-300 rounded-2xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 px-4 py-3 text-lg hover:border-gray-400"
              placeholder="Enter an engaging subject line..."
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400">
              {broadcastForm.subject.length}/100
            </div>
          </div>
        </div>

        {/* Message Body */}
        <div>
          <label htmlFor="body" className="block text-lg font-bold text-gray-900 mb-3 flex items-center">
            <FiEdit3 className="mr-2 h-5 w-5" />
            Message <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <textarea
              id="body"
              value={broadcastForm.body}
              onChange={(e) => handleFormChange('body', e.target.value)}
              rows={8}
              className="w-full border-2 border-gray-300 rounded-2xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 px-4 py-3 text-base hover:border-gray-400 resize-none"
              placeholder="Write your message here... Be clear, concise, and engaging."
            />
            <div className="absolute bottom-3 right-3 text-sm text-gray-400">
              {broadcastForm.body.length}/1000 characters
            </div>
          </div>
        </div>

        {/* Delivery Methods */}
        <div>
          <label className="block text-lg font-bold text-gray-900 mb-4 flex items-center">
            <FiSend className="mr-2 h-5 w-5" />
            Delivery Methods
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className={`relative p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer hover:shadow-lg ${
                broadcastForm.sendEmail
                  ? 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg transform scale-105'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleFormChange('sendEmail', !broadcastForm.sendEmail)}
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="sendEmail"
                  checked={broadcastForm.sendEmail}
                  onChange={(e) => handleFormChange('sendEmail', e.target.checked)}
                  className="rounded-lg border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 h-4 w-4"
                />
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white ml-3 mr-3">
                  <FiMail className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <label htmlFor="sendEmail" className="text-sm font-bold text-gray-800 cursor-pointer">
                    Email
                  </label>
                  <p className="text-xs text-gray-600">Rich HTML content</p>
                </div>
              </div>
              {broadcastForm.sendEmail && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <FiCheck className="h-3 w-3 text-white" />
                  </div>
                </div>
              )}
            </div>

            <div
              className={`relative p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer hover:shadow-lg ${
                broadcastForm.sendSMS
                  ? 'bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 shadow-lg transform scale-105'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleFormChange('sendSMS', !broadcastForm.sendSMS)}
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="sendSMS"
                  checked={broadcastForm.sendSMS}
                  onChange={(e) => handleFormChange('sendSMS', e.target.checked)}
                  className="rounded-lg border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 h-4 w-4"
                />
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center text-white ml-3 mr-3">
                  <FiSmartphone className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <label htmlFor="sendSMS" className="text-sm font-bold text-gray-800 cursor-pointer">
                    SMS
                  </label>
                  <p className="text-xs text-gray-600">Text messages</p>
                </div>
              </div>
              {broadcastForm.sendSMS && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <FiCheck className="h-3 w-3 text-white" />
                  </div>
                </div>
              )}
            </div>

            <div
              className={`relative p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer hover:shadow-lg ${
                broadcastForm.sendInApp
                  ? 'bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200 shadow-lg transform scale-105'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleFormChange('sendInApp', !broadcastForm.sendInApp)}
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="sendInApp"
                  checked={broadcastForm.sendInApp}
                  onChange={(e) => handleFormChange('sendInApp', e.target.checked)}
                  className="rounded-lg border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 h-4 w-4"
                />
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center text-white ml-3 mr-3">
                  <FiBell className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <label htmlFor="sendInApp" className="text-sm font-bold text-gray-800 cursor-pointer">
                    In-App
                  </label>
                  <p className="text-xs text-gray-600">Push notifications</p>
                </div>
              </div>
              {broadcastForm.sendInApp && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <FiCheck className="h-3 w-3 text-white" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t-2 border-gray-200">
          <button
            onClick={handleClear}
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 bg-white hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <FiTrash2 className="mr-2 h-4 w-4" />
            Clear Form
          </button>
          <button
            onClick={handlePreview}
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-indigo-300 rounded-xl text-indigo-700 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-400 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <FiEye className="mr-2 h-4 w-4" />
            Preview
          </button>
          <button
            onClick={handleSend}
            disabled={sendingMessage || broadcastForm.recipients.length === 0}
            className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
          >
            {sendingMessage ? (
              <>
                <FiLoader className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <FiSend className="mr-2 h-4 w-4" />
                Send Message
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && previewData && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative mx-auto border border-gray-200 max-w-4xl shadow-2xl rounded-2xl bg-white transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-6 py-4 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-3">
                    <FiEye className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold">Message Preview</h3>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-white hover:text-gray-300 transition-colors bg-white bg-opacity-20 rounded-xl p-2 hover:bg-opacity-30"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 rounded-2xl p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white mr-3">
                      <FiUsers className="h-5 w-5" />
                    </div>
                    <h4 className="text-lg font-bold text-blue-800">Delivery Summary</h4>
                  </div>
                  <p className="text-blue-700 text-lg mb-4">
                    This message will be sent to <span className="font-bold text-2xl">{previewData.totalRecipients}</span> recipients
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {previewData.recipientBreakdown && Object.entries(previewData.recipientBreakdown).map(([type, count]) => (
                      <div key={type} className="bg-white bg-opacity-60 rounded-xl p-3">
                        <div className="text-sm font-medium text-blue-800">{type}</div>
                        <div className="text-lg font-bold text-blue-900">{count as number} recipients</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center text-blue-600 bg-white bg-opacity-60 rounded-xl p-3">
                    <FiClock className="mr-2 h-4 w-4" />
                    <span className="font-medium">Estimated delivery time: {previewData.estimatedDeliveryTime}</span>
                  </div>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gray-500 rounded-xl flex items-center justify-center text-white mr-3">
                      <FiMessageSquare className="h-5 w-5" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-800">Message Content</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-sm font-semibold text-gray-600 mb-2">Subject</div>
                      <div className="text-lg font-bold text-gray-900">{previewData.subject}</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-sm font-semibold text-gray-600 mb-2">Message Body</div>
                      <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">{previewData.body}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 mt-8 pt-6 border-t-2 border-gray-200">
                <button
                  onClick={() => setShowPreview(false)}
                  className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <FiX className="mr-2 h-4 w-4" />
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowPreview(false)
                    handleSend()
                  }}
                  disabled={sendingMessage}
                  className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                >
                  {sendingMessage ? (
                    <>
                      <FiLoader className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FiSend className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
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