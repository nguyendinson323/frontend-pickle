import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  CourtsState,
  Court,
  CourtReservation,
  CourtMaintenance,
  AvailableSlot,
  PaginatedResponse
} from '../../types'
import {
  fetchCourts,
  fetchCourt,
  createCourt,
  updateCourt as updateCourtThunk,
  fetchMyCourts,
  searchNearbyCourts,
  fetchAvailableSlots,
  fetchCourtReservations,
  createReservation,
  fetchMyReservations,
  cancelReservation,
  fetchMaintenanceSchedule,
  scheduleMaintenance,
  updateMaintenance,
  updateCourtSchedule
} from '../thunks/courtsThunks'

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
  },
  extraReducers: (builder) => {
    // Fetch courts
    builder
      .addCase(fetchCourts.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchCourts.fulfilled, (state, action) => {
        state.isLoading = false
        state.courts = action.payload.rows
        state.totalCount = action.payload.count
      })
      .addCase(fetchCourts.rejected, (state) => {
        state.isLoading = false
      })

    // Fetch single court
    builder
      .addCase(fetchCourt.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchCourt.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentCourt = action.payload
      })
      .addCase(fetchCourt.rejected, (state) => {
        state.isLoading = false
      })

    // Create court
    builder
      .addCase(createCourt.fulfilled, (state, action) => {
        state.courts.unshift(action.payload)
        state.myCourts.unshift(action.payload)
        state.totalCount += 1
      })

    // Update court
    builder
      .addCase(updateCourtThunk.fulfilled, (state, action) => {
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
      })

    // Fetch my courts
    builder
      .addCase(fetchMyCourts.fulfilled, (state, action) => {
        state.myCourts = action.payload
      })

    // Search nearby courts
    builder
      .addCase(searchNearbyCourts.pending, (state) => {
        state.isLoading = true
      })
      .addCase(searchNearbyCourts.fulfilled, (state, action) => {
        state.isLoading = false
        state.courts = action.payload
        state.totalCount = action.payload.length
      })
      .addCase(searchNearbyCourts.rejected, (state) => {
        state.isLoading = false
      })

    // Fetch available slots
    builder
      .addCase(fetchAvailableSlots.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchAvailableSlots.fulfilled, (state, action) => {
        state.isLoading = false
        state.availableSlots = action.payload
      })
      .addCase(fetchAvailableSlots.rejected, (state) => {
        state.isLoading = false
        state.availableSlots = []
      })

    // Fetch court reservations
    builder
      .addCase(fetchCourtReservations.fulfilled, (state, action) => {
        state.reservations = action.payload
      })

    // Create reservation
    builder
      .addCase(createReservation.fulfilled, (state, action) => {
        state.reservations.push(action.payload)
      })

    // Fetch my reservations
    builder
      .addCase(fetchMyReservations.fulfilled, (state, action) => {
        state.reservations = action.payload
      })

    // Cancel reservation
    builder
      .addCase(cancelReservation.fulfilled, (state, action) => {
        const index = state.reservations.findIndex(r => r.id === action.payload.id)
        if (index !== -1) {
          state.reservations[index] = action.payload
        }
      })

    // Fetch maintenance schedule
    builder
      .addCase(fetchMaintenanceSchedule.fulfilled, (state, action) => {
        state.maintenance = action.payload
      })

    // Schedule maintenance
    builder
      .addCase(scheduleMaintenance.fulfilled, (state, action) => {
        state.maintenance.push(action.payload)
      })

    // Update maintenance
    builder
      .addCase(updateMaintenance.fulfilled, (state, action) => {
        const index = state.maintenance.findIndex(m => m.id === action.payload.id)
        if (index !== -1) {
          state.maintenance[index] = action.payload
        }
      })
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