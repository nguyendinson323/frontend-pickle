import React from 'react'
import { PlayerRegisterRequest } from '../../../../types'

interface PlayerDocumentUploadsSectionProps {
  formData: PlayerRegisterRequest
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'profilePhotoUrl' | 'idDocumentUrl') => Promise<void>
}

const PlayerDocumentUploadsSection: React.FC<PlayerDocumentUploadsSectionProps> = ({ 
  formData, 
  onFileUpload 
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
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onFileUpload(e, 'profilePhotoUrl')}
              className="hidden"
              id="profile-photo"
            />
            <label htmlFor="profile-photo" className="cursor-pointer">
              <div className="text-gray-600">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <p>Upload Profile Photo</p>
                <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
              </div>
            </label>
            {formData.profilePhotoUrl && (
              <p className="text-green-600 text-sm mt-2">Photo uploaded successfully</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Official ID Document *
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors">
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => onFileUpload(e, 'idDocumentUrl')}
              className="hidden"
              id="id-document"
            />
            <label htmlFor="id-document" className="cursor-pointer">
              <div className="text-gray-600">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <p>Upload ID Document</p>
                <p className="text-sm text-gray-500">INE, Passport (PNG, JPG, PDF)</p>
              </div>
            </label>
            {formData.idDocumentUrl && (
              <p className="text-green-600 text-sm mt-2">Document uploaded successfully</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerDocumentUploadsSection