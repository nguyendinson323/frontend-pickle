import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'

interface MessageForm {
  recipient_type: string
  state_id?: number
  subject: string
  content: string
  priority: string
  include_attachment: boolean
}

const Messaging: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { sentMessages, loading, error } = useSelector((state: RootState) => state.admin)
  
  const [messageForm, setMessageForm] = useState<MessageForm>({
    recipient_type: 'all',
    state_id: undefined,
    subject: '',
    content: '',
    priority: 'normal',
    include_attachment: false
  })

  const [showComposer, setShowComposer] = useState(false)

  const recipientTypes = [
    { value: 'all', label: 'All Users' },
    { value: 'players', label: 'All Players' },
    { value: 'coaches', label: 'All Coaches' },
    { value: 'clubs', label: 'All Clubs' },
    { value: 'partners', label: 'All Partners' },
    { value: 'states', label: 'State Committees' },
    { value: 'state_specific', label: 'Specific State' },
    { value: 'active_users', label: 'Active Users Only' },
    { value: 'premium_users', label: 'Premium Users Only' }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setMessageForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Dispatch send message action
    console.log('Sending message:', messageForm)
    
    // Reset form and close composer
    setMessageForm({
      recipient_type: 'all',
      state_id: undefined,
      subject: '',
      content: '',
      priority: 'normal',
      include_attachment: false
    })
    setShowComposer(false)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mass Messaging</h2>
          <p className="text-gray-600">Send announcements and messages to federation members</p>
        </div>
        <button
          onClick={() => setShowComposer(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <span>📝</span>
          <span>Compose Message</span>
        </button>
      </div>

      {/* Message Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-2xl text-blue-600">📧</div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{sentMessages.length}</div>
              <div className="text-sm text-gray-600">Messages Sent</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-2xl text-green-600">✅</div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {sentMessages.filter(m => m.status === 'delivered').length}
              </div>
              <div className="text-sm text-gray-600">Delivered</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-2xl text-yellow-600">📖</div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {sentMessages.filter(m => m.is_read).length}
              </div>
              <div className="text-sm text-gray-600">Read</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-2xl text-red-600">⚠️</div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {sentMessages.filter(m => m.priority === 'high').length}
              </div>
              <div className="text-sm text-gray-600">High Priority</div>
            </div>
          </div>
        </div>
      </div>

      {/* Message Composer Modal */}
      {showComposer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Compose Message</h3>
                <button
                  onClick={() => setShowComposer(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>

              <form onSubmit={handleSendMessage} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recipients
                  </label>
                  <select
                    name="recipient_type"
                    value={messageForm.recipient_type}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {recipientTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {messageForm.recipient_type === 'state_specific' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select State
                    </label>
                    <select
                      name="state_id"
                      value={messageForm.state_id || ''}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select a state...</option>
                      {/* States will be populated from Redux */}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={messageForm.priority}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low Priority</option>
                    <option value="normal">Normal Priority</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={messageForm.subject}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter message subject..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message Content
                  </label>
                  <textarea
                    name="content"
                    value={messageForm.content}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your message content..."
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="include_attachment"
                    checked={messageForm.include_attachment}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="text-sm text-gray-700">
                    Include attachment capability
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowComposer(false)}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Recent Messages */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Messages</h3>
        </div>
        
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Recipients
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sentMessages && sentMessages.length > 0 ? sentMessages.map((message) => (
              <tr key={message.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {message.subject}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {message.recipient_count} recipients
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    message.priority === 'high' || message.priority === 'urgent'
                      ? 'bg-red-100 text-red-800'
                      : message.priority === 'normal'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {message.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    message.status === 'delivered' 
                      ? 'bg-green-100 text-green-800'
                      : message.status === 'sending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {message.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(message.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                    View
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No messages sent yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Messaging