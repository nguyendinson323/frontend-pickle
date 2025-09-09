import React from 'react'
import { StateInboxStats } from '../../../store/slices/stateInboxSlice'

interface InboxHeaderProps {
  stats: StateInboxStats | null
  onComposeMessage: () => void
  onComposeAnnouncement: () => void
}

const InboxHeader: React.FC<InboxHeaderProps> = ({ stats, onComposeMessage, onComposeAnnouncement }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">State Inbox</h1>
          <p className="text-gray-600 mt-1">Manage communications with players, clubs, partners, and coaches in your state</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onComposeMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Compose Message
          </button>
          <button
            onClick={onComposeAnnouncement}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            Send Announcement
          </button>
        </div>
      </div>
      
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.total_messages}</div>
            <div className="text-sm text-gray-600">Total Messages</div>
            <div className="text-xs text-gray-500 mt-1">{stats.unread_messages} unread</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.announcements_sent}</div>
            <div className="text-sm text-gray-600">Announcements Sent</div>
            <div className="text-xs text-gray-500 mt-1">This month</div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{stats.total_recipients_reached}</div>
            <div className="text-sm text-gray-600">Recipients Reached</div>
            <div className="text-xs text-gray-500 mt-1">All time</div>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{stats.recent_activity}</div>
            <div className="text-sm text-gray-600">Recent Activity</div>
            <div className="text-xs text-gray-500 mt-1">Last 7 days</div>
          </div>
          
          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-indigo-600">{stats.unread_messages > 0 ? 'Active' : 'Clear'}</div>
            <div className="text-sm text-gray-600">Inbox Status</div>
            <div className="text-xs text-gray-500 mt-1">Message queue</div>
          </div>
        </div>
      )}

      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex">
          <svg className="flex-shrink-0 h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Communication Guidelines
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
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