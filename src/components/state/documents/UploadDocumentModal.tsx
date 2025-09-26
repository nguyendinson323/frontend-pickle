import React, { useState } from 'react'
import { FiUpload, FiX, FiFileText, FiFolder, FiUser, FiEye, FiLock, FiLoader, FiCheckCircle, FiFile, FiImage, FiDatabase } from 'react-icons/fi'

interface UploadDocumentModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (formData: FormData) => void
  loading: boolean
}

const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  loading
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    document_type: 'other',
    related_entity_type: '',
    related_entity_id: '',
    is_public: false
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const documentTypes = [
    { value: 'invoice', label: 'Invoice' },
    { value: 'contract', label: 'Contract' },
    { value: 'report', label: 'Report' },
    { value: 'certificate', label: 'Certificate' },
    { value: 'policy', label: 'Policy' },
    { value: 'other', label: 'Other' }
  ]

  const entityTypes = [
    { value: '', label: 'None' },
    { value: 'tournament', label: 'Tournament' },
    { value: 'club', label: 'Club' },
    { value: 'partner', label: 'Partner' },
    { value: 'player', label: 'Player' },
    { value: 'coach', label: 'Coach' },
    { value: 'general', label: 'General' }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedFile) {
      alert('Please select a file to upload')
      return
    }

    const uploadFormData = new FormData()
    uploadFormData.append('document', selectedFile)
    uploadFormData.append('title', formData.title)
    uploadFormData.append('description', formData.description)
    uploadFormData.append('document_type', formData.document_type)
    uploadFormData.append('related_entity_type', formData.related_entity_type)
    uploadFormData.append('related_entity_id', formData.related_entity_id)
    uploadFormData.append('is_public', formData.is_public.toString())

    onUpload(uploadFormData)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      document_type: 'other',
      related_entity_type: '',
      related_entity_id: '',
      is_public: false
    })
    setSelectedFile(null)
  }

  const handleClose = () => {
    if (!loading) {
      resetForm()
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-3xl shadow-2xl border-2 border-gray-200/50 w-full max-w-4xl max-h-[90vh] overflow-y-auto backdrop-blur-sm">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl">
                <FiUpload className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900">Upload Document</h3>
                <p className="text-gray-600 font-medium">Add a new document to your library</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={loading}
              className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* File Upload Section */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 border-2 border-blue-200/50">
              <div className="flex items-center space-x-3 mb-6">
                <FiFile className="w-6 h-6 text-blue-600" />
                <h4 className="text-xl font-bold text-gray-900">Select File</h4>
                <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent"></div>
              </div>

              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
                  required
                  disabled={loading}
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 text-sm font-medium shadow-lg transition-all duration-200"
                />
                {selectedFile && (
                  <div className="mt-4 p-4 bg-white/60 rounded-2xl backdrop-blur-sm flex items-center space-x-3">
                    <FiCheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-900">{selectedFile.name}</span>
                    <span className="text-sm text-gray-600">({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-white/60 p-4 rounded-2xl backdrop-blur-sm flex items-center space-x-2">
                  <FiFileText className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-bold text-gray-700">PDF</span>
                </div>
                <div className="bg-white/60 p-4 rounded-2xl backdrop-blur-sm flex items-center space-x-2">
                  <FiFileText className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-bold text-gray-700">DOC</span>
                </div>
                <div className="bg-white/60 p-4 rounded-2xl backdrop-blur-sm flex items-center space-x-2">
                  <FiDatabase className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-bold text-gray-700">Excel</span>
                </div>
                <div className="bg-white/60 p-4 rounded-2xl backdrop-blur-sm flex items-center space-x-2">
                  <FiImage className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-bold text-gray-700">Images</span>
                </div>
              </div>

              <p className="text-sm text-blue-700 font-medium mt-4 bg-blue-100/50 p-3 rounded-2xl">
                📁 Supported formats: PDF, DOC, DOCX, XLS, XLSX, TXT, JPG, PNG (Max 10MB)
              </p>
            </div>

            {/* Title Section */}
            <div className="bg-white/60 rounded-3xl p-8 backdrop-blur-sm">
              <div className="flex items-center space-x-3 mb-6">
                <FiFileText className="w-6 h-6 text-gray-600" />
                <h4 className="text-xl font-bold text-gray-900">Document Details</h4>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Document Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 text-sm font-medium shadow-lg transition-all duration-200"
                  placeholder="Enter a descriptive title for your document"
                />
              </div>
            </div>

            {/* Description Section */}
            <div className="bg-white/60 rounded-3xl p-8 backdrop-blur-sm">
              <div className="flex items-center space-x-3 mb-6">
                <FiFolder className="w-6 h-6 text-gray-600" />
                <h4 className="text-xl font-bold text-gray-900">Description</h4>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Document Description (Optional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={loading}
                  rows={4}
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 text-sm font-medium shadow-lg transition-all duration-200"
                  placeholder="Provide additional context or description for this document..."
                />
              </div>
            </div>

            {/* Categories and Classification */}
            <div className="bg-white/60 rounded-3xl p-8 backdrop-blur-sm">
              <div className="flex items-center space-x-3 mb-6">
                <FiFolder className="w-6 h-6 text-gray-600" />
                <h4 className="text-xl font-bold text-gray-900">Classification</h4>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Document Type *
                  </label>
                  <div className="relative">
                    <FiFileText className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      name="document_type"
                      value={formData.document_type}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 text-sm font-medium shadow-lg appearance-none transition-all duration-200"
                    >
                      {documentTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Related To (Optional)
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      name="related_entity_type"
                      value={formData.related_entity_type}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 text-sm font-medium shadow-lg appearance-none transition-all duration-200"
                    >
                      {entityTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Entity ID Field (conditional) */}
            {formData.related_entity_type && (
              <div className="bg-white/60 rounded-3xl p-8 backdrop-blur-sm">
                <div className="flex items-center space-x-3 mb-6">
                  <FiUser className="w-6 h-6 text-gray-600" />
                  <h4 className="text-xl font-bold text-gray-900">Entity Reference</h4>
                  <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Related Entity ID
                  </label>
                  <input
                    type="number"
                    name="related_entity_id"
                    value={formData.related_entity_id}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full px-6 py-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 text-sm font-medium shadow-lg transition-all duration-200"
                    placeholder="Enter the specific entity ID this document relates to"
                  />
                </div>
              </div>
            )}

            {/* Visibility Settings */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 border-2 border-green-200/50">
              <div className="flex items-center space-x-3 mb-6">
                <FiEye className="w-6 h-6 text-green-600" />
                <h4 className="text-xl font-bold text-gray-900">Visibility Settings</h4>
                <div className="flex-1 h-px bg-gradient-to-r from-green-200 to-transparent"></div>
              </div>

              <div className="flex items-center justify-between bg-white/60 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    name="is_public"
                    checked={formData.is_public}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="h-6 w-6 text-green-600 focus:ring-green-500 border-gray-300 rounded-xl disabled:opacity-50 transition-all duration-200"
                    id="visibility-toggle"
                  />
                  <label htmlFor="visibility-toggle" className="flex items-center space-x-3">
                    {formData.is_public ? (
                      <FiEye className="w-6 h-6 text-green-600" />
                    ) : (
                      <FiLock className="w-6 h-6 text-gray-600" />
                    )}
                    <div>
                      <span className="text-lg font-bold text-gray-900">
                        {formData.is_public ? 'Public Document' : 'Private Document'}
                      </span>
                      <p className="text-sm text-gray-600">
                        {formData.is_public
                          ? 'This document will be visible to other users'
                          : 'This document will only be visible to you and administrators'
                        }
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-8">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="flex items-center justify-center px-8 py-4 border-2 border-gray-300 rounded-2xl text-gray-700 font-bold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FiX className="w-5 h-5 mr-2" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !selectedFile || !formData.title}
                className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
              >
                {loading ? (
                  <>
                    <FiLoader className="w-5 h-5 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <FiUpload className="w-5 h-5 mr-2" />
                    Upload Document
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UploadDocumentModal