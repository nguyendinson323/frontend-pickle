import React from 'react'
import { PartnerDocument } from '../../../store/slices/partnerDocumentsSlice'
import {
  FiFileText,
  FiSearch,
  FiDownload,
  FiEdit,
  FiTrash2,
  FiCheckCircle,
  FiAlertCircle,
  FiFile,
  FiClock,
  FiUser
} from 'react-icons/fi'

interface DocumentsListProps {
  documents: PartnerDocument[]
  filter: {
    type: string
    status: string
    searchTerm: string
  }
  onFilterChange: (filter: Partial<{ type: string; status: string; searchTerm: string }>) => void
  onSignDocument: (documentId: number) => void
  onDownloadDocument: (documentId: number) => void
  onDeleteDocument: (documentId: number) => void
  loading: boolean
}

const DocumentsList: React.FC<DocumentsListProps> = ({
  documents,
  filter,
  onFilterChange,
  onSignDocument,
  onDownloadDocument,
  onDeleteDocument,
  loading
}) => {
  const getDocumentTypeColor = (type: string) => {
    const colors = {
      contract: 'bg-purple-100 text-purple-800',
      invoice: 'bg-green-100 text-green-800',
      agreement: 'bg-blue-100 text-blue-800',
      certificate: 'bg-yellow-100 text-yellow-800',
      other: 'bg-gray-100 text-gray-800'
    }
    return colors[type as keyof typeof colors] || colors.other
  }

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800'
    }
    return colors[status as keyof typeof colors] || colors.pending
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const filteredDocuments = documents.filter(doc => {
    if (filter.type && doc.document_type !== filter.type) return false
    if (filter.status && doc.status !== filter.status) return false
    if (filter.searchTerm) {
      const searchLower = filter.searchTerm.toLowerCase()
      return (
        doc.document_name.toLowerCase().includes(searchLower) ||
        doc.document_type.toLowerCase().includes(searchLower) ||
        doc.description?.toLowerCase().includes(searchLower)
      )
    }
    return true
  })

  const isExpiringSoon = (expiryDate: string | null) => {
    if (!expiryDate) return false
    const expiry = new Date(expiryDate)
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    return expiry <= thirtyDaysFromNow && expiry > new Date()
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl overflow-hidden">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b-2 border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mr-3">
              <FiFileText className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Documents</h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={filter.searchTerm}
                onChange={(e) => onFilterChange({ searchTerm: e.target.value })}
                className="pl-10 pr-4 py-3 border-2 border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium text-gray-900 bg-gray-50 hover:bg-white transition-all duration-200 placeholder-gray-500"
              />
            </div>

            <select
              value={filter.type}
              onChange={(e) => onFilterChange({ type: e.target.value })}
              className="px-4 py-3 border-2 border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium text-gray-900 bg-gray-50 hover:bg-white transition-all duration-200"
            >
              <option value="">All Types</option>
              <option value="contract">Contract</option>
              <option value="invoice">Invoice</option>
              <option value="agreement">Agreement</option>
              <option value="certificate">Certificate</option>
              <option value="other">Other</option>
            </select>

            <select
              value={filter.status}
              onChange={(e) => onFilterChange({ status: e.target.value })}
              className="px-4 py-3 border-2 border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium text-gray-900 bg-gray-50 hover:bg-white transition-all duration-200"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="expired">Expired</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-purple-600 mx-auto mb-6"></div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Loading Documents</h3>
            <p className="text-gray-600 font-medium">Please wait while we load your documents...</p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <FiFile className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {filter.type || filter.status || filter.searchTerm
                ? 'No Documents Found'
                : 'No Documents Uploaded'}
            </h3>
            <p className="text-gray-600 font-medium text-lg">
              {filter.type || filter.status || filter.searchTerm
                ? 'Try adjusting your filters to see more documents.'
                : 'Upload documents to start managing your contracts and agreements.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDocuments.map((document) => (
              <div key={document.id} className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-200 shadow-md">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mr-3">
                          <FiFile className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 truncate">
                          {document.document_name}
                        </h3>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-2xl border shadow-md ${getDocumentTypeColor(document.document_type)}`}>
                          <FiFileText className="w-3 h-3 mr-1" />
                          {document.document_type}
                        </span>
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-2xl border shadow-md ${getStatusColor(document.status)}`}>
                          <FiCheckCircle className="w-3 h-3 mr-1" />
                          {document.status}
                        </span>
                        {document.document_type === 'contract' && !document.is_signed && (
                          <span className="inline-flex items-center px-3 py-1 text-xs font-bold rounded-2xl bg-gradient-to-r from-orange-100 to-orange-200 border border-orange-300 text-orange-800">
                            <FiEdit className="w-3 h-3 mr-1" />
                            Unsigned
                          </span>
                        )}
                        {document.is_signed && (
                          <span className="inline-flex items-center px-3 py-1 text-xs font-bold rounded-2xl bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 text-green-800">
                            <FiCheckCircle className="w-3 h-3 mr-1" />
                            Signed
                          </span>
                        )}
                        {isExpiringSoon(document.expiry_date) && (
                          <span className="inline-flex items-center px-3 py-1 text-xs font-bold rounded-2xl bg-gradient-to-r from-red-100 to-pink-100 border border-red-200 text-red-800">
                            <FiAlertCircle className="w-3 h-3 mr-1" />
                            Expiring Soon
                          </span>
                        )}
                      </div>
                    </div>

                    {document.description && (
                      <p className="text-sm text-gray-700 font-medium mb-4 bg-gray-50 rounded-lg p-3">{document.description}</p>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <FiFile className="w-4 h-4 mr-2 text-blue-600" />
                        <span className="font-medium">Size: {formatFileSize(document.file_size)}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FiClock className="w-4 h-4 mr-2 text-green-600" />
                        <span className="font-medium">Uploaded: {formatDate(document.uploaded_at)}</span>
                      </div>
                      {document.expiry_date && (
                        <div className="flex items-center text-gray-600">
                          <FiAlertCircle className="w-4 h-4 mr-2 text-orange-600" />
                          <span className="font-medium">Expires: {formatDate(document.expiry_date)}</span>
                        </div>
                      )}
                      <div className="flex items-center text-gray-600">
                        <FiUser className="w-4 h-4 mr-2 text-purple-600" />
                        <span className="font-medium">By: {document.uploaded_by_name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 lg:mt-0 lg:ml-6 flex-shrink-0">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onDownloadDocument(document.id)}
                        className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-2 px-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105 flex items-center"
                        title="Download"
                      >
                        <FiDownload className="w-4 h-4 mr-2" />
                        Download
                      </button>

                      {document.document_type === 'contract' && !document.is_signed && (
                        <button
                          onClick={() => onSignDocument(document.id)}
                          className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-bold py-2 px-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105 flex items-center"
                          title="Sign Document"
                        >
                          <FiEdit className="w-4 h-4 mr-2" />
                          Sign
                        </button>
                      )}

                      <button
                        onClick={() => onDeleteDocument(document.id)}
                        className="bg-gradient-to-r from-red-600 to-pink-700 hover:from-red-700 hover:to-pink-800 text-white font-bold py-2 px-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105 flex items-center"
                        title="Delete"
                      >
                        <FiTrash2 className="w-4 h-4 mr-2" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DocumentsList