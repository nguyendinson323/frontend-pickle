import React from 'react'

interface CoachDocumentUploadsSectionProps {
  profilePhotoPreview: string | null
  idDocumentPreview: string | null
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'profilePhotoUrl' | 'idDocumentUrl') => Promise<void>
}

const CoachDocumentUploadsSection: React.FC<CoachDocumentUploadsSectionProps> = ({ 
  profilePhotoPreview, 
  idDocumentPreview, 
  onFileUpload 
}) => {
  return (
    <div className=" p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Document Uploads
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo *</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors duration-200">
            {profilePhotoPreview ? (
              <div className="space-y-2">
                <img src={profilePhotoPreview} alt="Profile preview" className="w-24 h-24 rounded-full mx-auto object-cover" />
                <p className="text-sm text-green-600">Photo uploaded successfully</p>
              </div>
            ) : (
              <div className="space-y-2">
                <svg className="w-8 h-8 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-gray-600">Upload your profile photo</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onFileUpload(e, 'profilePhotoUrl')}
              className="mt-2"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Official ID Document *</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors duration-200">
            {idDocumentPreview ? (
              <div className="space-y-2">
                <svg className="w-8 h-8 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-green-600">ID document uploaded successfully</p>
              </div>
            ) : (
              <div className="space-y-2">
                <svg className="w-8 h-8 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-gray-600">Upload official ID document</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => onFileUpload(e, 'idDocumentUrl')}
              className="mt-2"
              required
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoachDocumentUploadsSection