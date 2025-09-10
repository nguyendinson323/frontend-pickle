import React from 'react'
import { useNavigate } from 'react-router-dom'

export const PartnerInboxTab: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Inbox</h3>
        <button
          onClick={() => navigate('/partner/inbox')}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Open Full Inbox
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h4 className="text-lg font-medium text-blue-900 mb-2">Message Center</h4>
        <p className="text-blue-700 mb-4">
          Receive announcements from the federation, clubs, and other partners. 
          Stay updated with important notifications and communications.
        </p>
        <div className="space-y-2 text-sm text-blue-600">
          <p>• Federation announcements and updates</p>
          <p>• Club communications and partnerships</p>
          <p>• Tournament and event notifications</p>
          <p>• System alerts and reminders</p>
        </div>
        <button
          onClick={() => navigate('/partner/inbox')}
          className="mt-6 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.476L3 21l2.476-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
          </svg>
          View All Messages
        </button>
      </div>
    </div>
  )
}