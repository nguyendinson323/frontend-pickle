import React from 'react'
import { useDispatch } from 'react-redux'
import { closeQrCodeModal } from '../../../store/slices/digitalCredentialsSlice'
import { AppDispatch } from '../../../store'
import {
  FiX,
  FiEye,
  FiShield
} from 'react-icons/fi'

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
    <div className="fixed inset-0 bg-black bg-opacity-60 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-200 w-full max-w-lg mx-auto overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-700 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mr-4">
                <FiEye className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white">QR Code</h3>
            </div>
            <button
              onClick={() => dispatch(closeQrCodeModal())}
              className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
            >
              <FiX className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="p-8">
          {qrCodeUrl ? (
            <div className="text-center">
              <div className="bg-gradient-to-br from-white to-gray-100 rounded-3xl p-8 mb-8 shadow-inner border-2 border-gray-200">
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  className="mx-auto w-72 h-72 rounded-2xl shadow-lg"
                />
              </div>

              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200 mb-8">
                <div className="flex items-center justify-center mb-3">
                  <FiShield className="w-6 h-6 text-blue-600 mr-3" />
                  <h4 className="text-xl font-bold text-blue-800">Verification Instructions</h4>
                </div>
                <p className="text-lg text-blue-700 font-medium">
                  Show this QR code to verify your credential. Keep it secure and only share with authorized parties.
                </p>
              </div>

              <button
                onClick={() => dispatch(closeQrCodeModal())}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold rounded-2xl hover:from-gray-600 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:transform hover:scale-105"
              >
                <FiX className="w-5 h-5 mr-3" />
                Close
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <FiEye className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Loading QR Code</h4>
              <p className="text-gray-600 mb-8">Please wait while we generate your QR code...</p>
              <button
                onClick={() => dispatch(closeQrCodeModal())}
                className="inline-flex items-center px-6 py-3 bg-gray-300 text-gray-700 font-medium rounded-2xl hover:bg-gray-400 focus:outline-none transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default QrCodeModal