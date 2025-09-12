import React from 'react'
import { useDispatch } from 'react-redux'
import { closeReviewModal, updateReviewModal } from '../../../store/slices/coachingSessionsSlice'
import { AppDispatch } from '../../../store'

interface SessionReviewModalProps {
  isOpen: boolean
  sessionId: number | null
  rating: number
  comment: string
  onSubmitReview: () => void
  isLoading: boolean
}

const SessionReviewModal: React.FC<SessionReviewModalProps> = ({
  isOpen,
  sessionId: _sessionId,
  rating,
  comment,
  onSubmitReview,
  isLoading
}) => {
  const dispatch = useDispatch<AppDispatch>()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Session Review
          </h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => dispatch(updateReviewModal({ rating: star }))}
                  className={`text-2xl ${
                    star <= rating ? 'text-yellow-500' : 'text-gray-300'
                  }`}
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comment (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => dispatch(updateReviewModal({ comment: e.target.value }))}
              placeholder="Share your experience..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
              rows={4}
            />
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => dispatch(closeReviewModal())}
              className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400 focus:outline-none"
            >
              Cancel
            </button>
            <button
              onClick={onSubmitReview}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none disabled:opacity-50"
            >
              {isLoading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SessionReviewModal