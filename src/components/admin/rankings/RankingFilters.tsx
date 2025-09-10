import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import { setRankingFilter, exportRankings } from '../../../store/slices/adminRankingsSlice'

const RankingFilters: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { rankingFilter, periods, categories } = useSelector((state: RootState) => state.adminRankings)
  const { isLoading: loading } = useSelector((state: RootState) => state.loading)

  const handleFilterChange = (field: string, value: string) => {
    dispatch(setRankingFilter({ [field]: value }))
  }

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    dispatch(exportRankings(rankingFilter, format))
  }

  const handleClearFilters = () => {
    dispatch(setRankingFilter({
      state: '',
      searchTerm: '',
      minPosition: '',
      maxPosition: '',
      changeType: '',
      dateFrom: '',
      dateTo: '',
      category: '',
      period: '',
      page: '1',
      limit: '50'
    }))
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Ranking Filters</h3>
        <button
          onClick={handleClearFilters}
          className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          Clear Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-9 gap-4 mb-6">
        {/* Search Term */}
        <div className="col-span-1 md:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search Players
          </label>
          <input
            type="text"
            id="search"
            value={rankingFilter.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            placeholder="Player name"
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        {/* State Filter */}
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
            State
          </label>
          <input
            type="text"
            id="state"
            value={rankingFilter.state}
            onChange={(e) => handleFilterChange('state', e.target.value)}
            placeholder="State name"
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        {/* Position Range */}
        <div>
          <label htmlFor="minPosition" className="block text-sm font-medium text-gray-700 mb-1">
            Min Position
          </label>
          <input
            type="number"
            id="minPosition"
            value={rankingFilter.minPosition}
            onChange={(e) => handleFilterChange('minPosition', e.target.value)}
            placeholder="1"
            min="1"
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label htmlFor="maxPosition" className="block text-sm font-medium text-gray-700 mb-1">
            Max Position
          </label>
          <input
            type="number"
            id="maxPosition"
            value={rankingFilter.maxPosition}
            onChange={(e) => handleFilterChange('maxPosition', e.target.value)}
            placeholder="100"
            min="1"
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        {/* Change Type Filter */}
        <div>
          <label htmlFor="changeType" className="block text-sm font-medium text-gray-700 mb-1">
            Ranking Change
          </label>
          <select
            id="changeType"
            value={rankingFilter.changeType}
            onChange={(e) => handleFilterChange('changeType', e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">All Changes</option>
            <option value="up">Improved</option>
            <option value="down">Declined</option>
            <option value="stable">No Change</option>
            <option value="new">New Players</option>
          </select>
        </div>

        {/* Date Range */}
        <div>
          <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700 mb-1">
            From Date
          </label>
          <input
            type="date"
            id="dateFrom"
            value={rankingFilter.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700 mb-1">
            To Date
          </label>
          <input
            type="date"
            id="dateTo"
            value={rankingFilter.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        {/* Category Filter */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            value={rankingFilter.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Period Filter */}
        <div>
          <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-1">
            Period
          </label>
          <select
            id="period"
            value={rankingFilter.period}
            onChange={(e) => handleFilterChange('period', e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">Active Period</option>
            {periods.map((period) => (
              <option key={period.id} value={period.id}>
                {period.name} {period.is_active && '(Active)'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Export Actions */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Export filtered rankings:
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

export default RankingFilters