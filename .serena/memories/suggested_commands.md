# Property Cleaning Scheduler - Essential Commands

## Development Commands

### Daily Development
```bash
# Start development server (localhost:3000)
npm run dev

# Run linting with auto-fix
npm run lint

# Run all unit tests
npm run test

# Run tests with UI interface
npm run test:ui

# Run single test file
npm run test -- path/to/test.spec.ts
```

### Build Commands
```bash
# Full production build with type checking
npm run build

# Quick build without type checking (for development)
npm run build:fast

# Production build with environment variable
npm run build:production

# Role-specific builds
npm run build:owner-only
npm run build:admin-only

# PWA-optimized build
npm run build:pwa
```

### Testing Commands
```bash
# Unit tests (Vitest)
npm run test                    # Watch mode
npm run test:run               # Run once  
npm run test:coverage         # With coverage report
npm run test:ui               # Visual test interface

# Performance tests
npm run test:performance      # Performance regression tests
npm run test:performance:watch # Watch mode for performance tests

# PWA tests  
npm run test:pwa             # PWA-specific test suite

# E2E tests (Playwright) - Currently configured but webServer disabled
# npx playwright test         # Run E2E tests
# npx playwright test --ui    # Interactive mode
```

### Analysis & Performance
```bash
# Bundle analysis
npm run analyze:bundle        # Visualize bundle composition
npm run perf:bundle          # Bundle performance analysis

# Performance monitoring
npm run perf:analysis        # Complete performance analysis
npm run perf:report          # Generate performance report
npm run perf:regression      # Performance regression testing
npm run perf:monitor         # PWA performance monitoring

# PWA optimization
npm run analyze:pwa          # PWA analysis
npm run perf:imports         # Import optimization analysis
```

### Preview & Development
```bash
# Preview production build
npm run preview               # Standard preview (port 4173)
npm run preview:production   # Production mode preview
npm run preview:pwa          # PWA preview with host access

# MCP Browser Tools (for development)
npm run mcp:browser-tools     # Start browser tools MCP server
npm run mcp:browser-tools:test # Test browser tools integration
```

## Windows-Specific Commands

### File System Operations
```powershell
# List directory contents
Get-ChildItem                 # PowerShell equivalent of ls
dir                          # Windows command prompt

# Search for files
Get-ChildItem -Recurse -Filter "*.vue" # Find Vue files recursively
Select-String -Pattern "text" -Path "*.ts" # Grep equivalent

# Change directory
cd path\to\directory         # Change directory
Set-Location path\to\directory # PowerShell alternative
```

### Git Operations
```bash
git status                   # Check working directory status
git add .                    # Stage all changes
git commit -m "message"      # Commit with message
git pull origin main         # Pull latest changes
git push origin branch-name  # Push to remote branch
```

### Package Management
```bash
# PNPM (preferred package manager)
pnpm install                 # Install dependencies
pnpm add package-name        # Add new dependency
pnpm add -D package-name     # Add dev dependency
pnpm update                  # Update all packages

# Alternative with npm
npm install                  # Install dependencies
npm run script-name          # Run npm script
```

## Quality Assurance Commands

### Before Committing
```bash
# Essential pre-commit workflow
npm run lint                 # Fix linting issues
npm run test:run            # Run all tests once
npm run build               # Ensure production build works
```

### Full Quality Check
```bash
# Complete quality validation
npm run lint &&             # Lint code
npm run test:run &&         # Run all tests  
npm run test:coverage &&    # Check test coverage
npm run build              # Validate production build
```

### Performance Validation
```bash
# Performance validation workflow
npm run perf:regression &&   # Check for performance regressions
npm run perf:analysis       # Generate performance report
```

## Development Workflow Commands

### Component Development
```bash
# Test specific component
npm run test -- components/ComponentName.spec.ts

# Watch component tests
npm run test components/ComponentName.spec.ts
```

### Feature Development
```bash
# Role-based development workflow
npm run test -- owner/       # Test owner features
npm run test -- admin/       # Test admin features
npm run build:owner-only     # Build owner-only bundle
npm run build:admin-only     # Build admin-only bundle
```

### Database & Backend
```bash
# Supabase CLI commands (if supabase CLI installed)
# supabase start              # Start local supabase
# supabase migration new name # Create new migration  
# supabase db push            # Push migrations to remote
```

## Troubleshooting Commands

### Common Issues
```bash
# Clear node_modules and reinstall
Remove-Item -Recurse -Force node_modules # PowerShell
pnpm install                            # Reinstall dependencies

# Clear build cache
Remove-Item -Recurse -Force dist        # Remove build directory
Remove-Item -Recurse -Force dev-dist    # Remove dev build directory

# Reset TypeScript cache
npx tsc --build --clean                 # Clear TypeScript cache
```

### Development Server Issues
```bash
# Kill processes on port 3000 (if dev server stuck)
netstat -ano | findstr :3000           # Find process on port
taskkill /PID <process_id> /F           # Kill process by PID

# Alternative dev server start with port specification
npm run dev -- --port 3001             # Use different port
```