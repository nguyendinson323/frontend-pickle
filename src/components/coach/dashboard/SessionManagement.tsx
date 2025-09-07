import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'

const SessionManagement: React.FC = () => {
  const { sessions, loading } = useSelector((state: RootState) => state.coach)

  if (loading) {
    return <div className="p-4">Loading sessions...</div>
  }

  const upcomingSessions = sessions.filter(s => s.status === 'scheduled')
  const completedSessions = sessions.filter(s => s.status === 'completed')
  const cancelledSessions = sessions.filter(s => s.status === 'cancelled')

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Session Management</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
          Schedule New Session
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Upcoming Sessions</h3>
          <p className="text-3xl font-bold text-blue-600">{upcomingSessions.length}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Completed Sessions</h3>
          <p className="text-3xl font-bold text-green-600">{completedSessions.length}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Cancelled Sessions</h3>
          <p className="text-3xl font-bold text-red-600">{cancelledSessions.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">All Sessions</h3>
        </div>
        
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Session Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sessions.map((session) => (
              <tr key={session.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {session.student_name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {session.student_level || 'Level not specified'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>{new Date(session.session_date).toLocaleDateString()}</div>
                  <div className="text-gray-500">
                    {session.start_time} - {session.end_time}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {session.duration_minutes} min
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {session.session_type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${session.fee || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    session.status === 'completed' 
                      ? 'bg-green-100 text-green-800'
                      : session.status === 'scheduled'
                      ? 'bg-blue-100 text-blue-800'
                      : session.status === 'in_progress'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {session.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {session.status === 'scheduled' && (
                    <>
                      <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Cancel
                      </button>
                    </>
                  )}
                  {session.status === 'completed' && (
                    <button className="text-green-600 hover:text-green-900">
                      View Details
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SessionManagement