import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState, AppDispatch } from '../../store'
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
import {
  FiLoader,
  FiAlertCircle,
  FiRefreshCw,
  FiHome,
  FiChevronRight,
  FiFileText,
  FiFile
} from 'react-icons/fi'

import DocumentsHeader from '../../components/partner/documents/DocumentsHeader'
import DocumentsList from '../../components/partner/documents/DocumentsList'
import InvoicesList from '../../components/partner/documents/InvoicesList'
import UploadModal from '../../components/partner/documents/UploadModal'

const PartnerDocuments: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const {
    documents,
    invoices,
    stats,
    error,
    documentFilter,
    invoiceFilter,
    uploadingFile
  } = useSelector((state: RootState) => state.partnerDocuments)
  
  const { isLoading: loading } = useSelector((state: RootState) => state.loading)

  const [activeTab, setActiveTab] = useState<'documents' | 'invoices'>('documents')
  const [showUploadModal, setShowUploadModal] = useState(false)

  useEffect(() => {
    dispatch(fetchPartnerDocuments())
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
        await dispatch(signPartnerDocument(documentId))
      } catch (error) {
        console.error('Signing failed:', error)
      }
    }
  }

  const handleDownloadDocument = async (documentId: number) => {
    try {
      await dispatch(downloadPartnerDocument(documentId))
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-12">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-300 border-t-purple-600 mx-auto mb-6">
              <FiLoader className="h-8 w-8 text-transparent" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Loading Documents</h3>
            <p className="text-gray-600 font-medium text-lg">Please wait while we load your documents and invoices...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error && documents.length === 0 && invoices.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 shadow-2xl rounded-3xl p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-pink-700 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <FiAlertCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Error Loading Documents</h3>
            <p className="text-red-800 font-medium text-lg mb-6">{error}</p>
            <button
              onClick={() => dispatch(fetchPartnerDocuments() as any)}
              className="bg-gradient-to-r from-red-600 to-pink-700 hover:from-red-700 hover:to-pink-800 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105 flex items-center mx-auto"
            >
              <FiRefreshCw className="w-5 h-5 mr-2" />
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <button
                  onClick={() => navigate('/')}
                  className="text-gray-500 hover:text-gray-700 font-medium transition-colors duration-200 flex items-center"
                >
                  <FiHome className="w-4 h-4 mr-1" />
                  Home
                </button>
              </li>
              <li>
                <div className="flex items-center">
                  <FiChevronRight className="flex-shrink-0 h-5 w-5 text-gray-400 mx-2" />
                  <button
                    onClick={() => navigate('/partner/dashboard')}
                    className="text-gray-500 hover:text-gray-700 font-medium transition-colors duration-200"
                  >
                    Dashboard
                  </button>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <FiChevronRight className="flex-shrink-0 h-5 w-5 text-gray-400 mx-2" />
                  <span className="text-sm font-bold text-purple-600" aria-current="page">
                    Documents
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <DocumentsHeader
          stats={stats}
          onUploadDocument={() => setShowUploadModal(true)}
          loading={loading}
        />

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 shadow-2xl rounded-3xl p-8">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-pink-700 rounded-2xl flex items-center justify-center mr-4">
                <FiAlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Documents Error</h3>
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl mb-8 overflow-hidden">
          <div className="border-b-2 border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('documents')}
                className={`py-6 px-8 text-sm font-bold border-b-4 transition-all duration-200 flex items-center ${
                  activeTab === 'documents'
                    ? 'border-purple-500 text-purple-600 bg-purple-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <FiFileText className="w-5 h-5 mr-2" />
                Documents
                {documents.length > 0 && (
                  <span className="ml-3 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 text-gray-900 py-1 px-3 rounded-full text-xs font-bold">
                    {documents.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('invoices')}
                className={`py-6 px-8 text-sm font-bold border-b-4 transition-all duration-200 flex items-center ${
                  activeTab === 'invoices'
                    ? 'border-purple-500 text-purple-600 bg-purple-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <FiFile className="w-5 h-5 mr-2" />
                Invoices
                {invoices.length > 0 && (
                  <span className="ml-3 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 text-gray-900 py-1 px-3 rounded-full text-xs font-bold">
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