import React from 'react'
import { useDispatch } from 'react-redux'
import { closeImagePreviewModal } from '../../../store/slices/playerMessagesSlice'
import { AppDispatch } from '../../../store'

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
    <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-50">
      <div className="relative max-w-4xl max-h-full p-4">
        <img
          src={imageUrl}
          alt="Preview"
          className="max-w-full max-h-full object-contain rounded-lg"
        />
        <button
          onClick={() => dispatch(closeImagePreviewModal())}
          className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export default ImagePreviewModal