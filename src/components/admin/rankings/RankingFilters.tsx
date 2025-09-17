import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import { setRankingFilter, exportRankings } from '../../../store/slices/adminRankingsSlice'
import {
  FiFilter,
  FiSearch,
  FiMapPin,
  FiTrendingUp,
  FiTrendingDown,
  FiMinus,
  FiCalendar,
  FiTag,
  FiClock,
  FiDownload,
  FiRotateCcw,
  FiChevronDown
} from 'react-icons/fi'

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
    <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden mb-6">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white mr-3">
              <FiFilter className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Ranking Filters</h3>
          </div>
          <button
            onClick={handleClearFilters}
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <FiRotateCcw className="mr-2 h-4 w-4" />
            Clear Filters
          </button>
        </div>
      </div>

      <div className="p-6">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
          {/* Search Term */}
          <div className="relative col-span-1 md:col-span-2 lg:col-span-1">
            <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
              <FiSearch className="mr-2 h-4 w-4" />
              Search Players
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="search"
                value={rankingFilter.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                placeholder="Player name"
                className="w-full pl-10 border-2 border-gray-300 rounded-2xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 px-4 py-3 text-sm hover:border-gray-400"
              />
            </div>
          </div>

          {/* State Filter */}
          <div className="relative">
            <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
              <FiMapPin className="mr-2 h-4 w-4" />
              State
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="state"
                value={rankingFilter.state}
                onChange={(e) => handleFilterChange('state', e.target.value)}
                placeholder="State name"
                className="w-full pl-10 border-2 border-gray-300 rounded-2xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 px-4 py-3 text-sm hover:border-gray-400"
              />
            </div>
          </div>

          {/* Position Range */}
          <div className="relative">
            <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
              <FiTrendingUp className="mr-2 h-4 w-4" />
              Min Position
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiTrendingUp className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                id="minPosition"
                value={rankingFilter.minPosition}
                onChange={(e) => handleFilterChange('minPosition', e.target.value)}
                placeholder="1"
                min="1"
                className="w-full pl-10 border-2 border-gray-300 rounded-2xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 px-4 py-3 text-sm hover:border-gray-400"
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
              <FiTrendingDown className="mr-2 h-4 w-4" />
              Max Position
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiTrendingDown className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                id="maxPosition"
                value={rankingFilter.maxPosition}
                onChange={(e) => handleFilterChange('maxPosition', e.target.value)}
                placeholder="100"
                min="1"
                className="w-full pl-10 border-2 border-gray-300 rounded-2xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 px-4 py-3 text-sm hover:border-gray-400"
              />
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-6">
          {/* Change Type Filter */}
          <div className="relative">
            <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
              <FiTrendingUp className="mr-2 h-4 w-4" />
              Ranking Change
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiTrendingUp className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="changeType"
                value={rankingFilter.changeType}
                onChange={(e) => handleFilterChange('changeType', e.target.value)}
                className="w-full pl-10 border-2 border-gray-300 rounded-2xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 px-4 py-3 text-sm hover:border-gray-400 appearance-none bg-white cursor-pointer"
              >
                <option value="">📈 All Changes</option>
                <option value="up">⬆️ Improved</option>
                <option value="down">⬇️ Declined</option>
                <option value="stable">➡️ No Change</option>
                <option value="new">✨ New Players</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <FiChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div className="relative">
            <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
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
                value={rankingFilter.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full pl-10 border-2 border-gray-300 rounded-2xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 px-4 py-3 text-sm hover:border-gray-400 cursor-pointer"
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
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
                value={rankingFilter.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-full pl-10 border-2 border-gray-300 rounded-2xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 px-4 py-3 text-sm hover:border-gray-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="relative">
            <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
              <FiTag className="mr-2 h-4 w-4" />
              Category
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiTag className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="category"
                value={rankingFilter.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full pl-10 border-2 border-gray-300 rounded-2xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 px-4 py-3 text-sm hover:border-gray-400 appearance-none bg-white cursor-pointer"
              >
                <option value="">🏷️ All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <FiChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Period Filter */}
          <div className="relative">
            <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
              <FiClock className="mr-2 h-4 w-4" />
              Period
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiClock className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="period"
                value={rankingFilter.period}
                onChange={(e) => handleFilterChange('period', e.target.value)}
                className="w-full pl-10 border-2 border-gray-300 rounded-2xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 px-4 py-3 text-sm hover:border-gray-400 appearance-none bg-white cursor-pointer"
              >
                <option value="">⏰ Active Period</option>
                {periods.map((period) => (
                  <option key={period.id} value={period.id}>
                    {period.name} {period.is_active && '(Active)'}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <FiChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Export Actions */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0 pt-6 border-t-2 border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white mr-3">
              <FiDownload className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold text-gray-900">
              Export filtered rankings:
            </span>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={() => handleExport('csv')}
              disabled={loading}
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
            >
              <FiDownload className="mr-2 h-4 w-4" />
              {loading ? 'Exporting...' : 'CSV'}
            </button>
            <button
              onClick={() => handleExport('excel')}
              disabled={loading}
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
            >
              <FiDownload className="mr-2 h-4 w-4" />
              {loading ? 'Exporting...' : 'Excel'}
            </button>
            <button
              onClick={() => handleExport('pdf')}
              disabled={loading}
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
            >
              <FiDownload className="mr-2 h-4 w-4" />
              {loading ? 'Exporting...' : 'PDF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RankingFilters