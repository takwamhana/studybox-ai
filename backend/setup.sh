#!/bin/bash

# StudyBox AI Backend - Quick Start Setup
# Run this script to set up the backend environment

echo "🚀 StudyBox AI Backend - Quick Setup"
echo "===================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Navigate to backend
cd "$(dirname "$0")" || exit

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Check if .env exists
if [ ! -f .env ]; then
    echo ""
    echo "📋 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env with your configuration:"
    echo "   - MONGODB_URI"
    echo "   - OPENAI_API_KEY"
    echo "   - FRONTEND_URL"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "  1. Configure .env with your credentials"
echo "  2. Ensure MongoDB is running"
echo "  3. Run: npm run dev"
echo ""
echo "📖 For more details, see README.md"
