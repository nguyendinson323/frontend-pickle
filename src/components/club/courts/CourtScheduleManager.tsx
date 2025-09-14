import React, { useState, useEffect } from 'react'

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
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Court Operating Hours</h3>
        <p className="text-sm text-gray-600 mt-1">
          Manage operating hours for each day of the week. These hours determine when players can make reservations.
        </p>
      </div>

      <div className="p-6">
        {Object.entries(schedulesByCourt).map(([courtId, courtSchedules]) => (
          <div key={courtId} className="mb-8 last:mb-0">
            <h4 className="text-md font-medium text-gray-900 mb-4">
              {getCourtName(Number(courtId))}
            </h4>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Day
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Open Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Close Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {courtSchedules
                    .sort((a, b) => a.day_of_week - b.day_of_week)
                    .map((schedule) => (
                      <tr key={schedule.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {daysOfWeek[schedule.day_of_week]}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingSchedule === schedule.id ? (
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={!formData.is_closed}
                                onChange={(e) => setFormData(prev => ({ ...prev, is_closed: !e.target.checked }))}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">Open</span>
                            </label>
                          ) : (
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              schedule.is_closed
                                ? 'bg-red-100 text-red-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {schedule.is_closed ? 'Closed' : 'Open'}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {editingSchedule === schedule.id ? (
                            <input
                              type="time"
                              value={formData.open_time}
                              onChange={(e) => setFormData(prev => ({ ...prev, open_time: e.target.value }))}
                              disabled={formData.is_closed}
                              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-100"
                            />
                          ) : (
                            schedule.is_closed ? '-' : formatTime(schedule.open_time)
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {editingSchedule === schedule.id ? (
                            <input
                              type="time"
                              value={formData.close_time}
                              onChange={(e) => setFormData(prev => ({ ...prev, close_time: e.target.value }))}
                              disabled={formData.is_closed}
                              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-100"
                            />
                          ) : (
                            schedule.is_closed ? '-' : formatTime(schedule.close_time)
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {editingSchedule === schedule.id ? (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleSaveSchedule(schedule.id)}
                                className="text-green-600 hover:text-green-900"
                              >
                                Save
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="text-gray-600 hover:text-gray-900"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleEditSchedule(schedule)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
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
          <div className="text-center py-8">
            <div className="text-gray-500">
              <div className="text-4xl mb-2">🕐</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Schedules Found</h3>
              <p className="text-gray-600">
                {selectedCourtId
                  ? 'No schedules found for the selected court.'
                  : 'No courts have been set up yet. Add a court to manage its schedule.'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CourtScheduleManager