import React from 'react'
import { CoachCertification } from '../../../types/coach'
import {
  FiAlertTriangle,
  FiX,
  FiTrash2,
  FiCalendar,
  FiHome,
  FiAward
} from 'react-icons/fi'

interface DeleteConfirmationModalProps {
  isOpen: boolean
  certification: CoachCertification | null
  onClose: () => void
  onConfirm: (certificationId: number) => void
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  certification,
  onClose,
  onConfirm
}) => {
  if (!isOpen || !certification) return null

  const handleConfirm = () => {
    onConfirm(certification.id)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-white to-red-50 border border-red-200 rounded-3xl max-w-lg w-full shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-pink-700 text-white px-8 py-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mr-4">
                <FiAlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Delete Certification</h3>
                <p className="text-red-100 font-medium mt-1">This action cannot be undone</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white hover:text-gray-200 rounded-xl hover:bg-white hover:bg-opacity-20 transition-all duration-200"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <p className="text-gray-700 font-medium text-lg mb-6">
              Are you sure you want to delete this certification? This action cannot be undone and will permanently remove the certification from your profile.
            </p>

            <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-pink-100 rounded-2xl flex items-center justify-center mr-4">
                  <FiAward className="h-6 w-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="text-lg font-bold text-gray-900">{certification.name}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                  <div className="text-sm font-bold text-gray-700 mb-1 flex items-center">
                    <FiHome className="h-3 w-3 mr-1 text-blue-500" />
                    Issued by
                  </div>
                  <div className="font-bold text-blue-900">{certification.issuer}</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                  <div className="text-sm font-bold text-gray-700 mb-1 flex items-center">
                    <FiCalendar className="h-3 w-3 mr-1 text-green-500" />
                    Issue Date
                  </div>
                  <div className="font-bold text-green-900">
                    {new Date(certification.issue_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold bg-white hover:bg-gray-50 rounded-2xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center"
            >
              <FiX className="w-4 h-4 mr-2" />
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-700 hover:from-red-700 hover:to-pink-800 text-white font-bold rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105 flex items-center"
            >
              <FiTrash2 className="w-4 h-4 mr-2" />
              Delete Certification
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmationModal