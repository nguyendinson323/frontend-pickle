import React from 'react'
import { MatchRequest } from '../../../store/slices/playerFinderSlice'
import {
  FiSend,
  FiUser,
  FiCalendar,
  FiClock,
  FiMessageSquare,
  FiX,
  FiMail
} from 'react-icons/fi'

interface PlayerFinderSentRequestsProps {
  sentRequests: MatchRequest[]
  onCancelRequest: (requestId: number) => void
}

const PlayerFinderSentRequests: React.FC<PlayerFinderSentRequestsProps> = ({
  sentRequests,
  onCancelRequest
}) => {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-3xl border-2 border-gray-100">
      <div className="px-8 py-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4">
            <FiSend className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Sent Requests</h3>
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {sentRequests.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FiMail className="w-10 h-10 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">No sent requests yet</h4>
            <p className="text-gray-600 font-medium">Your sent match requests will appear here</p>
          </div>
        ) : (
          sentRequests.map((request) => {
            const getStatusColor = () => {
              if (request.status === 'pending') return 'from-yellow-500 to-orange-600'
              if (request.status === 'accepted') return 'from-green-500 to-emerald-600'
              if (request.status === 'rejected') return 'from-red-500 to-pink-600'
              return 'from-gray-500 to-gray-600'
            }

            const getStatusBgColor = () => {
              if (request.status === 'pending') return 'from-yellow-50 to-orange-50 border-yellow-200'
              if (request.status === 'accepted') return 'from-green-50 to-emerald-50 border-green-200'
              if (request.status === 'rejected') return 'from-red-50 to-pink-50 border-red-200'
              return 'from-gray-50 to-slate-50 border-gray-200'
            }

            return (
              <div key={request.id} className={`p-8 bg-gradient-to-r ${getStatusBgColor()} border-2 rounded-3xl m-4 hover:shadow-lg transition-all duration-300`}>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1 mb-4 lg:mb-0">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4">
                        <FiUser className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {request.receiver?.full_name}
                        </h3>
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r ${getStatusColor()} text-white shadow-lg`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center text-gray-700">
                        <FiCalendar className="w-4 h-4 mr-2 text-blue-500" />
                        <span className="font-medium">{request.preferred_date}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <FiClock className="w-4 h-4 mr-2 text-green-500" />
                        <span className="font-medium">{request.preferred_time}</span>
                      </div>
                    </div>

                    {request.message && (
                      <div className="mt-4 p-4 bg-white bg-opacity-50 rounded-2xl border border-white">
                        <div className="flex items-start">
                          <FiMessageSquare className="w-4 h-4 mr-2 text-indigo-500 mt-1" />
                          <p className="text-sm font-medium text-gray-800">{request.message}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center lg:justify-end">
                    {request.status === 'pending' && (
                      <button
                        onClick={() => onCancelRequest(request.id)}
                        className="inline-flex items-center bg-gradient-to-r from-red-500 to-pink-600 border border-transparent rounded-2xl shadow-xl py-3 px-6 text-sm font-bold text-white hover:from-red-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 hover:transform hover:scale-105"
                      >
                        <FiX className="w-4 h-4 mr-2" />
                        Cancel Request
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default PlayerFinderSentRequests