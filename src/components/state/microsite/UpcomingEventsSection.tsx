import React from 'react'
import { StateMicrositeEvent } from '../../../store/slices/stateMicrositeSlice'
import { FiCalendar, FiMapPin, FiDollarSign, FiUsers, FiEye, FiArrowRight, FiAward } from 'react-icons/fi'

interface UpcomingEventsSectionProps {
  events: StateMicrositeEvent[]
}

const UpcomingEventsSection: React.FC<UpcomingEventsSectionProps> = ({ events }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    if (start.toDateString() === end.toDateString()) {
      return formatDate(startDate)
    } else {
      return `${formatDate(startDate)} - ${formatDate(endDate)}`
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800'
      case 'ongoing':
        return 'bg-green-100 text-green-800'
      case 'registration_open':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTournamentTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'state':
        return 'bg-indigo-100 text-indigo-800'
      case 'regional':
        return 'bg-orange-100 text-orange-800'
      case 'municipal':
        return 'bg-green-100 text-green-800'
      case 'state league':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-gradient-to-br from-white to-green-50/30 rounded-3xl shadow-xl border border-gray-200/50 p-8 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-green-500 p-3 rounded-2xl shadow-lg">
              <FiCalendar className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Upcoming Tournaments</h2>
          </div>
          <p className="text-gray-600 text-lg">Don't miss these exciting pickleball events</p>
        </div>
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-xl font-bold text-sm">
          {events.length} tournament{events.length !== 1 ? 's' : ''} scheduled
        </div>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-8 rounded-full mx-auto w-24 h-24 flex items-center justify-center shadow-lg mb-6">
            <FiAward className="w-12 h-12 text-gray-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No upcoming tournaments</h3>
          <p className="text-gray-600 max-w-md mx-auto leading-relaxed">Check back soon for new tournament announcements and exciting events!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="mb-4">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-gray-900 text-lg leading-tight">{event.name}</h3>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-xl shadow-sm ${getStatusColor(event.status)}`}>
                      <FiCalendar className="w-3 h-3 mr-1" />
                      {event.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    {event.tournament_type && (
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-xl shadow-sm ${getTournamentTypeColor(event.tournament_type)}`}>
                        <FiAward className="w-3 h-3 mr-1" />
                        {event.tournament_type}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-white/60 rounded-xl p-3 backdrop-blur-sm">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="bg-blue-100 p-1 rounded-lg">
                        <FiCalendar className="w-3 h-3 text-blue-600" />
                      </div>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</span>
                    </div>
                    <span className="font-bold text-gray-900">{formatDateRange(event.start_date, event.end_date)}</span>
                  </div>

                  {event.venue_name && (
                    <div className="bg-white/60 rounded-xl p-3 backdrop-blur-sm">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="bg-purple-100 p-1 rounded-lg">
                          <FiMapPin className="w-3 h-3 text-purple-600" />
                        </div>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Venue</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{event.venue_name}</div>
                        {event.venue_address && (
                          <div className="text-sm text-gray-600 mt-1">{event.venue_address}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                {event.entry_fee !== null && (
                  <div className="bg-white/60 rounded-xl p-3 text-center backdrop-blur-sm">
                    <div className="flex items-center justify-center space-x-2 mb-1">
                      <div className="bg-green-100 p-1 rounded-lg">
                        <FiDollarSign className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Entry Fee</span>
                    </div>
                    <div className="text-xl font-bold text-green-600">
                      {event.entry_fee === 0 ? 'Free' : `$${event.entry_fee.toFixed(2)}`}
                    </div>
                  </div>
                )}

                {event.max_participants && (
                  <div className="bg-white/60 rounded-xl p-3 text-center backdrop-blur-sm">
                    <div className="flex items-center justify-center space-x-2 mb-1">
                      <div className="bg-blue-100 p-1 rounded-lg">
                        <FiUsers className="w-3 h-3 text-blue-600" />
                      </div>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Registered</span>
                    </div>
                    <div className="text-xl font-bold text-blue-600">
                      {event.current_registrations || 0}/{event.max_participants}
                    </div>
                  </div>
                )}
              </div>

              {event.status === 'upcoming' && (
                <div className="mt-6">
                  <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2">
                    <FiEye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {events.length > 0 && (
        <div className="mt-8 text-center">
          <button className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 hover:scale-105 flex items-center space-x-2 mx-auto">
            <span>View All Tournaments</span>
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      )}
    </div>
  )
}

export default UpcomingEventsSection