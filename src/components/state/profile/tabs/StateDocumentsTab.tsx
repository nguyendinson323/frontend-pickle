import React, { useEffect, useState } from 'react'
import { FiFileText, FiUpload, FiFolder, FiEye, FiEdit, FiTrash2, FiDownload, FiActivity, FiLoader, FiPlusCircle, FiSettings, FiBarChart, FiDatabase, FiImage, FiFile } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../../store'
import { fetchStateDocuments, deleteStateDocument } from '../../../../store/slices/stateDocumentsSlice'

export const StateDocumentsTab: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const {
    documents,
    stats,
    error
  } = useSelector((state: RootState) => state.stateDocuments)
  const { isLoading } = useSelector((state: RootState) => state.loading)

  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    dispatch(fetchStateDocuments())
  }, [dispatch])

  const getDocumentIcon = (fileType: string) => {
    const type = fileType.toLowerCase()
    if (type.includes('pdf')) return '📄'
    if (type.includes('doc') || type.includes('docx')) return '📝'
    if (type.includes('xls') || type.includes('xlsx')) return '📊'
    if (type.includes('ppt') || type.includes('pptx')) return '📋'
    if (type.includes('jpg') || type.includes('jpeg') || type.includes('png')) return '🖼️'
    return '📁'
  }


  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`

    return date.toLocaleDateString()
  }

  const handleDeleteDocument = async (documentId: number) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      dispatch(deleteStateDocument(documentId))
    }
  }

  const filteredDocuments = selectedCategory === 'all'
    ? documents
    : documents.filter(doc => doc.file_type === selectedCategory)

  if (isLoading && !documents.length) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header Section with Modern Design */}
      <div className="bg-gradient-to-br from-white to-orange-50 rounded-3xl shadow-2xl border-2 border-gray-200/50 p-8 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-red-600 rounded-3xl flex items-center justify-center shadow-xl">
              <FiFileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-orange-900 via-red-900 to-pink-900 bg-clip-text text-transparent mb-2">Document Management Hub</h3>
              <p className="text-lg text-gray-600 font-medium">Organize and manage your state committee's documents and files with advanced tools</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/state/documents?action=upload')}
              className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-bold rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <FiUpload className="w-5 h-5 mr-3" />
              Upload Document
            </button>
            <button
              onClick={() => navigate('/state/documents')}
              className="flex items-center justify-center px-8 py-4 border-2 border-orange-300 text-orange-700 font-bold rounded-3xl hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 transform hover:scale-105 transition-all duration-300"
            >
              <FiSettings className="w-5 h-5 mr-3" />
              Manage All
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Document Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Total Documents</p>
              <p className="text-2xl font-bold text-blue-900">{stats?.total_documents || 0}</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Recent Uploads</p>
              <p className="text-2xl font-bold text-green-900">{stats?.recent_activity || 0}</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Categories</p>
              <p className="text-2xl font-bold text-purple-900">{Object.keys(stats?.documents_by_type || {}).length}</p>
            </div>
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">Storage Used</p>
              <p className="text-lg font-bold text-orange-900">
                N/A
              </p>
            </div>
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      {stats?.documents_by_type && Object.keys(stats.documents_by_type).length > 0 && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedCategory === 'all'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Documents
            </button>
            {Object.keys(stats.documents_by_type).map((fileType: string) => (
              <button
                key={fileType}
                onClick={() => setSelectedCategory(fileType)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedCategory === fileType
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {fileType} ({stats.documents_by_type[fileType]})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Documents List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h4 className="font-medium text-gray-900">
            {selectedCategory === 'all' ? 'All Documents' : `${selectedCategory} Documents`}
          </h4>
        </div>

        {filteredDocuments.length === 0 ? (
          <div className="text-center py-8">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Documents</h4>
            <p className="text-gray-600 mb-4">
              {selectedCategory === 'all'
                ? "You haven't uploaded any documents yet."
                : `No documents found in the ${selectedCategory} category.`
              }
            </p>
            <button
              onClick={() => navigate('/state/documents?action=upload')}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Upload Your First Document
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredDocuments.slice(0, 5).map((document) => (
              <div key={document.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <span className="text-2xl">{getDocumentIcon(document.file_type || '')}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h5 className="text-sm font-medium text-gray-900 truncate">
                          {document.title}
                        </h5>
                        {document.is_public && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Public
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{document.description || 'No description'}</p>
                      <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500">
                        <span>Type: {document.file_type || 'Unknown'}</span>
                        <span>Uploaded: {formatTimeAgo(document.created_at)}</span>
                        <span>By: {document.owner.username}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => window.open(document.document_url, '_blank')}
                      className="text-blue-600 hover:text-blue-700 text-sm"
                      title="View Document"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => navigate(`/state/documents/${document.id}/edit`)}
                      className="text-gray-600 hover:text-gray-700 text-sm"
                      title="Edit Document"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteDocument(document.id)}
                      className="text-red-600 hover:text-red-700 text-sm"
                      title="Delete Document"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredDocuments.length > 5 && (
          <div className="p-4 border-t border-gray-200 text-center">
            <button
              onClick={() => navigate('/state/documents')}
              className="inline-flex items-center px-4 py-2 text-red-600 hover:text-red-700 font-medium"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View All {filteredDocuments.length} Documents
            </button>
          </div>
        )}
      </div>

      {/* Recent Uploads Section */}
      {documents && documents.length > 0 && (
        <div className="mt-6 bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h4 className="font-medium text-gray-900">Recent Uploads</h4>
          </div>
          <div className="divide-y divide-gray-200">
            {documents.slice(0, 3).map((upload) => (
              <div key={upload.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getDocumentIcon(upload.file_type || '')}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{upload.title}</p>
                    <p className="text-xs text-gray-500">
                      {formatTimeAgo(upload.created_at)} • by {upload.owner.username}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => window.open(upload.document_url, '_blank')}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/state/documents?action=upload')}
          className="flex items-center justify-center px-4 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Upload Document
        </button>
        <button
          onClick={() => navigate('/state/documents?action=create-category')}
          className="flex items-center justify-center px-4 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create Category
        </button>
        <button
          onClick={() => navigate('/state/documents?view=archive')}
          className="flex items-center justify-center px-4 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8l6 6m0 0l6-6m-6 6v9" />
          </svg>
          View Archive
        </button>
      </div>
    </div>
  )
}