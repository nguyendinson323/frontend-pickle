import React, { useCallback } from 'react'
import { uploadFile, getUploadConfig, supportsCropping, getAcceptedFiles, UploadType } from '../../services/centralizedUpload'

interface SimpleImageUploadProps {
  uploadType: UploadType
  value: string
  onChange: (url: string) => void
  required?: boolean
  disabled?: boolean
  className?: string
  title?: string
  onUploadComplete?: (url: string) => void
}

const SimpleImageUpload: React.FC<SimpleImageUploadProps> = ({
  uploadType,
  value,
  onChange,
  required = false,
  disabled = false,
  className = '',
  title,
  onUploadComplete,
}) => {
  const config = getUploadConfig(uploadType)
  const needsCropping = supportsCropping(uploadType)
  const acceptedFiles = getAcceptedFiles(uploadType)

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Basic validation
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    try {
      // For documents, upload directly without cropping
      const uploadResponse = await uploadFile(file, uploadType)

      // Update parent immediately
      onChange(uploadResponse.secure_url)
      if (onUploadComplete) {
        onUploadComplete(uploadResponse.secure_url)
      }
    } catch (error: any) {
      console.error('Upload failed:', error)
      alert('Upload failed. Please try again.')
    }

    // Clear input
    e.target.value = ''
  }, [uploadType, onChange, onUploadComplete])

  return (
    <div className={`p-4 border rounded ${className}`}>
      <label className="block text-sm font-medium mb-2">
        {title || config.description} {required && '*'}
      </label>

      {value ? (
        <div className="space-y-2">
          {value.includes('image') || value.includes('.png') || value.includes('.jpg') ? (
            <img src={value} alt="Preview" className="w-16 h-16 object-cover rounded" />
          ) : (
            <div className="text-sm text-gray-600">Document uploaded successfully</div>
          )}
          <button
            type="button"
            onClick={() => {
              onChange('')
              if (onUploadComplete) onUploadComplete('')
            }}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center">
          <div className="text-gray-600 mb-2">Upload {config.description.toLowerCase()}</div>
          <input
            type="file"
            accept={acceptedFiles}
            onChange={handleFileSelect}
            required={required && !value}
            disabled={disabled}
            className="w-full"
          />
          <div className="text-xs text-gray-500 mt-1">{config.acceptedFormats}</div>
        </div>
      )}
    </div>
  )
}

export default SimpleImageUpload