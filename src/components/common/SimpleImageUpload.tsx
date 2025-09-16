import React, { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../store'
import { uploadFile as uploadFileToAPI } from '../../store/slices/authSlice'
import ImageCropModal from './ImageCropModal'

interface SimpleImageUploadProps {
  value: string
  onChange: (url: string) => void
  fieldName: string
  fileType: 'image' | 'document'
  required?: boolean
  disabled?: boolean
  className?: string
  title: string
  enableCropping?: boolean
  aspectRatio?: number
  icon?: React.ReactNode
}

const SimpleImageUpload: React.FC<SimpleImageUploadProps> = ({
  value,
  onChange,
  fieldName,
  fileType,
  required = false,
  disabled = false,
  className = '',
  title,
  enableCropping = true,
  aspectRatio = 1,
  icon
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const [showCropModal, setShowCropModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Determine if we should use cropping for this upload
  const shouldUseCropping = enableCropping && fileType === 'image'

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Basic validation
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB')
      return
    }

    // For images that should be cropped, open crop modal
    if (shouldUseCropping && file.type.startsWith('image/')) {
      setSelectedFile(file)
      setShowCropModal(true)
    } else {
      // For documents or non-cropped images, upload directly
      
      await handleUpload(file)
    }

    // Clear input
    e.target.value = ''
  }, [shouldUseCropping])

  const handleUpload = async (file: File | Blob) => {
    try {
      const result = await dispatch(uploadFileToAPI(file, fileType, fieldName))
      const { secure_url } = result as { secure_url: string }

      // Update the form field immediately
      onChange(secure_url)
    } catch (error: any) {
      console.error('Upload failed:', error)
      alert('Upload failed. Please try again.')
    }
  }

  const handleCropComplete = async (croppedFile: File) => {
    await handleUpload(croppedFile)
    setShowCropModal(false)
    setSelectedFile(null)
  }

  const handleCropCancel = () => {
    setShowCropModal(false)
    setSelectedFile(null)
  }

  const handleRemove = () => {
    onChange('')
  }

  const acceptedFiles = fileType === 'image' ? 'image/*' : 'image/*,.pdf,.doc,.docx'

  return (
    <>
      <div className={`p-4 border rounded ${className}`}>
        <label className="block text-sm font-medium mb-2 flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          {title} {required && '*'}
        </label>

        {value ? (
          <div className="space-y-2">
            {fileType === 'image' ? (
              <img src={value} alt="Preview" className="w-16 h-16 object-cover rounded" />
            ) : (
              <div className="text-sm text-gray-600">Document uploaded successfully</div>
            )}
            <button
              type="button"
              onClick={handleRemove}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center">
            <div className="text-gray-600 mb-2">
              Upload {title.toLowerCase()}
              {shouldUseCropping && (
                <span className="text-xs text-blue-600 block mt-1">
                  📸 Images will be cropped before upload
                </span>
              )}
            </div>
            <input
              type="file"
              accept={acceptedFiles}
              onChange={handleFileSelect}
              required={required && !value}
              disabled={disabled}
              className="w-full"
            />
            <div className="text-xs text-gray-500 mt-1">
              {fileType === 'image' ? 'PNG, JPG up to 10MB' : 'PNG, JPG, PDF, DOC, DOCX up to 10MB'}
            </div>
          </div>
        )}
      </div>

      {/* Image Crop Modal */}
      {showCropModal && selectedFile && (
        <ImageCropModal
          isOpen={showCropModal}
          onClose={handleCropCancel}
          imageFile={selectedFile}
          onCropComplete={handleCropComplete}
          aspectRatio={aspectRatio}
          title={`Crop ${title}`}
        />
      )}
    </>
  )
}

export default SimpleImageUpload