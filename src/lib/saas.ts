import { supabase } from './supabase'
import type {
  CheckoutSession,
  CommercialPackage,
  CreateCheckoutSessionInput,
  CreateCommercialPackageInput,
  Organization,
  OrganizationBranding,
  OrganizationMember,
  PaymentDashboardStats,
  PaymentTransaction,
  StudentEntitlement,
} from '../types/saas'

function requireId(value: string | null | undefined, label: string): string {
  if (!value) throw new Error(`${label} is required`)
  return value
}

function normalizeMoney(value: number | null | undefined): number {
  if (!Number.isFinite(Number(value))) return 0
  return Number(value)
}

export async function getMyOrganizations(): Promise<Organization[]> {
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError) throw userError

  const userId = requireId(userData.user?.id, 'Authenticated user')

  const { data, error } = await supabase
    .from('organization_members')
    .select('organizations(*)')
    .eq('user_id', userId)
    .eq('status', 'active')

  if (error) throw error

  return (data ?? [])
    .map((row) => row.organizations as Organization | Organization[] | null)
    .flat()
    .filter(Boolean) as Organization[]
}

export async function getOrganizationBranding(organizationId: string): Promise<OrganizationBranding | null> {
  const { data, error } = await supabase
    .from('organization_branding')
    .select('*')
    .eq('organization_id', organizationId)
    .maybeSingle()

  if (error) throw error
  return data as OrganizationBranding | null
}

export async function getOrganizationMembers(organizationId: string): Promise<OrganizationMember[]> {
  const { data, error } = await supabase
    .from('organization_members')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as OrganizationMember[]
}

export async function getCommercialPackages(organizationId: string): Promise<CommercialPackage[]> {
  const { data, error } = await supabase
    .from('commercial_packages')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as CommercialPackage[]
}

export async function createCommercialPackage(input: CreateCommercialPackageInput): Promise<CommercialPackage> {
  const payload = {
    organization_id: input.organization_id,
    coach_id: input.coach_id ?? null,
    name: input.name.trim(),
    description: input.description?.trim() || null,
    package_type: input.package_type,
    price: input.price,
    currency: input.currency ?? 'TRY',
    session_count: input.session_count ?? null,
    duration_days: input.duration_days ?? null,
    access_days: input.access_days ?? input.duration_days ?? null,
    features: input.features ?? [],
    is_public: input.is_public ?? true,
    is_active: input.is_active ?? true,
  }

  const { data, error } = await supabase
    .from('commercial_packages')
    .insert(payload)
    .select('*')
    .single()

  if (error) throw error
  return data as CommercialPackage
}

export async function createCheckoutSession(input: CreateCheckoutSessionInput): Promise<CheckoutSession> {
  const selectedPackage = await getCommercialPackage(input.organization_id, input.package_id)

  if (!selectedPackage) {
    throw new Error('Package not found or inactive')
  }

  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()

  const { data, error } = await supabase
    .from('checkout_sessions')
    .insert({
      organization_id: input.organization_id,
      package_id: input.package_id,
      buyer_name: input.buyer_name ?? null,
      buyer_email: input.buyer_email ?? null,
      buyer_phone: input.buyer_phone ?? null,
      amount: selectedPackage.price,
      currency: selectedPackage.currency,
      status: 'created',
      provider: null,
      checkout_url: null,
      expires_at: expiresAt,
      metadata: {
        ...(input.metadata ?? {}),
        success_url: input.success_url,
        cancel_url: input.cancel_url,
      },
    })
    .select('*')
    .single()

  if (error) throw error
  return data as CheckoutSession
}

export async function getCommercialPackage(
  organizationId: string,
  packageId: string,
): Promise<CommercialPackage | null> {
  const { data, error } = await supabase
    .from('commercial_packages')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('id', packageId)
    .eq('is_active', true)
    .maybeSingle()

  if (error) throw error
  return data as CommercialPackage | null
}

export async function getPaymentTransactions(organizationId: string): Promise<PaymentTransaction[]> {
  const { data, error } = await supabase
    .from('payment_transactions')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as PaymentTransaction[]
}

export async function getStudentEntitlements(organizationId: string): Promise<StudentEntitlement[]> {
  const { data, error } = await supabase
    .from('student_entitlements')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as StudentEntitlement[]
}

export async function getPaymentDashboardStats(organizationId: string): Promise<PaymentDashboardStats> {
  const [transactions, entitlements] = await Promise.all([
    getPaymentTransactions(organizationId),
    getStudentEntitlements(organizationId),
  ])

  const paidTransactions = transactions.filter((transaction) => transaction.status === 'paid')
  const pendingTransactions = transactions.filter((transaction) => transaction.status === 'pending')
  const failedTransactions = transactions.filter((transaction) => transaction.status === 'failed')

  return {
    totalRevenue: paidTransactions.reduce((sum, transaction) => sum + normalizeMoney(transaction.amount), 0),
    pendingRevenue: pendingTransactions.reduce((sum, transaction) => sum + normalizeMoney(transaction.amount), 0),
    failedRevenue: failedTransactions.reduce((sum, transaction) => sum + normalizeMoney(transaction.amount), 0),
    activeEntitlements: entitlements.filter((entitlement) => entitlement.status === 'active').length,
    paidTransactions: paidTransactions.length,
    pendingTransactions: pendingTransactions.length,
  }
}

export function buildPublicCheckoutPath(organizationSlug: string, packageId: string): string {
  return `/checkout/${encodeURIComponent(organizationSlug)}/${encodeURIComponent(packageId)}`
}

export function buildWhatsAppCheckoutMessage(args: {
  packageName: string
  price: number
  currency: string
  checkoutUrl: string
}): string {
  const price = new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: args.currency,
    maximumFractionDigits: 0,
  }).format(args.price)

  return [
    `Merhaba, ${args.packageName} paketi için ödeme linkiniz aşağıdadır.`,
    `Paket tutarı: ${price}`,
    `Ödeme linki: ${args.checkoutUrl}`,
    'Ödeme tamamlandıktan sonra öğrenci portalınız otomatik olarak aktifleşecektir.',
  ].join('\n')
}
