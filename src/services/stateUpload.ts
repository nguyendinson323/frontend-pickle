import api from './api'

export interface UploadResponse {
  secure_url: string
  public_id: string
  width: number
  height: number
}

export const uploadStateLogo = async (file: File | Blob, filename?: string): Promise<UploadResponse> => {
  const uploadData = new FormData()
  uploadData.append('file', file, filename || 'state-logo')

  const response = await api.post<UploadResponse>('/api/upload/state-logo-registration', uploadData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return response.data
}