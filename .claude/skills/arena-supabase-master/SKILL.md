---
name: arena-supabase-master
description: ARENA Performance (arena-performance.com) projesi icin Supabase 2 tam oyun kitabi. RLS politikalari, migration safety, edge functions, realtime subscriptions, storage bucket patterns, auth flows (magic link / password / OAuth), typed client generation ve production debugging. Tetikleyici anahtarlar: "supabase", "RLS", "migration", "edge function", "realtime", "storage", "auth flow", "policy", "row level security", "postgrest", "rpc".
version: 1.0.0
owner: ARENA Performance
model_preference: claude-opus-4-7
---

# ARENA × Supabase Master Playbook

Bu skill, `arena-performance.com` icin Supabase 2.x uzerinde production-grade islem yapmak icin tam referanstir.

## 0) Proje Baglami
- Client: `src/lib/supabase.ts` (tek singleton, ESM import edin)
- Types: `src/lib/database.types.ts` (uretildikten sonra commit edilir)
- Auth akislari: student portal (magic link), admin (password + MFA), coach (password)
- Realtime: student workout log, chat, notifications
- Storage buckets: `avatars` (public), `progress-photos` (private), `lesson-videos` (signed), `exports` (private+signed)

## 1) RLS — Asla default deny'i kapatma

Her yeni tablo icin uc adim:

1. `ALTER TABLE public.{name} ENABLE ROW LEVEL SECURITY;`
2. Minimum dort politika: SELECT / INSERT / UPDATE / DELETE — her biri explicit
3. Service-role bypass'a guvenme — edge function yazsan bile RLS'yi gec gecirme

### Policy Patterns

```sql
-- Pattern A: Student kendi kaydini gorur
CREATE POLICY "student_self_read"
  ON public.workouts
  FOR SELECT
  USING (auth.uid() = student_id);

-- Pattern B: Coach assigned student'larin kaydini gorur
CREATE POLICY "coach_assigned_read"
  ON public.workouts
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.coach_students cs
      WHERE cs.coach_id = auth.uid()
        AND cs.student_id = workouts.student_id
    )
  );

-- Pattern C: Admin her sey
CREATE POLICY "admin_all"
  ON public.workouts
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Pattern D: Insert with-check — student sadece kendine yazabilir
CREATE POLICY "student_self_insert"
  ON public.workouts
  FOR INSERT
  WITH CHECK (auth.uid() = student_id);
```

### RLS Debug Playbook

Hata: `new row violates row-level security policy`

1. Policy'i SQL'de sim et: `SET LOCAL ROLE authenticated; SET LOCAL "request.jwt.claims" = '{"sub":"<uuid>"}'; INSERT ...`
2. `SELECT * FROM pg_policies WHERE tablename = 'X';` — aktif policy'leri listele
3. INSERT icin `WITH CHECK` olmali; sadece `USING` olunca insert icin FAIL.
4. `service_role` key'i sadece sunucuda kullan; clientta ASLA.

## 2) Migration Safety

ARENA'da migration dosyalari `supabase/migrations/YYYYMMDDHHMMSS_<slug>.sql` seklinde.

### Migration Checklist (her migration icin)
- [ ] Idempotent? (`IF NOT EXISTS`, `CREATE OR REPLACE`)
- [ ] Rollback dosyasi var mi? (down.sql yoksa: yorum satiri olarak rollback SQL)
- [ ] RLS enable + en az bir policy?
- [ ] `updated_at` trigger eklendi mi? (pattern B)
- [ ] Yeni kolon varsa default/nullable karari acikca verildi mi?
- [ ] Index: sorgulama pattern'iyle uyumlu mu? (btree vs gin vs gist)
- [ ] Foreign key: ON DELETE CASCADE mi SET NULL mi RESTRICT mi?

### Pattern B: updated_at trigger

```sql
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END; $$;

CREATE TRIGGER trg_updated_at
  BEFORE UPDATE ON public.workouts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
```

### Zero-downtime kolon ekleme

Canli tabloya NOT NULL kolon eklemek ASLA tek migration'da olmaz.

1. Migration 1: `ALTER TABLE X ADD COLUMN y TEXT;` (nullable)
2. App deploy: kodu y dolduracak sekilde guncelle
3. Backfill: `UPDATE X SET y = '...' WHERE y IS NULL;`
4. Migration 2: `ALTER TABLE X ALTER COLUMN y SET NOT NULL;`

## 3) Types Generation

```bash
# Her migration sonrasi calistir
npx supabase gen types typescript --project-id <ref> --schema public > src/lib/database.types.ts
```

Client kullanimi:

```ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: localStorage,
      flowType: 'pkce',
    },
    global: {
      headers: { 'x-arena-client': 'web' },
    },
  }
)
```

## 4) Realtime Subscriptions

```ts
// Pattern: subscribe + cleanup + reconnect
useEffect(() => {
  if (!studentId) return
  const channel = supabase
    .channel(`workout-${studentId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'workouts', filter: `student_id=eq.${studentId}` },
      (payload) => {
        if (payload.eventType === 'INSERT') upsertLocal(payload.new)
        if (payload.eventType === 'UPDATE') upsertLocal(payload.new)
        if (payload.eventType === 'DELETE') removeLocal(payload.old.id)
      }
    )
    .subscribe()

  return () => { supabase.removeChannel(channel) }
}, [studentId])
```

Gotcha: RLS realtime'i etkiler. Policy'de SELECT izni yoksa event gelmez.

## 5) Storage Buckets

```ts
// Signed URL — private bucket
const { data, error } = await supabase.storage
  .from('progress-photos')
  .createSignedUrl(`${userId}/2026-04-19.jpg`, 3600)

