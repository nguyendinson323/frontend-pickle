import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState, AppDispatch } from '../../store'
import {
  fetchPayments,
  fetchPaymentStats,
  fetchPaymentMethods
} from '../../store/slices/adminPaymentsSlice'
import {
  PaymentStats,
  PaymentFilters,
  PaymentsTable,
  PaymentMethods
} from '../../components/admin/payments'
import {
  FiCreditCard,
  FiBarChart,
  FiDollarSign,
  FiSettings,
  FiArrowLeft,
  FiAlertCircle,
  FiLoader,
  FiRefreshCw,
  FiTrendingUp,
  FiZap,
  FiDownload,
  FiShield
} from 'react-icons/fi'

const AdminPayments: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
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
    dispatch(fetchPayments())
    dispatch(fetchPaymentStats())
    dispatch(fetchPaymentMethods())
  }, [dispatch, user, navigate])

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="animate-spin h-16 w-16 text-indigo-600 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-700">Loading payment management...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we set up your admin panel</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Payment Overview', icon: FiBarChart },
    { id: 'transactions', label: 'Transaction Management', icon: FiCreditCard },
    { id: 'methods', label: 'Payment Methods', icon: FiSettings }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg mr-6">
                <FiDollarSign className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Payment Management</h1>
                <p className="mt-2 text-lg text-gray-600">
                  Monitor transactions, process refunds, and manage payment methods
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 rounded-xl shadow-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <FiArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <FiAlertCircle className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-bold text-red-800">Error Occurred</h3>
                <div className="mt-2 text-red-700 font-medium">
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
        <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <nav className="flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => {
                const IconComponent = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'overview' | 'transactions' | 'methods')}
                    className={`relative inline-flex items-center px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 transform hover:scale-105 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                        : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 shadow-md hover:shadow-lg'
                    }`}
                  >
                    <IconComponent className="mr-2 h-4 w-4" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-100 border-2 border-blue-200 rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-blue-900 mb-6 flex items-center">
                  <FiBarChart className="mr-3 h-6 w-6" />
                  Payment System Overview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white rounded-2xl p-6 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg mr-4">
                        <FiCreditCard className="h-6 w-6" />
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg">Transaction Processing</h4>
                    </div>
                    <p className="text-gray-600 font-medium">Monitor all payment transactions with detailed filtering and status tracking</p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white shadow-lg mr-4">
                        <FiRefreshCw className="h-6 w-6" />
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg">Refund Management</h4>
                    </div>
                    <p className="text-gray-600 font-medium">Process refunds with detailed tracking and automated customer notifications</p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg mr-4">
                        <FiTrendingUp className="h-6 w-6" />
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg">Revenue Analytics</h4>
                    </div>
                    <p className="text-gray-600 font-medium">Comprehensive revenue tracking with period comparisons and payment method analytics</p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center text-white shadow-lg mr-4">
                        <FiZap className="h-6 w-6" />
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg">Bulk Operations</h4>
                    </div>
                    <p className="text-gray-600 font-medium">Efficiently manage multiple transactions with bulk status updates and operations</p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center text-white shadow-lg mr-4">
                        <FiDownload className="h-6 w-6" />
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg">Data Export</h4>
                    </div>
                    <p className="text-gray-600 font-medium">Export payment data with customizable filters for accounting and reporting</p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white shadow-lg mr-4">
                        <FiShield className="h-6 w-6" />
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg">Secure Processing</h4>
                    </div>
                    <p className="text-gray-600 font-medium">PCI-compliant payment processing with fraud detection and security monitoring</p>
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
            <PaymentMethods />
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPayments