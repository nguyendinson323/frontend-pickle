import React from 'react'

interface CoachDocumentUploadsSectionProps {
  profilePhotoPreview: string | null
  idDocumentPreview: string | null
  onPhotoSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  onDocumentUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>
  isUploading: boolean
}

const CoachDocumentUploadsSection: React.FC<CoachDocumentUploadsSectionProps> = ({ 
  profilePhotoPreview, 
  idDocumentPreview, 
  onPhotoSelect,
  onDocumentUpload,
  isUploading
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
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors duration-200">
            {isUploading ? (
              <div className="space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-600">Processing and uploading photo...</p>
                <div className="w-48 mx-auto bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '70%'}}></div>
                </div>
              </div>
            ) : profilePhotoPreview ? (
              <div className="space-y-4">
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-gray-200">
                  <img src={profilePhotoPreview} alt="Profile preview" className="w-full h-full object-cover" />
                </div>
                <p className="text-sm text-green-600">Profile photo uploaded successfully</p>
                <button
                  type="button"
                  onClick={() => {
                    const input = document.createElement('input')
                    input.type = 'file'
                    input.accept = 'image/*'
                    input.addEventListener('change', (e) => {
                      const target = e.target as HTMLInputElement
                      const syntheticEvent = {
                        ...e,
                        target,
                        currentTarget: target,
                        nativeEvent: e,
                        isDefaultPrevented: () => false,
                        isPropagationStopped: () => false,
                        persist: () => {}
                      } as React.ChangeEvent<HTMLInputElement>
                      onPhotoSelect(syntheticEvent)
                    })
                    input.click()
                  }}
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                >
                  Change photo
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-lg font-medium text-gray-900">Upload your profile photo</p>
                  <p className="text-sm text-gray-600">PNG, JPG files up to 5MB • Recommended: Square format</p>
                </div>
                <div className="pt-2">
                  <label 
                    htmlFor="profile-photo-upload" 
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
                  >
                    Choose File
                  </label>
                  <input
                    id="profile-photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={onPhotoSelect}
                    className="hidden"
                    required
                  />
                </div>
              </div>
            )}
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Your photo will be cropped to a circular format and resized automatically.
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Official ID Document *</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors duration-200">
            {isUploading && !idDocumentPreview ? (
              <div className="space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-600">Uploading document...</p>
              </div>
            ) : idDocumentPreview ? (
              <div className="space-y-4">
                <svg className="w-12 h-12 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-green-600">ID document uploaded successfully</p>
                <button
                  type="button"
                  onClick={() => {
                    const input = document.createElement('input')
                    input.type = 'file'
                    input.accept = 'image/*,application/pdf'
                    input.addEventListener('change', (e) => {
                      const target = e.target as HTMLInputElement
                      const syntheticEvent = {
                        ...e,
                        target,
                        currentTarget: target,
                        nativeEvent: e,
                        isDefaultPrevented: () => false,
                        isPropagationStopped: () => false,
                        persist: () => {}
                      } as React.ChangeEvent<HTMLInputElement>
                      onDocumentUpload(syntheticEvent)
                    })
                    input.click()
                  }}
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                >
                  Change document
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-lg font-medium text-gray-900">Upload official ID document</p>
                  <p className="text-sm text-gray-600">JPG, PNG, PDF files up to 10MB</p>
                </div>
                <div className="pt-2">
                  <label 
                    htmlFor="id-document-upload" 
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
                  >
                    Choose File
                  </label>
                  <input
                    id="id-document-upload"
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={onDocumentUpload}
                    className="hidden"
                    required
                  />
                </div>
              </div>
            )}
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Upload a clear photo or scan of your official identification document.
          </p>
        </div>
      </div>
    </div>
  )
}

export default CoachDocumentUploadsSection