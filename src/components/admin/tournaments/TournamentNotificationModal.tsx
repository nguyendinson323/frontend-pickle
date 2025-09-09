import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { TournamentAdmin } from '../../../types/admin'
import { sendTournamentNotification } from '../../../store/slices/adminTournamentsSlice'

interface TournamentNotificationModalProps {
  tournament: TournamentAdmin
  onClose: () => void
}

const TournamentNotificationModal: React.FC<TournamentNotificationModalProps> = ({ tournament, onClose }) => {
  const dispatch = useDispatch()
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [recipients, setRecipients] = useState<string[]>(['participants'])
  const [loading, setLoading] = useState(false)

  const recipientOptions = [
    { value: 'participants', label: 'All Participants', description: 'Send to all registered participants' },
    { value: 'confirmed', label: 'Confirmed Participants', description: 'Send only to confirmed participants' },
    { value: 'organizer', label: 'Tournament Organizer', description: 'Send to the tournament organizer' },
    { value: 'checked_in', label: 'Checked-in Participants', description: 'Send only to participants who have checked in' }
  ]

  const templates = [
    {
      name: 'Tournament Reminder',
      subject: 'Reminder: {{tournamentName}} is coming up!',
      message: 'Hi there!\n\nThis is a friendly reminder that {{tournamentName}} is scheduled for {{startDate}} at {{location}}.\n\nPlease make sure to:\n- Arrive at least 30 minutes before your match\n- Bring your racket and proper attire\n- Check in at the registration desk\n\nWe look forward to seeing you there!\n\nBest regards,\nTournament Team'
    },
    {
      name: 'Tournament Update',
      subject: 'Important Update: {{tournamentName}}',
      message: 'Hello,\n\nWe have an important update regarding {{tournamentName}}:\n\n[Please add your update here]\n\nIf you have any questions, please contact us immediately.\n\nThank you for your understanding.\n\nBest regards,\nTournament Team'
    },
    {
      name: 'Tournament Cancellation',
      subject: 'CANCELLED: {{tournamentName}}',
      message: 'Dear Participants,\n\nWe regret to inform you that {{tournamentName}} scheduled for {{startDate}} has been cancelled due to unforeseen circumstances.\n\n[Please add cancellation reason here]\n\nRefunds will be processed within 5-7 business days.\n\nWe apologize for any inconvenience caused.\n\nSincerely,\nTournament Team'
    }
  ]

  const handleTemplateSelect = (template: typeof templates[0]) => {
    const processedSubject = template.subject
      .replace('{{tournamentName}}', tournament.name)
    
    const processedMessage = template.message
      .replace(/{{tournamentName}}/g, tournament.name)
      .replace('{{startDate}}', new Date(tournament.start_date).toLocaleDateString())
      .replace('{{location}}', tournament.location)

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
      await dispatch(sendTournamentNotification(tournament.id, subject, message, recipients) as any)
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
          <h3 className="text-lg font-bold text-gray-900">Send Tournament Notification</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900">Tournament: {tournament.name}</h4>
          <p className="text-sm text-blue-700">Current participants: {tournament.current_participants}</p>
        </div>

        <div className="space-y-6">
          {/* Template Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Use Template (Optional)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {templates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => handleTemplateSelect(template)}
                  className="text-left p-3 text-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              Available variables: {{tournamentName}}, {{startDate}}, {{location}}
            </p>
          </div>

          {/* Preview */}
          {(subject || message) && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
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
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
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

export default TournamentNotificationModal