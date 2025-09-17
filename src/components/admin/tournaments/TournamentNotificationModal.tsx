import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { TournamentAdmin } from '../../../types/admin'
import { sendTournamentNotification } from '../../../store/slices/adminTournamentsSlice'
import {
  FiBell,
  FiUsers,
  FiMail,
  FiMessageSquare,
  FiX,
  FiSend,
  FiLoader,
  FiEye,
  FiCheck,
  FiFileText,
  FiInfo
} from 'react-icons/fi'

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
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div className="relative top-8 mx-auto p-0 w-full max-w-4xl min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="bg-white shadow-2xl rounded-3xl border border-gray-200 overflow-hidden w-full m-4 animate-modal-scale max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-700 px-8 py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center text-white mr-4">
                  <FiBell className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Send Tournament Notification</h3>
                  <p className="text-purple-100 font-medium">Communicate with tournament participants and organizers</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl flex items-center justify-center text-white transition-all duration-200 hover:scale-105"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-8">
            <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-100 border-2 border-blue-200 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white mr-3">
                  <FiInfo className="h-4 w-4" />
                </div>
                <h4 className="text-xl font-bold text-blue-900">Tournament: {tournament.name}</h4>
              </div>
              <p className="text-blue-700 font-medium bg-white rounded-xl p-4 border border-blue-200">Current participants: {tournament.total_participants}</p>
            </div>

            <div className="space-y-8">
              {/* Template Selection */}
              <div className="bg-gradient-to-r from-green-50 to-blue-100 rounded-2xl p-6 border border-green-200">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white mr-3">
                    <FiFileText className="h-4 w-4" />
                  </div>
                  <label className="text-lg font-bold text-gray-900">
                    Use Template (Optional)
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {templates.map((template, index) => (
                    <button
                      key={index}
                      onClick={() => handleTemplateSelect(template)}
                      className="text-left p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-green-300 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 transform hover:scale-105"
                    >
                      <div className="flex items-center mb-3">
                        <FiFileText className="h-5 w-5 text-green-500 mr-2" />
                        <div className="text-lg font-bold text-gray-900">{template.name}</div>
                      </div>
                      <div className="text-sm text-gray-600 font-medium">Click to use this template</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipients */}
              <div className="bg-gradient-to-r from-orange-50 to-red-100 rounded-2xl p-6 border border-orange-200">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-white mr-3">
                    <FiUsers className="h-4 w-4" />
                  </div>
                  <label className="text-lg font-bold text-gray-900">
                    Recipients *
                  </label>
                </div>
                <div className="space-y-3">
                  {recipientOptions.map((option) => (
                    <label key={option.value} className="flex items-start p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-orange-300 cursor-pointer transition-all duration-200 hover:shadow-lg">
                      <input
                        type="checkbox"
                        checked={recipients.includes(option.value)}
                        onChange={(e) => handleRecipientChange(option.value, e.target.checked)}
                        className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-2 border-gray-300 rounded mt-0.5"
                      />
                      <div className="ml-4">
                        <div className="text-lg font-bold text-gray-900 flex items-center">
                          <FiUsers className="h-4 w-4 mr-2 text-orange-500" />
                          {option.label}
                        </div>
                        <div className="text-sm text-gray-600 font-medium">{option.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Subject and Message */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Subject */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-100 rounded-2xl p-6 border border-blue-200">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white mr-3">
                      <FiMail className="h-4 w-4" />
                    </div>
                    <label className="text-lg font-bold text-gray-900">
                      Subject *
                    </label>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Enter notification subject"
                      className="w-full pl-12 rounded-2xl border-2 border-gray-300 px-4 py-4 text-lg font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 bg-white hover:border-gray-400"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-100 rounded-2xl p-6 border border-yellow-200">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center text-white mr-3">
                      <FiMessageSquare className="h-4 w-4" />
                    </div>
                    <label className="text-lg font-bold text-gray-900">
                      Message *
                    </label>
                  </div>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    placeholder="Enter your message here..."
                    className="w-full rounded-2xl border-2 border-gray-300 px-4 py-4 text-lg font-medium focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 focus:ring-opacity-50 transition-all duration-200 bg-white hover:border-gray-400 resize-none"
                  />
                  <p className="text-sm text-yellow-700 mt-3 font-bold bg-white rounded-xl p-3 border border-yellow-200">
                    Available variables: <span className="font-mono">{'{tournamentName}'}</span>, <span className="font-mono">{'{startDate}'}</span>, <span className="font-mono">{'{location}'}</span>
                  </p>
                </div>
              </div>

              {/* Preview */}
              {(subject || message) && (
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center text-white mr-3">
                      <FiEye className="h-4 w-4" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">Preview</h4>
                  </div>
                  <div className="space-y-4">
                    {subject && (
                      <div className="bg-white rounded-xl p-4 border border-gray-200">
                        <span className="text-sm font-bold text-gray-600 flex items-center mb-2">
                          <FiMail className="h-4 w-4 mr-2" />
                          Subject:
                        </span>
                        <p className="text-lg font-bold text-gray-900">{subject}</p>
                      </div>
                    )}
                    {message && (
                      <div className="bg-white rounded-xl p-4 border border-gray-200">
                        <span className="text-sm font-bold text-gray-600 flex items-center mb-2">
                          <FiMessageSquare className="h-4 w-4 mr-2" />
                          Message:
                        </span>
                        <div className="text-lg text-gray-900 whitespace-pre-wrap font-medium">
                          {message}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Recipients Summary */}
              {recipients.length > 0 && (
                <div className="bg-gradient-to-r from-purple-50 to-indigo-100 border-2 border-purple-200 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white mr-3">
                      <FiCheck className="h-4 w-4" />
                    </div>
                    <h4 className="text-lg font-bold text-purple-900">
                      Notification will be sent to:
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {recipients.map((recipient) => {
                      const option = recipientOptions.find(opt => opt.value === recipient)
                      return (
                        <div key={recipient} className="flex items-center p-3 bg-white rounded-xl border border-purple-200">
                          <FiCheck className="h-4 w-4 text-purple-500 mr-3" />
                          <span className="text-lg font-bold text-purple-800">{option?.label}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4 mt-8 bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-t border-gray-200">
              <button
                onClick={onClose}
                disabled={loading}
                className="inline-flex items-center px-8 py-4 text-lg font-bold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <FiX className="mr-2 h-5 w-5" />
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !subject.trim() || !message.trim() || recipients.length === 0}
                className="inline-flex items-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 border-2 border-transparent rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin mr-2 h-5 w-5" />
                    Sending...
                  </>
                ) : (
                  <>
                    <FiSend className="mr-2 h-5 w-5" />
                    Send Notification
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TournamentNotificationModal