import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import { setCourtFilter, exportCourts } from '../../../store/slices/adminCourtsSlice'
import {
  FiSearch,
  FiMapPin,
  FiUser,
  FiActivity,
  FiLayers,
  FiSun,
  FiHome,
  FiDollarSign,
  FiRefreshCw,
  FiDownload,
  FiFileText,
  FiGrid,
  FiFile
} from 'react-icons/fi'

const CourtFilters: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { courtFilter, loading } = useSelector((state: RootState) => state.adminCourts)

  const handleFilterChange = (field: string, value: string) => {
    dispatch(setCourtFilter({ [field]: value }))
  }

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    dispatch(exportCourts(courtFilter, format))
  }

  const handleClearFilters = () => {
    dispatch(setCourtFilter({
      location: '',
      owner: '',
      status: '',
      surface: '',
      lighting: '',
      indoor: '',
      searchTerm: '',
      minRate: '',
      maxRate: ''
    }))
  }

  return (
    <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden mb-8">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Court Filters</h3>
            <p className="text-sm text-gray-600 mt-1">Filter and search courts by various criteria</p>
          </div>
          <button
            onClick={handleClearFilters}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-indigo-600 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
          >
            <FiRefreshCw className="mr-2 h-4 w-4" />
            Clear Filters
          </button>
        </div>
      </div>
      <div className="p-6">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          {/* Search Term */}
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <FiSearch className="mr-2 h-4 w-4 text-gray-500" />
              Search Courts
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="search"
                value={courtFilter.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                placeholder="Court name or location"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 hover:border-gray-400"
              />
            </div>
          </div>

          {/* Location Filter */}
          <div>
            <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <FiMapPin className="mr-2 h-4 w-4 text-gray-500" />
              Location
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="location"
                value={courtFilter.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                placeholder="City or state"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 hover:border-gray-400"
              />
            </div>
          </div>

          {/* Owner Filter */}
          <div>
            <label htmlFor="owner" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <FiUser className="mr-2 h-4 w-4 text-gray-500" />
              Owner
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="owner"
                value={courtFilter.owner}
                onChange={(e) => handleFilterChange('owner', e.target.value)}
                placeholder="Club or partner name"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 hover:border-gray-400"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <FiActivity className="mr-2 h-4 w-4 text-gray-500" />
              Status
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiActivity className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="status"
                value={courtFilter.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full pl-10 pr-8 py-3 border border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 appearance-none bg-white cursor-pointer hover:border-gray-400"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Second Row of Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* Surface Filter */}
          <div>
            <label htmlFor="surface" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <FiLayers className="mr-2 h-4 w-4 text-gray-500" />
              Surface
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLayers className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="surface"
                value={courtFilter.surface}
                onChange={(e) => handleFilterChange('surface', e.target.value)}
                className="w-full pl-10 pr-8 py-3 border border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 appearance-none bg-white cursor-pointer hover:border-gray-400"
              >
                <option value="">All Surfaces</option>
                <option value="hard">Hard Court</option>
                <option value="clay">Clay</option>
                <option value="grass">Grass</option>
                <option value="artificial">Artificial</option>
              </select>
            </div>
          </div>

          {/* Lighting Filter */}
          <div>
            <label htmlFor="lighting" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <FiSun className="mr-2 h-4 w-4 text-gray-500" />
              Lighting
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSun className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="lighting"
                value={courtFilter.lighting}
                onChange={(e) => handleFilterChange('lighting', e.target.value)}
                className="w-full pl-10 pr-8 py-3 border border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 appearance-none bg-white cursor-pointer hover:border-gray-400"
              >
                <option value="">Any</option>
                <option value="true">With Lights</option>
                <option value="false">No Lights</option>
              </select>
            </div>
          </div>

          {/* Indoor Filter */}
          <div>
            <label htmlFor="indoor" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <FiHome className="mr-2 h-4 w-4 text-gray-500" />
              Indoor/Outdoor
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiHome className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="indoor"
                value={courtFilter.indoor}
                onChange={(e) => handleFilterChange('indoor', e.target.value)}
                className="w-full pl-10 pr-8 py-3 border border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 appearance-none bg-white cursor-pointer hover:border-gray-400"
              >
                <option value="">Any</option>
                <option value="true">Indoor</option>
                <option value="false">Outdoor</option>
              </select>
            </div>
          </div>

          {/* Min Rate Filter */}
          <div>
            <label htmlFor="minRate" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <FiDollarSign className="mr-2 h-4 w-4 text-gray-500" />
              Min Rate ($/hr)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiDollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                id="minRate"
                value={courtFilter.minRate}
                onChange={(e) => handleFilterChange('minRate', e.target.value)}
                placeholder="0"
                min="0"
                step="5"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 hover:border-gray-400"
              />
            </div>
          </div>

          {/* Max Rate Filter */}
          <div>
            <label htmlFor="maxRate" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <FiDollarSign className="mr-2 h-4 w-4 text-gray-500" />
              Max Rate ($/hr)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiDollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                id="maxRate"
                value={courtFilter.maxRate}
                onChange={(e) => handleFilterChange('maxRate', e.target.value)}
                placeholder="200"
                min="0"
                step="5"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 hover:border-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Export Actions */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center">
              <FiDownload className="mr-3 h-5 w-5 text-gray-500" />
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Export Filtered Courts</h4>
                <p className="text-xs text-gray-600">Download your filtered court data in multiple formats</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => handleExport('csv')}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-medium rounded-xl hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
              >
                <FiFileText className="mr-2 h-4 w-4" />
                {loading ? 'Exporting...' : 'CSV'}
              </button>
              <button
                onClick={() => handleExport('excel')}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
              >
                <FiGrid className="mr-2 h-4 w-4" />
                {loading ? 'Exporting...' : 'Excel'}
              </button>
              <button
                onClick={() => handleExport('pdf')}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium rounded-xl hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
              >
                <FiFile className="mr-2 h-4 w-4" />
                {loading ? 'Exporting...' : 'PDF'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourtFilters