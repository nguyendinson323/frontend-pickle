import api from './api'

export interface UploadResponse {
  secure_url: string
  public_id: string
  width: number
  height: number
}

export type UploadType =
  | 'player-photo'
  | 'player-document'
  | 'player-photo-auth'
  | 'player-document-auth'
  | 'club-logo'
  | 'state-logo'
  | 'partner-logo'
  | 'partner-logo-auth'
  | 'coach-photo'
  | 'coach-document'
  | 'coach-photo-auth'
  | 'coach-document-auth'
  | 'admin-photo'

export interface UploadConfig {
  endpoint: string
  folder: string
  description: string
  acceptedFormats: string
  maxSize: string
  cropShape?: 'round' | 'rect'
  aspectRatio?: number
}

// Configuration for each upload type
export const uploadConfigs: Record<UploadType, UploadConfig> = {
  'player-photo': {
    endpoint: '/api/upload/player-photo-registration',
    folder: 'player_photos',
    description: 'Profile Photo',
    acceptedFormats: 'PNG, JPG up to 5MB',
    maxSize: '5MB',
    cropShape: 'round',
    aspectRatio: 1
  },
  'player-document': {
    endpoint: '/api/upload/player-document-registration',
    folder: 'player_documents',
    description: 'ID Document',
    acceptedFormats: 'PNG, JPG, PDF up to 5MB',
    maxSize: '5MB'
  },
  'club-logo': {
    endpoint: '/api/upload/club-logo',
    folder: 'club_logos',
    description: 'Club Logo',
    acceptedFormats: 'PNG, JPG up to 5MB',
    maxSize: '5MB',
    cropShape: 'round',
    aspectRatio: 1
  },
  'state-logo': {
    endpoint: '/api/upload/state-logo-registration',
    folder: 'state_logos',
    description: 'Committee Logo',
    acceptedFormats: 'PNG, JPG up to 5MB',
    maxSize: '5MB',
    cropShape: 'rect',
    aspectRatio: 1
  },
  'partner-logo': {
    endpoint: '/api/upload/partner-logo-registration',
    folder: 'partner_logos',
    description: 'Business Logo',
    acceptedFormats: 'PNG, JPG up to 5MB',
    maxSize: '5MB',
    cropShape: 'rect',
    aspectRatio: 1
  },
  'partner-logo-auth': {
    endpoint: '/api/upload/partner-logo',
    folder: 'partner_logos',
    description: 'Business Logo',
    acceptedFormats: 'PNG, JPG up to 5MB',
    maxSize: '5MB',
    cropShape: 'rect',
    aspectRatio: 1
  },
  'coach-photo': {
    endpoint: '/api/upload/coach-photo-registration',
    folder: 'coach_photos',
    description: 'Profile Photo',
    acceptedFormats: 'PNG, JPG up to 5MB',
    maxSize: '5MB',
    cropShape: 'round',
    aspectRatio: 1
  },
  'coach-document': {
    endpoint: '/api/upload/coach-document-registration',
    folder: 'coach_documents',
    description: 'ID Document',
    acceptedFormats: 'PNG, JPG, PDF up to 5MB',
    maxSize: '5MB'
  },
  'player-photo-auth': {
    endpoint: '/api/upload/player-photo',
    folder: 'player_photos',
    description: 'Profile Photo',
    acceptedFormats: 'PNG, JPG up to 5MB',
    maxSize: '5MB',
    cropShape: 'round',
    aspectRatio: 1
  },
  'player-document-auth': {
    endpoint: '/api/upload/player-document',
    folder: 'player_documents',
    description: 'ID Document',
    acceptedFormats: 'PNG, JPG, PDF up to 5MB',
    maxSize: '5MB'
  },
  'coach-photo-auth': {
    endpoint: '/api/upload/coach-photo',
    folder: 'coach_photos',
    description: 'Profile Photo',
    acceptedFormats: 'PNG, JPG up to 5MB',
    maxSize: '5MB',
    cropShape: 'round',
    aspectRatio: 1
  },
  'coach-document-auth': {
    endpoint: '/api/upload/coach-document',
    folder: 'coach_documents',
    description: 'ID Document',
    acceptedFormats: 'PNG, JPG, PDF up to 5MB',
    maxSize: '5MB'
  },
  'admin-photo': {
    endpoint: '/api/upload/admin-photo',
    folder: 'admin_photos',
    description: 'Admin Profile Photo',
    acceptedFormats: 'PNG, JPG up to 5MB',
    maxSize: '5MB',
    cropShape: 'round',
    aspectRatio: 1
  }
}

/**
 * Centralized upload function for all user types
 * @param file - File or Blob to upload
 * @param uploadType - Type of upload (determines endpoint and configuration)
 * @param filename - Optional custom filename
 * @returns Promise<UploadResponse>
 */
export const uploadFile = async (
  file: File | Blob, 
  uploadType: UploadType, 
  filename?: string
): Promise<UploadResponse> => {
  const config = uploadConfigs[uploadType]
  
  if (!config) {
    throw new Error(`Invalid upload type: ${uploadType}`)
  }

  const uploadData = new FormData()
  uploadData.append('file', file, filename || `${uploadType}-upload`)

  const response = await api.post<UploadResponse>(config.endpoint, uploadData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return response.data
}

/**
 * Get upload configuration for a specific upload type
 * @param uploadType - Type of upload
 * @returns UploadConfig
 */
export const getUploadConfig = (uploadType: UploadType): UploadConfig => {
  const config = uploadConfigs[uploadType]
  if (!config) {
    throw new Error(`Invalid upload type: ${uploadType}`)
  }
  return config
}

/**
 * Check if upload type supports cropping
 * @param uploadType - Type of upload
 * @returns boolean
 */
export const supportsCropping = (uploadType: UploadType): boolean => {
  const config = uploadConfigs[uploadType]
  return config && !!config.cropShape
}

/**
 * Get accepted file extensions for upload type
 * @param uploadType - Type of upload
 * @returns string
 */
export const getAcceptedFiles = (uploadType: UploadType): string => {
  const config = uploadConfigs[uploadType]
  if (!config) return 'image/*'
  
  // Return appropriate accept string for HTML input
  if (uploadType.includes('document')) {
    return 'image/*,.pdf'
  }
  return 'image/*'
}