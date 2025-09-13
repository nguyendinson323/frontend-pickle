import React, { useState } from 'react'
import { uploadFile, getUploadConfig, supportsCropping, getAcceptedFiles, UploadType } from '../../services/centralizedUpload'
import ImageCropModal from './ImageCropModal'

export interface CentralizedImageUploadProps {
  uploadType: UploadType
  value: string
  onChange: (url: string) => void
  required?: boolean
  disabled?: boolean
  className?: string
  title?: string
  icon?: React.ReactNode
  color?: 'blue' | 'green' | 'red' | 'orange' | 'purple' | 'indigo'
}

const CentralizedImageUpload: React.FC<CentralizedImageUploadProps> = ({
  uploadType,
  value,
  onChange,
  required = false,
  disabled = false,
  className = '',
  title,
  icon,
  color = 'blue'
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [showCropModal, setShowCropModal] = useState(false)
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(value || null)

  const config = getUploadConfig(uploadType)
  const needsCropping = supportsCropping(uploadType)
  const acceptedFiles = getAcceptedFiles(uploadType)

  // Color mappings for consistent styling across user types
  const colorClasses = {
    blue: {
      border: 'border-blue-500',
      text: 'text-blue-600',
      icon: 'text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700',
      spinner: 'border-blue-600'
    },
    green: {
      border: 'border-green-500',
      text: 'text-green-600',
      icon: 'text-green-600',
      button: 'bg-green-600 hover:bg-green-700',
      spinner: 'border-green-600'
    },
    red: {
      border: 'border-red-500',
      text: 'text-red-600',
      icon: 'text-red-600',
      button: 'bg-red-600 hover:bg-red-700',
      spinner: 'border-red-600'
    },
    orange: {
      border: 'border-orange-500',
      text: 'text-orange-600',
      icon: 'text-orange-600',
      button: 'bg-orange-600 hover:bg-orange-700',
      spinner: 'border-orange-600'
    },
    purple: {
      border: 'border-purple-500',
      text: 'text-purple-600',
      icon: 'text-purple-600',
      button: 'bg-purple-600 hover:bg-purple-700',
      spinner: 'border-purple-600'
    },
    indigo: {
      border: 'border-indigo-500',
      text: 'text-indigo-600',
      icon: 'text-indigo-600',
      button: 'bg-indigo-600 hover:bg-indigo-700',
      spinner: 'border-indigo-600'
    }
  }

  const colors = colorClasses[color]

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (needsCropping) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setCropSrc(result)
        setShowCropModal(true)
      }
      reader.readAsDataURL(file)
    } else {
      // Direct upload without cropping
      handleDirectUpload(file)
    }
  }

  const handleDirectUpload = async (file: File) => {
    setIsUploading(true)
    
    try {
      const uploadResponse = await uploadFile(file, uploadType)
      setPreview(uploadResponse.secure_url)
      onChange(uploadResponse.secure_url)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleCropComplete = async (croppedBlob: Blob) => {
    setIsUploading(true)
    
    try {
      const uploadResponse = await uploadFile(croppedBlob, uploadType)
      setPreview(uploadResponse.secure_url)
      onChange(uploadResponse.secure_url)
      setShowCropModal(false)
      setCropSrc(null)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleCropCancel = () => {
    setShowCropModal(false)
    setCropSrc(null)
  }

  const handleRemove = () => {
    setPreview(null)
    onChange('')
  }

  const displayTitle = title || config.description
  const isRound = config.cropShape === 'round'

  return (
    <div className={`p-6 rounded-lg ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        {icon && <span className={`w-5 h-5 mr-2 ${colors.icon}`}>{icon}</span>}
        {!icon && (
          <svg className={`w-5 h-5 mr-2 ${colors.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )}
        {displayTitle}
      </h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {config.description} {required && '*'}
        </label>
        <div className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:${colors.border} transition-colors duration-200 ${isUploading ? 'bg-gray-50' : ''}`}>
          {isUploading && !preview ? (
            <div className="space-y-4">
              <div className={`animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-${color}-600 mx-auto`}></div>
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-900">Uploading to Cloudinary...</p>
                <p className="text-sm text-gray-600">Please wait while we process your image</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mx-auto max-w-xs">
                  <div className={`bg-${color}-600 h-2 rounded-full animate-pulse`} style={{width: '70%'}}></div>
                </div>
              </div>
            </div>
          ) : preview ? (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={preview}
                  alt={`${config.description} preview`}
                  className={`w-24 h-24 mx-auto object-cover ${isRound ? 'rounded-full' : 'rounded-lg'} ${isUploading ? 'opacity-50' : ''}`}
                />
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent`}></div>
                  </div>
                )}
              </div>
              <p className="text-sm text-green-600">Uploaded successfully</p>
              <button
                type="button"
                onClick={handleRemove}
                className={`text-sm ${colors.text} hover:opacity-75 disabled:opacity-50`}
                disabled={disabled || isUploading}
              >
                {isUploading ? 'Processing...' : `Remove ${config.description.toLowerCase()}`}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="text-lg font-medium text-gray-900">Upload your {config.description.toLowerCase()}</p>
                <p className="text-sm text-gray-600">{config.acceptedFormats}</p>
                {needsCropping && (
                  <p className="text-xs text-gray-500">Image will be cropped to fit</p>
                )}
              </div>
            </div>
          )}
          <input
            type="file"
            accept={acceptedFiles}
            onChange={handleFileSelect}
            className="mt-4"
            required={required && !value}
            disabled={disabled || isUploading}
          />
          {isUploading && (
            <div className="mt-2 flex items-center justify-center">
              <div className={`animate-spin rounded-full h-4 w-4 border-b-2 ${colors.spinner}`}></div>
              <span className="ml-2 text-sm text-gray-600">Uploading...</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Image Crop Modal */}
      {showCropModal && cropSrc && (
        <ImageCropModal
          src={cropSrc}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          aspectRatio={config.aspectRatio || 1}
          cropShape={config.cropShape || 'rect'}
          isUploading={isUploading}
        />
      )}
    </div>
  )
}

export default CentralizedImageUpload