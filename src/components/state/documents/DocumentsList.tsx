import React from 'react'
import { Document as StateDocument } from '../../../store/slices/stateDocumentsSlice'
import { FiFileText, FiEdit, FiTrash2, FiDownload, FiEye, FiLock, FiUser, FiCalendar, FiFile, FiImage, FiDatabase, FiLoader, FiFolder } from 'react-icons/fi'

interface DocumentsListProps {
  documents: StateDocument[]
  onEdit: (document: StateDocument) => void
  onDelete: (documentId: number) => void
  loading: boolean
}

const DocumentsList: React.FC<DocumentsListProps> = ({
  documents,
  onEdit,
  onDelete,
  loading
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }


  const getDocumentTypeColor = (type: string) => {
    const colors = {
      invoice: 'from-green-500 to-emerald-600',
      contract: 'from-blue-500 to-blue-600',
      report: 'from-purple-500 to-purple-600',
      certificate: 'from-yellow-500 to-orange-600',
      policy: 'from-red-500 to-red-600',
      pdf: 'from-red-500 to-red-600',
      doc: 'from-blue-500 to-blue-600',
      docx: 'from-blue-500 to-blue-600',
      excel: 'from-green-500 to-green-600',
      image: 'from-purple-500 to-pink-600',
      other: 'from-gray-500 to-gray-600'
    }
    return colors[type as keyof typeof colors] || colors.other
  }

  const getDocumentTypeIcon = (type: string) => {
    if (!type) return FiFile
    if (type.includes('pdf')) return FiFileText
    if (type.includes('image') || type.includes('jpg') || type.includes('png')) return FiImage
    if (type.includes('word') || type.includes('doc')) return FiFileText
    if (type.includes('excel') || type.includes('sheet')) return FiDatabase
    return FiFile
  }


  if (loading) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border-2 border-gray-200/50 p-8 backdrop-blur-sm">
        <div className="flex items-center justify-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
            <FiLoader className="w-8 h-8 text-white animate-spin" />
          </div>
        </div>
        <div className="animate-pulse space-y-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gradient-to-r from-gray-100 to-gray-200 h-20 rounded-3xl shadow-lg"></div>
          ))}
        </div>
        <p className="text-center text-lg font-bold text-gray-700 mt-8">Loading documents...</p>
      </div>
    )
  }

  if (documents.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border-2 border-gray-200/50 p-16 text-center backdrop-blur-sm">
        <div className="w-24 h-24 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
          <FiFolder className="w-12 h-12 text-white" />
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-4">No Documents Found</h3>
        <p className="text-lg text-gray-600 font-medium mb-8 max-w-md mx-auto leading-relaxed">
          Your document library is empty. Start by uploading your first document to organize and manage your files.
        </p>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-6 border-2 border-blue-200/50 inline-block">
          <p className="text-sm text-blue-700 font-bold flex items-center">
            <FiFileText className="w-4 h-4 mr-2" />
            Tip: Organize documents by type for better management
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border-2 border-gray-200/50 backdrop-blur-sm">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
              <FiFileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Document Library</h3>
              <p className="text-gray-600 font-medium">{documents.length} documents found</p>
            </div>
          </div>
        </div>

        {/* Modern Card-based Layout */}
        <div className="space-y-6">
          {documents.map((document) => {
            const IconComponent = getDocumentTypeIcon(document.file_type || '')
            const colorClass = getDocumentTypeColor(document.file_type || '')
            return (
              <div key={document.id} className="bg-white rounded-3xl shadow-xl border-2 border-gray-200/50 p-8 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] backdrop-blur-sm">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
                  <div className="flex items-start space-x-6 flex-1">
                    {/* File Type Icon */}
                    <div className={`w-16 h-16 bg-gradient-to-r ${colorClass} rounded-3xl flex items-center justify-center shadow-xl flex-shrink-0`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>

                    {/* Document Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xl font-bold text-gray-900 mb-2 break-words">{document.title}</h4>
                      {document.description && (
                        <p className="text-gray-600 font-medium mb-4 leading-relaxed">{document.description}</p>
                      )}

                      {/* Metadata Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* File Type */}
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-2xl border-2 border-blue-200/50">
                          <div className="flex items-center space-x-2 mb-2">
                            <IconComponent className="w-4 h-4 text-blue-600" />
                            <span className="text-xs font-bold text-blue-700 uppercase">Type</span>
                          </div>
                          <p className="font-bold text-blue-900">{document.file_type || 'Unknown'}</p>
                        </div>

                        {/* Upload Date */}
                        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-2xl border-2 border-green-200/50">
                          <div className="flex items-center space-x-2 mb-2">
                            <FiCalendar className="w-4 h-4 text-green-600" />
                            <span className="text-xs font-bold text-green-700 uppercase">Date</span>
                          </div>
                          <p className="font-bold text-green-900">{formatDate(document.created_at)}</p>
                        </div>

                        {/* Owner */}
                        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-2xl border-2 border-purple-200/50">
                          <div className="flex items-center space-x-2 mb-2">
                            <FiUser className="w-4 h-4 text-purple-600" />
                            <span className="text-xs font-bold text-purple-700 uppercase">Owner</span>
                          </div>
                          <p className="font-bold text-purple-900">{document.owner.username}</p>
                          <p className="text-xs text-purple-600">{document.owner.email}</p>
                        </div>

                        {/* Visibility */}
                        <div className={`p-4 rounded-2xl border-2 ${
                          document.is_public
                            ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200/50'
                            : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200/50'
                        }`}>
                          <div className="flex items-center space-x-2 mb-2">
                            {document.is_public ? (
                              <FiEye className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <FiLock className="w-4 h-4 text-gray-600" />
                            )}
                            <span className={`text-xs font-bold uppercase ${
                              document.is_public ? 'text-emerald-700' : 'text-gray-700'
                            }`}>Visibility</span>
                          </div>
                          <p className={`font-bold ${
                            document.is_public ? 'text-emerald-900' : 'text-gray-900'
                          }`}>
                            {document.is_public ? 'Public' : 'Private'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-row lg:flex-col space-x-3 lg:space-x-0 lg:space-y-3 flex-shrink-0">
                    <button
                      onClick={() => {/* Add download functionality */}}
                      className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                      title="Download document"
                    >
                      <FiDownload className="w-4 h-4 mr-2" />
                      Download
                    </button>
                    <button
                      onClick={() => onEdit(document)}
                      className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                      title="Edit document"
                    >
                      <FiEdit className="w-4 h-4 mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(document.id)}
                      className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                      title="Delete document"
                    >
                      <FiTrash2 className="w-4 h-4 mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default DocumentsList