import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import {
  togglePaymentSelection,
  toggleAllPayments,
  setCurrentPage,
  fetchPayments,
  processRefund,
  updatePaymentStatus,
  bulkUpdatePaymentStatus,
  exportPayments,
  Payment
} from '../../../store/slices/adminPaymentsSlice'
import PaymentDetailsModal from './PaymentDetailsModal'
import RefundModal from './RefundModal'
import {
  FiCreditCard,
  FiLoader,
  FiDownload,
  FiEye,
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiChevronLeft,
  FiChevronRight,
  FiUser,
  FiCalendar,
  FiDollarSign
} from 'react-icons/fi'

const PaymentsTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { 
    payments, 
    selectedPayments, 
    currentPage, 
    totalPages, 
    bulkActionLoading 
  } = useSelector((state: RootState) => state.adminPayments)
  const { isLoading } = useSelector((state: RootState) => state.loading)

  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [showRefundModal, setShowRefundModal] = useState(false)
  const [refundPayment, setRefundPayment] = useState<Payment | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300'
      case 'pending':
        return 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300'
      case 'failed':
        return 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300'
      case 'refunded':
        return 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300'
      case 'cancelled':
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300'
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return FiCheckCircle
      case 'pending':
        return FiClock
      case 'failed':
        return FiXCircle
      case 'refunded':
        return FiRefreshCw
      case 'cancelled':
        return FiXCircle
      default:
        return FiClock
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page))
    dispatch(fetchPayments())
  }

  const handleStatusUpdate = async (paymentId: number, newStatus: string) => {
    try {
      await dispatch(updatePaymentStatus(paymentId, newStatus))
      dispatch(fetchPayments())
    } catch (error) {
      // Error handled in slice
    }
  }

  const handleRefund = (payment: any) => {
    setRefundPayment(payment)
    setShowRefundModal(true)
  }

  const handleBulkStatusUpdate = async (status: string) => {
    if (selectedPayments.length === 0) return
    
    try {
      await dispatch(bulkUpdatePaymentStatus(selectedPayments, status))
    } catch (error) {
      // Error handled in slice
    }
  }

  const handleExport = () => {
    dispatch(exportPayments())
  }

  if (isLoading && payments.length === 0) {
    return (
      <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <FiCreditCard className="mr-2 h-5 w-5" />
            Payment Transactions
          </h3>
        </div>
        <div className="p-12">
          <div className="flex items-center justify-center text-center">
            <div>
              <FiLoader className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <p className="text-xl font-semibold text-gray-700">Loading payments...</p>
              <p className="text-sm text-gray-500 mt-2">Please wait while we fetch your payment data</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
      {/* Table Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white mr-3">
              <FiCreditCard className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Payment Transactions</h3>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            {selectedPayments.length > 0 && (
              <div className="flex items-center space-x-3 bg-white rounded-xl px-4 py-2 shadow-md border border-gray-200">
                <span className="text-sm font-bold text-indigo-600">
                  {selectedPayments.length} selected
                </span>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleBulkStatusUpdate(e.target.value)
                      e.target.value = ''
                    }
                  }}
                  className="text-sm border-2 border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white cursor-pointer font-medium"
                  disabled={bulkActionLoading}
                >
                  <option value="">✨ Bulk Actions</option>
                  <option value="completed">✅ Mark Completed</option>
                  <option value="failed">❌ Mark Failed</option>
                  <option value="cancelled">🚫 Cancel</option>
                </select>
              </div>
            )}
            <button
              onClick={handleExport}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <FiDownload className="mr-2 h-4 w-4" />
              Export Data
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
            <tr>
              <th className="w-4 px-6 py-4">
                <input
                  type="checkbox"
                  checked={selectedPayments.length === payments.length && payments.length > 0}
                  onChange={() => dispatch(toggleAllPayments())}
                  className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-2 border-gray-300 rounded-lg shadow-sm"
                />
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                Transaction
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                Method
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment, index) => (
              <tr key={payment.id} className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200" style={{ animationDelay: `${index * 50}ms` }}>
                <td className="px-6 py-6">
                  <input
                    type="checkbox"
                    checked={selectedPayments.includes(payment.id)}
                    onChange={() => dispatch(togglePaymentSelection(payment.id))}
                    className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-2 border-gray-300 rounded-lg shadow-sm"
                  />
                </td>
                <td className="px-6 py-6 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                      #{payment.id.toString().slice(-2)}
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900">
                        #{payment.id}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs font-medium">
                        {payment.transaction_id || 'N/A'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white">
                      <FiDollarSign className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900">
                        {formatCurrency(payment.amount)}
                      </div>
                      <div className="text-sm text-gray-500 font-medium">
                        {payment.currency || 'MXN'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6 whitespace-nowrap">
                  {payment.user ? (
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                        <FiUser className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900">
                          {payment.user.username}
                        </div>
                        <div className="text-sm text-gray-500 font-medium">
                          {payment.user.email}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl flex items-center justify-center text-white">
                        <FiUser className="h-5 w-5" />
                      </div>
                      <span className="text-lg font-medium text-gray-500">N/A</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-6 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center text-white">
                      <FiCreditCard className="h-4 w-4" />
                    </div>
                    <span className="text-lg font-bold text-gray-900 capitalize">
                      {payment.payment_method ? payment.payment_method.replace('_', ' ') : 'N/A'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-6 whitespace-nowrap">
                  {(() => {
                    const StatusIcon = getStatusIcon(payment.status)
                    return (
                      <span className={`inline-flex items-center px-4 py-2 text-sm font-bold rounded-xl capitalize shadow-lg ${getStatusColor(payment.status)}`}>
                        <StatusIcon className="mr-2 h-4 w-4" />
                        {payment.status}
                      </span>
                    )
                  })()}
                </td>
                <td className="px-6 py-6 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-white">
                      <FiCalendar className="h-4 w-4" />
                    </div>
                    <div className="text-sm font-bold text-gray-900">
                      {formatDate(payment.created_at)}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setSelectedPayment(payment)}
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <FiEye className="mr-1 h-4 w-4" />
                      View
                    </button>

                    {payment.status === 'completed' && (
                      <button
                        onClick={() => handleRefund(payment)}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <FiRefreshCw className="mr-1 h-4 w-4" />
                        Refund
                      </button>
                    )}

                    {payment.status === 'pending' && (
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleStatusUpdate(payment.id, e.target.value)
                            e.target.value = ''
                          }
                        }}
                        className="px-3 py-2 text-sm border-2 border-gray-300 rounded-xl bg-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer shadow-md hover:shadow-lg"
                      >
                        <option value="">⚙️ Update</option>
                        <option value="completed">✅ Complete</option>
                        <option value="failed">❌ Mark Failed</option>
                        <option value="cancelled">🚫 Cancel</option>
                      </select>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {payments.length === 0 && !isLoading && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg">
            <FiCreditCard className="h-10 w-10" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No payments found</h3>
          <p className="text-lg text-gray-600 font-medium">
            No payment transactions match your current filter criteria.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Try adjusting your filters or check back later for new transactions.
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t-2 border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
            <p className="text-lg font-bold text-gray-700">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="inline-flex items-center px-6 py-3 text-sm font-bold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md transform hover:scale-105"
              >
                <FiChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="inline-flex items-center px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 border border-transparent rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Next
                <FiChevronRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {selectedPayment && (
        <PaymentDetailsModal
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
        />
      )}

      {showRefundModal && refundPayment && (
        <RefundModal
          payment={refundPayment}
          onClose={() => {
            setShowRefundModal(false)
            setRefundPayment(null)
          }}
          onRefund={async (amount, reason) => {
            await dispatch(processRefund(refundPayment.id, amount, reason))
            dispatch(fetchPayments())
            setShowRefundModal(false)
            setRefundPayment(null)
          }}
        />
      )}
    </div>
  )
}

export default PaymentsTable