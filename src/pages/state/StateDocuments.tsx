import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState, AppDispatch } from '../../store'
import {
  fetchStateDocuments,
  updateStateDocument,
  deleteStateDocument,
  downloadStateDocument,
  setSelectedDocument,
  setFilters,
  saveStateDocumentMetadata
} from '../../store/slices/stateDocumentsSlice'
import SimpleImageUpload from '../../components/common/SimpleImageUpload'

const StateDocuments: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)
  const { 
    documents, 
    stats, 
    selectedDocument, 
    loading, 
    error, 
    filters 
  } = useSelector((state: RootState) => state.stateDocuments)

  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedTab, setSelectedTab] = useState<'documents' | 'stats'>('documents')
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    is_public: false,
    document_url: ''
  })
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    is_public: false
  })
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== 'state') {
      navigate('/login')
      return
    }
    
    dispatch(fetchStateDocuments())
  }, [user, navigate, dispatch, isAuthenticated])

  useEffect(() => {
    if (selectedDocument) {
      setEditForm({
        title: selectedDocument.title,
        description: selectedDocument.description || '',
        is_public: selectedDocument.is_public
      })
    }
  }, [selectedDocument])

  const handleSearch = () => {
    dispatch(setFilters({ search: searchTerm }))
    dispatch(fetchStateDocuments())
  }

  const handleFilterChange = (filterKey: string, value: any) => {
    dispatch(setFilters({ [filterKey]: value }))
    dispatch(fetchStateDocuments())
  }

  const handleFileUpload = (url: string) => {
    setUploadForm({ ...uploadForm, document_url: url })
  }

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!uploadForm.document_url) {
      alert('Please upload a file first')
      return
    }

    if (!uploadForm.title) {
      alert('Please enter a title')
      return
    }

    try {
      // Save document metadata to backend
      await dispatch(saveStateDocumentMetadata({
        title: uploadForm.title,
        description: uploadForm.description,
        is_public: uploadForm.is_public,
        document_url: uploadForm.document_url
      }))

      setShowUploadModal(false)
      setUploadForm({
        title: '',
        description: '',
        is_public: false,
        document_url: ''
      })

      // Refresh documents list to get updated data from server
      dispatch(fetchStateDocuments())
    } catch (error) {
      console.error('Save failed:', error)
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedDocument) return

    try {
      await dispatch(updateStateDocument(selectedDocument.id, editForm))
      setShowEditModal(false)
      dispatch(setSelectedDocument(null))
    } catch (error) {
      console.error('Update failed:', error)
    }
  }

  const handleDelete = async (documentId: number) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await dispatch(deleteStateDocument(documentId))
      } catch (error) {
        console.error('Delete failed:', error)
      }
    }
  }

  const handleDownload = (documentId: number) => {
    dispatch(downloadStateDocument(documentId))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getFileTypeIcon = (fileType: string | null) => {
    if (!fileType) return '📄'
    if (fileType.includes('pdf')) return '📋'
    if (fileType.includes('image')) return '🖼️'
    if (fileType.includes('word') || fileType.includes('doc')) return '📝'
    if (fileType.includes('excel') || fileType.includes('sheet')) return '📊'
    return '📄'
  }

  if (!user || user.role !== 'state') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <button
                  onClick={() => navigate('/')}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <div className="flex items-center">
                  <svg
                    className="flex-shrink-0 h-5 w-5 text-gray-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                  </svg>
                  <button
                    onClick={() => navigate('/state/dashboard')}
                    className="ml-4 text-gray-400 hover:text-gray-500 transition-colors"
                  >
                    State Dashboard
                  </button>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <svg
                    className="flex-shrink-0 h-5 w-5 text-gray-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                  </svg>
                  <span className="ml-4 text-sm font-medium text-gray-500" aria-current="page">
                    Documents
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Management</h1>
              <p className="text-gray-600">
                Upload, manage, and download official state committee documents and files
              </p>
            </div>
            <div className="mt-4 lg:mt-0">
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Upload Document
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="ml-3 text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setSelectedTab('documents')}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'documents'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Documents ({documents.length})
            </button>
            <button
              onClick={() => setSelectedTab('stats')}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'stats'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Statistics
            </button>
          </nav>
        </div>

        {selectedTab === 'documents' && (
          <>
            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search Documents</label>
                  <div className="flex">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by title or description..."
                      className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    />
                    <button
                      onClick={handleSearch}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-r-md text-sm font-medium transition-colors"
                    >
                      Search
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">File Type</label>
                  <select
                    value={filters.file_type}
                    onChange={(e) => handleFilterChange('file_type', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">All Types</option>
                    <option value="pdf">PDF</option>
                    <option value="doc">Word Document</option>
                    <option value="excel">Excel</option>
                    <option value="image">Image</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
                  <select
                    value={filters.is_public === null ? '' : filters.is_public.toString()}
                    onChange={(e) => handleFilterChange('is_public', e.target.value === '' ? null : e.target.value === 'true')}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">All Documents</option>
                    <option value="true">Public</option>
                    <option value="false">Private</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Documents List */}
            <div className="bg-white rounded-lg shadow border border-gray-200">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading documents...</p>
                </div>
              ) : documents.length === 0 ? (
                <div className="p-8 text-center">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-600">No documents found</p>
                  <p className="text-gray-400 text-sm mt-1">Upload your first document to get started</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {documents.map((document) => (
                    <div key={document.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl">
                            {getFileTypeIcon(document.file_type)}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900">{document.title}</h3>
                            {document.description && (
                              <p className="text-gray-600 text-sm mt-1">{document.description}</p>
                            )}
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                              <span>Type: {document.file_type || 'Unknown'}</span>
                              <span>Uploaded: {formatDate(document.created_at)}</span>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                document.is_public 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {document.is_public ? 'Public' : 'Private'}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleDownload(document.id)}
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                          >
                            Download
                          </button>
                          <button
                            onClick={() => {
                              dispatch(setSelectedDocument(document))
                              setShowEditModal(true)
                            }}
                            className="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(document.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {selectedTab === 'stats' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-lg p-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Documents</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_documents}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-green-100 rounded-lg p-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Public Documents</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.public_documents}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-yellow-100 rounded-lg p-3">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Private Documents</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.private_documents}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-purple-100 rounded-lg p-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Recent Activity</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.recent_activity}</p>
                  <p className="text-xs text-gray-500">Last 7 days</p>
                </div>
              </div>
            </div>

            {/* Documents by Type Chart */}
            <div className="md:col-span-2 lg:col-span-4 bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Documents by Type</h3>
              <div className="space-y-3">
                {Object.entries(stats.documents_by_type).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getFileTypeIcon(type)}</span>
                      <span className="text-sm font-medium text-gray-700 capitalize">{type}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-gray-200 rounded-full h-2 flex-1 w-24">
                        <div 
                          className="bg-red-600 h-2 rounded-full" 
                          style={{ 
                            width: `${stats.total_documents > 0 ? (count / stats.total_documents) * 100 : 0}%` 
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Document</h3>
              <form onSubmit={handleUploadSubmit}>
                <div className="space-y-6">
                  {/* File Upload */}
                  <div>
                    <SimpleImageUpload
                      fieldName="document_url"
                      fileType="document"
                      value={uploadForm.document_url}
                      onChange={handleFileUpload}
                      required
                      title="Document Upload"
                      enableCropping={false}
                      icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                      placeholder="Enter document title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                      rows={3}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                      placeholder="Enter document description (optional)"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_public"
                      checked={uploadForm.is_public}
                      onChange={(e) => setUploadForm({ ...uploadForm, is_public: e.target.checked })}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_public" className="ml-2 text-sm text-gray-700">
                      Make this document public (visible to other users)
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUploadModal(false)
                      setUploadForm({
                        title: '',
                        description: '',
                        is_public: false,
                        document_url: ''
                      })
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !uploadForm.document_url || !uploadForm.title}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Document'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && selectedDocument && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Document</h3>
              <form onSubmit={handleEditSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      rows={3}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="edit_is_public"
                      checked={editForm.is_public}
                      onChange={(e) => setEditForm({ ...editForm, is_public: e.target.checked })}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="edit_is_public" className="ml-2 text-sm text-gray-700">
                      Make this document public
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false)
                      dispatch(setSelectedDocument(null))
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StateDocuments