// Upload with optimistic UI
async function uploadAvatar(file: File, userId: string) {
  const path = `${userId}/${Date.now()}.${file.name.split('.').pop()}`
  const { error } = await supabase.storage
    .from('avatars')
    .upload(path, file, { cacheControl: '3600', upsert: true, contentType: file.type })
  if (error) throw error
  const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
  return publicUrl
}
```

Bucket RLS policy ornegi:

```sql
CREATE POLICY "user_upload_own_avatar"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

## 6) Edge Functions

```ts
// supabase/functions/send-reminder/index.ts
import { serve } from 'https://deno.land/std@0.192.0/http/server.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

serve(async (req) => {
  const { record } = await req.json()
  const admin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )
  // ... business logic
  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
```

Secret ekleme: `npx supabase secrets set RESEND_API_KEY=...`

## 7) Auth Flows

### Magic Link (student portal)
```ts
await supabase.auth.signInWithOtp({
  email,
  options: {
    emailRedirectTo: `${window.location.origin}/portal`,
    shouldCreateUser: false, // invite-only
  },
})
```

### OAuth (Google - coach)
```ts
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,
    queryParams: { access_type: 'offline', prompt: 'consent' },
  },
})
```

### Password + MFA (admin)
```ts
const { data } = await supabase.auth.signInWithPassword({ email, password })
if (data.user && needsMfa(data.user)) {
  const { data: factors } = await supabase.auth.mfa.listFactors()
  // prompt for TOTP, then verify
  await supabase.auth.mfa.challengeAndVerify({ factorId, code })
}
```

## 8) RPC (Stored Procedures)

Karmasik joinli sorgu ve yazma icin RPC tercih et — tek roundtrip + explain plan kontrolu.

```sql
CREATE OR REPLACE FUNCTION public.record_workout(
  p_exercise_id uuid,
  p_sets jsonb
) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_id uuid;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;
  INSERT INTO public.workouts (student_id, exercise_id, sets)
  VALUES (auth.uid(), p_exercise_id, p_sets)
  RETURNING id INTO v_id;
  RETURN v_id;
END; $$;

REVOKE ALL ON FUNCTION public.record_workout(uuid, jsonb) FROM public;
GRANT EXECUTE ON FUNCTION public.record_workout(uuid, jsonb) TO authenticated;
```

Client:
```ts
const { data, error } = await supabase.rpc('record_workout', {
  p_exercise_id: exerciseId,
  p_sets: sets,
})
```

## 9) Performance

- Full-text search: `tsvector` + GIN index
- Pagination: `range()` + keyset (seek) > offset
- N+1 cikarma: `select('*, exercise:exercises(*)')` (nested select)
- Index: WHERE + ORDER BY kolonlarina btree; JSON kolonlarina GIN
- Slow query: Dashboard > Database > Query Performance

## 10) Production Debugging Checklist

1. Client: browser devtools > Network > Supabase fetch > Response
2. Dashboard: Logs > API / Postgres / Edge Functions
3. `auth.users` tablosu: `raw_user_meta_data` ile role kontrolu
4. Telemetri: `x-request-id` header'i logla, support'a ver

## 11) Environment Management

ARENA'da 3 ortam:
- Local: `supabase start` (Docker)
- Preview: CF Pages preview → staging Supabase project
- Prod: `arena-performance.com` → prod project

Env dosya sirasi: `.env.local` > `.env.production.local` > `.env.production` > `.env`

## 12) Red Flags — Asla Yapma

- Anon key ile yazma islemi yaparken RLS yok
- Service role key'i client bundle'a ekleme
- Migration'da `DROP TABLE CASCADE` (once data export et)
- `auth.uid()` yerine client'tan gelen userId'ye guven
- `SECURITY DEFINER` fonksiyonda `search_path` set etmemek
- Realtime'i RLS'siz acik tuttmak (herkes herkesi dinler)

## 13) Hizli Komutlar

```bash
# Local baslat
npx supabase start

# Migration uygula (prod)
npx supabase db push --linked

# Types uret
npx supabase gen types typescript --linked > src/lib/database.types.ts

# Edge function deploy
npx supabase functions deploy send-reminder

# Secret set
npx supabase secrets set KEY=value
```

## 14) ARENA-Ozel Patternler

- `profiles.role` enum: `'student' | 'coach' | 'admin' | 'parent'`
- Her islem sonrasi `analytics_events` tablosuna kayit (RPC ile tek call)
- Rate limit: edge function'da `Deno.env.get('SUPABASE_URL')` + kv-like counter
- Lokalize hata mesajlari: edge'den ISO kod don, client'ta `t.errors.<code>` map et

## 15) Test ve Bakim

- `npm run types:supabase` — types regen
- `supabase db diff` — schema drift kontrolu
- `supabase db lint` — policy/trigger eksik mi?
- Weekly: `SELECT * FROM pg_stat_user_tables ORDER BY n_dead_tup DESC LIMIT 10;`

---

Kullanim: bu skill invoke edildiginde ilgili bolumu hedefle ve kodu projeye-spesifik pattern'le uret. Her sql migration sonrasi types'i regen etmeyi unutma.
