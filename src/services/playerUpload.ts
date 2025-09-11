import api from './api'

export interface UploadResponse {
  secure_url: string
  public_id: string
  width: number
  height: number
}

export const uploadPlayerPhoto = async (file: File | Blob, filename?: string): Promise<UploadResponse> => {
  const uploadData = new FormData()
  uploadData.append('file', file, filename || 'player-photo')

  const response = await api.post<UploadResponse>('/api/upload/player-photo-registration', uploadData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return response.data
}

export const uploadPlayerDocument = async (file: File, filename?: string): Promise<UploadResponse> => {
  const uploadData = new FormData()
  uploadData.append('file', file, filename || 'player-document')

  const response = await api.post<UploadResponse>('/api/upload/player-document-registration', uploadData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return response.data
}