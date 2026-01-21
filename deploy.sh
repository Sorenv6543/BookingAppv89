#!/bin/bash
# BookingApp v89 - Quick Deployment Script
# This script automates the deployment process

set -e  # Exit on error

echo "🚀 BookingApp v89 - Deployment Script"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}⚠️  Warning: .env.local file not found${NC}"
    echo "Creating from .env.example..."
    
    if [ -f .env.example ]; then
        cp .env.example .env.local
        echo -e "${GREEN}✓${NC} Created .env.local from .env.example"
        echo ""
        echo -e "${YELLOW}Important:${NC} Please edit .env.local and add your Supabase credentials:"
        echo "  - VITE_SUPABASE_URL"
        echo "  - VITE_SUPABASE_ANON_KEY"
        echo ""
        read -p "Press Enter after updating .env.local to continue..."
    else
        echo -e "${RED}✗${NC} .env.example not found. Cannot proceed."
        exit 1
    fi
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}⚠️  pnpm not found. Installing...${NC}"
    npm install -g pnpm
    echo -e "${GREEN}✓${NC} pnpm installed"
fi

# Display deployment options
echo ""
echo "Choose deployment option:"
echo "1. Build only (test locally)"
echo "2. Deploy to Vercel"
echo "3. Deploy to Netlify"
echo "4. Full build + owner-only build"
echo "5. Full build + admin-only build"
echo ""
read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo ""
        echo "Building production version..."
        pnpm install
        pnpm run build:production
        
        echo ""
        echo -e "${GREEN}✓${NC} Build complete!"
        echo ""
        echo "To preview locally, run:"
        echo "  pnpm run preview"
        echo ""
        echo "Then open http://localhost:4173 in your browser"
        ;;
        
    2)
        echo ""
        echo "Deploying to Vercel..."
        
        # Check if Vercel CLI is installed
        if ! command -v vercel &> /dev/null; then
            echo -e "${YELLOW}⚠️  Vercel CLI not found. Installing...${NC}"
            npm install -g vercel
            echo -e "${GREEN}✓${NC} Vercel CLI installed"
        fi
        
        # Build first
        echo "Building production version..."
        pnpm install
        pnpm run build:production
        
        echo ""
        echo -e "${GREEN}✓${NC} Build complete!"
        echo ""
        echo "Deploying to Vercel..."
        vercel --prod
        
        echo ""
        echo -e "${GREEN}✓${NC} Deployment complete!"
        echo ""
        echo "Remember to add environment variables in Vercel:"
        echo "  vercel env add VITE_SUPABASE_URL production"
        echo "  vercel env add VITE_SUPABASE_ANON_KEY production"
        ;;
        
    3)
        echo ""
        echo "Deploying to Netlify..."
        
        # Check if Netlify CLI is installed
        if ! command -v netlify &> /dev/null; then
            echo -e "${YELLOW}⚠️  Netlify CLI not found. Installing...${NC}"
            npm install -g netlify-cli
            echo -e "${GREEN}✓${NC} Netlify CLI installed"
        fi
        
        # Build first
        echo "Building production version..."
        pnpm install
        pnpm run build:production
        
        echo ""
        echo -e "${GREEN}✓${NC} Build complete!"
        echo ""
        echo "Deploying to Netlify..."
        netlify deploy --prod
        
        echo ""
        echo -e "${GREEN}✓${NC} Deployment complete!"
        ;;
        
    4)
        echo ""
        echo "Building full version + owner-only version..."
        pnpm install
        
        echo "Building full version..."
        pnpm run build:production
        
        echo ""
        echo "Building owner-only version..."
        pnpm run build:owner-only
        
        echo ""
        echo -e "${GREEN}✓${NC} Both builds complete!"
        echo ""
        echo "Full build: ./dist/"
        echo "Owner build: ./dist-owner/ (if configured)"
        ;;
        
    5)
        echo ""
        echo "Building full version + admin-only version..."
        pnpm install
        
        echo "Building full version..."
        pnpm run build:production
        
        echo ""
        echo "Building admin-only version..."
        pnpm run build:admin-only
        
        echo ""
        echo -e "${GREEN}✓${NC} Both builds complete!"
        echo ""
        echo "Full build: ./dist/"
        echo "Admin build: ./dist-admin/ (if configured)"
        ;;
        
    *)
        echo -e "${RED}✗${NC} Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "======================================"
echo -e "${GREEN}Deployment script completed!${NC}"
echo "======================================"
