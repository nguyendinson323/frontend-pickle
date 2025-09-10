import React from 'react'
import { useNavigate } from 'react-router-dom'

interface Event {
  id: number
  name: string
  type: string
  date: string
  duration: string
  expected_revenue: number
  registrations: number
}

interface PartnerUpcomingEventsProps {
  upcomingEvents: Event[]
}

const PartnerUpcomingEvents: React.FC<PartnerUpcomingEventsProps> = ({ upcomingEvents }) => {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Upcoming Events</h3>
      {upcomingEvents.length > 0 ? (
        <div className="space-y-4">
          {upcomingEvents.slice(0, 3).map((event, index) => (
            <div key={event.id || index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{event.name}</p>
                  <p className="text-sm text-gray-600">{event.type}</p>
                  <p className="text-xs text-gray-500">{event.date} • {event.duration}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-orange-600">${event.expected_revenue}</p>
                  <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {event.registrations} registered
                  </span>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => navigate('/partner/events')}
            className="text-orange-600 hover:text-orange-500 text-sm font-medium"
          >
            View all events →
          </button>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🎉</div>
          <p className="text-gray-600 mb-4">No upcoming events</p>
          <button
            onClick={() => navigate('/partner/create-event')}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            Create Event
          </button>
        </div>
      )}
    </div>
  )
}

export default PartnerUpcomingEvents