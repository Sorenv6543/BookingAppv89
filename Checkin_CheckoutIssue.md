# Check-in/Checkout Issue Analysis

## Problem Summary
The system has conflicting mental models for bookings:
- **Database model**: Cleaning window (checkout_date < checkin_date)
- **Homeowner expectation**: Guest stay (arrival < departure)

## Current System Logic
| Field | Meaning |
|-------|---------|
| `checkout_date` | When previous guests leave (cleaning window start) |
| `checkin_date` | When new guests arrive (cleaning window end) |

## The Conflict
- Form collects: Guest Arrival → Guest Departure
- Database expects: checkout_date < checkin_date
- These don't align for a single guest stay

## Solutions
1. **Keep DB, fix labels** - Rename to "Previous Guest Checkout" / "Next Guest Checkin"
2. **Change DB model** - Swap constraint to match hotel booking logic
3. **Add transformation layer** - Form collects naturally, swap values before saving

**Note**: Option 2 appears to be the cleanest approach for a guest booking app.
## Recommendation
Clarify whether this is:
- A cleaning scheduling app (keep current DB model)
- A guest booking app (change DB constraint and swap field mapping)
Then implement consistent labeling throughout the codebase.

# It's a guest booking app
