import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import { removeToast, Toast } from '../../store/slices/toastSlice'
import { AppDispatch } from '../../store'

const ToastNotification: React.FC = () => {
  const toasts = useSelector((state: RootState) => state.toast.toasts)
  const dispatch = useDispatch<AppDispatch>()

  const getToastClasses = (type: Toast['type']) => {
    const baseClasses = 'p-4 rounded-lg shadow-lg flex items-center justify-between max-w-sm w-full'

    switch (type) {
      case 'success':
        return `${baseClasses} bg-green-100 border-l-4 border-green-500 text-green-700`
      case 'error':
        return `${baseClasses} bg-red-100 border-l-4 border-red-500 text-red-700`
      case 'warning':
        return `${baseClasses} bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700`
      case 'info':
        return `${baseClasses} bg-blue-100 border-l-4 border-blue-500 text-blue-700`
      default:
        return `${baseClasses} bg-gray-100 border-l-4 border-gray-500 text-gray-700`
    }
  }

  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      case 'warning':
        return '⚠️'
      case 'info':
        return 'ℹ️'
      default:
        return '📄'
    }
  }

  const handleRemoveToast = (id: string) => {
    dispatch(removeToast(id))
  }

  // Auto-remove toasts after their duration
  useEffect(() => {
    toasts.forEach(toast => {
      if (toast.duration) {
        const timer = setTimeout(() => {
          handleRemoveToast(toast.id)
        }, toast.duration)

        return () => clearTimeout(timer)
      }
    })
  }, [toasts])

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`${getToastClasses(toast.type)} transform transition-all duration-300 ease-in-out`}
        >
          <div className="flex items-center">
            <span className="mr-2 text-lg">
              {getIcon(toast.type)}
            </span>
            <span className="text-sm font-medium">
              {toast.message}
            </span>
          </div>
          <button
            onClick={() => handleRemoveToast(toast.id)}
            className="ml-3 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <span className="text-lg">×</span>
          </button>
        </div>
      ))}
    </div>
  )
}

export default ToastNotification