import React, { useState } from 'react'
import { PartnerInvoice } from '../../../store/slices/partnerDocumentsSlice'

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
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900">Invoices</h2>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search invoices..."
                value={filter.searchTerm}
                onChange={(e) => onFilterChange({ searchTerm: e.target.value })}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <select
              value={filter.status}
              onChange={(e) => onFilterChange({ status: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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

      <div className="p-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-3"></div>
            <p className="text-gray-600">Loading invoices...</p>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-500">
              {filter.status || filter.searchTerm 
                ? 'No invoices match your filters' 
                : 'No invoices found'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInvoices.map((invoice) => (
              <div key={invoice.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        Invoice #{invoice.invoice_number}
                      </h3>
                      
                      <div className="flex gap-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                          {isOverdue(invoice) ? 'overdue' : invoice.status}
                        </span>
                        {isOverdue(invoice) && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            Past Due
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">{invoice.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-500">Amount:</span>
                        <p className="text-gray-900">{formatCurrency(invoice.amount)}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">Tax:</span>
                        <p className="text-gray-900">{formatCurrency(invoice.tax_amount)}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">Total:</span>
                        <p className="font-semibold text-gray-900">{formatCurrency(invoice.total_amount)}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">Due Date:</span>
                        <p className={`${isOverdue(invoice) ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                          {formatDate(invoice.due_date)}
                        </p>
                      </div>
                    </div>

                    {invoice.line_items && invoice.line_items.length > 0 && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Line Items</h4>
                        <div className="space-y-1">
                          {invoice.line_items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                {item.description} (x{item.quantity})
                              </span>
                              <span className="text-gray-900">{formatCurrency(item.total_price)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {invoice.payment_date && (
                      <div className="mt-2 text-sm">
                        <span className="font-medium text-gray-500">Paid on:</span>
                        <span className="ml-2 text-gray-900">{formatDate(invoice.payment_date)}</span>
                        {invoice.payment_method && (
                          <>
                            <span className="ml-4 font-medium text-gray-500">Method:</span>
                            <span className="ml-2 text-gray-900">{invoice.payment_method}</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 lg:mt-0 lg:ml-6 flex-shrink-0">
                    <div className="flex gap-2">
                      {invoice.document_url && (
                        <button
                          onClick={() => onDownloadInvoice(invoice.id)}
                          className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          title="Download Invoice"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </button>
                      )}
                      
                      {invoice.status === 'pending' && (
                        <button
                          onClick={() => setShowPaymentModal(invoice.id)}
                          className="px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          title="Mark as Paid"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center pb-3">
              <h3 className="text-lg font-bold text-gray-900">Mark Invoice as Paid</h3>
              <button
                onClick={() => setShowPaymentModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Date
                </label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={() => setShowPaymentModal(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleMarkAsPaid(showPaymentModal)}
                disabled={!paymentMethod || !paymentDate}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
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