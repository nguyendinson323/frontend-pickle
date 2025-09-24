import React, { useState } from 'react'
import { PartnerInvoice } from '../../../store/slices/partnerDocumentsSlice'
import {
  FiFile,
  FiSearch,
  FiDownload,
  FiCheckCircle,
  FiDollarSign,
  FiCalendar,
  FiAlertCircle,
  FiX,
  FiCreditCard
} from 'react-icons/fi'

interface InvoicesListProps {
  invoices: PartnerInvoice[]
  filter: {
    status: string
    searchTerm: string
  }
  onFilterChange: (filter: Partial<{ status: string; searchTerm: string }>) => void
  onDownloadInvoice: (invoiceId: number) => void
  onMarkInvoiceAsPaid: (invoiceId: number, paymentData: { payment_method: string; payment_date: string }) => void
  loading: boolean
}

const InvoicesList: React.FC<InvoicesListProps> = ({
  invoices,
  filter,
  onFilterChange,
  onDownloadInvoice,
  onMarkInvoiceAsPaid,
  loading
}) => {
  const [showPaymentModal, setShowPaymentModal] = useState<number | null>(null)
  const [paymentMethod, setPaymentMethod] = useState('')
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0])

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    }
    return colors[status as keyof typeof colors] || colors.pending
  }

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const isOverdue = (invoice: PartnerInvoice) => {
    return invoice.status === 'pending' && new Date(invoice.due_date) < new Date()
  }

  const filteredInvoices = invoices.filter(invoice => {
    if (filter.status) {
      if (filter.status === 'overdue') {
        return isOverdue(invoice)
      } else if (invoice.status !== filter.status) {
        return false
      }
    }
    if (filter.searchTerm) {
      const searchLower = filter.searchTerm.toLowerCase()
      return (
        invoice.invoice_number.toLowerCase().includes(searchLower) ||
        invoice.description.toLowerCase().includes(searchLower)
      )
    }
    return true
  })

  const handleMarkAsPaid = async (invoiceId: number) => {
    if (!paymentMethod || !paymentDate) return
    
    try {
      await onMarkInvoiceAsPaid(invoiceId, {
        payment_method: paymentMethod,
        payment_date: paymentDate
      })
      setShowPaymentModal(null)
      setPaymentMethod('')
      setPaymentDate(new Date().toISOString().split('T')[0])
    } catch (error) {
      console.error('Failed to mark invoice as paid:', error)
    }
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl overflow-hidden">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b-2 border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl flex items-center justify-center mr-3">
              <FiFile className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Invoices</h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search invoices..."
                value={filter.searchTerm}
                onChange={(e) => onFilterChange({ searchTerm: e.target.value })}
                className="pl-10 pr-4 py-3 border-2 border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium text-gray-900 bg-gray-50 hover:bg-white transition-all duration-200 placeholder-gray-500"
              />
            </div>

            <select
              value={filter.status}
              onChange={(e) => onFilterChange({ status: e.target.value })}
              className="px-4 py-3 border-2 border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium text-gray-900 bg-gray-50 hover:bg-white transition-all duration-200"
            >
              <option value="">All Invoices</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-purple-600 mx-auto mb-6"></div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Loading Invoices</h3>
            <p className="text-gray-600 font-medium">Please wait while we load your invoices...</p>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <FiFile className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {filter.status || filter.searchTerm
                ? 'No Invoices Found'
                : 'No Invoices Available'}
            </h3>
            <p className="text-gray-600 font-medium text-lg">
              {filter.status || filter.searchTerm
                ? 'Try adjusting your filters to see more invoices.'
                : 'Invoices from your business activities will appear here.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInvoices.map((invoice) => (
              <div key={invoice.id} className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-200 shadow-md">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl flex items-center justify-center mr-3">
                          <FiFile className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">
                          Invoice #{invoice.invoice_number}
                        </h3>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-2xl border shadow-md ${getStatusColor(invoice.status)}`}>
                          <FiCheckCircle className="w-3 h-3 mr-1" />
                          {isOverdue(invoice) ? 'overdue' : invoice.status}
                        </span>
                        {isOverdue(invoice) && (
                          <span className="inline-flex items-center px-3 py-1 text-xs font-bold rounded-2xl bg-gradient-to-r from-red-100 to-pink-100 border border-red-200 text-red-800">
                            <FiAlertCircle className="w-3 h-3 mr-1" />
                            Past Due
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 font-medium mb-4 bg-gray-50 rounded-lg p-3">{invoice.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div className="flex items-center text-gray-600">
                        <FiDollarSign className="w-4 h-4 mr-2 text-blue-600" />
                        <div>
                          <span className="font-medium text-gray-500">Amount:</span>
                          <p className="font-bold text-gray-900">{formatCurrency(invoice.amount)}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FiDollarSign className="w-4 h-4 mr-2 text-orange-600" />
                        <div>
                          <span className="font-medium text-gray-500">Tax:</span>
                          <p className="font-bold text-gray-900">{formatCurrency(invoice.tax_amount)}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FiDollarSign className="w-4 h-4 mr-2 text-green-600" />
                        <div>
                          <span className="font-medium text-gray-500">Total:</span>
                          <p className="font-bold text-green-600 text-lg">{formatCurrency(invoice.total_amount)}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FiCalendar className="w-4 h-4 mr-2 text-purple-600" />
                        <div>
                          <span className="font-medium text-gray-500">Due Date:</span>
                          <p className={`font-bold ${
                            isOverdue(invoice) ? 'text-red-600' : 'text-gray-900'
                          }`}>
                            {formatDate(invoice.due_date)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {invoice.line_items && invoice.line_items.length > 0 && (
                      <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-2xl">
                        <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                          <FiFile className="w-4 h-4 mr-2 text-blue-600" />
                          Line Items
                        </h4>
                        <div className="space-y-2">
                          {invoice.line_items.map((item) => (
                            <div key={item.id} className="flex justify-between items-center text-sm p-2 bg-white rounded-lg border">
                              <span className="text-gray-700 font-medium">
                                {item.description} (x{item.quantity})
                              </span>
                              <span className="text-gray-900 font-bold">{formatCurrency(item.total_price)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {invoice.payment_date && (
                      <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl">
                        <div className="flex items-center text-sm">
                          <FiCheckCircle className="w-4 h-4 mr-2 text-green-600" />
                          <span className="font-bold text-green-800">Paid on: {formatDate(invoice.payment_date)}</span>
                          {invoice.payment_method && (
                            <>
                              <FiCreditCard className="w-4 h-4 ml-4 mr-2 text-green-600" />
                              <span className="font-bold text-green-800">Method: {invoice.payment_method}</span>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 lg:mt-0 lg:ml-6 flex-shrink-0">
                    <div className="flex gap-2">
                      {invoice.document_url && (
                        <button
                          onClick={() => onDownloadInvoice(invoice.id)}
                          className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-2 px-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105 flex items-center"
                          title="Download Invoice"
                        >
                          <FiDownload className="w-4 h-4 mr-2" />
                          Download
                        </button>
                      )}

                      {invoice.status === 'pending' && (
                        <button
                          onClick={() => setShowPaymentModal(invoice.id)}
                          className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-bold py-2 px-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105 flex items-center"
                          title="Mark as Paid"
                        >
                          <FiCheckCircle className="w-4 h-4 mr-2" />
                          Mark Paid
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl w-full max-w-md p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl flex items-center justify-center mr-3">
                  <FiCheckCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Mark Invoice as Paid</h3>
              </div>
              <button
                onClick={() => setShowPaymentModal(null)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-2xl hover:bg-gray-100 transition-all duration-200"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                  <FiCreditCard className="w-4 h-4 mr-2 text-blue-600" />
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium text-gray-900 bg-gray-50 hover:bg-white transition-all duration-200"
                  required
                >
                  <option value="">Select payment method</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="check">Check</option>
                  <option value="cash">Cash</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                  <FiCalendar className="w-4 h-4 mr-2 text-purple-600" />
                  Payment Date
                </label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium text-gray-900 bg-gray-50 hover:bg-white transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowPaymentModal(null)}
                className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-bold py-3 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleMarkAsPaid(showPaymentModal)}
                disabled={!paymentMethod || !paymentDate}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:scale-100 flex items-center justify-center"
              >
                <FiCheckCircle className="w-4 h-4 mr-2" />
                Mark as Paid
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InvoicesList