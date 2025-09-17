import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import { updatePaymentFilter, clearFilters, fetchPayments } from '../../../store/slices/adminPaymentsSlice'
import {
  FiFilter,
  FiCheckCircle,
  FiCreditCard,
  FiCalendar,
  FiDollarSign,
  FiUser,
  FiSearch,
  FiRotateCcw,
  FiPlay,
  FiChevronDown,
  FiSettings
} from 'react-icons/fi'

const PaymentFilters: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { paymentFilter } = useSelector((state: RootState) => state.adminPayments)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleFilterChange = (field: string, value: any) => {
    dispatch(updatePaymentFilter({ [field]: value }))
  }

  const handleApplyFilters = () => {
    dispatch(fetchPayments())
  }

  const handleClearFilters = () => {
    dispatch(clearFilters())
    dispatch(fetchPayments())
  }

  return (
    <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden mb-6">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white mr-3">
              <FiFilter className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Payment Filters</h3>
          </div>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="inline-flex items-center px-4 py-2 bg-white border-2 border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 hover:shadow-md transition-all duration-200 transform hover:scale-105"
          >
            {showAdvanced ? 'Collapse Filters' : 'Expand Filters'}
            <FiChevronDown className={`ml-2 h-4 w-4 transform transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      <div className="p-6">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {/* Status Filter */}
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
                value={paymentFilter.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full pl-10 border-2 border-gray-300 rounded-2xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 px-4 py-3 text-sm hover:border-gray-400 appearance-none bg-white cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="pending">⏳ Pending</option>
                <option value="completed">✅ Completed</option>
                <option value="failed">❌ Failed</option>
                <option value="refunded">🔄 Refunded</option>
                <option value="cancelled">🚫 Cancelled</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <FiChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Payment Method Filter */}
          <div className="relative">
            <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
              <FiCreditCard className="mr-2 h-4 w-4" />
              Payment Method
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCreditCard className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={paymentFilter.payment_method}
                onChange={(e) => handleFilterChange('payment_method', e.target.value)}
                className="w-full pl-10 border-2 border-gray-300 rounded-2xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 px-4 py-3 text-sm hover:border-gray-400 appearance-none bg-white cursor-pointer"
              >
                <option value="all">All Methods</option>
                <option value="credit_card">💳 Credit Card</option>
                <option value="debit_card">💳 Debit Card</option>
                <option value="paypal">🅿️ PayPal</option>
                <option value="stripe">💳 Stripe</option>
                <option value="bank_transfer">🏦 Bank Transfer</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <FiChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="relative">
            <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
              <FiCalendar className="mr-2 h-4 w-4" />
              Date Range
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={paymentFilter.date_range}
                onChange={(e) => handleFilterChange('date_range', e.target.value)}
                className="w-full pl-10 border-2 border-gray-300 rounded-2xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 px-4 py-3 text-sm hover:border-gray-400 appearance-none bg-white cursor-pointer"
              >
                <option value="all">📅 All Time</option>
                <option value="today">📅 Today</option>
                <option value="week">📅 This Week</option>
                <option value="month">📅 This Month</option>
                <option value="quarter">📅 This Quarter</option>
                <option value="year">📅 This Year</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <FiChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t-2 border-gray-200 mb-6">
            {/* Amount Range */}
            <div className="relative">
              <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
                <FiDollarSign className="mr-2 h-4 w-4" />
                Min Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiDollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={paymentFilter.amount_min || ''}
                  onChange={(e) => handleFilterChange('amount_min', e.target.value ? parseFloat(e.target.value) : null)}
                  className="w-full pl-10 border-2 border-gray-300 rounded-2xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 px-4 py-3 text-sm hover:border-gray-400"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
                <FiDollarSign className="mr-2 h-4 w-4" />
                Max Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiDollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={paymentFilter.amount_max || ''}
                  onChange={(e) => handleFilterChange('amount_max', e.target.value ? parseFloat(e.target.value) : null)}
                  className="w-full pl-10 border-2 border-gray-300 rounded-2xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 px-4 py-3 text-sm hover:border-gray-400"
                />
              </div>
            </div>

            {/* User Search */}
            <div className="relative">
              <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
                <FiUser className="mr-2 h-4 w-4" />
                User Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Name or email"
                  value={paymentFilter.user_search}
                  onChange={(e) => handleFilterChange('user_search', e.target.value)}
                  className="w-full pl-10 border-2 border-gray-300 rounded-2xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 px-4 py-3 text-sm hover:border-gray-400"
                />
              </div>
            </div>

            {/* Transaction ID Search */}
            <div className="relative lg:col-span-3">
              <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
                <FiSearch className="mr-2 h-4 w-4" />
                Transaction ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by transaction ID"
                  value={paymentFilter.transaction_id}
                  onChange={(e) => handleFilterChange('transaction_id', e.target.value)}
                  className="w-full pl-10 border-2 border-gray-300 rounded-2xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 px-4 py-3 text-sm hover:border-gray-400"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t-2 border-gray-200">
          <button
            onClick={handleClearFilters}
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <FiRotateCcw className="mr-2 h-4 w-4" />
            Reset Filters
          </button>
          <button
            onClick={handleApplyFilters}
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

export default PaymentFilters