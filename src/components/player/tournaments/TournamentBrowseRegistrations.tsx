import React from 'react'
import { TournamentRegistration } from '../../../store/slices/tournamentBrowseSlice'

interface TournamentBrowseRegistrationsProps {
  userRegistrations: TournamentRegistration[]
  onWithdraw: (registrationId: number) => void
  onBrowseClick: () => void
}

const TournamentBrowseRegistrations: React.FC<TournamentBrowseRegistrationsProps> = ({
  userRegistrations,
  onWithdraw,
  onBrowseClick
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">My Tournament Registrations</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {userRegistrations.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-sm text-gray-500">You haven't registered for any tournaments yet.</p>
            <button
              onClick={onBrowseClick}
              className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Browse tournaments
            </button>
          </div>
        ) : (
          userRegistrations.map((registration) => (
            <div key={registration.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    {registration.tournament?.name}
                  </h3>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <span>Category: {registration.category?.name}</span>
                    <span>Status: <span className={`font-medium ${
                      registration.status === 'registered' ? 'text-blue-600' :
                      registration.status === 'confirmed' ? 'text-green-600' :
                      registration.status === 'waitlisted' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>{registration.status}</span></span>
                    <span>Payment: <span className={`font-medium ${
                      registration.payment_status === 'paid' ? 'text-green-600' :
                      registration.payment_status === 'pending' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>{registration.payment_status}</span></span>
                    {registration.amount_paid && (
                      <span>Fee: ${registration.amount_paid}</span>
                    )}
                  </div>
                  {registration.tournament && (
                    <div className="mt-1 text-sm text-gray-500">
                      📅 {formatDate(registration.tournament.start_date)} - {formatDate(registration.tournament.end_date)}
                      {registration.tournament.venue_name && (
                        <span className="ml-4">📍 {registration.tournament.venue_name}</span>
                      )}
                    </div>
                  )}
                  {registration.partnerPlayer && (
                    <div className="mt-1 text-sm text-gray-600">
                      Partner: {registration.partnerPlayer.full_name} (Level {registration.partnerPlayer.nrtp_level})
                    </div>
                  )}
                </div>
                <div>
                  {registration.status === 'registered' && (
                    <button
                      onClick={() => onWithdraw(registration.id)}
                      className="bg-red-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Withdraw
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

export default TournamentBrowseRegistrations