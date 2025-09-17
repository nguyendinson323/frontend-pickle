import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import { setUserFilter, exportUsers, fetchStates } from '../../../store/slices/adminUserManagementSlice'
import {
  FiSearch,
  FiFilter,
  FiUsers,
  FiShield,
  FiMapPin,
  FiLink,
  FiCalendar,
  FiDownload,
  FiFileText,
  FiX,
  FiLoader
} from 'react-icons/fi'

const UserFilters: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { userFilter, exportLoading, states } = useSelector((state: RootState) => state.adminUserManagement)

  useEffect(() => {
    dispatch(fetchStates())
  }, [dispatch])

  const handleFilterChange = (field: string, value: string) => {
    dispatch(setUserFilter({ [field]: value }))
  }

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    dispatch(exportUsers(userFilter, format))
  }

  const handleClearFilters = () => {
    dispatch(setUserFilter({
      role: '',
      status: '',
      state: '',
      affiliation: '',
      searchTerm: '',
      dateFrom: '',
      dateTo: ''
    }))
  }

  return (
    <div className="bg-white shadow-2xl rounded-3xl border border-gray-200 p-8 mb-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white mr-4">
            <FiFilter className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Advanced Filters</h3>
            <p className="text-gray-600 font-medium">Refine your search to find specific users</p>
          </div>
        </div>
        <button
          onClick={handleClearFilters}
          className="inline-flex items-center px-6 py-3 text-lg font-bold text-red-700 bg-white border-2 border-red-300 rounded-xl hover:bg-red-50 hover:border-red-400 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <FiX className="mr-2 h-5 w-5" />
          Clear Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-8">
        {/* Search Term */}
        <div className="col-span-1 md:col-span-2">
          <label htmlFor="search" className="block text-lg font-bold text-gray-900 mb-3 flex items-center">
            <FiSearch className="h-5 w-5 mr-2" />
            Search Users
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="search"
              value={userFilter.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              placeholder="Username, email, or phone"
              className="w-full pl-12 rounded-2xl border-2 border-gray-300 px-4 py-4 text-lg font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 bg-white hover:border-gray-400"
            />
          </div>
        </div>

        {/* Role Filter */}
        <div>
          <label htmlFor="role" className="block text-lg font-bold text-gray-900 mb-3 flex items-center">
            <FiUsers className="h-5 w-5 mr-2" />
            Role
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUsers className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="role"
              value={userFilter.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className="w-full pl-12 rounded-2xl border-2 border-gray-300 px-4 py-4 text-lg font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 bg-white hover:border-gray-400"
            >
              <option value="">All Roles</option>
              <option value="player">Player</option>
              <option value="coach">Coach</option>
              <option value="club">Club</option>
              <option value="partner">Partner</option>
              <option value="state">State</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label htmlFor="status" className="block text-lg font-bold text-gray-900 mb-3 flex items-center">
            <FiShield className="h-5 w-5 mr-2" />
            Status
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiShield className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="status"
              value={userFilter.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full pl-12 rounded-2xl border-2 border-gray-300 px-4 py-4 text-lg font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 bg-white hover:border-gray-400"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* State Filter */}
        <div>
          <label htmlFor="state" className="block text-lg font-bold text-gray-900 mb-3 flex items-center">
            <FiMapPin className="h-5 w-5 mr-2" />
            State
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMapPin className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="state"
              value={userFilter.state}
              onChange={(e) => handleFilterChange('state', e.target.value)}
              className="w-full pl-12 rounded-2xl border-2 border-gray-300 px-4 py-4 text-lg font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 bg-white hover:border-gray-400"
            >
              <option value="">All States</option>
              {states.map((state) => (
                <option key={state.id} value={state.id.toString()}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Affiliation Filter */}
        <div>
          <label htmlFor="affiliation" className="block text-lg font-bold text-gray-900 mb-3 flex items-center">
            <FiLink className="h-5 w-5 mr-2" />
            Affiliation
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLink className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="affiliation"
              value={userFilter.affiliation}
              onChange={(e) => handleFilterChange('affiliation', e.target.value)}
              className="w-full pl-12 rounded-2xl border-2 border-gray-300 px-4 py-4 text-lg font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 bg-white hover:border-gray-400"
            >
              <option value="">All Affiliations</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Date Range Filters */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 mb-8 border-2 border-gray-200">
        <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <FiCalendar className="h-5 w-5 mr-2" />
          Registration Date Range
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label htmlFor="dateFrom" className="block text-lg font-bold text-gray-900 mb-3 flex items-center">
              <FiCalendar className="h-5 w-5 mr-2" />
              From Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                id="dateFrom"
                value={userFilter.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full pl-12 rounded-2xl border-2 border-gray-300 px-4 py-4 text-lg font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 bg-white hover:border-gray-400"
              />
            </div>
          </div>

          <div>
            <label htmlFor="dateTo" className="block text-lg font-bold text-gray-900 mb-3 flex items-center">
              <FiCalendar className="h-5 w-5 mr-2" />
              To Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                id="dateTo"
                value={userFilter.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-full pl-12 rounded-2xl border-2 border-gray-300 px-4 py-4 text-lg font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 bg-white hover:border-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Export Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl p-6 border-2 border-blue-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white mr-4">
              <FiDownload className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900">Export Filtered Results</h4>
              <p className="text-gray-600 font-medium">Download user data in your preferred format</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => handleExport('csv')}
              disabled={exportLoading}
              className="inline-flex items-center px-6 py-3 text-lg font-bold text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {exportLoading ? (
                <>
                  <FiLoader className="animate-spin mr-2 h-5 w-5" />
                  Exporting...
                </>
              ) : (
                <>
                  <FiFileText className="mr-2 h-5 w-5" />
                  CSV
                </>
              )}
            </button>
            <button
              onClick={() => handleExport('excel')}
              disabled={exportLoading}
              className="inline-flex items-center px-6 py-3 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {exportLoading ? (
                <>
                  <FiLoader className="animate-spin mr-2 h-5 w-5" />
                  Exporting...
                </>
              ) : (
                <>
                  <FiFileText className="mr-2 h-5 w-5" />
                  Excel
                </>
              )}
            </button>
            <button
              onClick={() => handleExport('pdf')}
              disabled={exportLoading}
              className="inline-flex items-center px-6 py-3 text-lg font-bold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {exportLoading ? (
                <>
                  <FiLoader className="animate-spin mr-2 h-5 w-5" />
                  Exporting...
                </>
              ) : (
                <>
                  <FiFileText className="mr-2 h-5 w-5" />
                  PDF
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserFilters