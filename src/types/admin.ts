// Admin Dashboard Types

// User Management Types
export interface UserListItem {
  id: number
  username: string
  email: string
  phone: string
  role: 'player' | 'coach' | 'club' | 'partner' | 'state' | 'admin'
  status: 'active' | 'inactive' | 'suspended'
  is_active: boolean
  is_verified?: boolean
  is_premium?: boolean
  created_at: string
  last_login: string
  affiliation_status: 'active' | 'expired' | 'pending'
  affiliation_expires_at: string | null
}

export interface PlayerDetail extends UserListItem {
  profile: {
    full_name: string
    birth_date: string
    gender: string
    state_id: number
    state_name: string
    club_id: number | null
    club_name: string | null
    nrtp_level: string
    ranking_points: number
    ranking_position: number
    tournaments_played: number
    profile_photo_url: string | null
    id_document_url: string | null
    nationality: string
  }
}

export interface CoachDetail extends UserListItem {
  profile: {
    full_name: string
    birth_date: string
    specializations: string[]
    hourly_rate: number
    total_students: number
    sessions_conducted: number
    referee_matches: number
    certifications: string[]
  }
}

export interface ClubDetail extends UserListItem {
  profile: {
    name: string
    manager_name: string
    state_id: number
    state_name: string
    total_members: number
    total_courts: number
    total_tournaments: number
    monthly_revenue: number
    website: string | null
    logo_url: string | null
  }
}

export interface PartnerDetail extends UserListItem {
  profile: {
    business_name: string
    contact_name: string
    partner_type: string
    total_courts: number
    total_events: number
    monthly_revenue: number
    website: string | null
    logo_url: string | null
  }
}

export interface StateDetail extends UserListItem {
  profile: {
    name: string
    representative_name: string
    total_players: number
    total_clubs: number
    total_partners: number
    total_tournaments: number
    state_ranking: number
  }
}

// Statistics Types
export interface AdminStatistics {
  totalUsers: {
    players: number
    coaches: number
    clubs: number
    partners: number
    states: number
    total: number
  }
  activeUsers: {
    daily: number
    weekly: number
    monthly: number
  }
  affiliations: {
    active: number
    expired: number
    pending: number
    revenue: number
  }
  tournaments: {
    total: number
    active: number
    upcoming: number
    completed: number
    totalParticipants: number
  }
  courts: {
    total: number
    available: number
    occupied: number
    maintenance: number
  }
  financials: {
    totalRevenue: number
    monthlyRevenue: number
    pendingPayments: number
    affiliationRevenue: number
    tournamentRevenue: number
    courtRevenue: number
    premiumSubscriptions: number
  }
  rankings: {
    totalRankedPlayers: number
    recentChanges: number
  }
}

// Messaging Types
export interface MessageTemplate {
  id: number
  name: string
  subject: string
  body: string
  created_at: string
}

export interface BroadcastMessage {
  recipients: string[] // user types: 'players', 'coaches', 'clubs', 'partners', 'states', 'all'
  subject: string
  body: string
  attachments?: string[]
  sendEmail: boolean
  sendSMS: boolean
  sendInApp: boolean
}

// Court Management Types
export interface CourtInfo {
  id: number
  name: string
  club_id: number | null
  club_name: string | null
  partner_id: number | null
  partner_name: string | null
  surface_type: string
  lighting: boolean
  indoor: boolean
  status: 'available' | 'occupied' | 'maintenance'
  hourly_rate: number
  location: {
    address: string
    city: string
    state: string
    latitude: number
    longitude: number
  }
  total_reservations: number
  revenue_generated: number
}

// Payment & Membership Types
export interface MembershipInfo {
  id: number
  user_id: number
  user_name: string
  user_type: string
  status: 'active' | 'expired' | 'pending'
  start_date: string
  end_date: string
  amount_paid: number
  payment_method: string
  auto_renew: boolean
}

export interface PaymentHistory {
  id: number
  user_id: number
  user_name: string
  amount: number
  type: 'affiliation' | 'tournament' | 'court' | 'premium'
  status: 'completed' | 'pending' | 'failed' | 'refunded'
  payment_date: string
  payment_method: string
  reference_id: string
}

// Microsite Management Types
export interface MicrositeAdmin {
  id: number
  owner_id: number
  owner_name: string
  owner_type: 'club' | 'partner' | 'state'
  status: 'active' | 'inactive' | 'suspended' | 'pending' | 'approved' | 'rejected'
  url: string
  domain_name: string
  title: string
  description: string
  last_updated: string
  created_at: string
  page_views: number
  monthly_visitors: number
  content_score: number
  has_inappropriate_content: boolean
  content_warnings: string[]
  approval_status: 'pending' | 'approved' | 'rejected'
  rejection_reason: string | null
  visibility_status: 'public' | 'private' | 'restricted'
  seo_score: number
  performance_score: number
  last_audit_date: string | null
  contact_email: string
  contact_phone: string
}

// Tournament Management Types
export interface TournamentAdmin {
  id: number
  name: string
  organizer_id: number
  organizer_name: string
  organizer_type: string
  start_date: string
  end_date: string
  location: string
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled'
  total_participants: number
  entry_fee: number
  total_revenue: number
  prize_pool: number
}

// Ranking Management Types
export interface RankingChange {
  id: number
  player_id: number
  player_name: string
  old_position: number
  new_position: number
  old_points: number
  new_points: number
  change_date: string
  reason: string
  tournament_id: number | null
  tournament_name: string | null
}

// Support & Security Types
export interface AdminLog {
  id: number
  admin_id: number
  admin_name: string
  action: string
  target_type: string
  target_id: number
  details: string
  ip_address: string
  timestamp: string
}

export interface SuspendedAccount {
  id: number
  user_id: number
  user_name: string
  reason: string
  suspended_by: number
  suspended_by_name: string
  suspended_at: string
  suspension_ends: string | null
}

// Report Types
export interface ReportFilters {
  dateFrom: string
  dateTo: string
  userType?: string[]
  state?: number[]
  status?: string[]
  includeInactive?: boolean
}

export interface ExportRequest {
  type: 'users' | 'payments' | 'tournaments' | 'courts' | 'rankings'
  format: 'csv' | 'pdf' | 'excel'
  filters: ReportFilters
}