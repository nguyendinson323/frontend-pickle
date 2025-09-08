import React from 'react'
import { StateRegisterRequest } from '../../../../types'

interface StateLogoUploadSectionProps {
  formData: StateRegisterRequest
  logoPreview: string | null
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>
  onRemoveLogo: () => void
}

const StateLogoUploadSection: React.FC<StateLogoUploadSectionProps> = ({ 
  formData, 
  logoPreview, 
  onLogoUpload,
  onRemoveLogo
}) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Committee Logo & Branding
      </h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Committee Logo *</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-red-500 transition-colors duration-200">
          {logoPreview ? (
            <div className="space-y-4">
              <img src={logoPreview} alt="Committee logo preview" className="w-24 h-24 mx-auto object-contain" />
              <p className="text-sm text-green-600">Logo uploaded successfully</p>
              <button
                type="button"
                onClick={onRemoveLogo}
                className="text-sm text-red-600 hover:text-red-500"
              >
                Remove logo
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="text-lg font-medium text-gray-900">Upload your committee logo</p>
                <p className="text-sm text-gray-600">PNG, JPG, or SVG files up to 10MB</p>
              </div>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={onLogoUpload}
            className="mt-4"
            required={!logoPreview}
          />
        </div>
      </div>
    </div>
  )
}

export default StateLogoUploadSection