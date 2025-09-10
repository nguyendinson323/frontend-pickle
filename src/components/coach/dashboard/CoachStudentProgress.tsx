import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CoachStudentProgress } from '../../../store/slices/coachDashboardSlice'

interface CoachStudentProgressProps {
  studentProgress: CoachStudentProgress[]
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Student Progress</h3>
      {studentProgress.length > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-blue-800">Total Students</p>
                  <p className="text-sm text-blue-600">{totalStudents} students</p>
                </div>
                <div className="text-2xl">👥</div>
              </div>
            </div>
            
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-green-800">Active Students</p>
                  <p className="text-sm text-green-600">{activeStudents} active</p>
                </div>
                <div className="text-2xl">📈</div>
              </div>
            </div>
            
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-purple-800">Avg. Improvement</p>
                  <p className="text-sm text-purple-600">{averageImprovement}% rate</p>
                </div>
                <div className="text-2xl">🎯</div>
              </div>
            </div>
          </div>

          {topStudents.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Top Performers</h4>
              <div className="space-y-2">
                {topStudents.slice(0, 3).map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{student.player_name}</p>
                      <p className="text-xs text-gray-600">Level {student.current_level} • {student.sessions_count} sessions</p>
                    </div>
                    <span className="text-sm font-medium text-green-600">+{student.improvement_rate}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => navigate('/coach/students')}
            className="text-blue-600 hover:text-blue-500 text-sm font-medium"
          >
            View all students →
          </button>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">👥</div>
          <p className="text-gray-600">No student data available</p>
        </div>
      )}
    </div>
  )
}

export default CoachStudentProgress