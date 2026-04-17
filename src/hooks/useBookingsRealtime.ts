import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useStore, type Booking } from '../stores/useStore'

/**
 * Row shape returned by Supabase (snake_case).
 * We convert it to the client-side Booking type (camelCase).
 */
type BookingRow = {
  id: string
  name: string
  email: string
  phone: string
  goal: string | null
  message: string | null
  session_type: Booking['sessionType']
  preferred_day: string | null
  preferred_time: string | null
  status: Booking['status']
  price: number | null
  meeting_link: string | null
  meeting_type: Booking['meetingType'] | null
  scheduled_date: string | null
  scheduled_time: string | null
  admin_note: string | null
  created_at: string
  updated_at: string | null
}

const rowToBooking = (r: BookingRow): Booking => ({
  id: r.id,
  name: r.name,
  email: r.email,
  phone: r.phone,
  goal: r.goal ?? '',
  message: r.message ?? undefined,
  sessionType: r.session_type,
  preferredDay: r.preferred_day ?? undefined,
  preferredTime: r.preferred_time ?? undefined,
  status: r.status,
  price: r.price ?? undefined,
  meetingLink: r.meeting_link ?? undefined,
  meetingType: r.meeting_type ?? undefined,
  scheduledDate: r.scheduled_date ?? undefined,
  scheduledTime: r.scheduled_time ?? undefined,
  adminNote: r.admin_note ?? undefined,
  createdAt: r.created_at,
  updatedAt: r.updated_at ?? undefined,
})

/**
 * Subscribes the admin panel to live changes on the `bookings` table.
 * - Initial fetch populates the store.
 * - INSERT / UPDATE / DELETE events keep it in sync in real time.
 */
export function useBookingsRealtime(enabled = true) {
  const setBookings = useStore(s => s.setBookings)
  const upsertBooking = useStore(s => s.upsertBooking)
  const removeBookingById = useStore(s => s.removeBookingById)
  const showToast = useStore(s => s.showToast)

  useEffect(() => {
    if (!enabled) return
    let cancelled = false

    // Initial load
    ;(async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
      if (cancelled) return
      if (error) {
        console.warn('[bookings] initial fetch failed:', error.message)
        return
      }
      if (data) setBookings((data as BookingRow[]).map(rowToBooking))
    })()

    // Realtime subscription
    const channel = supabase
      .channel('bookings-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        (payload) => {
          if (payload.eventType === 'INSERT' && payload.new) {
            const b = rowToBooking(payload.new as BookingRow)
            upsertBooking(b)
            showToast(`📩 Yeni randevu talebi: ${b.name}`)
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            upsertBooking(rowToBooking(payload.new as BookingRow))
          } else if (payload.eventType === 'DELETE' && payload.old) {
            const oldRow = payload.old as { id?: string }
            if (oldRow.id) removeBookingById(oldRow.id)
          }
        }
      )
      .subscribe()

    return () => {
      cancelled = true
      supabase.removeChannel(channel)
    }
  }, [enabled, setBookings, upsertBooking, removeBookingById, showToast])
}
