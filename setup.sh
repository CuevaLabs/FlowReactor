#!/bin/bash

echo "🚀 Setting up your Whop app..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from template..."
    cp .env.example .env.local
    echo "✅ Created .env.local - please fill in your actual values from the Whop dashboard"
else
    echo "✅ .env.local already exists"
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    if command -v pnpm &> /dev/null; then
        pnpm install
    elif command -v npm &> /dev/null; then
        npm install
    else
        echo "❌ Please install Node.js and npm/pnpm first"
        exit 1
    fi
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "🎉 Setup complete! Next steps:"
echo "1. Fill in your environment variables in .env.local"
echo "2. Create a Whop app in your dashboard"
echo "3. Run 'pnpm dev' to start the development server"
echo ""
echo "📚 See SETUP.md for detailed instructions"
