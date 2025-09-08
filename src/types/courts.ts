export interface Court {
  id: number
  name: string
  owner_type: 'club' | 'partner'
  owner_id: number
  address: string | null
  state_id: number
  court_count: number
  surface_type: string | null
  indoor: boolean
  lights: boolean
  amenities: string | null
  description: string | null
  latitude: number | null
  longitude: number | null
  status: 'active' | 'maintenance' | 'inactive'
  created_at: string
  updated_at: string
  state?: {
    id: number
    name: string
    short_code: string | null
  }
  schedules?: CourtSchedule[]
}

export interface CourtSchedule {
  id: number
  court_id: number
  day_of_week: number
  open_time: string
  close_time: string
  is_closed: boolean
  created_at: string
}

export interface CourtReservation {
  id: number
  court_id: number
  player_id: number
  date: string
  start_time: string
  end_time: string
  status: 'pending' | 'confirmed' | 'canceled'
  payment_status: 'pending' | 'paid' | 'refunded'
  amount: number
  stripe_payment_id: string | null
  created_at: string
  updated_at: string
  court?: Court
  player?: {
    id: number
    full_name: string
  }
}

export interface CourtMaintenance {
  id: number
  court_id: number
  maintenance_type: string | null
  description: string | null
  start_date: string
  end_date: string
  status: 'scheduled' | 'in_progress' | 'completed'
  created_by: number
  created_at: string
  updated_at: string
}

export interface AvailableSlot {
  start_time: string
  end_time: string
  available: boolean
}

export interface CreateCourtRequest {
  name: string
  address?: string
  state_id: number
  court_count?: number
  surface_type?: string
  indoor?: boolean
  lights?: boolean
  amenities?: string
  description?: string
  latitude?: number
  longitude?: number
}

export interface UpdateCourtRequest {
  name?: string
  address?: string
  state_id?: number
  court_count?: number
  surface_type?: string
  indoor?: boolean
  lights?: boolean
  amenities?: string
  description?: string
  latitude?: number
  longitude?: number
  status?: 'active' | 'maintenance' | 'inactive'
}

export interface CreateReservationRequest {
  court_id: number
  date: string
  start_time: string
  end_time: string
  amount: number
}

export interface ScheduleMaintenanceRequest {
  court_id: number
  maintenance_type?: string
  description?: string
  start_date: string
  end_date: string
}

export interface UpdateMaintenanceRequest {
  maintenance_type?: string
  description?: string
  start_date?: string
  end_date?: string
  status?: 'scheduled' | 'in_progress' | 'completed'
}

export interface CourtFilters {
  state_id?: number
  owner_type?: 'club' | 'partner'
  surface_type?: string
  indoor?: boolean
  lights?: boolean
  status?: 'active' | 'maintenance' | 'inactive'
  limit?: number
  offset?: number
}

export interface SearchNearbyRequest {
  latitude: number
  longitude: number
  radius?: number
}

export interface CourtWithDistance extends Court {
  distance: number
}

export interface CourtsState {
  courts: Court[]
  myCourts: Court[]
  currentCourt: Court | null
  reservations: CourtReservation[]
  maintenance: CourtMaintenance[]
  availableSlots: AvailableSlot[]
  isLoading: boolean
  totalCount: number
}