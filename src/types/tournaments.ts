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
  state?: {
    id: number
    name: string
    short_code: string | null
  }
  categories?: TournamentCategory[]
  totalRegistrations?: number
}

export interface TournamentCategory {
  id: number
  tournament_id: number
  name: string
  min_age: number | null
  max_age: number | null
  gender: 'Male' | 'Female' | 'Mixed' | null
  min_skill_level: number | null
  max_skill_level: number | null
  format: string | null
  max_participants: number | null
  created_at: string
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
  player?: {
    id: number
    full_name: string
    nrtp_level: number | null
  }
  partner?: {
    id: number
    full_name: string
    nrtp_level: number | null
  }
  category?: TournamentCategory
  Tournament?: Tournament
}

export interface TournamentMatch {
  id: number
  tournament_id: number
  category_id: number
  round: number
  match_number: number
  court_id: number | null
  match_date: string | null
  match_time: string | null
  player1_id: number
  player2_id: number | null
  player3_id: number
  player4_id: number | null
  score: string | null
  winner_side: 1 | 2 | null
  status: 'scheduled' | 'in_progress' | 'completed' | 'walkover' | 'canceled'
  referee_id: number | null
  created_at: string
  updated_at: string
  player1?: {
    id: number
    full_name: string
  }
  player2?: {
    id: number
    full_name: string
  }
  player3?: {
    id: number
    full_name: string
  }
  player4?: {
    id: number
    full_name: string
  }
  court?: {
    id: number
    name: string
  }
}

export interface CreateTournamentRequest {
  name: string
  description?: string
  tournament_type?: string
  state_id: number
  venue_name?: string
  venue_address?: string
  start_date: string
  end_date: string
  registration_start: string
  registration_end: string
  entry_fee?: number
  max_participants?: number
  banner_url?: string
  is_ranking?: boolean
  ranking_multiplier?: number
}

export interface CreateTournamentCategoryRequest {
  name: string
  min_age?: number
  max_age?: number
  gender?: 'Male' | 'Female' | 'Mixed'
  min_skill_level?: number
  max_skill_level?: number
  format?: string
  max_participants?: number
}

export interface RegisterTournamentRequest {
  categoryId: number
  partnerPlayerId?: number
}

export interface CreateMatchRequest {
  tournament_id: number
  category_id: number
  round: number
  match_number: number
  court_id?: number
  match_date?: string
  match_time?: string
  player1_id: number
  player2_id?: number
  player3_id: number
  player4_id?: number
  referee_id?: number
}

export interface UpdateMatchRequest {
  court_id?: number
  match_date?: string
  match_time?: string
  score?: string
  winner_side?: 1 | 2
  status?: 'scheduled' | 'in_progress' | 'completed' | 'walkover' | 'canceled'
  referee_id?: number
}

export interface TournamentFilters {
  state_id?: number
  organizer_type?: 'federation' | 'state' | 'club' | 'partner'
  status?: 'upcoming' | 'ongoing' | 'completed' | 'canceled'
  start_date?: string
  end_date?: string
  limit?: number
  offset?: number
}

export interface TournamentsState {
  tournaments: Tournament[]
  currentTournament: Tournament | null
  registrations: TournamentRegistration[]
  matches: TournamentMatch[]
  categories: TournamentCategory[]
  isLoading: boolean
  totalCount: number
}