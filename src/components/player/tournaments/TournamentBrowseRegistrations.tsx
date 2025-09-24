import React from 'react'
import { TournamentRegistration } from '../../../store/slices/tournamentBrowseSlice'
import { FiUsers, FiCalendar, FiMapPin, FiDollarSign, FiUserPlus, FiSearch, FiInbox, FiX } from 'react-icons/fi'

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
    <div className="bg-white shadow-2xl rounded-3xl border-2 border-gray-100">
      <div className="px-8 py-6 border-b-2 border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mr-4 shadow-xl">
            <FiUsers className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">My Tournament Registrations</h3>
        </div>
      </div>
      <div className="divide-y-2 divide-gray-100">
        {userRegistrations.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
              <FiInbox className="w-10 h-10 text-white" />
            </div>
            <h4 className="text-2xl font-bold text-gray-900 mb-4">No Registrations Yet</h4>
            <p className="text-lg text-gray-600 font-medium mb-8">Start your tournament journey by registering for exciting competitions!</p>
            <button
              onClick={onBrowseClick}
              className="flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 mx-auto"
            >
              <FiSearch className="w-5 h-5 mr-3" />
              Browse Tournaments
            </button>
          </div>
        ) : (
          userRegistrations.map((registration) => (
            <div key={registration.id} className="p-8 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {registration.tournament?.name}
                    </h3>
                    <span className={`inline-flex items-center px-4 py-2 rounded-2xl text-sm font-bold capitalize shadow-lg ${
                      registration.status === 'registered' ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' :
                      registration.status === 'confirmed' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' :
                      registration.status === 'waitlisted' ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white' :
                      'bg-gradient-to-r from-red-500 to-pink-600 text-white'
                    }`}>{registration.status}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="bg-purple-50 p-4 rounded-2xl border-2 border-purple-100">
                      <div className="flex items-center">
                        <FiUsers className="w-4 h-4 text-purple-600 mr-2" />
                        <span className="text-sm font-bold text-purple-700">Category</span>
                      </div>
                      <p className="font-bold text-gray-900 mt-1">{registration.category?.name}</p>
                    </div>
                    <div className={`p-4 rounded-2xl border-2 ${
                      registration.payment_status === 'paid' ? 'bg-green-50 border-green-100' :
                      registration.payment_status === 'pending' ? 'bg-yellow-50 border-yellow-100' :
                      'bg-red-50 border-red-100'
                    }`}>
                      <div className="flex items-center">
                        <FiDollarSign className={`w-4 h-4 mr-2 ${
                          registration.payment_status === 'paid' ? 'text-green-600' :
                          registration.payment_status === 'pending' ? 'text-yellow-600' :
                          'text-red-600'
                        }`} />
                        <span className={`text-sm font-bold ${
                          registration.payment_status === 'paid' ? 'text-green-700' :
                          registration.payment_status === 'pending' ? 'text-yellow-700' :
                          'text-red-700'
                        }`}>Payment</span>
                      </div>
                      <p className="font-bold text-gray-900 mt-1 capitalize">{registration.payment_status}</p>
                    </div>
                    {registration.amount_paid && (
                      <div className="bg-indigo-50 p-4 rounded-2xl border-2 border-indigo-100">
                        <div className="flex items-center">
                          <FiDollarSign className="w-4 h-4 text-indigo-600 mr-2" />
                          <span className="text-sm font-bold text-indigo-700">Fee</span>
                        </div>
                        <p className="font-bold text-gray-900 mt-1">${registration.amount_paid}</p>
                      </div>
                    )}
                  </div>
                  {registration.tournament && (
                    <div className="flex flex-wrap gap-3 mb-4">
                      <div className="bg-blue-50 p-3 rounded-2xl border-2 border-blue-100 flex items-center">
                        <FiCalendar className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="text-sm font-bold text-blue-700">
                          {formatDate(registration.tournament.start_date)} - {formatDate(registration.tournament.end_date)}
                        </span>
                      </div>
                      {registration.tournament.venue_name && (
                        <div className="bg-orange-50 p-3 rounded-2xl border-2 border-orange-100 flex items-center">
                          <FiMapPin className="w-4 h-4 text-orange-600 mr-2" />
                          <span className="text-sm font-bold text-orange-700">{registration.tournament.venue_name}</span>
                        </div>
                      )}
                    </div>
                  )}
                  {registration.partnerPlayer && (
                    <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-4 rounded-2xl border-2 border-pink-100">
                      <div className="flex items-center">
                        <FiUserPlus className="w-5 h-5 text-pink-600 mr-2" />
                        <span className="text-sm font-bold text-pink-700">Tournament Partner</span>
                      </div>
                      <p className="font-bold text-gray-900 mt-1">
                        {registration.partnerPlayer.full_name} (Level {registration.partnerPlayer.nrtp_level})
                      </p>
                    </div>
                  )}
                </div>
                <div className="ml-6">
                  {registration.status === 'registered' && (
                    <button
                      onClick={() => onWithdraw(registration.id)}
                      className="flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-red-300"
                    >
                      <FiX className="w-5 h-5 mr-2" />
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