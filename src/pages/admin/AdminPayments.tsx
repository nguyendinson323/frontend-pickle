import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../../store'
import { 
  fetchPayments, 
  fetchPaymentStats, 
  fetchPaymentMethods 
} from '../../store/slices/adminPaymentsSlice'
import {
  PaymentStats,
  PaymentFilters,
  PaymentsTable
} from '../../components/admin/payments'

const AdminPayments: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.auth)
  const { error } = useSelector((state: RootState) => state.adminPayments)
  
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'methods'>('overview')

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login')
      return
    }

    // Fetch initial data
    dispatch(fetchPayments() as any)
    dispatch(fetchPaymentStats() as any)
    dispatch(fetchPaymentMethods() as any)
  }, [dispatch, user, navigate])

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Payment Overview', icon: '📊' },
    { id: 'transactions', label: 'Transaction Management', icon: '💳' },
    { id: 'methods', label: 'Payment Methods', icon: '🔧' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
              <p className="mt-2 text-gray-600">
                Monitor transactions, process refunds, and manage payment methods
              </p>
            </div>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  {error}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Statistics - Always Visible */}
        <div className="mb-8">
          <PaymentStats />
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white shadow-sm rounded-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'overview' | 'transactions' | 'methods')}
                  className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Payment System Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">💳</span>
                      <h4 className="font-medium text-gray-900">Transaction Processing</h4>
                    </div>
                    <p className="text-sm text-gray-600">Monitor all payment transactions with detailed filtering and status tracking</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">🔄</span>
                      <h4 className="font-medium text-gray-900">Refund Management</h4>
                    </div>
                    <p className="text-sm text-gray-600">Process refunds with detailed tracking and automated customer notifications</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">📊</span>
                      <h4 className="font-medium text-gray-900">Revenue Analytics</h4>
                    </div>
                    <p className="text-sm text-gray-600">Comprehensive revenue tracking with period comparisons and payment method analytics</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">⚡</span>
                      <h4 className="font-medium text-gray-900">Bulk Operations</h4>
                    </div>
                    <p className="text-sm text-gray-600">Efficiently manage multiple transactions with bulk status updates and operations</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">📤</span>
                      <h4 className="font-medium text-gray-900">Data Export</h4>
                    </div>
                    <p className="text-sm text-gray-600">Export payment data with customizable filters for accounting and reporting</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">🔐</span>
                      <h4 className="font-medium text-gray-900">Secure Processing</h4>
                    </div>
                    <p className="text-sm text-gray-600">PCI-compliant payment processing with fraud detection and security monitoring</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'transactions' && (
            <>
              <PaymentFilters />
              <PaymentsTable />
            </>
          )}

          {activeTab === 'methods' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods Management</h3>
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Payment Methods</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Payment method management interface coming soon. This will include stored payment methods, 
                  payment provider configuration, and security settings.
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Configure Payment Methods
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPayments