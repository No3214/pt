import { supabase } from '../supabase'
import type { CommercialPackage, CreatePackageInput } from './types'

function assertPositivePrice(price: number) {
  if (!Number.isFinite(price) || price <= 0) {
    throw new Error('Package price must be greater than zero')
  }
}

function normalizeFeatures(features?: string[]) {
  return (features || [])
    .map(feature => feature.trim())
    .filter(Boolean)
    .slice(0, 30)
}

export async function createCommercialPackage(input: CreatePackageInput): Promise<CommercialPackage> {
  assertPositivePrice(input.price)

  const payload = {
    organization_id: input.organizationId,
    coach_id: input.coachId || null,
    name: input.name.trim(),
    description: input.description?.trim() || null,
    package_type: input.packageType,
    price: input.price,
    currency: input.currency || 'TRY',
    session_count: input.sessionCount || null,
    duration_days: input.durationDays || null,
    access_days: input.accessDays || input.durationDays || null,
    features: normalizeFeatures(input.features),
    is_public: input.isPublic ?? true,
    is_active: true,
  }

  if (!payload.name) {
    throw new Error('Package name is required')
  }

  const { data, error } = await supabase
    .from('commercial_packages')
    .insert(payload)
    .select('*')
    .single()

  if (error) throw error
  return data as CommercialPackage
}

export async function listCommercialPackages(organizationId: string): Promise<CommercialPackage[]> {
  const { data, error } = await supabase
    .from('commercial_packages')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data || []) as CommercialPackage[]
}

export async function getCommercialPackage(packageId: string): Promise<CommercialPackage | null> {
  const { data, error } = await supabase
    .from('commercial_packages')
    .select('*')
    .eq('id', packageId)
    .maybeSingle()

  if (error) throw error
  return data as CommercialPackage | null
}

export function buildPublicCheckoutPath(packageId: string) {
  return `/checkout/${packageId}`
}

export function buildWhatsAppSalesMessage(params: {
  packageName: string
  price: number
  currency?: string
  checkoutUrl: string
}) {
  const currency = params.currency || 'TRY'
  return [
    `Merhaba, ${params.packageName} paketiniz hazır.`,
    `Paket ücreti: ${params.price.toLocaleString('tr-TR')} ${currency}`,
    'Ödeme sonrası öğrenci portalınız otomatik olarak açılacaktır.',
    `Ödeme linki: ${params.checkoutUrl}`,
  ].join('\n')
}
