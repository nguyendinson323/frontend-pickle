import React from 'react'
import { PartnerInboxStats } from '../../../store/slices/partnerInboxSlice'
import {
  FiMail,
  FiEye,
  FiClock,
  FiTag
} from 'react-icons/fi'

interface InboxStatsCardProps {
  stats: PartnerInboxStats | null
}

const InboxStatsCard: React.FC<InboxStatsCardProps> = ({ stats }) => {
  if (!stats) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 shadow-md">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg">
          <FiMail className="w-8 h-8" />
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">{stats.total_messages}</div>
        <div className="text-sm font-bold text-blue-700">Total Messages</div>
      </div>

      <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 shadow-md">
        <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-pink-700 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg">
          <FiEye className="w-8 h-8" />
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">{stats.unread_messages}</div>
        <div className="text-sm font-bold text-red-700">Unread Messages</div>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 shadow-md">
        <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg">
          <FiClock className="w-8 h-8" />
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">{stats.recent_activity}</div>
        <div className="text-sm font-bold text-green-700">Recent Activity</div>
        <div className="text-xs font-medium text-green-600 mt-1">Last 7 days</div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 shadow-md">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <FiTag className="w-8 h-8" />
          </div>
        </div>
        <div className="text-center mb-4">
          <div className="text-lg font-bold text-purple-700">By Type</div>
        </div>
        <div className="space-y-2">
          {Object.entries(stats.messages_by_type).map(([type, count]) => (
            <div key={type} className="flex justify-between items-center p-2 bg-white bg-opacity-50 rounded-lg">
              <span className="text-sm font-medium text-purple-800">{type}</span>
              <span className="text-sm font-bold text-purple-900 bg-purple-200 px-2 py-1 rounded-full">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default InboxStatsCard