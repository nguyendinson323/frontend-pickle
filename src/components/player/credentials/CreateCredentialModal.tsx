import React from 'react'
import { useDispatch } from 'react-redux'
import { closeCreateCredentialModal, updateCreateCredentialFormData, CredentialTemplate } from '../../../store/slices/digitalCredentialsSlice'
import { AppDispatch } from '../../../store'
import {
  FiX,
  FiPlus,
  FiEdit,
  FiCalendar,
  FiFileText
} from 'react-icons/fi'

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
    <div className="fixed inset-0 bg-black bg-opacity-60 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-200 w-full max-w-2xl mx-auto overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-700 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mr-4">
                <FiPlus className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white">Create {selectedTemplate.name}</h3>
            </div>
            <button
              onClick={() => dispatch(closeCreateCredentialModal())}
              className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
            >
              <FiX className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="space-y-8">
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center mb-4">
                <FiEdit className="w-5 h-5 text-blue-600 mr-3" />
                <label className="block text-lg font-bold text-blue-800">
                  Title
                </label>
              </div>
              <input
                type="text"
                value={formData.title || selectedTemplate.name}
                onChange={(e) => dispatch(updateCreateCredentialFormData({ title: e.target.value }))}
                className="w-full px-6 py-4 border-2 border-blue-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium bg-white text-lg"
                placeholder="Enter credential title"
              />
            </div>

            <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
              <div className="flex items-center mb-4">
                <FiFileText className="w-5 h-5 text-green-600 mr-3" />
                <label className="block text-lg font-bold text-green-800">
                  Description (Optional)
                </label>
              </div>
              <textarea
                value={formData.description || ''}
                onChange={(e) => dispatch(updateCreateCredentialFormData({ description: e.target.value }))}
                className="w-full px-6 py-4 border-2 border-green-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium bg-white resize-none"
                rows={4}
                placeholder="Enter description for this credential"
              />
            </div>

            <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200">
              <div className="flex items-center mb-4">
                <FiCalendar className="w-5 h-5 text-orange-600 mr-3" />
                <label className="block text-lg font-bold text-orange-800">
                  Expiry Date (Optional)
                </label>
              </div>
              <input
                type="date"
                value={formData.expiry_date || ''}
                onChange={(e) => dispatch(updateCreateCredentialFormData({ expiry_date: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-6 py-4 border-2 border-orange-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-medium bg-white text-lg"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              onClick={() => dispatch(closeCreateCredentialModal())}
              className="flex-1 inline-flex items-center justify-center px-8 py-4 bg-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300"
            >
              <FiX className="w-5 h-5 mr-3" />
              Cancel
            </button>
            <button
              onClick={onSubmitCreateCredential}
              disabled={isLoading}
              className="flex-1 inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-700 text-white font-bold rounded-2xl hover:from-purple-700 hover:to-pink-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl hover:transform hover:scale-105"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  Creating...
                </>
              ) : (
                <>
                  <FiPlus className="w-5 h-5 mr-3" />
                  Create Credential
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateCredentialModal