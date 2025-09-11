import api from './api'
import {
  Court,
  CourtFilters,
  CreateCourtRequest,
  UpdateCourtRequest,
  CourtReservation,
  CreateReservationRequest,
  AvailableSlot,
  SearchNearbyRequest,
  CourtWithDistance,
  CourtMaintenance,
  PaginatedResponse
} from '../types'

class CourtsService {
  async getAllCourts(filters?: CourtFilters): Promise<PaginatedResponse<Court>> {
    const params = new URLSearchParams()
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString())
        }
      })
    }
    
    const response = await api.get<PaginatedResponse<Court>>(`/api/courts?${params}`)
    return response.data
  }

  async getCourt(id: number): Promise<Court> {
    const response = await api.get<Court>(`/api/courts/${id}`)
    return response.data
  }

  async createCourt(courtData: CreateCourtRequest): Promise<Court> {
    const response = await api.post<Court>('/api/courts', courtData)
    return response.data
  }

  async updateCourt(id: number, updates: UpdateCourtRequest): Promise<Court> {
    const response = await api.put<Court>(`/api/courts/${id}`, updates)
    return response.data
  }

  async getMyCourts(): Promise<Court[]> {
    const response = await api.get<Court[]>('/api/courts/my/courts')
    return response.data
  }

  async searchNearbyCourts({ latitude, longitude, radius = 10 }: SearchNearbyRequest): Promise<CourtWithDistance[]> {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      radius: radius.toString()
    })
    
    const response = await api.get<CourtWithDistance[]>(`/api/courts/search?${params}`)
    return response.data
  }

  async getAvailableSlots(courtId: number, date: string): Promise<AvailableSlot[]> {
    const response = await api.get<AvailableSlot[]>(`/api/courts/${courtId}/available-slots?date=${date}`)
    return response.data
  }

  async getCourtReservations(courtId: number, date: string): Promise<CourtReservation[]> {
    const response = await api.get<CourtReservation[]>(`/api/courts/${courtId}/reservations?date=${date}`)
    return response.data
  }

  async createReservation(reservationData: CreateReservationRequest): Promise<CourtReservation> {
    const response = await api.post<CourtReservation>('/api/courts/reservations', reservationData)
    return response.data
  }

  async getMyReservations(upcoming: boolean = true): Promise<CourtReservation[]> {
    const response = await api.get<CourtReservation[]>(`/api/courts/reservations/my?upcoming=${upcoming}`)
    return response.data
  }

  async cancelReservation(reservationId: number): Promise<CourtReservation> {
    const response = await api.delete<CourtReservation>(`/api/courts/reservations/${reservationId}`)
    return response.data
  }

  async getMaintenanceSchedule(courtId: number): Promise<CourtMaintenance[]> {
    const response = await api.get<CourtMaintenance[]>(`/api/courts/${courtId}/maintenance`)
    return response.data
  }

  async scheduleMaintenance(maintenanceData: {
    court_id: number
    maintenance_type?: string
    description?: string
    start_date: string
    end_date: string
  }): Promise<CourtMaintenance> {
    const response = await api.post<CourtMaintenance>('/api/courts/maintenance', maintenanceData)
    return response.data
  }

  async updateMaintenance(maintenanceId: number, updates: {
    maintenance_type?: string
    description?: string
    start_date?: string
    end_date?: string
    status?: 'scheduled' | 'in_progress' | 'completed'
  }): Promise<CourtMaintenance> {
    const response = await api.put<CourtMaintenance>(`/api/courts/maintenance/${maintenanceId}`, updates)
    return response.data
  }

  async updateCourtSchedule(courtId: number, schedules: {
    day_of_week: number
    open_time: string
    close_time: string
    is_closed: boolean
  }[]): Promise<void> {
    await api.put(`/api/courts/${courtId}/schedule`, { schedules })
  }
}

export const courtsService = new CourtsService()