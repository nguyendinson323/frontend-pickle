import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import {
  fetchPartnerDocuments,
  uploadPartnerDocument,
  signPartnerDocument,
  downloadPartnerDocument,
  deletePartnerDocument,
  downloadPartnerInvoice,
  markInvoiceAsPaid,
  setDocumentFilter,
  setInvoiceFilter
} from '../../store/slices/partnerDocumentsSlice'

import DocumentsHeader from '../../components/partner/documents/DocumentsHeader'
import DocumentsList from '../../components/partner/documents/DocumentsList'
import InvoicesList from '../../components/partner/documents/InvoicesList'
import UploadModal from '../../components/partner/documents/UploadModal'

const PartnerDocuments: React.FC = () => {
  const dispatch = useDispatch()
  const {
    documents,
    invoices,
    stats,
    loading,
    error,
    documentFilter,
    invoiceFilter,
    uploadingFile
  } = useSelector((state: RootState) => state.partnerDocuments)

  const [activeTab, setActiveTab] = useState<'documents' | 'invoices'>('documents')
  const [showUploadModal, setShowUploadModal] = useState(false)

  useEffect(() => {
    dispatch(fetchPartnerDocuments() as any)
  }, [dispatch])

  const handleUploadDocument = async (formData: FormData) => {
    try {
      await dispatch(uploadPartnerDocument(formData) as any)
      setShowUploadModal(false)
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

  const handleSignDocument = async (documentId: number) => {
    if (window.confirm('Are you sure you want to digitally sign this document?')) {
      try {
        await dispatch(signPartnerDocument(documentId) as any)
      } catch (error) {
        console.error('Signing failed:', error)
      }
    }
  }

  const handleDownloadDocument = async (documentId: number) => {
    try {
      await dispatch(downloadPartnerDocument(documentId) as any)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const handleDeleteDocument = async (documentId: number) => {
    if (window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      try {
        await dispatch(deletePartnerDocument(documentId) as any)
      } catch (error) {
        console.error('Delete failed:', error)
      }
    }
  }

  const handleDownloadInvoice = async (invoiceId: number) => {
    try {
      await dispatch(downloadPartnerInvoice(invoiceId) as any)
    } catch (error) {
      console.error('Invoice download failed:', error)
    }
  }

  const handleMarkInvoiceAsPaid = async (invoiceId: number, paymentData: { payment_method: string; payment_date: string }) => {
    try {
      await dispatch(markInvoiceAsPaid(invoiceId, paymentData) as any)
    } catch (error) {
      console.error('Failed to mark invoice as paid:', error)
    }
  }

  const handleDocumentFilterChange = (filter: Partial<{ type: string; status: string; searchTerm: string }>) => {
    dispatch(setDocumentFilter(filter))
  }

  const handleInvoiceFilterChange = (filter: Partial<{ status: string; searchTerm: string }>) => {
    dispatch(setInvoiceFilter(filter))
  }

  if (loading && documents.length === 0 && invoices.length === 0) {
    return (
      <div className="min-h-screen  py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-16 bg-gray-200 rounded-lg"></div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error && documents.length === 0 && invoices.length === 0) {
    return (
      <div className="min-h-screen  py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Documents</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => dispatch(fetchPartnerDocuments() as any)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen  py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DocumentsHeader
          stats={stats}
          onUploadDocument={() => setShowUploadModal(true)}
          loading={loading}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('documents')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'documents'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Documents
                {documents.length > 0 && (
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                    {documents.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('invoices')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'invoices'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Invoices
                {invoices.length > 0 && (
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                    {invoices.length}
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'documents' && (
          <DocumentsList
            documents={documents}
            filter={documentFilter}
            onFilterChange={handleDocumentFilterChange}
            onSignDocument={handleSignDocument}
            onDownloadDocument={handleDownloadDocument}
            onDeleteDocument={handleDeleteDocument}
            loading={loading}
          />
        )}

        {activeTab === 'invoices' && (
          <InvoicesList
            invoices={invoices}
            filter={invoiceFilter}
            onFilterChange={handleInvoiceFilterChange}
            onDownloadInvoice={handleDownloadInvoice}
            onMarkInvoiceAsPaid={handleMarkInvoiceAsPaid}
            loading={loading}
          />
        )}

        {/* Upload Modal */}
        <UploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUploadDocument}
          uploading={uploadingFile}
        />
      </div>
    </div>
  )
}

export default PartnerDocuments