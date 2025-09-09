import React from 'react'
import { useDispatch } from 'react-redux'
import { closeQrCodeModal } from '../../../store/slices/digitalCredentialsSlice'
import { AppDispatch } from '../../../store'

interface QrCodeModalProps {
  isOpen: boolean
  qrCodeUrl: string | null
}

const QrCodeModal: React.FC<QrCodeModalProps> = ({
  isOpen,
  qrCodeUrl
}) => {
  const dispatch = useDispatch<AppDispatch>()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            QR Code
          </h3>
          
          {qrCodeUrl && (
            <div className="mb-4">
              <img 
                src={qrCodeUrl} 
                alt="QR Code"
                className="mx-auto w-64 h-64 border border-gray-200 rounded-md"
              />
            </div>
          )}
          
          <p className="text-sm text-gray-600 mb-6">
            Show this QR code to verify your credential
          </p>
          
          <div className="flex justify-center">
            <button
              onClick={() => dispatch(closeQrCodeModal())}
              className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400 focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QrCodeModal