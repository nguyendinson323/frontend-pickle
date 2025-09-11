import React from 'react'

interface LogoUploadSectionProps {
  logoPreview: string | null
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  onLogoRemove: () => void
  isUploading: boolean
}

const LogoUploadSection: React.FC<LogoUploadSectionProps> = ({ 
  logoPreview, 
  onFileSelect, 
  onLogoRemove,
  isUploading
}) => {
  return (
    <div className=" p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Club Logo & Branding
      </h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Club Logo (Optional)</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors duration-200">
          {isUploading ? (
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-sm text-gray-600">Processing and uploading logo...</p>
              <div className="w-48 mx-auto bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full animate-pulse" style={{width: '70%'}}></div>
              </div>
            </div>
          ) : logoPreview ? (
            <div className="space-y-4">
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-gray-200">
                <img src={logoPreview} alt="Club logo preview" className="w-full h-full object-cover" />
              </div>
              <p className="text-sm text-green-600">Logo uploaded successfully</p>
              <button
                type="button"
                onClick={onLogoRemove}
                className="text-sm text-red-600 hover:text-red-500 font-medium"
              >
                Remove logo
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="text-lg font-medium text-gray-900">Upload your club logo</p>
                <p className="text-sm text-gray-600">PNG, JPG files up to 5MB • Recommended: Square format</p>
              </div>
              <div className="pt-2">
                <label 
                  htmlFor="logo-upload" 
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200 transition-colors duration-200"
                >
                  Choose File
                </label>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={onFileSelect}
                  className="hidden"
                />
              </div>
            </div>
          )}
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Your logo will be cropped to a circular format and resized automatically.
        </p>
      </div>
    </div>
  )
}

export default LogoUploadSection