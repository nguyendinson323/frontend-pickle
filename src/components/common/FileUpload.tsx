import React, { useRef, useState } from 'react'

interface FileUploadProps {
  accept?: string
  onFileSelect: (cloudinaryUrl: string | null) => void
  error?: string
  helpText?: string
  maxSize?: number // in MB
  uploadEndpoint?: string
}

const FileUpload: React.FC<FileUploadProps> = ({
  accept = '*',
  onFileSelect,
  error,
  helpText,
  maxSize = 10,
  uploadEndpoint = '/api/upload/document'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [cloudinaryUrl, setCloudinaryUrl] = useState<string>('')

  const uploadToBackend = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${import.meta.env.VITE_API_URL}${uploadEndpoint}`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error('Failed to upload file')
    }

    const data = await response.json()
    return data.cloudinaryUrl
  }

  const handleFileChange = async (file: File | null) => {
    if (!file) {
      setSelectedFile(null)
      setCloudinaryUrl('')
      onFileSelect(null)
      return
    }

    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`)
      return
    }

    try {
      setIsUploading(true)
      setSelectedFile(file)
      
      const cloudinaryUrl = await uploadToBackend(file)
      setCloudinaryUrl(cloudinaryUrl)
      onFileSelect(cloudinaryUrl)
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Failed to upload file. Please try again.')
      setSelectedFile(null)
      onFileSelect(null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    handleFileChange(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const file = e.dataTransfer.files?.[0] || null
    if (file) {
      handleFileChange(file)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const removeFile = () => {
    setSelectedFile(null)
    setCloudinaryUrl('')
    onFileSelect(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />

      {!selectedFile ? (
        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
            isUploading 
              ? 'cursor-not-allowed opacity-50'
              : 'cursor-pointer'
          } ${
            dragOver
              ? 'border-blue-400 bg-blue-50'
              : error
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }`}
        >
          <div className="flex flex-col items-center">
            <svg
              className={`w-12 h-12 mb-4 ${
                error ? 'text-red-400' : 'text-gray-400'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <h3 className={`text-lg font-medium mb-2 ${error ? 'text-red-700' : 'text-gray-700'}`}>
              {isUploading ? 'Uploading...' : 'Upload File'}
            </h3>
            <p className={`text-sm mb-2 ${error ? 'text-red-600' : 'text-gray-600'}`}>
              {isUploading ? 'Please wait...' : 'Click to browse or drag and drop'}
            </p>
            {helpText && (
              <p className={`text-xs ${error ? 'text-red-500' : 'text-gray-500'}`}>
                {helpText}
              </p>
            )}
            <p className={`text-xs mt-1 ${error ? 'text-red-500' : 'text-gray-500'}`}>
              Maximum file size: {maxSize}MB
            </p>
          </div>
        </div>
      ) : (
        <div className="border border-gray-300 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="text-red-600 hover:text-red-800 p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}

export default FileUpload