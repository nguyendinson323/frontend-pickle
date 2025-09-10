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
  exportPayments
} from '../../../store/slices/adminPaymentsSlice'
import PaymentDetailsModal from './PaymentDetailsModal'
import RefundModal from './RefundModal'

const PaymentsTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { 
    payments, 
    selectedPayments, 
    currentPage, 
    totalPages, 
    loading, 
    bulkActionLoading 
  } = useSelector((state: RootState) => state.adminPayments)

  const [selectedPayment, setSelectedPayment] = useState(null)
  const [showRefundModal, setShowRefundModal] = useState(false)
  const [refundPayment, setRefundPayment] = useState(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'refunded':
        return 'bg-purple-100 text-purple-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
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

  if (loading && payments.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-2 text-gray-600">Loading payments...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Payment Transactions</h3>
          <div className="flex items-center space-x-3">
            {selectedPayments.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {selectedPayments.length} selected
                </span>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleBulkStatusUpdate(e.target.value)
                      e.target.value = ''
                    }
                  }}
                  className="text-sm border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  disabled={bulkActionLoading}
                >
                  <option value="">Bulk Actions</option>
                  <option value="completed">Mark Completed</option>
                  <option value="failed">Mark Failed</option>
                  <option value="cancelled">Cancel</option>
                </select>
              </div>
            )}
            <button
              onClick={handleExport}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover: focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="">
            <tr>
              <th className="w-4 px-6 py-3">
                <input
                  type="checkbox"
                  checked={selectedPayments.length === payments.length && payments.length > 0}
                  onChange={() => dispatch(toggleAllPayments())}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Method
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedPayments.includes(payment.id)}
                    onChange={() => dispatch(togglePaymentSelection(payment.id))}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      #{payment.id}
                    </div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {payment.transaction_id || 'N/A'}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(payment.amount)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {payment.currency || 'MXN'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {payment.user ? (
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {payment.user.username}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.user.email}
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">N/A</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900 capitalize">
                    {payment.payment_method ? payment.payment_method.replace('_', ' ') : 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(payment.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => setSelectedPayment(payment)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    View
                  </button>
                  
                  {payment.status === 'completed' && (
                    <button
                      onClick={() => handleRefund(payment)}
                      className="text-purple-600 hover:text-purple-900"
                    >
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
                      className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="">Update</option>
                      <option value="completed">Complete</option>
                      <option value="failed">Mark Failed</option>
                      <option value="cancelled">Cancel</option>
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {payments.length === 0 && !loading && (
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
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No payments found</h3>
          <p className="mt-1 text-sm text-gray-500">
            No payment transactions match your current filter criteria.
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover: disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover: disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
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