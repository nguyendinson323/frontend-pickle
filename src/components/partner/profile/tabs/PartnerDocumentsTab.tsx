import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../../store'
import { fetchPartnerDocuments } from '../../../../store/slices/partnerDocumentsSlice'

export const PartnerDocumentsTab: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { documents, invoices, stats, error } = useSelector((state: RootState) => state.partnerDocuments)
  const { isLoading } = useSelector((state: RootState) => state.loading)

  useEffect(() => {
    dispatch(fetchPartnerDocuments())
  }, [dispatch])

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'contract': return '📄'
      case 'invoice': return '🧾'
      case 'agreement': return '🤝'
      case 'certificate': return '📜'
      default: return '📎'
    }
  }

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      active: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800',
      paid: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    }

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
        statusStyles[status as keyof typeof statusStyles] || statusStyles.pending
      }`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  if (isLoading && !documents.length) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Documents & Invoices</h3>
        <button
          onClick={() => navigate('/partner/documents')}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Manage Documents
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Document Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Total Documents</p>
                <p className="text-xl font-bold text-orange-900">{stats.total_documents}</p>
              </div>
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-700">Pending Signatures</p>
                <p className="text-xl font-bold text-yellow-900">{stats.pending_signatures}</p>
              </div>
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">Expiring Soon</p>
                <p className="text-xl font-bold text-red-900">{stats.expiring_soon}</p>
              </div>
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Overdue Invoices</p>
                <p className="text-xl font-bold text-blue-900">{stats.overdue_invoices}</p>
              </div>
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Recent Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h4 className="font-medium text-gray-900">Recent Documents</h4>
          </div>
          {documents.length === 0 ? (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600">No documents uploaded yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {documents.slice(0, 3).map((doc) => (
                <div key={doc.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start space-x-3">
                    <span className="text-lg flex-shrink-0">{getDocumentIcon(doc.document_type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">{doc.document_name}</p>
                        {getStatusBadge(doc.status)}
                      </div>
                      <p className="text-sm text-gray-600 mt-1 capitalize">{doc.document_type.replace('_', ' ')}</p>
                      <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500">
                        <span>Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}</span>
                        {doc.expiry_date && (
                          <span>Expires {new Date(doc.expiry_date).toLocaleDateString()}</span>
                        )}
                        {doc.is_signed && (
                          <span className="text-green-600">✓ Signed</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Invoices */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h4 className="font-medium text-gray-900">Recent Invoices</h4>
          </div>
          {invoices.length === 0 ? (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-600">No invoices available</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {invoices.slice(0, 3).map((invoice) => (
                <div key={invoice.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start space-x-3">
                    <span className="text-lg flex-shrink-0">🧾</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{invoice.invoice_number}</p>
                        {getStatusBadge(invoice.status)}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{invoice.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Due {new Date(invoice.due_date).toLocaleDateString()}</span>
                          {invoice.payment_date && (
                            <span>Paid {new Date(invoice.payment_date).toLocaleDateString()}</span>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          ${invoice.total_amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex space-x-3">
        <button
          onClick={() => navigate('/partner/documents')}
          className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Access Document Center
        </button>
        <button
          onClick={() => navigate('/partner/documents?tab=invoices')}
          className="inline-flex items-center px-4 py-2 border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          View All Invoices
        </button>
      </div>
    </div>
  )
}