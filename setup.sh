#!/bin/bash

# Setup and Run Script for BFHL Project

echo "🚀 BFHL Project Setup"
echo "===================="
echo ""

# Check Node.js installation
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Setup Backend
echo "📦 Setting up Backend..."
cd backend
npm install
echo "✅ Backend dependencies installed"
echo ""

# Run tests
echo "🧪 Running Backend Tests..."
node test.js
echo ""

# Update user info
echo "📝 Important: Update your credentials in backend/processor.js:"
echo "   - user_id (format: fullname_ddmmyyyy)"
echo "   - email_id (your college email)"
echo "   - college_roll_number (your roll number)"
echo ""

# Return to root
cd ..

echo "✨ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Update your credentials in backend/processor.js"
echo "2. Start backend: cd backend && npm start"
echo "3. In another terminal, start frontend: cd frontend && npx http-server -p 3000"
echo "4. Open http://localhost:3000 in your browser"
echo ""
