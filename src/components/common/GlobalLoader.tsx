import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'

export const GlobalLoader: React.FC = () => {
  const { isLoading, message } = useSelector((state: RootState) => state.loading)

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        {message && (
          <p className="text-gray-700 text-center">{message}</p>
        )}
      </div>
    </div>
  )
}