import React, { useState, useCallback } from 'react'
import SimpleImageUpload from '../../common/SimpleImageUpload'

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (formData: FormData) => Promise<any>
  uploading: boolean
}

const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  uploading
}) => {
  const [fileUrl, setFileUrl] = useState('')
  const [documentName, setDocumentName] = useState('')
  const [documentType, setDocumentType] = useState('')
  const [description, setDescription] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [error, setError] = useState('')
  const [isFileUploaded, setIsFileUploaded] = useState(false)

  const handleFileUploadSuccess = useCallback((url: string) => {
    setFileUrl(url)
    setIsFileUploaded(true)
    setError('')
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!fileUrl) {
      setError('Please upload a file first')
      return
    }

    if (!documentName.trim()) {
      setError('Please provide a document name')
      return
    }

    if (!documentType) {
      setError('Please select a document type')
      return
    }

    try {
      // Create a fake file from the URL to maintain compatibility
      const response = await fetch(fileUrl)
      const blob = await response.blob()
      const file = new File([blob], documentName, { type: blob.type })

      const formData = new FormData()
      formData.append('file', file)
      formData.append('document_name', documentName.trim())
      formData.append('document_type', documentType)
      if (description.trim()) {
        formData.append('description', description.trim())
      }
      if (expiryDate) {
        formData.append('expiry_date', expiryDate)
      }

      await onUpload(formData)
      handleClose()
    } catch (error) {
      setError('Failed to upload document. Please try again.')
    }
  }

  const handleClose = () => {
    setFileUrl('')
    setDocumentName('')
    setDocumentType('')
    setDescription('')
    setExpiryDate('')
    setError('')
    setIsFileUploaded(false)
    onClose()
  }


  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center pb-3">
          <h3 className="text-lg font-bold text-gray-900">Upload Document</h3>
          <button
            onClick={handleClose}
            disabled={uploading}
            className="text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <SimpleImageUpload
                fieldName="document_url"
                fileType="document"
                value={fileUrl}
                onChange={handleFileUploadSuccess}
                required={true}
                disabled={uploading}
                title="Upload Document"
                enableCropping={false}
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter document name"
                disabled={uploading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Type <span className="text-red-500">*</span>
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                disabled={uploading}
                required
              >
                <option value="">Select document type</option>
                <option value="contract">Contract</option>
                <option value="invoice">Invoice</option>
                <option value="agreement">Agreement</option>
                <option value="certificate">Certificate</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Optional description of the document"
                disabled={uploading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                disabled={uploading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Optional: Set an expiry date for contracts and certificates
              </p>
            </div>
          </div>

          <div className="flex justify-end mt-6 gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={uploading}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !fileUrl || !documentName.trim() || !documentType}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {uploading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              )}
              {uploading ? 'Uploading...' : 'Upload Document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UploadModal