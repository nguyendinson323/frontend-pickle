import React from 'react'
import { MatchRequest } from '../../../store/slices/playerFinderSlice'

interface PlayerFinderSentRequestsProps {
  sentRequests: MatchRequest[]
  onCancelRequest: (requestId: number) => void
}

const PlayerFinderSentRequests: React.FC<PlayerFinderSentRequestsProps> = ({
  sentRequests,
  onCancelRequest
}) => {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Sent Requests</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {sentRequests.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-sm text-gray-500">No sent requests yet.</p>
          </div>
        ) : (
          sentRequests.map((request) => (
            <div key={request.id} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {request.receiver?.full_name}
                  </h3>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>Date: {request.preferred_date}</p>
                    <p>Time: {request.preferred_time}</p>
                    {request.message && <p>Message: {request.message}</p>}
                    <p>Status: <span className={`font-medium ${
                      request.status === 'pending' ? 'text-yellow-600' :
                      request.status === 'accepted' ? 'text-green-600' :
                      request.status === 'rejected' ? 'text-red-600' :
                      'text-gray-600'
                    }`}>{request.status}</span></p>
                  </div>
                </div>
                <div>
                  {request.status === 'pending' && (
                    <button
                      onClick={() => onCancelRequest(request.id)}
                      className="bg-red-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default PlayerFinderSentRequests