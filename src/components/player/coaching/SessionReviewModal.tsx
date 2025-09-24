import React from 'react'
import { useDispatch } from 'react-redux'
import { closeReviewModal, updateReviewModal } from '../../../store/slices/coachingSessionsSlice'
import { AppDispatch } from '../../../store'
import {
  FiStar,
  FiMessageSquare,
  FiX,
  FiSend
} from 'react-icons/fi'

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
    <div className="fixed inset-0 bg-black bg-opacity-60 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-200 w-full max-w-lg mx-auto overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-yellow-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mr-4">
                <FiStar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Session Review</h3>
            </div>
            <button
              onClick={() => dispatch(closeReviewModal())}
              className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
            >
              <FiX className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Rating Section */}
          <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200 mb-8">
            <div className="flex items-center mb-4">
              <FiStar className="w-5 h-5 text-yellow-600 mr-2" />
              <label className="block text-lg font-bold text-yellow-800">
                Rate Your Experience
              </label>
            </div>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => dispatch(updateReviewModal({ rating: star }))}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:transform hover:scale-110 ${
                    star <= rating
                      ? 'bg-yellow-400 shadow-lg'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  <FiStar className={`w-6 h-6 ${
                    star <= rating ? 'text-white' : 'text-gray-400'
                  }`} />
                </button>
              ))}
            </div>
            <div className="text-center mt-3">
              <p className="text-sm font-medium text-yellow-700">
                {rating === 0 ? 'Select a rating' :
                 rating === 1 ? 'Poor' :
                 rating === 2 ? 'Fair' :
                 rating === 3 ? 'Good' :
                 rating === 4 ? 'Very Good' :
                 'Excellent'}
              </p>
            </div>
          </div>

          {/* Comment Section */}
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200 mb-8">
            <div className="flex items-center mb-4">
              <FiMessageSquare className="w-5 h-5 text-blue-600 mr-2" />
              <label className="block text-lg font-bold text-blue-800">
                Share Your Feedback
              </label>
            </div>
            <textarea
              value={comment}
              onChange={(e) => dispatch(updateReviewModal({ comment: e.target.value }))}
              placeholder="Tell us about your coaching session experience..."
              className="w-full px-4 py-3 border-2 border-blue-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-medium bg-white"
              rows={4}
            />
            <p className="text-xs text-blue-600 mt-2">Optional - Help other players with your insights</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => dispatch(closeReviewModal())}
              className="flex-1 inline-flex items-center justify-center px-6 py-4 bg-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300"
            >
              <FiX className="w-5 h-5 mr-3" />
              Cancel
            </button>
            <button
              onClick={onSubmitReview}
              disabled={isLoading || rating === 0}
              className="flex-1 inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-orange-500 to-yellow-600 text-white font-bold rounded-2xl hover:from-orange-600 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:transform hover:scale-105"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <FiSend className="w-5 h-5 mr-3" />
                  Submit Review
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SessionReviewModal