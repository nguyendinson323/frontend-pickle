export type UserRole = 'admin' | 'player' | 'coach' | 'club' | 'partner' | 'state'

export interface User {
  id: number
  role: UserRole
  username: string
  email: string
  phone: string | null
  is_active: boolean
  is_verified: boolean
  is_premium: boolean
  is_searchable: boolean
  last_login: string | null
  created_at: string
  updated_at: string
}

export interface State {
  id: number
  name: string
  short_code: string | null
  created_at: string
}

export interface Player {
  id: number
  user_id: number
  full_name: string
  birth_date: string
  gender: 'Male' | 'Female' | 'Other'
  state_id: number | null
  curp: string | null
  nrtp_level: number | null
  profile_photo_url: string | null
  id_document_url: string
  nationality: string
  club_id: number | null
  ranking_position: number | null
  affiliation_expires_at: string | null
  created_at: string
  updated_at: string
  state?: State
  club?: Club
}

export interface Coach {
  id: number
  user_id: number
  full_name: string
  birth_date: string
  gender: 'Male' | 'Female' | 'Other'
  state_id: number | null
  curp: string | null
  nrtp_level: number | null
  profile_photo_url: string | null
  id_document_url: string
  hourly_rate: number | null
  affiliation_expires_at: string | null
  created_at: string
  updated_at: string
  state?: State
}

export interface Club {
  id: number
  user_id: number
  name: string
  rfc: string | null
  manager_name: string | null
  manager_title: string | null
  state_id: number | null
  club_type: string | null
  website: string | null
  social_media: string | null
  logo_url: string | null
  has_courts: boolean
  premium_expires_at: string | null
  affiliation_expires_at: string | null
  created_at: string
  updated_at: string
  state?: State
}

export interface Partner {
  id: number
  user_id: number
  business_name: string
  rfc: string | null
  contact_name: string | null
  contact_title: string | null
  partner_type: string | null
  state_id: number | null
  website: string | null
  social_media: string | null
  logo_url: string | null
  has_courts: boolean
  premium_expires_at: string | null
  created_at: string
  updated_at: string
  state?: State
}

export interface StateCommittee {
  id: number
  user_id: number
  name: string
  president_name: string | null
  president_title: string | null
  rfc: string | null
  state_id: number
  logo_url: string | null
  website: string | null
  social_media: string | null
  institutional_email: string | null
  phone: string | null
  affiliation_expires_at: string | null
  created_at: string
  updated_at: string
  state?: State
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
  dashboard: PlayerDashboard | CoachDashboard | ClubDashboard | PartnerDashboard | StateDashboard | AdminDashboard
}

export interface RegisterResponse {
  token: string
  user: User
  dashboard: PlayerDashboard | CoachDashboard | ClubDashboard | PartnerDashboard | StateDashboard | AdminDashboard
}

export interface RegisterRequest {
  userData: {
    username: string
    email: string
    password: string
    role: UserRole
    phone?: string
  }
  profileData: PlayerRegisterData | CoachRegisterData | ClubRegisterData | PartnerRegisterData | StateRegisterData
}

export interface PlayerRegisterData {
  full_name: string
  birth_date: string
  gender: 'Male' | 'Female' | 'Other'
  state_id: number
  curp?: string
  nrtp_level?: number
  profile_photo_url?: string
  id_document_url: string
  nationality?: string
}

export interface CoachRegisterData {
  full_name: string
  birth_date: string
  gender: 'Male' | 'Female' | 'Other'
  state_id: number
  curp?: string
  nrtp_level?: number
  profile_photo_url?: string
  id_document_url: string
  hourly_rate?: number
}

export interface ClubRegisterData {
  name: string
  rfc?: string
  manager_name?: string
  manager_title?: string
  state_id: number
  club_type?: string
  website?: string
  social_media?: string
  logo_url?: string
  has_courts?: boolean
}

export interface PartnerRegisterData {
  business_name: string
  rfc?: string
  contact_name?: string
  contact_title?: string
  partner_type?: string
  state_id: number
  website?: string
  social_media?: string
  logo_url?: string
  has_courts?: boolean
}

export interface StateRegisterData {
  name: string
  president_name?: string
  president_title?: string
  rfc?: string
  state_id: number
  logo_url?: string
  website?: string
  social_media?: string
  institutional_email?: string
  phone?: string
}

export interface PlayerDashboard {
  profile: Player
  upcomingTournaments: TournamentRegistration[]
  currentRanking: PlayerRanking | null
  unreadNotifications: number
  unreadMessages: number
  affiliationStatus: string | null
  tournamentWins: number
  totalMatches: number
  upcomingMatches?: Array<{
    tournamentName: string
    opponent: string
    date: string
    time: string
    status: string
  }>
  recentMatches?: Array<{
    opponent: string
    tournament: string
    date: string
    result: 'win' | 'loss' | 'draw'
    score: string
  }>
  stats: {
    tournamentsPlayed: number
    rankingPosition: number | null
    rankingPoints: number
  }
}

export interface CoachDashboard {
  profile: Coach
  upcomingSessions: CoachingSession[]
  certifications: number
  affiliationStatus: string | null
  stats: {
    totalSessions: number
    activeCertifications: number
  }
}

export interface ClubDashboard {
  profile: Club
  courts: number
  upcomingTournaments: Tournament[]
  members: number
  affiliationStatus: string | null
  premiumStatus: string | null
  stats: {
    totalMembers: number
    totalCourts: number
    activeTournaments: number
  }
}

