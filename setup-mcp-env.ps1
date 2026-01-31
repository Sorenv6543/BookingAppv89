# Setup MCP Environment Variables
# Run this script to configure environment variables for MCP servers
# Usage: .\setup-mcp-env.ps1

Write-Host "🔧 Setting up MCP environment variables..." -ForegroundColor Cyan

# Load from .env file
$envFile = ".env.local"
if (Test-Path $envFile) {
    $envVars = @{}
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^([^#][^=]+)=(.+)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            $envVars[$name] = $value
        }
    }
    
    # Set environment variables for current session
    $envVars.Keys | ForEach-Object {
        [Environment]::SetEnvironmentVariable($_, $envVars[$_], "Process")
        Write-Host "  ✓ Set $($_)" -ForegroundColor Green
    }
    
    Write-Host "`n✅ Environment variables loaded successfully!" -ForegroundColor Green
    Write-Host "`n📝 Note: These are set for the current PowerShell session only." -ForegroundColor Yellow
    Write-Host "   To make them permanent, add them to your system environment variables." -ForegroundColor Yellow
    Write-Host "`n🔄 Restart VS Code/Cursor for MCPs to use the new variables." -ForegroundColor Cyan
} else {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    exit 1
}

# Verify critical MCP variables
Write-Host "`n🔍 Verifying MCP-required variables:" -ForegroundColor Cyan
$requiredVars = @(
    "SUPABASE_ACCESS_TOKEN",
    "SUPABASE_DB_URL",
    "GITHUB_PERSONAL_ACCESS_TOKEN",
    "BRAVE_API_KEY"
)

$allSet = $true
foreach ($var in $requiredVars) {
    $value = [Environment]::GetEnvironmentVariable($var, "Process")
    if ($value) {
        $maskedValue = $value.Substring(0, [Math]::Min(10, $value.Length)) + "..."
        Write-Host "  ✓ $var = $maskedValue" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $var = (not set)" -ForegroundColor Red
        $allSet = $false
    }
}

if ($allSet) {
    Write-Host "`n✨ All MCP variables are configured!" -ForegroundColor Green
} else {
    Write-Host "`n⚠️  Some variables are missing. Check your .env file." -ForegroundColor Yellow
}
