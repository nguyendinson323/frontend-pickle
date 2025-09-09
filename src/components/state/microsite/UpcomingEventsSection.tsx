import React from 'react'
import { StateMicrositeEvent } from '../../../store/slices/stateMicrositeSlice'

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
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Upcoming Tournaments</h2>
          <p className="text-gray-600 mt-1">Don't miss these exciting pickleball events</p>
        </div>
        <div className="text-sm text-gray-500">
          {events.length} tournament{events.length !== 1 ? 's' : ''} scheduled
        </div>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a3 3 0 100-6 3 3 0 000 6z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming tournaments</h3>
          <p className="mt-1 text-sm text-gray-500">Check back soon for new tournament announcements!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="mb-3">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-lg">{event.name}</h3>
                  <div className="flex flex-col items-end space-y-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)}`}>
                      {event.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    {event.tournament_type && (
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTournamentTypeColor(event.tournament_type)}`}>
                        {event.tournament_type}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a3 3 0 100-6 3 3 0 000 6z" />
                    </svg>
                    <span className="font-medium">{formatDateRange(event.start_date, event.end_date)}</span>
                  </div>

                  {event.venue_name && (
                    <div className="flex items-start">
                      <svg className="w-4 h-4 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <div className="font-medium">{event.venue_name}</div>
                        {event.venue_address && (
                          <div className="text-xs text-gray-500">{event.venue_address}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                {event.entry_fee !== null && (
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">
                      ${event.entry_fee === 0 ? 'Free' : event.entry_fee.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">Entry Fee</div>
                  </div>
                )}
                
                {event.max_participants && (
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-600">
                      {event.current_registrations || 0}/{event.max_participants}
                    </div>
                    <div className="text-xs text-gray-500">Registered</div>
                  </div>
                )}
              </div>

              {event.status === 'upcoming' && (
                <div className="mt-4">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors">
                    View Details
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {events.length > 0 && (
        <div className="mt-6 text-center">
          <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
            View All Tournaments →
          </button>
        </div>
      )}
    </div>
  )
}

export default UpcomingEventsSection