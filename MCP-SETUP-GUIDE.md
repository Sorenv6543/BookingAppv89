# MCP Configuration Guide

## Current MCP Status

✅ **Working:** GitHub, Context7  
❌ **Not Working:** Supabase, PostgreSQL, Brave Search

## Quick Setup

### Option 1: Temporary (Current Session Only)

```powershell
# Run the setup script
.\setup-mcp-env.ps1
```

Then restart VS Code/Cursor for MCPs to pick up the environment variables.

### Option 2: Permanent (System-wide)

**Windows System Environment Variables:**

1. Press `Win + X` → System → Advanced system settings → Environment Variables
2. Add these **User variables**:

```
SUPABASE_ACCESS_TOKEN = sbp_4347f981d0522ae228c41efaed4cbb690bf85e3c
SUPABASE_DB_URL = postgresql://postgres:MLtNqQfQpiahnymh@db.otmfvzkokrxduipxkyga.supabase.co:5432/postgres
GITHUB_PERSONAL_ACCESS_TOKEN = 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
BRAVE_API_KEY = BSAqG_Ln3kp38vwd8ODru8PJn633hQt
CONTEXT7_API_KEY = your_context7_api_key
```

3. Restart your terminal and editor

### Option 3: PowerShell Profile (Automatic on Shell Start)

```powershell
# Edit your PowerShell profile
notepad $PROFILE

# Add this line:
& "C:\Users\Soren\.claude-worktrees\BookingAppv89\jolly-feynman\setup-mcp-env.ps1"
```

## Testing MCPs

After setting up environment variables and restarting your editor:

```powershell
# Test in PowerShell
$env:SUPABASE_ACCESS_TOKEN  # Should show token
$env:SUPABASE_DB_URL        # Should show connection string
$env:CONTEXT7_API_KEY       # Should show token
```

## Troubleshooting

### Brave Search "Invalid Token" Error

Your Brave API key might be invalid or expired. Get a new one:
1. Visit https://brave.com/search/api/
2. Sign up/login and get a new API key
3. Update `BRAVE_API_KEY` in `.env`

### PostgreSQL Connection Failed

Check:
- Is the password correct in `SUPABASE_DB_URL`?
- Is the Supabase project accessible?
- Run: `Test-NetConnection db.otmfvzkokrxduipxkyga.supabase.co -Port 5432`

### Supabase MCP Disabled

Check `.cursor/mcp.json` - the Supabase server should not have `"disabled": true`

## Security Notes

⚠️ **Important:** The `.env` file contains sensitive credentials and should **never** be committed to git. It's already in `.gitignore`.

🔐 **Rotate credentials** if you've accidentally exposed them in git history.
