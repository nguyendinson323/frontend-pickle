import { createAsyncThunk } from '@reduxjs/toolkit'
import { courtsService } from '../../services/courtsService'
import {
  CourtFilters,
  CreateCourtRequest,
  UpdateCourtRequest,
  CreateReservationRequest,
  SearchNearbyRequest
} from '../../types'

export const fetchCourts = createAsyncThunk(
  'courts/fetchCourts',
  async (filters?: CourtFilters) => {
    const response = await courtsService.getAllCourts(filters)
    return response
  }
)

export const fetchCourt = createAsyncThunk(
  'courts/fetchCourt',
  async (id: number) => {
    const response = await courtsService.getCourt(id)
    return response
  }
)

export const createCourt = createAsyncThunk(
  'courts/createCourt',
  async (courtData: CreateCourtRequest) => {
    const response = await courtsService.createCourt(courtData)
    return response
  }
)

export const updateCourt = createAsyncThunk(
  'courts/updateCourt',
  async ({ id, updates }: { id: number; updates: UpdateCourtRequest }) => {
    const response = await courtsService.updateCourt(id, updates)
    return response
  }
)

export const fetchMyCourts = createAsyncThunk(
  'courts/fetchMyCourts',
  async () => {
    const response = await courtsService.getMyCourts()
    return response
  }
)

export const searchNearbyCourts = createAsyncThunk(
  'courts/searchNearbyCourts',
  async (searchData: SearchNearbyRequest) => {
    const response = await courtsService.searchNearbyCourts(searchData)
    return response
  }
)

export const fetchAvailableSlots = createAsyncThunk(
  'courts/fetchAvailableSlots',
  async ({ courtId, date }: { courtId: number; date: string }) => {
    const response = await courtsService.getAvailableSlots(courtId, date)
    return response
  }
)

export const fetchCourtReservations = createAsyncThunk(
  'courts/fetchCourtReservations',
  async ({ courtId, date }: { courtId: number; date: string }) => {
    const response = await courtsService.getCourtReservations(courtId, date)
    return response
  }
)

export const createReservation = createAsyncThunk(
  'courts/createReservation',
  async (reservationData: CreateReservationRequest) => {
    const response = await courtsService.createReservation(reservationData)
    return response
  }
)

export const fetchMyReservations = createAsyncThunk(
  'courts/fetchMyReservations',
  async (upcoming: boolean = true) => {
    const response = await courtsService.getMyReservations(upcoming)
    return response
  }
)

export const cancelReservation = createAsyncThunk(
  'courts/cancelReservation',
  async (reservationId: number) => {
    const response = await courtsService.cancelReservation(reservationId)
    return response
  }
)

export const fetchMaintenanceSchedule = createAsyncThunk(
  'courts/fetchMaintenanceSchedule',
  async (courtId: number) => {
    const response = await courtsService.getMaintenanceSchedule(courtId)
    return response
  }
)

export const scheduleMaintenance = createAsyncThunk(
  'courts/scheduleMaintenance',
  async (maintenanceData: {
    court_id: number
    maintenance_type?: string
    description?: string
    start_date: string
    end_date: string
  }) => {
    const response = await courtsService.scheduleMaintenance(maintenanceData)
    return response
  }
)

export const updateMaintenance = createAsyncThunk(
  'courts/updateMaintenance',
  async ({ 
    maintenanceId, 
    updates 
  }: { 
    maintenanceId: number; 
    updates: {
      maintenance_type?: string
      description?: string
      start_date?: string
      end_date?: string
      status?: 'scheduled' | 'in_progress' | 'completed'
    }
  }) => {
    const response = await courtsService.updateMaintenance(maintenanceId, updates)
    return response
  }
)

export const updateCourtSchedule = createAsyncThunk(
  'courts/updateCourtSchedule',
  async ({ 
    courtId, 
    schedules 
  }: { 
    courtId: number; 
    schedules: {
      day_of_week: number
      open_time: string
      close_time: string
      is_closed: boolean
    }[]
  }) => {
    await courtsService.updateCourtSchedule(courtId, schedules)
    return { courtId, schedules }
  }
)