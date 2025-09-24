import React from 'react'
import {
  FiInbox,
  FiSearch,
  FiFilter,
  FiMail,
  FiUser,
  FiX
} from 'react-icons/fi'

interface InboxHeaderProps {
  totalMessages: number
  unreadMessages: number
  searchTerm: string
  setSearchTerm: (term: string) => void
  filterType: string
  setFilterType: (type: string) => void
  filterSender: string
  setFilterSender: (sender: string) => void
  filterRead: string
  setFilterRead: (read: string) => void
}

const InboxHeader: React.FC<InboxHeaderProps> = ({
  totalMessages,
  unreadMessages,
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  filterSender,
  setFilterSender,
  filterRead,
  setFilterRead
}) => {
  const messageTypes = [
    { value: '', label: 'All Types' },
    { value: 'Announcement', label: 'Announcements' },
    { value: 'Direct', label: 'Direct Messages' },
    { value: 'System', label: 'System Notifications' },
    { value: 'Tournament', label: 'Tournament Updates' }
  ]

  const senderRoles = [
    { value: '', label: 'All Senders' },
    { value: 'admin', label: 'Federation' },
    { value: 'state', label: 'State Committee' },
    { value: 'club', label: 'Clubs' },
    { value: 'player', label: 'Players' }
  ]

  const readStatus = [
    { value: '', label: 'All Messages' },
    { value: 'false', label: 'Unread Only' },
    { value: 'true', label: 'Read Only' }
  ]

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl mb-8 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center text-white">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mr-4">
              <FiInbox className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Partner Inbox</h1>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center">
                  <FiMail className="w-4 h-4 mr-1" />
                  <span className="text-blue-100 font-medium">{totalMessages} total messages</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                  <span className="text-orange-100 font-medium">{unreadMessages} unread</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mr-3">
            <FiFilter className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Filter Messages</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200">
            <div className="flex items-center mb-3">
              <FiSearch className="w-4 h-4 text-blue-600 mr-2" />
              <label className="block text-sm font-bold text-gray-700">
                Search
              </label>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search messages..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium text-gray-900 bg-gray-50 hover:bg-white transition-all duration-200 placeholder-gray-500 text-sm"
            />
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200">
            <div className="flex items-center mb-3">
              <FiMail className="w-4 h-4 text-green-600 mr-2" />
              <label className="block text-sm font-bold text-gray-700">
                Message Type
              </label>
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium text-gray-900 bg-gray-50 hover:bg-white transition-all duration-200 text-sm"
            >
              {messageTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200">
            <div className="flex items-center mb-3">
              <FiUser className="w-4 h-4 text-orange-600 mr-2" />
              <label className="block text-sm font-bold text-gray-700">
                From
              </label>
            </div>
            <select
              value={filterSender}
              onChange={(e) => setFilterSender(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium text-gray-900 bg-gray-50 hover:bg-white transition-all duration-200 text-sm"
            >
              {senderRoles.map(role => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200">
            <div className="flex items-center mb-3">
              <FiFilter className="w-4 h-4 text-purple-600 mr-2" />
              <label className="block text-sm font-bold text-gray-700">
                Status
              </label>
            </div>
            <select
              value={filterRead}
              onChange={(e) => setFilterRead(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium text-gray-900 bg-gray-50 hover:bg-white transition-all duration-200 text-sm"
            >
              {readStatus.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('')
                setFilterType('')
                setFilterSender('')
                setFilterRead('')
              }}
              className="w-full bg-gradient-to-r from-red-600 to-pink-700 hover:from-red-700 hover:to-pink-800 text-white font-bold py-3 px-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105 flex items-center justify-center text-sm"
            >
              <FiX className="w-4 h-4 mr-2" />
              Clear Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InboxHeader