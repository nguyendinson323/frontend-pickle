import React from 'react'
import { User } from '../../../types/auth'

interface CoachInboxTabProps {
  user: User
}

const CoachInboxTab: React.FC<CoachInboxTabProps> = ({ user }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Inbox & Notifications</h3>
        <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
          Mark All as Read
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button className="border-b-2 border-green-500 text-green-600 py-2 px-1 font-medium text-sm">
            All Messages
          </button>
          <button className="border-transparent text-gray-500 hover:text-gray-700 border-b-2 py-2 px-1 font-medium text-sm">
            Unread
          </button>
          <button className="border-transparent text-gray-500 hover:text-gray-700 border-b-2 py-2 px-1 font-medium text-sm">
            Announcements
          </button>
          <button className="border-transparent text-gray-500 hover:text-gray-700 border-b-2 py-2 px-1 font-medium text-sm">
            System
          </button>
        </nav>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {/* Sample Message 1 */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600">📢</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Federation Announcement</h4>
                <p className="text-sm text-gray-600 mt-1">
                  New coaching certification program now available for Level 4+ coaches...
                </p>
                <p className="text-xs text-gray-500 mt-2">Mexican Pickleball Federation • 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <button className="text-gray-400 hover:text-gray-600">
                <span className="sr-only">More options</span>⋯
              </button>
            </div>
          </div>
        </div>

        {/* Sample Message 2 */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600">💰</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Payment Received</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Payment of $45.00 received for coaching session with Maria Rodriguez
                </p>
                <p className="text-xs text-gray-500 mt-2">Payment System • 1 day ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="text-gray-400 hover:text-gray-600">
                <span className="sr-only">More options</span>⋯
              </button>
            </div>
          </div>
        </div>

        {/* Sample Message 3 */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600">👥</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">New Student Request</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Carlos Martinez has requested coaching sessions. Level 2.5 player looking to improve.
                </p>
                <p className="text-xs text-gray-500 mt-2">Student Portal • 2 days ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <button className="text-gray-400 hover:text-gray-600">
                <span className="sr-only">More options</span>⋯
              </button>
            </div>
          </div>
        </div>

        {/* Sample Message 4 */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600">⚠️</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Affiliation Renewal Reminder</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Your coaching affiliation expires in 30 days. Please renew to maintain active status.
                </p>
                <p className="text-xs text-gray-500 mt-2">Member Services • 3 days ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <button className="text-gray-400 hover:text-gray-600">
                <span className="sr-only">More options</span>⋯
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Load More */}
      <div className="text-center">
        <button className="text-green-600 hover:text-green-700 font-medium">
          Load More Messages
        </button>
      </div>

      {/* Notification Settings */}
      <div className="bg-gray-50 rounded-lg p-6 mt-8">
        <h4 className="font-semibold text-gray-900 mb-4">Notification Preferences</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Email notifications</span>
            <input type="checkbox" className="toggle" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Student booking notifications</span>
            <input type="checkbox" className="toggle" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Payment notifications</span>
            <input type="checkbox" className="toggle" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Federation announcements</span>
            <input type="checkbox" className="toggle" defaultChecked />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoachInboxTab