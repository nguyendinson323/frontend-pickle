import React, { useState } from 'react'

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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center pb-3">
          <h3 className="text-lg font-bold text-gray-900">Upload Document</h3>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              File *
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            <p className="text-xs text-gray-500 mt-1">
              Supported formats: PDF, DOC, DOCX, XLS, XLSX, TXT, JPG, PNG (Max 10MB)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              placeholder="Enter document title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              disabled={loading}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              placeholder="Enter document description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Type *
              </label>
              <select
                name="document_type"
                value={formData.document_type}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {documentTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Related To
              </label>
              <select
                name="related_entity_type"
                value={formData.related_entity_type}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {entityTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {formData.related_entity_type && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Related Entity ID
              </label>
              <input
                type="number"
                name="related_entity_id"
                value={formData.related_entity_id}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                placeholder="Enter entity ID"
              />
            </div>
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_public"
              checked={formData.is_public}
              onChange={handleInputChange}
              disabled={loading}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Make this document public
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover: transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedFile}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'Upload Document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UploadDocumentModal