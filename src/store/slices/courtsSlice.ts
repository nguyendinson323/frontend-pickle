import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  CourtsState,
  Court,
  CourtReservation,
  CourtMaintenance,
  AvailableSlot,
  PaginatedResponse
} from '../../types'

const initialState: CourtsState = {
  courts: [],
  myCourts: [],
  currentCourt: null,
  reservations: [],
  maintenance: [],
  availableSlots: [],
  isLoading: false,
  totalCount: 0
}

const courtsSlice = createSlice({
  name: 'courts',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setCourts: (state, action: PayloadAction<PaginatedResponse<Court>>) => {
      state.courts = action.payload.rows
      state.totalCount = action.payload.count
    },
    setMyCourts: (state, action: PayloadAction<Court[]>) => {
      state.myCourts = action.payload
    },
    addCourt: (state, action: PayloadAction<Court>) => {
      state.courts.unshift(action.payload)
      state.myCourts.unshift(action.payload)
      state.totalCount += 1
    },
    updateCourt: (state, action: PayloadAction<Court>) => {
      const index = state.courts.findIndex(c => c.id === action.payload.id)
      if (index !== -1) {
        state.courts[index] = action.payload
      }
      
      const myIndex = state.myCourts.findIndex(c => c.id === action.payload.id)
      if (myIndex !== -1) {
        state.myCourts[myIndex] = action.payload
      }
      
      if (state.currentCourt && state.currentCourt.id === action.payload.id) {
        state.currentCourt = action.payload
      }
    },
    setCurrentCourt: (state, action: PayloadAction<Court>) => {
      state.currentCourt = action.payload
    },
    clearCurrentCourt: (state) => {
      state.currentCourt = null
      state.reservations = []
      state.maintenance = []
      state.availableSlots = []
    },
    setCourtReservations: (state, action: PayloadAction<CourtReservation[]>) => {
      state.reservations = action.payload
    },
    addCourtReservation: (state, action: PayloadAction<CourtReservation>) => {
      state.reservations.push(action.payload)
    },
    updateCourtReservation: (state, action: PayloadAction<CourtReservation>) => {
      const index = state.reservations.findIndex(r => r.id === action.payload.id)
      if (index !== -1) {
        state.reservations[index] = action.payload
      }
    },
    removeCourtReservation: (state, action: PayloadAction<number>) => {
      state.reservations = state.reservations.filter(r => r.id !== action.payload)
    },
    setCourtMaintenance: (state, action: PayloadAction<CourtMaintenance[]>) => {
      state.maintenance = action.payload
    },
    addCourtMaintenance: (state, action: PayloadAction<CourtMaintenance>) => {
      state.maintenance.push(action.payload)
    },
    updateCourtMaintenance: (state, action: PayloadAction<CourtMaintenance>) => {
      const index = state.maintenance.findIndex(m => m.id === action.payload.id)
      if (index !== -1) {
        state.maintenance[index] = action.payload
      }
    },
    setAvailableSlots: (state, action: PayloadAction<AvailableSlot[]>) => {
      state.availableSlots = action.payload
    },
    clearCourts: (state) => {
      state.courts = []
      state.totalCount = 0
    },
    clearMyCourts: (state) => {
      state.myCourts = []
    }
  }
})

export const {
  setLoading,
  setCourts,
  setMyCourts,
  addCourt,
  updateCourt,
  setCurrentCourt,
  clearCurrentCourt,
  setCourtReservations,
  addCourtReservation,
  updateCourtReservation,
  removeCourtReservation,
  setCourtMaintenance,
  addCourtMaintenance,
  updateCourtMaintenance,
  setAvailableSlots,
  clearCourts,
  clearMyCourts
} = courtsSlice.actions

export default courtsSlice.reducer