export interface PartnerDashboard {
  profile: Partner
  courts: number
  upcomingTournaments: Tournament[]
  premiumStatus: string | null
  totalCourts: number
  monthlyBookings: number
  eventsHosted: number
  monthlyRevenue?: number
  courtUtilization?: number
  customerRating?: number
  repeatCustomers?: number
  revenueGrowth?: number
  bookingTrend?: number
  recentBookings?: Array<{
    playerName: string
    courtNumber: number
    date: string
    time: string
    amount: number
    status: string
  }>
  upcomingEvents?: Array<{
    name: string
    type: string
    date: string
    duration: string
    expectedRevenue: number
    registrations: number
  }>
  stats: {
    totalCourts: number
    activeTournaments: number
  }
}

export interface StateDashboard {
  profile: StateCommittee
  upcomingTournaments: Tournament[]
  affiliationStatus: string | null
  totalPlayers: number
  totalClubs: number
  totalCoaches: number
  tournamentsThisYear: number
  playerGrowth?: number
  newClubs?: number
  tournamentParticipation?: number
  nationalRanking?: number
  pendingApprovals?: Array<{
    type: string
    name: string
    location: string
    submittedDate: string
  }>
  recentActivity?: Array<{
    icon: string
    message: string
    time: string
  }>
  stats: {
    totalPlayers: number
    totalClubs: number
    totalCourts: number
    activeTournaments: number
  }
}

export interface AdminDashboard {
  stats: {
    totalUsers: number
    totalPlayers: number
    totalClubs: number
    totalPartners: number
    totalStates: number
    totalTournaments: number
    totalCourts: number
  }
  recentPayments: Payment[]
  systemStatus: {
    database: string
    uptime: number
  }
}

export interface Tournament {
  id: number
  name: string
  description: string | null
  tournament_type: string | null
  organizer_type: 'federation' | 'state' | 'club' | 'partner'
  organizer_id: number
  state_id: number
  venue_name: string | null
  venue_address: string | null
  start_date: string
  end_date: string
  registration_start: string
  registration_end: string
  entry_fee: number | null
  max_participants: number | null
  status: 'upcoming' | 'ongoing' | 'completed' | 'canceled'
  banner_url: string | null
  is_ranking: boolean
  ranking_multiplier: number
  created_at: string
  updated_at: string
}

export interface TournamentRegistration {
  id: number
  tournament_id: number
  category_id: number
  player_id: number
  partner_player_id: number | null
  registration_date: string
  payment_status: 'pending' | 'paid' | 'refunded'
  amount_paid: number | null
  stripe_payment_id: string | null
  status: 'registered' | 'confirmed' | 'waitlisted' | 'withdrawn'
  created_at: string
  updated_at: string
  Tournament?: Tournament
}

export interface PlayerRanking {
  id: number
  player_id: number
  period_id: number
  category_id: number
  points: number
  tournaments_played: number
  current_rank: number | null
  previous_rank: number | null
  created_at: string
  updated_at: string
}

export interface CoachingSession {
  id: number
  coach_id: number
  player_id: number
  session_date: string
  start_time: string
  end_time: string
  court_id: number | null
  status: 'scheduled' | 'completed' | 'canceled'
  price: number | null
  payment_status: 'pending' | 'paid' | 'refunded'
  stripe_payment_id: string | null
  rating: number | null
  created_at: string
  updated_at: string
}

export interface Payment {
  id: number
  user_id: number
  amount: number
  currency: string
  payment_type: string | null
  payment_method: string | null
  reference_type: string | null
  reference_id: number | null
  stripe_payment_id: string | null
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  transaction_date: string
  created_at: string
  updated_at: string
}

export interface AuthState {
  user: User | null
  profile: Player | Coach | Club | Partner | StateCommittee | null
  dashboard: PlayerDashboard | CoachDashboard | ClubDashboard | PartnerDashboard | StateDashboard | AdminDashboard | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Registration Request Interfaces for Forms
export interface PlayerRegisterRequest {
  username: string
  email: string
  password: string
  confirmPassword: string
  phoneNumber: string
  fullName: string
  birthDate: string
  gender: 'male' | 'female' | 'other'
  state: string
  curp: string
  nrtpLevel: string
  profilePhotoUrl: string
  idDocumentUrl: string
  nationality: string
  privacyPolicyAccepted: boolean
}

export interface CoachRegisterRequest {
  username: string
  email: string
  password: string
  confirmPassword: string
  phoneNumber: string
  fullName: string
  birthDate: string
  gender: 'male' | 'female' | 'other'
  state: string
  curp: string
  profilePhotoUrl: string
  idDocumentUrl: string
  privacyPolicyAccepted: boolean
}

export interface ClubRegisterRequest {
  username: string
  email: string
  password: string
  confirmPassword: string
  phoneNumber: string
  clubName: string
  managerName: string
  state: string
  clubType: 'recreational' | 'competitive' | 'training' | 'social'
  rfc: string
  logoUrl: string
  privacyPolicyAccepted: boolean
}

export interface PartnerRegisterRequest {
  username: string
  email: string
  password: string
  confirmPassword: string
  phoneNumber: string
  businessName: string
  contactPersonName: string
  partnerType: 'hotel' | 'sports_center' | 'country_club' | 'business'
  state: string
  rfc: string
  businessLogoUrl: string
  privacyPolicyAccepted: boolean
}

export interface StateRegisterRequest {
  username: string
  email: string
  password: string
  confirmPassword: string
  phoneNumber: string
  committeeName: string
  presidentName: string
  stateCoverage: string
  rfc: string
  institutionalDetails: string
  committeeLogoUrl: string
  privacyPolicyAccepted: boolean
}