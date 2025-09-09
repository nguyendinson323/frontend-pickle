import React, { useState } from 'react'

interface CoachAvailability {
  id: number
  coach_id: number
  day_of_week: number
  start_time: string
  end_time: string
  is_recurring: boolean
  specific_date: string | null
  created_at: string
}

interface AvailabilityManagerProps {
  availability: CoachAvailability[]
  onAddAvailability: (availability: Partial<CoachAvailability>) => void
  onRemoveAvailability: (availabilityId: number) => void
}

const AvailabilityManager: React.FC<AvailabilityManagerProps> = ({
  availability,
  onAddAvailability,
  onRemoveAvailability
}) => {
  const [isAdding, setIsAdding] = useState(false)
  const [newAvailability, setNewAvailability] = useState({
    day_of_week: 0,
    start_time: '',
    end_time: '',
    is_recurring: true,
    specific_date: ''
  })

  const daysOfWeek = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ]

  const handleAddAvailability = () => {
    if (!newAvailability.start_time || !newAvailability.end_time) {
      return
    }

    const availabilityData: Partial<CoachAvailability> = {
      day_of_week: newAvailability.day_of_week,
      start_time: newAvailability.start_time,
      end_time: newAvailability.end_time,
      is_recurring: newAvailability.is_recurring,
      specific_date: newAvailability.is_recurring ? null : newAvailability.specific_date || null
    }

    onAddAvailability(availabilityData)
    setNewAvailability({
      day_of_week: 0,
      start_time: '',
      end_time: '',
      is_recurring: true,
      specific_date: ''
    })
    setIsAdding(false)
  }

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Group availability by recurring vs specific dates
  const recurringAvailability = availability.filter(slot => slot.is_recurring)
  const specificAvailability = availability.filter(slot => !slot.is_recurring)

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Availability Schedule</h3>
        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
        >
          Add Availability
        </button>
      </div>

      {/* Add Availability Form */}
      {isAdding && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h4 className="text-md font-medium text-gray-900 mb-4">Add New Availability</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Recurring vs Specific Date */}
            <div className="md:col-span-2">
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="availability-type"
                    checked={newAvailability.is_recurring}
                    onChange={() => setNewAvailability(prev => ({ ...prev, is_recurring: true, specific_date: '' }))}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Recurring (weekly)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="availability-type"
                    checked={!newAvailability.is_recurring}
                    onChange={() => setNewAvailability(prev => ({ ...prev, is_recurring: false }))}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Specific date</span>
                </label>
              </div>
            </div>

            {/* Day of Week or Specific Date */}
            {newAvailability.is_recurring ? (
              <div>
                <label htmlFor="day_of_week" className="block text-sm font-medium text-gray-700 mb-2">
                  Day of Week
                </label>
                <select
                  id="day_of_week"
                  value={newAvailability.day_of_week}
                  onChange={(e) => setNewAvailability(prev => ({ ...prev, day_of_week: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {daysOfWeek.map((day, index) => (
                    <option key={index} value={index}>{day}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label htmlFor="specific_date" className="block text-sm font-medium text-gray-700 mb-2">
                  Specific Date
                </label>
                <input
                  type="date"
                  id="specific_date"
                  value={newAvailability.specific_date}
                  onChange={(e) => setNewAvailability(prev => ({ ...prev, specific_date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            )}

            {/* Start Time */}
            <div>
              <label htmlFor="start_time" className="block text-sm font-medium text-gray-700 mb-2">
                Start Time
              </label>
              <input
                type="time"
                id="start_time"
                value={newAvailability.start_time}
                onChange={(e) => setNewAvailability(prev => ({ ...prev, start_time: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* End Time */}
            <div>
              <label htmlFor="end_time" className="block text-sm font-medium text-gray-700 mb-2">
                End Time
              </label>
              <input
                type="time"
                id="end_time"
                value={newAvailability.end_time}
                onChange={(e) => setNewAvailability(prev => ({ ...prev, end_time: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleAddAvailability}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              Add Availability
            </button>
          </div>
        </div>
      )}

      {/* Recurring Availability */}
      {recurringAvailability.length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-900 mb-3">Weekly Recurring Schedule</h4>
          <div className="space-y-2">
            {recurringAvailability
              .sort((a, b) => a.day_of_week - b.day_of_week)
              .map((slot) => (
                <div key={slot.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <span className="font-medium text-gray-900">
                      {daysOfWeek[slot.day_of_week]}
                    </span>
                    <span className="text-gray-600 ml-2">
                      {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                    </span>
                  </div>
                  <button
                    onClick={() => onRemoveAvailability(slot.id)}
                    className="text-red-600 hover:text-red-700 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Specific Date Availability */}
      {specificAvailability.length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-900 mb-3">Specific Date Availability</h4>
          <div className="space-y-2">
            {specificAvailability
              .sort((a, b) => new Date(a.specific_date!).getTime() - new Date(b.specific_date!).getTime())
              .map((slot) => (
                <div key={slot.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <span className="font-medium text-gray-900">
                      {formatDate(slot.specific_date!)}
                    </span>
                    <span className="text-gray-600 ml-2">
                      {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                    </span>
                  </div>
                  <button
                    onClick={() => onRemoveAvailability(slot.id)}
                    className="text-red-600 hover:text-red-700 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {availability.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-500">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Availability Set</h3>
            <p className="text-gray-600">
              Add your available time slots to allow students to book sessions with you.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default AvailabilityManager