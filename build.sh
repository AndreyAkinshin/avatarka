#!/bin/bash

set -e

echo "========================================="
echo "  Avatarka Build Script"
echo "========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${YELLOW}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Step 1: Install dependencies
print_step "Installing dependencies..."
pnpm install
print_success "Dependencies installed"
echo ""

# Step 2: Clean previous builds
print_step "Cleaning previous builds..."
pnpm clean
print_success "Previous builds cleaned"
echo ""

# Step 3: Build all packages
print_step "Building all packages..."
pnpm build
print_success "All packages built"
echo ""

# Step 4: Type checking
print_step "Running TypeScript type checks..."
pnpm exec tsc --noEmit -p packages/avatarka/tsconfig.json
pnpm exec tsc --noEmit -p packages/avatarka-react/tsconfig.json
pnpm exec tsc --noEmit -p apps/demo/tsconfig.json
print_success "Type checks passed"
echo ""

# Step 5: Build static website
print_step "Building static website..."
cd apps/demo
pnpm build
cd ../..
print_success "Static website built to apps/demo/dist/"
echo ""

echo "========================================="
echo -e "${GREEN}  Build completed successfully!${NC}"
echo "========================================="
echo ""
echo "Static website is available at: apps/demo/dist/"
echo "You can preview it with: cd apps/demo && pnpm preview"



