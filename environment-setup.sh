# .env.local - Create this file in your project root
# NEVER commit this file - it contains sensitive credentials

# Supabase Configuration
# Get these values from your Supabase project settings
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-anon-key>

# App Configuration
VITE_APP_NAME="Property Cleaning Scheduler"
VITE_APP_VERSION="2.0.0"
VITE_ENVIRONMENT="production"

# Optional: For development debugging
VITE_DEBUG_AUTH=false
VITE_DEBUG_RLS=false