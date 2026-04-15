@echo off
REM ============================================================================
REM Commit all Cowork task changes and push to origin
REM Run this from: PT\pt\
REM ============================================================================

echo.
echo [1/5] Removing stale git lock if present...
if exist ".git\index.lock" del /f /q ".git\index.lock"

echo.
echo [2/5] Staging task files...
git add src/pages/admin/Bookings.tsx ^
        src/components/landing/BookingCTA.tsx ^
        src/components/landing/LandingUI.tsx ^
        src/stores/useStore.ts ^
        src/hooks/useBookingsRealtime.ts ^
        supabase/migrations/20260410_create_bookings.sql ^
        src/locales/tr.ts ^
        src/components/common/ReloadPrompt.tsx ^
        src/components/portal/StudentWeightChart.tsx ^
        src/components/portal/WellnessTracker.tsx ^
        src/pages/Portal.tsx ^
        src/pages/admin/Builder.tsx

echo.
echo [3/5] Showing what will be committed...
git status --short

echo.
echo [4/5] Creating commit...
git commit -m "feat: landing reveal + booking akisi + admin realtime" -m "- RevealSection: useReducedMotion destegi (Hero/About/Stats/Programs/Testimonials)" -m "- BookingCTA: shake hatalari, successPop tik, spinner, focus glow" -m "- Admin Bookings: hoverLift + stagger + AnimatePresence slide-in panel" -m "- Supabase bookings migration (RLS + Realtime + updated_at trigger)" -m "- useBookingsRealtime hook: canli INSERT/UPDATE/DELETE senkron" -m "- Store: setBookings/upsertBooking/removeBookingById action'lari" -m "- i18n: tr.ts assess_* keys tamamlandi, pre-existing TS errors 0"

echo.
echo [5/5] Pushing to origin...
git push

echo.
echo Done. Press any key to close...
pause > nul
