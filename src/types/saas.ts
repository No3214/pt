export type OrganizationType = 'coach' | 'gym' | 'studio' | 'academy' | 'enterprise'

export type OrganizationStatus = 'trial' | 'active' | 'past_due' | 'suspended' | 'cancelled'

export type OrganizationRole = 'owner' | 'admin' | 'coach' | 'staff' | 'student'

export type PackageType =
  | 'pt_sessions'
  | 'online_coaching'
  | 'gym_membership'
  | 'group_class'
  | 'course'
  | 'bundle'

export type CheckoutStatus = 'created' | 'pending' | 'paid' | 'failed' | 'expired' | 'cancelled'

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled' | 'chargeback'

export type EntitlementType = 'pt_sessions' | 'membership' | 'course_access' | 'online_coaching' | 'bundle'

export type EntitlementStatus = 'active' | 'paused' | 'expired' | 'cancelled'

export type CourseStatus = 'draft' | 'published' | 'archived'

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced' | 'elite'

export type LessonType = 'video' | 'text' | 'pdf' | 'quiz' | 'live_session'

export type ClassBookingStatus = 'booked' | 'waitlisted' | 'cancelled' | 'attended' | 'no_show'

export type PaymentProviderCode = 'iyzico' | 'paytr' | 'param' | 'stripe' | 'manual'

export interface Organization {
  id: string
  name: string
  slug: string
  organization_type: OrganizationType
  owner_id: string | null
  logo_url: string | null
  website_url: string | null
  contact_email: string | null
  contact_phone: string | null
  billing_email: string | null
  default_currency: string
  timezone: string
  status: OrganizationStatus
  trial_ends_at: string | null
  created_at: string
  updated_at: string
}

export interface OrganizationBranding {
  id: string
  organization_id: string
  brand_name: string
  tagline: string | null
  primary_color: string
  secondary_color: string
  accent_color: string
  background_color: string
  dark_background_color: string
  logo_url: string | null
  favicon_url: string | null
  instagram_url: string | null
  whatsapp_number: string | null
  custom_domain: string | null
  created_at: string
  updated_at: string
}

export interface OrganizationMember {
  id: string
  organization_id: string
  user_id: string
  role: OrganizationRole
  status: 'invited' | 'active' | 'disabled'
  invited_by: string | null
  joined_at: string | null
  created_at: string
}

export interface SaasPlan {
  id: string
  code: string
  name: string
  description: string | null
  monthly_price: number
  annual_price: number | null
  currency: string
  max_students: number | null
  max_coaches: number | null
  max_branches: number | null
  features: string[]
  is_public: boolean
  created_at: string
}

export interface CommercialPackage {
  id: string
  organization_id: string
  coach_id: string | null
  name: string
  description: string | null
  package_type: PackageType
  price: number
  currency: string
  session_count: number | null
  duration_days: number | null
  access_days: number | null
  features: string[]
  is_public: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateCommercialPackageInput {
  organization_id: string
  coach_id?: string | null
  name: string
  description?: string | null
  package_type: PackageType
  price: number
  currency?: string
  session_count?: number | null
  duration_days?: number | null
  access_days?: number | null
  features?: string[]
  is_public?: boolean
  is_active?: boolean
}

export interface CheckoutSession {
  id: string
  organization_id: string
  package_id: string | null
  buyer_user_id: string | null
  buyer_name: string | null
  buyer_email: string | null
  buyer_phone: string | null
  amount: number
  currency: string
  status: CheckoutStatus
  provider: PaymentProviderCode | null
  provider_session_id: string | null
  provider_payment_id: string | null
  checkout_url: string | null
  expires_at: string | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface CreateCheckoutSessionInput {
  organization_id: string
  package_id: string
  buyer_name?: string | null
  buyer_email?: string | null
  buyer_phone?: string | null
  success_url?: string
  cancel_url?: string
  metadata?: Record<string, unknown>
}

export interface PaymentTransaction {
  id: string
  organization_id: string
  checkout_session_id: string | null
  package_id: string | null
  student_id: string | null
  coach_id: string | null
  amount: number
  currency: string
  status: PaymentStatus
  payment_method: string | null
  provider: PaymentProviderCode | null
  provider_payment_id: string | null
  provider_conversation_id: string | null
  installment_count: number
  paid_at: string | null
  refunded_at: string | null
  invoice_url: string | null
  raw_payload: Record<string, unknown>
  created_at: string
}

export interface StudentEntitlement {
  id: string
  organization_id: string
  student_id: string
  package_id: string | null
  payment_transaction_id: string | null
  entitlement_type: EntitlementType
  status: EntitlementStatus
  sessions_total: number
  sessions_used: number
  starts_at: string
  ends_at: string | null
  created_at: string
}

export interface Course {
  id: string
  organization_id: string
  instructor_id: string | null
  title: string
  slug: string
  description: string | null
  cover_image_url: string | null
  level: CourseLevel
  status: CourseStatus
  price: number | null
  currency: string
  access_days: number | null
  certificate_enabled: boolean
  created_at: string
  updated_at: string
}

export interface CourseModule {
  id: string
  course_id: string
  title: string
  description: string | null
  sort_order: number
  created_at: string
}

export interface CourseLesson {
  id: string
  module_id: string
  title: string
  lesson_type: LessonType
  video_url: string | null
  pdf_url: string | null
  body: string | null
  duration_seconds: number | null
  sort_order: number
  is_preview: boolean
  created_at: string
}

export interface PaymentDashboardStats {
  totalRevenue: number
  pendingRevenue: number
  failedRevenue: number
  activeEntitlements: number
  paidTransactions: number
  pendingTransactions: number
}
