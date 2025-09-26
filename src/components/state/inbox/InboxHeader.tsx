import React from 'react'
import { StateInboxStats } from '../../../store/slices/stateInboxSlice'
import { FiMail, FiSend, FiUsers, FiActivity, FiInbox, FiAlertTriangle } from 'react-icons/fi'

interface InboxHeaderProps {
  stats: StateInboxStats | null
  onComposeMessage: () => void
  onComposeAnnouncement: () => void
}

const InboxHeader: React.FC<InboxHeaderProps> = ({ stats, onComposeMessage, onComposeAnnouncement }) => {
  return (
    <div className="bg-gradient-to-r from-white via-blue-50 to-indigo-50 rounded-2xl shadow-xl border border-white/20 p-8 mb-8 backdrop-blur-lg">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-lg">
            <FiInbox className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">State Inbox</h1>
            <p className="text-gray-600 mt-2 text-lg">Manage communications with players, clubs, partners, and coaches in your state</p>
          </div>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={onComposeMessage}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl flex items-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-medium"
          >
            <FiMail className="w-5 h-5 mr-3" />
            Compose Message
          </button>
          <button
            onClick={onComposeAnnouncement}
            className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white px-6 py-3 rounded-xl flex items-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-medium"
          >
            <FiSend className="w-5 h-5 mr-3" />
            Send Announcement
          </button>
        </div>
      </div>
      
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <FiMail className="w-7 h-7 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
              <div className="text-3xl font-bold text-blue-700">{stats.total_messages}</div>
            </div>
            <div className="text-sm font-semibold text-blue-800">Total Messages</div>
            <div className="text-xs text-blue-600 mt-2 font-medium">{stats.unread_messages} unread</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-2xl shadow-lg border border-green-200/50 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <FiSend className="w-7 h-7 text-green-600 group-hover:scale-110 transition-transform duration-200" />
              <div className="text-3xl font-bold text-green-700">{stats.announcements_sent}</div>
            </div>
            <div className="text-sm font-semibold text-green-800">Announcements Sent</div>
            <div className="text-xs text-green-600 mt-2 font-medium">This month</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl shadow-lg border border-purple-200/50 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <FiUsers className="w-7 h-7 text-purple-600 group-hover:scale-110 transition-transform duration-200" />
              <div className="text-3xl font-bold text-purple-700">{stats.total_recipients_reached}</div>
            </div>
            <div className="text-sm font-semibold text-purple-800">Recipients Reached</div>
            <div className="text-xs text-purple-600 mt-2 font-medium">All time</div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl shadow-lg border border-orange-200/50 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <FiActivity className="w-7 h-7 text-orange-600 group-hover:scale-110 transition-transform duration-200" />
              <div className="text-3xl font-bold text-orange-700">{stats.recent_activity}</div>
            </div>
            <div className="text-sm font-semibold text-orange-800">Recent Activity</div>
            <div className="text-xs text-orange-600 mt-2 font-medium">Last 7 days</div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-2xl shadow-lg border border-indigo-200/50 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <FiInbox className="w-7 h-7 text-indigo-600 group-hover:scale-110 transition-transform duration-200" />
              <div className={`text-3xl font-bold ${stats.unread_messages > 0 ? 'text-red-700' : 'text-indigo-700'}`}>
                {stats.unread_messages > 0 ? 'Active' : 'Clear'}
              </div>
            </div>
            <div className="text-sm font-semibold text-indigo-800">Inbox Status</div>
            <div className="text-xs text-indigo-600 mt-2 font-medium">Message queue</div>
          </div>
        </div>
      )}

      <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border border-amber-200/50 rounded-2xl shadow-lg">
        <div className="flex items-start space-x-4">
          <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-3 rounded-xl shadow-lg">
            <FiAlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-amber-900 mb-2">
              Communication Guidelines
            </h3>
            <div className="text-amber-800 leading-relaxed">
              <p>
                Use direct messages for individual communications and announcements for broad state-wide notifications.
                All messages are logged and should maintain professional standards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InboxHeader