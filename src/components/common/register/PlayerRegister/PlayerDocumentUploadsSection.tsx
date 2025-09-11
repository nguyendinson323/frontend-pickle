import React from 'react'
import { PlayerRegisterRequest } from '../../../../types'

interface PlayerDocumentUploadsSectionProps {
  formData: PlayerRegisterRequest
  photoPreview: string | null
  onPhotoSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  onPhotoRemove: () => void
  onDocumentUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  isUploading: boolean
}

const PlayerDocumentUploadsSection: React.FC<PlayerDocumentUploadsSectionProps> = ({ 
  formData, 
  photoPreview,
  onPhotoSelect,
  onPhotoRemove,
  onDocumentUpload,
  isUploading
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Required Documents
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Photo *
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors">
            {photoPreview ? (
              <div className="space-y-4">
                <img src={photoPreview} alt="Profile photo preview" className="w-24 h-24 mx-auto object-cover rounded-full" />
                <p className="text-green-600 text-sm">Photo uploaded successfully</p>
                <button
                  type="button"
                  onClick={onPhotoRemove}
                  className="text-sm text-red-600 hover:text-red-500"
                  disabled={isUploading}
                >
                  Remove photo
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-lg font-medium text-gray-900">Upload your profile photo</p>
                  <p className="text-sm text-gray-600">PNG, JPG files up to 10MB</p>
                  <p className="text-xs text-gray-500">Photo will be cropped to fit</p>
                </div>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={onPhotoSelect}
              className="mt-4"
              required={!formData.profilePhotoUrl}
              disabled={isUploading}
            />
            {isUploading && (
              <div className="mt-2 flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                <span className="ml-2 text-sm text-gray-600">Uploading...</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Official ID Document *
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors">
            {formData.idDocumentUrl ? (
              <div className="space-y-2">
                <svg className="w-12 h-12 text-green-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-green-600 text-sm">Document uploaded successfully</p>
              </div>
            ) : (
              <div className="space-y-2">
                <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-lg font-medium text-gray-900">Upload ID Document</p>
                  <p className="text-sm text-gray-600">INE, Passport, Driver's License</p>
                  <p className="text-xs text-gray-500">PNG, JPG, PDF up to 5MB</p>
                </div>
              </div>
            )}
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={onDocumentUpload}
              className="mt-4"
              required={!formData.idDocumentUrl}
              disabled={isUploading}
            />
            {isUploading && (
              <div className="mt-2 flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                <span className="ml-2 text-sm text-gray-600">Uploading...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerDocumentUploadsSection