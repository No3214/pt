import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  buildPublicCheckoutPath,
  buildWhatsAppCheckoutMessage,
  createCommercialPackage,
  getCommercialPackages,
  getMyOrganizations,
  getOrganizationBranding,
  getPaymentDashboardStats,
} from '../lib/saas'
import type {
  CommercialPackage,
  CreateCommercialPackageInput,
  Organization,
  OrganizationBranding,
  PaymentDashboardStats,
} from '../types/saas'

interface UseSaasWorkspaceState {
  organizations: Organization[]
  activeOrganization: Organization | null
  branding: OrganizationBranding | null
  packages: CommercialPackage[]
  paymentStats: PaymentDashboardStats | null
  loading: boolean
  error: string | null
}

interface CheckoutShareArgs {
  packageId: string
  origin?: string
}

export function useSaasWorkspace() {
  const [state, setState] = useState<UseSaasWorkspaceState>({
    organizations: [],
    activeOrganization: null,
    branding: null,
    packages: [],
    paymentStats: null,
    loading: true,
    error: null,
  })

  const setError = useCallback((error: unknown) => {
    const message = error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu'
    setState((current) => ({ ...current, loading: false, error: message }))
  }, [])

  const refresh = useCallback(async () => {
    try {
      setState((current) => ({ ...current, loading: true, error: null }))

      const organizations = await getMyOrganizations()
      const activeOrganization = organizations[0] ?? null

      if (!activeOrganization) {
        setState({
          organizations,
          activeOrganization: null,
          branding: null,
          packages: [],
          paymentStats: null,
          loading: false,
          error: null,
        })
        return
      }

      const [branding, packages, paymentStats] = await Promise.all([
        getOrganizationBranding(activeOrganization.id),
        getCommercialPackages(activeOrganization.id),
        getPaymentDashboardStats(activeOrganization.id),
      ])

      setState({
        organizations,
        activeOrganization,
        branding,
        packages,
        paymentStats,
        loading: false,
        error: null,
      })
    } catch (error) {
      setError(error)
    }
  }, [setError])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const createPackage = useCallback(
    async (input: Omit<CreateCommercialPackageInput, 'organization_id'>) => {
      if (!state.activeOrganization) throw new Error('Önce aktif organizasyon seçilmelidir')

      const created = await createCommercialPackage({
        ...input,
        organization_id: state.activeOrganization.id,
      })

      setState((current) => ({
        ...current,
        packages: [created, ...current.packages],
      }))

      return created
    },
    [state.activeOrganization],
  )

  const getCheckoutShare = useCallback(
    ({ packageId, origin }: CheckoutShareArgs) => {
      if (!state.activeOrganization) throw new Error('Aktif organizasyon bulunamadı')

      const selectedPackage = state.packages.find((item) => item.id === packageId)
      if (!selectedPackage) throw new Error('Paket bulunamadı')

      const baseOrigin = origin ?? window.location.origin
      const checkoutPath = buildPublicCheckoutPath(state.activeOrganization.slug, selectedPackage.id)
      const checkoutUrl = `${baseOrigin}${checkoutPath}`
      const message = buildWhatsAppCheckoutMessage({
        packageName: selectedPackage.name,
        price: selectedPackage.price,
        currency: selectedPackage.currency,
        checkoutUrl,
      })

      return {
        checkoutPath,
        checkoutUrl,
        whatsappMessage: message,
        whatsappUrl: `https://wa.me/?text=${encodeURIComponent(message)}`,
      }
    },
    [state.activeOrganization, state.packages],
  )

  const activeCurrency = useMemo(() => {
    return state.activeOrganization?.default_currency ?? state.packages[0]?.currency ?? 'TRY'
  }, [state.activeOrganization?.default_currency, state.packages])

  return {
    ...state,
    activeCurrency,
    refresh,
    createPackage,
    getCheckoutShare,
  }
}
