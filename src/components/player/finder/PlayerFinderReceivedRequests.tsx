import React from 'react'
import { MatchRequest } from '../../../store/slices/playerFinderSlice'

interface PlayerFinderReceivedRequestsProps {
  receivedRequests: MatchRequest[]
  onRespondToRequest: (requestId: number, status: 'accepted' | 'rejected', responseMessage?: string) => void
}

const PlayerFinderReceivedRequests: React.FC<PlayerFinderReceivedRequestsProps> = ({
  receivedRequests,
  onRespondToRequest
}) => {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Received Requests</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {receivedRequests.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-sm text-gray-500">No received requests yet.</p>
          </div>
        ) : (
          receivedRequests.map((request) => (
            <div key={request.id} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {request.requester?.full_name}
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
                <div className="space-x-2">
                  {request.status === 'pending' && (
                    <>
                      <button
                        onClick={() => onRespondToRequest(request.id, 'accepted')}
                        className="bg-green-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => onRespondToRequest(request.id, 'rejected')}
                        className="bg-red-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Reject
                      </button>
                    </>
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

export default PlayerFinderReceivedRequests