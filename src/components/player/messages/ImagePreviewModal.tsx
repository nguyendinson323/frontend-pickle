import React from 'react'
import { useDispatch } from 'react-redux'
import { closeImagePreviewModal } from '../../../store/slices/playerMessagesSlice'
import { AppDispatch } from '../../../store'
import {
  FiX,
  FiImage
} from 'react-icons/fi'

interface ImagePreviewModalProps {
  isOpen: boolean
  imageUrl: string | null
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  isOpen,
  imageUrl
}) => {
  const dispatch = useDispatch<AppDispatch>()

  if (!isOpen || !imageUrl) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="relative max-w-6xl max-h-full">
        <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl p-4 shadow-2xl border-2 border-gray-200">
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={() => dispatch(closeImagePreviewModal())}
              className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full flex items-center justify-center hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:transform hover:scale-110"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center justify-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-3">
              <FiImage className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Image Preview</h3>
          </div>

          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-4">
            <img
              src={imageUrl}
              alt="Preview"
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-lg mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImagePreviewModal