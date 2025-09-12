import React from 'react'

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
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-6">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Partner Inbox</h1>
            <p className="text-gray-600 mt-1">
              {totalMessages} total messages • {unreadMessages} unread
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search messages..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              {messageTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From
            </label>
            <select
              value={filterSender}
              onChange={(e) => setFilterSender(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              {senderRoles.map(role => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filterRead}
              onChange={(e) => setFilterRead(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InboxHeader