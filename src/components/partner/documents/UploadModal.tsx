import React, { useState, useCallback } from 'react'
import SimpleImageUpload from '../../common/SimpleImageUpload'
import {
  FiUpload,
  FiX,
  FiFile,
  FiFileText,
  FiCalendar,
  FiType
} from 'react-icons/fi'

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
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-8 rounded-t-3xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center text-white">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mr-4">
                <FiUpload className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">Upload Document</h3>
            </div>
            <button
              onClick={handleClose}
              disabled={uploading}
              className="text-white hover:text-gray-200 p-2 rounded-2xl hover:bg-white hover:bg-opacity-10 transition-all duration-200 disabled:cursor-not-allowed"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-pink-700 rounded-full flex items-center justify-center mr-3">
                  <FiX className="w-4 h-4 text-white" />
                </div>
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div className="bg-gradient-to-r from-gray-50 to-white border-2 border-dashed border-gray-300 rounded-2xl p-6">
              <SimpleImageUpload
                fieldName="document_url"
                fileType="document"
                value={fileUrl}
                onChange={handleFileUploadSuccess}
                required={true}
                disabled={uploading}
                title="Upload Document"
                enableCropping={false}
                icon={<FiFile className="w-8 h-8" />}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                <FiType className="w-4 h-4 mr-2 text-blue-600" />
                Document Name <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium text-gray-900 bg-gray-50 hover:bg-white transition-all duration-200"
                placeholder="Enter document name"
                disabled={uploading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                <FiFileText className="w-4 h-4 mr-2 text-green-600" />
                Document Type <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium text-gray-900 bg-gray-50 hover:bg-white transition-all duration-200"
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
              <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                <FiFileText className="w-4 h-4 mr-2 text-purple-600" />
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium text-gray-900 bg-gray-50 hover:bg-white transition-all duration-200 resize-none"
                placeholder="Optional description of the document"
                disabled={uploading}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                <FiCalendar className="w-4 h-4 mr-2 text-orange-600" />
                Expiry Date
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium text-gray-900 bg-gray-50 hover:bg-white transition-all duration-200"
                disabled={uploading}
              />
              <p className="text-sm text-gray-600 font-medium mt-2 bg-gray-50 rounded-lg p-3">
                Optional: Set an expiry date for contracts and certificates
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={handleClose}
              disabled={uploading}
              className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-bold py-3 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !fileUrl || !documentName.trim() || !documentType}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:scale-100 flex items-center justify-center"
            >
              {uploading && (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
              )}
              <FiUpload className="w-4 h-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload Document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UploadModal