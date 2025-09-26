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
import { FiHome, FiChevronRight, FiFileText, FiPlus, FiSearch, FiFilter, FiDownload, FiEdit, FiTrash, FiEye, FiLock, FiUpload, FiLoader, FiBarChart2, FiFile, FiImage, FiX } from 'react-icons/fi'

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
    if (!fileType) return FiFile
    if (fileType.includes('pdf')) return FiFileText
    if (fileType.includes('image')) return FiImage
    if (fileType.includes('word') || fileType.includes('doc')) return FiFileText
    if (fileType.includes('excel') || fileType.includes('sheet')) return FiBarChart2
    return FiFile
  }

  const getFileTypeColor = (fileType: string | null) => {
    if (!fileType) return 'from-gray-500 to-gray-600'
    if (fileType.includes('pdf')) return 'from-red-500 to-red-600'
    if (fileType.includes('image')) return 'from-green-500 to-green-600'
    if (fileType.includes('word') || fileType.includes('doc')) return 'from-blue-500 to-blue-600'
    if (fileType.includes('excel') || fileType.includes('sheet')) return 'from-orange-500 to-orange-600'
    return 'from-gray-500 to-gray-600'
  }

  if (!user || user.role !== 'state') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="bg-white p-12 rounded-3xl shadow-2xl border-2 border-gray-100 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-pulse">
            <FiLoader className="w-10 h-10 text-white animate-spin" />
          </div>
          <p className="text-xl font-bold text-gray-700">Loading Documents...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-3">
              <li>
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center px-4 py-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-2xl font-medium transition-all duration-300 border-2 border-transparent hover:border-indigo-200 shadow-lg hover:shadow-xl group"
                >
                  <FiHome className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Home
                </button>
              </li>
              <li>
                <div className="flex items-center">
                  <FiChevronRight className="flex-shrink-0 h-5 w-5 text-gray-400 mx-2" />
                  <button
                    onClick={() => navigate('/state/dashboard')}
                    className="flex items-center px-4 py-2 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-2xl font-medium transition-all duration-300 border-2 border-transparent hover:border-purple-200 shadow-lg hover:shadow-xl"
                  >
                    State Dashboard
                  </button>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <FiChevronRight className="flex-shrink-0 h-5 w-5 text-gray-400 mx-2" />
                  <div className="flex items-center px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-100 shadow-lg">
                    <FiFileText className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm font-bold text-green-700" aria-current="page">
                      Documents
                    </span>
                  </div>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-100 p-8 bg-gradient-to-r from-indigo-50 via-white to-purple-50">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center mb-6 lg:mb-0">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mr-6 shadow-xl">
                  <FiFileText className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 bg-clip-text text-transparent mb-2">Document Management</h1>
                  <p className="text-lg text-gray-600 font-medium">
                    Upload, manage, and download official state committee documents and files
                  </p>
                </div>
              </div>
              <div>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <FiPlus className="w-5 h-5 mr-3" />
                  Upload Document
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-3xl p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                <FiX className="w-5 h-5 text-white" />
              </div>
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-8">
          <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 p-2">
            <nav className="flex space-x-2" aria-label="Tabs">
              <button
                onClick={() => setSelectedTab('documents')}
                className={`flex items-center px-6 py-4 font-bold text-sm rounded-2xl transition-all duration-300 shadow-lg transform hover:scale-105 ${
                  selectedTab === 'documents'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl'
                    : 'bg-gray-50 text-gray-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-700 border-2 border-gray-200 hover:border-indigo-200'
                }`}
              >
                <FiFileText className={`w-5 h-5 mr-3 ${
                  selectedTab === 'documents' ? 'text-white' : 'text-gray-500'
                }`} />
                Documents ({documents.length})
              </button>
              <button
                onClick={() => setSelectedTab('stats')}
                className={`flex items-center px-6 py-4 font-bold text-sm rounded-2xl transition-all duration-300 shadow-lg transform hover:scale-105 ${
                  selectedTab === 'stats'
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-xl'
                    : 'bg-gray-50 text-gray-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 hover:text-orange-700 border-2 border-gray-200 hover:border-orange-200'
                }`}
              >
                <FiBarChart2 className={`w-5 h-5 mr-3 ${
                  selectedTab === 'stats' ? 'text-white' : 'text-gray-500'
                }`} />
                Statistics
              </button>
            </nav>
          </div>
        </div>

        {selectedTab === 'documents' && (
          <>
            {/* Search and Filters */}
            <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-100 p-8 mb-8">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
                  <FiFilter className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Search & Filter Documents</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-3">Search Documents</label>
                  <div className="flex">
                    <div className="relative flex-1">
                      <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by title or description..."
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-l-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium shadow-lg"
                      />
                    </div>
                    <button
                      onClick={handleSearch}
                      className="flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-r-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                    >
                      <FiSearch className="w-5 h-5 mr-2" />
                      Search
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">File Type</label>
                  <div className="relative">
                    <FiFileText className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={filters.file_type}
                      onChange={(e) => handleFilterChange('file_type', e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium shadow-lg appearance-none"
                    >
                      <option value="">All Types</option>
                      <option value="pdf">PDF</option>
                      <option value="doc">Word Document</option>
                      <option value="excel">Excel</option>
                      <option value="image">Image</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Visibility</label>
                  <div className="relative">
                    <FiEye className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={filters.is_public === null ? '' : filters.is_public.toString()}
                      onChange={(e) => handleFilterChange('is_public', e.target.value === '' ? null : e.target.value === 'true')}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium shadow-lg appearance-none"
                    >
                      <option value="">All Documents</option>
                      <option value="true">Public</option>
                      <option value="false">Private</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents List */}
            <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-100">
              {loading ? (
                <div className="p-16 text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-pulse">
                    <FiLoader className="w-10 h-10 text-white animate-spin" />
                  </div>
                  <p className="text-xl font-bold text-gray-700">Loading documents...</p>
                </div>
              ) : documents.length === 0 ? (
                <div className="p-16 text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <FiFileText className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No Documents Found</h3>
                  <p className="text-gray-600 font-medium mb-8">Upload your first document to get started with document management!</p>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 mx-auto"
                  >
                    <FiUpload className="w-5 h-5 mr-3" />
                    Upload First Document
                  </button>
                </div>
              ) : (
                <div className="divide-y-2 divide-gray-100">
                  {documents.map((document) => {
                    const IconComponent = getFileTypeIcon(document.file_type)
                    const iconColor = getFileTypeColor(document.file_type)
                    return (
                      <div key={document.id} className="p-8 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-300">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-6 flex-1">
                            <div className={`w-16 h-16 bg-gradient-to-r ${iconColor} rounded-2xl flex items-center justify-center shadow-xl`}>
                              <IconComponent className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-900 mb-2">{document.title}</h3>
                              {document.description && (
                                <p className="text-gray-600 font-medium mb-3 leading-relaxed">{document.description}</p>
                              )}
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="bg-blue-50 p-3 rounded-2xl border-2 border-blue-100">
                                  <span className="text-xs font-bold text-blue-700">Type:</span>
                                  <p className="font-bold text-blue-900">{document.file_type || 'Unknown'}</p>
                                </div>
                                <div className="bg-green-50 p-3 rounded-2xl border-2 border-green-100">
                                  <span className="text-xs font-bold text-green-700">Uploaded:</span>
                                  <p className="font-bold text-green-900">{formatDate(document.created_at)}</p>
                                </div>
                                <div className={`p-3 rounded-2xl border-2 ${
                                  document.is_public
                                    ? 'bg-emerald-50 border-emerald-100'
                                    : 'bg-gray-50 border-gray-100'
                                }`}>
                                  <span className={`text-xs font-bold ${
                                    document.is_public ? 'text-emerald-700' : 'text-gray-700'
                                  }`}>Visibility:</span>
                                  <div className="flex items-center">
                                    {document.is_public ? <FiEye className="w-4 h-4 mr-1 text-emerald-600" /> : <FiLock className="w-4 h-4 mr-1 text-gray-600" />}
                                    <p className={`font-bold ${
                                      document.is_public ? 'text-emerald-900' : 'text-gray-900'
                                    }`}>
                                      {document.is_public ? 'Public' : 'Private'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col space-y-3 ml-6">
                            <button
                              onClick={() => handleDownload(document.id)}
                              className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                            >
                              <FiDownload className="w-4 h-4 mr-2" />
                              Download
                            </button>
                            <button
                              onClick={() => {
                                dispatch(setSelectedDocument(document))
                                setShowEditModal(true)
                              }}
                              className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                            >
                              <FiEdit className="w-4 h-4 mr-2" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(document.id)}
                              className="flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                            >
                              <FiTrash className="w-4 h-4 mr-2" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {selectedTab === 'stats' && stats && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl shadow-2xl border-2 border-blue-200 p-8 hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <FiFileText className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-blue-700 mb-2">Total Documents</p>
                  <p className="text-4xl font-bold text-blue-900">{stats.total_documents}</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl shadow-2xl border-2 border-green-200 p-8 hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <FiEye className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-green-700 mb-2">Public Documents</p>
                  <p className="text-4xl font-bold text-green-900">{stats.public_documents}</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-orange-100 rounded-3xl shadow-2xl border-2 border-yellow-200 p-8 hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <FiLock className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-yellow-700 mb-2">Private Documents</p>
                  <p className="text-4xl font-bold text-yellow-900">{stats.private_documents}</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-3xl shadow-2xl border-2 border-purple-200 p-8 hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <FiBarChart2 className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-purple-700 mb-2">Recent Activity</p>
                  <p className="text-4xl font-bold text-purple-900">{stats.recent_activity}</p>
                  <p className="text-sm text-purple-600 font-medium">Last 7 days</p>
                </div>
              </div>
            </div>

            {/* Documents by Type Chart */}
            <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-100 p-8">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mr-4 shadow-xl">
                  <FiBarChart2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Documents by Type</h3>
              </div>
              <div className="space-y-6">
                {Object.entries(stats.documents_by_type).map(([type, count]) => {
                  const IconComponent = getFileTypeIcon(type)
                  const iconColor = getFileTypeColor(type)
                  const percentage = stats.total_documents > 0 ? (count / stats.total_documents) * 100 : 0
                  return (
                    <div key={type} className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-3xl border-2 border-gray-200 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 bg-gradient-to-r ${iconColor} rounded-2xl flex items-center justify-center shadow-lg`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <span className="text-lg font-bold text-gray-800 capitalize">{type}</span>
                            <p className="text-sm text-gray-600">{percentage.toFixed(1)}% of total</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-3xl font-bold text-gray-900">{count}</span>
                          <p className="text-sm text-gray-600">documents</p>
                        </div>
                      </div>
                      <div className="bg-gray-200 rounded-full h-3 shadow-inner">
                        <div
                          className={`bg-gradient-to-r ${iconColor} h-3 rounded-full shadow-lg transition-all duration-1000 ease-out`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-100 p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mr-4 shadow-xl">
                  <FiUpload className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Upload Document</h3>
              </div>
              <form onSubmit={handleUploadSubmit}>
                <div className="space-y-8">
                  {/* File Upload */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-3xl border-2 border-blue-100">
                    <SimpleImageUpload
                      fieldName="document_url"
                      fileType="document"
                      value={uploadForm.document_url}
                      onChange={handleFileUpload}
                      required
                      title="Document Upload"
                      enableCropping={false}
                      icon={
                        <FiFileText className="w-5 h-5" />
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                      className="w-full border-2 border-gray-300 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium shadow-lg"
                      placeholder="Enter document title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Description
                    </label>
                    <textarea
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                      rows={4}
                      className="w-full border-2 border-gray-300 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium shadow-lg"
                      placeholder="Enter document description (optional)"
                    />
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-3xl border-2 border-green-100">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is_public"
                        checked={uploadForm.is_public}
                        onChange={(e) => setUploadForm({ ...uploadForm, is_public: e.target.checked })}
                        className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor="is_public" className="ml-4 text-sm font-bold text-green-800">
                        Make this document public (visible to other users)
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-8">
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
                    className="flex items-center px-6 py-3 text-sm font-bold text-gray-700 bg-white border-2 border-gray-300 rounded-2xl hover:bg-gray-50 hover:border-gray-400 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <FiX className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !uploadForm.document_url || !uploadForm.title}
                    className="flex items-center px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
                  >
                    {loading ? (
                      <><FiLoader className="w-4 h-4 mr-2 animate-spin" />Saving...</>
                    ) : (
                      <><FiUpload className="w-4 h-4 mr-2" />Save Document</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && selectedDocument && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-100 p-8 w-full max-w-2xl">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full flex items-center justify-center mr-4 shadow-xl">
                  <FiEdit className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Edit Document</h3>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full border-2 border-gray-300 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 font-medium shadow-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Description
                    </label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      rows={4}
                      className="w-full border-2 border-gray-300 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 font-medium shadow-lg"
                    />
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-3xl border-2 border-green-100">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="edit_is_public"
                        checked={editForm.is_public}
                        onChange={(e) => setEditForm({ ...editForm, is_public: e.target.checked })}
                        className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor="edit_is_public" className="ml-4 text-sm font-bold text-green-800">
                        Make this document public
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-8">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false)
                      dispatch(setSelectedDocument(null))
                    }}
                    className="flex items-center px-6 py-3 text-sm font-bold text-gray-700 bg-white border-2 border-gray-300 rounded-2xl hover:bg-gray-50 hover:border-gray-400 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <FiX className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
                  >
                    {loading ? (
                      <><FiLoader className="w-4 h-4 mr-2 animate-spin" />Updating...</>
                    ) : (
                      <><FiEdit className="w-4 h-4 mr-2" />Update Document</>
                    )}
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