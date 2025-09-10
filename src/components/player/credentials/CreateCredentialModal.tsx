import React from 'react'
import { useDispatch } from 'react-redux'
import { closeCreateCredentialModal, updateCreateCredentialFormData, CredentialTemplate } from '../../../store/slices/digitalCredentialsSlice'
import { AppDispatch } from '../../../store'

interface CreateCredentialModalProps {
  isOpen: boolean
  selectedTemplate: CredentialTemplate | null
  formData: Record<string, string>
  onSubmitCreateCredential: () => void
  isLoading: boolean
}

const CreateCredentialModal: React.FC<CreateCredentialModalProps> = ({
  isOpen,
  selectedTemplate,
  formData,
  onSubmitCreateCredential,
  isLoading
}) => {
  const dispatch = useDispatch<AppDispatch>()

  if (!isOpen || !selectedTemplate) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Create {selectedTemplate.name}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={formData.title || selectedTemplate.name}
                onChange={(e) => dispatch(updateCreateCredentialFormData({ title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => dispatch(updateCreateCredentialFormData({ description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date (Optional)
              </label>
              <input
                type="date"
                value={formData.expiry_date || ''}
                onChange={(e) => dispatch(updateCreateCredentialFormData({ expiry_date: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={() => dispatch(closeCreateCredentialModal())}
              className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400 focus:outline-none"
            >
              Cancel
            </button>
            <button
              onClick={onSubmitCreateCredential}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Credential'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateCredentialModal