// Common data types based on exact database models

export interface State {
  id: number
  name: string
  short_code: string | null
  created_at: string
}

export interface User {
  id: number
  role: 'admin' | 'player' | 'coach' | 'club' | 'partner' | 'state'
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

export interface Player {
  id: number
  user_id: number
  full_name: string
  birth_date: string
  gender: string | null
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
  user: User
  state: State | null
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
  user: User
  state: State | null
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
  user: User
  state: State | null
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
  user: User
  state: State
}

export interface TournamentCategory {
  id: number
  tournament_id: number
  name: string
  description: string | null
  max_participants: number | null
  entry_fee: number
  age_min: number | null
  age_max: number | null
  skill_level_min: number | null
  skill_level_max: number | null
  created_at: string
  updated_at: string
}

export interface TournamentRegistration {
  id: number
  tournament_id: number
  player_id: number
  category_id: number
  registration_date: string
  status: 'pending' | 'confirmed' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'refunded'
  amount: number
  stripe_payment_id: string | null
  created_at: string
  updated_at: string
  player: Player
  category: TournamentCategory
}

export interface Tournament {
  id: number
  name: string
  description: string | null
  tournament_type: string | null
  organizer_type: 'federation' | 'state' | 'club' | 'partner'
  organizer_id: number
  state_id: number | null
  venue_name: string | null
  venue_address: string | null
  start_date: string
  end_date: string
  registration_start: string
  registration_end: string
  entry_fee: number
  max_participants: number | null
  status: 'draft' | 'upcoming' | 'active' | 'completed' | 'cancelled'
  banner_url: string | null
  is_ranking: boolean
  ranking_multiplier: number | null
  created_at: string
  updated_at: string
  state: State | null
  organizer: Club | Partner | StateCommittee | null
  categories: TournamentCategory[]
  registrations: TournamentRegistration[]
  registrationsCount: number
}

export interface CourtSchedule {
  id: number
  court_id: number
  day_of_week: number
  start_time: string
  end_time: string
  is_available: boolean
  hourly_rate: number | null
  created_at: string
  updated_at: string
}

export interface CourtReservation {
  id: number
  court_id: number
  player_id: number
  date: string
  start_time: string
  end_time: string
  status: 'pending' | 'confirmed' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'refunded'
  amount: number
  stripe_payment_id: string | null
  created_at: string
  updated_at: string
  player: Player
}

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
  state: State
  owner: Club | Partner
  schedules: CourtSchedule[]
  reservations: CourtReservation[]
}

export interface RankingPeriod {
  id: number
  name: string
  start_date: string
  end_date: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface RankingCategory {
  id: number
  name: string
  description: string | null
  age_min: number | null
  age_max: number | null
  gender: string | null
  skill_level_min: number | null
  skill_level_max: number | null
  created_at: string
  updated_at: string
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
  player: Player
  period: RankingPeriod
  category: RankingCategory
}

export interface StateStatistics {
  id: number
  name: string
  short_code: string | null
  created_at: string
  playersCount: number
  coachesCount: number
  clubsCount: number
  partnersCount: number
  tournamentsCount: number
  courtsCount: number
  stateCommittee: StateCommittee | null
}

export interface RuleSection {
  id: number
  title: string
  content: string
  section_order: number
  parent_id: number | null
  created_at: string
  updated_at: string
}

export interface AppData {
  tournaments: Tournament[]
  courts: Court[]
  playerRankings: PlayerRanking[]
  rankingPeriods: RankingPeriod[]
  rankingCategories: RankingCategory[]
  states: State[]
  statesStatistics: StateStatistics[]
  players: Player[]
  clubs: Club[]
  partners: Partner[]
  stateCommittees: StateCommittee[]
  rules: RuleSection[]
}

export interface AppDataState {
  data: AppData | null
  loading: boolean
  error: string | null
  lastUpdated: string | null
}

// Common page specific types
export interface FederationStatistics {
  total_players: number
  total_coaches: number
  total_clubs: number
  total_partners: number
  total_state_committees: number
  total_courts: number
  active_tournaments: number
  total_tournaments: number
  total_matches_played: number
  registered_this_month: number
  total_states: number
}

export interface FederationInfo {
  name: string
  description: string
  contact_email: string
  contact_phone: string
  address: string
  website: string
  social_media: {
    facebook?: string
    twitter?: string
    instagram?: string
    youtube?: string
  }
  president_name: string
  president_title: string
  mission: string
  vision: string
  founded_year: number
}

export interface PrivacyPolicy {
  id: number
  content: string
  version: string
  is_active: boolean
  created_at: string
}

export interface FeaturedContent {
  id: number
  title: string
  description: string
  image_url: string
  link_url: string
  type: string
  is_active: boolean
  display_order: number
  created_at: string
}

export interface NewsArticle {
  id: number
  title: string
  content: string
  author: string
  image_url: string
  published_at: string
  is_featured: boolean
  category: string
}

export interface CommonPageData {
  states: State[]
  federation_statistics: FederationStatistics
  recent_tournaments: Tournament[]
  upcoming_tournaments: Tournament[]
  federation_info: FederationInfo
  privacy_policy: PrivacyPolicy
  featured_content: FeaturedContent[]
  news_articles: NewsArticle[]
}

export interface CommonState {
  data: CommonPageData | null
  isLoading: boolean
  lastFetched: string | null
}