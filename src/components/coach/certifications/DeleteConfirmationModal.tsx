import React from 'react'
import { CoachCertification } from '../../../types/coach'

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Delete Certification</h3>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this certification? This action cannot be undone.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm">
                <div className="font-medium text-gray-900">{certification.name}</div>
                <div className="text-gray-600">Issued by: {certification.issuer}</div>
                <div className="text-gray-600">
                  Issue Date: {new Date(certification.issue_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Delete Certification
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmationModal