import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { AppDispatch } from '../index'
import { startLoading, stopLoading } from './loadingSlice'

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

interface StudentsStats {
  total_students: number
  active_students: number
  inactive_students: number
  average_sessions_per_student: number
  total_revenue: number
  average_rating: number
}

interface CoachStudentsState {
  students: Student[]
  stats: StudentsStats | null
  selectedStudent: Student | null
  filters: {
    search: string
    level_min: string
    level_max: string
    state: string
    activity: string
  }
}

const initialState: CoachStudentsState = {
  students: [],
  stats: null,
  selectedStudent: null,
  filters: {
    search: '',
    level_min: '',
    level_max: '',
    state: '',
    activity: 'all'
  }
}

const coachStudentsSlice = createSlice({
  name: 'coachStudents',
  initialState,
  reducers: {
    setCoachStudents: (state, action: PayloadAction<Student[]>) => {
      state.students = action.payload
    },
    setStudentsStats: (state, action: PayloadAction<StudentsStats>) => {
      state.stats = action.payload
    },
    setSelectedStudent: (state, action: PayloadAction<Student | null>) => {
      state.selectedStudent = action.payload
    },
    setFilters: (state, action: PayloadAction<Partial<CoachStudentsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    updateStudentProgress: (state, action: PayloadAction<{ studentId: number; progress: Student['progress'] }>) => {
      const student = state.students.find(s => s.id === action.payload.studentId)
      if (student) {
        student.progress = action.payload.progress
      }
    },
    clearCoachStudentsData: (state) => {
      state.students = []
      state.stats = null
      state.selectedStudent = null
    }
  }
})

export const {
  setCoachStudents,
  setStudentsStats,
  setSelectedStudent,
  setFilters,
  updateStudentProgress,
  clearCoachStudentsData
} = coachStudentsSlice.actions

// API Functions
export const fetchCoachStudentsData = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(startLoading())
    const response = await axios.get('/api/coach/students')
    dispatch(setCoachStudents(response.data.students))
    dispatch(setStudentsStats(response.data.stats))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(stopLoading())
    console.error('Error fetching coach students data:', error)
  }
}

export const getStudentDetails = (studentId: number) => async (dispatch: AppDispatch) => {
  try {
    dispatch(startLoading())
    const response = await axios.get(`/api/coach/students/${studentId}`)
    dispatch(setSelectedStudent(response.data))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(stopLoading())
    console.error('Error fetching student details:', error)
  }
}

export const updateStudentLevel = (studentId: number, newLevel: number) => async (dispatch: AppDispatch) => {
  try {
    dispatch(startLoading())
    const response = await axios.put(`/api/coach/students/${studentId}/level`, { 
      nrtp_level: newLevel 
    })
    
    // Update the student in the list
    const studentsResponse = await axios.get('/api/coach/students')
    dispatch(setCoachStudents(studentsResponse.data.students))
    dispatch(setStudentsStats(studentsResponse.data.stats))
    
    dispatch(stopLoading())
  } catch (error) {
    dispatch(stopLoading())
    console.error('Error updating student level:', error)
  }
}

export const addStudentNote = (studentId: number, note: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(startLoading())
    await axios.post(`/api/coach/students/${studentId}/notes`, { note })
    
    // Refresh student details
    const response = await axios.get(`/api/coach/students/${studentId}`)
    dispatch(setSelectedStudent(response.data))
    
    dispatch(stopLoading())
  } catch (error) {
    dispatch(stopLoading())
    console.error('Error adding student note:', error)
  }
}

export default coachStudentsSlice.reducer