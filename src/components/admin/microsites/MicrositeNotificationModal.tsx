import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../store'
import { MicrositeAdmin } from '../../../types/admin'
import { sendMicrositeNotification } from '../../../store/slices/adminMicrositesSlice'

interface MicrositeNotificationModalProps {
  microsite: MicrositeAdmin
  onClose: () => void
}

const MicrositeNotificationModal: React.FC<MicrositeNotificationModalProps> = ({ microsite, onClose }) => {
  const dispatch = useDispatch<AppDispatch>()
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [recipients, setRecipients] = useState<string[]>(['owner'])
  const [loading, setLoading] = useState(false)

  const recipientOptions = [
    { value: 'owner', label: 'Site Owner', description: 'Send notification to the microsite owner' },
    { value: 'visitors', label: 'Recent Visitors', description: 'Send to users who visited in the last 30 days' },
    { value: 'subscribers', label: 'Subscribers', description: 'Send to users subscribed to site updates' }
  ]

  const templates = [
    {
      name: 'Approval Notification',
      subject: 'Your microsite "{{siteName}}" has been approved',
      message: 'Congratulations!\n\nYour microsite "{{siteName}}" has been reviewed and approved by our admin team. Your site is now live and accessible to visitors.\n\nSite URL: {{siteUrl}}\n\nThank you for being part of our platform!\n\nBest regards,\nAdmin Team'
    },
    {
      name: 'Content Warning',
      subject: 'Action Required: Content review for "{{siteName}}"',
      message: 'Hello,\n\nDuring our routine content review, we found some issues with your microsite "{{siteName}}" that need your attention:\n\n[Please specify the issues found]\n\nPlease review and update your content within 7 days to maintain compliance with our guidelines.\n\nSite URL: {{siteUrl}}\n\nIf you have questions, please contact our support team.\n\nBest regards,\nAdmin Team'
    },
    {
      name: 'Performance Alert',
      subject: 'Performance recommendations for "{{siteName}}"',
      message: 'Hello,\n\nWe\'ve completed a performance audit of your microsite "{{siteName}}" and have some recommendations to improve user experience:\n\n• Optimize images for faster loading\n• Improve mobile responsiveness\n• Add meta descriptions for better SEO\n\nImplementing these changes can help increase your site\'s visibility and user engagement.\n\nSite URL: {{siteUrl}}\n\nBest regards,\nAdmin Team'
    },
    {
      name: 'Suspension Notice',
      subject: 'IMPORTANT: Your microsite "{{siteName}}" has been suspended',
      message: 'Dear {{ownerName}},\n\nWe regret to inform you that your microsite "{{siteName}}" has been temporarily suspended due to:\n\n[Please specify the reason for suspension]\n\nTo restore your site, please:\n1. Address the issues mentioned above\n2. Contact our support team for review\n\nWe appreciate your understanding and cooperation.\n\nBest regards,\nAdmin Team'
    }
  ]

  const handleTemplateSelect = (template: typeof templates[0]) => {
    const processedSubject = template.subject
      .replace('{{siteName}}', microsite.title)
      .replace('{{ownerName}}', microsite.owner_name)
    
    const processedMessage = template.message
      .replace(/{{siteName}}/g, microsite.title)
      .replace('{{siteUrl}}', microsite.subdomain ? `https://${microsite.subdomain}` : 'No URL')
      .replace('{{ownerName}}', microsite.owner_name)

    setSubject(processedSubject)
    setMessage(processedMessage)
  }

  const handleRecipientChange = (value: string, checked: boolean) => {
    if (checked) {
      setRecipients([...recipients, value])
    } else {
      setRecipients(recipients.filter(r => r !== value))
    }
  }

  const handleSubmit = async () => {
    if (!subject.trim() || !message.trim() || recipients.length === 0) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      await dispatch(sendMicrositeNotification(microsite.id, subject, message, recipients))
      onClose()
    } catch (error) {
      console.error('Failed to send notification:', error)
      alert('Failed to send notification. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">Send Microsite Notification</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900">{microsite.title}</h4>
          <p className="text-sm text-blue-700">Owner: {microsite.owner_name} ({microsite.owner_type})</p>
          <p className="text-sm text-blue-700">Domain: {microsite.subdomain || "No subdomain"}</p>
        </div>

        <div className="space-y-6">
          {/* Template Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Use Template (Optional)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {templates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => handleTemplateSelect(template)}
                  className="text-left p-3 text-sm border border-gray-300 rounded-md hover: focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <div className="font-medium text-gray-900">{template.name}</div>
                  <div className="text-xs text-gray-500 mt-1">Click to use</div>
                </button>
              ))}
            </div>
          </div>

          {/* Recipients */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipients *
            </label>
            <div className="space-y-2">
              {recipientOptions.map((option) => (
                <label key={option.value} className="flex items-start">
                  <input
                    type="checkbox"
                    checked={recipients.includes(option.value)}
                    onChange={(e) => handleRecipientChange(option.value, e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-0.5"
                  />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-700">{option.label}</div>
                    <div className="text-xs text-gray-500">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject *
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter notification subject"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={8}
              placeholder="Enter your message here..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Available variables: {'{'}siteName{'}'}, {'{'}siteUrl{'}'}, {'{'}ownerName{'}'}
            </p>
          </div>

          {/* Preview */}
          {(subject || message) && (
            <div className=" border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Preview</h4>
              {subject && (
                <div className="mb-2">
                  <span className="text-xs font-medium text-gray-600">Subject:</span>
                  <p className="text-sm text-gray-900">{subject}</p>
                </div>
              )}
              {message && (
                <div>
                  <span className="text-xs font-medium text-gray-600">Message:</span>
                  <div className="text-sm text-gray-900 whitespace-pre-wrap bg-white p-3 rounded border mt-1">
                    {message}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Microsite Info */}
          <div className=" border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Microsite Information</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <div>Status: {microsite.status}</div>
              <div>Content Score: {microsite.content_score}/100</div>
              <div>Monthly Visitors: {microsite.monthly_visitors.toLocaleString()}</div>
              {microsite.has_inappropriate_content && (
                <div className="text-red-600">⚠️ Contains flagged content</div>
              )}
            </div>
          </div>

          {/* Recipients Summary */}
          {recipients.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                Notification will be sent to:
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                {recipients.map((recipient) => {
                  const option = recipientOptions.find(opt => opt.value === recipient)
                  return (
                    <li key={recipient}>• {option?.label}</li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 mt-8">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover: focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !subject.trim() || !message.trim() || recipients.length === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Notification'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default MicrositeNotificationModal