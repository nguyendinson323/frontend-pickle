import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CoachStudentProgress as CoachStudentProgressType } from '../../../store/slices/coachDashboardSlice'
import {
  FiUsers,
  FiTrendingUp,
  FiTarget,
  FiAward,
  FiChevronRight,
  FiBarChart2,
  FiUser
} from 'react-icons/fi'

interface CoachStudentProgressProps {
  studentProgress: CoachStudentProgressType[]
}

const CoachStudentProgress: React.FC<CoachStudentProgressProps> = ({ studentProgress }) => {
  const navigate = useNavigate()

  // Calculate progress highlights from real data
  const totalStudents = studentProgress.length
  const activeStudents = studentProgress.filter(s => s.last_session_date).length
  const averageImprovement = studentProgress.length > 0 
    ? (studentProgress.reduce((sum, s) => sum + s.improvement_rate, 0) / studentProgress.length).toFixed(1)
    : 0
  const topStudents = studentProgress
    .filter(s => s.improvement_rate > 0)
    .sort((a, b) => b.improvement_rate - a.improvement_rate)
    .slice(0, 3)

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-3xl shadow-2xl p-8">
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center mr-4">
          <FiBarChart2 className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Student Progress</h3>
      </div>
      {studentProgress.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mr-4">
                    <FiUsers className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-blue-900 text-lg">Total Students</p>
                    <p className="text-sm font-medium text-blue-700">{totalStudents} students</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl flex items-center justify-center mr-4">
                    <FiTrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-green-900 text-lg">Active Students</p>
                    <p className="text-sm font-medium text-green-700">{activeStudents} active</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-50 border border-purple-200 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center mr-4">
                    <FiTarget className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-purple-900 text-lg">Avg. Improvement</p>
                    <p className="text-sm font-medium text-purple-700">{averageImprovement}% rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {topStudents.length > 0 && (
            <div>
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center mr-3">
                  <FiAward className="w-4 h-4 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 text-lg">Top Performers</h4>
              </div>
              <div className="space-y-4">
                {topStudents.slice(0, 3).map((student) => (
                  <div key={student.id} className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-4 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center mr-3">
                          <FiUser className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{student.player_name}</p>
                          <p className="text-sm font-medium text-gray-600">Level {student.current_level} • {student.sessions_count} sessions</p>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 px-3 py-1 rounded-full">
                        <span className="text-sm font-bold text-green-800">+{student.improvement_rate}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => navigate('/coach/students')}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105 flex items-center justify-center"
          >
            View all students
            <FiChevronRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <FiUsers className="w-10 h-10 text-gray-400" />
          </div>
          <h4 className="text-xl font-bold text-gray-900 mb-3">No student data available</h4>
          <p className="text-gray-600 font-medium">Student progress will appear here once you start coaching</p>
        </div>
      )}
    </div>
  )
}

export default CoachStudentProgress