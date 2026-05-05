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

export type PaymentProvider = 'iyzico' | 'paytr' | 'param' | 'stripe' | 'manual'

export type EntitlementType = 'pt_sessions' | 'membership' | 'course_access' | 'online_coaching' | 'bundle'

export interface Organization {
  id: string
  name: string
  slug: string
  organization_type: OrganizationType
  owner_id?: string | null
  logo_url?: string | null
  website_url?: string | null
  contact_email?: string | null
  contact_phone?: string | null
  billing_email?: string | null
  default_currency: string
  timezone: string
  status: OrganizationStatus
  trial_ends_at?: string | null
  created_at: string
  updated_at?: string | null
}

export interface OrganizationBranding {
  id: string
  organization_id: string
  brand_name: string
  tagline?: string | null
  primary_color: string
  secondary_color: string
  accent_color: string
  background_color: string
  dark_background_color: string
  logo_url?: string | null
  favicon_url?: string | null
  instagram_url?: string | null
  whatsapp_number?: string | null
  custom_domain?: string | null
}

export interface OrganizationMember {
  id: string
  organization_id: string
  user_id: string
  role: OrganizationRole
  status: 'invited' | 'active' | 'disabled'
  invited_by?: string | null
  joined_at?: string | null
  created_at: string
}

export interface CommercialPackage {
  id: string
  organization_id: string
  coach_id?: string | null
  name: string
  description?: string | null
  package_type: PackageType
  price: number
  currency: string
  session_count?: number | null
  duration_days?: number | null
  access_days?: number | null
  features: string[]
  is_public: boolean
  is_active: boolean
  created_at: string
  updated_at?: string | null
}

export interface CheckoutSession {
  id: string
  organization_id: string
  package_id?: string | null
  buyer_user_id?: string | null
  buyer_name?: string | null
  buyer_email?: string | null
  buyer_phone?: string | null
  amount: number
  currency: string
  status: CheckoutStatus
  provider?: PaymentProvider | null
  provider_session_id?: string | null
  provider_payment_id?: string | null
  checkout_url?: string | null
  expires_at?: string | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at?: string | null
}

export interface PaymentTransaction {
  id: string
  organization_id: string
  checkout_session_id?: string | null
  package_id?: string | null
  student_id?: string | null
  coach_id?: string | null
  amount: number
  currency: string
  status: PaymentStatus
  payment_method?: string | null
  provider?: PaymentProvider | null
  provider_payment_id?: string | null
  provider_conversation_id?: string | null
  installment_count: number
  paid_at?: string | null
  refunded_at?: string | null
  invoice_url?: string | null
  raw_payload: Record<string, unknown>
  created_at: string
}

export interface StudentEntitlement {
  id: string
  organization_id: string
  student_id: string
  package_id?: string | null
  payment_transaction_id?: string | null
  entitlement_type: EntitlementType
  status: 'active' | 'paused' | 'expired' | 'cancelled'
  sessions_total: number
  sessions_used: number
  starts_at: string
  ends_at?: string | null
  created_at: string
}

export interface CreatePackageInput {
  organizationId: string
  coachId?: string | null
  name: string
  description?: string
  packageType: PackageType
  price: number
  currency?: string
  sessionCount?: number
  durationDays?: number
  accessDays?: number
  features?: string[]
  isPublic?: boolean
}

export interface CreateCheckoutSessionInput {
  organizationId: string
  packageId: string
  buyerName?: string
  buyerEmail?: string
  buyerPhone?: string
  provider?: PaymentProvider
  metadata?: Record<string, unknown>
}

export interface CheckoutResult {
  session: CheckoutSession
  redirectUrl: string
}
