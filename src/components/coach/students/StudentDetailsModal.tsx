import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import { getStudentDetails, addStudentNote } from '../../../store/slices/coachStudentsSlice'
import {
  FiX,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiStar,
  FiDollarSign,
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiSliders,
  FiEdit3,
  FiInfo
} from 'react-icons/fi'

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
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-t-3xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-3xl flex items-center justify-center overflow-hidden shadow-lg">
                {student.profile_photo_url ? (
                  <img
                    src={student.profile_photo_url}
                    alt={student.full_name}
                    className="w-full h-full object-cover rounded-3xl"
                  />
                ) : (
                  <FiUser className="text-3xl text-white" />
                )}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">{student.full_name}</h2>
                <p className="text-blue-200 font-medium text-lg">Complete student information and progress</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-12 h-12 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-2xl flex items-center justify-center text-white transition-all duration-200 hover:transform hover:scale-105"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600 mx-auto mb-4"></div>
            <div className="text-gray-500 font-medium text-lg">Loading student details...</div>
          </div>
        ) : (
          <div className="p-8 space-y-8">
            {/* Contact Information */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center mr-3">
                  <FiInfo className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Contact Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200">
                  <div className="flex items-center mb-2">
                    <FiMail className="w-5 h-5 text-blue-600 mr-2" />
                    <label className="block text-sm font-bold text-gray-700">Email</label>
                  </div>
                  <div className="text-lg font-medium text-gray-900">{student.email}</div>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200">
                  <div className="flex items-center mb-2">
                    <FiPhone className="w-5 h-5 text-green-600 mr-2" />
                    <label className="block text-sm font-bold text-gray-700">Phone</label>
                  </div>
                  <div className="text-lg font-medium text-gray-900">{student.phone}</div>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200">
                  <div className="flex items-center mb-2">
                    <FiMapPin className="w-5 h-5 text-orange-600 mr-2" />
                    <label className="block text-sm font-bold text-gray-700">Location</label>
                  </div>
                  <div className="text-lg font-medium text-gray-900">{student.state_name}</div>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200">
                  <div className="flex items-center mb-2">
                    <FiCalendar className="w-5 h-5 text-purple-600 mr-2" />
                    <label className="block text-sm font-bold text-gray-700">Member Since</label>
                  </div>
                  <div className="text-lg font-medium text-gray-900">{formatDate(student.created_at)}</div>
                </div>
              </div>
            </div>

            {/* Level Management */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mr-3">
                  <FiSliders className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">NRTP Level Management</h3>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200">
                  <div className="text-sm font-bold text-blue-700 mb-1">Current Level</div>
                  <span className="text-4xl font-bold text-blue-600">{student.nrtp_level}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={student.nrtp_level}
                    onChange={(e) => onUpdateLevel(student.id, parseFloat(e.target.value))}
                    className="px-4 py-3 border-2 border-blue-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-bold text-gray-900 bg-white"
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
                  <span className="text-lg font-bold text-blue-700">Update Level</span>
                </div>
              </div>
            </div>

            {/* Session Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FiUsers className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{student.sessions.total_sessions}</div>
                <div className="text-sm font-bold text-green-700">Total Sessions</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FiCheckCircle className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{student.sessions.completed_sessions}</div>
                <div className="text-sm font-bold text-blue-700">Completed</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-50 border border-purple-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FiClock className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{student.sessions.upcoming_sessions}</div>
                <div className="text-sm font-bold text-purple-700">Upcoming</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-amber-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FiStar className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{student.sessions.average_rating.toFixed(1)}</div>
                <div className="text-sm font-bold text-yellow-700">Avg Rating</div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl flex items-center justify-center mr-3">
                  <FiDollarSign className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Financial Summary</h3>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 text-center">
                <div className="text-5xl font-bold text-green-600 mb-2">${student.sessions.total_spent.toFixed(2)}</div>
                <div className="text-lg font-bold text-green-700">Total Revenue Generated</div>
              </div>
            </div>

            {/* Recent Sessions */}
            {selectedStudent && (selectedStudent as any).recent_sessions && (selectedStudent as any).recent_sessions.length > 0 && (
              <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-xl rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b-2 border-gray-200">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl flex items-center justify-center mr-3">
                      <FiClock className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Recent Sessions</h3>
                  </div>
                </div>
                <div className="divide-y-2 divide-gray-200">
                  {(selectedStudent as any).recent_sessions.map((session: any, index: number) => (
                    <div key={index} className="p-6 hover:bg-gray-50 transition-all duration-200">
                      <div className="flex flex-col sm:flex-row justify-between items-start space-y-3 sm:space-y-0">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <FiCalendar className="w-4 h-4 text-blue-600 mr-2" />
                            <div className="font-bold text-gray-900 text-lg">
                              {formatDateTime(session.session_date)}
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="inline-flex items-center px-3 py-1 text-sm font-bold rounded-2xl border shadow-md bg-gradient-to-r from-blue-100 to-indigo-100 border-blue-200 text-blue-800">
                              <FiCheckCircle className="w-3 h-3 mr-1" />
                              {session.status}
                            </span>
                            {session.rating && (
                              <div className="flex items-center text-yellow-600 font-medium">
                                <FiStar className="w-4 h-4 mr-1" />
                                {session.rating}/5
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center justify-end mb-2">
                            <FiDollarSign className="w-5 h-5 text-green-600 mr-1" />
                            <div className="font-bold text-green-600 text-xl">
                              ${parseFloat(session.price || 0).toFixed(2)}
                            </div>
                          </div>
                          <span className="inline-flex px-3 py-1 text-sm font-bold rounded-2xl border shadow-md bg-gradient-to-r from-green-100 to-emerald-100 border-green-200 text-green-800">
                            {session.payment_status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add Note */}
            <div className="bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-slate-700 rounded-2xl flex items-center justify-center mr-3">
                  <FiEdit3 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Add Note</h3>
              </div>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note about this student..."
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-medium text-gray-900 bg-white placeholder-gray-500"
                  rows={3}
                />
                <button
                  onClick={handleAddNote}
                  disabled={!note.trim()}
                  className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105 disabled:transform-none disabled:shadow-none flex items-center justify-center"
                >
                  <FiCheckCircle className="w-5 h-5 mr-2" />
                  Add Note
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