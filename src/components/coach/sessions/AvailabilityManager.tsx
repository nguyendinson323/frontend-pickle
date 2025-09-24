import React, { useState } from 'react'
import {
  FiCalendar,
  FiClock,
  FiPlus,
  FiX,
  FiTrash2,
  FiRepeat,
  FiCheckCircle,
  FiSettings
} from 'react-icons/fi'

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
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div className="flex items-center mb-4 sm:mb-0">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center mr-4">
            <FiSettings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Availability Schedule</h3>
            <p className="text-gray-600 font-medium">
              Manage your coaching availability and time slots
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105 flex items-center"
        >
          <FiPlus className="w-5 h-5 mr-2" />
          Add Availability
        </button>
      </div>

      {/* Add Availability Form */}
      {isAdding && (
        <div className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mr-3">
              <FiPlus className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-900">Add New Availability</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recurring vs Specific Date */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200">
                <label className="block text-sm font-bold text-gray-700 mb-3">Availability Type</label>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6">
                  <label className="flex items-center bg-gray-50 hover:bg-gray-100 p-3 rounded-2xl cursor-pointer transition-all duration-200">
                    <input
                      type="radio"
                      name="availability-type"
                      checked={newAvailability.is_recurring}
                      onChange={() => setNewAvailability(prev => ({ ...prev, is_recurring: true, specific_date: '' }))}
                      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 mr-3"
                    />
                    <div className="flex items-center">
                      <FiRepeat className="w-4 h-4 text-indigo-600 mr-2" />
                      <span className="font-medium text-gray-700">Recurring (weekly)</span>
                    </div>
                  </label>
                  <label className="flex items-center bg-gray-50 hover:bg-gray-100 p-3 rounded-2xl cursor-pointer transition-all duration-200">
                    <input
                      type="radio"
                      name="availability-type"
                      checked={!newAvailability.is_recurring}
                      onChange={() => setNewAvailability(prev => ({ ...prev, is_recurring: false }))}
                      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 mr-3"
                    />
                    <div className="flex items-center">
                      <FiCalendar className="w-4 h-4 text-green-600 mr-2" />
                      <span className="font-medium text-gray-700">Specific date</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Day of Week or Specific Date */}
            {newAvailability.is_recurring ? (
              <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200">
                <div className="flex items-center mb-3">
                  <FiRepeat className="w-5 h-5 text-indigo-600 mr-2" />
                  <label htmlFor="day_of_week" className="block text-sm font-bold text-gray-700">
                    Day of Week
                  </label>
                </div>
                <select
                  id="day_of_week"
                  value={newAvailability.day_of_week}
                  onChange={(e) => setNewAvailability(prev => ({ ...prev, day_of_week: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium text-gray-900 bg-gray-50 hover:bg-white transition-all duration-200"
                >
                  {daysOfWeek.map((day, index) => (
                    <option key={index} value={index}>{day}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200">
                <div className="flex items-center mb-3">
                  <FiCalendar className="w-5 h-5 text-green-600 mr-2" />
                  <label htmlFor="specific_date" className="block text-sm font-bold text-gray-700">
                    Specific Date
                  </label>
                </div>
                <input
                  type="date"
                  id="specific_date"
                  value={newAvailability.specific_date}
                  onChange={(e) => setNewAvailability(prev => ({ ...prev, specific_date: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium text-gray-900 bg-gray-50 hover:bg-white transition-all duration-200"
                />
              </div>
            )}

            {/* Start Time */}
            <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200">
              <div className="flex items-center mb-3">
                <FiClock className="w-5 h-5 text-blue-600 mr-2" />
                <label htmlFor="start_time" className="block text-sm font-bold text-gray-700">
                  Start Time
                </label>
              </div>
              <input
                type="time"
                id="start_time"
                value={newAvailability.start_time}
                onChange={(e) => setNewAvailability(prev => ({ ...prev, start_time: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium text-gray-900 bg-gray-50 hover:bg-white transition-all duration-200"
              />
            </div>

            {/* End Time */}
            <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200">
              <div className="flex items-center mb-3">
                <FiClock className="w-5 h-5 text-orange-600 mr-2" />
                <label htmlFor="end_time" className="block text-sm font-bold text-gray-700">
                  End Time
                </label>
              </div>
              <input
                type="time"
                id="end_time"
                value={newAvailability.end_time}
                onChange={(e) => setNewAvailability(prev => ({ ...prev, end_time: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-medium text-gray-900 bg-gray-50 hover:bg-white transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6">
            <button
              onClick={() => setIsAdding(false)}
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105 flex items-center justify-center"
            >
              <FiX className="w-5 h-5 mr-2" />
              Cancel
            </button>
            <button
              onClick={handleAddAvailability}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105 flex items-center justify-center"
            >
              <FiCheckCircle className="w-5 h-5 mr-2" />
              Add Availability
            </button>
          </div>
        </div>
      )}

      {/* Recurring Availability */}
      {recurringAvailability.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mr-3">
              <FiRepeat className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-900">Weekly Recurring Schedule</h4>
          </div>
          <div className="space-y-3">
            {recurringAvailability
              .sort((a, b) => a.day_of_week - b.day_of_week)
              .map((slot) => (
                <div key={slot.id} className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mr-4">
                      <FiRepeat className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <span className="text-xl font-bold text-gray-900 block">
                        {daysOfWeek[slot.day_of_week]}
                      </span>
                      <span className="text-blue-700 font-medium flex items-center">
                        <FiClock className="w-4 h-4 mr-1" />
                        {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveAvailability(slot.id)}
                    className="bg-gradient-to-r from-red-600 to-pink-700 hover:from-red-700 hover:to-pink-800 text-white font-bold p-3 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105 flex items-center justify-center"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Specific Date Availability */}
      {specificAvailability.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl flex items-center justify-center mr-3">
              <FiCalendar className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-900">Specific Date Availability</h4>
          </div>
          <div className="space-y-3">
            {specificAvailability
              .sort((a, b) => new Date(a.specific_date!).getTime() - new Date(b.specific_date!).getTime())
              .map((slot) => (
                <div key={slot.id} className="flex items-center justify-between p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl flex items-center justify-center mr-4">
                      <FiCalendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <span className="text-xl font-bold text-gray-900 block">
                        {formatDate(slot.specific_date!)}
                      </span>
                      <span className="text-green-700 font-medium flex items-center">
                        <FiClock className="w-4 h-4 mr-1" />
                        {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveAvailability(slot.id)}
                    className="bg-gradient-to-r from-red-600 to-pink-700 hover:from-red-700 hover:to-pink-800 text-white font-bold p-3 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105 flex items-center justify-center"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {availability.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <FiCalendar className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No Availability Set</h3>
          <p className="text-gray-600 font-medium text-lg">
            Add your available time slots to allow students to book sessions with you.
          </p>
        </div>
      )}
    </div>
  )
}

export default AvailabilityManager