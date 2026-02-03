# Quick Start Scripts

This repository includes ready-to-run scripts that automatically set up Node.js, install dependencies, and run the project cleanly with each commit's specific dependencies.

## 📋 Available Scripts

### 1. **setup-and-run.sh** - Quick Setup (Recommended for first-time users)

A simplified script for initial setup and running the project.

```bash
# Setup and run development server
./setup-and-run.sh

# Setup and build
./setup-and-run.sh build

# Setup and run tests
./setup-and-run.sh test
```

**Features:**
- ✅ Checks Node.js installation
- ✅ Installs pnpm if not present
- ✅ Installs project dependencies
- ✅ Runs any npm script

---

### 2. **run-commit.sh** - Advanced Commit Runner

A comprehensive script for testing different commits with clean dependency isolation.

```bash
# Show help
./run-commit.sh --help

# List recent commits
./run-commit.sh --list

# Run build on current commit
./run-commit.sh HEAD build

# Run tests on specific commit
./run-commit.sh abc123 test

# Run command on all commits
./run-commit.sh --all test
```

**Features:**
- ✅ Automatic Node.js setup (installs if missing)
- ✅ Automatic pnpm installation
- ✅ Checkout any commit
- ✅ Clean dependency installation per commit
- ✅ Run any npm script
- ✅ Complete isolation between commits
- ✅ Batch processing for all commits

---

## 🚀 Getting Started

### First Time Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Sorenv6543/BookingAppv89.git
   cd BookingAppv89
   ```

2. **Run the quick setup script:**
   ```bash
   bash setup-and-run.sh
   ```

That's it! The script will:
- Check for Node.js (or tell you where to get it)
- Install pnpm package manager
- Install all project dependencies
- Start the development server

### Running Different Commands

```bash
# Development server
bash setup-and-run.sh dev

# Production build
bash setup-and-run.sh build

# Fast build (skip type checking)
bash setup-and-run.sh build:fast

# Run tests
bash setup-and-run.sh test

# Run tests with coverage
bash setup-and-run.sh test:coverage

# Run linter
bash setup-and-run.sh lint

# Preview production build
bash setup-and-run.sh preview
```

---

## 🔧 Advanced Usage: Testing Multiple Commits

The `run-commit.sh` script is perfect for:
- Testing how different commits behave
- Verifying changes across git history
- Running automated tests on multiple commits
- Ensuring clean builds with commit-specific dependencies

### Examples

**1. Test current commit:**
```bash
bash run-commit.sh HEAD test
```

**2. Build a specific commit:**
```bash
bash run-commit.sh 507c219 build
```

**3. Run tests on all commits:**
```bash
bash run-commit.sh --all test
```

**4. List available commits:**
```bash
bash run-commit.sh --list
```

### How It Works

For each commit, the script:
1. Checks out the specified commit
2. Removes old dependencies (`node_modules`, `dist`, etc.)
3. Installs fresh dependencies from that commit's `package.json`
4. Runs your specified command
5. Reports success or failure

This ensures complete isolation and prevents dependency conflicts between commits.

---

## 📦 What Gets Installed

### Node.js
- Version: 20.19.6 (or your system's installed version)
- If not installed, the script will guide you to install it

### pnpm
- Version: 10.10.0 (as specified in package.json)
- Automatically installed via npm if not present

### Project Dependencies
All dependencies from `package.json`:
- Vue 3.4+
- TypeScript 5.3+
- Vuetify 3
- base
- FullCalendar
- And all dev dependencies (Vite, Vitest, etc.)

---

## 🛠️ Troubleshooting

### "Node.js is not installed"
Download and install Node.js v20 or later from [nodejs.org](https://nodejs.org)

### "Permission denied"
Run the script with bash explicitly:
```bash
bash setup-and-run.sh
# or
bash run-commit.sh --help
```

### "pnpm: command not found"
The scripts will automatically install pnpm. If you see this error, make sure npm is available:
```bash
npm --version
```

### Dependencies fail to install
Try cleaning and reinstalling:
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

## 🎯 Common Workflows

### Daily Development
```bash
# Start developing
bash setup-and-run.sh dev
```

### Before Committing
```bash
# Run linter and tests
bash setup-and-run.sh lint
bash setup-and-run.sh test
```

### Production Build
```bash
# Build for production
bash setup-and-run.sh build
```

### Testing a Bug Fix in an Old Commit
```bash
# List commits to find the one you need
bash run-commit.sh --list

# Test that specific commit
bash run-commit.sh abc123 test
```

### CI/CD Integration
```bash
# Run all commits through tests
bash run-commit.sh --all test

# Or just current commit
bash run-commit.sh HEAD test
```

---

## 📝 Script Options

### setup-and-run.sh Options
```
Usage: ./setup-and-run.sh [COMMAND]

COMMAND: Any npm script from package.json (default: dev)
```

### run-commit.sh Options
```
Usage: ./run-commit.sh [OPTIONS] [COMMIT] [COMMAND]

OPTIONS:
  --list              List recent commits
  --all COMMAND       Run COMMAND on all commits
  --help              Show help message

COMMIT:
  HEAD                Current commit
  <hash>              Specific commit (e.g., abc123)
  <branch>            Branch name

COMMAND:
  dev, build, test, lint, preview, or any npm script
```

---

## 🔐 Environment Variables

The project uses environment variables for configuration. Create a `.env.local` file:

```bash
# base Configuration
VITE_BASE_URL=https://otmfvzkokrxduipxkyga.base.co
VITE_BASE_ANON_KEY=your_anon_key_here

# App Configuration
VITE_APP_NAME="Property Cleaning Scheduler"
VITE_APP_VERSION="2.0.0"
VITE_ENVIRONMENT="development"
```

See `environment-setup.sh` for the template.

---

## 💡 Tips

1. **First time?** Use `setup-and-run.sh` - it's simpler
2. **Testing commits?** Use `run-commit.sh` for clean isolation
3. **Quick build?** Use `build:fast` to skip type checking
4. **Development?** The `dev` command includes hot reload
5. **CI/CD?** Both scripts work great in automated environments

---

## 📚 Additional Resources

- **Main README**: [README.md](README.md)
- **base Setup**: [BASE_SETUP_INSTRUCTIONS.md](BASE_SETUP_INSTRUCTIONS.md)
- **Package Scripts**: Check [package.json](package.json) for all available commands
- **Documentation**: [docs/](docs/)

---

## 🤝 Contributing

When submitting pull requests:
1. Run `bash setup-and-run.sh lint` to check code style
2. Run `bash setup-and-run.sh test` to verify tests pass
3. Run `bash setup-and-run.sh build` to ensure it builds

Or use the commit runner to test your changes:
```bash
bash run-commit.sh HEAD test
bash run-commit.sh HEAD build
```

---

## ⚡ Performance Notes

- First install may take 2-5 minutes (downloading dependencies)
- Subsequent runs are much faster (pnpm caching)
- `run-commit.sh` cleans dependencies between commits for isolation
- Use `setup-and-run.sh` for fastest development workflow

---

**Happy Coding! 🚀**
