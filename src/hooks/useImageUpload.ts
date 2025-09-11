import { useState, useCallback } from 'react'
import { uploadFile, UploadType } from '../services/centralizedUpload'

export interface UseImageUploadReturn {
  isUploading: boolean
  uploadImage: (file: File | Blob, uploadType: UploadType) => Promise<string>
  error: string | null
  clearError: () => void
}

/**
 * Custom hook for handling image uploads across all user types
 * Provides consistent upload logic and error handling
 */
export const useImageUpload = (): UseImageUploadReturn => {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadImage = useCallback(async (file: File | Blob, uploadType: UploadType): Promise<string> => {
    setIsUploading(true)
    setError(null)
    
    try {
      const response = await uploadFile(file, uploadType)
      return response.secure_url
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsUploading(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    isUploading,
    uploadImage,
    error,
    clearError
  }
}

export default useImageUpload