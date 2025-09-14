import React, { useState, useRef } from 'react'
import api from '../../services/api'

interface AvatarUploadProps {
  currentAvatar?: string
  onAvatarChange: (url: string) => void
  userId?: number
  userType: 'player' | 'coach' | 'club' | 'partner' | 'state' | 'admin'
  disabled?: boolean
}

interface UploadResponse {
  secure_url: string
  public_id: string
  width: number
  height: number
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatar,
  onAvatarChange,
  userType = 'player',
  disabled = false
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getUploadEndpoint = () => {
    switch (userType) {
      case 'player':
        return '/api/upload/player-photo'
      case 'coach':
        return '/api/upload/coach-photo'
      case 'club':
        return '/api/upload/club-logo'
      case 'partner':
        return '/api/upload/partner-logo'
      case 'state':
        return '/api/upload/state-logo'
      case 'admin':
        return '/api/upload/admin-photo'
      default:
        return '/api/upload/player-photo'
    }
  }

  const handleFileSelect = async (file: File) => {
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await api.post<UploadResponse>(getUploadEndpoint(), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      onAvatarChange(response.data.secure_url)
    } catch (error: any) {
      console.error('Avatar upload failed:', error)
      const errorMessage = error.response?.data?.message || 'Upload failed'
      alert(`Avatar upload failed: ${errorMessage}`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const openFileDialog = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div
        className={`relative w-32 h-32 rounded-full border-4 border-dashed transition-all duration-200 cursor-pointer ${
          dragOver
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
      >
        {isUploading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-full">
            <div className="flex flex-col items-center space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-xs text-gray-600">Uploading...</span>
            </div>
          </div>
        ) : currentAvatar ? (
          <img
            src={currentAvatar}
            alt="Avatar"
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs">Add Photo</span>
            </div>
          </div>
        )}

        {!isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 rounded-full transition-opacity duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      <div className="text-center">
        <p className="text-sm text-gray-600">
          {isUploading
            ? 'Uploading to Cloudinary...'
            : 'Click or drag & drop to upload'
          }
        </p>
        <p className="text-xs text-gray-500 mt-1">
          PNG, JPG up to 5MB
        </p>
      </div>
    </div>
  )
}

export default AvatarUpload