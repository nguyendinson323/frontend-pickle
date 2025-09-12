export interface CoachCertification {
  id: number
  coach_id: number
  name: string
  issuer: string
  issue_date: string
  expiry_date: string | null
  certificate_url: string
  created_at: string
}

export interface CertificationStats {
  total_certifications: number
  active_certifications: number
  expired_certifications: number
  expiring_soon: number
}

export interface CertificationFilters {
  status: string
  issuer: string
  search: string
}