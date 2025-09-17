import React, { useState, useEffect } from 'react'
import {
  FiClock,
  FiCalendar,
  FiMapPin,
  FiEdit2,
  FiSave,
  FiX,
  FiCheckCircle,
  FiXCircle,
  FiSettings
} from 'react-icons/fi'

interface CourtSchedule {
  id: number
  court_id: number
  day_of_week: number
  open_time: string
  close_time: string
  is_closed: boolean
  created_at: string
}

interface Court {
  id: number
  name: string
}

interface CourtScheduleManagerProps {
  schedules: CourtSchedule[]
  courts: Court[]
  selectedCourtId?: number
  onUpdateSchedule: (scheduleId: number, scheduleData: Partial<CourtSchedule>) => Promise<void>
}

const CourtScheduleManager: React.FC<CourtScheduleManagerProps> = ({
  schedules,
  courts,
  selectedCourtId,
  onUpdateSchedule
}) => {
  const [editingSchedule, setEditingSchedule] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    open_time: '',
    close_time: '',
    is_closed: false
  })

  const daysOfWeek = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ]

  // Filter schedules for selected court or show all
  const filteredSchedules = selectedCourtId
    ? schedules.filter(schedule => schedule.court_id === selectedCourtId)
    : schedules

  // Group schedules by court
  const schedulesByCourt = filteredSchedules.reduce((acc, schedule) => {
    if (!acc[schedule.court_id]) {
      acc[schedule.court_id] = []
    }
    acc[schedule.court_id].push(schedule)
    return acc
  }, {} as Record<number, CourtSchedule[]>)

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const handleEditSchedule = (schedule: CourtSchedule) => {
    setEditingSchedule(schedule.id)
    setFormData({
      open_time: schedule.open_time.substring(0, 5), // Remove seconds
      close_time: schedule.close_time.substring(0, 5), // Remove seconds
      is_closed: schedule.is_closed
    })
  }

  const handleSaveSchedule = async (scheduleId: number) => {
    try {
      await onUpdateSchedule(scheduleId, {
        ...formData,
        open_time: formData.open_time + ':00',
        close_time: formData.close_time + ':00'
      })
      setEditingSchedule(null)
    } catch (error) {
      console.error('Error updating schedule:', error)
    }
  }

  const handleCancelEdit = () => {
    setEditingSchedule(null)
    setFormData({
      open_time: '',
      close_time: '',
      is_closed: false
    })
  }

  const getCourtName = (courtId: number) => {
    const court = courts.find(c => c.id === courtId)
    return court?.name || `Court ${courtId}`
  }

  return (
    <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-green-50 to-emerald-100 px-8 py-6 border-b-2 border-green-200">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white mr-4">
            <FiClock className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Court Operating Hours</h3>
            <p className="text-green-700 font-medium">
              Manage operating hours for each day of the week. These hours determine when players can make reservations.
            </p>
          </div>
        </div>
      </div>

      <div className="p-8">
        {Object.entries(schedulesByCourt).map(([courtId, courtSchedules]) => (
          <div key={courtId} className="mb-10 last:mb-0">
            <div className="flex items-center mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl border-2 border-blue-200">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white mr-3">
                <FiMapPin className="h-5 w-5" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">
                {getCourtName(Number(courtId))}
              </h4>
            </div>

            <div className="overflow-x-auto bg-white rounded-2xl border-2 border-gray-200 shadow-lg">
              <table className="min-w-full divide-y-2 divide-gray-100">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-8 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FiCalendar className="h-4 w-4 mr-2" />
                        Day
                      </div>
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FiCheckCircle className="h-4 w-4 mr-2" />
                        Status
                      </div>
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FiClock className="h-4 w-4 mr-2" />
                        Open Time
                      </div>
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FiClock className="h-4 w-4 mr-2" />
                        Close Time
                      </div>
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FiSettings className="h-4 w-4 mr-2" />
                        Actions
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y-2 divide-gray-100">
                  {courtSchedules
                    .sort((a, b) => a.day_of_week - b.day_of_week)
                    .map((schedule, index) => (
                      <tr key={schedule.id} className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-green-50 transition-all duration-200 animate-table-row" style={{ animationDelay: `${index * 50}ms` }}>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white mr-3">
                              <FiCalendar className="h-5 w-5" />
                            </div>
                            <span className="text-lg font-bold text-gray-900">{daysOfWeek[schedule.day_of_week]}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          {editingSchedule === schedule.id ? (
                            <label className="flex items-center p-3 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-green-300 transition-all duration-200">
                              <input
                                type="checkbox"
                                checked={!formData.is_closed}
                                onChange={(e) => setFormData(prev => ({ ...prev, is_closed: !e.target.checked }))}
                                className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded-lg"
                              />
                              <span className="ml-3 text-sm font-bold text-gray-700">Open for business</span>
                            </label>
                          ) : (
                            <div className={`inline-flex items-center px-4 py-2 text-sm font-bold rounded-2xl border-2 shadow-sm ${
                              schedule.is_closed
                                ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-200'
                                : 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200'
                            }`}>
                              {schedule.is_closed ? (
                                <>
                                  <FiXCircle className="h-4 w-4 mr-2" />
                                  Closed
                                </>
                              ) : (
                                <>
                                  <FiCheckCircle className="h-4 w-4 mr-2" />
                                  Open
                                </>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          {editingSchedule === schedule.id ? (
                            <input
                              type="time"
                              value={formData.open_time}
                              onChange={(e) => setFormData(prev => ({ ...prev, open_time: e.target.value }))}
                              disabled={formData.is_closed}
                              className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 font-medium transition-all duration-200"
                            />
                          ) : (
                            <div className="flex items-center">
                              <FiClock className="h-5 w-5 text-green-500 mr-2" />
                              <span className="text-lg font-medium text-gray-900">
                                {schedule.is_closed ? '-' : formatTime(schedule.open_time)}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          {editingSchedule === schedule.id ? (
                            <input
                              type="time"
                              value={formData.close_time}
                              onChange={(e) => setFormData(prev => ({ ...prev, close_time: e.target.value }))}
                              disabled={formData.is_closed}
                              className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 font-medium transition-all duration-200"
                            />
                          ) : (
                            <div className="flex items-center">
                              <FiClock className="h-5 w-5 text-green-500 mr-2" />
                              <span className="text-lg font-medium text-gray-900">
                                {schedule.is_closed ? '-' : formatTime(schedule.close_time)}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          {editingSchedule === schedule.id ? (
                            <div className="flex space-x-3">
                              <button
                                onClick={() => handleSaveSchedule(schedule.id)}
                                className="inline-flex items-center px-4 py-2 text-sm font-bold text-green-700 bg-gradient-to-r from-green-100 to-green-200 border-2 border-green-200 rounded-xl hover:from-green-200 hover:to-green-300 hover:border-green-300 shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              >
                                <FiSave className="h-4 w-4 mr-2" />
                                Save
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="inline-flex items-center px-4 py-2 text-sm font-bold text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-gray-200 rounded-xl hover:from-gray-200 hover:to-gray-300 hover:border-gray-300 shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                              >
                                <FiX className="h-4 w-4 mr-2" />
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleEditSchedule(schedule)}
                              className="inline-flex items-center px-4 py-2 text-sm font-bold text-blue-700 bg-gradient-to-r from-blue-100 to-blue-200 border-2 border-blue-200 rounded-xl hover:from-blue-200 hover:to-blue-300 hover:border-blue-300 shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <FiEdit2 className="h-4 w-4 mr-2" />
                              Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {Object.keys(schedulesByCourt).length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <FiClock className="h-12 w-12 text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Schedules Found</h3>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              {selectedCourtId
                ? 'No schedules found for the selected court. Please check your court selection.'
                : 'No courts have been set up yet. Add a court first to manage its operating schedule.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CourtScheduleManager