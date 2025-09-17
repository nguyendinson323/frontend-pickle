import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import { setMicrositeFilter, fetchMicrosites } from '../../../store/slices/adminMicrositesSlice'
import {
  FiFilter,
  FiSearch,
  FiUsers,
  FiCheckCircle,
  FiUser,
  FiCalendar,
  FiEye,
  FiFileText,
  FiChevronDown,
  FiRotateCcw,
  FiPlay
} from 'react-icons/fi'

const MicrositeFilters: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { micrositeFilter } = useSelector((state: RootState) => state.adminMicrosites)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleFilterChange = (field: string, value: string) => {
    dispatch(setMicrositeFilter({ [field]: value }))
  }

  const handleSearch = () => {
    dispatch(fetchMicrosites(micrositeFilter))
  }

  const handleReset = () => {
    const resetFilter = {
      type: '',
      status: '',
      owner: '',
      searchTerm: '',
      dateFrom: '',
      dateTo: '',
      visibilityStatus: '',
      contentStatus: ''
    }
    dispatch(setMicrositeFilter(resetFilter))
    dispatch(fetchMicrosites(resetFilter))
  }

  return (
    <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden mb-6">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white mr-3">
              <FiFilter className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Microsite Filters</h3>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center px-4 py-2 bg-white border-2 border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 hover:shadow-md transition-all duration-200 transform hover:scale-105"
          >
            {isExpanded ? 'Collapse Filters' : 'Expand Filters'}
            <FiChevronDown className={`ml-2 h-4 w-4 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Search */}
          <div className="relative">
            <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
              <FiSearch className="mr-2 h-4 w-4" />
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Site title, domain, description..."
                value={micrositeFilter.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                className="w-full pl-10 border-2 border-gray-300 rounded-2xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 px-4 py-3 text-sm hover:border-gray-400"
              />
            </div>
          </div>

          {/* Owner Type */}
          <div className="relative">
            <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
              <FiUsers className="mr-2 h-4 w-4" />
              Owner Type
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUsers className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={micrositeFilter.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full pl-10 border-2 border-gray-300 rounded-2xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 px-4 py-3 text-sm hover:border-gray-400 appearance-none bg-white cursor-pointer"
              >
                <option value="">All Types</option>
                <option value="club">🏓 Club</option>
                <option value="partner">🤝 Partner</option>
                <option value="state">🏛️ State Committee</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <FiChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="relative">
            <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
              <FiCheckCircle className="mr-2 h-4 w-4" />
              Status
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCheckCircle className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={micrositeFilter.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full pl-10 border-2 border-gray-300 rounded-2xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 px-4 py-3 text-sm hover:border-gray-400 appearance-none bg-white cursor-pointer"
              >
                <option value="">All Statuses</option>
                <option value="active">✅ Active</option>
                <option value="inactive">⭕ Inactive</option>
                <option value="suspended">🚫 Suspended</option>
                <option value="pending">⏳ Pending</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <FiChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Owner */}
          <div className="relative">
            <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
              <FiUser className="mr-2 h-4 w-4" />
              Owner
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Owner name..."
                value={micrositeFilter.owner}
                onChange={(e) => handleFilterChange('owner', e.target.value)}
                className="w-full pl-10 border-2 border-gray-300 rounded-2xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 px-4 py-3 text-sm hover:border-gray-400"
              />
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t-2 border-gray-200 mb-6">
            {/* Created From */}
            <div className="relative">
              <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
                <FiCalendar className="mr-2 h-4 w-4" />
                Created From
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  value={micrositeFilter.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="w-full pl-10 border-2 border-gray-300 rounded-2xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 px-4 py-3 text-sm hover:border-gray-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Created To */}
            <div className="relative">
              <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
                <FiCalendar className="mr-2 h-4 w-4" />
                Created To
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  value={micrositeFilter.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="w-full pl-10 border-2 border-gray-300 rounded-2xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 px-4 py-3 text-sm hover:border-gray-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Visibility Status */}
            <div className="relative">
              <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
                <FiEye className="mr-2 h-4 w-4" />
                Visibility Status
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiEye className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={micrositeFilter.visibilityStatus}
                  onChange={(e) => handleFilterChange('visibilityStatus', e.target.value)}
                  className="w-full pl-10 border-2 border-gray-300 rounded-2xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 px-4 py-3 text-sm hover:border-gray-400 appearance-none bg-white cursor-pointer"
                >
                  <option value="">All Visibility</option>
                  <option value="public">🌍 Public</option>
                  <option value="private">🔒 Private</option>
                  <option value="restricted">⚠️ Restricted</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FiChevronDown className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Content Status */}
            <div className="relative">
              <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
                <FiFileText className="mr-2 h-4 w-4" />
                Content Status
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiFileText className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={micrositeFilter.contentStatus}
                  onChange={(e) => handleFilterChange('contentStatus', e.target.value)}
                  className="w-full pl-10 border-2 border-gray-300 rounded-2xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 px-4 py-3 text-sm hover:border-gray-400 appearance-none bg-white cursor-pointer"
                >
                  <option value="">All Content</option>
                  <option value="clean">✨ Clean</option>
                  <option value="flagged">🚩 Flagged Content</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FiChevronDown className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t-2 border-gray-200">
          <button
            onClick={handleReset}
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <FiRotateCcw className="mr-2 h-4 w-4" />
            Reset Filters
          </button>
          <button
            onClick={handleSearch}
            className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <FiPlay className="mr-2 h-4 w-4" />
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  )
}

export default MicrositeFilters