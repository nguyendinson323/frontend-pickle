import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import { setUserFilter, exportUsers } from '../../../store/slices/adminUserManagementSlice'

const UserFilters: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { userFilter, exportLoading } = useSelector((state: RootState) => state.adminUserManagement)

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
    <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        <button
          onClick={handleClearFilters}
          className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          Clear Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
        {/* Search Term */}
        <div className="col-span-1 md:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search Users
          </label>
          <input
            type="text"
            id="search"
            value={userFilter.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            placeholder="Username, email, or phone"
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        {/* Role Filter */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select
            id="role"
            value={userFilter.role}
            onChange={(e) => handleFilterChange('role', e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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

        {/* Status Filter */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            value={userFilter.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        {/* State Filter */}
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
            State
          </label>
          <input
            type="text"
            id="state"
            value={userFilter.state}
            onChange={(e) => handleFilterChange('state', e.target.value)}
            placeholder="State name"
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        {/* Affiliation Filter */}
        <div>
          <label htmlFor="affiliation" className="block text-sm font-medium text-gray-700 mb-1">
            Affiliation
          </label>
          <select
            id="affiliation"
            value={userFilter.affiliation}
            onChange={(e) => handleFilterChange('affiliation', e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">All Affiliations</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Date Range Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700 mb-1">
            Registration From
          </label>
          <input
            type="date"
            id="dateFrom"
            value={userFilter.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700 mb-1">
            Registration To
          </label>
          <input
            type="date"
            id="dateTo"
            value={userFilter.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
      </div>

      {/* Export Actions */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Export filtered results:
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleExport('csv')}
            disabled={exportLoading}
            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {exportLoading ? 'Exporting...' : 'CSV'}
          </button>
          <button
            onClick={() => handleExport('excel')}
            disabled={exportLoading}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {exportLoading ? 'Exporting...' : 'Excel'}
          </button>
          <button
            onClick={() => handleExport('pdf')}
            disabled={exportLoading}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {exportLoading ? 'Exporting...' : 'PDF'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserFilters