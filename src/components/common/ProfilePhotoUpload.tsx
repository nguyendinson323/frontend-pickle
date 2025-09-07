import React, { useRef, useState, useCallback } from 'react'

interface ProfilePhotoUploadProps {
  onFileSelect: (cloudinaryUrl: string | null) => void
  error?: string
  maxSize?: number // in MB
}

const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({
  onFileSelect,
  error,
  maxSize = 5
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [cropMode, setCropMode] = useState(false)
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [cloudinaryUrl, setCloudinaryUrl] = useState<string>('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`)
      return
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const url = e.target?.result as string
      setPreviewUrl(url)
      setCropMode(true)
      
      const img = new Image()
      img.onload = () => setImageElement(img)
      img.src = url
    }
    reader.readAsDataURL(file)
    setSelectedFile(file)
  }

  const uploadToBackend = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload/profile-photo`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error('Failed to upload image')
    }

    const data = await response.json()
    return data.cloudinaryUrl
  }

  const cropImage = useCallback(async () => {
    if (!imageElement || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const size = 300 // Final image size
    canvas.width = size
    canvas.height = size

    // Calculate crop dimensions (center square crop)
    const minDimension = Math.min(imageElement.width, imageElement.height)
    const sourceX = (imageElement.width - minDimension) / 2
    const sourceY = (imageElement.height - minDimension) / 2

    // Draw cropped and resized image
    ctx.drawImage(
      imageElement,
      sourceX,
      sourceY,
      minDimension,
      minDimension,
      0,
      0,
      size,
      size
    )

    // Convert canvas to blob and upload to Cloudinary
    canvas.toBlob(async (blob) => {
      if (blob && selectedFile) {
        try {
          setIsUploading(true)
          
          const croppedFile = new File([blob], selectedFile.name, {
            type: 'image/jpeg',
            lastModified: Date.now()
          })
          
          const cloudinaryUrl = await uploadToBackend(croppedFile)
          setCloudinaryUrl(cloudinaryUrl)
          onFileSelect(cloudinaryUrl)
          
          // Update preview with cropped image
          const croppedUrl = URL.createObjectURL(blob)
          setPreviewUrl(croppedUrl)
          setCropMode(false)
        } catch (error) {
          console.error('Error uploading image:', error)
          alert('Failed to upload image. Please try again.')
        } finally {
          setIsUploading(false)
        }
      }
    }, 'image/jpeg', 0.9)
  }, [imageElement, selectedFile, onFileSelect])

  const removePhoto = () => {
    setSelectedFile(null)
    setPreviewUrl('')
    setCropMode(false)
    setImageElement(null)
    setCloudinaryUrl('')
    onFileSelect(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const cancelCrop = () => {
    setCropMode(false)
    setPreviewUrl('')
    setSelectedFile(null)
    setImageElement(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {!previewUrl ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`w-32 h-32 mx-auto border-2 border-dashed rounded-full flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 ${
            error
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }`}
        >
          <svg
            className={`w-8 h-8 mb-2 ${error ? 'text-red-400' : 'text-gray-400'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <span className={`text-xs text-center ${error ? 'text-red-600' : 'text-gray-600'}`}>
            Add Photo
          </span>
        </div>
      ) : (
        <div className="text-center">
          {cropMode ? (
            <div>
              <div className="mb-4">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-w-full max-h-64 mx-auto border border-gray-300 rounded"
                />
              </div>
              <div className="space-x-3">
                <button
                  type="button"
                  onClick={cropImage}
                  disabled={isUploading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? 'Uploading...' : 'Crop & Use'}
                </button>
                <button
                  type="button"
                  onClick={cancelCrop}
                  disabled={isUploading}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Image will be cropped to a square and centered automatically
              </p>
            </div>
          ) : (
            <div>
              <div className="relative inline-block">
                <img
                  src={previewUrl}
                  alt="Profile preview"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-3 text-blue-600 hover:text-blue-800 text-sm underline"
              >
                Change Photo
              </button>
            </div>
          )}
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />

      {error && <p className="mt-2 text-sm text-red-600 text-center">{error}</p>}
    </div>
  )
}

export default ProfilePhotoUpload