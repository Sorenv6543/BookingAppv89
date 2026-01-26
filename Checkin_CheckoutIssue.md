# Check-in/Checkout Issue Analysis - RESOLVED

## Problem Summary (HISTORICAL)
The system previously had conflicting mental models for bookings:
- **Old Database model**: Cleaning window (checkout_date < checkin_date)
- **Homeowner expectation**: Guest stay (arrival < departure)

## Resolution
**Decision:** Change DB model to match hotel booking logic (Solution #2)
**Status:** ✅ RESOLVED via Migration 011

## New System Logic (Current)
| Field | Meaning |
|-------|---------|
| `checkin_date` | When guest arrives (check-in date) - start of stay |
| `checkout_date` | When guest departs (check-out date) - end of stay |

## Database Constraint
```sql
CHECK (checkin_date <= checkout_date)
```
- Allows same-day stays (turn bookings) where dates are equal
- Guests must check in before or on the same day they check out

## Implementation
- **Migration 011**: `supabase/migrations/011_fix_booking_date_constraint.sql`
- **Changed Constraint**: From `checkout_date < checkin_date` to `checkin_date <= checkout_date`
- **Updated Types**: `src/types/booking.ts` comments reflect hotel model
- **Updated Validation**: All form validation and business logic updated
- **Updated Documentation**: `.github/copilot-instructions.md` now describes hotel model

## Booking Types
- **Standard Booking**: Multi-day guest stay (checkin < checkout, different days)
- **Turn Booking**: Same-day guest stay (checkin == checkout, same day but different times)

---

**Last Updated:** 2026-01-26  
**Resolution:** Migration 011 applied, all code updated to hotel booking model
