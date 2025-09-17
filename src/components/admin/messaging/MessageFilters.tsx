import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import { setMessageFilter } from '../../../store/slices/adminMessagingSlice'
import {
  FiFilter,
  FiSearch,
  FiUsers,
  FiCheckCircle,
  FiCalendar,
  FiRotateCcw,
  FiUser,
  FiAward,
  FiMapPin,
  FiSettings
} from 'react-icons/fi'

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
    <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden mb-6">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white mr-3">
              <FiFilter className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Message Filters</h3>
          </div>
          <button
            onClick={handleClearFilters}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white text-sm font-medium rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <FiRotateCcw className="mr-2 h-4 w-4" />
            Clear Filters
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Search Term */}
          <div className="relative">
            <label htmlFor="search" className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
              <FiSearch className="mr-2 h-4 w-4" />
              Search Messages
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="search"
                value={messageFilter.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                placeholder="Subject or content..."
                className="w-full pl-10 border-2 border-gray-300 rounded-2xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 px-4 py-3 text-sm hover:border-gray-400"
              />
            </div>
          </div>

          {/* Recipient Type Filter */}
          <div className="relative">
            <label htmlFor="recipientType" className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
              <FiUsers className="mr-2 h-4 w-4" />
              Recipients
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUsers className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="recipientType"
                value={messageFilter.recipientType}
                onChange={(e) => handleFilterChange('recipientType', e.target.value)}
                className="w-full pl-10 border-2 border-gray-300 rounded-2xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 px-4 py-3 text-sm hover:border-gray-400 appearance-none bg-white cursor-pointer"
              >
                <option value="">All Recipients</option>
                <option value="all">👥 All Users</option>
                <option value="players">🏓 Players</option>
                <option value="coaches">🏆 Coaches</option>
                <option value="clubs">🏢 Clubs</option>
                <option value="partners">🤝 Partners</option>
                <option value="states">📍 State Committees</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <label htmlFor="status" className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
              <FiCheckCircle className="mr-2 h-4 w-4" />
              Status
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCheckCircle className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="status"
                value={messageFilter.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full pl-10 border-2 border-gray-300 rounded-2xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 px-4 py-3 text-sm hover:border-gray-400 appearance-none bg-white cursor-pointer"
              >
                <option value="">All Status</option>
                <option value="sent">✅ Sent</option>
                <option value="failed">❌ Failed</option>
                <option value="pending">⏳ Pending</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Date From Filter */}
          <div className="relative">
            <label htmlFor="dateFrom" className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
              <FiCalendar className="mr-2 h-4 w-4" />
              From Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                id="dateFrom"
                value={messageFilter.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full pl-10 border-2 border-gray-300 rounded-2xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 px-4 py-3 text-sm hover:border-gray-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Date To Filter */}
          <div className="relative">
            <label htmlFor="dateTo" className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
              <FiCalendar className="mr-2 h-4 w-4" />
              To Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                id="dateTo"
                value={messageFilter.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-full pl-10 border-2 border-gray-300 rounded-2xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 px-4 py-3 text-sm hover:border-gray-400 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessageFilters