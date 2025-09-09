import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../store'
import { setCourtFilter, exportCourts } from '../../../store/slices/adminCourtsSlice'

const CourtFilters: React.FC = () => {
  const dispatch = useDispatch()
  const { courtFilter, loading } = useSelector((state: RootState) => state.adminCourts)

  const handleFilterChange = (field: string, value: string) => {
    dispatch(setCourtFilter({ [field]: value }))
  }

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    dispatch(exportCourts(courtFilter, format) as any)
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
    <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Court Filters</h3>
        <button
          onClick={handleClearFilters}
          className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          Clear Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
        {/* Search Term */}
        <div className="col-span-1 md:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search Courts
          </label>
          <input
            type="text"
            id="search"
            value={courtFilter.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            placeholder="Court name or location"
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        {/* Location Filter */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            id="location"
            value={courtFilter.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            placeholder="City or state"
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        {/* Owner Filter */}
        <div>
          <label htmlFor="owner" className="block text-sm font-medium text-gray-700 mb-1">
            Owner
          </label>
          <input
            type="text"
            id="owner"
            value={courtFilter.owner}
            onChange={(e) => handleFilterChange('owner', e.target.value)}
            placeholder="Club or partner name"
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        {/* Status Filter */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            value={courtFilter.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Second Row of Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {/* Surface Filter */}
        <div>
          <label htmlFor="surface" className="block text-sm font-medium text-gray-700 mb-1">
            Surface
          </label>
          <select
            id="surface"
            value={courtFilter.surface}
            onChange={(e) => handleFilterChange('surface', e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">All Surfaces</option>
            <option value="hard">Hard Court</option>
            <option value="clay">Clay</option>
            <option value="grass">Grass</option>
            <option value="artificial">Artificial</option>
          </select>
        </div>

        {/* Lighting Filter */}
        <div>
          <label htmlFor="lighting" className="block text-sm font-medium text-gray-700 mb-1">
            Lighting
          </label>
          <select
            id="lighting"
            value={courtFilter.lighting}
            onChange={(e) => handleFilterChange('lighting', e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">Any</option>
            <option value="true">With Lights</option>
            <option value="false">No Lights</option>
          </select>
        </div>

        {/* Indoor Filter */}
        <div>
          <label htmlFor="indoor" className="block text-sm font-medium text-gray-700 mb-1">
            Indoor/Outdoor
          </label>
          <select
            id="indoor"
            value={courtFilter.indoor}
            onChange={(e) => handleFilterChange('indoor', e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">Any</option>
            <option value="true">Indoor</option>
            <option value="false">Outdoor</option>
          </select>
        </div>

        {/* Min Rate Filter */}
        <div>
          <label htmlFor="minRate" className="block text-sm font-medium text-gray-700 mb-1">
            Min Rate ($/hr)
          </label>
          <input
            type="number"
            id="minRate"
            value={courtFilter.minRate}
            onChange={(e) => handleFilterChange('minRate', e.target.value)}
            placeholder="0"
            min="0"
            step="5"
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        {/* Max Rate Filter */}
        <div>
          <label htmlFor="maxRate" className="block text-sm font-medium text-gray-700 mb-1">
            Max Rate ($/hr)
          </label>
          <input
            type="number"
            id="maxRate"
            value={courtFilter.maxRate}
            onChange={(e) => handleFilterChange('maxRate', e.target.value)}
            placeholder="200"
            min="0"
            step="5"
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
      </div>

      {/* Export Actions */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Export filtered courts:
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleExport('csv')}
            disabled={loading}
            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Exporting...' : 'CSV'}
          </button>
          <button
            onClick={() => handleExport('excel')}
            disabled={loading}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Exporting...' : 'Excel'}
          </button>
          <button
            onClick={() => handleExport('pdf')}
            disabled={loading}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Exporting...' : 'PDF'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CourtFilters