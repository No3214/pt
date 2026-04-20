// ARENA — auth helpers for edge functions
// Validates caller is admin/super_admin/editor with correct tenant scoping.

import { createClient, type SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

export interface AuthContext {
  supabase: SupabaseClient
  userId: string
  tenantId: string | null
  role: string
}

export async function requireAdmin(
  req: Request,
  allowedRoles: string[] = ['admin', 'super_admin', 'editor'],
): Promise<AuthContext> {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) throw new Response('Missing Authorization', { status: 401 })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { global: { headers: { Authorization: authHeader } } },
  )

  const { data: userData, error: userErr } = await supabase.auth.getUser()
  if (userErr || !userData.user) throw new Response('Invalid token', { status: 401 })

  const { data: profile, error: profErr } = await supabase
    .from('profiles')
    .select('tenant_id, role')
    .eq('id', userData.user.id)
    .single()

  if (profErr || !profile) throw new Response('Profile not found', { status: 403 })
  if (!allowedRoles.includes(profile.role as string)) {
    throw new Response(`Role ${profile.role} not allowed`, { status: 403 })
  }

  return {
    supabase,
    userId: userData.user.id,
    tenantId: profile.tenant_id as string | null,
    role: profile.role as string,
  }
}

export function errToResponse(e: unknown): Response {
  if (e instanceof Response) return e
  const msg = e instanceof Error ? e.message : String(e)
  return new Response(JSON.stringify({ error: msg }), { status: 500 })
}
