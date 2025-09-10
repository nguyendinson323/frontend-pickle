import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import { getStudentDetails, addStudentNote } from '../../../store/slices/coachStudentsSlice'

interface Student {
  id: number
  full_name: string
  profile_photo_url: string | null
  nrtp_level: number
  email: string
  phone: string
  state_id: number
  state_name: string
  created_at: string
  sessions: {
    total_sessions: number
    completed_sessions: number
    upcoming_sessions: number
    last_session_date: string | null
    average_rating: number
    total_spent: number
  }
  progress: {
    initial_level: number
    current_level: number
    improvement: number
    sessions_to_improve: number
  }
}

interface StudentDetailsModalProps {
  student: Student
  onClose: () => void
  onUpdateLevel: (studentId: number, newLevel: number) => void
}

const StudentDetailsModal: React.FC<StudentDetailsModalProps> = ({
  student,
  onClose,
  onUpdateLevel
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { selectedStudent, isLoading } = useSelector((state: RootState) => state.coachStudents)
  const [note, setNote] = React.useState('')

  useEffect(() => {
    if (student.id) {
      dispatch(getStudentDetails(student.id))
    }
  }, [dispatch, student.id])

  const handleAddNote = async () => {
    if (note.trim()) {
      await dispatch(addStudentNote(student.id, note.trim()))
      setNote('')
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {student.profile_photo_url ? (
                <img 
                  src={student.profile_photo_url} 
                  alt={student.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xl font-semibold text-gray-600">
                  {student.full_name.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{student.full_name}</h2>
              <p className="text-gray-600">Student Details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isLoading ? (
          <div className="p-6 text-center">
            <div className="text-gray-500">Loading student details...</div>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Contact Information */}
            <div className=" p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <div className="text-gray-900">{student.email}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <div className="text-gray-900">{student.phone}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <div className="text-gray-900">{student.state_name}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Member Since</label>
                  <div className="text-gray-900">{formatDate(student.created_at)}</div>
                </div>
              </div>
            </div>

            {/* Level Management */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">NRTP Level</h3>
              <div className="flex items-center space-x-4">
                <span className="text-2xl font-bold text-blue-600">{student.nrtp_level}</span>
                <select
                  value={student.nrtp_level}
                  onChange={(e) => onUpdateLevel(student.id, parseFloat(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1.0}>1.0</option>
                  <option value={1.5}>1.5</option>
                  <option value={2.0}>2.0</option>
                  <option value={2.5}>2.5</option>
                  <option value={3.0}>3.0</option>
                  <option value={3.5}>3.5</option>
                  <option value={4.0}>4.0</option>
                  <option value={4.5}>4.5</option>
                  <option value={5.0}>5.0</option>
                </select>
                <span className="text-sm text-gray-600">Update Level</span>
              </div>
            </div>

            {/* Session Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">{student.sessions.total_sessions}</div>
                <div className="text-sm text-gray-600">Total Sessions</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{student.sessions.completed_sessions}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">{student.sessions.upcoming_sessions}</div>
                <div className="text-sm text-gray-600">Upcoming</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-600">{student.sessions.average_rating.toFixed(1)}</div>
                <div className="text-sm text-gray-600">Avg Rating</div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Financial Summary</h3>
              <div className="text-3xl font-bold text-indigo-600">${student.sessions.total_spent.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Total Revenue Generated</div>
            </div>

            {/* Recent Sessions */}
            {selectedStudent && (selectedStudent as any).recent_sessions && (selectedStudent as any).recent_sessions.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Sessions</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {(selectedStudent as any).recent_sessions.map((session: any, index: number) => (
                    <div key={index} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-gray-900">
                            {formatDateTime(session.session_date)}
                          </div>
                          <div className="text-sm text-gray-600 capitalize">
                            Status: {session.status}
                          </div>
                          {session.rating && (
                            <div className="text-sm text-yellow-600">
                              Rating: {session.rating} ★
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">
                            ${parseFloat(session.price || 0).toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-600 capitalize">
                            {session.payment_status}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add Note */}
            <div className=" p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Add Note</h3>
              <div className="flex space-x-2">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note about this student..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                />
                <button
                  onClick={handleAddNote}
                  disabled={!note.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentDetailsModal