import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import { setMessageFilter } from '../../../store/slices/adminMessagingSlice'

const MessageFilters: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { messageFilter } = useSelector((state: RootState) => state.adminMessaging)

  const handleFilterChange = (field: string, value: string) => {
    dispatch(setMessageFilter({ [field]: value }))
  }

  const handleClearFilters = () => {
    dispatch(setMessageFilter({
      recipientType: '',
      status: '',
      dateFrom: '',
      dateTo: '',
      searchTerm: ''
    }))
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Message Filters</h3>
        <button
          onClick={handleClearFilters}
          className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          Clear Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search Term */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search Messages
          </label>
          <input
            type="text"
            id="search"
            value={messageFilter.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            placeholder="Subject or content"
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        {/* Recipient Type Filter */}
        <div>
          <label htmlFor="recipientType" className="block text-sm font-medium text-gray-700 mb-1">
            Recipients
          </label>
          <select
            id="recipientType"
            value={messageFilter.recipientType}
            onChange={(e) => handleFilterChange('recipientType', e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">All Recipients</option>
            <option value="all">All Users</option>
            <option value="players">Players</option>
            <option value="coaches">Coaches</option>
            <option value="clubs">Clubs</option>
            <option value="partners">Partners</option>
            <option value="states">State Committees</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            value={messageFilter.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">All Status</option>
            <option value="sent">Sent</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* Date From Filter */}
        <div>
          <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700 mb-1">
            From Date
          </label>
          <input
            type="date"
            id="dateFrom"
            value={messageFilter.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        {/* Date To Filter */}
        <div>
          <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700 mb-1">
            To Date
          </label>
          <input
            type="date"
            id="dateTo"
            value={messageFilter.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
      </div>
    </div>
  )
}

export default MessageFilters